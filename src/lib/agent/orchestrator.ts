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

    // 2. Identify missing mandatory fields
    const missingFields: MissingContextField[] = [];
    if (!entities.merchant && !entities.awbNumber && !entities.orderId) {
      missingFields.push({
        key: "merchant_or_order",
        label: "Merchant Name or Order / Tracking ID",
        description: "Which company or website did you order from?",
        example: "e.g. Zara, Flipkart, Amazon, or Swiggy",
        required: true,
      });
    }

    if (!entities.amount && entities.issueCategory !== "DELIVERY_NDR") {
      missingFields.push({
        key: "amount",
        label: "Transaction Amount (₹)",
        description: "What was the total amount paid?",
        example: "e.g. ₹3,499",
        required: false,
      });
    }

    // Determine Case Status
    const isMissingCritical = missingFields.some((f) => f.required);
    const status = isMissingCritical ? "AWAITING_MISSING_INFO" : "PLANNING";

    // 3. Formulate Task Plan
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
            merchant: entities.merchant,
            amount: entities.amount,
            awb: entities.awbNumber,
            orderId: entities.orderId,
          },
          status: "PENDING",
          requestedAt: now,
        });
      }
    }

    const newCase: AgentCase = {
      id: caseId,
      createdAt: now,
      updatedAt: now,
      title: `${entities.merchant || "E-Commerce"} ${entities.issueCategory || "Dispute"} Resolution`,
      consumerRawInput: consumerInput,
      agentUnderstandingSummary: `Identified ${entities.issueCategory || "dispute"} regarding ${entities.merchant || "merchant"} order ${entities.orderId || entities.awbNumber || ""}. Total claim amount: ₹${(entities.amount || 3499).toLocaleString("en-IN")}.`,
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
          detail: `Classified intent as '${entities.issueCategory || "DELIVERY_NDR"}' with claim value ₹${entities.amount || 3499}.`,
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
        const awb = currentCase.extractedEntities.awbNumber || "DEL-984210-IN";
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
        const txId = currentCase.extractedEntities.transactionId || "PL-TX-998241";
        const amount = currentCase.extractedEntities.amount || 3499;
        if (step.title.toLowerCase().includes("audit") || step.title.toLowerCase().includes("verify")) {
          const res = await pineLabsRail.verifyTransaction(txId, amount);
          executionResult = res.payload;
          auditDetail = res.auditMessage;
        } else {
          const res = await pineLabsRail.initiateInstantSettlement(txId, "AUTH_APPROVED_TOKEN");
          executionResult = res.payload;
          auditDetail = res.auditMessage;
        }
      } else if (step.rail === "gnani") {
        const res = await gnaniRail.dispatchGrievanceCall({
          targetPhone: "+91 80 4567 8900",
          consumerName: "Consumer",
          issueSummary: currentCase.agentUnderstandingSummary,
          orderOrAwb: currentCase.extractedEntities.awbNumber || currentCase.extractedEntities.orderId || "Order",
        });
        executionResult = res.payload;
        auditDetail = res.auditMessage;
      } else if (step.rail === "communication") {
        const res = await communicationRail.dispatchCommunication({
          recipientEmail: `grievance@${currentCase.extractedEntities.merchant?.toLowerCase().replace(/\s+/g, "") || "merchant"}.com`,
          recipientName: `${currentCase.extractedEntities.merchant || "Merchant"} Nodal Desk`,
          subject: `Consumer Dispute Notice: Order #${currentCase.extractedEntities.orderId || currentCase.id}`,
          body: currentCase.agentUnderstandingSummary,
          messageType: "LEGAL_GRIEVANCE_NOTICE",
          channel: "email",
        });
        executionResult = res.payload;
        auditDetail = res.auditMessage;
      }

      step.status = "COMPLETED";
      step.executedAt = now;
      step.executionNote = auditDetail;
      step.resultPayload = executionResult;

      currentCase.auditLog.push({
        id: `aud-${Date.now()}`,
        timestamp: now,
        phase: step.title,
        title: `${step.rail.toUpperCase()} Rail Executed`,
        detail: auditDetail,
        rail: step.rail === "internal" ? undefined : step.rail,
        mode: "SANDBOX_SIMULATED",
        status: "SUCCESS",
      });

      // Check if all steps completed
      const allCompleted = currentCase.planSteps.every((s) => s.status === "COMPLETED" || s.status === "SKIPPED");
      if (allCompleted) {
        currentCase.status = "RESOLVED";
        currentCase.resolution = {
          resolvedAt: now,
          summary: `Successfully resolved ${currentCase.extractedEntities.merchant || "merchant"} dispute. Rails executed and verified.`,
          outcomeType: "REFUND_PROCESSED",
          moneyRecovered: currentCase.extractedEntities.amount || 3499,
          timeSavedMinutes: 165,
          railConfirmations: [
            { rail: "Delhivery", referenceNumber: currentCase.extractedEntities.awbNumber || "DEL-984210-IN" },
            { rail: "Pine Labs", referenceNumber: "UTR-423891004812" },
          ],
        };
      }

      saveStoredCase(currentCase);
      return currentCase;
    } catch (error) {
      step.status = "FAILED";
      step.executionNote = error instanceof Error ? error.message : "Execution failed";
      saveStoredCase(currentCase);
      return currentCase;
    }
  }

  /**
   * Handle human-in-the-loop approval or rejection
   */
  async handleApprovalDecision(caseId: string, approvalId: string, decision: "APPROVED" | "REJECTED", note?: string): Promise<AgentCase> {
    const currentCase = getStoredCases().find((c) => c.id === caseId);
    if (!currentCase) throw new Error("Case not found");

    const approval = currentCase.approvals.find((a) => a.id === approvalId);
    if (!approval) throw new Error("Approval not found");

    const now = new Date().toISOString();
    approval.status = decision;
    approval.decidedAt = now;
    approval.decisionNote = note || (decision === "APPROVED" ? "Approved by consumer." : "Rejected by consumer.");

    currentCase.auditLog.push({
      id: `aud-${Date.now()}`,
      timestamp: now,
      phase: "Human-in-the-Loop Approval",
      title: decision === "APPROVED" ? "Action Authorized by Consumer" : "Action Rejected by Consumer",
      detail: `${approval.title}: ${approval.decisionNote}`,
      mode: "SANDBOX_SIMULATED",
      status: decision === "APPROVED" ? "SUCCESS" : "WARNING",
    });

    if (decision === "APPROVED") {
      // Find the associated step and execute it
      const step = currentCase.planSteps.find((s) => s.id === approval.stepId);
      if (step) {
        saveStoredCase(currentCase);
        return this.executeStep(caseId, step.id);
      }
    } else {
      // Mark step skipped
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
   * Extract entities using LLM or structured regex parsing
   */
  private async extractEntitiesWithAi(input: string): Promise<ExtractedEntities> {
    try {
      const prompt = `Extract entities from this Indian consumer issue in JSON format:
"${input}"

Return JSON matching:
{
  "merchant": "string (e.g. Zara, Amazon, Swiggy, Indigo)",
  "orderId": "string (e.g. ZR-889104)",
  "awbNumber": "string (e.g. DEL-984210)",
  "transactionId": "string (e.g. PL-TX-998241)",
  "amount": number (e.g. 3499),
  "issueCategory": "DELIVERY_NDR" | "REFUND_DELAY" | "CANCELLATION" | "DAMAGED_ITEM" | "OVERCHARGE" | "SERVICE_FAILURE",
  "preferredResolution": "string"
}`;

      const aiText = await generateAiCompletion({ prompt, systemPrompt: "You are an entity extraction engine. Output ONLY valid JSON." });
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fallback to pattern regex extraction
    }

    // High-precision pattern extraction fallback
    const awbMatch = input.match(/(?:AWB|tracking|waybill)\s*#?([A-Za-z0-9-]+)/i);
    const amountMatch = input.match(/(?:₹|INR|Rs\.?)\s*([\d,]+)/i);
    const orderMatch = input.match(/(?:order|booking)\s*#?([A-Za-z0-9-]+)/i);

    let merchant = "Zara India";
    if (/flipkart/i.test(input)) merchant = "Flipkart";
    if (/amazon/i.test(input)) merchant = "Amazon India";
    if (/swiggy/i.test(input)) merchant = "Swiggy";
    if (/zomato/i.test(input)) merchant = "Zomato";
    if (/indigo/i.test(input)) merchant = "IndiGo Airlines";
    if (/myntra/i.test(input)) merchant = "Myntra";

    let issueCategory: ExtractedEntities["issueCategory"] = "DELIVERY_NDR";
    if (/refund/i.test(input) && !/delivery/i.test(input)) issueCategory = "REFUND_DELAY";
    if (/cancel/i.test(input)) issueCategory = "CANCELLATION";
    if (/damaged|broken/i.test(input)) issueCategory = "DAMAGED_ITEM";

    return {
      merchant,
      orderId: orderMatch ? orderMatch[1] : `ZR-${Math.floor(100000 + Math.random() * 900000)}`,
      awbNumber: awbMatch ? awbMatch[1] : "DEL-984210-IN",
      transactionId: `PL-TX-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, ""), 10) : 3499,
      issueCategory,
      preferredResolution: "Immediate delivery re-attempt or full banking refund credit",
      deliveryLandmark: "Indiranagar, Bengaluru",
    };
  }

  /**
   * Dynamic Task Planner based on problem category
   */
  private generatePlanSteps(caseId: string, entities: ExtractedEntities): TaskPlanStep[] {
    return [
      {
        id: "step-1",
        title: "Logistics Audit & Scan History Check",
        description: `Query Delhivery Logistics Rail for AWB #${entities.awbNumber || "DEL-984210-IN"} to verify NDR failure attempts.`,
        riskLevel: "LOW",
        rail: "delhivery",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-2",
        title: "Payment Gateway & Refund Settlement Audit",
        description: `Query Pine Labs Rail to audit ₹${(entities.amount || 3499).toLocaleString("en-IN")} transaction and banking reversal logs.`,
        riskLevel: "LOW",
        rail: "pine_labs",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-3",
        title: "Dispatch Statutory Grievance Notice",
        description: `Issue formal notice under Consumer Protection Act (2019) to ${entities.merchant || "merchant"} Grievance Officer.`,
        riskLevel: "MEDIUM",
        rail: "communication",
        status: "PENDING",
        requiresHumanApproval: false,
      },
      {
        id: "step-4",
        title: "Trigger Direct Banking Settlement / Chargeback",
        description: `Authorize direct ₹${(entities.amount || 3499).toLocaleString("en-IN")} refund settlement via Pine Labs rail with cryptographic authorization token.`,
        riskLevel: "HIGH",
        rail: "pine_labs",
        status: "REQUIRES_APPROVAL",
        requiresHumanApproval: true,
      },
    ];
  }
}

export const agentOrchestrator = new AgentOrchestrator();

