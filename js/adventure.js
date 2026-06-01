/**
 * Adventure mode — 30-level map, enemy decks, gem rewards
 */
import { getPlayableCards, getCardDef, DECK_SIZE, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import { countById, shuffle } from "./deckRules.js";

export const ADVENTURE_LEVEL_COUNT = 30;
export const ADVENTURE_FIRST_CLEAR_GEMS = 50;
export const ADVENTURE_REPEAT_CLEAR_GEMS = 20;

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
  const w = { common: 40, uncommon: 30, rare: 20, epic: 8, legendary: 2 };
  if (tier === 0) {
    if (rarity === "common") return 55;
    if (rarity === "uncommon") return 30;
    if (rarity === "rare") return 12;
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

export function buildLevelEnemyDeck(levelNum) {
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
  if (!profile.adventure.levelDecks) profile.adventure.levelDecks = {};
  const key = String(levelId);
  if (!Array.isArray(profile.adventure.levelDecks[key]) || profile.adventure.levelDecks[key].length !== DECK_SIZE) {
    profile.adventure.levelDecks[key] = buildLevelEnemyDeck(Number(levelId));
  }
  return profile.adventure.levelDecks[key];
}

export function defaultAdventureProgress() {
  return { highestUnlocked: 1, cleared: {} };
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

export function recordLevelClear(profile, levelId) {
  if (!profile.adventure) profile.adventure = defaultAdventureProgress();
  const key = String(levelId);
  const firstTime = !profile.adventure.cleared[key];
  profile.adventure.cleared[key] = true;
  unlockNextLevel(profile.adventure, Number(levelId));
  const gems = firstTime ? ADVENTURE_FIRST_CLEAR_GEMS : ADVENTURE_REPEAT_CLEAR_GEMS;
  return { gems, firstTime };
}

export function getEnemyDeckPreview(cardIds) {
  const counts = countById(cardIds);
  return Object.entries(counts)
    .map(([id, n]) => ({ def: getCardDef(id), count: n }))
    .filter((x) => x.def)
    .sort((a, b) => a.def.name.localeCompare(b.def.name));
}
