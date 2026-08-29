"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  status: "Active" | "Completed" | "Draft";
  sent: number;
  openRate: string;
  replyRate: string;
}

const campaigns: Campaign[] = [
  {
    id: 1,
    name: "SaaS Outreach",
    status: "Active",
    sent: 1240,
    openRate: "58%",
    replyRate: "17%",
  },
  {
    id: 2,
    name: "Startup Founders",
    status: "Completed",
    sent: 980,
    openRate: "63%",
    replyRate: "22%",
  },
  {
    id: 3,
    name: "Marketing Agencies",
    status: "Draft",
    sent: 0,
    openRate: "-",
    replyRate: "-",
  },
];

export default function RecentCampaigns() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70">
      <div className="flex items-center justify-between border-b border-zinc-800 p-6">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Campaigns
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Your latest outreach campaigns
          </p>
        </div>

        <Link
          href="/campaigns"
          className="flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-sm text-zinc-400">
              <th className="px-6 py-4 font-medium">Campaign</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Sent</th>
              <th className="px-6 py-4 font-medium">Open Rate</th>
              <th className="px-6 py-4 font-medium">Reply Rate</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-zinc-800/50 transition hover:bg-zinc-800/40"
              >
                <td className="px-6 py-5 font-medium text-white">
                  {campaign.name}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      campaign.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : campaign.status === "Completed"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {campaign.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-zinc-300">
                  {campaign.sent.toLocaleString()}
                </td>

                <td className="px-6 py-5 text-zinc-300">
                  {campaign.openRate}
                </td>

                <td className="px-6 py-5 text-zinc-300">
                  {campaign.replyRate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}