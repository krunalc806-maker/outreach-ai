export type OutreachStatus = "Draft" | "Running" | "Paused" | "Completed";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Opportunity" | "Closed";
export type Tone = "Professional" | "Friendly" | "Persuasive";

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  audience: string;
  status: OutreachStatus;
  sent: number;
  replies: number;
  openRate: number;
  conversionRate: number;
  archived: boolean;
  createdAt: string;
  templateId: string;
  sequenceSteps: string[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  status: LeadStatus;
  score: number;
  tags: string[];
  notes: string;
  lastActivity: string;
  source: string;
}

export interface EmailTemplate {
  id: string;
  title: string;
  type: "Cold" | "Follow-up" | "Subject" | "CTA";
  tone: Tone;
  body: string;
}

export interface OutreachSnapshot {
  campaigns: Campaign[];
  leads: Lead[];
  templates: EmailTemplate[];
}
