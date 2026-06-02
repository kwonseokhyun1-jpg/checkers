-- Run this in Supabase SQL Editor if username sign-in fails (404 on email_for_login).
-- Dashboard: https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

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
