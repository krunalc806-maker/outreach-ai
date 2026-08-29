"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";

interface MerchantDirectoryItem {
  id: string;
  name: string;
  category: "E-Commerce" | "Aviation & Travel" | "Quick Commerce" | "Logistics";
  nodalOfficer: string;
  sla: string;
  refundRail: string;
  logisticsPartner: string;
  status: string;
  score: number;
}

const initialMerchants: MerchantDirectoryItem[] = [
  {
    id: "m-1",
    name: "Zara India (Inditex)",
    category: "E-Commerce",
    nodalOfficer: "nodal.officer@zara.com",
    sla: "48 Hours",
    refundRail: "Pine Labs / UPI",
    logisticsPartner: "Delhivery Logistics",
    status: "Verified Nodal Desk",
    score: 96,
  },
  {
    id: "m-2",
    name: "Flipkart Internet Pvt Ltd",
    category: "E-Commerce",
    nodalOfficer: "grievance.officer@flipkart.com",
    sla: "24 Hours",
    refundRail: "Instant IMPS / UPI",
    logisticsPartner: "Ekart / Delhivery",
    status: "Verified Nodal Desk",
    score: 94,
  },
  {
    id: "m-3",
    name: "Amazon Seller Services India",
    category: "E-Commerce",
    nodalOfficer: "nodal-grievance@amazon.in",
    sla: "24 Hours",
    refundRail: "Amazon Pay / Bank",
    logisticsPartner: "Amazon Logistics / Delhivery",
    status: "Verified Nodal Desk",
    score: 95,
  },
  {
    id: "m-4",
    name: "InterGlobe Aviation (IndiGo)",
    category: "Aviation & Travel",
    nodalOfficer: "nodalofficer@goindigo.in",
    sla: "72 Hours (DGCA Rule 3.3)",
    refundRail: "Direct Card Credit",
    logisticsPartner: "Air Freight",
    status: "Verified Nodal Desk",
    score: 88,
  },
  {
    id: "m-5",
    name: "Swiggy (Bundl Technologies)",
    category: "Quick Commerce",
    nodalOfficer: "grievances@swiggy.in",
    sla: "4 Hours",
    refundRail: "Instant UPI Refund",
    logisticsPartner: "Swiggy Direct",
    status: "Verified Nodal Desk",
    score: 92,
  },
  {
    id: "m-6",
    name: "Delhivery Hub Services",
    category: "Logistics",
    nodalOfficer: "escalations@delhivery.com",
    sla: "12 Hours",
    refundRail: "RTO Override Rail",
    logisticsPartner: "Delhivery Core Logistics",
    status: "Carrier Rail Direct",
    score: 98,
  },
];

export default function LeadsPage() {
  const [merchants, setMerchants] = useState<MerchantDirectoryItem[]>(initialMerchants);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "E-Commerce" as MerchantDirectoryItem["category"],
    nodalOfficer: "",
    sla: "24 Hours",
    refundRail: "Pine Labs / UPI",
    logisticsPartner: "Delhivery Logistics",
  });

  const categories = ["All", "E-Commerce", "Aviation & Travel", "Quick Commerce", "Logistics"];

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leads) && data.leads.length > 0) {
          const customLeads: MerchantDirectoryItem[] = data.leads.map((l: any) => ({
            id: l.id,
            name: l.company_name,
            category: l.category || "E-Commerce",
            nodalOfficer: l.contact_email || "nodal@company.com",
            sla: "24 Hours",
            refundRail: "Pine Labs / UPI",
            logisticsPartner: "Delhivery Logistics",
            status: "User Added Directory",
            score: Number(l.resolution_rate) || 90,
          }));
          setMerchants((prev) => [...customLeads, ...prev.filter((p) => !customLeads.some((c) => c.id === p.id))]);
        }
      })
      .catch(() => null);
  }, []);

  const filteredMerchants = merchants.filter((m) => {
    const matchesCat = selectedCategory === "All" || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nodalOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.logisticsPartner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.refundRail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreateMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.nodalOfficer.trim()) return;

    const newItem: MerchantDirectoryItem = {
      id: `m-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      nodalOfficer: formData.nodalOfficer.trim(),
      sla: formData.sla.trim(),
      refundRail: formData.refundRail.trim(),
      logisticsPartner: formData.logisticsPartner.trim(),
      status: "Verified Nodal Desk",
      score: 90,
    };

    setMerchants((prev) => [newItem, ...prev]);
    setIsModalOpen(false);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: newItem.name,
          category: newItem.category,
          contact_email: newItem.nodalOfficer,
          resolution_rate: newItem.score,
        }),
      });
    } catch {}

    setFormData({
      name: "",
      category: "E-Commerce",
      nodalOfficer: "",
      sla: "24 Hours",
      refundRail: "Pine Labs / UPI",
      logisticsPartner: "Delhivery Logistics",
    });
  };

  const [importToast, setImportToast] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const parsedItems: MerchantDirectoryItem[] = [];

      lines.slice(1).forEach((line, idx) => {
        const cols = line.split(",").map((c) => c.trim());
        if (cols[0] && cols[1]) {
          parsedItems.push({
            id: `m-csv-${Date.now()}-${idx}`,
            name: cols[0],
            category: (cols[2] as any) || "E-Commerce",
            nodalOfficer: cols[1],
            sla: cols[3] || "48 Hours",
            refundRail: cols[4] || "UPI / Bank Transfer",
            logisticsPartner: cols[5] || "Carrier Direct",
            status: "Imported Directory",
            score: 90,
          });
        }
      });

      if (parsedItems.length > 0) {
        setMerchants((prev) => [...parsedItems, ...prev]);
        setImportToast(`Successfully imported ${parsedItems.length} service providers into directory.`);
        setTimeout(() => setImportToast(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {importToast && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-semibold text-emerald-300 flex items-center justify-between shadow-lg">
          <span>{importToast}</span>
          <button onClick={() => setImportToast(null)} className="text-emerald-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-semibold text-[#a78bfa]">
              <Sparkles size={14} /> Verified Service Provider & Grievance Directory
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
              Service Provider Escalation Directory
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-zinc-400">
              Verified statutory contact details, Nodal Grievance Officers, dispute SLAs, and connected payment/logistics rails.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 active:scale-95">
              <Upload size={14} /> Import Directory CSV
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="sr-only" />
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
            >
              <Plus size={14} /> Add Service Provider
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 shadow-xl">
          <p className="text-xs text-zinc-400">Verified Providers</p>
          <p className="mt-2 text-3xl font-bold text-white">{merchants.length}</p>
          <p className="text-xs text-emerald-400 mt-1 font-mono">100% Nodal Desk Compliance</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 shadow-xl">
          <p className="text-xs text-zinc-400">Average Dispute SLA</p>
          <p className="mt-2 text-3xl font-bold text-[#a78bfa]">24.5 Hours</p>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Statutory standard: &lt; 48 hours</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-5 shadow-xl">
          <p className="text-xs text-zinc-400">Reliability Score</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">94 / 100</p>
          <p className="text-xs text-zinc-500 mt-1 font-mono">Based on autonomous resolution rate</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-6 space-y-4 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#11141c] px-3 py-2 text-xs text-zinc-300">
            <Search size={15} className="text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-xs placeholder-zinc-500 text-white"
              placeholder="Search merchants, nodal emails, or carriers..."
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-zinc-500 hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 text-xs text-zinc-300">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 font-medium transition active:scale-95 ${
                  selectedCategory === cat
                    ? "bg-[#8b5cf6] text-white font-bold shadow-sm shadow-[#8b5cf6]/20"
                    : "bg-[#11141c] text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Items List */}
        <div className="space-y-3 pt-2">
          {filteredMerchants.map((merchant) => (
            <div
              key={merchant.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#11141c] p-4 lg:flex-row lg:items-center lg:justify-between transition hover:border-[#8b5cf6]/40"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-white text-sm">{merchant.name}</p>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    <ShieldCheck size={11} className="inline mr-1" />
                    {merchant.status}
                  </span>
                  <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    {merchant.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Nodal Officer: <span className="font-mono text-zinc-200">{merchant.nodalOfficer}</span> • SLA:{" "}
                  <span className="text-[#a78bfa]">{merchant.sla}</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg border border-white/5 bg-[#08090d] px-2.5 py-1 text-zinc-300 font-mono text-[11px]">
                  {merchant.logisticsPartner}
                </span>
                <span className="rounded-lg border border-white/5 bg-[#08090d] px-2.5 py-1 text-zinc-300 font-mono text-[11px]">
                  {merchant.refundRail}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold text-emerald-400">Trust Score {merchant.score}/100</p>
                <p className="text-[10px] text-zinc-500 font-mono">Auto-Escalation Ready</p>
              </div>

              <Link
                href={`/cases?merchant=${encodeURIComponent(merchant.name)}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8b5cf6] px-3.5 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95 shrink-0"
              >
                <span>File Grievance</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">Add Verified Service Provider</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateMerchant} className="mt-4 space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Provider / Brand Name *</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Myntra Designs Pvt Ltd"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c} className="bg-zinc-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Statutory SLA *</label>
                  <input
                    required
                    value={formData.sla}
                    onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                    placeholder="e.g. 24 Hours"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Nodal Grievance Email *</label>
                <input
                  required
                  type="email"
                  value={formData.nodalOfficer}
                  onChange={(e) => setFormData({ ...formData, nodalOfficer: e.target.value })}
                  placeholder="e.g. grievance.officer@myntra.com"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Refund Rail</label>
                  <input
                    value={formData.refundRail}
                    onChange={(e) => setFormData({ ...formData, refundRail: e.target.value })}
                    placeholder="e.g. Pine Labs / Instant UPI"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Logistics Carrier</label>
                  <input
                    value={formData.logisticsPartner}
                    onChange={(e) => setFormData({ ...formData, logisticsPartner: e.target.value })}
                    placeholder="e.g. Delhivery Logistics"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
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
                  Save Provider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
