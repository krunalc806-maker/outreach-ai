"use client";

import { motion } from "framer-motion";
import { Mic, ShieldCheck, CheckCircle2 } from "lucide-react";
import Container from "@/components/layout/Container";

const steps = [
  {
    icon: Mic,
    number: "01",
    title: "Explain Your Dispute in Plain Words",
    description:
      "Tell the agent about your stuck order, false delivery failure, or missing refund in English, Hindi, or Hinglish.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Agent Plans & Secures Consent",
    description:
      "The agent queries logistics & payment switches, formulates a legal strategy, and requests your 1-tap approval for high-risk actions.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Autonomous Rail Execution & Refund",
    description:
      "The agent triggers Delhivery re-attempts, executes Pine Labs direct bank settlements, and follows up until verified resolved.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center space-y-3"
        >
          <span className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
            AUTONOMOUS WORKFLOW
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            From Consumer Problem to <br />
            <span className="text-[#a78bfa]">
              Verified Settlement
            </span>
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
            No repeated calls to customer support. No navigating confusing IVRs. The agent handles end-to-end coordination.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#a78bfa] border border-white/10">
                    <Icon size={20} />
                  </div>

                  <span className="text-4xl font-extrabold font-mono text-zinc-800">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {step.title}
                </h3>

                <p className="text-xs leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}