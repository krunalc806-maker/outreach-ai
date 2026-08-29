export type LeadStage = "New" | "Prospecting" | "Qualified" | "Engaged" | "High Intent" | "Meeting" | "Proposal" | "Closed" | "Archived";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Opportunity" | "Closed";
export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Planned" | "In Progress" | "Done";
export type ActivityType = "Email" | "Call" | "Meeting" | "Task" | "Campaign" | "AI";

export interface SocialProfile {
  platform: string;
  url: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  companyId: string;
  location: string;
  website: string;
  industry: string;
  socialProfiles: SocialProfile[];
  stage: LeadStage;
  status: LeadStatus;
  score: number;
  priority: "Low" | "Medium" | "High";
  aiSummary: string;
  nextBestAction: string;
  risk: string;
  opportunity: string;
  tags: string[];
  notes: string;
  createdAt: string;
  customFields: Record<string, string>;
}

export interface CompanyProfile {
  id: string;
  name: string;
  overview: string;
  employeeCount: string;
  industry: string;
  technologies: string[];
  funding: string;
  revenue: string;
  location: string;
  website: string;
}

export interface TaskItem {
  id: string;
  leadId: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface NoteItem {
  id: string;
  leadId: string;
  title: string;
  body: string;
  mentions: string[];
  attachments: string[];
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  detail: string;
  timestamp: string;
}

export interface CrmSnapshot {
  leads: LeadRecord[];
  companies: CompanyProfile[];
  tasks: TaskItem[];
  notes: NoteItem[];
  activities: ActivityItem[];
  pipelineStages: LeadStage[];
}

export type Lead = LeadRecord;
export type Task = TaskItem;
export type Note = NoteItem;
export type Activity = ActivityItem;
export type Company = CompanyProfile;

