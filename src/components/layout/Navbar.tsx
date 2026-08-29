"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight, Bot } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/layout/Container";
import { NAV_LINKS } from "@/constants/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090d]/90 backdrop-blur-xl">
      <Container>
        <nav className="flex h-18 items-center justify-between">
          <Logo />

          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-wider text-zinc-400 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-zinc-400 transition hover:text-white px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95"
            >
              <Bot size={13} />
              <span>Start with the Agent</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-site-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="rounded-lg border border-white/10 p-2 text-white md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-site-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden border-t border-white/10 md:hidden py-5 bg-[#08090d]"
            >
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-zinc-300 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2.5 text-xs font-extrabold text-white"
                  >
                    <Bot size={14} />
                    <span>Start with the Agent</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
