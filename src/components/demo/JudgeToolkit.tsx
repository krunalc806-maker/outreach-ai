"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Barcode,
  CheckCircle2,
  Cpu,
  FileCheck2,
  FileDown,
  Flame,
  IndianRupee,
  Layers,
  Play,
  Printer,
  QrCode,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Truck,
  Volume2,
  Zap,
} from "lucide-react";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

export default function JudgeToolkit() {
  const { theme } = useWorkspaceTheme();

  // Active Tool Tab
  const [activeTab, setActiveTab] = useState<"simulator" | "notice" | "roi">("simulator");

  // --- 1. RAIL SIMULATOR STATE ---
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeRailEvent, setActiveRailEvent] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<
    { timestamp: string; rail: string; message: string; payload?: any; level: "info" | "success" | "warn" | "error" }[]
  >([
    {
      timestamp: "10:14:02.812",
      rail: "SYSTEM",
      message: "Autonomous Multi-Rail Sandbox Interceptor initialized. Awaiting event triggers...",
      level: "info",
    },
  ]);

  const triggerRailSimulation = (eventType: "delhivery" | "pinelabs" | "gnani" | "statutory") => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveRailEvent(eventType);

    const now = () => new Date().toISOString().split("T")[1].slice(0, 12);

    if (eventType === "delhivery") {
      setTerminalLogs((prev) => [
        {
          timestamp: now(),
          rail: "DELHIVERY_WEBHOOK",
          message: "Incoming Webhook: SCAN_EXCEPTION received for AWB #DEL-984210-IN",
          payload: { awb: "DEL-984210-IN", status: "NDR_CUSTOMER_UNREACHABLE", rider_id: "DEL-RID-8841", hub: "BLR_INDIRANAGAR" },
          level: "warn",
        },
        ...prev,
      ]);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "AUDIT_ENGINE",
            message: "Anomaly Detected: Rider marked NDR with zero telecom call logs. Triggering Hub Supervisor Escalation.",
            level: "error",
          },
          ...prev,
        ]);
      }, 700);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "DELHIVERY_RAIL",
            message: "Autonomous Override Executed: Re-attempt scheduled with Verified Landmark. SLA restored.",
            level: "success",
          },
          ...prev,
        ]);
        setIsSimulating(false);
      }, 1600);
    } else if (eventType === "pinelabs") {
      setTerminalLogs((prev) => [
        {
          timestamp: now(),
          rail: "PINELABS_WEBHOOK",
          message: "Settlement Audit: TxID #PL-TX-998241 stuck in ACQUIRER_PENDING for > 72 hours",
          payload: { txId: "PL-TX-998241", amount: 3499, merchant: "Zara India", method: "UPI_AUTOPAY" },
          level: "warn",
        },
        ...prev,
      ]);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "BANKING_SWITCH",
            message: "NPCI Immediate Settlement Token generated. Intercepting acquirer nodal escrow account.",
            level: "info",
          },
          ...prev,
        ]);
      }, 700);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "PINELABS_RAIL",
            message: "Settlement Complete: ₹3,499 credited to consumer. Bank UTR #423891004812 verified.",
            level: "success",
          },
          ...prev,
        ]);
        setIsSimulating(false);
      }, 1600);
    } else if (eventType === "gnani") {
      setTerminalLogs((prev) => [
        {
          timestamp: now(),
          rail: "GNANI_VOICE",
          message: "Incoming Regional Voice Stream (Hinglish): 'Mera refund Indiranagar Indiapost/Zara ka phasa hua hai...'",
          payload: { durationSeconds: 24, language: "hi-IN", confidence: 0.96 },
          level: "info",
        },
        ...prev,
      ]);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "ASR_SEMANTIC",
            message: "Entities Extracted: Merchant='Zara', Category='REFUND_DELAY', Amount='₹3,499', Location='Indiranagar'",
            level: "info",
          },
          ...prev,
        ]);
      }, 700);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "AGENT_ORCHESTRATOR",
            message: "Structured Case Created. Automated Task Plan deployed across Logistics & Payment Rails.",
            level: "success",
          },
          ...prev,
        ]);
        setIsSimulating(false);
      }, 1500);
    } else if (eventType === "statutory") {
      setTerminalLogs((prev) => [
        {
          timestamp: now(),
          rail: "STATUTORY_RAIL",
          message: "Evaluating SLA breach under Consumer Protection Act (2019) & E-Commerce Rules (2020)...",
          level: "warn",
        },
        ...prev,
      ]);

      setTimeout(() => {
        setTerminalLogs((prev) => [
          {
            timestamp: now(),
            rail: "LEGAL_ENGINE",
            message: "Formal Section 2(47) Statutory Notice synthesized with cryptographic timestamp & QR audit seal.",
            level: "success",
          },
          ...prev,
        ]);
        setIsSimulating(false);
      }, 1200);
    }
  };

  // --- 2. STATUTORY NOTICE GENERATOR STATE ---
  const [noticeOrder, setNoticeOrder] = useState("ZARA-984210");
  const [noticeAmount, setNoticeAmount] = useState("3499");
  const [noticeMerchant, setNoticeMerchant] = useState("Zara India (Inditex Trent Retail)");
  const [noticeConsumer, setNoticeConsumer] = useState("Rahul Sharma");

  // --- 3. ROI CALCULATOR STATE ---
  const [disputeVolume, setDisputeVolume] = useState(5000);
  const totalRecoveredRupees = disputeVolume * 3250;
  const consumerHoursSaved = disputeVolume * 4.2;
  const courierSlaPenaltiesSaved = disputeVolume * 450;
  const ncdrcEscalationsAvoided = Math.round(disputeVolume * 0.08);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: theme.badgeBorder, backgroundColor: theme.badgeBg, color: theme.accent }}>
              <Zap size={13} style={{ color: theme.primary }} />
              <span>THE KEN CASE-BUILD COMPETITION 2026 — JUDGE TOOLKIT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Autonomous Multi-Rail Sandbox & Evidence Suite
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              ● Live Sandbox Ready
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/10 pt-2">
          {[
            { id: "simulator", label: "Multi-Rail Webhook Simulator", icon: Cpu },
            { id: "notice", label: "CPA 2019 Formal Legal Notice Generator", icon: Scale },
            { id: "roi", label: "Value Chain & ROI Calculator", icon: IndianRupee },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition active:scale-95 ${
                  isActive ? "text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: isActive ? theme.primary : undefined,
                  boxShadow: isActive ? `0 4px 18px ${theme.glow}` : undefined,
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MULTI-RAIL WEBHOOK SIMULATOR & TERMINAL */}
      {/* ========================================================================= */}
      {activeTab === "simulator" && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-5 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                1. Select Real-Time Rail Trigger
              </h3>
              <p className="text-xs text-zinc-400">
                Click any rail trigger below to simulate incoming carrier webhook events, payment switch timeouts, or multilingual voice transcripts:
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => triggerRailSimulation("delhivery")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-left transition group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Truck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Delhivery Logistics Exception</h4>
                      <p className="text-[11px] text-zinc-300">Simulate Rider False NDR Attempt (AWB #DEL-984210)</p>
                    </div>
                  </div>
                  <Play size={14} className="text-amber-400 shrink-0 group-hover:translate-x-0.5 transition" />
                </button>

                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => triggerRailSimulation("pinelabs")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-left transition group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <IndianRupee size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Pine Labs Payment Gateway Timeout</h4>
                      <p className="text-[11px] text-zinc-300">Simulate 72h Acquirer Stalled Reversal (₹3,499)</p>
                    </div>
                  </div>
                  <Play size={14} className="text-emerald-400 shrink-0 group-hover:translate-x-0.5 transition" />
                </button>

                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => triggerRailSimulation("gnani")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-left transition group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Volume2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Gnani Multilingual Voice ASR</h4>
                      <p className="text-[11px] text-zinc-300">Simulate Hinglish Regional Grievance Ingestion</p>
                    </div>
                  </div>
                  <Play size={14} className="text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition" />
                </button>

                <button
                  type="button"
                  disabled={isSimulating}
                  onClick={() => triggerRailSimulation("statutory")}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-left transition group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
                      <Scale size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">CPA 2019 SLA Breach Notice</h4>
                      <p className="text-[11px] text-zinc-300">Simulate Formal Legal Demand Generation</p>
                    </div>
                  </div>
                  <Play size={14} className="text-violet-400 shrink-0 group-hover:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          </div>

          {/* Terminal Logs */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#090b10] p-5 shadow-2xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-bold">
                  <Terminal size={15} style={{ color: theme.primary }} />
                  <span>Real-Time Autonomous Execution Graph</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setTerminalLogs([
                      {
                        timestamp: new Date().toISOString().split("T")[1].slice(0, 12),
                        rail: "SYSTEM",
                        message: "Logs cleared. Awaiting event triggers...",
                        level: "info",
                      },
                    ])
                  }
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  Clear Logs
                </button>
              </div>

              <div className="h-[360px] overflow-y-auto space-y-2 text-xs pr-1">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border ${
                      log.level === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : log.level === "error"
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                        : log.level === "warn"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                        : "border-white/5 bg-white/5 text-zinc-300"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-80">
                      <span className="font-bold">[{log.rail}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="mt-1 font-semibold">{log.message}</p>
                    {log.payload && (
                      <pre className="mt-1.5 p-2 rounded-lg bg-black/40 text-[10px] text-zinc-300 overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CPA 2019 FORMAL LEGAL NOTICE GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === "notice" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-12 gap-6">
            {/* Input Config */}
            <div className="md:col-span-4 rounded-3xl border border-white/10 bg-[#0d1017] p-5 space-y-3.5 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider font-mono">Notice Parameters</h3>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Order / Reference ID</label>
                <input
                  type="text"
                  value={noticeOrder}
                  onChange={(e) => setNoticeOrder(e.target.value)}
                  className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] px-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Disputed Amount (INR)</label>
                <input
                  type="text"
                  value={noticeAmount}
                  onChange={(e) => setNoticeAmount(e.target.value)}
                  className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] px-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Opposite Party (Merchant)</label>
                <input
                  type="text"
                  value={noticeMerchant}
                  onChange={(e) => setNoticeMerchant(e.target.value)}
                  className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] px-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-400">Complainant / Consumer Name</label>
                <input
                  type="text"
                  value={noticeConsumer}
                  onChange={(e) => setNoticeConsumer(e.target.value)}
                  className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] px-3 text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-lg transition active:scale-95"
                style={{ backgroundColor: theme.primary, boxShadow: `0 6px 20px ${theme.glow}` }}
              >
                <Printer size={15} />
                <span>Print / Save PDF Legal Notice</span>
              </button>
            </div>

            {/* Document Preview */}
            <div className="md:col-span-8 rounded-3xl border border-white/20 bg-white text-zinc-900 p-6 sm:p-8 shadow-2xl font-serif space-y-4">
              <div className="flex items-center justify-between border-b-2 border-zinc-900 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold uppercase tracking-wide text-zinc-900 font-sans">
                    FORMAL STATUTORY LEGAL DEMAND NOTICE
                  </h3>
                  <p className="text-xs text-zinc-600 font-sans">
                    Under Section 2(47) & Section 38 of the Consumer Protection Act, 2019
                  </p>
                </div>
                <div className="text-right font-sans text-xs text-zinc-500">
                  <p className="font-mono font-bold text-zinc-900">REF: OA/2026/{noticeOrder}</p>
                  <p>Date: {new Date().toLocaleDateString("en-IN")}</p>
                </div>
              </div>

              <div className="text-xs space-y-1 font-sans text-zinc-800">
                <p><strong>TO:</strong> {noticeMerchant}</p>
                <p><strong>FROM:</strong> {noticeConsumer} (Represented by OutreachAI Autonomous Action Agent)</p>
                <p><strong>SUBJECT:</strong> Unlawful Retention of Funds & Deficiency of Service for Order #{noticeOrder}</p>
              </div>

              <div className="text-xs leading-relaxed text-zinc-800 space-y-2">
                <p>
                  1. The Complainant placed Order #{noticeOrder} for an aggregate consideration of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong>. As per the statutory contractual terms, delivery/refund was guaranteed within statutory SLAs.
                </p>
                <p>
                  2. Despite continuous tracking and verified courier scan exceptions, the Opposite Party failed to effectuate delivery and withheld payment reversal exceeding 72 statutory banking hours in explicit violation of <em>RBI Circular DPSS.CO.PD No.629/02.01.014/2019-20</em> and <em>Consumer Protection (E-Commerce) Rules, 2020</em>.
                </p>
                <p>
                  3. <strong>DEMAND:</strong> You are hereby formally called upon to credit the principal amount of <strong>₹{Number(noticeAmount).toLocaleString("en-IN")}</strong> along with statutory interest @ 18% p.a. within <strong>48 hours</strong> of receipt of this notice, failing which formal proceedings shall be initiated before the competent <strong>National Consumer Disputes Redressal Commission (NCDRC)</strong> at your sole cost and consequence.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-300 font-sans text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 border border-zinc-400 flex items-center justify-center p-1 rounded bg-zinc-50">
                    <QrCode size={46} className="text-zinc-800" />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    <p className="font-bold text-zinc-800">DIGITALLY SIGNED & VERIFIED</p>
                    <p>Hash: 7f8a9e20bc41d283</p>
                    <p>OutreachAI Case Node #8812</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-900">For Complainant</p>
                  <p className="text-zinc-500 italic">{noticeConsumer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MACRO VALUE CHAIN & ROI CALCULATOR */}
      {/* ========================================================================= */}
      {activeTab === "roi" && (
        <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Macroeconomic Friction & Value Unlocked Calculator</h3>
            <p className="text-xs text-zinc-400">
              Drag the volume slider below to model aggregate consumer savings, courier SLA efficiencies, and court congestion avoidance across India:
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#11141c] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300 uppercase font-mono">Monthly Consumer Dispute Ingestion:</span>
              <span className="text-xl font-extrabold text-white" style={{ color: theme.accent }}>
                {disputeVolume.toLocaleString("en-IN")} Disputes / Month
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={disputeVolume}
              onChange={(e) => setDisputeVolume(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-zinc-700 appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-zinc-500">
              <span>500 Disputes</span>
              <span>25,000 Disputes</span>
              <span>50,000 Disputes</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase font-mono">Capital Recovered</span>
              <p className="text-2xl font-extrabold text-white">₹{(totalRecoveredRupees / 100000).toFixed(2)} Lakhs</p>
              <p className="text-[10px] text-zinc-400 font-mono">Direct to verified consumer bank accounts</p>
            </div>

            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-1">
              <span className="text-[11px] font-bold text-cyan-400 uppercase font-mono">Consumer Hours Saved</span>
              <p className="text-2xl font-extrabold text-white">{consumerHoursSaved.toLocaleString("en-IN")} Hours</p>
              <p className="text-[10px] text-zinc-400 font-mono">Zero hold time on IVRs & call centers</p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase font-mono">SLA Losses Avoided</span>
              <p className="text-2xl font-extrabold text-white">₹{(courierSlaPenaltiesSaved / 100000).toFixed(2)} Lakhs</p>
              <p className="text-[10px] text-zinc-400 font-mono">Courier & Merchant friction eliminated</p>
            </div>

            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-1">
              <span className="text-[11px] font-bold text-violet-400 uppercase font-mono">NCDRC Cases De-escalated</span>
              <p className="text-2xl font-extrabold text-white">{ncdrcEscalationsAvoided.toLocaleString("en-IN")} Cases</p>
              <p className="text-[10px] text-zinc-400 font-mono">Pre-litigation autonomous resolution</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

