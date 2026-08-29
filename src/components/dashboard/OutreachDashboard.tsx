"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, Bot, Mail, Sparkles, Users } from "lucide-react";

import { getOutreachSnapshot } from "@/lib/outreach/data";

export default function OutreachDashboard() {
  const snapshot = getOutreachSnapshot();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-zinc-950 to-cyan-500/10 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-300">
              <Sparkles size={14} /> AI Outreach Agent
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Build, launch, and optimize outbound campaigns with AI.
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
              Manage campaigns, leads, AI-generated email variants, and analytics in one premium operating layer.
            </p>
          </div>

          <Link href="/campaigns" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
            Open Campaigns
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active Campaigns", value: snapshot.campaigns.filter((campaign) => campaign.status === "Running").length.toString(), icon: Mail },
          { label: "Qualified Leads", value: snapshot.leads.filter((lead) => lead.status === "Qualified" || lead.status === "Opportunity").length.toString(), icon: Users },
          { label: "AI Variants", value: "24", icon: Bot },
          { label: "Reply Rate", value: "18.4%", icon: BarChart3 },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-2xl border border-white/10 bg-zinc-900/75 p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{item.label}</p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-violet-300">
                  <Icon size={16} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Live Campaigns</h2>
              <p className="mt-1 text-sm text-zinc-400">Monitor the pulse of outbound execution.</p>
            </div>
            <Link href="/campaigns" className="text-sm font-medium text-violet-400">Manage</Link>
          </div>

          <div className="mt-6 space-y-3">
            {snapshot.campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <div>
                  <p className="font-medium text-white">{campaign.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{campaign.objective}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-violet-300">{campaign.sent} sent</p>
                  <p className="mt-1 text-sm text-zinc-400">{campaign.replies} replies</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">AI Email Tools</h2>
              <p className="mt-1 text-sm text-zinc-400">Compose, rewrite, and scale outreach in seconds.</p>
            </div>
            <Link href="/templates" className="text-sm font-medium text-violet-400">Templates</Link>
          </div>

          <div className="mt-6 space-y-3">
            {snapshot.templates.map((template) => (
              <div key={template.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{template.title}</p>
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-300">{template.tone}</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{template.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
