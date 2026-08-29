"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Play,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  IndianRupee,
  Volume2,
} from "lucide-react";
import JudgeToolkit from "./JudgeToolkit";

interface DemoStep {
  title: string;
  subtitle: string;
  detail: string;
  railBadge?: string;
  riskBadge?: string;
  isApprovalStep?: boolean;
}

const DEMO_SCENARIOS = [
  {
    id: "ecommerce-ndr",
    name: "Scenario A: Stuck Delhivery NDR & Delayed Refund (₹3,499)",
    rails: ["Delhivery Logistics", "Pine Labs Payment"],
    description: "Consumer ordered ₹3,499 apparel from Zara. Courier marked 2 false NDR attempts. Merchant refund stuck for 4 days.",
    steps: [
      {
        title: "1. Consumer Explains Problem",
        subtitle: "Natural Language Ingestion (Voice/Text)",
        detail: '"My ₹3,499 order never arrived. The courier says I was unavailable but nobody called me. I want my money back."',
      },
      {
        title: "2. Autonomous Intent & Context Analysis",
        subtitle: "Entity Extraction & Strategy Formulation",
        detail: "Extracted: Merchant: Zara India | AWB: DEL-984210-IN | Amount: ₹3,499 | Issue: 2 False NDR Exceptions + Delayed Reversal.",
      },
      {
        title: "3. Delhivery Rail Logistics Verification",
        subtitle: "Querying Logistics Rail",
        railBadge: "Delhivery Rail (Sandbox Simulated)",
        detail: "AWB #DEL-984210-IN audited at Bengaluru Hub. Identified 2 false-attempt exceptions marked by field rider Raju Kumar without call logs.",
      },
      {
        title: "4. Pine Labs Payment Switch Audit",
        subtitle: "Payment Gateway Check",
        railBadge: "Pine Labs Rail (Sandbox Simulated)",
        detail: "Acquirer settlement stuck > 72 hours on TxID #PL-TX-998241. Statutory SLA violation confirmed under RBI / CPA guidelines.",
      },
      {
        title: "5. Human-in-the-Loop Approval Checkpoint",
        subtitle: "High-Risk Action Authorization",
        riskBadge: "HIGH RISK (Explicit User Consent Required)",
        isApprovalStep: true,
        detail: "The agent requests authorization to claim direct refund settlement of ₹3,499 to your verified bank account via Pine Labs rail.",
      },
      {
        title: "6. Autonomous Rail Execution & Settlement",
        subtitle: "Instant Fund Credit",
        railBadge: "Pine Labs Banking Switch",
        detail: "Consumer authorized. Cryptographic token generated. Pine Labs rail settled ₹3,499 directly with Bank UTR #423891004812.",
      },
      {
        title: "7. Case Resolution & Impact Summary",
        subtitle: "Measurable Consumer Value",
        detail: "Case Resolved in 4.5 hours (vs 7.2 days manual effort). ₹3,499 recovered, 180 mins consumer time saved.",
      },
    ],
  },
  {
    id: "voice-grievance",
    name: "Scenario B: Multilingual Hindi Flight Grievance (Gnani Voice + Pine Labs)",
    rails: ["Gnani Voice", "Pine Labs Payment"],
    description: "52-year-old Tier-2 consumer had a flight cancelled due to fog; airline deducted ₹4,200 cancellation fee.",
    steps: [
      {
        title: "1. Hindi Voice Input Ingested",
        subtitle: "Gnani Indic Speech-to-Text",
        railBadge: "Gnani Voice Rail",
        detail: '"Mera Indigo flight fog ki wajah se cancel ho gaya tha, par unhone 4200 rupaye refund nahi diye. Kripya refund claim file kijiye."',
      },
      {
        title: "2. Intent Classification & DGCA Rule Lookup",
        subtitle: "Statutory Entitlement Check",
        detail: "Identified: Weather cancellation covered under DGCA Passenger Charter Rule 3.3 (100% full refund mandatory without deduction).",
      },
      {
        title: "3. Autonomous Grievance Call to Airline Line",
        subtitle: "Autonomous Voice Agent Call",
        railBadge: "Gnani Regional Voice Agent",
        detail: "Agent dialed airline grievance hotline (+91 80 4567 8900), presented consumer PNR & DGCA clause, and secured supervisor ticket #SUP-77821.",
      },
      {
        title: "4. Human Consent & Payment Reversal",
        subtitle: "Human-in-the-Loop Confirmation",
        riskBadge: "HIGH RISK",
        isApprovalStep: true,
        detail: "Consumer confirms waiver of voucher and authorizes ₹4,200 direct credit back to primary bank account.",
      },
      {
        title: "5. Resolution & Full Refund Credited",
        subtitle: "Problem Completely Solved",
        detail: "Full ₹4,200 credited to consumer bank account. Consumer spared from navigating English grievance portals.",
      },
    ],
  },
];

export default function CompetitionDemo() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [approvalGranted, setApprovalGranted] = useState(false);
  const [judgeModeOpen, setJudgeModeOpen] = useState(false);

  const scenario = DEMO_SCENARIOS[selectedScenarioIndex];
  const step = scenario.steps[currentStepIndex];
  const isLastStep = currentStepIndex === scenario.steps.length - 1;

  const handleNext = () => {
    if (step.isApprovalStep && !approvalGranted) return;
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setApprovalGranted(false);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setApprovalGranted(false);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Demo Header */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 shadow-2xl space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3 py-0.5 text-xs font-semibold uppercase text-[#d4ff32]">
                <Sparkles size={12} /> The Ken's Case-Build Competition 2026
              </span>
              <button
                type="button"
                onClick={() => setJudgeModeOpen(!judgeModeOpen)}
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold font-mono transition ${
                  judgeModeOpen
                    ? "bg-[#d4ff32] text-black"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                {judgeModeOpen ? "Hide Judge Mode" : "⚖️ Judge Mode (Why This Wins)"}
              </button>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Autonomous Consumer Action Agent in Action
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Watch the agent transition from intent understanding to real rail execution (Delhivery, Pine Labs, Gnani) and verified bank settlement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((sc, idx) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenarioIndex(idx);
                  setCurrentStepIndex(0);
                  setApprovalGranted(false);
                }}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  selectedScenarioIndex === idx
                    ? "bg-[#d4ff32] text-black shadow-md shadow-[#d4ff32]/20"
                    : "border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {sc.name.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* JUDGE MODE PANEL (When Toggled) */}
      {judgeModeOpen && (
        <div className="rounded-3xl border border-[#d4ff32]/40 bg-[#0d0d12] p-6 space-y-4 ring-1 ring-[#d4ff32]/20">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale size={16} className="text-[#d4ff32]" />
              Evaluation Defense: The 5 Fundamental Questions
            </h3>
            <span className="rounded bg-[#d4ff32]/10 border border-[#d4ff32]/30 px-2 py-0.5 text-[10px] font-mono text-[#d4ff32] font-bold">
              KEN 2026 CRITERIA
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
            <div className="rounded-2xl border border-white/5 bg-[#121216] p-3.5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#d4ff32] block">1. WHAT IS THE PROBLEM?</span>
              <p className="text-zinc-300 leading-snug">
                Indian consumers are forced to become the operations team themselves when courier delivery fails (false NDRs) or refunds get stuck across fragmented merchant/courier/gateway silos.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#121216] p-3.5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#d4ff32] block">2. WHAT IS THE INSIGHT?</span>
              <p className="text-zinc-300 leading-snug">
                The consumer should state the outcome they want (<em>"I want my money back"</em>), not operate the system themselves. The agent translates human intent into machine-readable actions across rails.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#121216] p-3.5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#d4ff32] block">3. WHAT ARE THE RAILS?</span>
              <p className="text-zinc-300 leading-snug">
                <strong>Delhivery</strong> for logistics AWB audit; <strong>Pine Labs</strong> for cryptographic refund authorization & settlement; <strong>Gnani</strong> for Indic voice intake.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#121216] p-3.5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-[#d4ff32] block">4. WHO PAYS? (BUSINESS MODEL)</span>
              <p className="text-zinc-300 leading-snug">
                Monetized via B2B merchant dispute resolution infrastructure (lowering NDR return costs) + ₹49 priority consumer protection for instant statutory filings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Overview Bar */}
      <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Scenario:</span>
          <p className="font-bold text-white text-sm">{scenario.name}</p>
          <p className="text-zinc-400">{scenario.description}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {scenario.rails.map((r) => (
            <span key={r} className="rounded-lg bg-zinc-900 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-[#d4ff32]">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Step Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold text-[#d4ff32] uppercase tracking-wider font-mono">
            Step {currentStepIndex + 1} of {scenario.steps.length}
          </span>
          <div className="flex items-center gap-1">
            {scenario.steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? "w-6 bg-[#d4ff32]"
                    : idx < currentStepIndex
                    ? "w-1.5 bg-emerald-400"
                    : "w-1.5 bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="space-y-3.5 min-h-48">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white">{step.title}</h2>
            {step.railBadge && (
              <span className="rounded-full bg-zinc-800 border border-white/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#d4ff32]">
                {step.railBadge}
              </span>
            )}
            {step.riskBadge && (
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                {step.riskBadge}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-zinc-300">{step.subtitle}</p>

          <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 text-xs sm:text-sm leading-relaxed text-zinc-200 shadow-inner">
            {step.detail}
          </div>

          {/* If Approval Step: Interactive Approval Button */}
          {step.isApprovalStep && (
            <div className="rounded-2xl border border-amber-500/30 bg-[#161510] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <ShieldAlert size={16} /> Human-in-the-Loop Consent Required
              </div>
              <p className="text-[11px] text-amber-200/90 leading-snug">
                To protect consumer safety, this financial refund claim cannot proceed automatically without your explicit consent.
              </p>
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setApprovalGranted(true)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold transition ${
                    approvalGranted
                      ? "bg-emerald-500 text-black font-bold"
                      : "bg-[#d4ff32] text-black hover:bg-[#bbf426]"
                  }`}
                >
                  <CheckCircle2 size={13} />
                  <span>{approvalGranted ? "Authorization Granted ✓" : "Authorize Action (1-Tap)"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalGranted(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10"
                >
                  Modify
                </button>
              </div>
            </div>
          )}

          {/* If Last Step: Resolution Showcase */}
          {isLastStep && (
            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-center">
                <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Money Recovered</span>
                <span className="text-xl font-extrabold text-emerald-400">₹3,499</span>
                <span className="text-[9px] text-zinc-500 block">Bank UTR #423891004812</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-3.5 text-center">
                <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Turnaround Time</span>
                <span className="text-xl font-extrabold text-[#d4ff32]">4.5 Hours</span>
                <span className="text-[9px] text-zinc-500 block">vs 7.2 Days Manual</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#121216] p-3.5 text-center">
                <span className="text-[10px] text-zinc-400 font-semibold block uppercase">Consumer Work</span>
                <span className="text-xl font-extrabold text-white">1 Prompt</span>
                <span className="text-[9px] text-zinc-500 block">vs 12 manual calls/emails</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10"
          >
            <RotateCcw size={13} /> Restart Demo
          </button>

          {!isLastStep ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step.isApprovalStep && !approvalGranted}
              className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-500 disabled:opacity-40"
            >
              <span>Next Step ({currentStepIndex + 2}/{scenario.steps.length})</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-black shadow-md shadow-emerald-500/20 hover:bg-emerald-400"
            >
              <span>Demo Complete — Replay</span>
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Autonomous Multi-Rail Sandbox & Legal Notice Toolkit for Judges */}
      <JudgeToolkit />
    </div>
  );
}
