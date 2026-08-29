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
    const loaded = getStoredCases();
    setCases(loaded);
    if (loaded.length > 0 && !activeCaseId) {
      setActiveCaseId(loaded[0].id);
    }

    // Synchronize latest cases from persistent Supabase database
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cases) && data.cases.length > 0) {
          setCases(data.cases);
          if (!activeCaseId) {
            setActiveCaseId(data.cases[0].id);
          }
        }
      })
      .catch(() => null);
  }, []);

  const activeCase = cases.find((c) => c.id === activeCaseId) || cases[0];

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
              {opportunity.subtitle} — Integrated across <span className="font-semibold text-zinc-200">Delhivery Logistics</span>, <span className="font-semibold text-zinc-200">Pine Labs Payments</span> & <span className="font-semibold text-zinc-200">Gnani Voice</span> rails.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Consumer Intake Card: "Tell the agent what you need" */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8b5cf6] text-white font-bold shadow-md shadow-[#8b5cf6]/25">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm sm:text-base">Tell the Agent What You Need</h2>
              <p className="text-xs text-zinc-400">Describe your dispute, delayed refund, or NDR delivery issue</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
            <span>Agent Rails Active</span>
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
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                    isActive
                      ? "text-white font-extrabold shadow-md"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                  style={{
                    backgroundColor: isActive ? theme.primary : undefined,
                    boxShadow: isActive ? `0 4px 16px ${theme.glow}` : undefined,
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* TAB 1: TASK PLAN */}
          {activeTab === "plan" && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Dynamic Execution Plan</h3>
                    <p className="text-xs text-zinc-400">Autonomous steps formulated based on intent & statutory policy</p>
                  </div>
                  <button
                    onClick={() => {
                      const firstPending = activeCase.planSteps.find((s) => s.status === "PENDING");
                      if (firstPending) handleExecuteStep(firstPending.id);
                    }}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/25 hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
                  >
                    <Play size={12} /> Run Next Step
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeCase.planSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`rounded-2xl border p-4 transition ${
                        step.status === "COMPLETED"
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : step.status === "IN_PROGRESS"
                          ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/5"
                          : step.status === "REQUIRES_APPROVAL"
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                              step.status === "COMPLETED"
                                ? "bg-emerald-500 text-black"
                                : step.status === "IN_PROGRESS"
                                ? "bg-[#8b5cf6] text-white animate-pulse"
                                : "bg-zinc-800 text-zinc-300"
                            }`}
                          >
                            {step.status === "COMPLETED" ? <CheckCircle2 size={14} /> : index + 1}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-white text-xs sm:text-sm">{step.title}</span>
                              <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono uppercase text-[#a78bfa] border border-white/5">
                                {step.rail} rail
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  step.riskLevel === "HIGH"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : step.riskLevel === "MEDIUM"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-blue-500/20 text-blue-300"
                                }`}
                              >
                                {step.riskLevel} RISK
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-zinc-400">{step.description}</p>
                            {step.executionNote && (
                              <p className="mt-2 text-xs font-mono text-emerald-300 bg-black/40 p-2 rounded-lg border border-emerald-500/20">
                                ↳ Result: {step.executionNote}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {step.status === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handleExecuteStep(step.id)}
                              disabled={isProcessing}
                              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 active:scale-95"
                            >
                              Execute Step
                            </button>
                          )}
                          {step.status === "REQUIRES_APPROVAL" && (
                            <button
                              type="button"
                              onClick={() => setActiveTab("approvals")}
                              className="rounded-xl bg-amber-500 text-black font-bold px-3 py-1.5 text-xs animate-pulse active:scale-95"
                            >
                              Requires Approval
                            </button>
                          )}
                          {step.status === "COMPLETED" && (
                            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPROVALS */}
          {activeTab === "approvals" && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white">Human-in-the-Loop Action Approvals</h3>
                  <p className="text-xs text-zinc-400">
                    High-risk and financial actions require explicit consumer authorization before the agent interacts with payment or legal rails.
                  </p>
                </div>

                {activeCase.approvals.length === 0 ? (
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center text-zinc-400 text-xs">
                    No pending approval requests.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeCase.approvals.map((approval) => (
                      <div
                        key={approval.id}
                        className={`rounded-2xl border p-5 transition ${
                          approval.status === "PENDING"
                            ? "border-amber-500/40 bg-[#161510] shadow-xl"
                            : approval.status === "APPROVED"
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-rose-500/30 bg-rose-500/5"
                        }`}
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.2 text-[10px] font-bold text-rose-300">
                                {approval.riskLevel} RISK ACTION
                              </span>
                              <span className="text-xs text-zinc-400">
                                Status: <span className="font-semibold text-white">{approval.status}</span>
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white">{approval.title}</h4>
                            <p className="text-xs text-zinc-300">{approval.description}</p>
                            <div className="rounded-xl bg-black/50 p-2.5 border border-white/5 text-xs space-y-0.5">
                              <p className="font-semibold text-[#a78bfa] text-[11px]">Impact Analysis:</p>
                              <p className="text-zinc-300 text-[11px]">{approval.impactAnalysis}</p>
                            </div>
                          </div>

                          {approval.status === "PENDING" ? (
                            <div className="flex sm:flex-col gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleApproval(approval.id, "APPROVED")}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-black font-extrabold px-4 py-2 text-xs shadow hover:bg-emerald-400 active:scale-95"
                              >
                                <CheckCircle2 size={13} /> Approve Action
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApproval(approval.id, "REJECTED")}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white active:scale-95"
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          ) : (
                            <div className="shrink-0 text-right">
                              <span
                                className={`text-xs font-semibold ${
                                  approval.status === "APPROVED" ? "text-emerald-400" : "text-rose-400"
                                }`}
                              >
                                {approval.decisionNote}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && <CaseTimeline agentCase={activeCase} />}

          {/* TAB 4: RAIL TELEMETRY */}
          {activeTab === "rails" && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Live Rail Telemetry</h3>
                    <p className="text-xs text-zinc-400">Verifiable logs across Delhivery, Pine Labs, and Gnani infrastructure</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-lg border border-white/10 bg-[#11141c] px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                      Delhivery: SANDBOX_SIMULATED
                    </span>
                    <span className="rounded-lg border border-white/10 bg-[#11141c] px-2 py-0.5 text-[10px] text-zinc-300 font-mono">
                      Pine Labs: SANDBOX_SIMULATED
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  {activeCase.auditLog.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-white/5 bg-[#11141c] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-[11px]">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        {log.rail && (
                          <span className="rounded bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 px-1.5 py-0.2 text-[#a78bfa] uppercase font-bold text-[9px]">
                            {log.rail}
                          </span>
                        )}
                        <span className="font-semibold text-white text-xs">{log.title}:</span>
                        <span className="text-zinc-300 text-xs">{log.detail}</span>
                      </div>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400 shrink-0">
                        {log.mode}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FOLLOW-UP ENGINE */}
          {activeTab === "followup" && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Autonomous Follow-Up State Machine</h3>
                    <p className="text-xs text-zinc-400">
                      Bounded retry policies with statutory escalation to National Consumer Helpline
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFollowUpTick(false)}
                      disabled={isProcessing || activeCase.followUp.status === "RESOLVED"}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10 active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={isProcessing ? "animate-spin" : ""} />
                      Simulate Follow-Up Tick
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFollowUpTick(true)}
                      disabled={isProcessing || activeCase.followUp.status === "RESOLVED"}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-black font-extrabold px-3 py-1.5 text-xs hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 size={12} />
                      Simulate Merchant UTR Settlement
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs text-zinc-400">Follow-Up Attempts</span>
                    <p className="mt-1.5 text-xl font-bold text-white">
                      {activeCase.followUp.currentAttempt} / {activeCase.followUp.maxAttempts}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Bounded retry limit enforced</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs text-zinc-400">Next Scheduled Check</span>
                    <p className="mt-1.5 text-xs font-semibold text-[#a78bfa]">
                      {activeCase.followUp.nextScheduledAt
                        ? new Date(activeCase.followUp.nextScheduledAt).toLocaleTimeString()
                        : "None Scheduled"}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Exponential backoff active</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-xs text-zinc-400">State Machine Status</span>
                    <p className="mt-1.5 text-xs font-semibold text-emerald-400">
                      {activeCase.followUp.status}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{activeCase.followUp.stopReason || "Monitoring responses"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AGENT DEFENSE */}
          {activeTab === "defense" && <AgentVsAppComparison />}
        </div>
      )}

      {/* Clean Empty State when no cases exist */}
      {!activeCase && (
        <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-8 text-center space-y-3 shadow-xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8b5cf6]/20 text-[#a78bfa]">
            <Workflow size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No Active Grievance Cases</h3>
          <p className="max-w-md mx-auto text-xs text-zinc-400">
            Type your delayed refund, false NDR, or merchant dispute in the intake box above or click a sample case to deploy your autonomous consumer grievance agent.
          </p>
        </div>
      )}
    </div>
  );
}
