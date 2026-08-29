"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, IndianRupee, ShieldCheck } from "lucide-react";
import { useWorkspaceTheme } from "@/components/theme/WorkspaceThemeContext";

export default function MetricsCards() {
  const { theme } = useWorkspaceTheme();
  const [metrics, setMetrics] = useState([
    { label: "Total Cases Logged", value: "1", subtext: "Database Isolated", icon: Clock },
    { label: "Verified Settlements", value: "1", subtext: "Cryptographic UTRs", icon: CheckCircle2 },
    { label: "Disputed Amount Tracked", value: "₹3,499", subtext: "Pine Labs Switch", icon: IndianRupee },
    { label: "Operational Success Rate", value: "100%", subtext: "Automated Resolution", icon: ArrowUpRight },
  ]);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.cases)) {
          const list = data.cases;
          const resolved = list.filter((c: any) => c.status === "RESOLVED");
          const totalMoney = list.reduce(
            (sum: number, c: any) =>
              sum + (Number(c.extractedEntities?.amount) || Number(c.resolution?.moneyRecovered) || 0),
            0
          );
          const rate = list.length > 0 ? Math.round((resolved.length / list.length) * 100) : 100;

          setMetrics([
            {
              label: "Total Cases Logged",
              value: String(list.length),
              subtext: "Database Isolated",
              icon: Clock,
            },
            {
              label: "Verified Settlements",
              value: String(resolved.length),
              subtext: "Cryptographic UTRs",
              icon: CheckCircle2,
            },
            {
              label: "Disputed Amount Tracked",
              value: `₹${totalMoney.toLocaleString("en-IN")}`,
              subtext: "Pine Labs Switch",
              icon: IndianRupee,
            },
            {
              label: "Operational Success Rate",
              value: `${rate}%`,
              subtext: "Automated Resolution",
              icon: ArrowUpRight,
            },
          ]);
        }
      })
      .catch(() => null);
  }, []);

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="group rounded-2xl border border-white/10 bg-[#0d1017] p-4 shadow-xl transition-all duration-300 hover:bg-[#11141c]"
            style={{
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                {metric.label}
              </p>
              <div
                className="rounded-xl border p-1.5 transition-colors"
                style={{
                  borderColor: theme.badgeBorder,
                  backgroundColor: theme.badgeBg,
                  color: theme.accent,
                }}
              >
                <Icon size={15} />
              </div>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{metric.value}</p>
            <p className="mt-1 text-[10px] font-mono text-zinc-400">{metric.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
