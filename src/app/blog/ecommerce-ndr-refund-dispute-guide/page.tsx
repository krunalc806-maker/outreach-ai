import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, Clock, IndianRupee, Scale, ShieldAlert, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "E-Commerce False NDRs & Delayed Refunds: Complete Statutory Action Guide",
  description:
    "Learn how to audit courier fake delivery attempts (Delhivery, BlueDart), stop automated Return to Origin (RTO), and claim instant statutory refunds under RBI TAT rules.",
  path: "/blog/ecommerce-ndr-refund-dispute-guide",
  keywords: [
    "false NDR courier complaints",
    "customer not reachable false mark",
    "Delhivery NDR tracking dispute",
    "e-commerce refund delayed past 72 hours",
    "RBI TAT compensation INR 100 per day",
  ],
});

export default function ArticleNdrDisputeGuide() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/blog" },
    { name: "E-Commerce False NDRs & Refunds Guide", url: "/blog/ecommerce-ndr-refund-dispute-guide" },
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
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold uppercase text-emerald-300">
              Logistics & Consumer Rights
            </span>
            <span className="text-xs text-zinc-500 font-mono">7 min read · February 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            E-Commerce False NDRs & Delayed Refunds: The Statutory Action Guide
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            How to identify fraudulent courier delivery exception reports, halt unauthorized Return to Origin (RTO), and enforce statutory turnaround times for refunds.
          </p>
        </header>

        {/* Article Body */}
        <article className="py-8 space-y-8 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">What is a False Non-Delivery Report (NDR)?</h2>
            <p>
              In Indian logistics, a Non-Delivery Report (NDR) is triggered when a field rider marks a package as undelivered due to reasons like <em>"Customer Not Reachable"</em>, <em>"Address Incomplete"</em>, or <em>"Customer Rescheduled"</em>.
            </p>
            <p>
              Under extreme delivery quota pressures, riders often falsely record NDR exceptions without visiting the location or attempting a phone call. After 3 false attempts, the package is placed on <strong>RTO (Return to Origin)</strong>, forcing the order to cancel while the consumer&apos;s money remains locked.
            </p>
          </section>

          <section className="space-y-4 rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">3 Step Statutory Playbook for Consumers</h3>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-xs font-bold text-white">1</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Demand Telecom & Geolocation Proof</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Under logistics carriage standards, an NDR is invalid unless accompanied by a verified call attempt to the recipient mobile number.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-xs font-bold text-white">2</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Invoke Section 2(47) Consumer Protection Act (2019)</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    Failing to fulfill a paid order and withholding refunds constitutes an &apos;Unfair Trade Practice&apos; under CPA 2019.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-xs font-bold text-white">3</div>
                <div>
                  <h4 className="font-bold text-white text-sm">Claim RBI TAT Compensation of ₹100 / Day</h4>
                  <p className="text-zinc-400 text-xs mt-1">
                    RBI Circular DPSS.CO.PD No.629/02.01.014/2019-20 mandates that authorized refunds must be reversed within T+1 day, with ₹100 per day penalty for delays.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Automating NDR Audits with OutreachAI</h2>
            <p>
              Rather than dialing delivery call centers repeatedly, OutreachAI autonomously scans the AWB tracking stream on the Delhivery rail, identifies false NDR markings, dispatches IVR supervisor notifications, and audits payment reversal logs via Pine Labs.
            </p>
          </section>

          {/* Call to Action */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 space-y-4 text-center">
            <h3 className="text-lg font-bold text-white">Have a Package Stuck in False NDR?</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Provide your AWB number to OutreachAI and let the agent orchestrate courier override.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#7c3aed] transition"
              >
                <Bot size={14} /> Resolve Stuck Package
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition"
              >
                View Logistics Rails
              </Link>
            </div>
          </div>
        </article>
      </Container>

      <Footer />
    </main>
  );
}

