/**
 * ============================================================================
 * THE KEN CASE COMPETITION 2026 — TASK-BASED AI MODEL ROUTER
 * ============================================================================
 * 
 * Intelligent routing across NVIDIA NIM, OpenRouter, and Gemini based on:
 * - Task complexity (Classification vs Complex Planning vs Formal Notice Writing)
 * - Latency, token budget, and statutory grounding
 * ============================================================================
 */

import { generateAiCompletion } from "./provider";
import { getAiConfig, ProviderType } from "./config";

export type TaskType =
  | "INTENT_CLASSIFICATION"
  | "DYNAMIC_TASK_PLANNING"
  | "STATUTORY_NOTICE_GENERATION"
  | "REPLY_SENTIMENT_ANALYSIS";

export interface ModelRoutingDecision {
  task: TaskType;
  selectedProvider: ProviderType;
  selectedModel: string;
  reasoning: string;
}

export class AiTaskRouter {
  /**
   * Determine optimal provider & model for a specific agent task
   */
  getRoutingDecision(task: TaskType): ModelRoutingDecision {
    const config = getAiConfig();

    switch (task) {
      case "INTENT_CLASSIFICATION":
        return {
          task,
          selectedProvider: config.provider,
          selectedModel: config.model,
          reasoning: "Low-latency classification optimized for fast entity parsing.",
        };

      case "DYNAMIC_TASK_PLANNING":
        return {
          task,
          selectedProvider: config.provider,
          selectedModel: config.model,
          reasoning: "High-capability reasoning model for multi-step tool plan formulation.",
        };

      case "STATUTORY_NOTICE_GENERATION":
        return {
          task,
          selectedProvider: config.provider,
          selectedModel: config.model,
          reasoning: "High-quality language generation for formal Consumer Protection Act (2019) notices.",
        };

      default:
        return {
          task,
          selectedProvider: config.provider,
          selectedModel: config.model,
          reasoning: "Standard model configuration.",
        };
    }
  }

  /**
   * Execute routed AI completion
   */
  async executeTask(task: TaskType, prompt: string, systemPrompt?: string): Promise<string> {
    const decision = this.getRoutingDecision(task);
    return generateAiCompletion({
      prompt,
      systemPrompt,
      model: decision.selectedModel,
      provider: decision.selectedProvider,
    });
  }
}

export const aiRouter = new AiTaskRouter();

