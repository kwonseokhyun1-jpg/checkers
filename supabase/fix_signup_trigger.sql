-- Run once in Supabase SQL Editor if sign-up returns "Database error saving new user"
-- https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

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
    insert into public.profiles (id, display_name, username)
    values (
      new.id,
      coalesce(desired_display, split_part(coalesce(new.email, ''), '@', 1)),
      coalesce(desired_username, fallback_username)
    );
  exception
    when unique_violation then
      insert into public.profiles (id, display_name, username)
      values (
        new.id,
        coalesce(desired_display, split_part(coalesce(new.email, ''), '@', 1)),
        fallback_username
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
