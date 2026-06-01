/**
 * Adventure mode — 30-level map, enemy decks, gem rewards
 */
import { getPlayableCards, getCardDef, DECK_SIZE, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import { countById, shuffle } from "./deckRules.js";

export const ADVENTURE_LEVEL_COUNT = 30;
export const ADVENTURE_FIRST_CLEAR_GEMS = 50;
export const ADVENTURE_REPEAT_CLEAR_GEMS = 20;
export const ENEMY_DECK_GENERATION = 4;
export const EARLY_STAGE_MAX_LEVEL = 10;
const EARLY_COPIES_PER_CARD = 4;

const OPPONENT_NAMES = [
  "Novice Adept",
  "Ember Scout",
  "Frost Acolyte",
  "Stone Sentinel",
  "Mist Binder",
  "Iron Warden",
  "Ash Magus",
  "Void Pilgrim",
  "Crystal Hexer",
  "Storm Herald",
  "Dusk Raider",
  "Pale Duelist",
  "Rune Thief",
  "Gloom Archer",
  "Blade Chanter",
  "Obsidian Knight",
  "Silver Oracle",
  "Cinder Warlock",
  "Hollow Crown",
  "Night Stalker",
  "Blood Monolith",
  "Starfall Sage",
  "Grave Warden",
  "Thunder Regent",
  "Abyss Marshal",
  "Sunless King",
  "Doom Cartographer",
  "Eclipse Tyrant",
  "Worldbreaker",
  "Archlich Ophelia",
];

const LEVEL_FLAVOR = [
  "Training grounds",
  "Woodland outpost",
  "Frozen bridge",
  "Quarry ruins",
  "Swamp shrine",
  "Mountain pass",
  "Volcanic flats",
  "Shattered temple",
  "Crystal caves",
  "Storm plateau",
  "Dusk citadel",
  "Pale arena",
  "Rune archives",
  "Gloom forest",
  "Blade monastery",
  "Obsidian hall",
  "Silver spire",
  "Cinder keep",
  "Hollow throne",
  "Night bastion",
  "Blood altar",
  "Starfall gate",
  "Graveyard maze",
  "Thunder spire",
  "Abyss gate",
  "Sunless vault",
  "Doom fortress",
  "Eclipse spire",
  "World's edge",
  "Final sanctum",
];

function rarityWeight(levelNum, rarity) {
  const tier = Math.floor((levelNum - 1) / 10);
  if (levelNum <= 5) {
    if (rarity === "common") return 90;
    if (rarity === "uncommon") return 9;
    if (rarity === "rare") return 1;
    return 0;
  }
  if (levelNum <= 10) {
    if (rarity === "common") return 78;
    if (rarity === "uncommon") return 18;
    if (rarity === "rare") return 4;
    return 0;
  }
  if (tier === 0) {
    if (rarity === "common") return 62;
    if (rarity === "uncommon") return 28;
    if (rarity === "rare") return 9;
    return 1;
  }
  if (tier === 1) {
    if (rarity === "common") return 35;
    if (rarity === "uncommon") return 35;
    if (rarity === "rare") return 22;
    if (rarity === "epic") return 6;
    return 2;
  }
  if (rarity === "common") return 25;
  if (rarity === "uncommon") return 30;
  if (rarity === "rare") return 28;
  if (rarity === "epic") return 12;
  return 5;
}



function isValidEarlyEnemyDeck(cardIds) {
  if (!Array.isArray(cardIds) || cardIds.length !== DECK_SIZE) return false;
  const counts = countById(cardIds);
  for (const [id, n] of Object.entries(counts)) {
    const def = getCardDef(id);
    if (!def || (def.rarity !== "common" && def.rarity !== "uncommon")) return false;
    if (n > EARLY_COPIES_PER_CARD) return false;
  }
  return true;
}

/** Early stages: only commons/uncommons, 4 copies per card until deck is full (no rarity rolls). */
function buildEarlyCommonUncommonDeck(levelNum) {
  const pool = getPlayableCards().filter(
    (c) => c.rarity === "common" || c.rarity === "uncommon"
  );
  const ordered = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  // Stable variety per stage without random rarity distribution
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

export function migrateAdventureDecks(profile) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  if (profile.adventure.enemyDeckGen === ENEMY_DECK_GENERATION) return;
  profile.adventure.levelDecks = {};
  profile.adventure.enemyDeckGen = ENEMY_DECK_GENERATION;
}

export function buildLevelEnemyDeck(levelNum) {
  if (levelNum <= EARLY_STAGE_MAX_LEVEL) {
    return buildEarlyCommonUncommonDeck(levelNum);
  }
  const pool = getPlayableCards();
  const ids = [];
  while (ids.length < DECK_SIZE) {
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
    if ((counts[card.id] || 0) < MAX_COPIES_PER_CARD) ids.push(card.id);
  }
  return shuffle(ids);
}

/** @returns {Array<{ id: number, name: string, opponent: string, flavor: string }>} */
export function getAdventureLevels() {
  return Array.from({ length: ADVENTURE_LEVEL_COUNT }, (_, i) => {
    const id = i + 1;
    return {
      id,
      name: `Stage ${id}`,
      opponent: OPPONENT_NAMES[i] || `Champion ${id}`,
      flavor: LEVEL_FLAVOR[i] || "Unknown lands",
    };
  });
}

export function getLevel(levelId) {
  const n = Number(levelId);
  const meta = getAdventureLevels().find((l) => l.id === n);
  if (!meta) return null;
  return { ...meta };
}

/** Stable enemy deck per stage (stored in profile.adventure.levelDecks) */
export function getOrCreateLevelEnemyDeck(profile, levelId) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  migrateAdventureDecks(profile);
  if (!profile.adventure.levelDecks) profile.adventure.levelDecks = {};
  const key = String(levelId);
  const levelNum = Number(levelId);
  const cached = profile.adventure.levelDecks[key];
  const needsRebuild =
    !Array.isArray(cached) ||
    cached.length !== DECK_SIZE ||
    (levelNum <= EARLY_STAGE_MAX_LEVEL && !isValidEarlyEnemyDeck(cached));
  if (needsRebuild) {
    profile.adventure.levelDecks[key] = buildLevelEnemyDeck(levelNum);
  }
  return profile.adventure.levelDecks[key];
}

export function defaultAdventureProgress() {
  return { highestUnlocked: 1, cleared: {}, stars: {} };
}

/** 3★ if 3+ pieces left, 2★ if 2, 1★ if 1 */
export function starsForRemainingPieces(remaining) {
  const n = Number(remaining) || 0;
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
  return levelId <= (progress?.highestUnlocked || 1);
}

export function isLevelCleared(progress, levelId) {
  return !!progress?.cleared?.[String(levelId)];
}

export function unlockNextLevel(progress, clearedLevelId) {
  if (clearedLevelId >= (progress.highestUnlocked || 1) && clearedLevelId < ADVENTURE_LEVEL_COUNT) {
    progress.highestUnlocked = clearedLevelId + 1;
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
  const stars = Math.max(prevBest, Math.min(3, Math.max(1, Number(starsEarned) || 1)));
  profile.adventure.stars[key] = stars;
  return { gems, firstTime, stars };
}

export function getEnemyDeckPreview(cardIds) {
  const counts = countById(cardIds);
  return Object.entries(counts)
    .map(([id, n]) => ({ def: getCardDef(id), count: n }))
    .filter((x) => x.def)
    .sort((a, b) => a.def.name.localeCompare(b.def.name));
}
