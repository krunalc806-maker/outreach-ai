"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Truck,
  IndianRupee,
  Volume2,
  ShieldCheck,
  Workflow,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import Container from "@/components/layout/Container";

const agentFeatures = [
  {
    icon: Truck,
    title: "Delhivery Logistics Rail",
    description:
      "Direct integration with Delhivery tracking APIs to detect false NDR attempt markings and trigger priority re-attempts.",
  },
  {
    icon: IndianRupee,
    title: "Pine Labs Payment & Auth Rail",
    description:
      "Audit banking reversal gateways, generate cryptographically signed authorization tokens, and trigger direct refund credits.",
  },
  {
    icon: Volume2,
    title: "Gnani Voice Rail",
    description:
      "Voice-first problem intake across Hindi, Hinglish, and regional languages with autonomous AI voice calls to support hotlines.",
  },
  {
    icon: ShieldCheck,
    title: "Human-in-the-Loop Safeguards",
    description:
      "The agent never executes high-risk financial chargebacks or statutory filings without your explicit 1-tap consent.",
  },
  {
    icon: Workflow,
    title: "Autonomous Follow-Up Engine",
    description:
      "Bounded retry state machine that enforces merchant SLAs and automatically escalates to National Consumer Helpline if unaddressed.",
  },
  {
    icon: BarChart3,
    title: "Resolution & Impact Analytics",
    description:
      "Verifiable metrics tracking money recovered, turnaround time reduction, and consumer hours saved.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center space-y-3"
        >
          <span className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
            AGENTIC INFRASTRUCTURE
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Real Rails That Remove Work <br />
            <span className="text-[#a78bfa]">
              From Indian Consumers
            </span>
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
            Traditional AI chatbots generate paragraphs of advice. OutreachAI orchestrates multi-step actions across real logistics, payment, and voice rails.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
          {agentFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-3 transition hover:border-[#8b5cf6]/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#a78bfa] border border-white/10">
                  <Icon size={20} />
                </div>

                <h3 className="text-base font-bold text-white">
                  {feature.title}
                </h3>

                <p className="text-xs leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/features"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a78bfa] hover:underline"
          >
            <span>Learn more about our multi-rail architecture →</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}