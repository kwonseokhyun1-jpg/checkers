import {
  DECK_SIZE,
  maxCopiesForCard,
  getPlayableCards,
  isEconomyCard,
  isKnightCard,
  getCardDef,
} from "./cardCatalog.js";

function ownedCopies(profile, cardId) {
  return profile?.collection?.[cardId] || 0;
}

export function countById(cardIds) {
  const map = {};
  for (const id of cardIds) {
    map[id] = (map[id] || 0) + 1;
  }
  return map;
}

export function validateDeck(cardIds, profile) {
  const errors = [];
  if (cardIds.length !== DECK_SIZE) {
    errors.push(`Deck must have exactly ${DECK_SIZE} cards (${cardIds.length}/${DECK_SIZE}).`);
  }
  const counts = countById(cardIds);
  for (const [id, n] of Object.entries(counts)) {
    if (isKnightCard(id)) errors.push(`Removed spell: ${getCardDef(id)?.name || id}`);
    if (isEconomyCard(id)) errors.push(`Economy spell disabled: ${getCardDef(id)?.name || id}`);
    const cap = maxCopiesForCard(id);
    if (n > cap) errors.push(`Max ${cap} copies of ${getCardDef(id)?.name || id}.`);
    if (profile && ownedCopies(profile, id) < n) {
      errors.push(`Not enough copies of ${getCardDef(id)?.name || id} in collection.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

/** Player-facing deck problem with a next step, or null when the deck is PvP-ready. */
export function describeDeckIssue(cardIds, profile) {
  const ids = Array.isArray(cardIds) ? cardIds : [];
  const { valid, errors } = validateDeck(ids, profile);
  if (valid) return null;

  const count = ids.length;
  if (count !== DECK_SIZE) {
    const diff = DECK_SIZE - count;
    if (diff > 0) {
      const add =
        diff === 1 ? "add 1 more spell" : `add ${diff} more spells`;
      return `Your deck has ${count}/${DECK_SIZE} cards — open Decks and ${add}.`;
    }
    const excess = count - DECK_SIZE;
    const remove =
      excess === 1 ? "remove 1 spell" : `remove ${excess} spells`;
    return `Your deck has ${count}/${DECK_SIZE} cards — open Decks and ${remove}.`;
  }

  const first = errors[0] || "This deck can't be used in PvP.";
  if (first.includes("Not enough copies")) {
    return `${first} Open Decks and remove extras, or buy more copies.`;
  }
  if (first.includes("Max")) {
    return `${first} Open Decks and reduce duplicate cards.`;
  }
  if (first.includes("Removed spell") || first.includes("Economy spell")) {
    return `${first} Open Decks and swap out disabled spells.`;
  }
  return `${first} Open Decks to fix your deck.`;
}

export function canAddCardToDeck(deckIds, cardId, profile) {
  if (isKnightCard(cardId)) return { ok: false, reason: "This spell is no longer in the game." };
  if (isEconomyCard(cardId)) return { ok: false, reason: "Economy spells are disabled." };
  if (deckIds.length >= DECK_SIZE) return { ok: false, reason: `Deck is full (${DECK_SIZE} cards).` };
  const counts = countById(deckIds);
  const inDeck = counts[cardId] || 0;
  const cap = maxCopiesForCard(cardId);
  if (inDeck >= cap) return { ok: false, reason: `Max ${cap} copies of this card.` };
  const owned = ownedCopies(profile, cardId);
  if (owned <= inDeck) return { ok: false, reason: "No more copies in collection." };
  return { ok: true };
}

export function buildAiDeck() {
  return buildMysteryDeck();
}

/** Compare two deck lists regardless of draw order. */
export function deckIdsEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((id, i) => id === right[i]);
}

/** Reconstruct a player's deck card ids from an in-progress match state. */
export function deckCardIdsFromMatchState(state, color) {
  if (!state || !color) return null;
  const ids = [];
  const pile = state.drawPile?.[color];
  if (Array.isArray(pile)) ids.push(...pile);
  const hand = state.hands?.[color];
  if (Array.isArray(hand)) {
    for (const card of hand) {
      if (card?.id) ids.push(card.id);
    }
  }
  const discard = state.discardPile?.[color];
  if (Array.isArray(discard)) ids.push(...discard);
  return ids.length ? ids : null;
}

/** Random deck from the full playable pool — no collection ownership check. */
export function buildMysteryDeck(options = {}) {
  const { excludeDeckIds = null, maxAttempts = 12 } = options;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const ids = buildMysteryDeckOnce();
    if (!excludeDeckIds || !deckIdsEqual(ids, excludeDeckIds)) return ids;
  }
  return buildMysteryDeckOnce();
}

function buildMysteryDeckOnce() {
  const pool = getPlayableCards();
  const ids = [];
  while (ids.length < DECK_SIZE) {
    const c = pool[Math.floor(Math.random() * pool.length)];
    const counts = countById(ids);
    if ((counts[c.id] || 0) < maxCopiesForCard(c.id)) ids.push(c.id);
  }
  return ids;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createMatchPile(cardIds) {
  return shuffle(cardIds.map((id) => id));
}
