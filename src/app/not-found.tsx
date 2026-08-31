import Link from "next/link";
import { ArrowLeft, Bot, FileQuestion, Home, ShieldAlert } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { constructMetadata } from "@/lib/seo/config";

export const metadata = constructMetadata({
  title: "404 - Page Not Found",
  description: "The requested OutreachAI page could not be found. Navigate back to the autonomous agent mission control or explore available dispute resolution rails.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white flex flex-col justify-between">
      <Navbar />
      <Container className="py-24 max-w-2xl text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-[#0d1017] shadow-2xl shadow-[#8b5cf6]/20">
          <FileQuestion size={36} className="text-[#a78bfa]" />
        </div>

        <div className="space-y-2">
          <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-rose-300 uppercase">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist or has moved. Return to OutreachAI to deploy autonomous dispute resolution agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-3 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
          >
            <Home size={14} />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white active:scale-95"
          >
            <Bot size={14} className="text-[#a78bfa]" />
            <span>Try 3-Min Agent Demo</span>
          </Link>
        </div>
      </Container>
      <Footer />
    </main>
  );
}

