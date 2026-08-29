-- ============================================================================
-- THE KEN CASE COMPETITION 2026 — OUTREACHAI UNSTOP MASTER DATABASE SCHEMA
-- ============================================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked with auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  phone text,
  company text,
  city text,
  state text,
  country text default 'India',
  preferred_language text default 'en',
  occupation text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. CASES TABLE
create table if not exists public.cases (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  merchant text not null,
  order_id text,
  amount numeric(12,2),
  category text not null,
  priority text default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Urgent')),
  status text default 'Intake' check (status in ('Intake', 'Analyzing', 'Pending Approval', 'Executing', 'Awaiting Response', 'Resolved', 'Failed')),
  user_goal text not null,
  summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. CASE EVENTS & AUDIT LOGS
create table if not exists public.case_events (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  event_type text not null,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4. EVIDENCE HUB
create table if not exists public.case_evidence (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  source text not null,
  claim text not null,
  confidence numeric(5,2) check (confidence >= 0 and confidence <= 100),
  classification text not null check (classification in ('REAL', 'SIMULATED', 'DEMO', 'HYPOTHESIS', 'VALIDATED')),
  file_url text,
  created_at timestamptz default now()
);

-- 5. AGENT RUNS & ACTIONS (Human-in-the-Loop)
create table if not exists public.agent_actions (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.cases on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  rail text check (rail in ('DELHIVERY', 'PINE_LABS', 'GNANI', 'INTERNAL', 'COMMUNICATION')),
  action_name text not null,
  status text default 'Queued' check (status in ('Queued', 'Running', 'Needs Approval', 'Approved', 'Rejected', 'Completed', 'Failed')),
  risk_level text default 'Low' check (risk_level in ('Low', 'Medium', 'High', 'Financial')),
  payload jsonb default '{}'::jsonb,
  execution_result jsonb,
  requires_approval boolean default false,
  approval_timestamp timestamptz,
  created_at timestamptz default now()
);

-- 6. CRM & COUNTERPARTIES (Leads)
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  category text not null,
  contact_email text,
  contact_phone text,
  pipeline_stage text default 'New' check (pipeline_stage in ('New', 'Investigating', 'Contacted', 'Escalated', 'Awaiting Response', 'Resolved')),
  resolution_rate numeric(5,2) default 0.0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 7. TEMPLATES
create table if not exists public.templates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text not null,
  content text not null,
  variables text[] default array[]::text[],
  created_at timestamptz default now()
);

-- 8. SEQUENCES (Escalation Workflows)
create table if not exists public.sequences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  is_active boolean default true,
  steps jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 9. CHAT CONVERSATIONS & MESSAGES
create table if not exists public.chat_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  case_id uuid references public.cases on delete cascade,
  title text default 'Dispute Advisory',
  created_at timestamptz default now()
);

create table if not exists public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.chat_conversations on delete cascade not null,
  sender text check (sender in ('user', 'assistant', 'system')) not null,
  content text not null,
  provider text,
  created_at timestamptz default now()
);

-- PROFILE AUTO-CREATION TRIGGER
create or replace function public.handle_new_user()
returns trigger as $$ 
begin   
  insert into public.profiles (id, email, name, avatar_url)   
  values (     
    new.id,     
    new.email,     
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),     
    new.raw_user_meta_data->>'avatar_url'   
  )   
  on conflict (id) do update set
    name = coalesce(excluded.name, profiles.name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new; 
end; 
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ROW LEVEL SECURITY ACTIVATION
alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_events enable row level security;
alter table public.case_evidence enable row level security;
alter table public.agent_actions enable row level security;
alter table public.leads enable row level security;
alter table public.templates enable row level security;
alter table public.sequences enable row level security;
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;

-- RLS ISOLATION POLICIES
drop policy if exists "User owns profile" on public.profiles;
create policy "User owns profile" on public.profiles for all using (auth.uid() = id);

drop policy if exists "User owns cases" on public.cases;
create policy "User owns cases" on public.cases for all using (auth.uid() = user_id);

drop policy if exists "User owns events" on public.case_events;
create policy "User owns events" on public.case_events for all using (auth.uid() = user_id);

drop policy if exists "User owns evidence" on public.case_evidence;
create policy "User owns evidence" on public.case_evidence for all using (auth.uid() = user_id);

drop policy if exists "User owns agent actions" on public.agent_actions;
create policy "User owns agent actions" on public.agent_actions for all using (auth.uid() = user_id);

drop policy if exists "User owns leads" on public.leads;
create policy "User owns leads" on public.leads for all using (auth.uid() = user_id);

drop policy if exists "User owns templates" on public.templates;
create policy "User owns templates" on public.templates for all using (auth.uid() = user_id);

drop policy if exists "User owns sequences" on public.sequences;
create policy "User owns sequences" on public.sequences for all using (auth.uid() = user_id);

drop policy if exists "User owns conversations" on public.chat_conversations;
create policy "User owns conversations" on public.chat_conversations for all using (auth.uid() = user_id);

drop policy if exists "User owns messages" on public.chat_messages;
create policy "User owns messages" on public.chat_messages for all using (
  conversation_id in (select id from public.chat_conversations where user_id = auth.uid())
);

