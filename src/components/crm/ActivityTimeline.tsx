"use client";

import { motion } from "framer-motion";
import { Activity, Bot, CalendarClock, Mail, PhoneCall, CheckCircle2 } from "lucide-react";

import { getCrmSnapshot } from "@/lib/crm/data";

const icons = {
  Email: Mail,
  Call: PhoneCall,
  Meeting: CalendarClock,
  Task: CheckCircle2,
  Campaign: Activity,
  AI: Bot,
};

export default function ActivityTimeline() {
  const snapshot = getCrmSnapshot();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-violet-300">Activity Timeline</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Emails, calls, meetings, tasks, and AI actions</h2>
        </div>
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300">
          <Activity size={18} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {snapshot.activities.map((activity) => {
          const Icon = icons[activity.type] ?? Activity;
          return (
            <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mt-0.5 rounded-xl border border-white/10 bg-zinc-900/70 p-2 text-violet-300">
                <Icon size={15} />
              </div>
              <div>
                <p className="font-medium text-white">{activity.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{activity.detail}</p>
                <p className="mt-2 text-xs text-zinc-500">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
