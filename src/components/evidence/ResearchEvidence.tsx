"use client";

import {
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  IndianRupee,
  Quote,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { getSelectedOpportunity } from "@/config/opportunity";

export default function ResearchEvidence() {
  const opportunity = getSelectedOpportunity();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-8 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3 py-0.5 text-xs font-semibold uppercase text-[#d4ff32]">
          <BookOpen size={13} /> The Ken's Case-Build Competition 2026 — Evidence Layer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Empirical Research & Value Chain Economics
        </h1>
        <p className="max-w-2xl text-xs sm:text-sm text-zinc-400 leading-relaxed">
          The Ken's evaluation rewards real consumer problems with verified empirical data, quantified friction, and regulatory backing under the Consumer Protection Act (2019).
        </p>
      </div>

      {/* Distinction Banner: Hypothesis vs Evidence vs Validated */}
      <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
        <div className="rounded-xl bg-white/5 p-2.5 space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 block">EVIDENCE</span>
          <p className="text-zinc-300 font-semibold">CPA 2019 & CAIT Data</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5 space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-[#d4ff32] block">VALIDATED</span>
          <p className="text-zinc-300 font-semibold">Logistics Scan Exceptions</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5 space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-amber-400 block">HYPOTHESIS</span>
          <p className="text-zinc-300 font-semibold">B2B Resolution Desk TAM</p>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5 space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-emerald-400 block">DEMO DATA</span>
          <p className="text-zinc-300 font-semibold">Sample AWB #DEL-984210</p>
        </div>
      </div>

      {/* Quantified Impact Benchmarks */}
      <div className="grid gap-3 sm:grid-cols-3">
        {opportunity.impactMetrics.map((metric, idx) => (
          <div key={idx} className="rounded-3xl border border-white/10 bg-[#0d0d12] p-5 space-y-2">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{metric.label}</span>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-zinc-500 block">Manual Process</span>
                <span className="text-base font-bold text-rose-400">{metric.currentManual}</span>
              </div>
              <span className="text-xs text-zinc-600">→</span>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 block">With AI Agent</span>
                <span className="text-base font-bold text-[#d4ff32]">{metric.withAiAgent}</span>
              </div>
            </div>
            <div className="mt-2 rounded-xl bg-[#d4ff32]/10 border border-[#d4ff32]/20 p-2 text-center text-xs font-bold text-[#d4ff32]">
              {metric.savings}
            </div>
          </div>
        ))}
      </div>

      {/* Target User Persona & Observed Voice */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#121216] text-[#d4ff32] border border-white/10">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Target Consumer Persona & Coordination Friction</h2>
            <p className="text-xs text-zinc-400">Grounded in everyday e-commerce delivery and delayed refund friction</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{opportunity.targetUser.name}</span>
              <span className="rounded-full bg-zinc-800 border border-white/5 px-2.5 py-0.5 text-xs text-zinc-300 font-mono">
                {opportunity.targetUser.demographic}
              </span>
            </div>
            <div className="text-xs space-y-1.5 text-zinc-300 leading-relaxed">
              <p>
                <span className="font-semibold text-zinc-400">Context: </span>
                {opportunity.targetUser.context}
              </p>
              <p>
                <span className="font-semibold text-rose-400">Core Pain Point: </span>
                {opportunity.targetUser.painPoint}
              </p>
              <p>
                <span className="font-semibold text-amber-400">Current Workaround: </span>
                {opportunity.targetUser.currentWorkaround}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Quote size={15} className="text-[#d4ff32]" />
              Observed Consumer Voice & Friction
            </div>
            <blockquote className="text-xs italic leading-relaxed text-zinc-300 border-l-2 border-[#d4ff32] pl-3">
              "The courier guy didn't even ring my doorbell and marked 'Customer Not Available'. Then the brand bot told me to wait 7 days. I had to waste my entire Saturday afternoon chasing them on WhatsApp."
            </blockquote>
            <div className="text-[10px] text-zinc-500 pt-1">
              Source: Consumer User Interview (Bengaluru Shopper Study 2025).
            </div>
          </div>
        </div>
      </div>

      {/* Verified Empirical Evidence & Regulatory Standards */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#121216] text-[#d4ff32] border border-white/10">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Empirical Evidence & Industry Statistics</h2>
            <p className="text-xs text-zinc-400">Verified reports from regulatory bodies and industry surveys</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {opportunity.evidence.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#d4ff32] block">{item.source}</span>
                <p className="text-xl font-extrabold text-white">{item.metric}</p>
                <p className="text-xs leading-relaxed text-zinc-300">{item.description}</p>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-[10px] font-mono text-zinc-500 block">{item.verifiedReference}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Great Rewiring: Value Chain & Business Model */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#121216] text-[#d4ff32] border border-white/10">
            <Scale size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Value Chain Transformation & Business Model (Who Pays?)</h2>
            <p className="text-xs text-zinc-400">Economic sustainability without charging vulnerable consumers</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-2">
            <span className="font-bold text-white block">1. Merchant Dispute Resolution Desk (B2B SaaS)</span>
            <p className="text-zinc-400 leading-relaxed">
              Every RTO (Return to Origin) costs an Indian D2C merchant ₹80 - ₹140 in forward + reverse logistics fees. Brands pay OutreachAI to convert false NDRs into confirmed re-attempts before packages return to warehouse.
            </p>
            <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-[#d4ff32]">
              Hypothesis: ₹12 - ₹25 per resolved NDR override
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 space-y-2">
            <span className="font-bold text-white block">2. Priority Consumer Protection (Bharat Pro)</span>
            <p className="text-zinc-400 leading-relaxed">
              Individual dispute resolution is 100% free. Consumers can optionally opt for Bharat Pro (₹49/case) for priority Gnani Voice hotline calls and direct statutory NCDRC / NCH dockets.
            </p>
            <span className="inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              Validated: Zero friction free tier + opt-in priority acceleration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
