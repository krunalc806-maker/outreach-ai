-- Omnexa AI ecosystem: workspace memory, document index, tasks, and agent-run audit trail.
-- Apply after the existing master schema migration.

create table if not exists public.workspaces (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_items (
  id uuid primary key default uuid_generate_v4(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.workspace_items(id) on delete cascade,
  kind text not null check (kind in ('folder', 'note', 'document', 'task')),
  title text not null,
  body text,
  storage_path text,
  mime_type text,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memory_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  case_id uuid references public.cases(id) on delete cascade,
  scope text not null check (scope in ('conversation', 'workspace', 'case')),
  content text not null,
  tags text[] not null default '{}',
  importance numeric(3,2) not null default 0.5 check (importance between 0 and 1),
  created_at timestamptz not null default now()
);

create table if not exists public.agent_runs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  agent_id text not null check (agent_id in ('research', 'coding', 'document', 'marketing', 'email', 'automation', 'data-analysis')),
  task text not null,
  status text not null default 'context_prepared' check (status in ('context_prepared', 'running', 'awaiting_approval', 'completed', 'failed', 'cancelled')),
  context_summary text,
  output jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.document_chunks (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null references public.workspace_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  page_number integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.workspace_items enable row level security;
alter table public.memory_records enable row level security;
alter table public.agent_runs enable row level security;
alter table public.document_chunks enable row level security;

create policy "Users own workspaces" on public.workspaces for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own workspace items" on public.workspace_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own memory" on public.memory_records for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own agent runs" on public.agent_runs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own document chunks" on public.document_chunks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists memory_records_retrieval_idx on public.memory_records(user_id, workspace_id, created_at desc);
create index if not exists workspace_items_lookup_idx on public.workspace_items(workspace_id, parent_id, updated_at desc);
create index if not exists document_chunks_item_idx on public.document_chunks(item_id, page_number);
