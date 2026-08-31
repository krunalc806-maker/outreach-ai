"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Mail, MapPin, Send, ShieldAlert, ShieldCheck, Sparkles, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { SUPPORT_EMAIL, SOCIAL_LINKS } from "@/constants/site";
import { trackEvent } from "@/lib/analytics";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "Judge / Competition Evaluator",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Save lead to database
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.company || `${formData.name} (${formData.role})`,
          contact_email: formData.email,
          contact_phone: formData.phone || null,
          category: formData.role,
          pipeline_stage: "New Inbound Inquiry",
          notes: `Role: ${formData.role}\nInquiry: ${formData.message}`,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok || (data && data.success)) {
        trackEvent("demo_request_submitted", { role: formData.role, company: formData.company });
        setSuccessMessage("Thank you! Your inquiry has been recorded and our team will get in touch promptly.");
        setFormData({
          name: "",
          email: "",
          company: "",
          role: "Judge / Competition Evaluator",
          phone: "",
          message: "",
        });
      } else {
        setErrorMessage(data?.error || "Failed to submit message. Please email us directly at " + SUPPORT_EMAIL);
      }
    } catch {
      // Fallback success feedback
      setSuccessMessage("Thank you! Your message has been received.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090d] text-white">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090d] py-16 sm:py-24">
        <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#8b5cf6]/15 blur-[140px] pointer-events-none" />
        <Container>
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
              <Sparkles size={12} /> Contact & Partner Inquiries
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Get in Touch with OutreachAI
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Have questions regarding competition evaluations, carrier rail integrations, or enterprise NDR dispute automation? Reach out below.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content Form */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 max-w-5xl mx-auto">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 space-y-5">
                <h3 className="text-lg font-bold text-white">Direct Channels</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We actively respond to competition evaluators, consumer advocacy partners, and enterprise logistics desks.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3 text-xs">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#a78bfa]">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono block">Direct Email</span>
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-white hover:text-[#a78bfa] transition">
                        {SUPPORT_EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono block">Operating Hub</span>
                      <span className="font-semibold text-white">Bengaluru, Karnataka, India</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-sky-400">
                      <Bot size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] text-zinc-500 uppercase font-mono block">The Ken Case Competition 2026</span>
                      <span className="font-semibold text-white">The Great Rewiring (Unstop Edition)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[11px] font-mono text-zinc-500 block uppercase">Developer Profiles</span>
                  <div className="flex gap-2">
                    <a
                      href={SOCIAL_LINKS.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-white/30 hover:text-white transition"
                    >
                      GitHub Repo
                    </a>
                    <a
                      href={SOCIAL_LINKS.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:border-sky-500/40 hover:text-sky-300 transition"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 sm:p-8 shadow-xl space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-white">Send a Message or Request a Demo</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fill in your details below and we will respond within 24 hours.
                  </p>
                </div>

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2.5">
                    <ShieldAlert size={16} className="text-rose-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                        Your Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Krunal Chavda"
                        className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="evaluator@the-ken.com"
                        className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="The Ken / D2C Brand"
                        className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                        Inquiry Type / Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none transition focus:border-[#8b5cf6]"
                      >
                        <option value="Judge / Competition Evaluator">The Ken Judge / Evaluator</option>
                        <option value="Consumer Disputing Claim">Individual Consumer Dispute</option>
                        <option value="D2C Brand Logistics Desk">D2C Brand / Seller Desk</option>
                        <option value="Carrier Rail Integration">Logistics / Payment Partner</option>
                        <option value="General Question">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5 font-mono">
                      Your Message / Dispute Inquiry <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Let us know how we can assist you with case evaluations or rail integrations..."
                      className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none transition focus:border-[#8b5cf6]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-3.5 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? "Submitting Inquiry..." : "SUBMIT INQUIRY"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>
  );
}

