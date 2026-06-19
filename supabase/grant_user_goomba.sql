-- Grant user "goomba" 10,000 gems and clear all 50 Adventure stages.
-- Run once in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new

update public.profiles
set
  profile_json = coalesce(profile_json, '{}'::jsonb)
    || jsonb_build_object(
      'gems', 10000,
      'savedAt', (extract(epoch from now()) * 1000)::bigint,
      'adventure', coalesce(profile_json->'adventure', '{}'::jsonb)
        || jsonb_build_object(
          'highestUnlocked', 50,
          'cleared', (
            select jsonb_object_agg(i::text, 'true'::jsonb)
            from generate_series(1, 50) as g(i)
          ),
          'stars', (
            select jsonb_object_agg(i::text, to_jsonb(3))
            from generate_series(1, 50) as g(i)
          )
        )
    ),
  updated_at = now()
where lower(username) = 'goomba'
returning
  username,
  profile_json->'gems' as gems,
  jsonb_object_length(profile_json->'adventure'->'cleared') as cleared_count;
