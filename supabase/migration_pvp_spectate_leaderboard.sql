-- PvP spectate + global leaderboard
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

-- Allow authenticated users to read active matches for spectating
drop policy if exists "pvp_select_active_spectate" on public.pvp_matches;

create policy "pvp_select_active_spectate"
  on public.pvp_matches for select
  to authenticated
  using (status = 'active' and guest_id is not null);

-- Global PvP leaderboard ranked by profile_json.pvpWins
create or replace function public.pvp_leaderboard(p_limit int default 50)
returns table (
  id uuid,
  username text,
  display_name text,
  pvp_wins int
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.display_name,
    greatest(coalesce((p.profile_json->>'pvpWins')::int, 0), 0) as pvp_wins
  from public.profiles p
  where coalesce((p.profile_json->>'pvpWins')::int, 0) > 0
  order by pvp_wins desc, coalesce(p.username, p.display_name, '') asc
  limit greatest(1, least(coalesce(p_limit, 50), 100));
$$;

grant execute on function public.pvp_leaderboard(int) to authenticated;
