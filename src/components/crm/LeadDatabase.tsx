"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowUpRight,
  Check,
  Copy,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { getCrmSnapshot } from "@/lib/crm/data";
import type { Lead } from "@/lib/crm/types";

export default function LeadDatabase() {
  const initialSnapshot = getCrmSnapshot();
  const [leads, setLeads] = useState<Lead[]>(initialSnapshot.leads);
  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    stage: "Qualified",
    score: 85,
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      selectedFilter === "All" ||
      lead.stage.toLowerCase() === selectedFilter.toLowerCase() ||
      (selectedFilter === "High Intent" && lead.score >= 90);
    const matchesQuery =
      lead.name.toLowerCase().includes(query.toLowerCase()) ||
      lead.email.toLowerCase().includes(query.toLowerCase()) ||
      lead.company.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleCopy = async (lead: Lead) => {
    try {
      await navigator.clipboard.writeText(`${lead.name} <${lead.email}> (${lead.company})`);
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  const handleArchive = (id: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: "Archived" } : l)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || "Independent Merchant",
      title: "Grievance Contact",
      companyId: "comp-1",
      location: "Bengaluru, Karnataka",
      website: "https://merchant.in",
      industry: "E-Commerce",
      socialProfiles: [],
      stage: formData.stage as any,
      status: "Qualified",
      score: Number(formData.score) || 85,
      priority: "High",
      aiSummary: "Autonomous case filed for merchant dispute.",
      nextBestAction: "Dispatch statutory notice.",
      risk: "Low",
      opportunity: "Standard resolution SLA",
      phone: "+91 98765 43210",
      tags: ["Direct Contact", "Escalation Desk"],
      notes: "Created from CRM Registry",
      createdAt: new Date().toISOString(),
      customFields: {},
    };

    setLeads((prev) => [newLead, ...prev]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      email: "",
      company: "",
      stage: "Qualified",
      score: 85,
    });
  };

  const [importNotification, setImportNotification] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const parsedLeads: Lead[] = [];

      lines.slice(1).forEach((line, idx) => {
        const cols = line.split(",").map((c) => c.trim());
        if (cols[0] && cols[1]) {
          parsedLeads.push({
            id: `lead-csv-${Date.now()}-${idx}`,
            name: cols[0],
            email: cols[1],
            company: cols[2] || "Merchant",
            title: "Grievance Contact",
            companyId: `comp-${idx}`,
            location: "India",
            website: "https://merchant.in",
            industry: "E-Commerce",
            socialProfiles: [],
            stage: "Qualified",
            status: "Qualified",
            score: 90,
            priority: "High",
            aiSummary: "Imported from grievance registry CSV",
            nextBestAction: "Dispatch statutory notice.",
            risk: "Low",
            opportunity: "Standard SLA",
            phone: "+91 98765 43210",
            tags: ["CSV Import"],
            notes: "Imported via CSV",
            createdAt: new Date().toISOString(),
            customFields: {},
          });
        }
      });

      if (parsedLeads.length > 0) {
        setLeads((prev) => [...parsedLeads, ...prev]);
        setImportNotification(`Successfully imported ${parsedLeads.length} leads into CRM.`);
        setTimeout(() => setImportNotification(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl"
    >
      {importNotification && (
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300 flex items-center justify-between">
          <span>{importNotification}</span>
          <button onClick={() => setImportNotification(null)} className="text-emerald-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold font-mono text-[#a78bfa] uppercase">Contact & Nodal Registry</p>
          <h2 className="mt-1 text-xl font-bold text-white">Create, manage, and segment every lead</h2>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 active:scale-95">
            <Upload size={14} /> Import CSV
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-3.5 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95"
          >
            <Plus size={14} /> Create Lead
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#11141c] p-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#08090d] px-3 py-1.5 text-xs text-zinc-300">
          <Search size={14} className="text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent outline-none text-xs text-white placeholder-zinc-500"
            placeholder="Search leads, companies, tags..."
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-zinc-500 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs text-zinc-300">
          {["All", "Qualified", "High Intent", "New", "Engaged"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFilter(f)}
              className={`rounded-xl px-3 py-1.5 font-medium transition active:scale-95 ${
                selectedFilter === f
                  ? "bg-[#8b5cf6] text-white font-bold shadow-sm shadow-[#8b5cf6]/20"
                  : "bg-[#08090d] text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-xs">
          <thead className="bg-[#11141c] text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Lead Contact</th>
              <th className="px-4 py-3 font-semibold">Company / Entity</th>
              <th className="px-4 py-3 font-semibold">Pipeline Stage</th>
              <th className="px-4 py-3 font-semibold">Resolution Score</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#0d1017] text-zinc-300">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="font-bold text-white">{lead.name}</div>
                  <div className="mt-0.5 text-[11px] font-mono text-zinc-400">{lead.email}</div>
                </td>
                <td className="px-4 py-3 text-zinc-200">{lead.company}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2 py-0.5 text-[10px] font-bold text-[#a78bfa]">
                    {lead.stage}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-emerald-400">{lead.score}/100</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(lead)}
                      title="Copy details"
                      className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      {copiedId === lead.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleArchive(lead.id)}
                      title="Archive lead"
                      className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-300 hover:bg-white/10 hover:text-white"
                    >
                      <Archive size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      title="Delete lead"
                      className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-1.5 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 size={12} />
                    </button>
                    <Link
                      href={`/cases?merchant=${encodeURIComponent(lead.company)}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 px-2 py-1 text-[11px] font-bold text-[#a78bfa] hover:bg-[#8b5cf6] hover:text-white transition"
                    >
                      <span>Case</span>
                      <ArrowUpRight size={11} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Create New Lead Contact</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Contact Name *</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Malhotra"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Email Address *</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. vikram.m@inditex.com"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Company</label>
                  <input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Zara India"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  >
                    <option value="New">New</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Engaged">Engaged</option>
                    <option value="High Intent">High Intent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-zinc-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#8b5cf6] px-4 py-2 font-extrabold text-white shadow hover:bg-[#7c3aed] active:scale-95"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
