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
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              {NAV_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-zinc-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
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

          {/* Infrastructure Rails */}
          <div>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Integrated Rails
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Delhivery Logistics Rail</li>
              <li>Pine Labs Payment Switch</li>
              <li>Gnani Indic Voice AI</li>
              <li>Consumer Protection Act (2019)</li>
              <li>NPCI UPI Settlement Validation</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Contact & Support
            </h3>
            <div className="space-y-3 text-xs">
              <p className="text-zinc-400">
                For competition evaluations, partner desks, and consumer inquiries:
              </p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-[#8b5cf6]/50 hover:bg-[#8b5cf6]/10 hover:text-white"
                aria-label={`Send email to ${SUPPORT_EMAIL}`}
              >
                <Mail size={13} className="text-[#a78bfa]" />
                <span className="font-mono">{SUPPORT_EMAIL}</span>
              </a>
              <div className="flex gap-4 pt-1 text-xs">
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition"
                >
                  GitHub
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition"
                >
                  LinkedIn
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition"
                >
                  X
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