/**
 * ============================================================================
 * THE KEN CASE COMPETITION 2026 — AGENT VERIFICATION & RE-PLANNING ENGINE
 * ============================================================================
 * 
 * Verifies real-world outcomes after rail action execution and adapts
 * downstream plans dynamically if unexpected conditions arise.
 * ============================================================================
 */

import { AgentCase, TaskPlanStep } from "./types";

export interface VerificationCheckResult {
  stepId: string;
  verified: boolean;
  requiresPlanRevision: boolean;
  adaptedPlanSteps?: TaskPlanStep[];
  verificationNote: string;
}

export class AgentVerificationEngine {
  /**
   * Run verification check following a rail action execution
   */
  verifyStepExecution(agentCase: AgentCase, executedStep: TaskPlanStep): VerificationCheckResult {
    // 1. If logistics NDR check discovered package has been marked for RTO (Return to Origin)
    const result = executedStep.resultPayload as any;
    if (executedStep.rail === "delhivery" && result?.status?.includes("RTO")) {
      const adaptedSteps: TaskPlanStep[] = [
        ...agentCase.planSteps.filter((s) => s.id !== executedStep.id),
        {
          id: `step-rto-refund-${Date.now()}`,
          title: "Expedite Full Refund Due to Logistics RTO",
          description: "Package is returning to warehouse. Adapt strategy to claim instant refund on Pine Labs rail.",
          riskLevel: "HIGH",
          rail: "pine_labs",
          status: "REQUIRES_APPROVAL",
          requiresHumanApproval: true,
        },
      ];

      return {
        stepId: executedStep.id,
        verified: true,
        requiresPlanRevision: true,
        adaptedPlanSteps: adaptedSteps,
        verificationNote: "Dynamic Re-Planning: Detected shipment RTO. Automatically shifted plan from delivery re-attempt to instant banking refund claim.",
      };
    }

    // 2. Default verification: check that confirmation ID or payload was returned
    const hasConfirmation = Boolean(result?.confirmationId || result?.payoutId || result?.ticketId || result?.messageId || result?.awb);

    return {
      stepId: executedStep.id,
      verified: hasConfirmation,
      requiresPlanRevision: false,
      verificationNote: hasConfirmation
        ? "Post-Action Verification: Confirmed external reference on rail network."
        : "Verification Notice: Telemetry recorded in sandbox environment.",
    };
  }
}

export const agentVerifier = new AgentVerificationEngine();

