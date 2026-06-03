-- Run in Supabase SQL Editor if PvP join / quick match fails with "Room not found"
-- https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

drop policy if exists "pvp_select_participant" on public.pvp_matches;
drop policy if exists "pvp_select_participant_or_open" on public.pvp_matches;

create policy "pvp_select_participant_or_open"
  on public.pvp_matches for select
  to authenticated
  using (
    auth.uid() = host_id
    or auth.uid() = guest_id
    or (status = 'waiting' and guest_id is null)
  );

-- Ensure Realtime publishes match updates (skip if already added)
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'pvp_matches'
  ) then
    alter publication supabase_realtime add table public.pvp_matches;
  end if;
end $$;

-- RPC fallbacks (work even before SELECT policy is fixed)
create or replace function public.pvp_find_waiting_room()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select code
  from public.pvp_matches
  where status = 'waiting'
    and guest_id is null
    and host_id <> auth.uid()
  order by created_at asc
  limit 1;
$$;

grant execute on function public.pvp_find_waiting_room() to authenticated;

create or replace function public.pvp_join_by_code(
  room_code text,
  guest_deck_ids jsonb,
  guest_display_name text,
  state_json jsonb
)
returns public.pvp_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  rec public.pvp_matches;
begin
  if uid is null then
    raise exception 'Sign in to join a room';
  end if;

  select * into rec
  from public.pvp_matches
  where upper(trim(code)) = upper(trim(room_code))
    and status = 'waiting'
    and guest_id is null
  for update;

  if not found then
    raise exception 'Room not found or already full';
  end if;
  if rec.host_id = uid then
    raise exception 'You cannot join your own room';
  end if;

  update public.pvp_matches
  set
    guest_id = uid,
    guest_deck_ids = pvp_join_by_code.guest_deck_ids,
    guest_display_name = pvp_join_by_code.guest_display_name,
    status = 'active',
    state_json = coalesce(pvp_join_by_code.state_json, rec.state_json),
    turn = 'red',
    version = 1,
    updated_at = now()
  where id = rec.id
  returning * into rec;

  return rec;
end;
$$;

grant execute on function public.pvp_join_by_code(text, jsonb, text, jsonb) to authenticated;

create or replace function public.pvp_list_open_rooms()
returns table (
  id uuid,
  host_id uuid,
  host_display_name text,
  created_at timestamptz,
  status text,
  guest_id uuid
)
language sql
security definer
stable
set search_path = public
as $$
  select id, host_id, host_display_name, created_at, status, guest_id
  from public.pvp_matches
  where status = 'waiting'
    and guest_id is null
    and host_id <> auth.uid()
  order by created_at desc
  limit 30;
$$;

grant execute on function public.pvp_list_open_rooms() to authenticated;

create or replace function public.pvp_join_by_id(
  p_match_id uuid,
  guest_deck_ids jsonb,
  guest_display_name text
)
returns public.pvp_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  rec public.pvp_matches;
begin
  if uid is null then
    raise exception 'Sign in to join a room';
  end if;

  select * into rec
  from public.pvp_matches
  where id = p_match_id
    and status = 'waiting'
    and guest_id is null
  for update;

  if not found then
    raise exception 'Room not found or already full';
  end if;
  if rec.host_id = uid then
    raise exception 'You cannot join your own room';
  end if;

  update public.pvp_matches
  set
    guest_id = uid,
    guest_deck_ids = pvp_join_by_id.guest_deck_ids,
    guest_display_name = pvp_join_by_id.guest_display_name,
    status = 'active',
    turn = 'red',
    version = 1,
    updated_at = now()
  where id = rec.id
  returning * into rec;

  return rec;
end;
$$;

grant execute on function public.pvp_join_by_id(uuid, jsonb, text) to authenticated;

-- Cancel a waiting room you host (works even if DELETE policy is misconfigured)
create or replace function public.pvp_cancel_room(p_match_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in to cancel a room';
  end if;

  delete from public.pvp_matches
  where id = p_match_id
    and host_id = auth.uid()
    and status = 'waiting'
    and guest_id is null;

  if not found then
    raise exception 'Room not found or cannot be cancelled';
  end if;
end;
$$;

grant execute on function public.pvp_cancel_room(uuid) to authenticated;

-- One-time maintenance: remove all open waiting rooms (run in SQL Editor or via app RPC)
create or replace function public.pvp_clear_all_waiting_rooms()
returns integer
language sql
security definer
set search_path = public
as $$
  with deleted as (
    delete from public.pvp_matches
    where status = 'waiting' and guest_id is null
    returning id
  )
  select count(*)::integer from deleted;
$$;

grant execute on function public.pvp_clear_all_waiting_rooms() to authenticated;
