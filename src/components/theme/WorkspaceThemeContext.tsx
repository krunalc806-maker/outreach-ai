"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type WorkspaceThemeId = "violet" | "emerald" | "amber" | "cyan" | "rose";

export interface WorkspaceTheme {
  id: WorkspaceThemeId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  badgeBg: string;
  badgeBorder: string;
  bgAmbient: string;
  dotColor: string;
}

export const WORKSPACE_THEMES: Record<WorkspaceThemeId, WorkspaceTheme> = {
  violet: {
    id: "violet",
    name: "Electric Violet",
    primary: "#8B5CF6",
    secondary: "#7C3AED",
    accent: "#A78BFA",
    glow: "rgba(139, 92, 246, 0.4)",
    badgeBg: "rgba(139, 92, 246, 0.15)",
    badgeBorder: "rgba(139, 92, 246, 0.35)",
    bgAmbient: "radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.18) 0%, transparent 65%)",
    dotColor: "#8B5CF6",
  },
  emerald: {
    id: "emerald",
    name: "Cyber Emerald",
    primary: "#10B981",
    secondary: "#059669",
    accent: "#34D399",
    glow: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(16, 185, 129, 0.15)",
    badgeBorder: "rgba(16, 185, 129, 0.35)",
    bgAmbient: "radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.18) 0%, transparent 65%)",
    dotColor: "#10B981",
  },
  amber: {
    id: "amber",
    name: "Solar Amber",
    primary: "#F59E0B",
    secondary: "#D97706",
    accent: "#FBBF24",
    glow: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    badgeBorder: "rgba(245, 158, 11, 0.35)",
    bgAmbient: "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.18) 0%, transparent 65%)",
    dotColor: "#F59E0B",
  },
  cyan: {
    id: "cyan",
    name: "Neon Cyan",
    primary: "#06B6D4",
    secondary: "#0891B2",
    accent: "#38BDF8",
    glow: "rgba(6, 182, 212, 0.4)",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    badgeBorder: "rgba(6, 182, 212, 0.35)",
    bgAmbient: "radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.18) 0%, transparent 65%)",
    dotColor: "#06B6D4",
  },
  rose: {
    id: "rose",
    name: "Rose Crimson",
    primary: "#F43F5E",
    secondary: "#E11D48",
    accent: "#FB7185",
    glow: "rgba(244, 63, 94, 0.4)",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeBorder: "rgba(244, 63, 94, 0.35)",
    bgAmbient: "radial-gradient(ellipse at 50% 0%, rgba(244, 63, 94, 0.18) 0%, transparent 65%)",
    dotColor: "#F43F5E",
  },
};

interface WorkspaceThemeContextType {
  theme: WorkspaceTheme;
  themeId: WorkspaceThemeId;
  setThemeId: (id: WorkspaceThemeId) => void;
  cycleTheme: () => void;
}

const WorkspaceThemeContext = createContext<WorkspaceThemeContextType>({
  theme: WORKSPACE_THEMES.violet,
  themeId: "violet",
  setThemeId: () => {},
  cycleTheme: () => {},
});

function applyThemeVariables(t: WorkspaceTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", t.id);
  root.style.setProperty("--brand", t.primary);
  root.style.setProperty("--brand-hover", t.secondary);
  root.style.setProperty("--brand-accent", t.accent);
  root.style.setProperty("--brand-soft", t.badgeBg);
  root.style.setProperty("--theme-primary", t.primary);
  root.style.setProperty("--theme-secondary", t.secondary);
  root.style.setProperty("--theme-accent", t.accent);
  root.style.setProperty("--theme-glow", t.glow);
  root.style.setProperty("--theme-badge-bg", t.badgeBg);
  root.style.setProperty("--theme-badge-border", t.badgeBorder);
}

export function WorkspaceThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<WorkspaceThemeId>("violet");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("outreachai_workspace_theme") as WorkspaceThemeId;
      if (saved && WORKSPACE_THEMES[saved]) {
        setThemeIdState(saved);
        applyThemeVariables(WORKSPACE_THEMES[saved]);
      } else {
        applyThemeVariables(WORKSPACE_THEMES.violet);
      }
    } catch {
      applyThemeVariables(WORKSPACE_THEMES.violet);
    }
  }, []);

  const setThemeId = (id: WorkspaceThemeId) => {
    const selected = WORKSPACE_THEMES[id] || WORKSPACE_THEMES.violet;
    setThemeIdState(id);
    applyThemeVariables(selected);
    try {
      localStorage.setItem("outreachai_workspace_theme", id);
    } catch {}
  };

  const cycleTheme = () => {
    const ids: WorkspaceThemeId[] = ["violet", "emerald", "amber", "cyan", "rose"];
    const nextIdx = (ids.indexOf(themeId) + 1) % ids.length;
    setThemeId(ids[nextIdx]);
  };

  const theme = WORKSPACE_THEMES[themeId] || WORKSPACE_THEMES.violet;

  return (
    <WorkspaceThemeContext.Provider value={{ theme, themeId, setThemeId, cycleTheme }}>
      {children}
    </WorkspaceThemeContext.Provider>
  );
}

export function useWorkspaceTheme() {
  return useContext(WorkspaceThemeContext);
}
