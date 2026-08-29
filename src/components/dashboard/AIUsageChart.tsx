"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Mon",
    emails: 120,
    ai: 45,
  },
  {
    name: "Tue",
    emails: 180,
    ai: 68,
  },
  {
    name: "Wed",
    emails: 240,
    ai: 82,
  },
  {
    name: "Thu",
    emails: 210,
    ai: 76,
  },
  {
    name: "Fri",
    emails: 320,
    ai: 110,
  },
  {
    name: "Sat",
    emails: 280,
    ai: 95,
  },
  {
    name: "Sun",
    emails: 350,
    ai: 130,
  },
];

export default function AIUsageChart() {
  return (
    <section aria-labelledby="ai-usage-heading" className="rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-lg shadow-black/10">
      <div className="border-b border-zinc-800 p-6">
        <h2 id="ai-usage-heading" className="text-xl font-semibold text-white">
          AI Usage
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          AI generations and emails sent this week
        </p>
      </div>

      <div role="img" aria-label="Area chart showing daily emails sent and AI generations" className="h-72 p-4 sm:h-80 sm:p-6">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="emails"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="ai"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22c55e"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#27272a"
            />

            <XAxis
              dataKey="name"
              stroke="#71717a"
            />

            <YAxis stroke="#71717a" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "12px",
              }}
            />

            <Area
              type="monotone"
              dataKey="emails"
              stroke="#8b5cf6"
              fill="url(#emails)"
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="ai"
              stroke="#22c55e"
              fill="url(#ai)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
