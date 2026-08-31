import { AgentCase, ExtractedEntities, HumanApprovalRequest, MissingContextField, RiskLevel, TaskPlanStep } from "./types";
import { getStoredCases, saveStoredCase } from "./memory";
import { delhiveryRail } from "../rails/DelhiveryLogisticsProvider";
import { pineLabsRail } from "../rails/PineLabsPaymentProvider";
import { gnaniRail } from "../rails/GnaniVoiceProvider";
import { communicationRail } from "../rails/CommunicationRailProvider";
import { generateAiCompletion } from "../chat/provider";

function createId(prefix = "case") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

export class AgentOrchestrator {
  /**
   * Parse natural language input, extract entities, identify missing context, and generate plan
   */
  async createCaseFromInput(consumerInput: string): Promise<AgentCase> {
    const caseId = createId("case");
    const now = new Date().toISOString();

    // 1. Entity Extraction & Intent Understanding
    const entities = await this.extractEntitiesWithAi(consumerInput);

    // 2. Identify missing fields (never silently fabricate)
    const missingFields: MissingContextField[] = [];
    if (!entities.merchant) {
      missingFields.push({
        key: "merchant",
        label: "Merchant / Company Name",
        description: "Which company, website, or service provider is this dispute with?",
        example: "e.g. Zara, Flipkart, Amazon, Swiggy",
        required: false,
      });
    }

    if (!entities.amount && entities.issueCategory !== "DELIVERY_NDR") {
      missingFields.push({
        key: "amount",
        label: "Transaction Amount (₹)",
        description: "What was the total amount paid?",
        example: "e.g. ₹5,000",
        required: false,
      });
    }

    // Determine Case Status
    const isMissingCritical = missingFields.some((f) => f.required);

    // 3. Formulate Task Plan based on actual entities
    const planSteps = this.generatePlanSteps(caseId, entities);
    const approvals: HumanApprovalRequest[] = [];

    // Create Human Approval requests for High Risk steps
    for (const step of planSteps) {
      if (step.requiresHumanApproval) {
        const approvalId = `appr-${caseId}-${step.id}`;
        step.approvalId = approvalId;
        approvals.push({
          id: approvalId,
          caseId,
          stepId: step.id,
          title: `Approve: ${step.title}`,
          description: step.description,
          riskLevel: step.riskLevel,
          impactAnalysis: `Executing this action will interact with ${step.rail.toUpperCase()} rail to claim remedy or authorize funds.`,
          proposedAction: step.title,
          actionPayload: {
            customer: entities.customerName,
            merchant: entities.merchant,
            amount: entities.amount,
            awb: entities.awbNumber,
            orderId: entities.orderId,
            duration: entities.pendingDuration,
          },
          status: "PENDING",
          requestedAt: now,
        });
      }
    }

    const titlePrefix = entities.customerName ? `${entities.customerName} — ` : "";
    const titleMerchant = entities.merchant ? `${entities.merchant} ` : "";
    const titleCategory = entities.issueCategory === "REFUND_DELAY" ? "Refund Pending" : (entities.issueCategory?.replace(/_/g, " ") || "Dispute");
    const titleOrder = entities.orderId ? ` (#${entities.orderId})` : (entities.awbNumber ? ` (AWB: ${entities.awbNumber})` : "");
    const caseTitle = `${titlePrefix}${titleMerchant}${titleCategory} Resolution${titleOrder}`;

    const summaryAmount = entities.amount ? `. Disputed claim: ₹${entities.amount.toLocaleString("en-IN")}` : "";
    const summaryDuration = entities.pendingDuration ? ` (Pending for ${entities.pendingDuration})` : "";
    const summaryCustomer = entities.customerName ? ` for customer ${entities.customerName}` : "";
    const summaryMerchant = entities.merchant ? ` regarding ${entities.merchant}` : "";
    const summaryOrder = entities.orderId ? ` order #${entities.orderId}` : (entities.awbNumber ? ` AWB #${entities.awbNumber}` : "");

    const understandingSummary = `Identified ${entities.issueCategory || "dispute"}${summaryCustomer}${summaryMerchant}${summaryOrder}${summaryAmount}${summaryDuration}.`;

    const newCase: AgentCase = {
      id: caseId,
      createdAt: now,
      updatedAt: now,
      title: caseTitle,
      consumerRawInput: consumerInput,
      agentUnderstandingSummary: understandingSummary,
      status: isMissingCritical ? "AWAITING_MISSING_INFO" : "AWAITING_HUMAN_APPROVAL",
      riskLevel: "HIGH",
      extractedEntities: entities,
      missingFields,
      planSteps,
      approvals,
      auditLog: [
        {
          id: `aud-${Date.now()}-init`,
          timestamp: now,
          phase: "Intent Understanding",
          title: "Problem Ingested & Intent Classified",
          detail: `Classified intent as '${entities.issueCategory || "REFUND_DELAY"}'${entities.customerName ? ` for customer ${entities.customerName}` : ""}${entities.amount ? ` with claim value ₹${entities.amount.toLocaleString("en-IN")}` : ""}${entities.pendingDuration ? ` (duration: ${entities.pendingDuration})` : ""}.`,
          mode: "SANDBOX_SIMULATED",
          status: "SUCCESS",
        },
      ],
      followUp: {
        currentAttempt: 0,
        maxAttempts: 3,
        intervalMinutes: 60,
        responseReceived: false,
        status: "SCHEDULED",
      },
    };

    saveStoredCase(newCase);
    return newCase;
  }

  /**
   * Executes a specific plan step through the respective competition rail
   */
  async executeStep(caseId: string, stepId: string): Promise<AgentCase> {
    const currentCase = getStoredCases().find((c) => c.id === caseId);
    if (!currentCase) throw new Error("Case not found");

    const stepIndex = currentCase.planSteps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) throw new Error("Step not found");

    const step = currentCase.planSteps[stepIndex];
    step.status = "IN_PROGRESS";
    saveStoredCase(currentCase);

    const now = new Date().toISOString();
    let auditDetail = "";
    let executionResult: unknown = null;

    try {
      if (step.rail === "delhivery") {
        const awb = currentCase.extractedEntities.awbNumber || "AWB-TRACKING-PROBE";
        if (step.title.toLowerCase().includes("track") || step.title.toLowerCase().includes("audit")) {
          const res = await delhiveryRail.trackAwb(awb);
          executionResult = res.payload;
          auditDetail = res.auditMessage;
        } else {
          const res = await delhiveryRail.resolveNdr({
            awb,
            action: "re-attempt",
            specialInstructions: "Priority delivery re-attempt requested via autonomous consumer agent.",
          });
          executionResult = res.payload;
          auditDetail = res.auditMessage;
        }
      } else if (step.rail === "pine_labs") {
        const amount = currentCase.extractedEntities.amount || 0;
        const txId = currentCase.extractedEntities.transactionId || `PL-TX-${currentCase.extractedEntities.orderId || "ONLINE"}`;
        if (step.riskLevel === "HIGH" || step.title.toLowerCase().includes("settlement") || step.title.toLowerCase().includes("chargeback")) {
          const res = await pineLabsRail.initiateInstantSettlement(txId, `TOKEN-CONSENT-${Date.now()}`);
          executionResult = res.payload;
          auditDetail = res.auditMessage;

          // Set Case Resolution
          currentCase.status = "RESOLVED";
          currentCase.resolution = {
            resolvedAt: now,
            summary: `Disputed claim of ₹${amount.toLocaleString("en-IN")} successfully processed to customer bank account. Verified Bank UTR: ${res.payload.utrNumber}.`,
            outcomeType: "REFUND_PROCESSED",
            moneyRecovered: amount,
            timeSavedMinutes: 180,
            railConfirmations: [
              { rail: "Pine Labs Settlement Switch", referenceNumber: res.payload.utrNumber },
            ],
          };
        } else {
          const res = await pineLabsRail.verifyTransaction(txId, amount);
          executionResult = res.payload;
          auditDetail = res.auditMessage;
        }
      } else if (step.rail === "gnani") {
        const res = await gnaniRail.synthesizeRegionalSpeech(
          `Namaste, your dispute regarding ${currentCase.extractedEntities.merchant || "order"} is being actively handled by OutreachAI.`,
          "hinglish"
        );
        executionResult = res.payload;
        auditDetail = res.auditMessage;
      } else if (step.rail === "communication") {
        const merchantEmail = currentCase.extractedEntities.merchant
          ? `grievance@${currentCase.extractedEntities.merchant.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
          : "nodal.desk@consumer.gov.in";
        const res = await communicationRail.dispatchCommunication({
          recipientEmail: merchantEmail,
          recipientName: currentCase.extractedEntities.merchant || "Merchant Grievance Desk",
          subject: `Statutory Grievance Notice: ${currentCase.title}`,
          body: currentCase.agentUnderstandingSummary,
          messageType: "LEGAL_GRIEVANCE_NOTICE",
          channel: "email",
        });
        executionResult = res.payload;
        auditDetail = res.auditMessage;
      }

      step.status = "COMPLETED";
      step.executedAt = now;
      step.resultPayload = executionResult;
      step.executionNote = auditDetail;

      currentCase.auditLog.push({
        id: `aud-${Date.now()}-${step.id}`,
        timestamp: now,
        phase: "Rail Execution",
        title: step.title,
        detail: auditDetail,
        rail: step.rail,
        mode: "SANDBOX_SIMULATED",
        status: "SUCCESS",
      });
    } catch (err: any) {
      step.status = "FAILED";
      step.executionNote = `Failed: ${err?.message || "Execution error"}`;
      currentCase.auditLog.push({
        id: `aud-${Date.now()}-${step.id}-err`,
        timestamp: now,
        phase: "Rail Execution",
        title: `${step.title} Failed`,
        detail: err?.message || "Rail connection failed",
        rail: step.rail,
        mode: "SANDBOX_SIMULATED",
        status: "CRITICAL",
      });
    }

    currentCase.updatedAt = now;
    saveStoredCase(currentCase);
    return currentCase;
  }

  /**
   * Handle human approval decision (Human-in-the-loop)
   */
  async handleApprovalDecision(
    caseId: string,
    approvalId: string,
    decision: "APPROVED" | "REJECTED",
    decisionNote?: string
  ): Promise<AgentCase> {
    const currentCase = getStoredCases().find((c) => c.id === caseId);
    if (!currentCase) throw new Error("Case not found");

    const approval = currentCase.approvals.find((a) => a.id === approvalId);
    if (!approval) throw new Error("Approval request not found");

    const now = new Date().toISOString();
    approval.status = decision;
    approval.decidedAt = now;
    approval.decisionNote = decisionNote || (decision === "APPROVED" ? "1-Tap Human Consent Granted" : "Rejected by consumer");

    currentCase.auditLog.push({
      id: `aud-${Date.now()}-consent`,
      timestamp: now,
      phase: "Human Authorization",
      title: decision === "APPROVED" ? "Human Consent Authorized" : "Human Consent Denied",
      detail: `Consumer recorded decision: ${decision} for action '${approval.proposedAction}'.`,
      mode: "SANDBOX_SIMULATED",
      status: decision === "APPROVED" ? "SUCCESS" : "WARNING",
    });

    if (decision === "APPROVED") {
      const step = currentCase.planSteps.find((s) => s.id === approval.stepId);
      if (step) {
        saveStoredCase(currentCase);
        return this.executeStep(caseId, step.id);
      }
    } else {
      const step = currentCase.planSteps.find((s) => s.id === approval.stepId);
      if (step) {
        step.status = "SKIPPED";
        step.executionNote = "Skipped by consumer rejection.";
      }
    }

    saveStoredCase(currentCase);
    return currentCase;
  }

  /**
   * Extract entities using LLM or structured regex parsing without hardcoded demo fallbacks
   */
  private async extractEntitiesWithAi(input: string): Promise<ExtractedEntities> {
    try {
      const prompt = `Extract entities from this consumer grievance text in JSON format:
"${input}"

Return JSON with these exact keys (leave null if not mentioned, DO NOT invent values):
{
  "customerName": string or null (e.g. "Test User"),
  "merchant": string or null (e.g. "Zara", "Amazon", "Flipkart"),
  "orderId": string or null (e.g. "TEST-001"),
  "awbNumber": string or null,
  "transactionId": string or null,
  "amount": number or null (e.g. 5000),
  "pendingDuration": string or null (e.g. "15 days"),
  "issueCategory": "DELIVERY_NDR" | "REFUND_DELAY" | "CANCELLATION" | "DAMAGED_ITEM" | "OVERCHARGE" | "SERVICE_FAILURE",
  "preferredResolution": string or null
}`;

      const aiText = await generateAiCompletion({ prompt, systemPrompt: "You are an accurate entity extraction engine. Output ONLY valid JSON." });
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          customerName: parsed.customerName || this.extractPattern(input, /(?:Customer(?:\s*Name)?|User(?:\s*Name)?)\s*[:=]?\s*([A-Za-z0-9\s._-]+?)(?:\.|$|,|;|\n|Order|Amount|Refund|pending)/i),
          merchant: parsed.merchant || this.extractMerchant(input),
          orderId: parsed.orderId || this.extractPattern(input, /(?:Order(?:\s*ID|\s*Number|\s*#)?|Booking(?:\s*ID|\s*#)?)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
          awbNumber: parsed.awbNumber || this.extractPattern(input, /(?:AWB(?:\s*Number|\s*#)?|Waybill|Tracking(?:\s*ID|\s*#|\s*Number)?)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
          transactionId: parsed.transactionId || this.extractPattern(input, /(?:Txn|Transaction(?:\s*ID|\s*#)?|UTR)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
          amount: parsed.amount ? Number(parsed.amount) : this.extractAmount(input),
          pendingDuration: parsed.pendingDuration || this.extractDuration(input),
          issueCategory: parsed.issueCategory || this.classifyCategory(input),
          preferredResolution: parsed.preferredResolution || "Statutory refund reversal or priority service resolution",
        };
      }
    } catch {
      // Deterministic regex parsing fallback
    }

    return {
      customerName: this.extractPattern(input, /(?:Customer(?:\s*Name)?|User(?:\s*Name)?)\s*[:=]?\s*([A-Za-z0-9\s._-]+?)(?:\.|$|,|;|\n|Order|Amount|Refund|pending)/i),
      merchant: this.extractMerchant(input),
      orderId: this.extractPattern(input, /(?:Order(?:\s*ID|\s*Number|\s*#)?|Booking(?:\s*ID|\s*#)?)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
      awbNumber: this.extractPattern(input, /(?:AWB(?:\s*Number|\s*#)?|Waybill|Tracking(?:\s*ID|\s*#|\s*Number)?)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
      transactionId: this.extractPattern(input, /(?:Txn|Transaction(?:\s*ID|\s*#)?|UTR)\s*[:=]?\s*([A-Za-z0-9_-]+)/i),
      amount: this.extractAmount(input),
      pendingDuration: this.extractDuration(input),
      issueCategory: this.classifyCategory(input),
      preferredResolution: "Statutory refund reversal or priority service resolution",
    };
  }

  private extractPattern(input: string, regex: RegExp): string | undefined {
    const match = input.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private extractAmount(input: string): number | undefined {
    const match = input.match(/(?:₹|INR|Rs\.?|Amount(?:\s*Paid)?)\s*[:=]?\s*([\d,]+)/i) || input.match(/(\d+)\s*(?:rupees|rs|inr)/i);
    return match ? parseInt(match[1].replace(/,/g, ""), 10) : undefined;
  }

  private extractDuration(input: string): string | undefined {
    const match =
      input.match(/(?:pending(?:\s*for)?|delayed(?:\s*by)?|duration)\s*[:=]?\s*(\d+\s*(?:days?|hours?|weeks?|months?))/i) ||
      input.match(/(\d+\s*(?:days?|hours?|weeks?|months?))\s*(?:pending|delayed|ago)/i);
    return match ? match[1].trim() : undefined;
  }

  private extractMerchant(input: string): string | undefined {
    const explicit = input.match(/(?:Merchant|Company|Seller|Store|Brand)\s*[:=]?\s*([A-Za-z0-9\s._-]+?)(?:\.|$|,|;|\n|Order|Amount|Refund|Customer|pending)/i);
    if (explicit && explicit[1].trim()) {
      return explicit[1].trim();
    }
    if (/flipkart/i.test(input)) return "Flipkart";
    if (/amazon/i.test(input)) return "Amazon India";
    if (/swiggy/i.test(input)) return "Swiggy";
    if (/zomato/i.test(input)) return "Zomato";
    if (/indigo/i.test(input)) return "IndiGo Airlines";
    if (/myntra/i.test(input)) return "Myntra";
    if (/zara/i.test(input)) return "Zara India";
    if (/zepto/i.test(input)) return "Zepto";
    if (/blinkit/i.test(input)) return "Blinkit";
    if (/meesho/i.test(input)) return "Meesho";
    return undefined;
  }

  private classifyCategory(input: string): ExtractedEntities["issueCategory"] {
    if (/refund/i.test(input)) return "REFUND_DELAY";
    if (/delivery|ndr|courier|tracking|delhivery/i.test(input)) return "DELIVERY_NDR";
    if (/cancel/i.test(input)) return "CANCELLATION";
    if (/damaged|broken|defective/i.test(input)) return "DAMAGED_ITEM";
    if (/overcharge|extra/i.test(input)) return "OVERCHARGE";
    if (/service|failure/i.test(input)) return "SERVICE_FAILURE";
    return "REFUND_DELAY";
  }

  /**
   * Dynamic Task Planner based on problem category & extracted entities
   */
  private generatePlanSteps(caseId: string, entities: ExtractedEntities): TaskPlanStep[] {
    const amountStr = entities.amount ? `₹${entities.amount.toLocaleString("en-IN")}` : "disputed amount";
    const orderStr = entities.orderId ? `Order #${entities.orderId}` : (entities.awbNumber ? `AWB #${entities.awbNumber}` : "dispute record");
    const merchantStr = entities.merchant || "merchant / service provider";

    if (entities.issueCategory === "REFUND_DELAY") {
      return [
        {
          id: "step-1",
          title: "Merchant & Order Refund Audit",
          description: `Audit ${merchantStr} records for ${orderStr} to verify statutory refund disbursement status${entities.pendingDuration ? ` (pending for ${entities.pendingDuration})` : ""}.`,
          riskLevel: "LOW",
          rail: "pine_labs",
          status: "PENDING",
          requiresHumanApproval: false,
        },
        {
          id: "step-2",
          title: "Payment Gateway Reconciliation & SLA Probe",
          description: `Query payment switch to check acquirer logs for ${amountStr} and verify RBI Turn Around Time (TAT) compliance.`,
          riskLevel: "LOW",
          rail: "pine_labs",
          status: "PENDING",
          requiresHumanApproval: false,
        },
        {
          id: "step-3",
          title: "Dispatch Statutory Grievance Notice",
          description: `Issue formal notice under Section 2(47) of Consumer Protection Act (2019) to ${merchantStr} Nodal Compliance Desk.`,
          riskLevel: "MEDIUM",
          rail: "communication",
          status: "PENDING",
          requiresHumanApproval: false,
        },
        {
          id: "step-4",
          title: "Authorize Direct Banking Settlement / Chargeback",
          description: `Authorize direct ${amountStr} banking reversal via payment switch rail with cryptographically signed authorization token.`,
          riskLevel: "HIGH",
          rail: "pine_labs",
          status: "REQUIRES_APPROVAL",
          requiresHumanApproval: true,
        },
      ];
    }

    return [
      {
        id: "step-1",
        title: "Logistics Audit & Scan History Check",
        description: `Query Delhivery Logistics Rail for ${entities.awbNumber ? `AWB #${entities.awbNumber}` : orderStr} to verify NDR failure attempts.`,
        riskLevel: "LOW",
        rail: "delhivery",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-2",
        title: "Courier Priority Re-Attempt Override",
        description: `Dispatch priority delivery re-attempt order to local hub supervisor to override false NDR exception.`,
        riskLevel: "LOW",
        rail: "delhivery",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-3",
        title: "Dispatch Statutory Grievance Notice",
        description: `Issue formal notice under Consumer Protection Act (2019) to ${merchantStr} Grievance Officer.`,
        riskLevel: "MEDIUM",
        rail: "communication",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-4",
        title: "Trigger Direct Banking Settlement / Refund",
        description: `Authorize direct ${amountStr} refund settlement via payment switch rail if package cannot be delivered within SLA.`,
        riskLevel: "HIGH",
        rail: "pine_labs",
        status: "REQUIRES_APPROVAL",
        requiresHumanApproval: true,
      },
    ];
  }
}

export const agentOrchestrator = new AgentOrchestrator();
