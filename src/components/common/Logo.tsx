import Link from "next/link";
import { SITE } from "@/constants/site";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon" | "horizontal" | "monochrome";
  size?: "sm" | "md" | "lg";
  href?: string;
  showTagline?: boolean;
}

export function LogoIcon({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Structural Geometry — Signal flow into central intelligence node */}
      <rect x="2" y="2" width="32" height="32" rx="10" fill="#0D1017" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" />
      
      {/* Precision Action Rays */}
      <path
        d="M10 18H26M18 10V26M12.34 12.34L23.66 23.66"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Orbiting Verification Nodes: Input (Gray), Intelligence (Violet), Action (Amber), Verified (Green) */}
      <circle cx="10" cy="18" r="2" fill="#71717A" />
      <circle cx="26" cy="18" r="2.5" fill="#10B981" />
      <circle cx="18" cy="10" r="2" fill="#71717A" />
      <circle cx="23.66" cy="23.66" r="2" fill="#F59E0B" />

      {/* Central Autonomous Core — Electric Violet Signature */}
      <circle cx="18" cy="18" r="4.5" fill="#8B5CF6" />
      <circle cx="18" cy="18" r="2" fill="#08090D" />
    </svg>
  );
}

export default function Logo({
  className = "",
  variant = "full",
  size = "md",
  href = "/",
  showTagline = true,
}: LogoProps) {
  const iconSize = size === "sm" ? 22 : size === "lg" ? 34 : 26;
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-base";

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0d1017] p-1 shadow-md shadow-black/60">
        <LogoIcon size={iconSize} />
      </div>

      {variant !== "icon" && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-white ${textSize}`}>
              {SITE.name}
            </span>
            <span className="rounded bg-[#8b5cf6]/15 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider text-[#a78bfa] uppercase border border-[#8b5cf6]/30">
              AGENT
            </span>
          </div>

          {showTagline && (
            <span className="mt-0.5 text-[10px] font-mono tracking-tight text-zinc-400">
              Action-Native AI
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition hover:opacity-90 focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}