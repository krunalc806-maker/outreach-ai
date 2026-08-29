"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Container from "@/components/layout/Container";

const faqs = [
  {
    question: "Why is this an autonomous AI agent and not just a chatbot?",
    answer:
      "A chatbot only outputs text advice that the consumer still has to execute manually. OutreachAI autonomously researches the issue, queries logistics & payment rails, formulates legal notices under the Consumer Protection Act (2019), secures your 1-tap consent, and directly triggers re-attempts or banking reversals.",
  },
  {
    question: "Which infrastructure rails are connected?",
    answer:
      "The agent connects to three core rails: Delhivery Logistics Rail (for waybill tracking, false NDR overrides, and reverse pickups), Pine Labs Payment Switch (for gateway settlement audits, authorization tokens, and instant banking credits), and Gnani Voice AI (for multilingual Hindi/Indic speech processing and autonomous support calls).",
  },
  {
    question: "How does the agent ensure human safety on financial actions?",
    answer:
      "Every action is risk-scored. Low-risk steps (like querying tracking) execute autonomously. High-risk actions (such as authorizing a bank refund settlement or filing a legal dispute) strictly require explicit 1-tap consumer authorization before proceeding.",
  },
  {
    question: "Which AI models power the reasoning engine?",
    answer:
      "The agent uses an enterprise multi-provider architecture with NVIDIA NIM (Llama-3.1-8B-Instruct) as the primary engine, and built-in fallbacks to OpenRouter and Google Gemini.",
  },
  {
    question: "Is this compliant under Indian Consumer Law?",
    answer:
      "Yes. All generated notices strictly follow the Consumer Protection Act (2019) and Consumer Protection (E-Commerce) Rules (2020), referencing statutory 48-hour SLAs and formal NCDRC escalation dockets.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4ff32]">
            FREQUENTLY ASKED
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Key Questions & Architecture
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Everything you need to know about our autonomous consumer resolution agent.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12]"
            >
              <button
                type="button"
                onClick={() =>
                  setActive(active === index ? null : index)
                }
                aria-expanded={active === index}
                aria-controls={`faq-answer-${index}`}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-xs sm:text-sm font-bold text-white">
                  {faq.question}
                </span>

                <motion.div
                  animate={{
                    rotate: active === index ? 180 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="text-[#d4ff32] shrink-0 ml-2" size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {active === index && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <div id={`faq-answer-${index}`} role="region" aria-label={faq.question} className="border-t border-white/5 px-5 py-4 text-xs text-zinc-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
