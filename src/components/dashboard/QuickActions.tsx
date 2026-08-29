"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Mail,
  Users,
  BarChart3,
} from "lucide-react";

interface Action {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const actions: Action[] = [
  {
    title: "New AI Campaign",
    description: "Launch a personalized outreach campaign.",
    href: "/campaigns/new",
    icon: Bot,
  },
  {
    title: "Generate Email",
    description: "Create AI-powered cold emails instantly.",
    href: "/ai/email-generator",
    icon: Mail,
  },
  {
    title: "Import Leads",
    description: "Upload CSV or connect your CRM.",
    href: "/leads/import",
    icon: Users,
  },
  {
    title: "View Analytics",
    description: "Track campaign performance and insights.",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Start your workflow faster.
        </p>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-xl border border-zinc-800 bg-zinc-950 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-zinc-900"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400">
                <Icon size={22} />
              </div>

              <h3 className="mt-4 font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {action.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-violet-400 transition group-hover:gap-3">
                Open
                <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}