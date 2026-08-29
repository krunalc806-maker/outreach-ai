"use client";

import { Suspense } from "react";
import InteractiveLampAuth from "@/components/auth/InteractiveLampAuth";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading register terminal...</div>}>
        <InteractiveLampAuth mode="register" nextPath="/onboarding" />
      </Suspense>
    </main>
  );
}
