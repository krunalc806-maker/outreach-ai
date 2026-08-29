"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  IndianRupee,
  Plus,
  Save,
  Scale,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
} from "lucide-react";
import { communicationRail } from "@/lib/rails/CommunicationRailProvider";
import ProfilePage from "@/components/profile/ProfilePage";
import TemplatesPage from "@/components/templates/TemplatesPage";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

type Campaign = { name: string; status: "Active" | "Draft" | "Completed"; leads: number };

const initialCampaigns: Campaign[] = [
  { name: "Zara / D2C Delayed Refund Batches", status: "Active", leads: 42 },
  { name: "Bengaluru NDR Logistics Escalations", status: "Completed", leads: 128 },
  { name: "Airline Weather Cancellation Claims", status: "Draft", leads: 15 },
];

const grievanceTemplates = [
  {
    name: "Statutory Notice under CPA 2019",
    subject: "FORMAL NOTICE: Consumer Grievance regarding Order #{{order_id}} | ₹{{amount}} — [Ref: CPA 2019]",
    statutoryRef: "Consumer Protection Act 2019 & E-Commerce Rules 2020",
    preview: "Formal demand for refund/delivery within 48h SLA before regulatory NCDRC filing.",
  },
  {
    name: "Delhivery NDR Logistics Override Notice",
    subject: "URGENT: False NDR Re-Attempt Override Request | AWB #{{awb_number}}",
    statutoryRef: "Logistics Consumer Service Level Agreement",
    preview: "Instructs Delhivery hub supervisor to schedule re-attempt with verified delivery landmark.",
  },
  {
    name: "Pine Labs / Banking Chargeback Petition",
    subject: "DISPUTE FILING: Payment Settlement Failure for TxID #{{tx_id}}",
    statutoryRef: "RBI Digital Transaction Ombudsman Guidelines",
    preview: "Formal chargeback claim for delayed banking credit exceeding statutory 72 hours.",
  },
];

function PageFrame({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const { theme } = useWorkspaceTheme();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[11px] font-mono font-bold uppercase tracking-wider transition-colors duration-300" style={{ color: theme.accent }}>
          Autonomous Agent Workspace
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-zinc-400">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Surface({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-white/10 bg-[#0d1017] p-5 shadow-2xl ${className}`}>{children}</section>;
}

function Campaigns({ createMode }: { createMode: boolean }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isCreating, setIsCreating] = useState(createMode);
  const [name, setName] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/campaign")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setCampaigns(
            data.campaigns.map((c: any) => ({
              name: c.name,
              status: c.status || "Active",
              leads: c.sent || 42,
            }))
          );
        }
      })
      .catch(() => null);
  }, []);

  async function createCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setCampaigns((items) => [{ name: trimmedName, status: "Draft", leads: 0 }, ...items]);
    setName("");
    setIsCreating(false);

    try {
      await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });
    } catch {
      // Graceful offline fallback
    }
  }

  return (
    <PageFrame title="Case Batches & Escalation Sequences" description="Group, track, and monitor consumer dispute batches and outreach escalation queues.">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 font-medium text-zinc-300">{campaigns.length} Batches</span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-emerald-300">Auto-Follow-Up Active</span>
        </div>
        <button onClick={() => setIsCreating(true)} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95">
          <Plus size={15} /> New Case Batch
        </button>
      </div>
      {isCreating && (
        <Surface>
          <form onSubmit={createCampaign} className="flex flex-col gap-2.5 sm:flex-row">
            <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Batch or merchant group name" className="h-10 flex-1 rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-xs text-white outline-none focus:border-[#8b5cf6]" />
            <button className="rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white active:scale-95">Create</button>
            <button type="button" onClick={() => setIsCreating(false)} className="rounded-xl px-3 text-xs text-zinc-400 hover:text-white">Cancel</button>
          </form>
        </Surface>
      )}
      <Surface className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-xs">
          <thead className="border-b border-white/10 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Batch Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Queued Cases</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {campaigns.map((c) => (
              <tr key={c.name} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-semibold text-white">{c.name}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.status === "Active" ? "bg-emerald-500/20 text-emerald-300" : c.status === "Draft" ? "bg-amber-500/20 text-amber-300" : "bg-zinc-800 text-zinc-400"}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{c.leads}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setSelectedCampaign(c.name)} className="text-zinc-400 hover:text-white">
                    <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Surface>
    </PageFrame>
  );
}

function Templates() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  return (
    <PageFrame title="Statutory Grievance Templates (CPA 2019)" description="Standardized legal notices, logistics override petitions, and RBI banking grievance formats.">
      <div className="grid gap-4 md:grid-cols-3">
        {grievanceTemplates.map((tmpl) => (
          <Surface key={tmpl.name} className="flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <span className="rounded-md bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2 py-0.5 text-[9px] font-mono text-[#a78bfa] block w-fit">
                {tmpl.statutoryRef}
              </span>
              <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{tmpl.preview}</p>
            </div>
            <button
              onClick={() => setActiveTemplate(tmpl.name)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition hover:bg-white/10 active:scale-95"
            >
              <FileText size={13} />
              <span>Use Template</span>
            </button>
          </Surface>
        ))}
      </div>
    </PageFrame>
  );
}

function Analytics() {
  const [stats, setStats] = useState({
    recovered: 0,
    hoursSaved: 0,
    successRate: 0,
    activeDisputes: 0,
  });

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cases)) {
          const list = data.cases;
          const resolved = list.filter((c: any) => c.status === "RESOLVED");
          const totalMoney = resolved.reduce((sum: number, c: any) => sum + (Number(c.extractedEntities?.amount) || Number(c.resolution?.moneyRecovered) || 0), 0);
          setStats({
            recovered: totalMoney,
            hoursSaved: resolved.length * 3,
            successRate: list.length > 0 ? Math.round((resolved.length / list.length) * 100) : 0,
            activeDisputes: list.length - resolved.length,
          });
        }
      })
      .catch(() => null);
  }, []);

  return (
    <PageFrame title="Resolution & Value Recovery Analytics" description="Measurable consumer impact metrics across logistics overrides and banking settlements.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Surface className="space-y-1">
          <span className="text-xs text-zinc-400">Total Money Recovered</span>
          <p className="text-2xl font-extrabold text-white">₹{stats.recovered.toLocaleString("en-IN")}</p>
          <span className="text-[10px] text-emerald-400 font-mono">100% Direct Bank Credit</span>
        </Surface>
        <Surface className="space-y-1">
          <span className="text-xs text-zinc-400">Consumer Hours Saved</span>
          <p className="text-2xl font-extrabold text-white">{stats.hoursSaved} hrs</p>
          <span className="text-[10px] text-[#a78bfa] font-mono">Autonomous Action</span>
        </Surface>
        <Surface className="space-y-1">
          <span className="text-xs text-zinc-400">Resolution Rate</span>
          <p className="text-2xl font-extrabold text-white">{stats.successRate}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">Verified Outcomes</span>
        </Surface>
        <Surface className="space-y-1">
          <span className="text-xs text-zinc-400">Active Disputes</span>
          <p className="text-2xl font-extrabold text-white">{stats.activeDisputes}</p>
          <span className="text-[10px] text-amber-400 font-mono">In Agent Pipeline</span>
        </Surface>
      </div>
    </PageFrame>
  );
}

function Settings() {
  const [saved, setSaved] = useState(false);
  return (
    <PageFrame title="System & Rail Preferences" description="Configure autonomous action thresholds, human-in-the-loop limits, and telemetry options.">
      <Surface className="space-y-4">
        <h3 className="text-sm font-bold text-white">Autonomous Decision Boundaries</h3>
        <div className="space-y-3 text-xs">
          <label className="flex items-center gap-2.5 text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-[#8b5cf6]" />
            <span>Require 1-tap human authorization for any financial settlement &gt; ₹500</span>
          </label>
          <label className="flex items-center gap-2.5 text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-[#8b5cf6]" />
            <span>Notify consumer instantly when Delhivery NDR override re-attempt is scheduled</span>
          </label>
          <label className="flex items-center gap-2.5 text-zinc-300">
            <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 text-[#8b5cf6]" />
            <span>Enable Gnani Indic Voice fallback if merchant ignores formal email notice</span>
          </label>
        </div>
        <button onClick={() => setSaved(true)} className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/20 transition hover:bg-[#7c3aed] active:scale-95">
          <Save size={14} /> Save preferences
        </button>
        {saved && <span className="ml-3 text-xs text-emerald-400">Preferences saved.</span>}
      </Surface>
    </PageFrame>
  );
}

function Billing() {
  const [selected, setSelected] = useState("Consumer Free");
  return (
    <PageFrame title="Consumer Protection Plans" description="Transparent pricing. Zero charges for statutory grievance recovery.">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["Consumer Free", "₹0", "Unlimited consumer dispute resolutions & NDR tracking"],
          ["Bharat Pro", "₹49 / case", "Priority Nodal desk filing with instant Pine Labs rail token"],
          ["Enterprise / Merchant", "Custom", "Automated NDR resolution & grievance management suite"],
        ].map(([plan, price, detail]) => (
          <Surface key={plan} className={selected === plan ? "border-[#8b5cf6]/60 bg-[#121217]" : ""}>
            <p className="text-base font-bold text-white">{plan}</p>
            <p className="mt-2 text-2xl font-extrabold text-white">{price}</p>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">{detail}</p>
            <button onClick={() => setSelected(plan)} className={`mt-5 w-full rounded-xl px-4 py-2 text-xs font-extrabold active:scale-95 transition ${selected === plan ? "bg-[#8b5cf6] text-white shadow-md shadow-[#8b5cf6]/25" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}>
              {selected === plan ? "Active Plan" : "Select"}
            </button>
          </Surface>
        ))}
      </div>
    </PageFrame>
  );
}

function EmailGenerator() {
  const [recipient, setRecipient] = useState("Zara India Support");
  const [orderId, setOrderId] = useState("ZR-889104");
  const [amount, setAmount] = useState("3499");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const createNotice = () => {
    const notice = communicationRail.generateFormalGrievanceNotice({
      consumerName: "Consumer",
      consumerPhone: "+91 98765 43210",
      merchantName: recipient || "Merchant",
      orderId: orderId || "ZR-889104",
      awbNumber: "DEL-984210-IN",
      amount: parseInt(amount, 10) || 3499,
      issueDescription: "Logistics package marked falsely with 2 NDR failed attempts without phone calls, and refund has been delayed past 72 hours.",
      demandedResolution: "Immediate refund credit of INR 3,499 to original payment source under Pine Labs rail.",
    });
    setGenerated(`Subject: ${notice.subject}\n\n${notice.body}`);
  };

  const copy = async () => {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <PageFrame title="Contextual Grievance Notice Composer" description="Generate legally grounded notices under the Consumer Protection Act (2019) in 1 tap.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Surface>
          <div className="space-y-3.5 text-xs">
            <label className="block font-semibold text-zinc-300 uppercase">
              Merchant / Brand Name
              <input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-xs text-white outline-none focus:border-[#8b5cf6]" placeholder="Zara India" />
            </label>
            <label className="block font-semibold text-zinc-300 uppercase">
              Order ID / Tracking Number
              <input value={orderId} onChange={(e) => setOrderId(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-xs text-white outline-none focus:border-[#8b5cf6]" placeholder="ZR-889104" />
            </label>
            <label className="block font-semibold text-zinc-300 uppercase">
              Claim Amount (₹)
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-xs text-white outline-none focus:border-[#8b5cf6]" placeholder="3499" />
            </label>
            <button onClick={createNotice} className="inline-flex items-center gap-1.5 rounded-xl bg-[#8b5cf6] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#7c3aed] active:scale-95 transition shadow-md shadow-[#8b5cf6]/20">
              <Sparkles size={14} /> Compose CPA 2019 Notice
            </button>
          </div>
        </Surface>
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-xs">Generated Statutory Notice</h2>
            <button onClick={copy} disabled={!generated} className="inline-flex items-center gap-1 text-xs text-[#a78bfa] disabled:text-zinc-600">
              <Copy size={13} /> {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <pre className="mt-3 min-h-48 whitespace-pre-wrap rounded-2xl bg-[#11141c] p-3.5 font-mono text-[11px] leading-5 text-zinc-300 border border-white/5">
            {generated || "Your tailored legal grievance notice will appear here."}
          </pre>
        </Surface>
      </div>
    </PageFrame>
  );
}

function LeadImport() {
  const [rows, setRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState("");
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setRows(String(reader.result).split(/\r?\n/).filter(Boolean).slice(0, 6).map((row) => row.split(",").map((cell) => cell.trim())));
    reader.readAsText(file);
  }
  return (
    <PageFrame title="Import Provider & Grievance Directory" description="Preview and import verified merchant grievance desks and Nodal officer contact lists.">
      <Surface>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/5">
          <Upload className="text-[#a78bfa]" size={22} />
          <span className="mt-3 font-bold text-white text-xs">Choose a CSV file</span>
          <span className="mt-1 text-[11px] text-zinc-400">Import merchant dispute emails and Nodal officer escalation contacts.</span>
          <input type="file" accept=".csv,text/csv" onChange={handleFile} className="sr-only" />
        </label>
        {fileName && <p className="mt-3 text-xs text-emerald-400"><Check className="mr-1.5 inline" size={14} />{fileName} ready</p>}
        {rows.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-xs">
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-white/10">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-3 py-2.5 text-zinc-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Surface>
    </PageFrame>
  );
}

export default function WorkspacePage({ route }: { route: string }) {
  const page = useMemo(() => {
    if (route === "campaigns" || route === "campaigns/new") return <Campaigns createMode={route === "campaigns/new"} />;
    if (route === "templates") return <TemplatesPage />;
    if (route === "analytics") return <Analytics />;
    if (route === "settings") return <Settings />;
    if (route === "profile") return <ProfilePage />;
    if (route === "billing") return <Billing />;
    if (route === "ai/email-generator") return <EmailGenerator />;
    return <LeadImport />;
  }, [route]);

  return page;
}
