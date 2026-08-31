"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import Logo from "@/components/common/Logo";
import { NAV_LINKS, SITE, SOCIAL_LINKS, SUPPORT_EMAIL } from "@/constants/site";
import { Mail, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08090d] text-zinc-400">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-3.5 sm:col-span-2 lg:col-span-1">
            <Logo showTagline={false} />
            <p className="text-xs leading-relaxed text-zinc-400 max-w-xs">
              Autonomous AI agent engineered for Indian consumer disputes, logistics NDR overrides, and verified payment resolutions.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#a78bfa]">
              <Sparkles size={12} />
              <span>The Ken Case Competition 2026 — The Great Rewiring</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Platform & Features
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/features" className="text-zinc-400 transition hover:text-white">
                  Autonomous Rails
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-zinc-400 transition hover:text-white">
                  Real Use Cases
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-zinc-400 transition hover:text-white">
                  3-Min Case Demo
                </Link>
              </li>
              <li>
                <Link href="/evidence" className="text-zinc-400 transition hover:text-white">
                  Evidence & Architecture
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 transition hover:text-white">
                  Guides & Research Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-[#a78bfa] transition hover:underline font-semibold"
                >
                  Agent Mission Control →
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrated Rails */}
          <div>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Connected Rails
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Delhivery Logistics Rail</li>
              <li>Pine Labs Payment Switch</li>
              <li>Gnani Indic Voice AI</li>
              <li>Consumer Protection Act (2019)</li>
              <li>NPCI UPI Settlement Validation</li>
              <li>DGCA Passenger Charter (CAR)</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Contact & Inquiries
            </h3>
            <div className="space-y-3 text-xs">
              <p className="text-zinc-400">
                For competition evaluations, partner desks, and consumer inquiries:
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:text-white"
                  aria-label={`Send email to ${SUPPORT_EMAIL}`}
                >
                  <Mail size={13} className="text-[#a78bfa]" />
                  <span className="font-mono">{SUPPORT_EMAIL}</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:text-white"
                >
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Request Demo / Contact Form</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:text-white transition"
                  aria-label="GitHub Repository"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white transition"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="h-3.5 w-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 py-5 text-xs text-zinc-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Built for The Ken Case Competition 2026.
          </p>

          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-zinc-400 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-400 transition">
              Terms of Service
            </Link>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck size={13} /> Bank-Grade Security & Isolation
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}