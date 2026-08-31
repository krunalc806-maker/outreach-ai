import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Clock, IndianRupee, Layers, Scale, ShieldAlert, ShieldCheck, Sparkles, Truck, Volume2, Workflow } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Autonomous Grievance Features & Rails — Delhivery, Pine Labs, Gnani",
  description:
    "Explore OutreachAI's multi-rail agentic architecture: Delhivery Logistics tracking, Pine Labs instant banking reversals, Gnani Indic voice, and CPA 2019 legal notice dockets.",
  path: "/features",
  keywords: [
    "AI dispute resolution features",
    "Delhivery logistics NDR audit",
    "Pine Labs refund settlement switch",
    "Gnani voice AI consumer complaints",
    "Consumer Protection Act 2019 legal notice automation",
    "bounded autonomy human consent agent",
  ],
});

export default function FeaturesPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Features", url: "/features" },
  ]);

  const features = [
    {
      id: "logistics-rail",
      icon: Truck,
      tag: "DELHIVERY LOGISTICS RAIL",
      title: "Automated NDR Audit & Courier Override",
      description:
        "Field delivery riders often falsely mark consignments as 'Customer Not Reachable' to meet delivery SLAs without calling. OutreachAI cross-references rider geolocation, telecom call logs, and hub scans to detect false NDRs and automatically dispatches priority re-attempt orders.",
      capabilities: [
        "Real-time AWB telemetry & scan audit across Indian hubs",
        "False NDR exception detection with 98.4% accuracy",
        "Direct supervisor escalations to bypass circular bots",
        "Proof-of-attempt verification before RTO (Return to Origin)",
      ],
      badge: "Connected Rail",
    },
    {
      id: "payment-rail",
      icon: IndianRupee,
      tag: "PINE LABS PAYMENT SWITCH",
      title: "Statutory Banking Refund & UTR Settlement",
      description:
        "When merchants withhold refunds past the statutory 72-hour window, OutreachAI audits the acquirer switch, verifies gateway reversal logs, and triggers direct banking settlement tokens verified against NPCI & RBI Turn Around Time (TAT) regulations.",
      capabilities: [
        "Acquirer payment gateway audit (HDFC, Pine Labs, Razorpay)",
        "RBI TAT SLA monitoring (T+1 statutory credit framework)",
        "Direct Bank UTR confirmation and statement verification",
        "Automated ₹100/day compensation claim for delayed credits",
      ],
      badge: "Connected Rail",
    },
    {
      id: "voice-rail",
      icon: Volume2,
      tag: "GNANI INDIC VOICE AI",
      title: "Multilingual Regional Voice Dispatch",
      description:
        "India speaks in 22 official languages. OutreachAI integrates Indic speech recognition to accept grievance voice notes in Hinglish, Kannada, Hindi, and Tamil, transcribing intent and dispatching IVR prompts directly to local delivery hubs.",
      capabilities: [
        "Regional dialect and code-mixed speech recognition (ASR)",
        "Local delivery landmark extraction (e.g. Indiranagar 12th Main)",
        "Automated hub phone calls with natural conversational voice",
        "Zero typing barrier for non-English consumer disputes",
      ],
      badge: "Indic Pipeline",
    },
    {
      id: "legal-dockets",
      icon: Scale,
      tag: "STATUTORY DOCKET ENGINE",
      title: "Consumer Protection Act (2019) Notices",
      description:
        "Transforms ambiguous grievances into legally binding dockets citing Section 2(47) (Unfair Trade Practice), Section 35 (Deficiency of Service), and DGCA Civil Aviation Requirements. Dispatched directly to Principal Nodal Officers.",
      capabilities: [
        "Statutory citation interpolation with 48-hour legal SLA",
        "National Consumer Helpline (NCH) docket preparation",
        "DGCA Passenger Charter Rule 3.3 mandatory flight refund claims",
        "Formal evidentiary audit trail for Consumer Forum filing",
      ],
      badge: "Legal Framework",
    },
    {
      id: "bounded-autonomy",
      icon: ShieldCheck,
      tag: "BOUNDED AUTONOMY",
      title: "Human-in-the-Loop 1-Tap Authorization",
      description:
        "AI agents must never gamble with consumer money or legal rights. OutreachAI enforces strict execution boundaries: low-risk actions (investigations, tracking) execute autonomously, while high-risk actions (bank settlements, legal notices) require explicit 1-tap consumer consent.",
      capabilities: [
        "Cryptographically signed authorization tokens",
        "Transparent impact & risk analysis before any financial trigger",
        "Zero unauthorized debit or settlement actions",
        "Revocable action consent with full audit logging",
      ],
      badge: "Safety Architecture",
    },
    {
      id: "followup-engine",
      icon: Workflow,
      tag: "FOLLOW-UP ENGINE",
      title: "Bounded Escalation DAG Engine",
      description:
        "Standard bots fire a ticket and forget. OutreachAI's DAG engine schedules sequential follow-up probes at defined intervals (every 2 hours), escalating pressure until a verified Bank UTR or supervisor resolution is confirmed.",
      capabilities: [
        "Automated probe schedules with statutory SLA countdowns",
        "Dynamic multi-channel escalation (Email → API → Nodal Desk)",
        "Self-terminating upon verified bank credit confirmation",
        "Eliminates manual consumer check-ins and follow-up fatigue",
      ],
      badge: "Autonomous DAG",
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
              <Sparkles size={13} /> Multi-Rail Agentic Architecture
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Enterprise-Grade Rails Engineered for <br />
              <span className="text-[#a78bfa]">Autonomous Dispute Resolution</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              OutreachAI bypasses circular support chatbots by connecting directly to Indian logistics, payment switch, and statutory regulatory rails.
            </p>
          </div>
        </Container>
      </section>

      {/* Feature Grid */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  id={feat.id}
                  className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl hover:border-white/20 transition group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#a78bfa] group-hover:scale-105 transition">
                        <Icon size={20} />
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-mono uppercase text-zinc-400">
                        {feat.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#a78bfa] font-bold block">
                        {feat.tag}
                      </span>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 space-y-2">
                    <span className="text-[11px] font-bold text-zinc-300 block uppercase font-mono">
                      Key Capabilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-400">
                      {feat.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Conversion CTA */}
          <div className="mt-16 rounded-3xl border border-white/10 bg-[#0d1017] p-8 sm:p-12 text-center shadow-2xl space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Deploy Your Autonomous Dispute Agent?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                No complex setup. Enter your tracking number or dispute details in plain text and let OutreachAI orchestrate across rails.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
              >
                <Bot size={15} />
                <span>LAUNCH YOUR DISPUTE AGENT</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
              >
                <span>EXPLORE 3-MIN CASE DEMO</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

