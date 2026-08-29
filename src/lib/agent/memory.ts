import { AgentCase } from "./types";

const STORAGE_KEY = "the_ken_agent_cases_v1";

export const SEEDED_DEMO_CASES: AgentCase[] = [
  {
    id: "case-dlv-9842",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    title: "Stuck Delhivery NDR & Delayed ₹3,499 Refund from Zara",
    consumerRawInput: "My Delhivery package with AWB #DEL-984210 is stuck marked as 'Customer Not Reachable' for 4 days, and Zara hasn't processed my ₹3,499 refund.",
    agentUnderstandingSummary: "Consumer's package suffered false NDR marking by field courier. Concurrently, merchant refund of ₹3,499 has exceeded the statutory 72-hour window on Pine Labs gateway.",
    status: "RESOLVED",
    riskLevel: "HIGH",
    extractedEntities: {
      merchant: "Zara India",
      orderId: "ZR-889104",
      awbNumber: "DEL-984210-IN",
      transactionId: "PL-TX-998241",
      amount: 3499,
      issueCategory: "DELIVERY_NDR",
      preferredResolution: "Immediate delivery re-attempt or instant banking refund credit",
      deliveryLandmark: "Indiranagar 12th Main, Bengaluru",
    },
    missingFields: [],
    planSteps: [
      {
        id: "step-1",
        title: "Logistics Audit on Delhivery Rail",
        description: "Query Delhivery AWB tracking and scan history for NDR exception analysis.",
        riskLevel: "LOW",
        rail: "delhivery",
        status: "COMPLETED",
        requiresHumanApproval: false,
        executedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
        executionNote: "Verified 2 false NDR attempts by rider Raju Kumar at Bengaluru Hub.",
      },
      {
        id: "step-2",
        title: "Payment & Refund Audit on Pine Labs Rail",
        description: "Verify payment settlement status and gateway reversal logs for ₹3,499.",
        riskLevel: "LOW",
        rail: "pine_labs",
        status: "COMPLETED",
        requiresHumanApproval: false,
        executedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
        executionNote: "Status 'REFUND_PENDING'. SLA violated by 74 hours.",
      },
      {
        id: "step-3",
        title: "Issue Formal Legal Notice under Consumer Protection Act",
        description: "Dispatch statutory grievance notice to Zara Nodal Desk & Delhivery Hub Supervisor.",
        riskLevel: "MEDIUM",
        rail: "communication",
        status: "COMPLETED",
        requiresHumanApproval: false,
        executedAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString(),
        executionNote: "Dispatched notice to nodal.officer@zara.com with 48hr statutory SLA.",
      },
      {
        id: "step-4",
        title: "Authorize Direct Bank Refund Settlement via Pine Labs Rail",
        description: "Request consumer authorization token to trigger instant refund settlement to verified bank account.",
        riskLevel: "HIGH",
        rail: "pine_labs",
        status: "COMPLETED",
        requiresHumanApproval: true,
        approvalId: "appr-001",
        executedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        executionNote: "Consumer granted approval. Bank UTR #423891004812 credited.",
      },
    ],
    approvals: [
      {
        id: "appr-001",
        caseId: "case-dlv-9842",
        stepId: "step-4",
        title: "Approve Instant Refund Authorization Token for ₹3,499",
        description: "Authorize the agent to trigger direct banking reversal under Pine Labs instant settlement rail.",
        riskLevel: "HIGH",
        impactAnalysis: "Directly claims ₹3,499 back to your verified UPI/bank account and closes the delivery re-attempt ticket.",
        proposedAction: "Execute Pine Labs Instant Settlement Rail",
        actionPayload: { amount: 3499, merchant: "Zara India", utrTarget: "Consumer UPI" },
        status: "APPROVED",
        requestedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        decidedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        decisionNote: "Approved by consumer via 1-tap authorization.",
      },
    ],
    auditLog: [
      {
        id: "aud-1",
        timestamp: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
        phase: "Logistics",
        title: "Delhivery Rail AWB Verification",
        detail: "Discovered 2 NDR exceptions marked falsely without customer call log.",
        rail: "delhivery",
        mode: "SANDBOX_SIMULATED",
        status: "SUCCESS",
      },
      {
        id: "aud-2",
        timestamp: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
        phase: "Payments",
        title: "Pine Labs Gateway Audit",
        detail: "Acquirer settlement stuck > 72 hours. Violation confirmed.",
        rail: "pine_labs",
        mode: "SANDBOX_SIMULATED",
        status: "WARNING",
      },
      {
        id: "aud-3",
        timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
        phase: "Resolution",
        title: "Instant Bank Credit Confirmed",
        detail: "UTR #423891004812 settled to consumer account.",
        rail: "pine_labs",
        mode: "SANDBOX_SIMULATED",
        status: "CRITICAL",
      },
    ],
    followUp: {
      currentAttempt: 1,
      maxAttempts: 3,
      intervalMinutes: 120,
      responseReceived: true,
      status: "RESOLVED",
      stopReason: "Merchant confirmed refund settlement.",
    },
    resolution: {
      resolvedAt: new Date().toISOString(),
      summary: "Full refund of ₹3,499 successfully credited to consumer bank account via Pine Labs rail. Delhivery NDR report closed with supervisor notice.",
      outcomeType: "REFUND_PROCESSED",
      moneyRecovered: 3499,
      timeSavedMinutes: 180,
      railConfirmations: [
        { rail: "Pine Labs", referenceNumber: "UTR-423891004812" },
        { rail: "Delhivery", referenceNumber: "DLV-NDR-RESOLVED-9842" },
      ],
    },
  },
];

let serverMemoryStore: AgentCase[] = [];

export function getStoredCases(): AgentCase[] {
  if (typeof window === "undefined") {
    return serverMemoryStore;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getDemoCases(): AgentCase[] {
  return SEEDED_DEMO_CASES;
}

export function saveStoredCase(caseData: AgentCase): AgentCase {
  if (typeof window === "undefined") {
    const existingIndex = serverMemoryStore.findIndex((c) => c.id === caseData.id);
    if (existingIndex >= 0) {
      serverMemoryStore[existingIndex] = { ...caseData, updatedAt: new Date().toISOString() };
    } else {
      serverMemoryStore = [caseData, ...serverMemoryStore];
    }
    return caseData;
  }

  try {
    const cases = getStoredCases();
    const existingIndex = cases.findIndex((c) => c.id === caseData.id);
    let updated: AgentCase[];
    if (existingIndex >= 0) {
      updated = [...cases];
      updated[existingIndex] = { ...caseData, updatedAt: new Date().toISOString() };
    } else {
      updated = [caseData, ...cases];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return caseData;
  } catch {
    return caseData;
  }
}

export function getCaseById(id: string): AgentCase | null {
  const cases = getStoredCases();
  const found = cases.find((c) => c.id === id);
  if (found) return found;
  return SEEDED_DEMO_CASES.find((c) => c.id === id) ?? null;
}

export function resetDemoCases(): AgentCase[] {
  serverMemoryStore = [...SEEDED_DEMO_CASES];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEEDED_DEMO_CASES));
  }
  return SEEDED_DEMO_CASES;
}
