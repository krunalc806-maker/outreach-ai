import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, IndianRupee, Plane, ShoppingBag, Sparkles, Store, Truck, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Real Indian Consumer Dispute Use Cases — Logistics, Refunds, Travel & UPI",
  description:
    "Discover how OutreachAI resolves real Indian consumer disputes: False courier NDR overrides, delayed ₹3,499 merchant refunds, airline cancellation claims, and unauthorized UPI debits.",
  path: "/use-cases",
  keywords: [
    "e-commerce refund dispute use case",
    "Delhivery NDR false delivery attempt",
    "airline cancellation refund claim DGCA",
    "UPI chargeback complaint RBI ombudsman",
    "quick commerce undelivered refund",
    "merchant courier NDR resolution",
  ],
});

export default function UseCasesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Use Cases", url: "/use-cases" },
  ]);

  const useCases = [
    {
      id: "ecommerce-ndr",
      icon: Truck,
      category: "E-COMMERCE & LOGISTICS",
      title: "False Courier NDR & Stuck Deliveries",
      problem:
        "Courier delivery riders falsely mark consignments as 'Customer Not Reachable' or 'Premises Closed' without placing a phone call, triggering premature RTO (Return to Origin) and holding consumer items hostage.",
      resolution:
        "OutreachAI audits the courier AWB scan stream, detects NDR exceptions without corresponding call logs, and directly dispatches priority re-attempt orders with verified delivery landmark coordinates.",
      rail: "Delhivery Logistics Rail + Gnani Voice",
      example: "AWB #DEL-984210-IN stuck at Indiranagar hub resolved with priority delivery attempt.",
    },
    {
      id: "delayed-refunds",
      icon: IndianRupee,
      category: "PAYMENTS & GATEWAYS",
      title: "Delayed E-Commerce Refunds (> 72 Hours)",
      problem:
        "Merchants acknowledge returns but withhold payment credits for weeks, blaming payment gateway reconciliation delays and leaving consumers with zero visibility into their money.",
      resolution:
        "The agent checks acquirer settlement switch logs, generates a statutory citation under RBI Turn Around Time (TAT) regulations, and requests consumer 1-tap consent to trigger direct banking reversal.",
      rail: "Pine Labs Settlement Switch + NPCI UPI",
      example: "₹3,499 Zara refund credited via verified Bank UTR #423891004812 in 4.5 hours.",
    },
    {
      id: "aviation-cancellations",
      icon: Plane,
      category: "AVIATION & TRAVEL",
      title: "Flight Weather Cancellations & Denied Refunds",
      problem:
        "Airlines cancel flights due to weather or operational delays and attempt to issue non-refundable travel vouchers or deduct illegal cancellation penalties.",
      resolution:
        "OutreachAI formats a statutory complaint citing DGCA Civil Aviation Requirements (CAR) Section 3, Series M, Part IV (Mandatory 100% full refund within 7 days) and dispatches it directly to the Principal Nodal Officer.",
      rail: "DGCA CAR Legal Notice Rail",
      example: "₹4,200 full ticket refund recovered with zero deduction for fog cancellation.",
    },
    {
      id: "unauthorized-debits",
      icon: Zap,
      category: "BANKING & FINTECH",
      title: "Unauthorized Recurring UPI & Card Debits",
      problem:
        "Subscriptions debit bank accounts without proper e-mandate registration or after explicit cancellation requests, with merchant support being unreachable.",
      resolution:
        "The agent prepares an evidentiary chargeback docket citing RBI Digital Payments Ombudsman guidelines and petitions the acquiring payment gateway for mandatory settlement clawback.",
      rail: "RBI Ombudsman Switch Rail",
      example: "₹1,850 unauthorized monthly chargeback reversed to consumer savings account.",
    },
    {
      id: "quick-commerce",
      icon: ShoppingBag,
      category: "QUICK COMMERCE",
      title: "Undelivered or Damaged 10-Minute Groceries",
      problem:
        "Quick commerce apps deliver incomplete orders or damaged perishables and auto-reject in-app refund tickets via automated bot scripts.",
      resolution:
        "OutreachAI synthesizes photographic proof, time-stamped delivery telemetry, and statutory Consumer Protection Act SLAs to override automated rejections and claim instant wallet/UPI credits.",
      rail: "CPA 2019 Deficiency of Service Rail",
      example: "₹740 spoiled produce refund credited instantly to consumer UPI.",
    },
    {
      id: "merchant-ndr-protection",
      icon: Store,
      category: "D2C MERCHANTS & SELLERS",
      title: "D2C Merchant Courier SLA Protection",
      problem:
        "Direct-to-consumer brands lose 20-30% of sales to fraudulent courier RTOs, bearing forward and reverse logistics shipping costs without recourse.",
      resolution:
        "OutreachAI provides automated carrier audit workflows, holding logistics partners accountable to contractual SLAs and reducing RTO loss rates across regional pin codes.",
      rail: "Multi-Carrier Telemetry Rail",
      example: "D2C seller recovered ₹48,000 in false RTO logistics carrier penalty claims.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090d] py-20 sm:py-28">
        <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#8b5cf6]/15 blur-[140px] pointer-events-none" />
        <Container>
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
              <Sparkles size={13} /> Tested Across Real Indian Scenarios
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Real Indian Consumer Disputes <br />
              <span className="text-[#a78bfa]">Solved with Agentic Autonomy</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              From false courier NDRs in Bengaluru to delayed merchant refund settlements and flight cancellations, explore how OutreachAI replaces manual frustration with verified resolution.
            </p>
          </div>
        </Container>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <div
                  key={uc.id}
                  id={uc.id}
                  className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-white/20 transition group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#a78bfa] group-hover:scale-105 transition">
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono uppercase text-zinc-400">
                        {uc.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition">
                        {uc.title}
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="rounded-xl bg-[#11141c] p-3 border border-white/5 space-y-1">
                          <span className="font-bold text-rose-400 uppercase text-[10px] block">The Problem:</span>
                          <p className="text-zinc-400 leading-relaxed">{uc.problem}</p>
                        </div>
                        <div className="rounded-xl bg-[#11141c] p-3 border border-white/5 space-y-1">
                          <span className="font-bold text-[#a78bfa] uppercase text-[10px] block">OutreachAI Action:</span>
                          <p className="text-zinc-300 leading-relaxed">{uc.resolution}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-mono">Connected Rail:</span>
                      <span className="font-semibold text-zinc-300">{uc.rail}</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      ✓ {uc.example}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-[#0d1017] p-8 sm:p-12 text-center shadow-2xl space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Have a Similar Unresolved Grievance?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                Deploy OutreachAI in under 30 seconds. Describe your dispute in natural language and let the agent orchestrate resolution.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
              >
                <Bot size={15} />
                <span>RESOLVE YOUR DISPUTE NOW</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <span>TRY 3-MIN INTERACTIVE DEMO</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

