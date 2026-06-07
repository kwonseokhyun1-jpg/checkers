import { isKnightCard, isRemovedCard, getCardDef, getPlayableCards, maxCopiesForCard, DECK_SIZE } from "./cardCatalog.js";
import { defaultAdventureProgress, migrateAdventureDecks, repairAdventureProgress } from "./adventure.js";
import { normalizeCosmetics, DEFAULT_COSMETICS } from "./cosmetics.js";
import { normalizeAchievements, DEFAULT_ACHIEVEMENTS, syncArcaneMastery } from "./achievements.js";

/** Player profile: gems, collection, saved decks (localStorage) */

const STORAGE_KEY = "cardCheckersProfile_v7";
const LEGACY_STORAGE_KEY = "cardCheckersProfile_v5";
export const STARTING_GEMS = 200;
export const STARTING_STARS = 0;
export const TESTING_STARS = 30;
/** @deprecated Use STARTING_GEMS — kept for migration only */
export const TESTING_GEMS = STARTING_GEMS;
export const WIN_GEMS = 10;
/** One-time grant applied to every profile (local + cloud via grant_gems_1000.sql). */
export const GEMS_BONUS_1000_FLAG = "gemsGrant1000_v1";
export const GEMS_BONUS_1000 = 1000;

/** Starter / beginner deck: 3× each curated common until 30 cards (10 × 3). */
export const STARTER_COPIES_PER_CARD = 3;
export const STARTER_COMMON_IDS = [
  "nudge",
  "retreat",
  "backstep",
  "repel",
  "leapfrog",
  "anchor",
  "recall",
  "barrier",
  "ward",
  "hex",
];

export function buildStarterDeckCardIds() {
  const ids = [];
  for (const id of STARTER_COMMON_IDS) {
    for (let i = 0; i < STARTER_COPIES_PER_CARD; i++) {
      if (ids.length >= DECK_SIZE) break;
      ids.push(id);
    }
    if (ids.length >= DECK_SIZE) break;
  }
  return ids.slice(0, DECK_SIZE);
}

function starterDeckNeedsRepair(deck) {
  if (!deck?.cardIds || deck.cardIds.length !== DECK_SIZE) return true;
  const sorted = [...deck.cardIds].sort().join(",");
  const target = [...buildStarterDeckCardIds()].sort().join(",");
  return sorted !== target;
}


function defaultProfile() {
  const collection = {};
  for (const id of STARTER_COMMON_IDS) collection[id] = STARTER_COPIES_PER_CARD;
  const cardIds = buildStarterDeckCardIds();
  const starterDeck = {
    id: "deck-starter",
    name: "Starter Deck",
    cardIds,
    updatedAt: Date.now(),
  };

  return {
    gems: STARTING_GEMS,
    stars: TESTING_STARS,
    collection,
    decks: [starterDeck],
    selectedDeckId: starterDeck.id,
    adventure: defaultAdventureProgress(),
    cosmetics: structuredClone(DEFAULT_COSMETICS),
    achievements: structuredClone(DEFAULT_ACHIEVEMENTS),
    savedAt: Date.now(),
  };
}

export function hasStoredProfile() {
  return Boolean(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY));
}

function profileSignature(profile) {
  const decks = (profile?.decks || []).map((d) => ({
    id: d.id,
    cardIds: [...(d.cardIds || [])].sort(),
  }));
  return JSON.stringify({
    decks,
    collection: profile?.collection || {},
    gems: profile?.gems,
    stars: profile?.stars,
    cleared: profile?.adventure?.cleared?.length || 0,
  });
}

export function isDefaultProfile(profile) {
  if (!profile) return true;
  const def = finalizeProfile(defaultProfile());
  return profileSignature(profile) === profileSignature(def);
}

function totalOwnedCards(profile) {
  return Object.values(profile.collection || {}).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

function hasValidDeck(profile) {
  return (profile.decks || []).some(
    (d) => Array.isArray(d.cardIds) && d.cardIds.length === DECK_SIZE
  );
}

/** Ensure starter commons in collection and a playable 30-card starter deck. */
export function repairProfile(profile) {
  if (!profile) return false;
  if (!profile.collection || typeof profile.collection !== "object") profile.collection = {};
  if (!Array.isArray(profile.decks)) profile.decks = [];
  let changed = false;
  if (!profile.newCardIds || typeof profile.newCardIds !== "object") {
    profile.newCardIds = {};
    changed = true;
  }

  const prevAdv = JSON.stringify(profile.adventure || {});
  profile.adventure = repairAdventureProgress(profile.adventure);
  if (JSON.stringify(profile.adventure) !== prevAdv) changed = true;

  for (const id of STARTER_COMMON_IDS) {
    const n = profile.collection[id] || 0;
    if (n < STARTER_COPIES_PER_CARD) {
      profile.collection[id] = Math.max(n, STARTER_COPIES_PER_CARD);
      changed = true;
    }
  }

  const starter = profile.decks.find((d) => d.id === "deck-starter");
  if (starter && starterDeckNeedsRepair(starter)) {
    const cardIds = buildStarterDeckCardIds();
    starter.cardIds = [...cardIds];
    starter.updatedAt = Date.now();
    changed = true;
  }

  if (!hasValidDeck(profile)) {
    const cardIds = buildStarterDeckCardIds();
    let starter = profile.decks.find((d) => d.id === "deck-starter");
    if (!starter) {
      starter = {
        id: "deck-starter",
        name: "Starter Deck",
        cardIds,
        updatedAt: Date.now(),
      };
      profile.decks.unshift(starter);
    } else {
      starter.cardIds = [...cardIds];
      starter.name = "Starter Deck";
      starter.updatedAt = Date.now();
    }
    profile.selectedDeckId = "deck-starter";
    changed = true;
  } else if (
    !profile.selectedDeckId ||
    !profile.decks.some((d) => d.id === profile.selectedDeckId)
  ) {
    const pick =
      profile.decks.find((d) => d.id === "deck-starter") ||
      profile.decks.find((d) => d.cardIds?.length === DECK_SIZE) ||
      profile.decks[0];
    profile.selectedDeckId = pick?.id || null;
    changed = true;
  }

  return changed;
}


function migrateDoubleToQuickMarch(profile) {
  const legacy = profile.collection?.double;
  if (legacy && legacy > 0) {
    profile.collection.quick_march = (profile.collection.quick_march || 0) + legacy;
    delete profile.collection.double;
  }
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) continue;
    deck.cardIds = deck.cardIds.map((id) => (id === "double" ? "quick_march" : id));
  }
  return profile;
}

function migrateFireblastToPyromancy(profile) {
  const legacy = profile.collection?.fireblast;
  if (legacy && legacy > 0) {
    profile.collection.pyromancy = (profile.collection.pyromancy || 0) + legacy;
    delete profile.collection.fireblast;
  }
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) continue;
    deck.cardIds = deck.cardIds.map((id) => (id === "fireblast" ? "pyromancy" : id));
  }
  return profile;
}

function stripRemovedCards(profile) {
  for (const id of Object.keys(profile.collection || {})) {
    if (isRemovedCard(id) || !getCardDef(id)) delete profile.collection[id];
  }
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) continue;
    deck.cardIds = deck.cardIds.filter((id) => !isRemovedCard(id) && getCardDef(id));
  }
  return profile;
}

function capCollection(profile) {
  for (const id of Object.keys(profile.collection || {})) {
    const n = profile.collection[id];
    const cap = maxCopiesForCard(id);
    if (n > cap) profile.collection[id] = cap;
    if (n <= 0) delete profile.collection[id];
  }
  return profile;
}

function trimDecksToCollection(profile) {
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) {
      deck.cardIds = [];
      continue;
    }
    const used = {};
    const trimmed = [];
    for (const id of deck.cardIds) {
      const owned = profile.collection[id] || 0;
      const n = used[id] || 0;
      if (n < owned && n < maxCopiesForCard(id)) {
        trimmed.push(id);
        used[id] = n + 1;
      }
    }
    deck.cardIds = trimmed;
  }
  return profile;
}

function stripKnightCards(profile) {
  for (const id of Object.keys(profile.collection || {})) {
    if (isKnightCard(id)) delete profile.collection[id];
  }
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) continue;
    deck.cardIds = deck.cardIds.filter((id) => !isKnightCard(id));
  }
  return profile;
}

function normalizeLoadedProfile(parsed) {
  const adv = repairAdventureProgress(parsed.adventure);
  const stub = { adventure: adv };
  migrateAdventureDecks(stub);

  return {
    gems: typeof parsed.gems === "number" ? parsed.gems : STARTING_GEMS,
    stars: typeof parsed.stars === "number" ? parsed.stars : STARTING_STARS,
    collection: parsed.collection && typeof parsed.collection === "object" ? parsed.collection : {},
    decks: Array.isArray(parsed.decks) ? parsed.decks : [],
    selectedDeckId: parsed.selectedDeckId ?? null,
    cosmetics: normalizeCosmetics(parsed.cosmetics),
    achievements: normalizeAchievements(parsed.achievements),
    adventure: stub.adventure,
  };
}

function finalizeProfile(profile) {
  if (typeof profile.stars !== "number") profile.stars = 0;
  let p = stripKnightCards(profile);
  p = migrateDoubleToQuickMarch(p);
  p = migrateFireblastToPyromancy(p);
  p = stripRemovedCards(p);
  p = capCollection(p);
  repairProfile(p);
  p = trimDecksToCollection(p);
  repairProfile(p);
  if (!p.achievements) p.achievements = structuredClone(DEFAULT_ACHIEVEMENTS);
  p.achievements = normalizeAchievements(p.achievements);
  syncArcaneMastery(p);
  return p;
}

export function readProfileFromStorage() {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!raw) return finalizeProfile(defaultProfile());
  return finalizeProfile(normalizeLoadedProfile(JSON.parse(raw)));
}

export function loadProfile() {
  try {
    const hadStored = hasStoredProfile();
    const profile = readProfileFromStorage();
    const changed = repairProfile(profile);
    if (changed || !hadStored) saveProfile(profile);
    return profile;
  } catch (err) {
    console.error("Profile load failed, resetting:", err);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const profile = finalizeProfile(defaultProfile());
    saveProfile(profile);
    return profile;
  }
}

export function saveProfile(profile, { bumpTimestamp = true } = {}) {
  if (bumpTimestamp) profile.savedAt = Date.now();
  else if (typeof profile.savedAt !== "number") profile.savedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  void import("./cloudProfile.js").then(({ scheduleCloudSave }) => scheduleCloudSave(profile)).catch(() => {});
}

export function collectionRoom(profile, cardId) {
  return Math.max(0, maxCopiesForCard(cardId) - collectionCount(profile, cardId));
}

/** @returns {number} copies actually added (capped by rarity) */
export function markCardNew(profile, cardId) {
  if (!profile.newCardIds || typeof profile.newCardIds !== "object") profile.newCardIds = {};
  profile.newCardIds[cardId] = Date.now();
}

export function isCardNew(profile, cardId) {
  return Boolean(profile.newCardIds?.[cardId]);
}

export function clearCardNew(profile, cardId) {
  if (!profile.newCardIds) return;
  delete profile.newCardIds[cardId];
}

export function addToCollection(profile, cardId, count = 1) {
  const room = collectionRoom(profile, cardId);
  const added = Math.min(count, room);
  if (added > 0) {
    profile.collection[cardId] = collectionCount(profile, cardId) + added;
    markCardNew(profile, cardId);
    syncArcaneMastery(profile);
    saveProfile(profile);
  }
  return added;
}

export function collectionCount(profile, cardId) {
  return profile?.collection?.[cardId] || 0;
}

export function totalCollectionCards(profile) {
  return Object.values(profile.collection || {}).reduce((s, n) => s + (Number(n) || 0), 0);
}

export function createDeck(name, cardIds) {
  return {
    id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name || "New Deck",
    cardIds: [...cardIds],
    updatedAt: Date.now(),
  };
}

export function upsertDeck(profile, deck) {
  const i = profile.decks.findIndex((d) => d.id === deck.id);
  if (i >= 0) profile.decks[i] = deck;
  else profile.decks.push(deck);
  saveProfile(profile);
}

export function deleteDeck(profile, deckId) {
  if (deckId === "deck-starter") return;
  profile.decks = profile.decks.filter((d) => d.id !== deckId);
  if (profile.selectedDeckId === deckId) {
    profile.selectedDeckId = profile.decks[0]?.id ?? null;
  }
  repairProfile(profile);
  saveProfile(profile);
}
