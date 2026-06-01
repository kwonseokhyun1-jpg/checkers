import { isKnightCard, isRemovedCard, getCardDef, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import { defaultAdventureProgress, migrateAdventureDecks } from "./adventure.js";
import { normalizeCosmetics, DEFAULT_COSMETICS } from "./cosmetics.js";

/** Player profile: gems, collection, saved decks (localStorage) */

const STORAGE_KEY = "cardCheckersProfile_v5";
export const STARTING_GEMS = 400;
/** Testing grant — applied on each profile load for now */
export const TESTING_GEMS = 4000;
export const WIN_GEMS = 10;

/** Starter deck: commons only, up to 4 copies per card (30 cards). */
export const STARTER_COPIES_PER_CARD = 4;
export const STARTER_COMMON_IDS = [
  "nudge",
  "retreat",
  "long_step",
  "sidestep",
  "repel",
  "leapfrog",
  "venom",
  "anchor",
  "flank",
  "recall",
];

export function buildStarterDeckCardIds() {
  const ids = [];
  for (const id of STARTER_COMMON_IDS.slice(0, 7)) {
    for (let i = 0; i < STARTER_COPIES_PER_CARD; i++) ids.push(id);
  }
  ids.push(STARTER_COMMON_IDS[7], STARTER_COMMON_IDS[7]);
  return ids;
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
    gems: TESTING_GEMS,
    collection,
    decks: [starterDeck],
    selectedDeckId: starterDeck.id,
    adventure: defaultAdventureProgress(),
    cosmetics: structuredClone(DEFAULT_COSMETICS),
  };
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
    if (n > MAX_COPIES_PER_CARD) profile.collection[id] = MAX_COPIES_PER_CARD;
    if (n <= 0) delete profile.collection[id];
  }
  return profile;
}

function trimDecksToCollection(profile) {
  for (const deck of profile.decks || []) {
    if (!Array.isArray(deck.cardIds)) continue;
    const used = {};
    const trimmed = [];
    for (const id of deck.cardIds) {
      const owned = profile.collection[id] || 0;
      const n = used[id] || 0;
      if (n < owned && n < MAX_COPIES_PER_CARD) {
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

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards(defaultProfile()))));
    const p = JSON.parse(raw);
    return trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards({
      gems: TESTING_GEMS,
      collection: p.collection ?? {},
      decks: Array.isArray(p.decks) ? p.decks : [],
      selectedDeckId: p.selectedDeckId ?? null,
      cosmetics: normalizeCosmetics(p.cosmetics),
      adventure: (() => {
        const adv = { ...defaultAdventureProgress(), ...(p.adventure || {}) };
        const profile = { adventure: adv };
        migrateAdventureDecks(profile);
        return profile.adventure;
      })(),
    }))));
  } catch {
    return trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards(defaultProfile()))));
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function collectionRoom(profile, cardId) {
  return Math.max(0, MAX_COPIES_PER_CARD - collectionCount(profile, cardId));
}

/** @returns {number} copies actually added (capped at MAX_COPIES_PER_CARD) */
export function addToCollection(profile, cardId, count = 1) {
  const room = collectionRoom(profile, cardId);
  const added = Math.min(count, room);
  if (added > 0) {
    profile.collection[cardId] = collectionCount(profile, cardId) + added;
    saveProfile(profile);
  }
  return added;
}

export function collectionCount(profile, cardId) {
  return profile.collection[cardId] || 0;
}

export function totalCollectionCards(profile) {
  return Object.values(profile.collection).reduce((s, n) => s + n, 0);
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
  profile.decks = profile.decks.filter((d) => d.id !== deckId);
  if (profile.selectedDeckId === deckId) profile.selectedDeckId = null;
  saveProfile(profile);
}
