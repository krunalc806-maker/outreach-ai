"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { PRICING } from "@/constants/site";

export default function Pricing() {
  return (
    <section id="pricing" className="bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl text-center space-y-3"
        >
          <span className="rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3.5 py-1 text-xs font-semibold text-[#d4ff32] uppercase tracking-wider">
            TRANSPARENT ACCESS
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Plans for Consumers & Resolvers
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            OutreachAI is 100% free for individual consumers resolving disputes.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 max-w-5xl mx-auto">
          {PRICING.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition ${
                plan.highlighted
                  ? "border-[#d4ff32]/40 bg-[#0f0f14] shadow-2xl shadow-[#d4ff32]/5 ring-1 ring-[#d4ff32]/30"
                  : "border-white/10 bg-[#0c0c10]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4ff32] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-black">
                  Recommended
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="ml-1 text-xs text-zinc-400 font-mono">
                      /case
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 border-t border-white/5 pt-4 text-xs">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <Check
                        size={14}
                        className={plan.highlighted ? "text-[#d4ff32]" : "text-emerald-400"}
                      />
                      <span className="text-zinc-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <Link
                  href="/login"
                  className={`inline-flex items-center justify-center w-full rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    plan.highlighted
                      ? "bg-[#d4ff32] text-black shadow-lg shadow-[#d4ff32]/20 hover:bg-[#bbf426]"
                      : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Start with Google
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
