"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InteractiveLampAuth from "@/components/auth/InteractiveLampAuth";

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  return <InteractiveLampAuth mode="login" nextPath={next} />;
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <Suspense fallback={<div className="text-xs text-zinc-400">Loading interactive login...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
