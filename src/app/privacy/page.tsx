import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SUPPORT_EMAIL, SITE } from "@/constants/site";
import { constructMetadata } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Privacy Policy & Security Standards — OutreachAI",
  description: "Learn how OutreachAI protects your identity, case evidence, and banking authorization tokens with bank-grade encryption and strict user isolation.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <Navbar />
      <Container className="py-20 max-w-4xl">
        <div className="space-y-8">
          <div>
            <span className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold text-[#a78bfa] uppercase font-mono">
              DATA PRIVACY & SECURITY
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
            <p className="mt-2 text-xs text-zinc-400 font-mono">Last Updated: February 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-10 shadow-xl">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">1. Information We Collect</h2>
              <p className="text-zinc-400">
                OutreachAI operates with minimal data collection principles. We collect your verified Google email and display name via Supabase Auth. Any grievance details (AWBs, order numbers, amounts) you provide to the agent are strictly used to orchestrate dispute resolution across connected rails (Delhivery, Pine Labs, Gnani).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">2. Human-in-the-Loop Consent</h2>
              <p className="text-zinc-400">
                Financial transactions, chargeback filings, and statutory notices under the Consumer Protection Act (2019) are never dispatched without your explicit 1-tap consent.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">3. Data Retention & Security</h2>
              <p className="text-zinc-400">
                All data is encrypted in transit and at rest using bank-grade AES-256 and SSL/TLS standards. We never sell your personal or financial data to third-party advertisers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-white">4. Contact Information</h2>
              <p className="text-zinc-400">
                For questions regarding this policy or data deletion requests, contact our team at:
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
