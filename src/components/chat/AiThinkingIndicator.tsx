"use client";

import { useEffect, useState } from "react";

const STAGES = ["Thinking", "Analyzing context", "Generating response", "Finalizing"];

export default function AiThinkingIndicator() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, STAGES.length - 1)), 1500);
    return () => window.clearInterval(timer);
  }, []);
  return <div role="status" aria-live="polite" className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4 sm:px-6"><span className="omnexa-orbit" aria-hidden="true"><i /><i /><i /></span><span><span className="block text-xs font-semibold text-orange-100">Omnexa is {STAGES[stage].toLowerCase()}…</span><span className="mt-0.5 block text-[11px] text-zinc-500">Preparing a clear, grounded response</span></span></div>;
}
