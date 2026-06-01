import { isKnightCard, isRemovedCard, getCardDef, maxCopiesForCard, DECK_SIZE } from "./cardCatalog.js";
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



function totalOwnedCards(profile) {
  return Object.values(profile.collection || {}).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

function hasValidDeck(profile) {
  return (profile.decks || []).some(
    (d) => Array.isArray(d.cardIds) && d.cardIds.length === DECK_SIZE
  );
}

/** Restore starter collection/deck when saves are empty or trimmed to nothing. */
export function repairProfile(profile) {
  let changed = false;
  const owned = totalOwnedCards(profile);

  if (owned < 1) {
    for (const id of STARTER_COMMON_IDS) {
      if ((profile.collection[id] || 0) < 1) {
        profile.collection[id] = STARTER_COPIES_PER_CARD;
        changed = true;
      }
    }
  }

  if (!hasValidDeck(profile)) {
    const cardIds = buildStarterDeckCardIds();
    let starter = (profile.decks || []).find((d) => d.id === "deck-starter");
    if (!starter) {
      profile.decks = profile.decks || [];
      starter = {
        id: "deck-starter",
        name: "Starter Deck",
        cardIds,
        updatedAt: Date.now(),
      };
      profile.decks.unshift(starter);
    } else {
      starter.cardIds = cardIds;
      starter.name = starter.name || "Starter Deck";
      starter.updatedAt = Date.now();
    }
    profile.selectedDeckId = starter.id;
    changed = true;
  } else if (!profile.selectedDeckId || !(profile.decks || []).some((d) => d.id === profile.selectedDeckId)) {
    profile.selectedDeckId = profile.decks.find((d) => d.cardIds?.length === 30)?.id || profile.decks[0]?.id;
    changed = true;
  }

  return changed;
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
    if (!Array.isArray(deck.cardIds)) continue;
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

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const profile = trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards(defaultProfile()))));
      repairProfile(profile);
      return profile;
    }
    const p = JSON.parse(raw);
    const profile = trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards({
      gems: TESTING_GEMS,
      collection: p.collection ?? {},
      decks: Array.isArray(p.decks) ? p.decks : [],
      selectedDeckId: p.selectedDeckId ?? null,
      cosmetics: normalizeCosmetics(p.cosmetics),
      adventure: (() => {
        const adv = { ...defaultAdventureProgress(), ...(p.adventure || {}) };
        const stub = { adventure: adv };
        migrateAdventureDecks(stub);
        return stub.adventure;
      })(),
    }))));
    if (repairProfile(profile)) saveProfile(profile);
    return profile;
  } catch {
    const profile = trimDecksToCollection(capCollection(stripRemovedCards(stripKnightCards(defaultProfile()))));
    repairProfile(profile);
    return profile;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function collectionRoom(profile, cardId) {
  return Math.max(0, maxCopiesForCard(cardId) - collectionCount(profile, cardId));
}

/** @returns {number} copies actually added (capped by rarity) */
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
  return profile?.collection?.[cardId] || 0;
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
