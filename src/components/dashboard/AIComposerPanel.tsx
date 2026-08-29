"use client";

import { useMemo, useState } from "react";
import { Bot, Wand2 } from "lucide-react";

const presets = [
  { title: "Statutory CPA 2019 Demand", prompt: "Generate a formal demand letter citing Section 2(47) of CPA 2019 for delayed refund." },
  { title: "Logistics Hub Escalation", prompt: "Draft an urgent NDR override notice to Delhivery Hub Supervisor for Indiranagar delivery." },
  { title: "Banking Chargeback Petition", prompt: "Compose an RBI Ombudsman chargeback filing for failed gateway reversal exceeding 72h." },
];

export default function AIComposerPanel() {
  const [selected, setSelected] = useState(presets[0].title);
  const activePrompt = useMemo(() => presets.find((preset) => preset.title === selected)?.prompt ?? presets[0].prompt, [selected]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Statutory Draft Generator</p>
          <h2 className="mt-1 text-base font-bold text-white">Compose legally grounded notices</h2>
        </div>
        <div className="rounded-xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
          <Bot size={16} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-2">
          {presets.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => setSelected(preset.title)}
              className={`w-full rounded-2xl border p-3 text-left text-xs transition active:scale-95 ${
                selected === preset.title
                  ? "border-[#8b5cf6]/60 bg-[#8b5cf6]/10 text-white"
                  : "border-white/5 bg-[#11141c] text-zinc-400 hover:bg-white/5"
              }`}
            >
              <div className="font-bold text-white">{preset.title}</div>
              <div className="mt-1 text-[11px] text-zinc-400 leading-snug">{preset.prompt}</div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#a78bfa] font-semibold">
            <Wand2 size={14} />
            <span>Generated Statutory Template</span>
          </div>
          <div className="mt-3 rounded-xl border border-white/5 bg-[#08090d] p-3 text-xs leading-relaxed text-zinc-300 font-mono">
            <p className="font-bold text-white">{activePrompt}</p>
            <p className="mt-2 text-zinc-400">Formal grievance registered under CPA 2019 for delayed delivery and unreversed credit of INR 3,499. Requesting immediate reversal within statutory 48-hour SLA.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
