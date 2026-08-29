"use client";

import { motion } from "framer-motion";

import ActivityTimeline from "@/components/crm/ActivityTimeline";
import CompanyIntelligence from "@/components/crm/CompanyIntelligence";
import LeadDatabase from "@/components/crm/LeadDatabase";
import LeadIntelligence from "@/components/crm/LeadIntelligence";
import LeadProfilePanel from "@/components/crm/LeadProfilePanel";
import NotesTimeline from "@/components/crm/NotesTimeline";
import PipelineBoard from "@/components/crm/PipelineBoard";
import SearchFiltersPanel from "@/components/crm/SearchFiltersPanel";
import TaskCalendar from "@/components/crm/TaskCalendar";

export default function CrmShell() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-zinc-950 to-cyan-500/10 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-300">
              CRM Intelligence Suite
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A premium lead and company operating system
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-zinc-400 sm:text-base">
              Manage leads, companies, tasks, notes, activity, and AI-driven next steps in one fast, accessible workspace.
            </p>
          </div>
        </div>
      </motion.div>

      <LeadIntelligence />
      <LeadDatabase />
      <LeadProfilePanel />
      <CompanyIntelligence />
      <PipelineBoard />
      <TaskCalendar />
      <NotesTimeline />
      <ActivityTimeline />
      <SearchFiltersPanel />
    </div>
  );
}
