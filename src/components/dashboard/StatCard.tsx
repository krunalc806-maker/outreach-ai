"use client";

import {
  Bot,
  Mail,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const icons = {
  bot: Bot,
  mail: Mail,
  trendingUp: TrendingUp,
  users: Users,
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: keyof typeof icons;
}

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon,
}: StatCardProps) {
  const Icon = icons[icon];
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.article initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={shouldReduceMotion ? undefined : { y: -4 }} transition={{ duration: 0.22 }} className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/10 transition-colors hover:border-violet-500/70 hover:shadow-violet-500/10 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h3>

          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
              positive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {positive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}

            {change}
          </div>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-600/15 text-violet-400 sm:h-14 sm:w-14">
          <Icon size={28} />
        </div>
      </div>
    </motion.article>
  );
}
