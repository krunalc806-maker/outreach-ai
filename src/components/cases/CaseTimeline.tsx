"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Clock,
  IndianRupee,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Volume2,
} from "lucide-react";
import { AgentCase, CaseAuditEntry } from "@/lib/agent/types";

interface CaseTimelineProps {
  agentCase: AgentCase;
}

export default function CaseTimeline({ agentCase }: CaseTimelineProps) {
  const getIconForPhase = (log: CaseAuditEntry) => {
    if (log.rail === "delhivery") return <Truck size={14} className="text-zinc-300" />;
    if (log.rail === "pine_labs") return <IndianRupee size={14} className="text-[#d4ff32]" />;
    if (log.rail === "gnani") return <Volume2 size={14} className="text-zinc-300" />;
    if (log.phase.includes("Approval")) return <ShieldAlert size={14} className="text-amber-400" />;
    if (log.phase.includes("Escalation") || log.phase.includes("Statutory")) return <Scale size={14} className="text-rose-400" />;
    if (log.status === "CRITICAL" || log.status === "SUCCESS") return <ShieldCheck size={14} className="text-emerald-400" />;
    return <Bot size={14} className="text-zinc-300" />;
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Clock size={16} className="text-[#d4ff32]" />
            Autonomous Case Timeline & Audit Trail
          </h3>
          <p className="text-xs text-zinc-400">Chronological record of investigations, rail actions, and verifications</p>
        </div>
        <span className="rounded-full bg-zinc-800 border border-white/5 px-2.5 py-0.5 text-xs text-zinc-300 font-mono">
          {agentCase.auditLog.length} Events
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
        {agentCase.auditLog.map((log, index) => (
          <div key={log.id || index} className="relative space-y-1">
            {/* Dot / Icon */}
            <div
              className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#08080a] border ${
                log.status === "CRITICAL" || log.status === "SUCCESS"
                  ? "border-emerald-500/50 shadow-sm"
                  : log.status === "WARNING"
                  ? "border-amber-500/50"
                  : "border-white/20"
              }`}
            >
              {getIconForPhase(log)}
            </div>

            {/* Event Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-500">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
              <span className="text-xs font-bold text-white">{log.title}</span>
              {log.rail && (
                <span className="rounded bg-[#d4ff32]/10 border border-[#d4ff32]/30 px-1.5 py-0.2 text-[9px] font-mono font-bold text-[#d4ff32] uppercase">
                  {log.rail} rail
                </span>
              )}
              <span
                className={`rounded px-1.5 py-0.2 text-[9px] font-semibold ${
                  log.status === "SUCCESS"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : log.status === "WARNING"
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {log.mode}
              </span>
            </div>

            {/* Event Detail */}
            <p className="text-xs text-zinc-300 leading-relaxed bg-[#121216] p-3 rounded-xl border border-white/5">
              {log.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
