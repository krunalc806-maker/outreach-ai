"use client";

import { Star } from "lucide-react";
import Container from "@/components/layout/Container";

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "E-Commerce Shopper",
    location: "Bengaluru, Karnataka",
    recovery: "₹3,499 Recovered",
    review:
      "My Zara package was marked with fake delivery attempts for 4 days. OutreachAI audited the AWB, generated the statutory notice under CPA 2019, and secured my Pine Labs refund in 4.5 hours.",
  },
  {
    name: "Vikram Mehta",
    role: "Frequent Flyer",
    location: "Mumbai, Maharashtra",
    recovery: "₹4,200 Recovered",
    review:
      "Airline deducted illegal cancellation fees for a fog delay. The agent cited DGCA Passenger Charter Rule 3.3 and dispatched an autonomous grievance. Full refund credited with zero hassle.",
  },
  {
    name: "Pooja Hegde",
    role: "Freelance Designer",
    location: "Hyderabad, Telangana",
    recovery: "₹1,850 Recovered",
    review:
      "An unauthorized recurring subscription debited my UPI without e-mandate consent. OutreachAI filed the RBI Ombudsman chargeback petition directly on the payment switch rail.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#08080a] py-20 sm:py-28 border-t border-white/5">
      <Container>
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <span className="rounded-full border border-[#d4ff32]/30 bg-[#d4ff32]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4ff32]">
            VERIFIED RESOLUTIONS
          </span>

          <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Real Indian Consumer Stories
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            Real resolutions achieved across logistics, payment switches, and statutory grievance rails.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 max-w-5xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-white/10 bg-[#0d0d12] p-6 sm:p-7 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-[#d4ff32]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-[#d4ff32]"
                      />
                    ))}
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 font-mono">
                    {item.recovery}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="border-t border-white/5 pt-3">
                <h3 className="font-bold text-xs text-white">
                  {item.name}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {item.role} · {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
