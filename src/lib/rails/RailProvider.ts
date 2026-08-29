/**
 * ============================================================================
 * THE KEN CASE COMPETITION 2026 — RAIL ARCHITECTURE ABSTRACTION
 * ============================================================================
 * 
 * Clean abstraction layer for Competition Rails:
 * 1. Gnani — Voice
 * 2. Pine Labs — Payments & Authorization
 * 3. Delhivery — Logistics
 * 
 * Strict Guideline: Honest labeling. If official production credentials are not provided,
 * transparently operate as SANDBOX_SIMULATED with realistic data and clear badges.
 * ============================================================================
 */

export type RailIntegrationMode = "LIVE_API" | "SANDBOX_SIMULATED";

export interface RailExecutionResult<T = unknown> {
  success: boolean;
  rail: "delhivery" | "pine_labs" | "gnani" | "communication";
  action: string;
  mode: RailIntegrationMode;
  timestamp: string;
  executionTimeMs: number;
  payload: T;
  auditMessage: string;
  externalReferenceId?: string;
  requiresUserAction?: boolean;
}

export interface IRailProvider {
  name: string;
  railType: "delhivery" | "pine_labs" | "gnani" | "communication";
  getMode(): RailIntegrationMode;
  isLiveConfigured(): boolean;
}

