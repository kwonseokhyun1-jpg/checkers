import { isKnightCard, isRemovedCard, getCardDef } from "./cardCatalog.js";
import { defaultAdventureProgress, migrateAdventureDecks } from "./adventure.js";

/** Player profile: gems, collection, saved decks (localStorage) */

const STORAGE_KEY = "cardCheckersProfile_v4";
export const STARTING_GEMS = 400;
export const WIN_GEMS = 10;

function defaultProfile() {
  const collection = {};
  const starterIds = [
    "nudge", "aegis", "sidestep", "bolt", "retreat", "swap", "long_step", "crown", "mine", "venom",
  ];
  for (const id of starterIds) collection[id] = 3;
  const cardIds = starterIds.flatMap((id) => [id, id, id]);
  const starterDeck = {
    id: "deck-starter",
    name: "Starter Deck",
    cardIds,
    updatedAt: Date.now(),
  };

  return {
    gems: STARTING_GEMS,
    collection,
    decks: [starterDeck],
    selectedDeckId: starterDeck.id,
    adventure: defaultAdventureProgress(),
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
    if (!raw) return stripRemovedCards(stripKnightCards(defaultProfile()));
    const p = JSON.parse(raw);
    return stripRemovedCards(stripKnightCards({
      gems: p.gems ?? STARTING_GEMS,
      collection: p.collection ?? {},
      decks: Array.isArray(p.decks) ? p.decks : [],
      selectedDeckId: p.selectedDeckId ?? null,
      adventure: (() => {
        const adv = { ...defaultAdventureProgress(), ...(p.adventure || {}) };
        const profile = { adventure: adv };
        migrateAdventureDecks(profile);
        return profile.adventure;
      })(),
    });
  } catch {
    return stripRemovedCards(stripKnightCards(defaultProfile()));
  }
}

export function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function addToCollection(profile, cardId, count = 1) {
  profile.collection[cardId] = (profile.collection[cardId] || 0) + count;
  saveProfile(profile);
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
