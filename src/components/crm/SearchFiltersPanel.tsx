"use client";

import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";

export default function SearchFiltersPanel() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-violet-300">Search & Filters</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Find companies, tags, and leads in seconds</h2>
        </div>
        <div className="rounded-2xl border border-violet-400/20 bg-violet-400/10 p-2 text-violet-300">
          <Filter size={18} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
            <Search size={16} />
            <input className="w-full bg-transparent outline-none" placeholder="Search leads, companies, tags, campaigns" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Lead Search</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Company Search</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">Tag Search</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
          <p className="font-medium text-white">Filters</p>
          <div className="mt-3 space-y-2">
            {['Company','Industry','Country','Score','Tags','Campaign','Status'].map((filter) => (
              <div key={filter} className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/70 px-3 py-2">
                <span>{filter}</span>
                <span className="text-zinc-400">Any</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
