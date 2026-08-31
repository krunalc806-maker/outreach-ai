"use client";

import { CheckCircle2, IndianRupee, Plane, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Container from "@/components/layout/Container";
import Link from "next/link";

const scenarios = [
  {
    category: "E-Commerce Logistics",
    title: "Delhivery False NDR & Delayed Zara Refund",
    location: "Bengaluru, Karnataka",
    recovery: "₹3,499 Recovered",
    timeSaved: "180 mins saved",
    icon: Truck,
    description:
      "Package marked with 2 false NDR exceptions without phone calls. OutreachAI audited the AWB, generated statutory notice under CPA 2019, and secured direct Pine Labs refund credit in 4.5 hours.",
    rail: "Delhivery + Pine Labs Switch",
  },
  {
    category: "Aviation & Travel",
    title: "Airline Fog Cancellation Penalty Reversal",
    location: "Mumbai, Maharashtra",
    recovery: "₹4,200 Recovered",
    timeSaved: "240 mins saved",
    icon: Plane,
    description:
      "Airline withheld cancellation charges during heavy fog delays. The agent cited DGCA Passenger Charter Rule 3.3 (Mandatory 100% refund) and dispatched a statutory complaint directly to the nodal desk.",
    rail: "DGCA CAR Legal Rail",
  },
  {
    category: "Banking & Payments",
    title: "Unauthorized Recurring UPI Chargeback",
    location: "Hyderabad, Telangana",
    recovery: "₹1,850 Recovered",
    timeSaved: "120 mins saved",
    icon: IndianRupee,
    description:
      "An unauthorized recurring subscription debited a consumer account without e-mandate consent. OutreachAI prepared an evidentiary chargeback docket under RBI Ombudsman frameworks.",
    rail: "RBI Ombudsman Switch Rail",
  },
];

export default function Testimonials() {
  return (
    <section id="scenarios" className="bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
            REAL RESOLUTION SCENARIOS
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Verified Dispute Resolution Case Studies
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Real architectural dispute patterns resolved across logistics, payment gateways, and regulatory nodal rails.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
          {scenarios.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-white/20 transition group"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono uppercase text-zinc-400">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 font-mono">
                      {item.recovery}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-white group-hover:text-[#a78bfa] transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Target Region: {item.location}</span>
                    <span className="text-emerald-400 font-mono font-semibold">{item.timeSaved}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#a78bfa] font-mono">
                    <ShieldCheck size={12} />
                    <span>Rail: {item.rail}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#a78bfa] hover:underline"
          >
            <span>Explore all supported dispute use cases →</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
