"use client";

import { useState } from "react";
import { Bot, BrainCircuit, CheckCircle2, FileSearch, FolderKanban, Globe2, Mic, Search, Sparkles, Upload, Workflow } from "lucide-react";
import { AGENT_REGISTRY, type AiAgentId } from "@/lib/ai/core";
import { DOCUMENT_CAPABILITIES } from "@/lib/documents";

const AGENT_IDS = Object.keys(AGENT_REGISTRY) as AiAgentId[];

export default function AiEcosystem() {
  const [selectedAgent, setSelectedAgent] = useState<AiAgentId>("research");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const agent = AGENT_REGISTRY[selectedAgent];

  const runAgent = async () => {
    if (!query.trim()) return;
    setStatus("Preparing context, retrieving workspace memory, and starting the agent…");
    try {
      const response = await fetch("/api/ecosystem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentId: selectedAgent, task: query }) });
      const payload = await response.json();
      setStatus(payload.message || "The agent run was recorded.");
    } catch {
      setStatus("The request could not be started. Your workspace remains unchanged.");
    }
  };

  const uploadDocument = async (file?: File) => {
    if (!file) return;
    setUploadStatus(`Uploading ${file.name}…`);
    const form = new FormData(); form.set("file", file);
    try {
      const response = await fetch("/api/documents", { method: "POST", body: form });
      const payload = await response.json();
      setUploadStatus(response.ok ? `${file.name} was uploaded securely. Text extraction begins when its processor is configured.` : payload.error || "Upload failed.");
    } catch { setUploadStatus("Upload failed. Check your connection and storage configuration."); }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-7">
      <section className="overflow-hidden rounded-3xl border border-violet-400/20 bg-[radial-gradient(circle_at_top_right,_rgba(139,92,246,.24),transparent_42%),linear-gradient(135deg,#13101f,#090b12_62%)] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200"><Sparkles size={14} /> Omnexa AI ecosystem</div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">One secure intelligence layer for work, knowledge, and action.</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-300">Choose a specialist agent, ground it in your workspace, and keep consequential actions behind human approval.</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-300"><CheckCircle2 size={16} className="text-emerald-400" /> Context-aware <CheckCircle2 size={16} className="text-emerald-400" /> Approval-aware</div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-3xl border border-white/10 bg-[#0d0f16] p-5 sm:p-6">
          <div className="flex items-center gap-2"><BrainCircuit className="text-violet-300" size={19} /><div><h2 className="font-bold text-white">Agent runtime</h2><p className="text-xs text-zinc-500">Reusable specialists share memory, policy, and observability.</p></div></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {AGENT_IDS.map((id) => {
              const item = AGENT_REGISTRY[id]; const active = id === selectedAgent;
              return <button key={id} onClick={() => setSelectedAgent(id)} className={`rounded-2xl border p-3 text-left transition ${active ? "border-violet-400/50 bg-violet-400/10" : "border-white/8 bg-white/[.025] hover:bg-white/[.06]"}`}><div className="flex items-center gap-2 text-sm font-semibold text-white"><Bot size={15} className={active ? "text-violet-300" : "text-zinc-500"} />{item.name}</div><p className="mt-1 text-xs leading-5 text-zinc-400">{item.description}</p></button>;
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-[#11141c] p-4">
            <p className="text-xs font-semibold text-violet-200">{agent.name} is ready</p>
            <p className="mt-1 text-xs text-zinc-400">{agent.capabilities.join(" · ")}</p>
            <div className="mt-3 flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runAgent()} placeholder={`Ask the ${agent.name} to help…`} className="h-11 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-400/60" /><button onClick={runAgent} className="rounded-xl bg-violet-500 px-4 text-sm font-bold text-white hover:bg-violet-400">Run</button></div>
            {status && <p className="mt-3 rounded-xl border border-white/5 bg-white/[.03] p-3 text-xs text-zinc-300">{status}</p>}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-white/10 bg-[#0d0f16] p-5"><div className="flex items-center gap-2"><FileSearch size={18} className="text-cyan-300" /><h2 className="font-bold text-white">Document intelligence</h2></div><p className="mt-2 text-xs leading-5 text-zinc-400">Upload, index, search, and chat with files. File processing is permission-scoped to this workspace.</p><div className="mt-4 flex flex-wrap gap-2">{DOCUMENT_CAPABILITIES.map((item) => <span key={item.type} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">{item.label}</span>)}</div><label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100"><Upload size={14} /> Add document<input type="file" className="hidden" accept=".pdf,.docx,.txt,.csv,.xlsx,.xls,.pptx,image/png,image/jpeg,image/webp" onChange={(event) => uploadDocument(event.target.files?.[0])} /></label>{uploadStatus && <p className="mt-2 text-xs text-zinc-400">{uploadStatus}</p>}</div>
          <div className="rounded-3xl border border-white/10 bg-[#0d0f16] p-5"><div className="flex items-center gap-2"><Globe2 size={18} className="text-amber-300" /><h2 className="font-bold text-white">Research and verified search</h2></div><p className="mt-2 text-xs leading-5 text-zinc-400">The Research Agent attaches source URLs and verification status to every external claim. Connect a search provider in environment settings to enable live web retrieval.</p><div className="mt-3 flex items-center gap-2 text-xs text-zinc-400"><Search size={14} /> Citation-ready evidence ledger</div></div>
          <div className="rounded-3xl border border-white/10 bg-[#0d0f16] p-5"><div className="flex items-center gap-2"><FolderKanban size={18} className="text-emerald-300" /><h2 className="font-bold text-white">Workspace memory</h2></div><p className="mt-2 text-xs leading-5 text-zinc-400">Projects, folders, notes, tasks, conversations, and case context are retrieved only when relevant and compressed before model use.</p><div className="mt-3 flex gap-4 text-xs text-zinc-400"><span className="inline-flex items-center gap-1"><Workflow size={13} /> Auditable workflows</span><span className="inline-flex items-center gap-1"><Mic size={13} /> Voice-ready</span></div></div>
        </div>
      </section>
      <p className="text-center text-xs text-zinc-600">Document processing and web retrieval activate only with their configured providers; no simulated live integrations are shown as real.</p>
    </main>
  );
}
