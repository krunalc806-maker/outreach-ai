"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowRightLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { getCrmSnapshot } from "@/lib/crm/data";
import type { Lead, LeadStage } from "@/lib/crm/types";

export default function PipelineBoard() {
  const snapshot = getCrmSnapshot();
  const [leads, setLeads] = useState<Lead[]>(snapshot.leads);

  const stages: LeadStage[] = ["New", "Qualified", "Engaged", "High Intent", "Closed"];

  const handleAdvanceStage = (leadId: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const currIdx = stages.indexOf(l.stage);
        const nextStage = stages[(currIdx + 1) % stages.length];
        return { ...l, stage: nextStage };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Dispute & Lead Pipeline</p>
          <h2 className="mt-1 text-xl font-bold text-white">Interactive Stage Transition Board</h2>
        </div>
        <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
          <Sparkles size={18} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stages.map((stage) => {
          const stageLeads = leads.filter((lead) => lead.stage === stage);
          return (
            <div key={stage} className="rounded-2xl border border-white/10 bg-[#11141c] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <p className="text-xs font-bold text-white uppercase font-mono">{stage}</p>
                  <span className="rounded-full bg-[#08090d] border border-white/10 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="rounded-xl border border-white/5 bg-[#08090d] p-3 text-xs text-zinc-300 space-y-1.5 transition hover:border-[#8b5cf6]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-white truncate">{lead.name}</span>
                        <button
                          type="button"
                          onClick={() => handleAdvanceStage(lead.id)}
                          title="Advance to next pipeline stage"
                          className="rounded p-1 text-[#a78bfa] hover:bg-[#8b5cf6]/20 transition"
                        >
                          <ArrowRightLeft size={13} />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400">{lead.company}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
                        <span className="text-emerald-400">Score: {lead.score}</span>
                        <Link
                          href={`/cases?merchant=${encodeURIComponent(lead.company)}`}
                          className="text-[#a78bfa] hover:underline"
                        >
                          Open Case →
                        </Link>
                      </div>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <p className="text-center text-[10px] text-zinc-600 font-mono py-4">No leads in stage</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
