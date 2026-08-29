"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Edit2,
  FileText,
  Filter,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import type { GrievanceTemplate } from "@/app/api/templates/route";

const DEFAULT_VARIABLES: Record<string, string> = {
  consumer_name: "Consumer",
  merchant: "Zara India",
  order_id: "ZR-889104",
  amount: "3499",
  awb_number: "DEL-984210-IN",
  case_id: "CASE-DLV-9842",
  deadline: "48 Hours",
  issue: "Package falsely marked as Customer Not Reachable without attempting phone call, and refund has been delayed past statutory 72 hours.",
  requested_resolution: "Immediate refund credit of INR 3,499 to original payment source under Pine Labs rail.",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<GrievanceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Preview / Live Test Modal State
  const [previewTemplate, setPreviewTemplate] = useState<GrievanceTemplate | null>(null);
  const [testVariables, setTestVariables] = useState<Record<string, string>>(DEFAULT_VARIABLES);
  const [copied, setCopied] = useState(false);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<GrievanceTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Consumer Rights (CPA)",
    statutoryRef: "",
    subject: "",
    templateBody: "",
    variables: "consumer_name, merchant, order_id, amount, issue, requested_resolution",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTemplates();
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user?.fullName) {
          setTestVariables((prev) => ({
            ...prev,
            consumer_name: data.user.fullName,
          }));
        }
      })
      .catch(() => null);
  }, []);

  async function fetchTemplates() {
    try {
      setLoading(true);
      const res = await fetch("/api/templates");
      const data = await res.json();
      if (data.success && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const categories = ["All", "Consumer Rights (CPA)", "Logistics & NDR", "Payments & Refunds", "Aviation & Travel", "Quick Commerce", "Custom"];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.statutoryRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.body.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const renderInterpolated = (template: GrievanceTemplate, vars: Record<string, string>) => {
    let sub = template.subject;
    let bdy = template.body;
    for (const [key, val] of Object.entries(vars)) {
      const reg = new RegExp(`{{${key}}}`, "g");
      sub = sub.replace(reg, val || `[${key}]`);
      bdy = bdy.replace(reg, val || `[${key}]`);
    }
    return { subject: sub, body: bdy };
  };

  const handleCopyNotice = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleOpenCreateModal = (templateToEdit?: GrievanceTemplate) => {
    if (templateToEdit) {
      setEditingTemplate(templateToEdit);
      setFormData({
        name: templateToEdit.name,
        category: templateToEdit.category,
        statutoryRef: templateToEdit.statutoryRef,
        subject: templateToEdit.subject,
        templateBody: templateToEdit.body,
        variables: templateToEdit.variables.join(", "),
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: "",
        category: "Consumer Rights (CPA)",
        statutoryRef: "",
        subject: "",
        templateBody: "",
        variables: "consumer_name, merchant, order_id, amount, issue, requested_resolution",
      });
    }
    setIsModalOpen(true);
  };

  const handleDuplicate = (tmpl: GrievanceTemplate) => {
    setEditingTemplate(null);
    setFormData({
      name: `${tmpl.name} (Custom Copy)`,
      category: tmpl.category,
      statutoryRef: tmpl.statutoryRef,
      subject: tmpl.subject,
      templateBody: tmpl.body,
      variables: tmpl.variables.join(", "),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom template?")) return;
    try {
      await fetch(`/api/templates?id=${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (previewTemplate?.id === id) setPreviewTemplate(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject.trim() || !formData.templateBody.trim()) return;

    setIsSubmitting(true);
    try {
      const vars = formData.variables
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          statutoryRef: formData.statutoryRef,
          subject: formData.subject,
          templateBody: formData.templateBody,
          variables: vars,
        }),
      });

      const data = await res.json();
      if (data.success && data.template) {
        setTemplates((prev) => [data.template, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1017] p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/30 bg-[#8b5cf6]/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#a78bfa]">
                <Sparkles size={12} /> Statutory Grievance Engine
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-300">
                <FileText size={12} /> CPA 2019 & RBI Compliant
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Grievance Notice Templates & Variable Engine
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-zinc-400">
              Legally grounded statutory notices citing the Consumer Protection Act (2019), E-Commerce Rules (2020), DGCA Passenger Charters, and RBI Turnaround Time directives.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8b5cf6] px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-[#8b5cf6]/25 transition hover:bg-[#7c3aed] active:scale-95"
            >
              <Plus size={15} />
              <span>Create Custom Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0d1017] p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#11141c] px-3 py-2 text-xs text-white">
          <Search size={15} className="text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name, act citation, or keyword..."
            className="w-full bg-transparent outline-none placeholder-zinc-500 text-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-white">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
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

      {/* Templates Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-[#0d1017]" />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#0d1017] p-12 text-center text-zinc-400 space-y-3">
          <FileText size={32} className="mx-auto text-zinc-600" />
          <p className="text-sm font-semibold text-white">No templates found</p>
          <p className="text-xs text-zinc-500">Try adjusting your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0d1017] p-5 shadow-xl transition hover:border-[#8b5cf6]/40 hover:bg-[#11141c]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 px-2 py-0.5 text-[9px] font-mono text-[#a78bfa] block">
                    {template.category}
                  </span>
                  {template.isCustom && (
                    <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                      User Custom
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{template.name}</h3>
                  <p className="mt-1 text-[10px] font-mono text-emerald-400 truncate">
                    § {template.statutoryRef}
                  </p>
                </div>

                <div className="rounded-xl bg-[#08090d] p-2.5 border border-white/5">
                  <p className="text-[11px] font-mono text-zinc-400 line-clamp-3 leading-relaxed">
                    {template.body}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.variables.slice(0, 4).map((v) => (
                    <span
                      key={v}
                      className="rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400"
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                  {template.variables.length > 4 && (
                    <span className="text-[9px] text-zinc-500 font-mono self-center">
                      +{template.variables.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewTemplate(template)}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#8b5cf6]/20 px-2.5 py-1.5 text-[11px] font-bold text-[#a78bfa] transition hover:bg-[#8b5cf6] hover:text-white active:scale-95"
                  >
                    <FileText size={12} /> Test & Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(template)}
                    title="Duplicate as Custom Template"
                    className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <Copy size={12} />
                  </button>
                  {template.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleDelete(template.id)}
                      title="Delete Custom Template"
                      className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-1.5 text-rose-400 transition hover:bg-rose-500/20"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <Link
                  href={`/cases?template=${template.id}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition"
                >
                  <span>Use in Case</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Interactive Preview & Variable Substitution */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#a78bfa] uppercase font-bold">
                  Interactive Variable Interpolation Engine
                </span>
                <h2 className="text-lg font-bold text-white">{previewTemplate.name}</h2>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              {/* Left Column: Variable Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Live Test Variables</span>
                  <button
                    onClick={() => setTestVariables(DEFAULT_VARIABLES)}
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white"
                  >
                    <RotateCcw size={10} /> Reset Defaults
                  </button>
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {previewTemplate.variables.map((variableKey) => (
                    <div key={variableKey} className="space-y-1">
                      <label className="text-[11px] font-mono text-zinc-400 capitalize block">
                        {variableKey.replace(/_/g, " ")}:
                      </label>
                      <input
                        value={testVariables[variableKey] || ""}
                        onChange={(e) =>
                          setTestVariables((prev) => ({
                            ...prev,
                            [variableKey]: e.target.value,
                          }))
                        }
                        className="h-8 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-2.5 text-xs text-white outline-none focus:border-[#8b5cf6]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Rendered Statutory Output */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">Rendered Statutory Notice</span>
                  <button
                    onClick={() => {
                      const rendered = renderInterpolated(previewTemplate, testVariables);
                      handleCopyNotice(`Subject: ${rendered.subject}\n\n${rendered.body}`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#8b5cf6] px-3 py-1 text-xs font-bold text-white shadow hover:bg-[#7c3aed] active:scale-95"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copied ? "Copied to Clipboard!" : "Copy Full Notice"}</span>
                  </button>
                </div>

                {(() => {
                  const rendered = renderInterpolated(previewTemplate, testVariables);
                  return (
                    <div className="space-y-2">
                      <div className="rounded-xl border border-white/5 bg-[#11141c] p-3 text-xs">
                        <span className="text-[10px] text-zinc-500 font-mono block">SUBJECT:</span>
                        <p className="font-bold text-white text-xs mt-0.5">{rendered.subject}</p>
                      </div>

                      <pre className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-[#11141c] p-3.5 font-mono text-[11px] leading-relaxed text-zinc-300">
                        {rendered.body}
                      </pre>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Close Preview
              </button>
              <Link
                href="/cases"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-black font-extrabold px-4 py-2 text-xs hover:bg-emerald-400 active:scale-95"
              >
                <Send size={13} />
                <span>Deploy Notice into Active Case</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit Custom Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-[#0d1017] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingTemplate ? "Edit Grievance Template" : "Create Custom Notice Template"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitTemplate} className="mt-4 space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Template Title *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. D2C Return Rejection Grievance"
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-300">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat} className="bg-zinc-900 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Statutory / Legal Reference Citation</label>
                <input
                  value={formData.statutoryRef}
                  onChange={(e) => setFormData({ ...formData, statutoryRef: e.target.value })}
                  placeholder="e.g. Consumer Protection (E-Commerce) Rules 2020, Rule 4(4)"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Subject Line (supports variables) *</label>
                <input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. FORMAL NOTICE: Grievance regarding Order #{{order_id}} | ₹{{amount}}"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Notice Body (supports &#123;&#123;variable&#125;&#125; syntax) *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.templateBody}
                  onChange={(e) => setFormData({ ...formData, templateBody: e.target.value })}
                  placeholder="To Grievance Desk of {{merchant}}, I demand resolution for {{issue}} under Order #{{order_id}}..."
                  className="w-full rounded-xl border border-zinc-700 bg-[#11141c] p-3 text-white outline-none focus:border-[#8b5cf6] font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-300">Dynamic Variables (comma separated)</label>
                <input
                  value={formData.variables}
                  onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                  placeholder="consumer_name, merchant, order_id, amount, issue, requested_resolution"
                  className="h-9 w-full rounded-xl border border-zinc-700 bg-[#11141c] px-3 text-white outline-none focus:border-[#8b5cf6]"
                />
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
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#8b5cf6] px-4 py-2 font-extrabold text-white shadow hover:bg-[#7c3aed] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
