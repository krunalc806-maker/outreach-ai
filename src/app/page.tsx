import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/landing/Hero";
import Trusted from "@/components/landing/Trusted";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import { generateFaqSchema } from "@/lib/seo/config";

const LANDING_FAQS = [
  {
    question: "Why is OutreachAI an autonomous AI agent and not just a chatbot?",
    answer:
      "A chatbot only outputs text advice that the consumer still has to execute manually. OutreachAI autonomously researches the issue, queries logistics & payment rails, formulates legal notices under the Consumer Protection Act (2019), secures your 1-tap consent, and directly triggers courier re-attempts or banking reversals.",
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
      "The agent uses an enterprise multi-provider architecture with NVIDIA NIM (Llama-3.1-8B-Instruct) as the primary engine, with built-in fallbacks to OpenRouter and Google Gemini.",
  },
  {
    question: "Is this compliant under Indian Consumer Law?",
    answer:
      "Yes. All generated notices strictly follow the Consumer Protection Act (2019) and Consumer Protection (E-Commerce) Rules (2020), referencing statutory 48-hour SLAs and formal NCDRC escalation dockets.",
  },
];

export default function Home() {
  const faqSchema = generateFaqSchema(LANDING_FAQS);

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <Hero />
      <Trusted />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}