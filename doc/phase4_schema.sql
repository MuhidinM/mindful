-- Phase 4 schema (hardcoded app auth, no user table dependency)
create extension if not exists pgcrypto;

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text not null check (color in ('Teal', 'Coral')),
  created_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  date date not null,
  fajr boolean not null default false,
  dhuhr boolean not null default false,
  asr boolean not null default false,
  maghrib boolean not null default false,
  isha boolean not null default false,
  quran boolean not null default false,
  peaceful_day boolean not null default false,
  created_at timestamptz not null default now(),
  unique (child_id, date)
);

create table if not exists public.redemptions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  amount numeric(10, 2) not null check (amount > 0),
  date timestamptz not null default now()
);

alter table public.children enable row level security;
alter table public.daily_logs enable row level security;
alter table public.redemptions enable row level security;

drop policy if exists "children_public_all" on public.children;
create policy "children_public_all"
  on public.children for all
  using (true)
  with check (true);

drop policy if exists "daily_logs_public_all" on public.daily_logs;
create policy "daily_logs_public_all"
  on public.daily_logs for all
  using (true)
  with check (true);

drop policy if exists "redemptions_public_all" on public.redemptions;
create policy "redemptions_public_all"
  on public.redemptions for all
  using (true)
  with check (true);

insert into public.children (name, color)
select 'Child 1', 'Teal'
where not exists (select 1 from public.children where color = 'Teal');

insert into public.children (name, color)
select 'Child 2', 'Coral'
where not exists (select 1 from public.children where color = 'Coral');
