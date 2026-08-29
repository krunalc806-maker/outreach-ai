"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Bot,
  Briefcase,
  PlayCircle,
  BookOpen,
  FileText,
  Workflow,
  ClipboardList,
  MessageSquare,
  BarChart3,
  Truck,
  IndianRupee,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Navigation" | "Cases & Rails" | "Actions & Tools";
  href: string;
  icon: any;
  keywords: string[];
  badge?: string;
}

const SEARCH_REGISTRY: SearchItem[] = [
  // Navigation
  {
    id: "nav-dashboard",
    title: "Agent Mission Control",
    subtitle: "Real-time autonomous dispute orchestrator & KPIs",
    category: "Navigation",
    href: "/dashboard",
    icon: Bot,
    keywords: ["home", "dashboard", "kpi", "control", "metrics"],
    badge: "Core",
  },
  {
    id: "nav-cases",
    title: "Case Workspace & Task Plan",
    subtitle: "8-stage autonomous resolution graph & approvals",
    category: "Navigation",
    href: "/cases",
    icon: Briefcase,
    keywords: ["case", "task", "plan", "dispute", "approval", "timeline"],
    badge: "Active",
  },
  {
    id: "nav-demo",
    title: "The Ken 3-Min Interactive Demo",
    subtitle: "Live rail sandbox, simulated NDR, & evaluator tools",
    category: "Navigation",
    href: "/demo",
    icon: PlayCircle,
    keywords: ["demo", "judge", "competition", "sandbox", "evaluation", "rewiring"],
    badge: "Judge",
  },
  {
    id: "nav-evidence",
    title: "Research & Evidence Dossier",
    subtitle: "CPA 2019 legal backing, CAIT data, & TAM economics",
    category: "Navigation",
    href: "/evidence",
    icon: BookOpen,
    keywords: ["evidence", "research", "legal", "cpa", "statutory", "economics"],
  },
  {
    id: "nav-templates",
    title: "Statutory Notices (CPA 2019)",
    subtitle: "Court-ready legal demand notices & statutory rules",
    category: "Navigation",
    href: "/templates",
    icon: FileText,
    keywords: ["template", "notice", "legal", "demand", "ncdrc", "section 2"],
  },
  {
    id: "nav-sequence",
    title: "Follow-Up Escalation Engine",
    subtitle: "Automated SLA timer escalation & webhook triggers",
    category: "Navigation",
    href: "/sequence",
    icon: Workflow,
    keywords: ["sequence", "followup", "sla", "timer", "escalation", "automation"],
  },
  {
    id: "nav-crm",
    title: "Counterparty CRM & Registry",
    subtitle: "Track merchants, couriers, and nodal escalation desks",
    category: "Navigation",
    href: "/crm",
    icon: ClipboardList,
    keywords: ["crm", "merchant", "counterparty", "courier", "registry", "leads"],
  },
  {
    id: "nav-chat",
    title: "AI Console (NVIDIA & Gemini)",
    subtitle: "Multi-model reasoning copilot for complex grievances",
    category: "Navigation",
    href: "/chat",
    icon: MessageSquare,
    keywords: ["chat", "ai", "copilot", "nvidia", "gemini", "llama", "assistant"],
  },
  {
    id: "nav-analytics",
    title: "Resolution Analytics & ROI",
    subtitle: "Aggregate consumer capital recovered & time saved",
    category: "Navigation",
    href: "/analytics",
    icon: BarChart3,
    keywords: ["analytics", "roi", "savings", "recovered", "reports"],
  },

  // Cases & Rails
  {
    id: "case-zara",
    title: "Zara Bengaluru NDR Dispute (₹3,499)",
    subtitle: "AWB #DEL-984210-IN • Delhivery Logistics Rail Override",
    category: "Cases & Rails",
    href: "/cases",
    icon: Truck,
    keywords: ["zara", "delhivery", "ndr", "3499", "awb", "bengaluru", "indiranagar"],
    badge: "Active Case",
  },
  {
    id: "case-pinelabs",
    title: "Pine Labs 72h Acquirer Reversal Dispute",
    subtitle: "TxID #PL-TX-998241 • Bank UTR #423891004812 Verified",
    category: "Cases & Rails",
    href: "/demo",
    icon: IndianRupee,
    keywords: ["pine labs", "payment", "refund", "reversal", "utr", "gateway", "npci"],
    badge: "Resolved",
  },
  {
    id: "case-indigo",
    title: "IndiGo Airline Flight Cancellation Claim",
    subtitle: "PNR #6E-9942 • DGCA Passenger Charter Compliance",
    category: "Cases & Rails",
    href: "/templates",
    icon: FileText,
    keywords: ["indigo", "flight", "airline", "dgca", "pnr", "travel"],
  },

  // Actions & Tools
  {
    id: "action-legal-notice",
    title: "Generate CPA 2019 Formal Legal Notice",
    subtitle: "Instant court-ready PDF demand with QR verification seal",
    category: "Actions & Tools",
    href: "/demo",
    icon: ShieldCheck,
    keywords: ["print", "pdf", "generate", "notice", "court", "qr"],
    badge: "Toolkit",
  },
  {
    id: "action-new-case",
    title: "Deploy Agent for New Consumer Problem",
    subtitle: "Natural language voice or text ingestion",
    category: "Actions & Tools",
    href: "/cases",
    icon: Sparkles,
    keywords: ["new", "create", "deploy", "file", "intake"],
    badge: "Action",
  },
];

export default function SearchBar() {
  const router = useRouter();
  const { theme } = useWorkspaceTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items based on query
  const filteredItems = query.trim()
    ? SEARCH_REGISTRY.filter((item) => {
        const q = query.toLowerCase().trim();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : SEARCH_REGISTRY;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const focusSearch = () => {
      inputRef.current?.focus();
      setIsOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        focusSearch();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("dashboard-search-focus", focusSearch);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("dashboard-search-focus", focusSearch);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery("");
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      } else if (query.trim()) {
        setIsOpen(false);
        router.push(`/cases?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  // Group filtered items by category
  const categories = Array.from(new Set(filteredItems.map((item) => item.category)));

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: isOpen ? theme.primary : "#9CA3AF" }}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search cases, rails, notices, actions... (Ctrl+K)"
          aria-label="Search workspace"
          className="h-10 w-full min-w-[220px] sm:min-w-[280px] rounded-xl border border-white/15 bg-[#11141c] pl-11 pr-20 text-xs text-white outline-none placeholder:text-zinc-400 transition-all duration-200 shadow-inner"
          style={{
            borderColor: isOpen ? theme.primary : "rgba(255,255,255,0.15)",
            boxShadow: isOpen ? `0 0 18px ${theme.glow}` : undefined,
          }}
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/15 bg-[#08090d] px-2 py-0.5 text-[10px] font-mono text-zinc-300 shadow-sm">
            Ctrl K
          </kbd>
        )}
      </div>

      {/* Interactive Command Palette Dropdown (With Wide Minimum Width) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-12 z-50 w-[min(520px,calc(100vw-2rem))] max-h-[440px] overflow-y-auto rounded-2xl border border-white/15 bg-[#0d1017] p-2.5 shadow-2xl backdrop-blur-2xl"
            style={{
              boxShadow: `0 20px 60px rgba(0,0,0,0.9), 0 0 30px ${theme.glow}`,
            }}
          >
            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400 space-y-2">
                <Search size={20} className="mx-auto text-zinc-500" />
                <p>No direct match found for &quot;{query}&quot;</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/cases?search=${encodeURIComponent(query.trim())}`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: theme.primary }}
                >
                  <span>Search in Case Workspace</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="space-y-3 p-1">
                {categories.map((category) => {
                  const categoryItems = filteredItems.filter((i) => i.category === category);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-zinc-600">{categoryItems.length}</span>
                      </div>

                      <div className="space-y-1">
                        {categoryItems.map((item) => {
                          const flatIndex = filteredItems.findIndex((x) => x.id === item.id);
                          const isSelected = selectedIndex === flatIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(flatIndex)}
                              className={`w-full flex items-center justify-between gap-3 rounded-xl p-2.5 text-left transition group ${
                                isSelected
                                  ? "bg-white/10 text-white shadow-sm"
                                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              {/* Left Side: Icon + Title/Subtitle */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div
                                  className="h-9 w-9 rounded-xl border transition-colors shrink-0 flex items-center justify-center"
                                  style={{
                                    borderColor: isSelected ? theme.badgeBorder : "rgba(255,255,255,0.1)",
                                    backgroundColor: isSelected ? theme.badgeBg : "rgba(255,255,255,0.04)",
                                    color: isSelected ? theme.accent : "#D1D5DB",
                                  }}
                                >
                                  <Icon size={16} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold truncate text-white leading-snug">
                                    {item.title}
                                  </p>
                                  <p className="text-[11px] text-zinc-400 truncate leading-snug">
                                    {item.subtitle}
                                  </p>
                                </div>
                              </div>

                              {/* Right Side: Badge + Arrow */}
                              <div className="flex items-center gap-2 shrink-0">
                                {item.badge && (
                                  <span
                                    className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border whitespace-nowrap"
                                    style={{
                                      backgroundColor: theme.badgeBg,
                                      borderColor: theme.badgeBorder,
                                      color: theme.accent,
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                <ArrowRight
                                  size={14}
                                  className={`transition-transform duration-150 ${
                                    isSelected
                                      ? "opacity-100 translate-x-0.5 text-white"
                                      : "opacity-0 text-zinc-500"
                                  }`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer Prompt */}
            <div className="mt-2 flex items-center justify-between border-t border-white/10 px-3 py-2 text-[10px] text-zinc-400 font-mono">
              <span>Use ↑↓ to navigate • ↵ to select • ESC to close</span>
              <span className="hidden sm:inline" style={{ color: theme.accent }}>
                OutreachAI Command Palette
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
