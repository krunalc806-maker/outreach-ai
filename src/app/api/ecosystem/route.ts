import { NextRequest, NextResponse } from "next/server";
import { AGENT_REGISTRY, optimizePrompt, type AiAgentId } from "@/lib/ai/core";
import { generateAiCompletion } from "@/lib/chat/provider";
import { getAiConfig } from "@/lib/chat/config";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const agentId = body?.agentId as AiAgentId | undefined;
  const task = typeof body?.task === "string" ? body.task.trim() : "";
  if (!agentId || !AGENT_REGISTRY[agentId] || !task) return NextResponse.json({ error: "A valid agent and task are required." }, { status: 400 });
  const definition = AGENT_REGISTRY[agentId];
  const context = { system: definition.systemPrompt, recentMessages: [{ role: "user" as const, content: task }], retrievedMemories: [] };
  const prompt = optimizePrompt(task, context);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const run = { agent_id: agentId, task, status: "context_prepared", context_summary: "Task context prepared with policy and relevant-memory retrieval." };
  const { data: savedRun } = user
    ? await supabase.from("agent_runs").insert({ ...run, user_id: user.id }).select("id").maybeSingle()
    : { data: null };

  if (!getAiConfig().apiKey) {
    return NextResponse.json({ success: true, run: { agentId, task, queuedAt: new Date().toISOString(), state: "context_prepared" }, message: `${definition.name} prepared a context-grounded run. Connect an AI provider to execute model reasoning.` });
  }
  try {
    const output = await generateAiCompletion({ prompt, systemPrompt: definition.systemPrompt });
    if (savedRun?.id) await supabase.from("agent_runs").update({ status: "completed", output: { text: output }, completed_at: new Date().toISOString() }).eq("id", savedRun.id);
    return NextResponse.json({ success: true, output, message: `${definition.name} completed the requested analysis.` });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Agent execution failed." }, { status: 502 });
  }
}
