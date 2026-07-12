-- Friend requests + mutual friendship on accept.
-- Run in Supabase SQL Editor after schema.sql.

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users (id) on delete cascade,
  to_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friend_requests_no_self check (from_user_id <> to_user_id)
);

create index if not exists friend_requests_to_pending_idx
  on public.friend_requests (to_user_id, created_at desc)
  where status = 'pending';

create index if not exists friend_requests_from_pending_idx
  on public.friend_requests (from_user_id, created_at desc)
  where status = 'pending';

create unique index if not exists friend_requests_pending_pair_idx
  on public.friend_requests (from_user_id, to_user_id)
  where status = 'pending';

alter table public.friend_requests enable row level security;

create policy "friend_requests_select_participant"
  on public.friend_requests for select
  to authenticated
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "friend_requests_insert_sender"
  on public.friend_requests for insert
  to authenticated
  with check (auth.uid() = from_user_id and status = 'pending');

create policy "friend_requests_update_participant"
  on public.friend_requests for update
  to authenticated
  using (auth.uid() = from_user_id or auth.uid() = to_user_id)
  with check (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- Append friend_id to a user's profile_json.friends array (deduped).
create or replace function public.append_profile_friend(user_id uuid, friend_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_friends jsonb;
  next_friends jsonb;
begin
  if user_id is null or friend_id is null or user_id = friend_id then
    return;
  end if;

  select coalesce(profile_json->'friends', '[]'::jsonb)
  into current_friends
  from public.profiles
  where id = user_id
  for update;

  if not found then
    return;
  end if;

  if current_friends @> to_jsonb(friend_id::text) then
    return;
  end if;

  next_friends := current_friends || to_jsonb(friend_id::text);

  update public.profiles
  set
    profile_json = jsonb_set(coalesce(profile_json, '{}'::jsonb), '{friends}', next_friends),
    updated_at = now()
  where id = user_id;
end;
$$;

alter function public.append_profile_friend(uuid, uuid) owner to postgres;

create or replace function public.accept_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  req public.friend_requests;
begin
  if uid is null then
    raise exception 'Sign in to accept friend requests';
  end if;

  select * into req
  from public.friend_requests
  where id = request_id
    and status = 'pending'
    and to_user_id = uid
  for update;

  if not found then
    raise exception 'Friend request not found or already handled';
  end if;

  update public.friend_requests
  set status = 'accepted', updated_at = now()
  where id = request_id;

  update public.friend_requests
  set status = 'cancelled', updated_at = now()
  where status = 'pending'
    and from_user_id = req.to_user_id
    and to_user_id = req.from_user_id;

  perform public.append_profile_friend(req.from_user_id, req.to_user_id);
  perform public.append_profile_friend(req.to_user_id, req.from_user_id);
end;
$$;

alter function public.accept_friend_request(uuid) owner to postgres;

grant execute on function public.accept_friend_request(uuid) to authenticated;
