/**
 * Adventure — 5 worlds × 10 stages (50 total). Worlds 4–5 unlock after clearing stage 30.
 */
import {
  getPlayableCards,
  getCardDef,
  DECK_SIZE,
  maxCopiesForCard,
  maxCopiesForRarity,
  MAX_COPIES_PER_CARD,
} from "./cardCatalog.js";
import { countById, shuffle } from "./deckRules.js";

export const ADVENTURE_LEVEL_COUNT = 50;
export const LEVELS_PER_WORLD = 10;
export const ADVENTURE_FIRST_CLEAR_GEMS = 50;
export const ADVENTURE_REPEAT_CLEAR_GEMS = 20;
export const ENEMY_DECK_GENERATION = 5;
export const BONUS_WORLDS_UNLOCK_AT_LEVEL = 30;
const EARLY_COPIES_PER_CARD = 3;

export const WORLDS = [
  {
    id: 1,
    name: "Verdant Accord",
    tagline: "Meadows and training grounds — commons and uncommons rule the field.",
    theme: "verdant",
    levelStart: 1,
    levelEnd: 10,
    requiresClearLevel: null,
  },
  {
    id: 2,
    name: "Frost Expanse",
    tagline: "Ice bridges and frozen shrines — rarer spells begin to appear.",
    theme: "frost",
    levelStart: 11,
    levelEnd: 20,
    requiresClearLevel: null,
  },
  {
    id: 3,
    name: "Ember Depths",
    tagline: "Volcanic keeps and ash storms — hardened duelists await.",
    theme: "ember",
    levelStart: 21,
    levelEnd: 30,
    requiresClearLevel: null,
  },
  {
    id: 4,
    name: "Void Threshold",
    tagline: "Unlocked after stage 30 — reality frays; elite magic only.",
    theme: "void",
    levelStart: 31,
    levelEnd: 40,
    requiresClearLevel: BONUS_WORLDS_UNLOCK_AT_LEVEL,
  },
  {
    id: 5,
    name: "Legend's End",
    tagline: "Epic and legendary spells alone — the final proving ground.",
    theme: "legend",
    levelStart: 41,
    levelEnd: 50,
    requiresClearLevel: BONUS_WORLDS_UNLOCK_AT_LEVEL,
  },
];

const WORLD_OPPONENTS = {
  1: [
    "Novice Adept", "Ember Scout", "Frost Acolyte", "Stone Sentinel", "Mist Binder",
    "Iron Warden", "Ash Magus", "Void Pilgrim", "Crystal Hexer", "Storm Herald",
  ],
  2: [
    "Dusk Raider", "Pale Duelist", "Rune Thief", "Gloom Archer", "Blade Chanter",
    "Obsidian Knight", "Silver Oracle", "Cinder Warlock", "Hollow Crown", "Night Stalker",
  ],
  3: [
    "Blood Monolith", "Starfall Sage", "Grave Warden", "Thunder Regent", "Abyss Marshal",
    "Sunless King", "Doom Cartographer", "Eclipse Tyrant", "Worldbreaker", "Archlich Ophelia",
  ],
  4: [
    "Void Harrower", "Rift Stalker", "Null Chanter", "Phase Reaver", "Entropy Knight",
    "Axiom Breaker", "Shard Assassin", "Chrono Warden", "Mirage Sovereign", "Oblivion Herald",
  ],
  5: [
    "Crown of Cinders", "Heir of Storms", "The Gilded Oath", "Sundered Archon", "Mythwright",
    "Pale Imperator", "Dragon-Saint Alar", "Queen of Embers", "Lord of the Last Rite", "The Unbound Sigil",
  ],
};

const WORLD_FLAVOR = {
  1: [
    "Training grounds", "Woodland outpost", "Moss bridge", "Quarry ruins", "Swamp shrine",
    "Mountain pass", "Verdant flats", "Hollow tree", "Crystal brook", "Storm meadow",
  ],
  2: [
    "Frozen bridge", "Ice cathedral", "Glacier pass", "Snowfield duel", "Frost mine",
    "Permafrost gate", "Blizzard span", "Shiver keep", "Hoarfrost gate", "Aurora cliff",
  ],
  3: [
    "Volcanic flats", "Magma shrine", "Ash citadel", "Cinder quarry", "Ember hall",
    "Molten gate", "Scorched arena", "Fireline pass", "Basalt throne", "World's furnace",
  ],
  4: [
    "Null horizon", "Fractured causeway", "Void amphitheater", "Rift courtyard", "Entropy spire",
    "Phase labyrinth", "Mirror wasteland", "Singularity gate", "Unmaking dais", "Threshold nexus",
  ],
  5: [
    "Epic crucible I", "Epic crucible II", "Legend approach", "Legend gauntlet", "Sovereign path",
    "Mythic stair", "Crown bridge", "Final stage", "Sundered apex", "Legend's End",
  ],
};

export function getWorldForLevel(levelNum) {
  return WORLDS.find((w) => levelNum >= w.levelStart && levelNum <= w.levelEnd) || WORLDS[0];
}

export function areBonusWorldsUnlocked(progress) {
  return isLevelCleared(progress, BONUS_WORLDS_UNLOCK_AT_LEVEL);
}

export function isWorldUnlocked(progress, worldId) {
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return false;
  if (world.requiresClearLevel != null) return areBonusWorldsUnlocked(progress);
  return true;
}

export function getWorldsForMap(progress) {
  return WORLDS.filter((w) => isWorldUnlocked(progress, w.id));
}

function stageInWorld(levelNum) {
  const w = getWorldForLevel(levelNum);
  return levelNum - w.levelStart + 1;
}

function rarityWeight(levelNum, rarity) {
  const world = getWorldForLevel(levelNum).id;
  const stage = stageInWorld(levelNum);

  if (world === 1) {
    if (stage <= 5) {
      if (rarity === "common") return 88;
      if (rarity === "uncommon") return 12;
      return 0;
    }
    if (rarity === "common") return 70;
    if (rarity === "uncommon") return 28;
    if (rarity === "rare") return 2;
    return 0;
  }

  if (world === 2) {
    if (rarity === "common") return 45;
    if (rarity === "uncommon") return 40;
    if (rarity === "rare") return 14;
    if (rarity === "epic") return 1;
    return 0;
  }

  if (world === 3) {
    if (rarity === "common") return 28;
    if (rarity === "uncommon") return 35;
    if (rarity === "rare") return 28;
    if (rarity === "epic") return 7;
    return 2;
  }

  if (world === 4) {
    if (rarity === "common") return 8;
    if (rarity === "uncommon") return 22;
    if (rarity === "rare") return 35;
    if (rarity === "epic") return 28;
    return 7;
  }

  return 0;
}

function isValidEarlyEnemyDeck(cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length !== DECK_SIZE) return false;
  const counts = countById(cardIds);
  for (const [id, n] of Object.entries(counts)) {
    const def = getCardDef(id);
    if (!def || (def.rarity !== "common" && def.rarity !== "uncommon")) return false;
    if (n > maxCopiesForRarity(def.rarity)) return false;
  }
  return true;
}

function buildEarlyCommonUncommonDeck(levelNum) {
  const pool = getPlayableCards().filter(
    (c) => c.rarity === "common" || c.rarity === "uncommon"
  );
  const ordered = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  const rot = (levelNum - 1) % Math.max(1, ordered.length);
  const shuffled = [...ordered.slice(rot), ...ordered.slice(0, rot)];
  const ids = [];
  for (const card of shuffled) {
    if (ids.length >= DECK_SIZE) break;
    const room = DECK_SIZE - ids.length;
    const copies = Math.min(EARLY_COPIES_PER_CARD, room);
    for (let i = 0; i < copies; i++) ids.push(card.id);
  }
  return shuffle(ids);
}

function buildEpicLegendaryDeck() {
  const pool = getPlayableCards().filter(
    (c) => c.rarity === "epic" || c.rarity === "legendary"
  );
  const ids = [];
  let guard = 0;
  while (ids.length < DECK_SIZE && guard < 8000) {
    guard++;
    const card = pool[Math.floor(Math.random() * pool.length)];
    const counts = countById(ids);
    if ((counts[card.id] || 0) < MAX_COPIES_PER_CARD) ids.push(card.id);
  }
  return shuffle(ids);
}

function buildWeightedDeck(levelNum) {
  const pool = getPlayableCards();
  const ids = [];
  let guard = 0;
  while (ids.length < DECK_SIZE && guard < 8000) {
    guard++;
    const roll = Math.random() * 100;
    let acc = 0;
    let pickedRarity = "common";
    for (const r of ["common", "uncommon", "rare", "epic", "legendary"]) {
      acc += rarityWeight(levelNum, r);
      if (roll <= acc) {
        pickedRarity = r;
        break;
      }
    }
    const candidates = pool.filter((c) => c.rarity === pickedRarity);
    const card = (candidates.length ? candidates : pool)[
      Math.floor(Math.random() * (candidates.length ? candidates.length : pool.length))
    ];
    const counts = countById(ids);
    if ((counts[card.id] || 0) < maxCopiesForCard(card)) ids.push(card.id);
  }
  return shuffle(ids);
}

export function migrateAdventureDecks(profile) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  if (profile.adventure.enemyDeckGen === ENEMY_DECK_GENERATION) return;
  profile.adventure.levelDecks = {};
  profile.adventure.enemyDeckGen = ENEMY_DECK_GENERATION;
}

function ensureEnemyDeckSize(ids) {
  if (Array.isArray(ids) && ids.length === DECK_SIZE) return ids;
  return buildWeightedDeck(1);
}

export function buildLevelEnemyDeck(levelNum) {
  const world = getWorldForLevel(levelNum).id;
  if (world === 5) return ensureEnemyDeckSize(buildEpicLegendaryDeck());
  if (world === 1) return ensureEnemyDeckSize(buildEarlyCommonUncommonDeck(levelNum));
  return ensureEnemyDeckSize(buildWeightedDeck(levelNum));
}

export function getAdventureLevels() {
  const levels = [];
  for (const world of WORLDS) {
    for (let n = world.levelStart; n <= world.levelEnd; n++) {
      const stage = stageInWorld(n);
      const opp = WORLD_OPPONENTS[world.id]?.[stage - 1] || `Champion ${n}`;
      const flavor = WORLD_FLAVOR[world.id]?.[stage - 1] || world.name;
      levels.push({
        id: n,
        worldId: world.id,
        worldName: world.name,
        stageInWorld: stage,
        name: `${world.name} · Stage ${stage}`,
        opponent: opp,
        flavor,
      });
    }
  }
  return levels;
}

export function getLevelsForWorld(worldId) {
  return getAdventureLevels().filter((l) => l.worldId === worldId);
}

export function getLevel(levelId) {
  const n = Number(levelId);
  return getAdventureLevels().find((l) => l.id === n) || null;
}

export function getOrCreateLevelEnemyDeck(profile, levelId) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  migrateAdventureDecks(profile);
  if (!profile.adventure.levelDecks) profile.adventure.levelDecks = {};
  const key = String(levelId);
  const levelNum = Number(levelId);
  const cached = profile.adventure.levelDecks[key];
  const world = getWorldForLevel(levelNum).id;
  const needsRebuild =
    !Array.isArray(cached) ||
    cached.length !== DECK_SIZE ||
    (world === 1 && levelNum <= 10 && !isValidEarlyEnemyDeck(cached)) ||
    (world === 5 && cached.some((id) => {
      const d = getCardDef(id);
      return d && d.rarity !== "epic" && d.rarity !== "legendary";
    }));
  if (needsRebuild) {
    profile.adventure.levelDecks[key] = buildLevelEnemyDeck(levelNum);
  }
  return profile.adventure.levelDecks[key];
}


export function repairAdventureProgress(progress) {
  const base = defaultAdventureProgress();
  if (!progress || typeof progress !== "object") return { ...base };
  const repaired = { ...base, ...progress };
  let hi = Number(repaired.highestUnlocked);
  if (!Number.isFinite(hi) || hi < 1) hi = 1;
  if (hi > ADVENTURE_LEVEL_COUNT) hi = ADVENTURE_LEVEL_COUNT;
  repaired.highestUnlocked = hi;
  if (!repaired.cleared || typeof repaired.cleared !== "object") repaired.cleared = {};
  if (!repaired.stars || typeof repaired.stars !== "object") repaired.stars = {};
  let sw = Number(repaired.selectedWorld);
  if (!Number.isFinite(sw) || sw < 1 || sw > WORLDS.length) sw = 1;
  if (!isWorldUnlocked(repaired, sw)) sw = getWorldForLevel(hi).id;
  repaired.selectedWorld = sw;
  return repaired;
}

export function defaultAdventureProgress() {
  return { highestUnlocked: 1, cleared: {}, stars: {}, selectedWorld: 1 };
}

export function starsForRemainingPieces(remaining) {
  const n = Number(remaining) || 0;
  if (n === 0) return 0;
  if (n >= 3) return 3;
  if (n === 2) return 2;
  return 1;
}

export function formatStars(stars) {
  const n = Math.max(0, Math.min(3, Number(stars) || 0));
  return "★".repeat(n) + "☆".repeat(3 - n);
}

export function getLevelStars(progress, levelId) {
  return progress?.stars?.[String(levelId)] || 0;
}

export function isLevelUnlocked(progress, levelId) {
  const level = getLevel(Number(levelId));
  if (!level) return false;
  if (!isWorldUnlocked(progress, level.worldId)) return false;
  return Number(levelId) <= (progress?.highestUnlocked || 1);
}

export function isLevelCleared(progress, levelId) {
  return !!progress?.cleared?.[String(levelId)];
}

export function countClearedLevelsInWorld(progress, worldId) {
  const repaired = repairAdventureProgress(progress);
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return 0;
  let count = 0;
  for (let id = world.levelStart; id <= world.levelEnd; id++) {
    if (isLevelCleared(repaired, id)) count++;
  }
  return count;
}

export const QUESTS_PVP_UNLOCK_LEVEL = 1;
export const QUESTS_PVP_UNLOCK_MESSAGE = "Clear Adventure stage 1 to unlock";

export const COSMETICS_UNLOCK_LEVEL = 5;
export const COSMETICS_UNLOCK_MESSAGE = "Clear Adventure stage 5 to unlock";

export function isQuestsAndPvpUnlocked(profile) {
  const progress = repairAdventureProgress(profile?.adventure);
  return isLevelCleared(progress, QUESTS_PVP_UNLOCK_LEVEL);
}

export function isCosmeticsUnlocked(profile) {
  const progress = repairAdventureProgress(profile?.adventure);
  return isLevelCleared(progress, COSMETICS_UNLOCK_LEVEL);
}

export function unlockNextLevel(progress, clearedLevelId) {
  const n = Number(clearedLevelId);
  if (n >= (progress.highestUnlocked || 1) && n < ADVENTURE_LEVEL_COUNT) {
    progress.highestUnlocked = n + 1;
  }
}

export function gemsForLevelClear(progress, levelId) {
  return isLevelCleared(progress, levelId) ? ADVENTURE_REPEAT_CLEAR_GEMS : ADVENTURE_FIRST_CLEAR_GEMS;
}

export function recordLevelClear(profile, levelId, starsEarned) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  if (!profile.adventure.stars) profile.adventure.stars = {};
  const key = String(levelId);
  const firstTime = !profile.adventure.cleared[key];
  profile.adventure.cleared[key] = true;
  unlockNextLevel(profile.adventure, Number(levelId));
  const gems = firstTime ? ADVENTURE_FIRST_CLEAR_GEMS : ADVENTURE_REPEAT_CLEAR_GEMS;
  const prevBest = profile.adventure.stars[key] || 0;
  const stars = Math.max(prevBest, Math.min(3, Math.max(0, Number(starsEarned) || 0)));
  profile.adventure.stars[key] = stars;
  const starsGained = Math.max(0, stars - prevBest);
  if (starsGained > 0) profile.stars = (profile.stars ?? 0) + starsGained;
  return { gems, firstTime, stars, starsGained };
}

export function getEnemyDeckPreview(cardIds) {
  const counts = countById(cardIds);
  return Object.entries(counts)
    .map(([id, n]) => ({ def: getCardDef(id), count: n }))
    .filter((x) => x.def)
    .sort((a, b) => a.def.name.localeCompare(b.def.name));
}

/** Isometric map tile positions (% of canvas) per stage in world (1–10). */
export const MAP_PIN_LAYOUT = [
  { left: 50, top: 86 },
  { left: 64, top: 80 },
  { left: 76, top: 72 },
  { left: 80, top: 60 },
  { left: 72, top: 50 },
  { left: 56, top: 44 },
  { left: 40, top: 46 },
  { left: 26, top: 56 },
  { left: 30, top: 70 },
  { left: 50, top: 26 },
];

/** Per-world palette for isometric map scenery. */
export const MAP_THEME_PALETTES = {
  verdant: {
    sky: "#b8d4e8",
    gridLight: "#e8e4dc",
    gridDark: "#d0ccc4",
    rock: "#a8a4a0",
    rockDark: "#787470",
    grass: "#5a9a48",
    grassDark: "#3a6a30",
    castle: "#8a9098",
    castleRoof: "#6a7078",
    flag: "#e8c547",
    accent: "#58cc02",
  },
  frost: {
    sky: "#c8dce8",
    gridLight: "#e8eef4",
    gridDark: "#c8d4dc",
    rock: "#98a8b8",
    rockDark: "#687888",
    grass: "#6a98b0",
    grassDark: "#4a7898",
    castle: "#a0b0c0",
    castleRoof: "#8090a8",
    flag: "#a8d8f0",
    accent: "#1cb0f6",
  },
  ember: {
    sky: "#e8c8a8",
    gridLight: "#ece0d4",
    gridDark: "#d4c0b0",
    rock: "#a88870",
    rockDark: "#786050",
    grass: "#8a6840",
    grassDark: "#6a4830",
    castle: "#987860",
    castleRoof: "#785840",
    flag: "#f08030",
    accent: "#ff9600",
  },
  void: {
    sky: "#b8a8d8",
    gridLight: "#dcd4e8",
    gridDark: "#c0b4d0",
    rock: "#9080a8",
    rockDark: "#605080",
    grass: "#7a58a8",
    grassDark: "#5a3888",
    castle: "#8878a8",
    castleRoof: "#685888",
    flag: "#c8a0ff",
    accent: "#ce82ff",
  },
  legend: {
    sky: "#a8d8c0",
    gridLight: "#dce8dc",
    gridDark: "#c0d4c0",
    rock: "#88a090",
    rockDark: "#587068",
    grass: "#48a868",
    grassDark: "#288848",
    castle: "#78a888",
    castleRoof: "#588868",
    flag: "#e8c547",
    accent: "#58cc02",
  },
};

export function getNextPlayableLevelId(progress) {
  const next = progress?.highestUnlocked || 1;
  if (next <= ADVENTURE_LEVEL_COUNT && isLevelUnlocked(progress, next)) return next;
  for (let id = 1; id <= ADVENTURE_LEVEL_COUNT; id++) {
    if (isLevelUnlocked(progress, id) && !isLevelCleared(progress, id)) return id;
  }
  return Math.min(ADVENTURE_LEVEL_COUNT, progress?.highestUnlocked || 1);
}

export function totalMapStars(progress) {
  return Object.values(progress?.stars || {}).reduce((s, n) => s + (Number(n) || 0), 0);
}
