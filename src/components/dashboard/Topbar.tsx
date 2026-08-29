"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, Settings, Sparkles, Palette, Check } from "lucide-react";

import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useWorkspaceTheme, WORKSPACE_THEMES, WorkspaceThemeId } from "@/components/theme/WorkspaceThemeContext";

export default function Topbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  const { theme, themeId, setThemeId } = useWorkspaceTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target as Node)) {
        setThemePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090d]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="hidden flex-1 items-center sm:flex max-w-md">
          <SearchBar />
        </div>

        {/* Center Live Agent Indicator with dynamic theme accent */}
        <div
          className="hidden md:flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-zinc-200 transition-all duration-300"
          style={{
            borderColor: theme.badgeBorder,
            backgroundColor: theme.badgeBg,
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.primary }} />
          <span className="font-semibold text-white">Agent Mission Control</span>
          <span className="text-zinc-500 font-mono">|</span>
          <span className="text-[11px] font-mono" style={{ color: theme.accent }}>The Ken Case Competition 2026</span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          {/* THEME PICKER BUTTON */}
          <div ref={themePickerRef} className="relative">
            <button
              type="button"
              onClick={() => setThemePickerOpen(!themePickerOpen)}
              aria-expanded={themePickerOpen}
              aria-label="Customize workspace theme"
              className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-[#11141c] px-2.5 text-xs text-zinc-300 transition hover:text-white"
              style={{
                borderColor: themePickerOpen ? theme.primary : "rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="h-3 w-3 rounded-full shadow-sm transition-all duration-300"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="hidden sm:inline font-medium text-[11px]">{theme.name}</span>
            </button>

            <AnimatePresence>
              {themePickerOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 w-52 rounded-2xl border border-white/15 bg-[#0d1017] p-2.5 shadow-2xl backdrop-blur-2xl z-50 space-y-1"
                >
                  <div className="px-2 py-1 border-b border-white/10 flex items-center justify-between text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
                    <span>Accent Theme</span>
                    <Palette size={13} style={{ color: theme.primary }} />
                  </div>

                  {(Object.keys(WORKSPACE_THEMES) as WorkspaceThemeId[]).map((id) => {
                    const item = WORKSPACE_THEMES[id];
                    const isSelected = themeId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setThemeId(id);
                          setThemePickerOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition ${
                          isSelected
                            ? "bg-white/10 text-white font-bold"
                            : "text-zinc-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{ backgroundColor: item.primary }}
                          />
                          <span>{item.name}</span>
                        </div>
                        {isSelected && <Check size={14} style={{ color: item.primary }} />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => {
              if (window.matchMedia("(min-width: 640px)").matches) {
                window.dispatchEvent(new Event("dashboard-search-focus"));
              } else {
                setMobileSearchOpen((open) => !open);
              }
            }}
            aria-expanded={mobileSearchOpen}
            aria-controls="mobile-workspace-search"
            aria-label="Focus workspace search"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#11141c] text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <Search size={15} />
          </button>

          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            aria-expanded={notificationsOpen}
            aria-label="Toggle notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#11141c] text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <Bell size={15} />
            <span
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: theme.primary }}
            />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                role="status"
                className="absolute right-16 top-[4.25rem] w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0d1017] p-4 shadow-2xl backdrop-blur-2xl sm:right-24 z-50"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-xs text-white">Agent Telemetry</span>
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.accent,
                      borderColor: theme.badgeBorder,
                    }}
                  >
                    LIVE
                  </span>
                </div>
                <div className="mt-2.5 space-y-2 text-xs">
                  <div className="rounded-xl bg-[#11141c] p-2.5 border border-white/5 space-y-0.5">
                    <p className="font-semibold text-white text-[11px]">Delhivery Logistics Override</p>
                    <p className="text-zinc-400 text-[10px]">
                      Re-attempt confirmed for AWB #DEL-984210-IN by Hub Supervisor.
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#11141c] p-2.5 border border-white/5 space-y-0.5">
                    <p className="font-semibold text-white text-[11px]">Pine Labs Refund Verification</p>
                    <p className="text-zinc-400 text-[10px]">
                      Bank UTR #423891004812 verified on NPCI network.
                    </p>
                  </div>
                </div>
                <Link
                  href="/cases"
                  onClick={() => setNotificationsOpen(false)}
                  className="mt-2.5 inline-flex text-xs font-semibold hover:underline"
                  style={{ color: theme.accent }}
                >
                  View Case Audit History →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <Link
            href="/demo"
            aria-label="Launch 3-minute competition demo"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold hover:opacity-90 active:scale-95 transition"
            style={{
              borderColor: theme.badgeBorder,
              backgroundColor: theme.badgeBg,
              color: theme.accent,
            }}
          >
            <Sparkles size={12} />
            <span>3-Min Demo</span>
          </Link>

          <UserMenu />
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            id="mobile-workspace-search"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 px-4 py-2.5 sm:hidden"
          >
            <SearchBar />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
