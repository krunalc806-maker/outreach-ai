import { AgentCase, CaseAuditEntry, FollowUpState } from "./types";
import { communicationRail } from "../rails/CommunicationRailProvider";

export interface FollowUpEvaluation {
  actionTaken: "FOLLOW_UP_SENT" | "STATUTORY_ESCALATION" | "CLOSED_RESOLVED" | "AWAITING_EXPIRATION" | "STOPPED";
  nextState: FollowUpState;
  auditEntry: CaseAuditEntry;
  resolutionConfirmed?: boolean;
}

export class FollowUpEngine {
  /**
   * Evaluates current case response state and applies the state machine transition
   */
  async processFollowUpTick(agentCase: AgentCase, simulatedResponse?: string): Promise<FollowUpEvaluation> {
    const followUp = agentCase.followUp;
    const now = new Date().toISOString();

    // 1. If response received and problem confirmed resolved
    if (simulatedResponse && simulatedResponse.toLowerCase().includes("refund processed") || simulatedResponse?.toLowerCase().includes("delivered")) {
      const nextState: FollowUpState = {
        ...followUp,
        responseReceived: true,
        status: "RESOLVED",
        stopReason: "Merchant confirmed issue resolution.",
      };

      const auditEntry: CaseAuditEntry = {
        id: `aud-fol-${Date.now()}`,
        timestamp: now,
        phase: "Follow-Up State Machine",
        title: "Merchant Resolution Verified",
        detail: `Merchant confirmed resolution: '${simulatedResponse.slice(0, 100)}'. Case marked ready to close.`,
        rail: "communication",
        mode: "SANDBOX_SIMULATED",
        status: "SUCCESS",
      };

      return { actionTaken: "CLOSED_RESOLVED", nextState, auditEntry, resolutionConfirmed: true };
    }

    // 2. If max attempts exhausted -> Trigger statutory escalation
    if (followUp.currentAttempt >= followUp.maxAttempts) {
      const nextState: FollowUpState = {
        ...followUp,
        status: "EXHAUSTED_ESCALATED",
        stopReason: `Maximum follow-up attempts (${followUp.maxAttempts}) reached without merchant adherence. Statutory escalation triggered.`,
      };

      const auditEntry: CaseAuditEntry = {
        id: `aud-esc-${Date.now()}`,
        timestamp: now,
        phase: "Statutory Escalation",
        title: "Escalated to National Consumer Disputes Redressal Forum (NCDRC)",
        detail: `Merchant unresponsive after ${followUp.maxAttempts} notices. Statutory docket created on National Consumer Helpline (NCH Ref #${Date.now().toString().slice(-6)}).`,
        rail: "communication",
        mode: "SANDBOX_SIMULATED",
        status: "CRITICAL",
      };

      return { actionTaken: "STATUTORY_ESCALATION", nextState, auditEntry };
    }

    // 3. Dispatch structured follow-up notice
    const nextAttempt = followUp.currentAttempt + 1;
    const nextIntervalMin = followUp.intervalMinutes * 1.5; // Exponential backoff

    await communicationRail.dispatchCommunication({
      recipientEmail: `support@${agentCase.extractedEntities.merchant?.toLowerCase().replace(/\s+/g, "") || "merchant"}.com`,
      recipientName: `${agentCase.extractedEntities.merchant || "Merchant"} Grievance Desk`,
      subject: `REMINDER [Attempt ${nextAttempt}/${followUp.maxAttempts}]: Pending Resolution for Case #${agentCase.id}`,
      body: `This is an automated statutory follow-up regarding unresolved Order #${agentCase.extractedEntities.orderId || agentCase.id}. Please provide written status within 24 hours to avoid regulatory filing.`,
      messageType: "MERCHANT_ESCALATION",
      channel: "email",
    });

    const nextState: FollowUpState = {
      ...followUp,
      currentAttempt: nextAttempt,
      lastFollowUpAt: now,
      nextScheduledAt: new Date(Date.now() + nextIntervalMin * 60 * 1000).toISOString(),
      status: "SCHEDULED",
    };

    const auditEntry: CaseAuditEntry = {
      id: `aud-fol-${Date.now()}`,
      timestamp: now,
      phase: "Autonomous Follow-Up",
      title: `Follow-up Notice Dispatched (Attempt ${nextAttempt}/${followUp.maxAttempts})`,
      detail: `Statutory follow-up reminder sent to merchant grievance desk. Next check scheduled in ${Math.round(nextIntervalMin)} minutes.`,
      rail: "communication",
      mode: "SANDBOX_SIMULATED",
      status: "INFO",
    };

    return { actionTaken: "FOLLOW_UP_SENT", nextState, auditEntry };
  }
}

export const followUpEngine = new FollowUpEngine();

