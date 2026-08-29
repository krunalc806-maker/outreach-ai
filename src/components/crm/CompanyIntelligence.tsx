"use client";

import { motion } from "framer-motion";
import { Briefcase, Building2, DollarSign, Sparkles, Wrench } from "lucide-react";
import { getCrmSnapshot } from "@/lib/crm/data";

export default function CompanyIntelligence() {
  const snapshot = getCrmSnapshot();
  const company = snapshot.companies[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Merchant Profile</p>
          <h2 className="mt-1 text-xl font-bold text-white">{company.name}</h2>
        </div>
        <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 p-2 text-[#a78bfa]">
          <Sparkles size={18} />
        </div>
      </div>

      <p className="mt-3 text-xs sm:text-sm text-zinc-400">{company.overview}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Building2 size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-bold uppercase text-zinc-400">Corporate Overview</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-300">
            <p>Employees: <span className="font-mono text-zinc-100">{company.employeeCount}</span></p>
            <p>Industry: <span className="text-zinc-100">{company.industry}</span></p>
            <p>Jurisdiction: <span className="text-zinc-100">{company.location}</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <DollarSign size={15} className="text-emerald-400" />
            <span className="text-xs font-bold uppercase text-zinc-400">Payment & Rail Configuration</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-300">
            <p>Primary Payment Switch: <span className="font-mono text-zinc-100">Pine Labs Gateway</span></p>
            <p>Logistics Carrier: <span className="font-mono text-zinc-100">Delhivery Express</span></p>
            <p>Support Portal: <span className="font-mono text-[#a78bfa]">{company.website}</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
