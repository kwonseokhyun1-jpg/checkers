-- Arcane Checkers — run in Supabase SQL Editor (project xhoskftcrgbsjkmzjscw)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  username_changed_at timestamptz,
  profile_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- PvP matches
create table if not exists public.pvp_matches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  host_id uuid not null references auth.users (id) on delete cascade,
  guest_id uuid references auth.users (id) on delete set null,
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  host_deck_ids jsonb,
  guest_deck_ids jsonb,
  host_display_name text,
  guest_display_name text,
  host_piece_skin text not null default 'skin_classic',
  guest_piece_skin text,
  state_json jsonb,
  turn text,
  version integer not null default 0,
  winner_id uuid references auth.users (id),
  match_mode text not null default 'normal' check (match_mode in ('normal', 'mystery')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pvp_matches_status_idx on public.pvp_matches (status);
create index if not exists pvp_matches_code_idx on public.pvp_matches (code);

alter table public.pvp_matches enable row level security;

create policy "pvp_select_participant_or_open"
  on public.pvp_matches for select
  to authenticated
  using (
    auth.uid() = host_id
    or auth.uid() = guest_id
    or (status = 'waiting' and guest_id is null)
  );

create policy "pvp_insert_host"
  on public.pvp_matches for insert
  with check (auth.uid() = host_id);

create policy "pvp_update_participant"
  on public.pvp_matches for update
  using (auth.uid() = host_id or auth.uid() = guest_id);

create policy "pvp_join_waiting"
  on public.pvp_matches for update
  using (status = 'waiting' and guest_id is null)
  with check (auth.uid() = guest_id);

-- Auto-create profile on sign-up (must not fail auth insert — see fix_signup_trigger.sql)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_username text;
  desired_display text;
  fallback_username text;
begin
  desired_username := nullif(trim(coalesce(new.raw_user_meta_data->>'username', '')), '');
  desired_display := nullif(trim(coalesce(new.raw_user_meta_data->>'display_name', '')), '');
  fallback_username := 'player_' || left(replace(new.id::text, '-', ''), 8);

  begin
    insert into public.profiles (id, display_name, username, profile_json)
    values (
      new.id,
      coalesce(desired_display, split_part(coalesce(new.email, ''), '@', 1)),
      coalesce(desired_username, fallback_username),
      jsonb_build_object('loginEmail', lower(coalesce(new.email, '')))
    );
  exception
    when unique_violation then
      insert into public.profiles (id, display_name, username, profile_json)
      values (
        new.id,
        coalesce(desired_display, split_part(coalesce(new.email, ''), '@', 1)),
        fallback_username,
        jsonb_build_object('loginEmail', lower(coalesce(new.email, '')))
      )
      on conflict (id) do nothing;
  end;

  return new;
end;
$$;

alter function public.handle_new_user() owner to postgres;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Realtime
alter publication supabase_realtime add table public.pvp_matches;

create policy "pvp_delete_host_waiting"
  on public.pvp_matches for delete
  using (auth.uid() = host_id and status = 'waiting');


-- Case-insensitive username availability (sign-up)
create or replace function public.username_is_available(name text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select not exists (
    select 1
    from public.profiles p
    where p.username is not null
      and lower(p.username) = lower(trim(name))
  );
$$;

grant execute on function public.username_is_available(text) to anon, authenticated;

-- Resolve username or email for password sign-in (client calls before signInWithPassword)
create or replace function public.email_for_login(identifier text)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select u.email::text
  from auth.users u
  left join public.profiles p on p.id = u.id
  where lower(u.email) = lower(identifier)
     or lower(p.username) = lower(identifier)
  limit 1;
$$;

grant execute on function public.email_for_login(text) to anon, authenticated;

-- PvP join RPCs (bypass RLS for room discovery; work even before SELECT policy is fixed)
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

  resolved_host_skin := coalesce(nullif(trim(rec.host_piece_skin), ''), 'skin_classic');
  if resolved_host_skin = resolved_guest_skin then
    raise exception 'You and the host have the same piece skin. Equip a different skin in Profile to join.';
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

grant execute on function public.pvp_join_by_code(text, jsonb, text, jsonb, text) to authenticated;

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
