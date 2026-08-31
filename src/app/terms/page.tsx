import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUPPORT_EMAIL, SITE } from "@/constants/site";
import { constructMetadata } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Terms of Service — OutreachAI",
  description: "Terms and conditions governing the use of OutreachAI autonomous dispute resolution and grievance agent platforms.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <Navbar />
      <Container className="py-20 max-w-4xl">
        <div className="space-y-8">
          <div>
            <span className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold text-[#a78bfa] uppercase font-mono">
              TERMS OF SERVICE
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
            <p className="mt-2 text-xs text-zinc-400 font-mono">Last Updated: February 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-10 shadow-xl">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Nature of the Service</h2>
              <p className="text-zinc-400">
                OutreachAI provides an autonomous AI agent layer designed to assist consumers in researching, coordinating, and resolving commercial grievances with e-commerce merchants, courier providers, and financial institutions in India.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. User Authorization & Disclaimers</h2>
              <p className="text-zinc-400">
                OutreachAI assists consumers under statutory frameworks including the Consumer Protection Act (2019) and RBI Ombudsman guidelines. OutreachAI does not constitute a formal law firm. You retain full control to approve, modify, or reject any statutory communication before dispatch.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Consumer Pricing & Usage</h2>
              <p className="text-zinc-400">
                Individual consumer dispute resolutions are 100% free of charge. Users agree not to abuse the agent platform for fraudulent claims or spam communications.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. Support & Governance</h2>
              <p className="text-zinc-400">
                For legal inquiries, feedback, or dispute escalations, please contact:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-[#a78bfa] font-semibold underline underline-offset-4 hover:text-[#c4b5fd]"
              >
                {SUPPORT_EMAIL}
              </a>
            </section>
          </div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
