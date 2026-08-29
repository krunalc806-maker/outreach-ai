"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, PlayCircle, ShieldCheck, Sparkles, Truck, IndianRupee, Volume2 } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { getSelectedOpportunity } from "@/config/opportunity";

export default function Hero() {
  const opportunity = getSelectedOpportunity();

  return (
    <section className="relative overflow-hidden bg-[#08090d] py-20 sm:py-28">
      {/* Subtle ambient illumination */}
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#8b5cf6]/10 blur-[140px] pointer-events-none" />

      <Container>
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0d1017] px-3.5 py-1 text-xs font-semibold tracking-wider text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
              <span>THE KEN'S CASE-BUILD COMPETITION 2026 — THE GREAT REWIRING</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-[1.08]">
              The agent that acts <br />
              <span className="text-[#a78bfa]">
                when consumers get stuck.
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              From delivery disputes to delayed refunds, OutreachAI investigates, acts across business rails (<span className="text-zinc-200 font-semibold">Delhivery Logistics</span>, <span className="text-zinc-200 font-semibold">Pine Labs Payments</span>, <span className="text-zinc-200 font-semibold">Gnani Voice</span>), and verifies the outcome — so consumers don't have to become their own operations team.
            </p>

            <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
              >
                <Bot size={15} />
                <span>SEE THE AGENT IN ACTION</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <PlayCircle size={15} className="text-[#a78bfa]" />
                <span>EXPLORE THE CASE (3-MIN DEMO)</span>
              </Link>
            </div>
          </motion.div>

          {/* The Great Rewiring: Old World vs New World Architectural Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 shadow-2xl space-y-6 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">The Great Rewiring Thesis</span>
                <h3 className="text-base font-bold text-white">How OutreachAI Transforms the Consumer Value Chain</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2.5 py-0.5 text-xs font-mono text-[#a78bfa]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
                Operational Layer
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Old World */}
              <div className="rounded-2xl border border-white/5 bg-[#11141c] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase font-mono">Old World (Manual Coordination)</span>
                  <span className="text-[10px] text-zinc-500 font-mono">12+ Calls & 7 Days</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Consumer is forced to act as the operations coordinator between fragmented silos:
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                  <span className="rounded bg-zinc-800 px-2 py-1">Merchant</span>
                  <span>→</span>
                  <span className="rounded bg-zinc-800 px-2 py-1">Support</span>
                  <span>→</span>
                  <span className="rounded bg-zinc-800 px-2 py-1">Courier</span>
                  <span>→</span>
                  <span className="rounded bg-zinc-800 px-2 py-1">Payment Gateway</span>
                  <span>→</span>
                  <span className="rounded bg-zinc-800 px-2 py-1">Bank</span>
                </div>
                <p className="text-[11px] text-rose-300/90 pt-1 font-semibold">
                  Result: Consumer pays with time, emotional exhaustion, and unrecovered losses.
                </p>
              </div>

              {/* New World */}
              <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 p-4 space-y-2.5 ring-1 ring-[#8b5cf6]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#a78bfa] uppercase font-mono">New World (OutreachAI Agent)</span>
                  <span className="text-[10px] text-[#a78bfa] font-mono font-bold">1 Prompt + 1 Tap</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Consumer states desired outcome. OutreachAI orchestrates across machine-readable rails:
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-300">
                  <span className="rounded bg-black border border-[#8b5cf6]/40 text-[#a78bfa] px-2 py-1 font-bold">Consumer</span>
                  <span>→</span>
                  <span className="rounded bg-zinc-900 border border-white/10 px-2 py-1">Gnani Voice</span>
                  <span>+</span>
                  <span className="rounded bg-zinc-900 border border-white/10 px-2 py-1">Delhivery Logistics</span>
                  <span>+</span>
                  <span className="rounded bg-zinc-900 border border-white/10 px-2 py-1">Pine Labs Switch</span>
                  <span>→</span>
                  <span className="rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 font-bold">Verified UTR</span>
                </div>
                <p className="text-[11px] text-emerald-300 pt-1 font-semibold">
                  Result: 92% manual effort eliminated. Verified bank settlement in 4.5 hours.
                </p>
              </div>
            </div>

            {/* 4-Step Cycle */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/5 pt-4">
              <div className="rounded-xl bg-[#11141c] p-3 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 font-bold block">01. INGESTION</span>
                <p className="text-xs font-bold text-white">State Desired Outcome</p>
                <p className="text-[11px] text-zinc-400">1 voice/text prompt in English or Hindi.</p>
              </div>

              <div className="rounded-xl bg-[#11141c] p-3 space-y-1">
                <span className="text-[10px] font-mono text-[#a78bfa] font-bold block">02. AUDIT</span>
                <p className="text-xs font-bold text-white">Logistics & Rail Scans</p>
                <p className="text-[11px] text-zinc-400">Delhivery AWB audit + Pine Labs gateway check.</p>
              </div>

              <div className="rounded-xl bg-[#11141c] p-3 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 font-bold block">03. CONSENT</span>
                <p className="text-xs font-bold text-white">1-Tap Authorization</p>
                <p className="text-[11px] text-zinc-400">Explicit human approval for financial refund claims.</p>
              </div>

              <div className="rounded-xl bg-[#11141c] p-3 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">04. RESOLUTION</span>
                <p className="text-xs font-bold text-white">Verified Settlement</p>
                <p className="text-[11px] text-zinc-400">Cryptographic UTR validation on banking network.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}