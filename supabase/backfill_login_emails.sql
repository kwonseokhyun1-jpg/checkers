-- Run once so username sign-in works for existing accounts
update public.profiles p
set profile_json = coalesce(p.profile_json, '{}'::jsonb) || jsonb_build_object('loginEmail', lower(u.email))
from auth.users u
where p.id = u.id
  and u.email is not null
  and (
    p.profile_json is null
    or not (coalesce(p.profile_json, '{}'::jsonb) ? 'loginEmail')
    or nullif(trim(p.profile_json->>'loginEmail'), '') is null
  );
