import { getAiConfig, getNvidiaConfig, ProviderType } from "./config";

export interface StreamDelta {
  type: "delta" | "done" | "error";
  delta?: string;
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  error?: string;
}

function sanitizeText(value: string) {
  return value.replace(/\u0000/g, "").trim();
}

export function buildSystemAndUserMessages(prompt: string, attachments: Array<{ name: string; kind: string }> = [], systemPrompt?: string) {
  const attachmentText = attachments.length
    ? `\n\nAttachments:\n- ${attachments.map((attachment) => `${attachment.name} (${attachment.kind})`).join("\n- ")}`
    : "";

  return [
    {
      role: "system" as const,
      content: systemPrompt || "You are an autonomous AI agent assisting Indian consumers with real-world dispute, logistics, and service resolution. Be concise, actionable, and structured.",
    },
    {
      role: "user" as const,
      content: `${prompt}${attachmentText}`,
    },
  ];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* readSseChunks(response: Response): AsyncGenerator<StreamDelta> {
  if (!response.body) {
    throw new Error("The AI completion response did not include a stream body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary).trim();
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");

        if (!chunk.startsWith("data:")) continue;

        const payload = chunk.replace(/^data:\s*/, "").trim();
        if (!payload || payload === "[DONE]") continue;

        try {
          const event = JSON.parse(payload);
          const delta = event?.choices?.[0]?.delta?.content;
          const usage = event?.usage;

          if (typeof delta === "string" && delta.length) {
            yield { type: "delta", delta: sanitizeText(delta) };
          }

          if (usage) {
            yield {
              type: "done",
              usage: {
                promptTokens: usage.prompt_tokens,
                completionTokens: usage.completion_tokens,
                totalTokens: usage.total_tokens,
              },
            };
          }
        } catch {
          continue;
        }
      }
    }

    if (buffer.trim()) {
      const payload = buffer.trim().replace(/^data:\s*/, "").trim();
      if (payload && payload !== "[DONE]") {
        try {
          const event = JSON.parse(payload);
          const delta = event?.choices?.[0]?.delta?.content;
          if (typeof delta === "string" && delta.length) {
            yield { type: "delta", delta: sanitizeText(delta) };
          }
        } catch {
          // Ignore malformed stream payloads.
        }
      }
    }

    yield { type: "done" };
  } finally {
    reader.releaseLock();
  }
}

/**
 * Unified multi-provider streaming completion (NVIDIA primary, OpenRouter/Gemini fallback)
 */
export async function* streamAiCompletion(input: {
  prompt: string;
  attachments?: Array<{ name: string; kind: string }>;
  model?: string;
  provider?: ProviderType;
  systemPrompt?: string;
  signal?: AbortSignal;
}): AsyncGenerator<StreamDelta> {
  const config = getAiConfig(input.provider);
  const messages = buildSystemAndUserMessages(input.prompt, input.attachments, input.systemPrompt);
  const selectedModel = input.model ?? config.model;

  // If Gemini provider is selected
  if (config.provider === "gemini" && config.apiKey) {
    const geminiUrl = `${config.baseUrl}/models/${selectedModel}:streamGenerateContent?key=${config.apiKey}`;
    try {
      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${input.systemPrompt ? input.systemPrompt + "\n\n" : ""}${input.prompt}` }] }],
        }),
        signal: input.signal,
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed (${response.status}): ${await response.text()}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      yield { type: "delta", delta: text } as StreamDelta;
      yield { type: "done" } as StreamDelta;
      return;
    } catch (err) {
      if (input.signal?.aborted) throw err;
      // If Gemini fails, fallback to NVIDIA
    }
  }

  // Standard OpenAI-compatible endpoint for NVIDIA and OpenRouter
  const url = `${config.baseUrl}/v1/chat/completions`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    if (input.signal?.aborted) {
      throw new Error("The request was cancelled.");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    const onAbort = () => controller.abort();
    input.signal?.addEventListener("abort", onAbort, { once: true });

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (config.apiKey) {
        headers.Authorization = `Bearer ${config.apiKey}`;
      }

      if (config.provider === "openrouter") {
        headers["HTTP-Referer"] = "https://outreach-ai.app";
        headers["X-Title"] = "OutreachAI - The Ken Agent";
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: selectedModel,
          messages,
          stream: true,
          temperature: 0.6,
          max_tokens: 1200,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status >= 500 && attempt < 3) {
          lastError = new Error(`AI Provider request failed (${response.status}): ${errorBody}`);
          await delay(400 * attempt);
          continue;
        }
        throw new Error(`AI Provider request failed (${response.status}): ${errorBody}`);
      }

      for await (const chunk of readSseChunks(response)) {
        yield chunk;
      }
      return;
    } catch (error) {
      lastError = error;
      if (input.signal?.aborted || attempt === 3) {
        throw error;
      }
      await delay(400 * attempt);
    } finally {
      clearTimeout(timeoutId);
      input.signal?.removeEventListener("abort", onAbort);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("The AI request failed after multiple attempts.");
}

/**
 * Backward-compatible wrapper for NVIDIA completion
 */
export async function* streamNvidiaCompletion(input: {
  prompt: string;
  attachments?: Array<{ name: string; kind: string }>;
  model?: string;
  signal?: AbortSignal;
}): AsyncGenerator<StreamDelta> {
  yield* streamAiCompletion({
    ...input,
    provider: "nvidia",
  });
}

/**
 * Non-streaming structured completion helper for autonomous agent reasoning
 */
export async function generateAiCompletion(input: {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  provider?: ProviderType;
}): Promise<string> {
  const config = getAiConfig(input.provider);
  const messages = buildSystemAndUserMessages(input.prompt, [], input.systemPrompt);
  const selectedModel = input.model ?? config.model;

  // If Gemini
  if (config.provider === "gemini" && config.apiKey) {
    const geminiUrl = `${config.baseUrl}/models/${selectedModel}:generateContent?key=${config.apiKey}`;
    const res = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${input.systemPrompt ? input.systemPrompt + "\n\n" : ""}${input.prompt}` }] }],
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
  }

  // NVIDIA / OpenRouter
  const url = `${config.baseUrl}/v1/chat/completions`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: selectedModel,
      messages,
      stream: false,
      temperature: 0.4,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API failed (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? "";
}
