-- Enforce one open waiting room per host (run in Supabase SQL Editor)

-- Drop duplicate waiting rooms, keeping the newest per host.
delete from public.pvp_matches a
using public.pvp_matches b
where a.host_id = b.host_id
  and a.status = 'waiting'
  and a.guest_id is null
  and b.status = 'waiting'
  and b.guest_id is null
  and a.created_at < b.created_at;

create unique index if not exists pvp_one_waiting_room_per_host_idx
  on public.pvp_matches (host_id)
  where status = 'waiting' and guest_id is null;
