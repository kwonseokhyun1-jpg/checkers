-- Mystery Mode for PvP: random decks, no collection requirement.
-- Run in Supabase SQL editor after deploying the client update.

alter table public.pvp_matches
  add column if not exists mode text not null default 'standard'
  check (mode in ('standard', 'mystery'));
