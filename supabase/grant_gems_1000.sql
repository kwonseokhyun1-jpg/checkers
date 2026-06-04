-- Grant +1000 gems to every player profile (run once in Supabase SQL Editor)
update public.profiles
set
  profile_json = coalesce(profile_json, '{}'::jsonb)
    || jsonb_build_object(
      'gems',
      coalesce((profile_json->>'gems')::integer, 0) + 1000,
      'gemsGrant1000_v1',
      true
    ),
  updated_at = now()
where coalesce((profile_json->>'gemsGrant1000_v1')::boolean, false) is distinct from true;
