"use client";

import { ArrowRight, Bot, Mail, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { getOutreachSnapshot } from "@/lib/outreach/data";

export default function OutreachPanel() {
  const snapshot = getOutreachSnapshot();

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Multi-Rail Dispatch Queue</p>
          <h3 className="mt-1 text-base font-bold text-white">Autonomous rails for dispute escalation</h3>
        </div>
        <div className="rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
          <Sparkles size={16} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Mail size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-semibold">Active Batches</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">{snapshot.campaigns.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users size={15} className="text-emerald-400" />
            <span className="text-xs font-semibold">Tracked Cases</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">{snapshot.leads.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <Bot size={15} className="text-amber-400" />
            <span className="text-xs font-semibold">Statutory Notices</span>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">{snapshot.templates.length}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/5 bg-[#11141c] p-3 text-xs text-zinc-300">
        <p>Delhivery Logistics, Pine Labs Banking, and Gnani Voice rails active for autonomous action.</p>
        <Link href="/templates" className="inline-flex items-center gap-1 font-bold text-[#a78bfa] hover:underline shrink-0">
          View Notices <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
