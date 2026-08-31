import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, FileText, Scale, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata, generateBreadcrumbSchema } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "Grievance Automation Guides & Consumer Rights Resources — OutreachAI",
  description:
    "Explore authoritative educational resources on Indian consumer rights (CPA 2019), logistics false NDR overrides, refund turnaround times (RBI TAT), and autonomous agent workflows.",
  path: "/blog",
  keywords: [
    "consumer grievance guides India",
    "Consumer Protection Act 2019 complaint guide",
    "how to solve false courier NDR",
    "delayed refund legal notice format",
    "AI agent complaint escalation workflows",
  ],
});

export default function BlogHubPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides & Resources", url: "/blog" },
  ]);

  const articles = [
    {
      slug: "how-ai-automates-consumer-complaint-follow-ups",
      title: "How Autonomous AI Agents Transform Consumer Complaint Follow-Ups",
      category: "Agent Architecture",
      readTime: "5 min read",
      date: "February 2026",
      summary:
        "Why traditional circular customer chatbots fail consumers, and how multi-rail agentic DAGs autonomously investigate, escalate across courier and payment switches, and secure verified resolutions.",
      icon: Sparkles,
    },
    {
      slug: "ecommerce-ndr-refund-dispute-guide",
      title: "E-Commerce False NDRs & Delayed Refunds: The Complete Statutory Action Guide",
      category: "Logistics & Consumer Rights",
      readTime: "7 min read",
      date: "February 2026",
      summary:
        "A practical guide to detecting fraudulent courier 'Customer Not Reachable' marks, auditing Delhivery tracking scans, and claiming instant bank refunds under RBI TAT framework.",
      icon: Truck,
    },
    {
      slug: "consumer-protection-act-2019-grievance-workflows",
      title: "Consumer Protection Act (2019): Section 2(47) & Section 35 Enforcement",
      category: "Legal Framework",
      readTime: "6 min read",
      date: "February 2026",
      summary:
        "How statutory consumer protection laws define 'Unfair Trade Practices' and 'Deficiency of Service', and how automated 48-hour legal notice dockets force nodal compliance.",
      icon: Scale,
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
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090d] py-16 sm:py-24">
        <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#8b5cf6]/15 blur-[140px] pointer-events-none" />
        <Container>
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
              <BookOpen size={12} /> Knowledge Base & Research
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Consumer Rights & Grievance Automation Guides
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              In-depth research on Indian consumer law (CPA 2019), logistics carriage SLAs, and autonomous dispute resolution architectures.
            </p>
          </div>
        </Container>
      </section>

      {/* Articles Grid */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {articles.map((art) => {
              const Icon = art.icon;
              return (
                <article
                  key={art.slug}
                  className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-xl hover:border-[#8b5cf6]/50 transition group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[#a78bfa] font-semibold">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock size={12} />
                        <span>{art.readTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition leading-snug">
                        <Link href={`/blog/${art.slug}`}>
                          {art.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar size={11} /> {art.date}
                    </span>
                    <Link
                      href={`/blog/${art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#a78bfa] group-hover:translate-x-0.5 transition"
                    >
                      <span>Read Guide</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

