-- Run in Supabase SQL Editor: username change cooldown support
alter table public.profiles
  add column if not exists username_changed_at timestamptz;
