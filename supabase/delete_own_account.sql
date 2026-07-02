-- Self-service account deletion (GDPR / Play data safety).
-- Run in Supabase SQL Editor after schema.sql.
-- Deletes auth.users row for the caller; profiles and hosted waiting rooms cascade.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Sign in to delete your account';
  end if;

  delete from public.pvp_matches
  where host_id = uid
    and status = 'waiting'
    and guest_id is null;

  delete from auth.users where id = uid;
end;
$$;

alter function public.delete_own_account() owner to postgres;

grant execute on function public.delete_own_account() to authenticated;
