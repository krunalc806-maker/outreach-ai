"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  Flame,
  HelpCircle,
  IndianRupee,
  Mic,
  Package,
  Play,
  RefreshCw,
  Scale,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  Volume2,
  Workflow,
  XCircle,
} from "lucide-react";
import { AgentCase, HumanApprovalRequest, TaskPlanStep } from "@/lib/agent/types";
import { agentOrchestrator } from "@/lib/agent/orchestrator";
import { followUpEngine } from "@/lib/agent/followup";
import { getStoredCases, saveStoredCase } from "@/lib/agent/memory";
import { getSelectedOpportunity } from "@/config/opportunity";
import CaseTimeline from "./CaseTimeline";
import AgentVsAppComparison from "./AgentVsAppComparison";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

export default function CaseWorkspace() {
  const { theme } = useWorkspaceTheme();
  const opportunity = getSelectedOpportunity();
  const [cases, setCases] = useState<AgentCase[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<"plan" | "approvals" | "timeline" | "rails" | "followup" | "defense">("plan");
  const [simulatedVoicePlaying, setSimulatedVoicePlaying] = useState(false);

  const syncCaseToDb = async (caseData: AgentCase) => {
    saveStoredCase(caseData);
    try {
      await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseData),
      });
    } catch {
      // Graceful offline fallback
    }
  };

  useEffect(() => {
    // 1. Check local storage
    const loaded = getStoredCases();
    if (loaded.length > 0) {
      setCases(loaded);
      setActiveCaseId(loaded[0].id);
    }

    // 2. Synchronize latest cases from persistent Supabase database
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cases)) {
          setCases(data.cases);
          if (data.cases.length > 0 && (!activeCaseId || !data.cases.some((c: any) => c.id === activeCaseId))) {
            setActiveCaseId(data.cases[0].id);
          }
        }
      })
      .catch(() => null);
  }, []);

  const activeCase = cases.find((c) => c.id === activeCaseId) || (cases.length > 0 ? cases[0] : null);

  const handleCreateCase = async (promptText?: string) => {
    const text = promptText || inputPrompt;
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const newCase = await agentOrchestrator.createCaseFromInput(text);
      setCases((prev) => [newCase, ...prev.filter((c) => c.id !== newCase.id)]);
      setActiveCaseId(newCase.id);
      setInputPrompt("");
      await syncCaseToDb(newCase);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteStep = async (stepId: string) => {
    if (!activeCase) return;
    setIsProcessing(true);
    try {
      const updated = await agentOrchestrator.executeStep(activeCase.id, stepId);
      setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      await syncCaseToDb(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproval = async (approvalId: string, decision: "APPROVED" | "REJECTED") => {
    if (!activeCase) return;
    setIsProcessing(true);
    try {
      const updated = await agentOrchestrator.handleApprovalDecision(activeCase.id, approvalId, decision);
      setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      await syncCaseToDb(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFollowUpTick = async (simulateMerchantRefund = false) => {
    if (!activeCase) return;
    setIsProcessing(true);
    try {
      const simResponse = simulateMerchantRefund ? "Refund processed with Bank UTR 423891004812" : undefined;
      const result = await followUpEngine.processFollowUpTick(activeCase, simResponse);
      const updatedCase: AgentCase = {
        ...activeCase,
        followUp: result.nextState,
        auditLog: [...activeCase.auditLog, result.auditEntry],
        status: result.resolutionConfirmed ? "RESOLVED" : activeCase.status,
        resolution: result.resolutionConfirmed
          ? {
              resolvedAt: new Date().toISOString(),
              summary: "Merchant confirmed refund credit. Bank UTR #423891004812 verified on Pine Labs rail.",
              outcomeType: "REFUND_PROCESSED",
              moneyRecovered: activeCase.extractedEntities.amount || 3499,
              timeSavedMinutes: 180,
              railConfirmations: [{ rail: "Pine Labs", referenceNumber: "UTR-423891004812" }],
            }
          : activeCase.resolution,
      };
      await syncCaseToDb(updatedCase);
      setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Banner: Real Indian Consumer Problem */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
                <Sparkles size={12} /> The Ken Case Competition 2026
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-300">
                <ShieldCheck size={12} /> Autonomous Action Agent
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {opportunity.title}
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-zinc-400">
              State any delivery exception, false NDR attempt, or delayed refund in natural language (English or Hindi). OutreachAI autonomously orchestrates across courier and banking rails to secure verified resolution.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.primary }} />
            <span>{cases.length} Active Cases</span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. My Delhivery package with AWB #DEL-984210 is stuck marked as 'Customer Not Reachable' for 4 days, and Zara hasn't processed my ₹3,499 refund..."
              className="w-full rounded-2xl border border-zinc-700 bg-[#11141c] p-4 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSimulatedVoicePlaying(true);
                  setInputPrompt("Mera Delhivery package Indiranagar Bengaluru mein phasa hua hai aur ₹3,499 ka refund abhi tak nahi aaya.");
                  setTimeout(() => setSimulatedVoicePlaying(false), 1500);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
                title="Simulate regional voice input via Gnani Voice Rail"
              >
                <Mic size={13} className={simulatedVoicePlaying ? "text-red-400 animate-pulse" : "text-[#a78bfa]"} />
                <span className="text-[11px]">{simulatedVoicePlaying ? "Listening (Hinglish)..." : "Voice Input"}</span>
              </button>
              <button
                type="button"
                disabled={isProcessing || !inputPrompt.trim()}
                onClick={() => handleCreateCase()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                <span>Deploy Agent</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-xs font-semibold text-zinc-500">Sample cases:</span>
            {opportunity.samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleCreateCase(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:text-white active:scale-95"
              >
                {prompt.slice(0, 50)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Selector Pills if Multiple Cases */}
      {cases.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-zinc-500 shrink-0">Your Cases ({cases.length}):</span>
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition shrink-0 flex items-center gap-2 ${
                c.id === (activeCase?.id || "")
                  ? "bg-white/10 text-white border border-white/20 shadow-sm"
                  : "bg-white/5 text-zinc-400 border border-white/5 hover:text-white"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.status === "RESOLVED" ? "#10B981" : theme.primary }}
              />
              <span className="truncate max-w-[200px]">{c.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Empty State when 0 cases exist */}
      {!activeCase && cases.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-8 sm:p-12 text-center shadow-2xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5" style={{ color: theme.primary }}>
            <Package size={28} />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white sm:text-2xl">No Active Cases Yet</h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Describe your consumer dispute, delivery exception, or delayed refund above to deploy your autonomous resolution agent.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => handleCreateCase("My Delhivery package with AWB #DEL-984210 is stuck in false NDR and Zara hasn't processed my ₹3,499 refund.")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition active:scale-95"
            >
              <Truck size={14} className="text-[#a78bfa]" />
              <span>Resolve Delhivery NDR & Refund (₹3,499)</span>
            </button>
            <button
              onClick={() => handleCreateCase("Pine Labs transaction failed at merchant POS but ₹1,850 was debited with no auto-reversal.")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition active:scale-95"
            >
              <IndianRupee size={14} className="text-emerald-400" />
              <span>Claim Failed Payment Reversal (₹1,850)</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Case Workspace Card */}
      {activeCase && (
        <div className="space-y-6">
          {/* Case Header & Status Summary */}
          <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-zinc-800 px-2.5 py-0.5 text-xs font-mono text-zinc-400">
                    ID: {activeCase.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
                      activeCase.status === "RESOLVED"
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : activeCase.status === "AWAITING_HUMAN_APPROVAL"
                        ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                        : "border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#a78bfa]"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {activeCase.status.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      activeCase.riskLevel === "HIGH"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    <ShieldAlert size={12} /> {activeCase.riskLevel} Risk Profile
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white sm:text-2xl">{activeCase.title}</h2>
                <p className="text-xs sm:text-sm text-zinc-300 bg-[#11141c] p-3 rounded-xl border border-white/5">
                  <span className="font-semibold text-[#a78bfa]">Agent Understanding: </span>
                  {activeCase.agentUnderstandingSummary}
                </p>
              </div>

              {/* Resolution Metrics Pill if Resolved */}
              {activeCase.resolution && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 min-w-56 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    <CheckCircle2 size={15} className="text-emerald-400" />
                    Problem Resolved
                  </div>
                  <p className="text-xs text-zinc-300">
                    Recovered: <span className="font-bold text-white">₹{activeCase.resolution.moneyRecovered?.toLocaleString("en-IN") || "3,499"}</span>
                  </p>
                  <p className="text-xs text-zinc-300">
                    Consumer Time Saved: <span className="font-bold text-white">{activeCase.resolution.timeSavedMinutes} mins</span>
                  </p>
                </div>
              )}
            </div>

            {/* Extracted Context Entities Bar */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-4">
              <div className="rounded-xl bg-[#11141c] p-3 border border-white/5">
                <span className="text-[11px] text-zinc-500 block">Merchant / Target</span>
                <span className="font-semibold text-white text-xs sm:text-sm">{activeCase.extractedEntities.merchant || "Zara India"}</span>
              </div>
              <div className="rounded-xl bg-[#11141c] p-3 border border-white/5">
                <span className="text-[11px] text-zinc-500 block">Waybill / AWB</span>
                <span className="font-semibold text-zinc-200 text-xs sm:text-sm font-mono">{activeCase.extractedEntities.awbNumber || "DEL-984210-IN"}</span>
              </div>
              <div className="rounded-xl bg-[#11141c] p-3 border border-white/5">
                <span className="text-[11px] text-zinc-500 block">Disputed Amount</span>
                <span className="font-semibold text-[#a78bfa] text-xs sm:text-sm">₹{(activeCase.extractedEntities.amount || 3499).toLocaleString("en-IN")}</span>
              </div>
              <div className="rounded-xl bg-[#11141c] p-3 border border-white/5">
                <span className="text-[11px] text-zinc-500 block">Category</span>
                <span className="font-semibold text-zinc-300 text-xs sm:text-sm">{activeCase.extractedEntities.issueCategory || "DELIVERY_NDR"}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-2">
            {[
              { id: "plan", label: "Dynamic Task Plan", icon: Workflow, badge: activeCase.planSteps.length },
              { id: "approvals", label: "Human Approvals", icon: ShieldCheck, badge: activeCase.approvals.filter((a) => a.status === "PENDING").length },
              { id: "timeline", label: "Case Timeline", icon: Clock, badge: activeCase.auditLog.length },
              { id: "rails", label: "Rail Audit & Telemetry", icon: Truck },
              { id: "followup", label: "Follow-Up Engine", icon: RefreshCw, badge: `${activeCase.followUp.currentAttempt}/${activeCase.followUp.maxAttempts}` },
              { id: "defense", label: "Agent Defense", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition active:scale-95 whitespace-nowrap ${
                    isActive
                      ? "border border-white/20 bg-white/10 text-white shadow-sm"
                      : "border border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{
                    borderColor: isActive ? theme.primary : undefined,
                    color: isActive ? "#ffffff" : undefined,
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? theme.primary : "#A1A1AA" }} />
                  <span>{tab.label}</span>
                  {typeof tab.badge === "number" && tab.badge > 0 && (
                    <span className="rounded-full bg-white/15 px-1.5 py-0.2 text-[10px] font-bold">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Dynamic Task Plan */}
          {activeTab === "plan" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Autonomous Execution Graph</h3>
                  <p className="text-xs text-zinc-400">
                    The agent breaks down the consumer grievance into sequential machine-executable rail actions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeCase.planSteps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      step.status === "COMPLETED"
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : step.status === "REQUIRES_APPROVAL"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-white/10 bg-[#0d0d12]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            step.status === "COMPLETED"
                              ? "bg-emerald-500 text-white"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {step.status === "COMPLETED" ? <CheckCircle2 size={14} /> : idx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-white text-sm">{step.title}</span>
                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 uppercase">
                              Rail: {step.rail}
                            </span>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                step.riskLevel === "HIGH"
                                  ? "bg-rose-500/20 text-rose-300"
                                  : "bg-blue-500/20 text-blue-300"
                              }`}
                            >
                              {step.riskLevel} Risk
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-1">{step.description}</p>
                          {step.executionNote && (
                            <p className="text-xs text-emerald-300/90 font-mono mt-1 bg-black/40 p-2 rounded-lg border border-white/5">
                              ✓ {step.executionNote}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {step.status === "PENDING" && (
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleExecuteStep(step.id)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition active:scale-95 disabled:opacity-50"
                          >
                            <Play size={12} /> Execute Step
                          </button>
                        )}
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            step.status === "COMPLETED"
                              ? "text-emerald-400"
                              : step.status === "REQUIRES_APPROVAL"
                              ? "text-amber-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {step.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Human Approvals */}
          {activeTab === "approvals" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Bounded Autonomy: Human Authorizations</h3>
                <p className="text-xs text-zinc-400">
                  The agent requires explicit 1-tap consent before triggering irreversible financial or legal actions.
                </p>
              </div>

              {activeCase.approvals.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 bg-[#0d0d12] rounded-2xl border border-white/5">
                  No approval requests pending for this case.
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCase.approvals.map((appr) => (
                    <div
                      key={appr.id}
                      className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={16} className="text-amber-400" />
                          <h4 className="font-bold text-white text-sm">{appr.title}</h4>
                        </div>
                        <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                          {appr.status}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-zinc-500 block">Proposed Action</span>
                          <p className="text-zinc-200">{appr.proposedAction}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-zinc-500 block">Impact & Risk Analysis</span>
                          <p className="text-zinc-200">{appr.impactAnalysis}</p>
                        </div>
                      </div>

                      {appr.status === "PENDING" && (
                        <div className="flex items-center justify-end gap-3 border-t border-amber-500/20 pt-3">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleApproval(appr.id, "REJECTED")}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition active:scale-95"
                          >
                            Reject Action
                          </button>
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleApproval(appr.id, "APPROVED")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition active:scale-95"
                          >
                            <CheckCircle2 size={13} /> Authorize Instant Settlement
                          </button>
                        </div>
                      )}

                      {appr.status !== "PENDING" && (
                        <p className="text-xs font-mono text-zinc-400 border-t border-amber-500/20 pt-2">
                          Decision recorded: <span className="text-white font-semibold">{appr.status}</span> ({appr.decisionNote})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Case Timeline */}
          {activeTab === "timeline" && (
            <CaseTimeline agentCase={activeCase} />
          )}

          {/* Tab 4: Rail Audit & Telemetry */}
          {activeTab === "rails" && (
            <div className="grid gap-4 md:grid-cols-3">
              {/* Rail 1: Delhivery Logistics */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-[#a78bfa]" />
                    <span className="font-bold text-white text-xs">Delhivery Logistics Rail</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-mono">
                    CONNECTED
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>AWB Number:</span>
                    <span className="font-mono text-zinc-200">{activeCase.extractedEntities.awbNumber || "DEL-984210-IN"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hub Station:</span>
                    <span className="text-zinc-200">Indiranagar Bengaluru (560038)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NDR Exception:</span>
                    <span className="text-rose-400 font-semibold">2 False Claims Detected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Override Status:</span>
                    <span className="text-emerald-400 font-semibold">Priority Re-Attempt Scheduled</span>
                  </div>
                </div>
              </div>

              {/* Rail 2: Pine Labs Gateway */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <IndianRupee size={15} className="text-emerald-400" />
                    <span className="font-bold text-white text-xs">Pine Labs Settlement Rail</span>
                  </div>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-mono">
                    CONNECTED
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Gateway TxID:</span>
                    <span className="font-mono text-zinc-200">{activeCase.extractedEntities.transactionId || "PL-TX-998241"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant Acquirer:</span>
                    <span className="text-zinc-200">HDFC Bank Gateway</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Refund SLA:</span>
                    <span className="text-rose-400 font-semibold">Exceeded by 74 hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement UTR:</span>
                    <span className="font-mono text-emerald-400 font-bold">423891004812 (Verified)</span>
                  </div>
                </div>
              </div>

              {/* Rail 3: Gnani Regional Voice */}
              <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <Volume2 size={15} className="text-cyan-400" />
                    <span className="font-bold text-white text-xs">Gnani Voice Rail</span>
                  </div>
                  <span className="rounded bg-cyan-500/20 text-cyan-300 text-[10px] px-2 py-0.5 font-mono">
                    ACTIVE
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-zinc-400">
                  <div className="flex justify-between">
                    <span>Language Detected:</span>
                    <span className="text-zinc-200 font-semibold">Hinglish / Kannada</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audio Intent:</span>
                    <span className="text-zinc-200">Delivery Landmark Confirmation</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ASR Confidence:</span>
                    <span className="text-emerald-400 font-mono">98.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hub IVR Dispatch:</span>
                    <span className="text-zinc-200 font-mono">Automated Prompt Sent</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Follow-Up Engine */}
          {activeTab === "followup" && (
            <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Bounded Escalation DAG Engine</h3>
                  <p className="text-xs text-zinc-400">
                    Schedules automated follow-up probes citing statutory SLAs under the Consumer Protection Act (2019).
                  </p>
                </div>
                <span className="rounded-full bg-[#8b5cf6]/20 px-3 py-1 text-xs font-mono text-[#a78bfa]">
                  Attempt {activeCase.followUp.currentAttempt} of {activeCase.followUp.maxAttempts}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-[#11141c] p-3 border border-white/5 space-y-1">
                  <span className="text-zinc-500 block">Probe Interval</span>
                  <span className="text-white font-semibold">Every 2 Hours (120 min)</span>
                </div>
                <div className="rounded-xl bg-[#11141c] p-3 border border-white/5 space-y-1">
                  <span className="text-zinc-500 block">Next Scheduled Check</span>
                  <span className="text-white font-semibold font-mono">In 42 minutes</span>
                </div>
                <div className="rounded-xl bg-[#11141c] p-3 border border-white/5 space-y-1">
                  <span className="text-zinc-500 block">Termination Condition</span>
                  <span className="text-emerald-400 font-semibold">Verified Bank UTR or Legal Filing</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleFollowUpTick(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition active:scale-95 disabled:opacity-50"
                >
                  Simulate Follow-Up Tick
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleFollowUpTick(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={13} /> Simulate Merchant Resolution
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: Agent Defense & Why An App Fails */}
          {activeTab === "defense" && (
            <AgentVsAppComparison />
          )}
        </div>
      )}
    </div>
  );
}
