-- Mystery Mode for PvP. Column is match_mode (not "mode" — PostgreSQL/PostgREST treat mode as an aggregate).

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'pvp_matches' and column_name = 'mode'
  ) then
    alter table public.pvp_matches add column if not exists match_mode text;
    update public.pvp_matches
      set match_mode = case when mode = 'mystery' then 'mystery' else 'normal' end
      where match_mode is null;
    alter table public.pvp_matches drop column mode;
  end if;
end $$;

alter table public.pvp_matches
  add column if not exists match_mode text not null default 'normal';

update public.pvp_matches
  set match_mode = 'normal'
  where match_mode is null or match_mode = 'standard';

alter table public.pvp_matches alter column match_mode set default 'normal';

alter table public.pvp_matches drop constraint if exists pvp_matches_match_mode_check;
alter table public.pvp_matches
  add constraint pvp_matches_match_mode_check check (match_mode in ('normal', 'mystery'));

notify pgrst, 'reload schema';
