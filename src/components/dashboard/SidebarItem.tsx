"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export default function SidebarItem({
  title,
  href,
  icon: Icon,
  badge,
}: SidebarItemProps) {
  const pathname = usePathname();
  const { theme } = useWorkspaceTheme();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
        active
          ? "text-white font-bold"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
      }`}
      style={{
        backgroundColor: active ? theme.primary : undefined,
        boxShadow: active ? `0 4px 18px ${theme.glow}` : undefined,
      }}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          size={16}
          className={`transition-colors ${
            active ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
          }`}
        />
        <span>{title}</span>
      </div>
      {badge && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold ${
            active ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}