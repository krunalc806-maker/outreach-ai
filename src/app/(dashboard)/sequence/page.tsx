"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Pause,
  PhoneCall,
  Play,
  Plus,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
  Workflow,
  X,
} from "lucide-react";
import type { EscalationSequence, SequenceStep } from "@/app/api/sequences/route";

export default function SequencePage() {
  const [sequences, setSequences] = useState<EscalationSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSeqId, setActiveSeqId] = useState<string | null>(null);

  // Simulation state
  const [simStepIndex, setSimStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Create modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("Zara India");
  const [steps, setSteps] = useState<Omit<SequenceStep, "id" | "stepNumber">[]>([
    {
      title: "Statutory CPA Grievance Notice",
      channel: "Email Grievance (CPA 2019)",
      delayHours: 0,
      statutorySla: "48 Hours",
      actionPayload: "CPA 2019 notice with order ref and refund demand.",
    },
    {
      title: "Pine Labs Settlement Audit",
      channel: "Pine Labs Switch Audit",
      delayHours: 24,
      statutorySla: "24 Hours",
      actionPayload: "Polls gateway for UTR transaction credit.",
    },
    {
      title: "NCH Regulatory Escalation Docket",
      channel: "National Consumer Helpline (NCH)",
      delayHours: 72,
      statutorySla: "Final SLA",
      actionPayload: "Files regulatory dispute token to NCH portal.",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSequences();
  }, []);

  async function fetchSequences() {
    try {
      setLoading(true);
      const res = await fetch("/api/sequences");
      const data = await res.json();
      if (data.success && Array.isArray(data.sequences)) {
        setSequences(data.sequences);
        if (data.sequences[0] && !activeSeqId) {
          setActiveSeqId(data.sequences[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedSequence = sequences.find((s) => s.id === activeSeqId) || sequences[0];

  const handleToggleStatus = async (seq: EscalationSequence) => {
    const nextStatus = seq.status === "Active" ? "Paused" : "Active";
    setSequences((prev) =>
      prev.map((s) => (s.id === seq.id ? { ...s, status: nextStatus } : s))
    );

    try {
      await fetch("/api/sequences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: seq.id, status: nextStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sequence?")) return;
    setSequences((prev) => prev.filter((s) => s.id !== id));
    if (activeSeqId === id) setActiveSeqId(null);

    try {
      await fetch(`/api/sequences?id=${id}`, { method: "DELETE" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateStep = (seq: EscalationSequence) => {
    setIsSimulating(true);
    const nextIndex = (simStepIndex + 1) % (seq.steps.length + 1);
    setSimStepIndex(nextIndex);

    const step = seq.steps[simStepIndex];
    if (step) {
      setSimLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] STEP ${step.stepNumber} EXECUTED: ${step.title} via ${step.channel} (${step.statutorySla})`,
        ...prev.slice(0, 7),
      ]);
    } else {
      setSimLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] SEQUENCE COMPLETED: Bounded retry limit reached. All statutory steps dispatched.`,
        ...prev.slice(0, 7),
      ]);
    }
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        title: `Escalation Step ${prev.length + 1}`,
        channel: "Email Grievance (CPA 2019)",
        delayHours: (prev.length + 1) * 24,
        statutorySla: "24 Hours",
        actionPayload: "Autonomous notice dispatched.",
      },
    ]);
  };

  const handleRemoveStep = (idx: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateSequence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || steps.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          linkedMerchant: merchant.trim(),
          maxAttempts: steps.length,
          steps,
        }),
      });

      const data = await res.json();
      if (data.success && data.sequence) {
        setSequences((prev) => [data.sequence, ...prev]);
        setActiveSeqId(data.sequence.id);
        setIsCreateOpen(false);
        setName("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getChannelIcon = (channel: string) => {
    if (channel.includes("Email")) return <Mail size={14} className="text-[#a78bfa]" />;
    if (channel.includes("Delhivery") || channel.includes("Logistics")) return <Truck size={14} className="text-amber-400" />;
    if (channel.includes("Pine Labs") || channel.includes("Payment")) return <CheckCircle2 size={14} className="text-emerald-400" />;
    if (channel.includes("Voice") || channel.includes("Gnani")) return <PhoneCall size={14} className="text-cyan-400" />;
    return <Scale size={14} className="text-rose-400" />;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
                <Workflow size={12} /> Autonomous State Machine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-300">
                <ShieldCheck size={12} /> Bounded Retry Enforcement
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Escalation Sequences & Statutory Follow-Up Engine
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-zinc-400">
              The agent enforces strict bounded retry limits (maximum 3 attempts) and never creates endless spam. If a merchant breaches the statutory SLA, the state machine autonomously transitions to Nodal Officers and the National Consumer Helpline.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
          >
            <Plus size={15} />
            <span>New Escalation Sequence</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sequence Selector & Workflow Topology */}
      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Column: Sequences List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider">
            Active Sequence Workflows ({sequences.length})
          </h2>

          {loading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-[#0d1017]" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {sequences.map((seq) => {
                const isSelected = selectedSequence?.id === seq.id;
                return (
                  <div
                    key={seq.id}
                    onClick={() => {
                      setActiveSeqId(seq.id);
                      setSimStepIndex(0);
                    }}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-[#8b5cf6]/60 bg-[#8b5cf6]/10 shadow-lg shadow-[#8b5cf6]/10"
                        : "border-white/10 bg-[#0d1017] hover:border-white/20 hover:bg-[#11141c]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase font-mono ${
                            seq.status === "Active"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {seq.status}
                        </span>
                        <h3 className="mt-1.5 font-bold text-white text-xs sm:text-sm">{seq.name}</h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(seq);
                          }}
                          title={seq.status === "Active" ? "Pause Sequence" : "Activate Sequence"}
                          className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
                        >
                          {seq.status === "Active" ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(seq.id);
                          }}
                          title="Delete Sequence"
                          className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-1.5 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {seq.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-zinc-500 font-mono">
                      <span>{seq.steps.length} Bounded Steps</span>
                      <span>Target: {seq.linkedMerchant || "Merchant"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Step Topology & Simulation */}
        {selectedSequence ? (
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{selectedSequence.name}</h2>
                    <span className="rounded bg-[#8b5cf6]/20 text-[#a78bfa] border border-[#8b5cf6]/30 px-2 py-0.2 text-[10px] font-mono font-bold">
                      {selectedSequence.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{selectedSequence.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulateStep(selectedSequence)}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-extrabold text-black shadow hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isSimulating ? "animate-spin" : ""} />
                  <span>Simulate Next Tick</span>
                </button>
              </div>

              {/* Steps Topology */}
              <div className="space-y-4">
                {selectedSequence.steps.map((step, idx) => {
                  const isCurrent = simStepIndex === idx;
                  const isPassed = simStepIndex > idx;
                  return (
                    <div key={step.id} className="space-y-4">
                      <div
                        className={`rounded-2xl border p-4 transition ${
                          isCurrent
                            ? "border-[#8b5cf6] bg-[#8b5cf6]/10 ring-1 ring-[#8b5cf6]/50"
                            : isPassed
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-white/10 bg-[#11141c]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                                isPassed
                                  ? "bg-emerald-500 text-black"
                                  : isCurrent
                                  ? "bg-[#8b5cf6] text-white animate-pulse"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {isPassed ? <CheckCircle2 size={14} /> : `0${step.stepNumber}`}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-white text-xs sm:text-sm">{step.title}</h3>
                                <span className="inline-flex items-center gap-1 rounded bg-[#08090d] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-300">
                                  {getChannelIcon(step.channel)}
                                  <span>{step.channel}</span>
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300">{step.actionPayload}</p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="rounded bg-black/40 border border-white/5 px-2 py-1 text-[10px] font-mono text-[#a78bfa] block">
                              Delay: +{step.delayHours}h
                            </span>
                            <span className="text-[9px] text-zinc-500 font-mono block mt-1">
                              SLA: {step.statutorySla}
                            </span>
                          </div>
                        </div>
                      </div>

                      {idx < selectedSequence.steps.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowDown size={14} className="text-zinc-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live Simulation Audit Console */}
              {simLogs.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-[#08090d] p-4 space-y-2 font-mono text-xs">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Telemetry Execution Log:
                  </span>
                  {simLogs.map((log, i) => (
                    <p key={i} className="text-zinc-400 text-[11px]">
                      {log}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* CREATE SEQUENCE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Create Autonomous Escalation Sequence</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSequence} className="mt-4 space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Sequence Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Swiggy Undelivered Refund Sequence"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Target Merchant / Provider *</label>
                  <input
                    required
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    placeholder="e.g. Swiggy India"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 3-step escalation with instant UPI reversal verification"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              {/* Steps Builder */}
              <div className="space-y-3 border-t border-white/10 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">Escalation Steps ({steps.length})</span>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="inline-flex items-center gap-1 text-xs text-[#a78bfa] hover:text-white font-bold"
                  >
                    <Plus size={13} /> Add Step
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {steps.map((st, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 bg-[#11141c] p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#a78bfa] text-[11px]">Step 0{idx + 1}</span>
                        {steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(idx)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <input
                          required
                          value={st.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, title: val } : s))
                            );
                          }}
                          placeholder="Step title"
                          className="h-8 rounded-lg border border-zinc-700 bg-[#08090d] px-2.5 text-xs text-white outline-none focus:border-[#8b5cf6]"
                        />

                        <select
                          value={st.channel}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, channel: val } : s))
                            );
                          }}
                          className="h-8 rounded-lg border border-zinc-700 bg-[#08090d] px-2 text-xs text-white outline-none focus:border-[#8b5cf6]"
                        >
                          <option value="Email Grievance (CPA 2019)">Email Grievance (CPA 2019)</option>
                          <option value="Delhivery Logistics Override">Delhivery Logistics Override</option>
                          <option value="Pine Labs Switch Audit">Pine Labs Switch Audit</option>
                          <option value="Gnani Regional Voice Call">Gnani Regional Voice Call</option>
                          <option value="National Consumer Helpline (NCH)">National Consumer Helpline (NCH)</option>
                        </select>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        <input
                          type="number"
                          value={st.delayHours}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, delayHours: val } : s))
                            );
                          }}
                          placeholder="Delay (hours)"
                          className="h-8 rounded-lg border border-zinc-700 bg-[#08090d] px-2.5 text-xs text-white outline-none focus:border-[#8b5cf6]"
                        />
                        <input
                          value={st.statutorySla}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, statutorySla: val } : s))
                            );
                          }}
                          placeholder="Statutory SLA (e.g. 24h)"
                          className="h-8 rounded-lg border border-zinc-700 bg-[#08090d] px-2.5 text-xs text-white outline-none focus:border-[#8b5cf6]"
                        />
                        <input
                          value={st.actionPayload}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, actionPayload: val } : s))
                            );
                          }}
                          placeholder="Action payload instructions"
                          className="h-8 rounded-lg border border-zinc-700 bg-[#08090d] px-2.5 text-xs text-white outline-none focus:border-[#8b5cf6]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#8b5cf6] px-4 py-2 font-extrabold text-white shadow hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Deploy Sequence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
