-- CRM and Lead Intelligence schema extension
-- Generated SQL migration only; no execution performed.

CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  title TEXT,
  company_id UUID,
  location TEXT,
  website TEXT,
  industry TEXT,
  stage TEXT NOT NULL,
  status TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'Medium',
  ai_summary TEXT,
  next_best_action TEXT,
  risk TEXT,
  opportunity TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  custom_fields JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS crm_companies (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  overview TEXT,
  employee_count TEXT,
  industry TEXT,
  technologies TEXT[] DEFAULT '{}',
  funding TEXT,
  revenue TEXT,
  location TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assignee TEXT,
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_notes (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  mentions TEXT[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  timestamp_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_score ON crm_leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_due_date ON crm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_crm_notes_lead_id ON crm_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_lead_id ON crm_activities(lead_id);
