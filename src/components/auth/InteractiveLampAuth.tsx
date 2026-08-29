"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  RefreshCw,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  User,
  ArrowRight,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { SUPPORT_EMAIL } from "@/constants/site";

export interface ColorTheme {
  name: string;
  primary: string;
  primaryHover: string;
  glow: string;
  beamGradient: string;
  shadeHex: string;
  borderGlow: string;
  badgeBg: string;
  badgeText: string;
}

export const LAMP_THEMES: ColorTheme[] = [
  {
    name: "Electric Violet",
    primary: "#8B5CF6",
    primaryHover: "#7C3AED",
    glow: "rgba(139, 92, 246, 0.6)",
    beamGradient: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.45) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 75%)",
    shadeHex: "#2E244D",
    borderGlow: "rgba(139, 92, 246, 0.4)",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    badgeText: "#C4B5FD",
  },
  {
    name: "Emerald Green",
    primary: "#10B981",
    primaryHover: "#059669",
    glow: "rgba(16, 185, 129, 0.65)",
    beamGradient: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.45) 0%, rgba(16, 185, 129, 0.12) 50%, transparent 75%)",
    shadeHex: "#1E3D32",
    borderGlow: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeText: "#6EE7B7",
  },
  {
    name: "Warm Amber",
    primary: "#F59E0B",
    primaryHover: "#D97706",
    glow: "rgba(245, 158, 11, 0.65)",
    beamGradient: "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.45) 0%, rgba(245, 158, 11, 0.12) 50%, transparent 75%)",
    shadeHex: "#45331E",
    borderGlow: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeText: "#FCD34D",
  },
  {
    name: "Neon Cyan",
    primary: "#06B6D4",
    primaryHover: "#0891B2",
    glow: "rgba(6, 182, 212, 0.65)",
    beamGradient: "radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.45) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 75%)",
    shadeHex: "#1A3540",
    borderGlow: "rgba(6, 182, 212, 0.4)",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeText: "#67E8F9",
  },
  {
    name: "Rose Coral",
    primary: "#F43F5E",
    primaryHover: "#E11D48",
    glow: "rgba(244, 63, 94, 0.65)",
    beamGradient: "radial-gradient(ellipse at 50% 0%, rgba(244, 63, 94, 0.45) 0%, rgba(244, 63, 94, 0.12) 50%, transparent 75%)",
    shadeHex: "#451F2A",
    borderGlow: "rgba(244, 63, 94, 0.4)",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeText: "#FDA4AF",
  },
];

interface InteractiveLampAuthProps {
  mode?: "login" | "register";
  nextPath?: string;
}

export default function InteractiveLampAuth({
  mode = "login",
  nextPath = "/dashboard",
}: InteractiveLampAuthProps) {
  // Lamp state: OFF initially
  const [isLampOn, setIsLampOn] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const [cordPulled, setCordPulled] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const currentTheme = LAMP_THEMES[themeIndex];

  // Pull cord handler - toggles lamp & cycles theme color
  const handlePullCord = () => {
    setCordPulled(true);
    setTimeout(() => setCordPulled(false), 300);

    if (!isLampOn) {
      setIsLampOn(true);
      // cycle theme
      setThemeIndex((prev) => (prev + 1) % LAMP_THEMES.length);
    } else {
      // If already on, cycle to next vibrant theme or toggle
      setThemeIndex((prev) => (prev + 1) % LAMP_THEMES.length);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (mode === "register" && (!fullName.trim() || password.length < 6)) {
      setErrorMessage("Please enter your name and a password of at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? { fullName: fullName.trim(), email: email.trim(), password }
          : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please verify credentials.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        mode === "register"
          ? "Account registered! Loading your workspace..."
          : "Signed in successfully! Loading dashboard..."
      );

      setTimeout(() => {
        window.location.href = data.redirect || nextPath;
      }, 350);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || "Connection error. Please try again.");
    }
  };

  const handle1ClickJudge = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "evaluator.judge@ken-rewiring2026.com",
          password: "JudgeAccess2026!",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Judge & Evaluator credentials authorized!");
        setTimeout(() => {
          window.location.href = nextPath;
        }, 300);
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="relative min-h-[660px] w-full max-w-5xl mx-auto flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      {/* Dynamic Ambient Background Illumination */}
      <motion.div
        animate={{
          opacity: isLampOn ? 0.35 : 0.05,
          scale: isLampOn ? [1, 1.08, 1] : 1,
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute h-[500px] w-[500px] rounded-full blur-[140px]"
        style={{
          backgroundColor: currentTheme.primary,
        }}
      />

      {/* Top Header Title */}
      <div className="text-center mb-6 z-20 space-y-1.5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold text-zinc-300 backdrop-blur-md">
          <Sparkles size={13} style={{ color: isLampOn ? currentTheme.primary : "#71717A" }} />
          <span>OutreachAI — The Ken Case Competition 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {mode === "register" ? "Create Workspace" : "Login Lamp"}
        </h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          {isLampOn
            ? `Illuminated with ${currentTheme.name} Theme (Click cord to cycle colors)`
            : "The lamp is currently asleep. Pull the cord below to illuminate & sign in."}
        </p>
      </div>

      {/* MAIN CONTAINER: Lamp on Left + Form Card on Right */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 min-h-[460px]">
        {/* ========================================================= */}
        {/* LEFT / CENTER: THE DESK LAMP WITH ANIMATED FACE & PULL CORD */}
        {/* ========================================================= */}
        <div className="relative flex flex-col items-center justify-center">
          {/* Lamp Assembly */}
          <div className="relative flex flex-col items-center">
            {/* Lampshade SVG with Face */}
            <div className="relative z-30">
              <svg width="170" height="150" viewBox="0 0 170 150" className="overflow-visible">
                <defs>
                  {/* Glowing Filter */}
                  <filter id="lampBulbGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient id="shade3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isLampOn ? currentTheme.shadeHex : "#222530"} />
                    <stop offset="50%" stopColor={isLampOn ? currentTheme.shadeHex : "#171922"} />
                    <stop offset="100%" stopColor="#0B0D12" />
                  </linearGradient>
                </defs>

                {/* Lampshade Trapezoid Dome */}
                <path
                  d="M 52 10 L 118 10 L 148 100 C 148 106 130 112 85 112 C 40 112 22 106 22 100 Z"
                  fill="url(#shade3DGrad)"
                  stroke={isLampOn ? currentTheme.primary : "rgba(255,255,255,0.15)"}
                  strokeWidth="2"
                  style={{
                    transition: "fill 0.4s ease, stroke 0.4s ease",
                  }}
                />

                {/* Bottom Rim of Lampshade */}
                <ellipse
                  cx="85"
                  cy="100"
                  rx="63"
                  ry="9"
                  fill={isLampOn ? currentTheme.primary : "#12141C"}
                  fillOpacity={isLampOn ? 0.35 : 0.8}
                  stroke={isLampOn ? currentTheme.primary : "rgba(255,255,255,0.2)"}
                  strokeWidth="1.5"
                />

                {/* ANIMATED EYES & MOUTH FACE ON LAMPSHADE */}
                {isLampOn ? (
                  /* AWAKE & HAPPY FACE ( ^ ▽ ^ ) */
                  <g className="transition-all duration-300">
                    {/* Left Eye ^ */}
                    <path
                      d="M 62 58 Q 69 48 76 58"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Right Eye ^ */}
                    <path
                      d="M 94 58 Q 101 48 108 58"
                      stroke="#FFFFFF"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Cute Happy Mouth ▽ */}
                    <path
                      d="M 80 66 Q 85 75 90 66 Z"
                      fill="#FF6B8B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                ) : (
                  /* SLEEPING CLOSED EYES ( - . - ) */
                  <g className="transition-all duration-300 opacity-60">
                    {/* Left Sleeping Eye */}
                    <path
                      d="M 64 58 Q 70 64 76 58"
                      stroke="#888EA8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Right Sleeping Eye */}
                    <path
                      d="M 94 58 Q 100 64 106 58"
                      stroke="#888EA8"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    {/* Peaceful Little Mouth */}
                    <ellipse cx="85" cy="68" rx="2.5" ry="1.5" fill="#888EA8" />
                  </g>
                )}

                {/* Bright Glowing Core Bulb when Lamp is ON */}
                {isLampOn && (
                  <ellipse
                    cx="85"
                    cy="100"
                    rx="32"
                    ry="6"
                    fill="#FFFFFF"
                    filter="url(#lampBulbGlow)"
                  />
                )}
              </svg>
            </div>

            {/* Volumetric Light Beam Cast Downwards */}
            {isLampOn && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0.7 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="pointer-events-none absolute top-24 z-10 w-[340px] h-[280px] origin-top"
                style={{
                  background: currentTheme.beamGradient,
                  clipPath: "polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)",
                }}
              />
            )}

            {/* Lamp Pole Stand & Heavy Base */}
            <div className="relative z-20 flex flex-col items-center -mt-9">
              {/* Metallic Stand Pole */}
              <div
                className="w-3.5 h-32 rounded-sm border-x border-white/20"
                style={{
                  background: isLampOn
                    ? "linear-gradient(to right, #71717A, #E4E4E7, #71717A)"
                    : "linear-gradient(to right, #27272A, #52525B, #27272A)",
                }}
              />

              {/* Heavy Circular Desk Base Plate */}
              <div className="relative flex flex-col items-center -mt-1">
                <div
                  className="w-24 h-5 rounded-full border border-white/20 shadow-2xl"
                  style={{
                    background: isLampOn
                      ? "radial-gradient(ellipse at 50% 30%, #D4D4D8 0%, #52525B 100%)"
                      : "radial-gradient(ellipse at 50% 30%, #3F3F46 0%, #18181B 100%)",
                  }}
                />
              </div>
            </div>

            {/* ========================================================= */}
            {/* INTERACTIVE PULL CORD WITH DRAG / CLICK & PHYSICS BOUNCE */}
            {/* ========================================================= */}
            <motion.div
              className="absolute left-10 top-24 z-40 flex flex-col items-center cursor-pointer"
              animate={{
                y: cordPulled ? 22 : 0,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              onClick={handlePullCord}
            >
              {/* Cord String */}
              <div
                className="w-[2px] transition-all duration-300"
                style={{
                  height: cordPulled ? "68px" : "48px",
                  background: isLampOn
                    ? currentTheme.primary
                    : "linear-gradient(to bottom, #A1A1AA, #E4E4E7)",
                }}
              />

              {/* Cord Pull Ball with Touch Target */}
              <motion.div
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className="relative flex items-center justify-center -mt-0.5"
              >
                <div
                  className="h-4 w-4 rounded-full border border-white shadow-lg transition-all duration-300"
                  style={{
                    backgroundColor: isLampOn ? currentTheme.primary : "#F4F4F5",
                    boxShadow: isLampOn ? `0 0 12px ${currentTheme.primary}` : "0 2px 6px rgba(0,0,0,0.6)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ========================================================= */}
          {/* HELPFUL PULSATING HINT WHEN LAMP IS OFF */}
          {/* ========================================================= */}
          {!isLampOn && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              onClick={handlePullCord}
              className="mt-5 cursor-pointer flex flex-col items-center gap-1.5 rounded-2xl border border-violet-500/40 bg-violet-950/80 px-4 py-2.5 text-center shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-2 text-xs font-extrabold text-white">
                <span className="text-base">👇</span>
                <span>खींचें डोरी को चालू करने के लिए!</span>
              </div>
              <span className="text-[11px] text-violet-300 font-medium">
                (Pull the cord on the lamp to turn on & enter)
              </span>
            </motion.div>
          )}

          {/* Theme Color Indicator Button when ON */}
          {isLampOn && (
            <button
              type="button"
              onClick={handlePullCord}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white transition"
            >
              <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }} />
              <span>Color: {currentTheme.name} (Click cord for next color)</span>
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: THE WELCOME BACK SIGN-IN / REGISTER CARD */}
        {/* ========================================================= */}
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {isLampOn ? (
              /* ILLUMINATED FORM CARD */
              <motion.div
                key="illuminated-form"
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5"
                style={{
                  borderColor: currentTheme.borderGlow,
                  backgroundColor: "rgba(13, 16, 23, 0.94)",
                  boxShadow: `0 0 45px ${currentTheme.borderGlow}, 0 20px 60px rgba(0,0,0,0.8)`,
                }}
              >
                {/* Card Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Logo size="md" />
                    <span
                      className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: currentTheme.badgeBg,
                        color: currentTheme.badgeText,
                        borderColor: currentTheme.borderGlow,
                      }}
                    >
                      {mode === "register" ? "New Consumer" : "Welcome Back"}
                    </span>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-white pt-2">
                    {mode === "register" ? "Create Account" : "Sign In to Workspace"}
                  </h2>
                  <p className="text-xs text-zinc-300">
                    {mode === "register"
                      ? "Register to start resolving delayed refunds and NDR logistics."
                      : "Enter your email and password to enter mission control."}
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200"
                  >
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-400" />
                    <p className="font-medium text-rose-100">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Success Banner */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200 flex items-center gap-2"
                  >
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-100">{successMessage}</span>
                  </motion.div>
                )}

                {/* AUTH FORM */}
                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                  {mode === "register" && (
                    <div className="space-y-1">
                      <label className="block font-bold text-zinc-200 uppercase text-[10px] tracking-wider">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] pl-9 pr-3 text-xs text-white placeholder-zinc-400 outline-none transition"
                          style={{
                            borderColor: "rgba(255,255,255,0.15)",
                          }}
                        />
                        <User size={14} className="absolute left-3 top-3 text-zinc-400" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-200 uppercase text-[10px] tracking-wider">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@domain.com"
                        className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] pl-9 pr-3 text-xs text-white placeholder-zinc-400 outline-none transition"
                        style={{
                          borderColor: "rgba(255,255,255,0.15)",
                        }}
                      />
                      <Mail size={14} className="absolute left-3 top-3 text-zinc-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-zinc-200 uppercase text-[10px] tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full h-10 rounded-xl border border-zinc-700 bg-[#141724] pl-9 pr-10 text-xs text-white placeholder-zinc-400 outline-none transition font-mono"
                        style={{
                          borderColor: "rgba(255,255,255,0.15)",
                        }}
                      />
                      <Lock size={14} className="absolute left-3 top-3 text-zinc-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-zinc-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-300 text-[11px]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-zinc-600 bg-[#141724] text-violet-500 focus:ring-0"
                      />
                      <span>Remember me</span>
                    </label>
                    {mode === "login" ? (
                      <Link href="/register" className="text-[11px] font-semibold text-zinc-300 hover:text-white hover:underline">
                        Create account →
                      </Link>
                    ) : (
                      <Link href="/login" className="text-[11px] font-semibold text-zinc-300 hover:text-white hover:underline">
                        Sign in instead →
                      </Link>
                    )}
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-50 mt-2"
                    style={{
                      backgroundColor: currentTheme.primary,
                      boxShadow: `0 8px 25px ${currentTheme.glow}`,
                    }}
                  >
                    {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <KeyRound size={14} />}
                    <span>
                      {isLoading
                        ? "Authenticating..."
                        : mode === "register"
                        ? "Register & Enter Workspace"
                        : "Sign In to OutreachAI"}
                    </span>
                  </button>
                </form>

                {/* 1-Click Judge Access Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handle1ClickJudge}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:text-white transition active:scale-95 shadow-sm"
                  >
                    <UserCheck size={14} style={{ color: currentTheme.primary }} />
                    <span>1-Click Judge & Evaluator Instant Access</span>
                  </button>
                </div>

                {/* Footer Link */}
                <div className="pt-2 text-center text-xs text-zinc-400 border-t border-white/10">
                  <p className="text-[11px] text-zinc-400">
                    Contact:{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-zinc-200 underline hover:text-white">
                      {SUPPORT_EMAIL}
                    </a>
                  </p>
                </div>
              </motion.div>
            ) : (
              /* SLEEPING PLACEHOLDER CARD (HINT CARD) */
              <motion.div
                key="sleeping-card"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="w-full rounded-3xl border border-white/10 bg-[#0d1017]/40 p-8 text-center space-y-3 backdrop-blur-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-zinc-400">Workspace is in Standby</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Pull the hanging string on the lamp to light up the login terminal and activate the autonomous agent.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

