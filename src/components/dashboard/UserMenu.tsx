"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  User,
  Settings,
  CreditCard,
  LogOut,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

import { logoutUser } from "@/lib/auth/logout";
import { createClient } from "@/lib/supabase/client";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [userName, setUserName] = useState("Consumer");
  const [userEmail, setUserEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "");
          const meta = user.user_metadata || {};
          const realName = meta.full_name || meta.name || (user.email ? user.email.split("@")[0] : "Consumer");
          setUserName(realName);
          if (meta.avatar_url || meta.picture) {
            setAvatarUrl(meta.avatar_url || meta.picture);
          }
          return;
        }

        const res = await fetch("/api/auth");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUserEmail(data.user.email || "");
          setUserName(data.user.fullName || "Consumer");
          if (data.user.avatarUrl) {
            setAvatarUrl(data.user.avatarUrl);
          }
        }
      } catch {}
    }
    loadUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logoutUser();
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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="user-menu"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#11141c] px-2.5 py-1.5 transition hover:border-[#8b5cf6]/50 hover:bg-[#181824] active:scale-95"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={userName}
            className="h-7 w-7 rounded-full border border-[#8b5cf6]/50 object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8b5cf6] font-bold text-xs text-white">
            {getInitials(userName, userEmail)}
          </div>
        )}

        <div className="hidden text-left lg:block">
          <p className="text-xs font-bold text-white leading-none">
            {userName}
          </p>
          <p className="text-[9px] text-[#a78bfa] font-mono mt-0.5">
            Verified Google
          </p>
        </div>

        <ChevronDown
          size={13}
          className={`text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="user-menu"
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1017] p-2 shadow-2xl backdrop-blur-2xl z-50"
          >
            <div className="border-b border-white/10 p-3 bg-white/5 rounded-xl mb-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{userName}</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 uppercase">
                  Active
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                {userEmail || "Google Account Connected"}
              </p>
            </div>

            <div className="space-y-0.5 text-xs">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <User size={14} className="text-[#a78bfa]" />
                <span>My Profile & Account</span>
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <Sparkles size={14} className="text-[#a78bfa]" />
                <span>Agent Mission Control</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <Settings size={14} className="text-zinc-400" />
                <span>Settings</span>
              </Link>

              <Link
                href="/billing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <CreditCard size={14} className="text-zinc-400" />
                <span>Plan & Subscription</span>
              </Link>

              <div className="border-t border-white/5 my-1" />

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50 font-medium cursor-pointer"
              >
                {isLoggingOut ? (
                  <Loader2 size={14} className="animate-spin text-rose-400" />
                ) : (
                  <LogOut size={14} />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
