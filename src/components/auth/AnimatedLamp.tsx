"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedLampProps {
  state?: "idle" | "focus" | "loading" | "error" | "success";
  interactive?: boolean;
}

export default function AnimatedLamp({ state = "idle", interactive = true }: AnimatedLampProps) {
  const [isOn, setIsOn] = useState(true);
  const [flickerKey, setFlickerKey] = useState(0);

  useEffect(() => {
    // Subtle initial ignition on mount
    const timer = setTimeout(() => {
      setFlickerKey((prev) => prev + 1);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const glowColor =
    state === "error"
      ? "rgba(239, 68, 68, 0.7)"
      : state === "success"
      ? "rgba(16, 185, 129, 0.85)"
      : state === "focus"
      ? "rgba(167, 139, 250, 0.85)"
      : state === "loading"
      ? "rgba(124, 58, 237, 0.9)"
      : "rgba(139, 92, 246, 0.65)";

  const lightBeamOpacity =
    !isOn
      ? 0
      : state === "focus"
      ? 0.35
      : state === "loading"
      ? 0.4
      : state === "error"
      ? 0.25
      : 0.22;

  return (
    <div className="relative flex flex-col items-center justify-center select-none overflow-visible py-2">
      {/* Ceiling Mounting Cord */}
      <motion.div
        className="w-[2px] h-10 bg-gradient-to-b from-zinc-600 via-zinc-400 to-[#7c3aed]"
        animate={{
          rotate: state === "focus" ? [0, -1, 1, 0] : 0,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Brass Socket Mount */}
      <div className="w-5 h-2.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-t-sm shadow-md border-t border-amber-300/40" />

      {/* Modernist Lamp Shade SVG */}
      <div className="relative z-20 cursor-pointer" onClick={() => interactive && setIsOn(!isOn)}>
        <svg width="140" height="50" viewBox="0 0 140 50" className="overflow-visible">
          <defs>
            {/* Ambient Radial Glow Filter */}
            <filter id="lampGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Shading for Metallic Finish */}
            <linearGradient id="shadeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e2230" />
              <stop offset="50%" stopColor="#12141c" />
              <stop offset="100%" stopColor="#08090d" />
            </linearGradient>

            <linearGradient id="violetRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          {/* Lamp Shade Dome */}
          <path
            d="M 45 0 L 95 0 L 135 44 C 135 46 130 48 70 48 C 10 48 5 46 5 44 Z"
            fill="url(#shadeGrad)"
            stroke="#7c3aed"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Shade Rim Accent with Violet Glow */}
          <ellipse
            cx="70"
            cy="44"
            rx="65"
            ry="4.5"
            fill="none"
            stroke="url(#violetRim)"
            strokeWidth="2"
          />

          {/* Glowing Filament Core */}
          {isOn && (
            <motion.ellipse
              key={flickerKey}
              cx="70"
              cy="44"
              rx="24"
              ry="3.5"
              fill="#fff"
              filter="url(#lampGlow)"
              animate={{
                opacity: state === "loading" ? [0.7, 1, 0.7] : [0.9, 1, 0.9],
                scale: state === "focus" ? 1.08 : 1,
              }}
              transition={{
                duration: state === "loading" ? 0.8 : 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </svg>

        {/* Small Pull-String Switch */}
        <motion.div
          className="absolute right-6 top-11 flex flex-col items-center"
          animate={{ y: isOn ? 0 : 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="w-[1px] h-7 bg-zinc-500" />
          <div className="w-2 h-2 rounded-full bg-amber-400 border border-amber-200 shadow-sm" />
        </motion.div>
      </div>

      {/* Volumetric Radiant Light Cone */}
      {isOn && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.8 }}
          animate={{
            opacity: lightBeamOpacity,
            scaleY: 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute top-14 z-10 w-[360px] h-[340px] origin-top"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${glowColor} 0%, rgba(124, 58, 237, 0.12) 40%, transparent 75%)`,
            clipPath: "polygon(36% 0%, 64% 0%, 100% 100%, 0% 100%)",
          }}
        />
      )}

      {/* Floating Sparkle Particles in the Light Beam */}
      {isOn && (
        <div className="pointer-events-none absolute top-20 z-10 h-44 w-56 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/70 shadow-sm shadow-[#a78bfa]"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-8, -25, -8],
                x: [(i % 2 === 0 ? -3 : 3), (i % 2 === 0 ? 4 : -4), (i % 2 === 0 ? -3 : 3)],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

