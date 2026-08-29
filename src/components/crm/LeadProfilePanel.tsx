"use client";

import { motion } from "framer-motion";
import { Building2, Globe2, Landmark, MapPin, UserCircle2 } from "lucide-react";
import { getCrmSnapshot } from "@/lib/crm/data";

export default function LeadProfilePanel() {
  const snapshot = getCrmSnapshot();
  const lead = snapshot.leads[0];
  const company = snapshot.companies.find((item) => item.id === lead.companyId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Detailed Contact Profile</p>
          <h2 className="mt-1 text-xl font-bold text-white">{lead.name}</h2>
          <p className="mt-1 text-xs text-zinc-400">{lead.title} • {lead.company}</p>
        </div>
        <div className="rounded-2xl border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-1.5 text-xs font-bold text-[#a78bfa]">
          Score: {lead.score}/100
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <UserCircle2 size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-bold uppercase text-zinc-400">Contact Details</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-300">
            <p>Email: <span className="font-mono text-zinc-100">{lead.email}</span></p>
            <p>Phone: <span className="font-mono text-zinc-100">{lead.phone}</span></p>
            <p>Location: <span className="text-zinc-100">{lead.location}</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#11141c] p-4">
          <div className="flex items-center gap-2 text-zinc-300">
            <Building2 size={15} className="text-[#a78bfa]" />
            <span className="text-xs font-bold uppercase text-zinc-400">Company Details</span>
          </div>
          <div className="mt-2 space-y-1 text-xs text-zinc-300">
            <p>Entity: <span className="text-zinc-100">{company?.name || lead.company}</span></p>
            <p>Industry: <span className="text-zinc-100">{company?.industry || "Retail / Fashion"}</span></p>
            <p>Scale: <span className="font-mono text-zinc-100">{company?.employeeCount || "5,000+"}</span></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
