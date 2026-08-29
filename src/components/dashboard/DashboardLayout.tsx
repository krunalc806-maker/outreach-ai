"use client";

import Link from "next/link";
import { BarChart3, BookOpen, ClipboardList, LayoutDashboard, PlayCircle, Users, Workflow } from "lucide-react";
import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { WorkspaceThemeProvider, useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardInnerLayout({ children }: { children: ReactNode }) {
  const { theme } = useWorkspaceTheme();

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[#08080a] text-white transition-colors duration-500">
      {/* Dynamic Ambient Background Glow Mesh */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-40 transition-all duration-700"
        style={{
          background: theme.bgAmbient,
        }}
      />

      <div className="relative z-10 flex min-h-screen w-full">
        <Sidebar />

        <div className="relative flex flex-1 flex-col">
          <Topbar />

          <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Workspace Navigation */}
      <nav
        className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl border border-white/10 bg-[#0d0d12]/95 px-2 py-2 shadow-2xl backdrop-blur-2xl lg:hidden"
        aria-label="Mobile workspace navigation"
      >
        {[
          { href: "/dashboard", label: "Agent", icon: LayoutDashboard },
          { href: "/demo", label: "Demo", icon: PlayCircle },
          { href: "/crm", label: "Cases", icon: ClipboardList },
          { href: "/leads", label: "Registry", icon: Users },
          { href: "/sequence", label: "Follow-up", icon: Workflow },
          { href: "/analytics", label: "Analytics", icon: BarChart3 },
          { href: "/evidence", label: "Evidence", icon: BookOpen },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="flex min-w-10 flex-col items-center gap-1 rounded-xl px-1.5 py-1 text-[10px] font-semibold text-zinc-400 transition hover:text-white"
          >
            <Icon size={15} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <WorkspaceThemeProvider>
      <DashboardInnerLayout>{children}</DashboardInnerLayout>
    </WorkspaceThemeProvider>
  );
}
