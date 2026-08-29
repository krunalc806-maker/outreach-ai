"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Lock,
  Plane,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Truck,
  IndianRupee,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { saveOnboardingProfile } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State populated from actual Google Session
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    avatarUrl: "",
    role: "Individual Consumer",
    organization: "",
    primaryObjective: "ECOMMERCE_NDR_REFUND",
  });

  useEffect(() => {
    async function loadAuthIdentity() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const meta = user.user_metadata || {};
          const realName = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "");
          const realAvatar = meta.avatar_url || meta.picture || "";
          
          setFormData((prev) => ({
            ...prev,
            email: user.email || "",
            fullName: realName,
            avatarUrl: realAvatar,
            organization: meta.organization || meta.city || "",
          }));
        }
      } catch {}
    }
    loadAuthIdentity();
  }, []);

  const OBJECTIVE_OPTIONS = [
    {
      id: "ECOMMERCE_NDR_REFUND",
      icon: Truck,
      title: "E-Commerce False NDR & Delayed Refunds",
      desc: "Resolve courier delivery exceptions and claim instant bank refunds.",
      badge: "Delhivery + Pine Labs Rails",
    },
    {
      id: "FLIGHT_TRAVEL_GRIEVANCE",
      icon: Plane,
      title: "Aviation & Travel Cancellation Disputes",
      desc: "Mandatory 100% full refund claims under DGCA Passenger Charter Rule 3.3.",
      badge: "Gnani Voice + CPA 2019 Rail",
    },
    {
      id: "SUBSCRIPTION_BILLING_DISPUTE",
      icon: IndianRupee,
      title: "Unauthorized Auto-Debits & Banking Disputes",
      desc: "Direct RBI Ombudsman filings and UPI chargeback recoveries.",
      badge: "Pine Labs Switch Rail",
    },
  ];

  const handleNext = () => {
    if (currentStep === 2 && (!formData.fullName.trim() || formData.fullName.length < 2)) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }
    setErrorMessage(null);
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const fd = new FormData();
    fd.append("fullName", formData.fullName || "Consumer");
    fd.append("role", formData.role);
    fd.append("organization", formData.organization || "Not provided");
    fd.append("primaryObjective", formData.primaryObjective);
    fd.append("avatarUrl", formData.avatarUrl);

    try {
      const res = await saveOnboardingProfile(null, fd);
      if (res?.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
      } else {
        router.push("/dashboard");
      }
    } catch {
      router.push("/dashboard");
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "OA";
  };

  return (
    <main className="min-h-screen bg-[#08090d] text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0d1017]/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-7">
        {/* Top Header & Step Progress Bar */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <Logo size="sm" showTagline={false} />
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <span className="text-[#a78bfa] font-bold">Step {currentStep}</span> / 4
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? "bg-[#8b5cf6] shadow-sm shadow-[#8b5cf6]/50"
                    : step < currentStep
                    ? "bg-emerald-400"
                    : "bg-zinc-800"
                }`}
              />
            ))}
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2"
          >
            <ShieldAlert size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: WELCOME & VERIFIED GOOGLE IDENTITY */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                <CheckCircle2 size={12} /> Verified Google Identity
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome to OutreachAI
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400">
                Your authenticated profile is securely linked to the consumer dispute agent.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-3.5">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName || "User Avatar"}
                    className="h-12 w-12 rounded-full border-2 border-[#8b5cf6] object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8b5cf6] font-bold text-sm text-white">
                    {getInitials(formData.fullName, formData.email)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {formData.fullName || "Google Account Connected"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mt-0.5">
                    <Lock size={11} className="text-zinc-500" />
                    <span>{formData.email || "Authenticated Session"}</span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 uppercase">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-white/5 pt-2.5">
                Email address is permanently locked to your Google account for secure audit and verification.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PERSONAL PROFILE */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#a78bfa] font-bold">Personal Profile</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Confirm your details
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Used to draft statutory grievance dockets under Consumer Protection Act 2019.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g. Bengaluru, Mumbai, Delhi NCR"
                  className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Consumer Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
                >
                  <option value="Individual Consumer">Individual Consumer (Retail / E-Commerce)</option>
                  <option value="Freelancer / Small Merchant">Freelancer / Small Business</option>
                  <option value="Consumer Rights Advocate">Consumer Rights Advocate</option>
                  <option value="Competition Judge / Evaluator">The Ken Judge / Evaluator</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: USE CASE SELECTION */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#a78bfa] font-bold">Use Case Selection</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                What problem are you solving?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                The agent configures rail adapters (Delhivery Logistics, Pine Labs Payments, Gnani Voice) for your dispute.
              </p>
            </div>

            <div className="space-y-2.5">
              {OBJECTIVE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.primaryObjective === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryObjective: opt.id })}
                    className={`w-full text-left rounded-2xl border p-3.5 transition ${
                      isSelected
                        ? "border-[#8b5cf6] bg-[#8b5cf6]/10 ring-1 ring-[#8b5cf6]"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? "bg-[#8b5cf6] text-white font-bold" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white text-xs sm:text-sm">{opt.title}</h4>
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[9px] font-mono text-zinc-300">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* STEP 4: READY */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8b5cf6] text-white shadow-xl shadow-[#8b5cf6]/25">
              <Bot size={28} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Your Agent Mission Control is Ready
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                OutreachAI is primed to investigate your issue, coordinate across rails, and execute verified resolutions.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4 text-xs text-left space-y-2 max-w-sm mx-auto">
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-400">User:</span>
                <span className="font-bold text-white">{formData.fullName || "Authenticated User"}</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-400">Email:</span>
                <span className="font-mono text-zinc-300">{formData.email || "Google Account"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Rails:</span>
                <span className="text-[#a78bfa] font-semibold">Delhivery, Pine Labs, Gnani</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-white/10"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed]"
            >
              <span>Continue</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinishOnboarding}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-6 py-2.5 text-xs font-extrabold text-white shadow-xl shadow-[#8b5cf6]/30 transition hover:bg-[#7c3aed] disabled:opacity-50"
            >
              <Sparkles size={13} />
              <span>{isSubmitting ? "Configuring..." : "ENTER OUTREACHAI"}</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
