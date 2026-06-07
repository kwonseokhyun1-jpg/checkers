-- Allow Classic Disc (default) skin matches; only block identical custom skins.
-- Run in Supabase SQL editor after migration_pvp_piece_skin.sql.

drop function if exists public.pvp_join_by_code(text, jsonb, text, jsonb);

create or replace function public.pvp_join_by_code(
  room_code text,
  guest_deck_ids jsonb,
  guest_display_name text,
  state_json jsonb,
  guest_piece_skin text default 'skin_classic'
)
returns public.pvp_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  rec public.pvp_matches;
  resolved_guest_skin text := coalesce(nullif(trim(guest_piece_skin), ''), 'skin_classic');
  resolved_host_skin text;
begin
  if uid is null then
    raise exception 'Sign in to join a room';
  end if;

  select * into rec
  from public.pvp_matches
  where code = upper(trim(room_code))
    and status = 'waiting'
    and guest_id is null
  for update;

  if not found then
    raise exception 'Room not found or already full.';
  end if;

  if rec.host_id = uid then
    raise exception 'You cannot join your own room';
  end if;

  resolved_host_skin := coalesce(nullif(trim(rec.host_piece_skin), ''), 'skin_classic');
  if resolved_host_skin = resolved_guest_skin and resolved_host_skin <> 'skin_classic' then
    raise exception 'You and the host have the same custom piece skin. Equip a different skin in Profile to join.';
  end if;

  update public.pvp_matches
  set
    guest_id = uid,
    guest_deck_ids = pvp_join_by_code.guest_deck_ids,
    guest_display_name = pvp_join_by_code.guest_display_name,
    guest_piece_skin = resolved_guest_skin,
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
