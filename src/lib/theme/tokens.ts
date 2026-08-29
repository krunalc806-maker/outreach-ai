/**
 * ============================================================================
 * OUTREACHAI — OBSIDIAN + ELECTRIC VIOLET DESIGN SYSTEM TOKENS
 * ============================================================================
 * 
 * Luxury tech aesthetic engineered for autonomous agent mission control.
 * Primary: Obsidian base (#0A0B0E) + Electric Violet accent (#7C3AED)
 * ============================================================================
 */

export const THEME_TOKENS = {
  colors: {
    // Brand Accents — Electric Violet
    brand: "#7c3aed", // Electric Violet
    brandHover: "#6d28d9", // Deeper Violet on hover
    brandSoft: "rgba(124, 58, 237, 0.16)", // Soft Violet glow/surface
    brandBorder: "rgba(124, 58, 237, 0.35)",
    brandAccent: "#a78bfa", // Badges & Highlights

    // Obsidian Backgrounds & Surfaces
    background: "#0a0b0e", // Deep Obsidian
    backgroundElevated: "#12141c", // Elevated Surface Canvas
    surface: "#12141c", // Charcoal surface
    surfaceHover: "rgba(30, 34, 48, 0.9)",
    surfaceActive: "rgba(38, 42, 60, 0.95)",
    surfaceDark: "#08090d",

    // Borders & Dividers
    border: "#1e2230", // Subtle Slate Border
    borderStrong: "rgba(255, 255, 255, 0.15)",
    borderHighlight: "rgba(124, 58, 237, 0.35)",

    // Typography
    textPrimary: "#f9fafb", // Off-White
    textSecondary: "#e4e4e7", // Zinc 200
    textMuted: "#9ca3af", // Slate Grey
    textSubtle: "#6b7280", // Zinc 500

    // Semantic Agent System States
    agentActive: {
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.12)",
      border: "rgba(59, 130, 246, 0.35)",
      label: "Active / Executing",
    },
    actionRequired: {
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.12)",
      border: "rgba(245, 158, 11, 0.3)",
      label: "Pending Consent / Approval",
    },
    verified: {
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.12)",
      border: "rgba(16, 185, 129, 0.3)",
      label: "Resolved / Validated",
    },
    waiting: {
      color: "#9ca3af",
      bg: "rgba(156, 163, 175, 0.12)",
      border: "rgba(156, 163, 175, 0.25)",
      label: "Awaiting Response",
    },
    failed: {
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.12)",
      border: "rgba(239, 68, 68, 0.3)",
      label: "High Risk / Failed",
    },
  },
  typography: {
    fontSans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  radii: {
    card: "1.25rem", // 20px
    button: "0.75rem", // 12px
    pill: "9999px",
  },
} as const;
