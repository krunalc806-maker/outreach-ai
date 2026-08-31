import { z } from "zod";

const envSchema = z.object({
  // NVIDIA NIM (Primary)
  NVIDIA_NIM_BASE_URL: z.string().trim().url().optional(),
  NVIDIA_NIM_API_KEY: z.string().trim().min(1).optional(),
  NVIDIA_API_KEY: z.string().trim().min(1).optional(),
  NVIDIA_NIM_MODEL: z.string().trim().min(1).optional(),

  // OpenRouter (Fallback / Alternative)
  OPENROUTER_API_KEY: z.string().trim().min(1).optional(),
  OPENROUTER_BASE_URL: z.string().trim().url().optional(),
  OPENROUTER_MODEL: z.string().trim().min(1).optional(),

  // Google Gemini (Fallback / Alternative)
  GEMINI_API_KEY: z.string().trim().min(1).optional(),
  GEMINI_MODEL: z.string().trim().min(1).optional(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().trim().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().min(1).optional(),
});

export type ProviderType = "nvidia" | "openrouter" | "gemini";

export interface ActiveAiConfig {
  provider: ProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
}

/** UI choices are aliases, never provider model identifiers. */
export function resolveChatModelSelection(selection?: string): { provider: ProviderType; model: string } {
  const provider: ProviderType = selection === "fast" ? "gemini" : selection === "reasoning" ? "openrouter" : "nvidia";
  const config = getAiConfig(provider);
  return { provider: config.provider, model: config.model };
}

export function getNvidiaConfig() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message).join(", ");
    throw new Error(`Invalid chat environment configuration: ${issues}`);
  }

  const { NVIDIA_NIM_BASE_URL, NVIDIA_NIM_API_KEY, NVIDIA_API_KEY, NVIDIA_NIM_MODEL } = parsed.data;
  const baseUrl = NVIDIA_NIM_BASE_URL ?? "https://integrate.api.nvidia.com";
  const apiKey = NVIDIA_NIM_API_KEY ?? NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NVIDIA NIM configuration. Set NVIDIA_NIM_API_KEY or NVIDIA_API_KEY.");
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    apiKey,
    model: NVIDIA_NIM_MODEL ?? "meta/llama-3.1-8b-instruct",
  };
}

export function getAiConfig(preferredProvider?: ProviderType): ActiveAiConfig {
  const parsed = envSchema.safeParse(process.env);
  const data = parsed.success ? parsed.data : {};

  // 1. If preferred provider requested, attempt it first
  if (preferredProvider === "openrouter" && data.OPENROUTER_API_KEY) {
    return {
      provider: "openrouter",
      baseUrl: (data.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1").replace(/\/$/, ""),
      apiKey: data.OPENROUTER_API_KEY,
      model: data.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct",
    };
  }

  if (preferredProvider === "gemini" && data.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: data.GEMINI_API_KEY,
      model: data.GEMINI_MODEL ?? "gemini-1.5-flash",
    };
  }

  // 2. Primary: NVIDIA NIM
  const nvidiaKey = data.NVIDIA_NIM_API_KEY ?? data.NVIDIA_API_KEY;
  if (nvidiaKey) {
    return {
      provider: "nvidia",
      baseUrl: (data.NVIDIA_NIM_BASE_URL ?? "https://integrate.api.nvidia.com").replace(/\/$/, ""),
      apiKey: nvidiaKey,
      model: data.NVIDIA_NIM_MODEL ?? "meta/llama-3.1-8b-instruct",
    };
  }

  // 3. Fallback 1: OpenRouter
  if (data.OPENROUTER_API_KEY) {
    return {
      provider: "openrouter",
      baseUrl: (data.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1").replace(/\/$/, ""),
      apiKey: data.OPENROUTER_API_KEY,
      model: data.OPENROUTER_MODEL ?? "meta-llama/llama-3.3-70b-instruct",
    };
  }

  // 4. Fallback 2: Gemini
  if (data.GEMINI_API_KEY) {
    return {
      provider: "gemini",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: data.GEMINI_API_KEY,
      model: data.GEMINI_MODEL ?? "gemini-1.5-flash",
    };
  }

  // If none configured, return fallback default for graceful mock/offline mode
  return {
    provider: "nvidia",
    baseUrl: "https://integrate.api.nvidia.com",
    apiKey: "",
    model: "meta/llama-3.1-8b-instruct",
  };
}
