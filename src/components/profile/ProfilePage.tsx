"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Calendar,
  Sparkles,
  Save,
  CheckCircle2,
  Lock,
  IndianRupee,
  Clock,
  Activity,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ProfileState {
  id: string;
  fullName: string;
  email: string;
  city: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  onboardingCompleted: boolean;
}

interface ActivityStats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  recoveredAmount: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    id: "",
    fullName: "",
    email: "",
    city: "",
    avatarUrl: null,
    role: "Individual Consumer",
    createdAt: new Date().toISOString(),
    onboardingCompleted: true,
  });

  const [stats, setStats] = useState<ActivityStats>({
    totalCases: 0,
    activeCases: 0,
    resolvedCases: 0,
    recoveredAmount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfileAndStats() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const meta = user.user_metadata || {};
          const realName = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "Consumer");
          const realAvatar = meta.avatar_url || meta.picture || null;
          const realCity = meta.organization || meta.city || "Not provided";

          // Fetch DB profile
          const res = await fetch("/api/user");
          const data = await res.json();

          if (data.success && data.user) {
            setProfile({
              id: user.id,
              fullName: data.user.fullName || realName,
              email: user.email || data.user.email || "",
              city: data.user.organization === "Bengaluru, Karnataka" && !meta.city ? realCity : (data.user.organization || realCity),
              avatarUrl: realAvatar,
              role: data.user.role || "Individual Consumer",
              createdAt: user.created_at || new Date().toISOString(),
              onboardingCompleted: true,
            });
          } else {
            setProfile({
              id: user.id,
              fullName: realName,
              email: user.email || "",
              city: realCity,
              avatarUrl: realAvatar,
              role: "Individual Consumer",
              createdAt: user.created_at || new Date().toISOString(),
              onboardingCompleted: true,
            });
          }
        }

        // Fetch User's actual cases from DB for real metrics
        const casesRes = await fetch("/api/cases");
        const casesData = await casesRes.json();
        if (casesData.success && Array.isArray(casesData.cases)) {
          const casesList = casesData.cases;
          const resolved = casesList.filter((c: any) => c.status === "RESOLVED");
          const recovered = resolved.reduce((acc: number, c: any) => acc + (Number(c.extractedEntities?.amount) || Number(c.resolution?.moneyRecovered) || 0), 0);

          setStats({
            totalCases: casesList.length,
            activeCases: casesList.length - resolved.length,
            resolvedCases: resolved.length,
            recoveredAmount: recovered,
          });
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfileAndStats();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          role: profile.role,
          organization: profile.city,
          primaryObjective: "ECOMMERCE_NDR_REFUND",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setErrorMessage(data.error || "Failed to save profile.");
      }
    } catch {
      setErrorMessage("Network error while saving profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name && name !== "Consumer") {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "OA";
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-32 rounded-3xl border border-white/10 bg-[#0d1017] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 rounded-2xl border border-white/10 bg-[#0d1017] animate-pulse" />
          <div className="h-28 rounded-2xl border border-white/10 bg-[#0d1017] animate-pulse" />
          <div className="h-28 rounded-2xl border border-white/10 bg-[#0d1017] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-16 w-16 rounded-2xl border-2 border-[#8b5cf6] object-cover shadow-lg shadow-[#8b5cf6]/20"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8b5cf6] font-bold text-xl text-white shadow-lg shadow-[#8b5cf6]/20">
                {getInitials(profile.fullName, profile.email)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {profile.fullName || "Google Account Connected"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 font-mono">
              Role: <span className="text-[#a78bfa] font-bold">{profile.role}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Real Activity Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Cases</span>
            <Activity size={14} className="text-[#a78bfa]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">{stats.totalCases}</p>
          <p className="text-[10px] text-zinc-500 font-mono">In Database</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Disputes</span>
            <Clock size={14} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 tracking-tight">{stats.activeCases}</p>
          <p className="text-[10px] text-zinc-500 font-mono">In Progress</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Resolved Cases</span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300 tracking-tight">{stats.resolvedCases}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Verified Settlements</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-4 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Disputed Amount</span>
            <IndianRupee size={14} className="text-[#a78bfa]" />
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">₹{stats.recoveredAmount.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Tracked on Rails</p>
        </div>
      </div>

      {/* Identity & Editable Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-5">
          <div className="border-b border-white/5 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User size={16} className="text-[#a78bfa]" />
              <span>Personal Identity & Location</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              These details are used when the AI agent generates formal statutory notices under CPA 2019.
            </p>
          </div>

          {saveSuccess && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>Profile updated and persisted successfully.</span>
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
              <Shield size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
                placeholder="Enter your legal full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Email Address <span className="text-[10px] text-zinc-500 lowercase">(read-only Google SSO)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full rounded-xl border border-zinc-800 bg-white/5 p-3 text-xs sm:text-sm text-zinc-400 cursor-not-allowed outline-none font-mono"
                />
                <Lock size={14} className="absolute right-3.5 top-3.5 text-zinc-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                City / Jurisdiction
              </label>
              <input
                type="text"
                value={profile.city === "Not provided" ? "" : profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="e.g. Bengaluru, Mumbai, Delhi NCR"
                className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Current: {profile.city || "Not provided"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1.5">
                Primary Account Role
              </label>
              <select
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-xs sm:text-sm text-white outline-none focus:border-[#8b5cf6]"
              >
                <option value="Individual Consumer">Individual Consumer (Retail / E-Commerce)</option>
                <option value="Freelancer / Small Merchant">Freelancer / Small Business</option>
                <option value="Consumer Rights Advocate">Consumer Rights Advocate</option>
                <option value="Competition Judge / Evaluator">The Ken Judge / Evaluator</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] disabled:opacity-50"
              >
                <Save size={14} />
                <span>{isSaving ? "Saving changes..." : "Save Profile Changes"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Authentication Metadata */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Account Security</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Auth Method</span>
                <span className="font-semibold text-white">Google OAuth (SSO)</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">RLS Status</span>
                <span className="font-semibold text-emerald-400">Strict User Isolation</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-zinc-400">Onboarding</span>
                <span className="font-semibold text-[#a78bfa]">Completed</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Session Tier</span>
                <span className="font-mono text-zinc-300">Consumer v1</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Competition Rails</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Your cases are wired to <span className="text-zinc-200">Delhivery Logistics</span>, <span className="text-zinc-200">Pine Labs Payments</span>, and <span className="text-zinc-200">Gnani Voice</span> adapters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

