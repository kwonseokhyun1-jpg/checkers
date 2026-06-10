-- Ensure Realtime UPDATE payloads include every column (state_json, version, turn).
-- Run in Supabase SQL Editor if PvP moves stop syncing for the opponent.
alter table public.pvp_matches replica identity full;
