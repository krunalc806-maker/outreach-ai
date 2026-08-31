export type AiAgentId = "research" | "coding" | "document" | "marketing" | "email" | "automation" | "data-analysis";

export interface MemoryRecord {
  id: string;
  scope: "conversation" | "workspace" | "case";
  content: string;
  tags: string[];
  importance: number;
  createdAt: string;
}

export interface ContextWindow {
  system: string;
  summary?: string;
  recentMessages: Array<{ role: "user" | "assistant" | "tool"; content: string }>;
  retrievedMemories: MemoryRecord[];
}

export interface AgentDefinition {
  id: AiAgentId;
  name: string;
  description: string;
  capabilities: string[];
  systemPrompt: string;
}

const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "to", "of", "in", "for", "on", "is", "it", "with", "my", "i"]);

function terms(value: string) {
  return new Set(value.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((word) => !STOP_WORDS.has(word)) ?? []);
}

/** Deterministic relevance retrieval that works without a vector service. */
export function retrieveRelevantMemory(query: string, records: MemoryRecord[], limit = 6): MemoryRecord[] {
  const queryTerms = terms(query);
  return records
    .map((record) => {
      const recordTerms = terms(`${record.content} ${record.tags.join(" ")}`);
      const shared = [...queryTerms].filter((term) => recordTerms.has(term)).length;
      return { record, score: shared / Math.max(1, queryTerms.size) + record.importance * 0.05 };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record }) => record);
}

/** Keeps the most actionable recent context within a predictable token budget. */
export function buildContextWindow(context: ContextWindow, maxCharacters = 12_000): string {
  const memory = context.retrievedMemories.map((item) => `- ${item.content}`).join("\n");
  const messages = context.recentMessages.map((item) => `${item.role}: ${item.content}`);
  const sections = [context.system, context.summary ? `Conversation summary:\n${context.summary}` : "", memory ? `Relevant memory:\n${memory}` : "", ...messages].filter(Boolean);
  let output = sections.join("\n\n");
  if (output.length > maxCharacters) output = `${output.slice(0, maxCharacters - 1200)}\n\n[Older context compressed to preserve the active task.]`;
  return output;
}

export function optimizePrompt(task: string, context: ContextWindow) {
  return `${buildContextWindow(context)}\n\nTask:\n${task}\n\nReturn a precise, evidence-aware response. Separate facts, assumptions, and recommended next actions.`;
}

export const AGENT_REGISTRY: Record<AiAgentId, AgentDefinition> = {
  research: { id: "research", name: "Research Agent", description: "Finds, verifies and synthesizes sources.", capabilities: ["web research", "citations", "source verification"], systemPrompt: "You are a rigorous research agent. Distinguish verified facts from inference and cite sources." },
  coding: { id: "coding", name: "Coding Agent", description: "Plans, writes and reviews maintainable software.", capabilities: ["implementation", "debugging", "review"], systemPrompt: "You are a senior software engineer. Prioritize secure, tested, maintainable changes." },
  document: { id: "document", name: "Document Agent", description: "Extracts, indexes and answers questions from files.", capabilities: ["OCR", "RAG", "semantic search"], systemPrompt: "You are a document intelligence agent. Ground every answer in supplied documents." },
  marketing: { id: "marketing", name: "Marketing Agent", description: "Develops evidence-led positioning and content.", capabilities: ["positioning", "campaigns", "content"], systemPrompt: "You are a marketing strategist. Avoid unsupported claims." },
  email: { id: "email", name: "Email Agent", description: "Drafts contextual, approval-aware communication.", capabilities: ["drafting", "follow-ups", "tone adaptation"], systemPrompt: "You write concise, contextual email. Never send or imply sending without explicit authorization." },
  automation: { id: "automation", name: "Automation Agent", description: "Turns repeatable work into auditable workflows.", capabilities: ["workflows", "scheduling", "approvals"], systemPrompt: "You are an automation planner. Identify risk and require approval for consequential actions." },
  "data-analysis": { id: "data-analysis", name: "Data Analysis Agent", description: "Analyzes structured data and communicates decisions.", capabilities: ["CSV analysis", "metrics", "insights"], systemPrompt: "You are a data analyst. Explain methodology and uncertainty." },
};
