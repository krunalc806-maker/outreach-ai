import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Clock, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Consumer Protection Act (2019): Statutory Grievance Enforcement Guide",
  description:
    "Understand your statutory rights under Section 2(47) and Section 35 of the Indian Consumer Protection Act 2019, and how automated 48-hour legal notices force nodal officer compliance.",
  path: "/blog/consumer-protection-act-2019-grievance-workflows",
  keywords: [
    "Consumer Protection Act 2019 Section 2(47)",
    "CPA 2019 deficiency of service",
    "statutory grievance legal notice India",
    "National Consumer Helpline complaint procedure",
    "District Consumer Commission filing workflow",
  ],
});

export default function ArticleCpaLegalWorkflows() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/blog" },
    { name: "Consumer Protection Act 2019 Enforcement", url: "/blog/consumer-protection-act-2019-grievance-workflows" },
  ]);

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <Container className="py-16 sm:py-24 max-w-4xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition mb-6 font-mono"
        >
          <ArrowLeft size={13} /> Back to Guides
        </Link>

        {/* Article Header */}
        <header className="space-y-4 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-0.5 text-xs font-semibold uppercase text-sky-300">
              Legal Framework
            </span>
            <span className="text-xs text-zinc-500 font-mono">6 min read · February 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Consumer Protection Act (2019): Section 2(47) & Section 35 Enforcement
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            How the modernized Indian consumer law framework establishes clear merchant liabilities for delayed delivery, withheld refunds, and circular customer support.
          </p>
        </header>

        {/* Article Body */}
        <article className="py-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Key Statutory Provisions under CPA 2019</h2>
            <p>
              The Consumer Protection Act, 2019 repealed the earlier 1986 Act to address modern e-commerce realities, digital transactions, and direct seller liabilities:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-2">
                <span className="text-xs font-mono font-bold text-[#a78bfa] block">Section 2(47) — Unfair Trade Practice</span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Prohibits misleading representations regarding delivery timelines, product quality, or refusal to issue refunds for goods/services not delivered as promised.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-400 block">Section 35 — Deficiency of Service</span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Defines any fault, imperfection, or inadequacy in the quality, nature, and manner of performance required to be maintained under contract or statutory law.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">The Power of Formal Statutory Notices</h2>
            <p>
              When a consumer sends a casual support email, it is routed to entry-level tier-1 agents. However, when an autonomous system like OutreachAI formats a formal notice citing specific sections of the Consumer Protection Act (2019), it is legally routed to the merchant&apos;s <strong>Principal Nodal Officer & Compliance Desk</strong>.
            </p>
            <p>
              Nodal desks are legally obligated to resolve statutory grievances within designated turnaround times or risk penalties before the District Consumer Disputes Redressal Commission (DCDRC).
            </p>
          </section>

          {/* Call to Action */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Draft a Formal Statutory Grievance in Seconds</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              OutreachAI automatically interpolates order numbers, merchant details, and statutory citations into compliant dockets.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#7c3aed] transition"
              >
                <Bot size={14} /> Draft Legal Notice
              </Link>
              <Link
                href="/use-cases"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
              >
                View Use Cases
              </Link>
            </div>
          </div>
        </article>
      </Container>

      <Footer />
    </main>
  );
}

