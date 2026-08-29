-- ============================================================================
-- THE KEN CASE COMPETITION 2026 — OUTREACHAI PERSISTENT SUPABASE SCHEMA
-- ============================================================================

-- 1. PROFILES TABLE (User Accounts & Onboarding)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  city TEXT DEFAULT 'Bengaluru',
  avatar_url TEXT,
  role TEXT DEFAULT 'Individual Consumer',
  primary_objective TEXT DEFAULT 'ECOMMERCE_NDR_REFUND',
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CASES TABLE (Autonomous Consumer Cases)
CREATE TABLE IF NOT EXISTS public.cases (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'DELIVERY_NDR',
  merchant TEXT NOT NULL DEFAULT '',
  order_id TEXT,
  awb TEXT,
  transaction_id TEXT,
  claim_amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PLANNING',
  risk_level TEXT NOT NULL DEFAULT 'LOW',
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  description TEXT NOT NULL DEFAULT '',
  raw_input TEXT,
  understanding_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 3. CASE_EVENTS TABLE (Timeline Audit Log & Telemetry Events)
CREATE TABLE IF NOT EXISTS public.case_events (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'LOGISTICS_SCAN',
  phase TEXT DEFAULT 'Investigation',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'delhivery',
  mode TEXT NOT NULL DEFAULT 'SANDBOX_SIMULATED',
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CASE_EVIDENCE TABLE (Verified Evidence Layer)
CREATE TABLE IF NOT EXISTS public.case_evidence (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence NUMERIC NOT NULL DEFAULT 1.0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AGENT_RUNS TABLE (AI Model Executions)
CREATE TABLE IF NOT EXISTS public.agent_runs (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'nvidia',
  model TEXT NOT NULL DEFAULT 'meta/llama-3.1-8b-instruct',
  task_type TEXT NOT NULL DEFAULT 'DISPUTE_RESOLUTION',
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  input JSONB NOT NULL DEFAULT '{}'::jsonb,
  output JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. AGENT_ACTIONS TABLE (Rail Task Actions & Steps)
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  agent_run_id TEXT REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  rail TEXT NOT NULL,
  risk_level TEXT NOT NULL DEFAULT 'LOW',
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  request JSONB NOT NULL DEFAULT '{}'::jsonb,
  response JSONB NOT NULL DEFAULT '{}'::jsonb,
  external_reference TEXT,
  execution_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 7. CONSENTS TABLE (Human-in-the-Loop Authorizations)
CREATE TABLE IF NOT EXISTS public.consents (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  action_id TEXT REFERENCES public.agent_actions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL DEFAULT 'FINANCIAL_REFUND_SETTLEMENT',
  title TEXT NOT NULL DEFAULT 'Authorize Action',
  impact_analysis TEXT,
  proposed_action TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  decision_note TEXT,
  granted BOOLEAN NOT NULL DEFAULT FALSE,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- 8. OUTCOMES TABLE (Verified Case Resolutions)
CREATE TABLE IF NOT EXISTS public.outcomes (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  outcome_type TEXT NOT NULL DEFAULT 'REFUND_PROCESSED',
  amount_recovered NUMERIC NOT NULL DEFAULT 0,
  time_saved_minutes NUMERIC NOT NULL DEFAULT 0,
  external_reference TEXT,
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
  summary TEXT NOT NULL,
  rail_confirmations JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CAMPAIGNS TABLE (Batch Outreach & Grievance Queues)
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  objective TEXT DEFAULT 'Consumer Dispute Resolution',
  audience TEXT DEFAULT 'E-Commerce Brands & Logistics Desks',
  status TEXT NOT NULL DEFAULT 'Running',
  sent INT NOT NULL DEFAULT 0,
  replies INT NOT NULL DEFAULT 0,
  open_rate INT NOT NULL DEFAULT 0,
  conversion_rate INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. LEADS TABLE (CRM Counterparties & Contacts)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id TEXT REFERENCES public.campaigns(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Qualified',
  score INT NOT NULL DEFAULT 85,
  tags TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  last_activity TEXT DEFAULT 'Just now',
  source TEXT DEFAULT 'Inbound',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TEMPLATES TABLE (Statutory Notice Templates)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SEQUENCES TABLE (Escalation Follow-up DAGs)
CREATE TABLE IF NOT EXISTS public.sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. CHAT TABLES (Persistent AI Conversations)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New conversation',
  pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'complete',
  usage JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cases_user_id ON public.cases(user_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_case_events_case_id ON public.case_events(case_id);
CREATE INDEX IF NOT EXISTS idx_case_evidence_case_id ON public.case_evidence(case_id);
CREATE INDEX IF NOT EXISTS idx_agent_runs_case_id ON public.agent_runs(case_id);
CREATE INDEX IF NOT EXISTS idx_agent_actions_case_id ON public.agent_actions(case_id);
CREATE INDEX IF NOT EXISTS idx_consents_case_id ON public.consents(case_id);
CREATE INDEX IF NOT EXISTS idx_outcomes_case_id ON public.outcomes(case_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_sequences_user_id ON public.sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conv_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_msg_conv_id ON public.chat_messages(conversation_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequences ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Cases Policies (Allow users to see their cases + demo cases where user_id IS NULL)
CREATE POLICY "Users can view their cases or demo cases"
  ON public.cases FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own cases"
  ON public.cases FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own cases"
  ON public.cases FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own cases"
  ON public.cases FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Case Events Policies
CREATE POLICY "Users can view case events for their accessible cases"
  ON public.case_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

CREATE POLICY "Users can insert case events for their cases"
  ON public.case_events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- 4. Case Evidence Policies
CREATE POLICY "Users can view case evidence"
  ON public.case_evidence FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

CREATE POLICY "Users can insert case evidence"
  ON public.case_evidence FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- 5. Agent Runs Policies
CREATE POLICY "Users can view their agent runs"
  ON public.agent_runs FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their agent runs"
  ON public.agent_runs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 6. Agent Actions Policies
CREATE POLICY "Users can view agent actions"
  ON public.agent_actions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

CREATE POLICY "Users can insert agent actions"
  ON public.agent_actions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

CREATE POLICY "Users can update agent actions"
  ON public.agent_actions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- 7. Consents Policies
CREATE POLICY "Users can view consents"
  ON public.consents FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert/update consents"
  ON public.consents FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 8. Outcomes Policies
CREATE POLICY "Users can view outcomes"
  ON public.outcomes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

CREATE POLICY "Users can insert outcomes"
  ON public.outcomes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- 9. Campaigns Policies
CREATE POLICY "Users can manage their own campaigns"
  ON public.campaigns FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 10. Leads Policies
CREATE POLICY "Users can manage their own leads"
  ON public.leads FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 11. Templates Policies
CREATE POLICY "Users can manage their own templates"
  ON public.templates FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 12. Sequences Policies
CREATE POLICY "Users can manage their own sequences"
  ON public.sequences FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 13. Chat Policies
CREATE POLICY "Users can manage their chat conversations"
  ON public.chat_conversations FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage their chat messages"
  ON public.chat_messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.chat_conversations cc WHERE cc.id = conversation_id AND (cc.user_id = auth.uid() OR cc.user_id IS NULL)));

-- ============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS INSERT
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'is_onboarded')::boolean, FALSE)
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

