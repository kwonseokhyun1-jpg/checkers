-- Wipe all open PvP waiting rooms (run once in SQL Editor)
-- https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

delete from public.pvp_matches
where status = 'waiting' and guest_id is null;
