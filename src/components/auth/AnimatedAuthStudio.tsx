"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bot, CheckCircle2, ShieldCheck, Sparkles, Zap, Package, ArrowUpRight } from "lucide-react";

interface AnimatedAuthStudioProps {
  state?: "idle" | "focus" | "loading" | "error" | "success";
}

export default function AnimatedAuthStudio({ state = "idle" }: AnimatedAuthStudioProps) {
  const [lampOn, setLampOn] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const beamColor =
    state === "error"
      ? "rgba(244, 63, 94, 0.45)"
      : state === "success"
      ? "rgba(16, 185, 129, 0.6)"
      : state === "focus"
      ? "rgba(168, 85, 247, 0.55)"
      : "rgba(139, 92, 246, 0.4)";

  const steps = [
    { label: "Intake Problem", icon: Package, badge: "AI Detection", detail: "Zara ₹3,499 Delayed Refund" },
    { label: "Audit Logistics", icon: Bot, badge: "Delhivery Telemetry", detail: "False NDR Anomaly Detected" },
    { label: "Payment Reversal", icon: Zap, badge: "Pine Labs Switch", detail: "Instant UPI IMPS Gateway" },
    { label: "Verified Credit", icon: CheckCircle2, badge: "UTR Confirmed", detail: "UTR #423891004812" },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden p-6 sm:p-8">
      {/* Background Soft Glow Spheres */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"
      />

      {/* Top Header & Tag */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-zinc-100 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wide">OutreachAI Autonomous Studio</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Where Consumer Injustice <br />
          <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
            Becomes Instant Resolution.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-sm leading-relaxed">
          The intelligent agent that cross-checks real delivery telemetry, payment switches, and statutory law to recover your money.
        </p>
      </div>

      {/* CENTERPIECE: Modern Glowing Lamp & Floating Active Pipeline */}
      <div className="relative z-10 my-6 flex flex-col items-center">
        {/* Modernist Desk / Studio Lamp SVG */}
        <div className="relative flex flex-col items-center cursor-pointer" onClick={() => setLampOn(!lampOn)}>
          {/* Suspension / Fixture */}
          <div className="w-[3px] h-8 bg-gradient-to-b from-zinc-500 via-zinc-400 to-violet-400 rounded-full" />

          {/* Lamp Shade with Pure Porcelain Metallic Finish */}
          <div className="relative z-20">
            <svg width="150" height="52" viewBox="0 0 150 52" className="overflow-visible">
              <defs>
                <filter id="studioGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="shadeSurface" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2A2E3D" />
                  <stop offset="60%" stopColor="#151722" />
                  <stop offset="100%" stopColor="#0B0D14" />
                </linearGradient>
                <linearGradient id="rimAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {/* Shade Body */}
              <path
                d="M 50 0 L 100 0 L 142 46 C 142 48 135 50 75 50 C 15 50 8 48 8 46 Z"
                fill="url(#shadeSurface)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.2"
              />

              {/* Radiant White & Violet Rim */}
              <ellipse
                cx="75"
                cy="46"
                rx="68"
                ry="4.5"
                fill="none"
                stroke="url(#rimAccent)"
                strokeWidth="2"
              />

              {/* Luminous Bulb Core */}
              {lampOn && (
                <motion.ellipse
                  cx="75"
                  cy="46"
                  rx="26"
                  ry="4"
                  fill="#FFFFFF"
                  filter="url(#studioGlow)"
                  animate={{
                    opacity: state === "loading" ? [0.6, 1, 0.6] : [0.85, 1, 0.85],
                    scale: state === "focus" ? 1.06 : 1,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </svg>
          </div>

          {/* Volumetric Radiant Light Beam Cone */}
          {lampOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute top-14 z-10 w-[320px] h-[220px] origin-top"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${beamColor} 0%, rgba(139, 92, 246, 0.08) 50%, transparent 75%)`,
                clipPath: "polygon(34% 0%, 66% 0%, 100% 100%, 0% 100%)",
              }}
            />
          )}

          {/* Floating Stardust Particles */}
          {lampOn && (
            <div className="pointer-events-none absolute top-16 z-10 h-36 w-52 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-md shadow-violet-300"
                  style={{
                    left: `${20 + i * 16}%`,
                    top: `${15 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-6, -20, -6],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Interactive Stage Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6 w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-xl shadow-xl space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon size={14} />;
                })()}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{steps[activeStep].label}</span>
                <span className="text-[10px] text-zinc-300 block">{steps[activeStep].badge}</span>
              </div>
            </div>

            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              STAGE 0{activeStep + 1}/04
            </span>
          </div>

          <div className="text-[11px] text-zinc-200 bg-black/30 rounded-xl px-3 py-1.5 flex items-center justify-between border border-white/5">
            <span>{steps[activeStep].detail}</span>
            <ArrowUpRight size={13} className="text-violet-400" />
          </div>
        </motion.div>
      </div>

      {/* Bottom Trust Badges */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-300">
        <div className="flex items-center gap-1.5 font-medium">
          <ShieldCheck size={15} className="text-emerald-400" />
          <span>PostgreSQL RLS Protected</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
          <Sparkles size={12} className="text-violet-400" />
          <span>The Great Rewiring 2026</span>
        </div>
      </div>
    </div>
  );
}

