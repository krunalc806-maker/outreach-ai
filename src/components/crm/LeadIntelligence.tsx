"use client";

import { motion } from "framer-motion";
import { BrainCircuit, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { getCrmSnapshot } from "@/lib/crm/data";

export default function LeadIntelligence() {
  const snapshot = getCrmSnapshot();
  const lead = snapshot.leads[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">AI Dispute Intelligence</p>
          <h2 className="mt-1 text-xl font-bold text-white">Intelligent scoring & autonomous next steps</h2>
        </div>
        <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
          <BrainCircuit size={18} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <TrendingUp size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-bold uppercase text-zinc-400">Confidence Score</span>
          </div>
          <p className="mt-2 text-3xl font-extrabold text-white">{lead.score}/100</p>
          <span className="text-[10px] text-emerald-400 font-mono">High Resolution Likelihood</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Sparkles size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-bold uppercase text-zinc-400">Entity Summary</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{lead.aiSummary}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldAlert size={15} className="text-amber-400" />
            <span className="text-xs font-bold uppercase text-zinc-400">Risk Profile</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{lead.risk}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <BrainCircuit size={15} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase text-zinc-400">Next Action</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{lead.nextBestAction}</p>
        </div>
      </div>
    </motion.div>
  );
}
