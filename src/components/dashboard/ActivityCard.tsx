"use client";

import {
  Bot,
  Mail,
  Users,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
}

const activities: Activity[] = [
  {
    id: 1,
    title: "AI generated outreach emails",
    description: "45 personalized emails created successfully.",
    time: "5 min ago",
    icon: Bot,
  },
  {
    id: 2,
    title: "Campaign launched",
    description: "SaaS Outreach campaign is now live.",
    time: "20 min ago",
    icon: Mail,
  },
  {
    id: 3,
    title: "New leads imported",
    description: "128 leads added from CSV.",
    time: "1 hour ago",
    icon: Users,
  },
  {
    id: 4,
    title: "Reply received",
    description: "A prospect replied to your campaign.",
    time: "2 hours ago",
    icon: MessageSquare,
  },
];

export default function ActivityCard() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Recent Activity
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          Latest updates from your workspace
        </p>
      </div>

      <div className="space-y-5 p-6">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/15 text-violet-400">
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">
                    {activity.title}
                  </h3>

                  <span className="text-xs text-zinc-500">
                    {activity.time}
                  </span>
                </div>

                <p className="mt-1 text-sm text-zinc-400">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}

        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">
          <CheckCircle2 size={18} />

          <span className="text-sm font-medium">
            Everything is running smoothly.
          </span>
        </div>
      </div>
    </div>
  );
}