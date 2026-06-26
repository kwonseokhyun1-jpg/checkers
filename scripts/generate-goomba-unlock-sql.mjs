#!/usr/bin/env node
/**
 * Generates supabase/unlock_goomba_full.sql from current game catalogs.
 * Run: node scripts/generate-goomba-unlock-sql.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { getPlayableCards } from "../js/cardCatalog.js";
import { COSMETIC_ITEMS } from "../js/cosmetics.js";
import { MAGE_TITLES } from "../js/mageTitles.js";
import { ACHIEVEMENTS } from "../js/achievements.js";
import { ADVENTURE_LEVEL_COUNT } from "../js/adventure.js";

const TARGET_USERNAME = "goomba";
const GEMS = 10_000;
const FLAG = "adminFullUnlock_goomba_v1";

const collection = Object.fromEntries(
  getPlayableCards()
    .map((c) => c.id)
    .sort()
    .map((id) => [id, 3])
);

const owned = { avatar: [], frame: [], banner: [], pieceSkin: [] };
for (const item of COSMETIC_ITEMS) owned[item.type].push(item.id);

const cleared = {};
const stars = {};
for (let i = 1; i <= ADVENTURE_LEVEL_COUNT; i++) {
  cleared[String(i)] = true;
  stars[String(i)] = 3;
}

const patch = {
  gems: GEMS,
  collection,
  adventure: {
    highestUnlocked: ADVENTURE_LEVEL_COUNT,
    cleared,
    stars,
    selectedWorld: 1,
  },
  cosmetics: {
    owned,
    equipped: {
      avatar: owned.avatar[0],
      frame: owned.frame[0],
      banner: owned.banner[0],
      pieceSkin: owned.pieceSkin[0],
    },
    unlockedTitles: MAGE_TITLES.map((t) => t.id),
    equippedTitle: null,
  },
  achievements: {
    progress: Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a.target])),
    claimed: ACHIEVEMENTS.map((a) => a.id),
  },
  interactiveTutorialDone: true,
  metaTutorialDone: true,
  questsTutorialDone: true,
  [FLAG]: true,
};

const patchJson = JSON.stringify(patch, null, 2);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outPath = join(root, "supabase", "unlock_goomba_full.sql");

const sql = `-- Full unlock for user "${TARGET_USERNAME}" (run in Supabase SQL Editor)
-- Grants: ${Object.keys(collection).length} spells (3 copies each), all cosmetics + titles,
-- all ${ADVENTURE_LEVEL_COUNT} adventure stages cleared (3★), ${GEMS.toLocaleString()} gems.
-- Regenerate after catalog changes: node scripts/generate-goomba-unlock-sql.mjs

-- Preview target account
select id, username, display_name
from public.profiles
where lower(username) = lower('${TARGET_USERNAME}');

do $$
declare
  patch jsonb := $patch$${patchJson}$patch$::jsonb;
begin
  update public.profiles
  set
    profile_json = coalesce(profile_json, '{}'::jsonb)
      || patch
      || jsonb_build_object(
        'savedAt', (extract(epoch from now()) * 1000)::bigint
      ),
    updated_at = now()
  where lower(username) = lower('${TARGET_USERNAME}');

  if not found then
    raise exception 'No profile found for username: ${TARGET_USERNAME}';
  end if;
end $$;

-- Verify
select
  username,
  profile_json->'gems' as gems,
  jsonb_object_length(coalesce(profile_json->'collection', '{}')) as spell_types_owned,
  profile_json->'adventure'->'highestUnlocked' as highest_stage,
  (
    select count(*)::int
    from jsonb_each(coalesce(profile_json->'adventure'->'cleared', '{}'))
    where value::boolean = true
  ) as stages_cleared,
  jsonb_array_length(coalesce(profile_json->'cosmetics'->'owned'->'avatar', '[]')) as avatars_owned,
  jsonb_array_length(coalesce(profile_json->'cosmetics'->'unlockedTitles', '[]')) as titles_unlocked,
  coalesce((profile_json->>'${FLAG}')::boolean, false) as unlock_flag
from public.profiles
where lower(username) = lower('${TARGET_USERNAME}');
`;

writeFileSync(outPath, sql);
console.log(`Wrote ${outPath}`);
