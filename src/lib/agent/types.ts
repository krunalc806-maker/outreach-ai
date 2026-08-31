import { RailIntegrationMode } from "../rails/RailProvider";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type CaseStatus =
  | "ANALYZING"
  | "AWAITING_MISSING_INFO"
  | "PLANNING"
  | "AWAITING_HUMAN_APPROVAL"
  | "EXECUTING_RAIL"
  | "WAITING_RESPONSE"
  | "FOLLOWING_UP"
  | "RESOLVED"
  | "ESCALATED"
  | "STOPPED";

export type StepStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED" | "SKIPPED" | "REQUIRES_APPROVAL";

export interface MissingContextField {
  key: string;
  label: string;
  description: string;
  example: string;
  required: boolean;
  value?: string;
}

export interface ExtractedEntities {
  customerName?: string;
  merchant?: string;
  orderId?: string;
  awbNumber?: string;
  transactionId?: string;
  amount?: number;
  pendingDuration?: string;
  incidentDate?: string;
  issueCategory?: "DELIVERY_NDR" | "REFUND_DELAY" | "CANCELLATION" | "DAMAGED_ITEM" | "OVERCHARGE" | "SERVICE_FAILURE";
  preferredResolution?: string;
  deliveryLandmark?: string;
  consumerPhone?: string;
  consumerEmail?: string;
}

export interface TaskPlanStep {
  id: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  rail: "delhivery" | "pine_labs" | "gnani" | "communication" | "internal";
  status: StepStatus;
  resultPayload?: unknown;
  requiresHumanApproval: boolean;
  approvalId?: string;
  executedAt?: string;
  executionNote?: string;
}

export interface HumanApprovalRequest {
  id: string;
  caseId: string;
  stepId: string;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  impactAnalysis: string;
  proposedAction: string;
  actionPayload: Record<string, unknown>;
  status: "PENDING" | "APPROVED" | "REJECTED" | "MODIFIED";
  requestedAt: string;
  decidedAt?: string;
  decisionNote?: string;
}

export interface CaseAuditEntry {
  id: string;
  timestamp: string;
  phase: string;
  title: string;
  detail: string;
  rail?: "delhivery" | "pine_labs" | "gnani" | "communication" | "internal";
  mode: RailIntegrationMode;
  status: "SUCCESS" | "INFO" | "WARNING" | "CRITICAL";
}

export interface FollowUpState {
  currentAttempt: number;
  maxAttempts: number;
  intervalMinutes: number;
  nextScheduledAt?: string;
  lastFollowUpAt?: string;
  responseReceived: boolean;
  status: "IDLE" | "SCHEDULED" | "POLLING" | "EXHAUSTED_ESCALATED" | "RESOLVED";
  stopReason?: string;
}

export interface CaseResolution {
  resolvedAt: string;
  summary: string;
  outcomeType: "REFUND_PROCESSED" | "DELIVERY_RESCHEDULED" | "CHARGEBACK_INITIATED" | "GRIEVANCE_ESCALATED" | "MUTUAL_SETTLEMENT";
  moneyRecovered?: number;
  timeSavedMinutes: number;
  railConfirmations: {
    rail: string;
    referenceNumber: string;
  }[];
}

export interface AgentCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  consumerRawInput: string;
  agentUnderstandingSummary: string;
  status: CaseStatus;
  riskLevel: RiskLevel;
  extractedEntities: ExtractedEntities;
  missingFields: MissingContextField[];
  planSteps: TaskPlanStep[];
  approvals: HumanApprovalRequest[];
  auditLog: CaseAuditEntry[];
  followUp: FollowUpState;
  resolution?: CaseResolution;
}
