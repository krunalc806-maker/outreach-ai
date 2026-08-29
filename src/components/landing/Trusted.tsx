"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";

const railsAndStandards = [
  "Delhivery Logistics Rail",
  "Pine Labs Payment Switch",
  "Gnani Voice AI (Indic)",
  "Consumer Protection Act 2019",
  "NPCI UPI Reversals",
  "DGCA Passenger Charter",
  "National Consumer Helpline",
  "RBI Digital Payments Ombudsman",
];

export default function Trusted() {
  return (
    <section className="border-y border-white/10 bg-[#08080a] py-10">
      <Container>
        <div className="text-center">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
            Integrated with Indian Commerce, Logistics & Regulatory Rails
          </p>
        </div>

        <div className="relative mt-6 overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max gap-4"
          >
            {[...railsAndStandards, ...railsAndStandards].map((rail, index) => (
              <div
                key={`${rail}-${index}`}
                className="flex h-11 min-w-[200px] items-center justify-center rounded-xl border border-white/10 bg-[#0d0d12] px-4"
              >
                <span className="text-xs font-mono font-semibold text-zinc-300">
                  {rail}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}