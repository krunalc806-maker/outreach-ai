"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";

export default function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#08080a] py-20 sm:py-28">
      <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4ff32]/5 blur-[140px] pointer-events-none" />

      <Container>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d12] p-8 sm:p-14 backdrop-blur-xl shadow-2xl"
        >
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <span className="rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4ff32]">
              <Sparkles size={12} className="inline mr-1.5" />
              THE GREAT REWIRING 2026
            </span>

            <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-5xl tracking-tight">
              Ready to resolve your dispute? <br />
              <span className="text-[#d4ff32]">
                Deploy the agent in seconds.
              </span>
            </h2>

            <p className="mx-auto max-w-xl text-sm leading-relaxed text-zinc-400">
              Stop wasting hours trapped in chatbot blame loops. Connect your verified Google account and let the autonomous agent handle logistics overrides, payment audits, and statutory escalations.
            </p>

            <div className="pt-2 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d4ff32] px-6 py-3.5 text-xs font-extrabold text-black shadow-xl shadow-[#d4ff32]/20 transition hover:bg-[#bbf426] active:scale-95"
              >
                <Bot size={15} />
                <span>START WITH GOOGLE</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                <PlayCircle size={15} className="text-[#d4ff32]" />
                <span>3-MINUTE DEMO</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 border-t border-white/5 pt-6">
              <span className="flex items-center gap-1.5 text-zinc-400"><ShieldCheck size={14} className="text-emerald-400" /> Human-in-the-Loop Safeguards</span>
              <span className="text-zinc-400">✓ 100% Free for Consumers</span>
              <span className="text-zinc-400">✓ Delhivery + Pine Labs Rails</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
