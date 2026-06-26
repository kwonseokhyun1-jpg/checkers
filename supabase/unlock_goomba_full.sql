-- Full unlock for user "goomba" (run in Supabase SQL Editor)
-- Grants: 84 spells (3 copies each), all cosmetics + titles,
-- all 50 adventure stages cleared (3★), 10,000 gems.
-- Regenerate after catalog changes: node scripts/generate-goomba-unlock-sql.mjs

-- Preview target account
select id, username, display_name
from public.profiles
where lower(username) = lower('goomba');

do $$
declare
  patch jsonb := $patch${
  "gems": 10000,
  "collection": {
    "aegis": 3,
    "anchor": 3,
    "backpedal": 3,
    "backrank_protection": 3,
    "backstab": 3,
    "backstep": 3,
    "barrier": 3,
    "berserk": 3,
    "bishops_mark": 3,
    "blind": 3,
    "blizzard": 3,
    "bomb": 3,
    "bounty": 3,
    "bulwark": 3,
    "call_forward": 3,
    "chain_lightning": 3,
    "clone": 3,
    "coin_flip": 3,
    "collapse": 3,
    "confusion": 3,
    "constitution": 3,
    "counterspell": 3,
    "create_foe": 3,
    "crown": 3,
    "cryo_bolt": 3,
    "cull": 3,
    "darkness": 3,
    "dash": 3,
    "deep_freeze": 3,
    "deflect": 3,
    "demote": 3,
    "deport": 3,
    "displacement": 3,
    "dominion": 3,
    "duel": 3,
    "earthquake": 3,
    "execution": 3,
    "fusion": 3,
    "hibernation": 3,
    "hostile_swap": 3,
    "ignore": 3,
    "iron_will": 3,
    "landmine": 3,
    "last_king": 3,
    "last_stand": 3,
    "leapfrog": 3,
    "link_fate": 3,
    "long_step": 3,
    "magnet": 3,
    "mind_control": 3,
    "nudge": 3,
    "offering": 3,
    "panic": 3,
    "plague": 3,
    "poison": 3,
    "press": 3,
    "purify": 3,
    "pyromancy": 3,
    "quick_march": 3,
    "quicksand": 3,
    "rally": 3,
    "random_teleport": 3,
    "recall": 3,
    "repel": 3,
    "retreat": 3,
    "revive": 3,
    "rooks_mark": 3,
    "root": 3,
    "sacrifice": 3,
    "sanctuary": 3,
    "scatter": 3,
    "shadow_swap": 3,
    "shatter": 3,
    "shockwave": 3,
    "sidestep": 3,
    "snipe": 3,
    "snowball": 3,
    "stab": 3,
    "stall": 3,
    "tangle": 3,
    "teleport": 3,
    "trickster": 3,
    "vengeance": 3,
    "ward": 3
  },
  "adventure": {
    "highestUnlocked": 50,
    "cleared": {
      "1": true,
      "2": true,
      "3": true,
      "4": true,
      "5": true,
      "6": true,
      "7": true,
      "8": true,
      "9": true,
      "10": true,
      "11": true,
      "12": true,
      "13": true,
      "14": true,
      "15": true,
      "16": true,
      "17": true,
      "18": true,
      "19": true,
      "20": true,
      "21": true,
      "22": true,
      "23": true,
      "24": true,
      "25": true,
      "26": true,
      "27": true,
      "28": true,
      "29": true,
      "30": true,
      "31": true,
      "32": true,
      "33": true,
      "34": true,
      "35": true,
      "36": true,
      "37": true,
      "38": true,
      "39": true,
      "40": true,
      "41": true,
      "42": true,
      "43": true,
      "44": true,
      "45": true,
      "46": true,
      "47": true,
      "48": true,
      "49": true,
      "50": true
    },
    "stars": {
      "1": 3,
      "2": 3,
      "3": 3,
      "4": 3,
      "5": 3,
      "6": 3,
      "7": 3,
      "8": 3,
      "9": 3,
      "10": 3,
      "11": 3,
      "12": 3,
      "13": 3,
      "14": 3,
      "15": 3,
      "16": 3,
      "17": 3,
      "18": 3,
      "19": 3,
      "20": 3,
      "21": 3,
      "22": 3,
      "23": 3,
      "24": 3,
      "25": 3,
      "26": 3,
      "27": 3,
      "28": 3,
      "29": 3,
      "30": 3,
      "31": 3,
      "32": 3,
      "33": 3,
      "34": 3,
      "35": 3,
      "36": 3,
      "37": 3,
      "38": 3,
      "39": 3,
      "40": 3,
      "41": 3,
      "42": 3,
      "43": 3,
      "44": 3,
      "45": 3,
      "46": 3,
      "47": 3,
      "48": 3,
      "49": 3,
      "50": 3
    },
    "selectedWorld": 1
  },
  "cosmetics": {
    "owned": {
      "avatar": [
        "avatar_default",
        "avatar_mystic",
        "avatar_shadow",
        "avatar_sun",
        "avatar_void",
        "avatar_scout",
        "avatar_crystal",
        "avatar_moon",
        "avatar_flame",
        "avatar_cosmos"
      ],
      "frame": [
        "frame_default",
        "frame_bronze",
        "frame_silver",
        "frame_gold",
        "frame_legend",
        "frame_oak",
        "frame_emerald",
        "frame_sapphire",
        "frame_ruby",
        "frame_crown"
      ],
      "banner": [
        "banner_default",
        "banner_nebula",
        "banner_crimson",
        "banner_storm",
        "banner_aurora",
        "banner_forest",
        "banner_sunset",
        "banner_midnight",
        "banner_ocean",
        "banner_eclipse"
      ],
      "pieceSkin": [
        "skin_classic",
        "skin_ember",
        "skin_frost",
        "skin_arcane",
        "skin_void",
        "skin_wood",
        "skin_moss",
        "skin_jade",
        "skin_solar",
        "skin_prism"
      ]
    },
    "equipped": {
      "avatar": "avatar_default",
      "frame": "frame_default",
      "banner": "banner_default",
      "pieceSkin": "skin_classic"
    },
    "unlockedTitles": [
      "title_stormborn",
      "title_tactician",
      "title_survivor",
      "title_decimator",
      "title_undefeated",
      "title_winters_wrath",
      "title_dynast",
      "title_puppeteer",
      "title_trapper",
      "title_executioner",
      "title_grand_magus",
      "title_champion",
      "title_explorer"
    ],
    "equippedTitle": null
  },
  "achievements": {
    "progress": {
      "storm_summoner": 25,
      "calculated_sacrifice": 5,
      "close_call": 1,
      "magical_sweep": 1,
      "no_mercy": 1,
      "frozen_hearth": 1,
      "royal_fleet": 1,
      "mind_bender": 10,
      "silent_assassin": 15,
      "executioner": 50,
      "arcane_mastery": 50,
      "champion": 100,
      "explorer": 10
    },
    "claimed": [
      "storm_summoner",
      "calculated_sacrifice",
      "close_call",
      "magical_sweep",
      "no_mercy",
      "frozen_hearth",
      "royal_fleet",
      "mind_bender",
      "silent_assassin",
      "executioner",
      "arcane_mastery",
      "champion",
      "explorer"
    ]
  },
  "interactiveTutorialDone": true,
  "metaTutorialDone": true,
  "questsTutorialDone": true,
  "adminFullUnlock_goomba_v1": true
}$patch$::jsonb;
begin
  update public.profiles
  set
    profile_json = coalesce(profile_json, '{}'::jsonb)
      || patch
      || jsonb_build_object(
        'savedAt', (extract(epoch from now()) * 1000)::bigint
      ),
    updated_at = now()
  where lower(username) = lower('goomba');

  if not found then
    raise exception 'No profile found for username: goomba';
  end if;
end $$;

-- Verify
select
  username,
  profile_json->'gems' as gems,
  (
    select count(*)::int
    from jsonb_each(coalesce(profile_json->'collection', '{}'))
  ) as spell_types_owned,
  profile_json->'adventure'->'highestUnlocked' as highest_stage,
  (
    select count(*)::int
    from jsonb_each(coalesce(profile_json->'adventure'->'cleared', '{}'))
    where value::boolean = true
  ) as stages_cleared,
  jsonb_array_length(coalesce(profile_json->'cosmetics'->'owned'->'avatar', '[]')) as avatars_owned,
  jsonb_array_length(coalesce(profile_json->'cosmetics'->'unlockedTitles', '[]')) as titles_unlocked,
  coalesce((profile_json->>'adminFullUnlock_goomba_v1')::boolean, false) as unlock_flag
from public.profiles
where lower(username) = lower('goomba');
