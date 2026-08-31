"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  User,
  LogOut,
  MessageSquare,
  Users,
  Workflow,
  ClipboardList,
  Sparkles,
  BookOpen,
  PlayCircle,
  Briefcase,
  Layers,
  Loader2,
} from "lucide-react";

import Logo from "@/components/common/Logo";
import { logoutUser } from "@/lib/auth/logout";
import SidebarItem from "./SidebarItem";

const navigationSections = [
  {
    header: "Core Agent",
    items: [
      {
        title: "Agent Mission Control",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Case Workspace",
        href: "/cases",
        icon: Briefcase,
      },
      {
        title: "The Ken 3-Min Demo",
        href: "/demo",
        icon: PlayCircle,
        badge: "Judge",
      },
      {
        title: "Research & Evidence",
        href: "/evidence",
        icon: BookOpen,
      },
    ],
  },
  {
    header: "Dispute Operations",
    items: [
      {
        title: "CRM Counterparties",
        href: "/crm",
        icon: ClipboardList,
      },
      {
        title: "Escalation Batches",
        href: "/campaigns",
        icon: Layers,
      },
      {
        title: "Grievance Registry",
        href: "/leads",
        icon: Users,
      },
      {
        title: "Follow-Up Engine",
        href: "/sequence",
        icon: Workflow,
      },
      {
        title: "Statutory Notices",
        href: "/templates",
        icon: FileText,
      },
      {
        title: "Resolution Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    header: "AI & Account",
    items: [
      {
        title: "AI Console (Multi-Provider)",
        href: "/chat",
        icon: MessageSquare,
      },
      {
        title: "AI Ecosystem",
        href: "/ecosystem",
        icon: Sparkles,
        badge: "New",
      },
      {
        title: "My Profile & Account",
        href: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logoutUser();
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#08090d] lg:flex">
      <div className="border-b border-white/10 p-5 flex items-center justify-between">
        <Logo size="sm" />
        <span className="rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2 py-0.5 text-[9px] font-mono font-bold text-[#a78bfa]">
          KEN 2026
        </span>
      </div>

      <nav className="flex-1 space-y-4 p-3 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.header} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              {section.header}
            </div>
            {section.items.map((item) => (
              <SidebarItem
                key={item.title}
                href={item.href}
                icon={item.icon}
                title={item.title}
                badge={item.badge}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3.5 bg-[#0d1017]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#a78bfa] font-semibold text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
            <span>3 Rails Connected</span>
          </div>
          <span className="rounded bg-zinc-900 border border-white/5 px-2 py-0.5 text-[9px] font-mono text-zinc-400">
            Delhivery • Pine • Gnani
          </span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 p-2 text-xs font-semibold text-zinc-400 transition hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 disabled:opacity-50 cursor-pointer"
        >
          {isLoggingOut ? (
            <Loader2 size={13} className="animate-spin text-rose-400" />
          ) : (
            <LogOut size={13} />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
