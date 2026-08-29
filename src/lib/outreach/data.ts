import type { OutreachSnapshot } from "./types";

const now = new Date().toISOString();

export const outreachSeedData: OutreachSnapshot = {
  campaigns: [
    {
      id: "camp-1",
      name: "SaaS Expansion",
      objective: "Book discovery calls with product-led growth teams",
      audience: "VPs of Growth, RevOps, CRO",
      status: "Running",
      sent: 1240,
      replies: 189,
      openRate: 63,
      conversionRate: 11,
      archived: false,
      createdAt: now,
      templateId: "tmpl-1",
      sequenceSteps: ["Initial Email", "Follow-up", "Break-up"],
    },
    {
      id: "camp-2",
      name: "Founder Outreach",
      objective: "Install a personalized founder-led sequence",
      audience: "Seed-stage founders",
      status: "Paused",
      sent: 980,
      replies: 96,
      openRate: 58,
      conversionRate: 8,
      archived: false,
      createdAt: now,
      templateId: "tmpl-2",
      sequenceSteps: ["Intro", "Offer", "Nurture"],
    },
  ],
  leads: [
    {
      id: "lead-1",
      name: "Maya Chen",
      company: "Northstar Labs",
      email: "maya@northstarlabs.com",
      status: "Qualified",
      score: 92,
      tags: ["VP Growth", "High Intent"],
      notes: "Interested in AI personalization workflow.",
      lastActivity: "2h ago",
      source: "Inbound",
    },
    {
      id: "lead-2",
      name: "Owen Rivera",
      company: "Helio AI",
      email: "owen@helio.ai",
      status: "Contacted",
      score: 78,
      tags: ["RevOps"],
      notes: "Asked for a short product overview.",
      lastActivity: "Yesterday",
      source: "CSV Import",
    },
  ],
  templates: [
    {
      id: "tmpl-1",
      title: "Discovery Intro",
      type: "Cold",
      tone: "Professional",
      body: "Hi {{firstName}}, I noticed your team is investing in multi-channel growth. I’d love to share a lightweight way to improve reply quality with AI-assisted outreach.",
    },
    {
      id: "tmpl-2",
      title: "Follow-Up nudge",
      type: "Follow-up",
      tone: "Friendly",
      body: "Hi {{firstName}}, just circling back in case this is timely. I can share a short example if helpful.",
    },
  ],
};

export function getOutreachSnapshot(): OutreachSnapshot {
  return outreachSeedData;
}
