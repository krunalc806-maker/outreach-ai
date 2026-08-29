import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OutreachAI — Autonomous AI Agent for Consumer Dispute Resolution",
  description: "Autonomous AI agent engineered for Indian consumer disputes, logistics NDR overrides, and verified payment resolutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased bg-[#08090d] text-zinc-100">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
