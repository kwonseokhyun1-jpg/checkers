import {
  DECK_SIZE,
  MAX_COPIES_PER_CARD,
  getPlayableCards,
  isEconomyCard,
  getCardDef,
} from "./cardCatalog.js";
import { collectionCount } from "./storage.js";

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
    if (isEconomyCard(id)) errors.push(`Economy spell disabled: ${getCardDef(id)?.name || id}`);
    if (n > MAX_COPIES_PER_CARD) errors.push(`Max ${MAX_COPIES_PER_CARD} copies of ${getCardDef(id)?.name || id}.`);
    if (profile && collectionCount(profile, id) < n) {
      errors.push(`Not enough copies of ${getCardDef(id)?.name || id} in collection.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function canAddCardToDeck(deckIds, cardId, profile) {
  if (isEconomyCard(cardId)) return { ok: false, reason: "Economy spells are disabled." };
  if (deckIds.length >= DECK_SIZE) return { ok: false, reason: "Deck is full (30 cards)." };
  const counts = countById(deckIds);
  const inDeck = counts[cardId] || 0;
  if (inDeck >= MAX_COPIES_PER_CARD) return { ok: false, reason: `Max ${MAX_COPIES_PER_CARD} copies per card.` };
  const owned = collectionCount(profile, cardId);
  if (owned <= inDeck) return { ok: false, reason: "No more copies in collection." };
  return { ok: true };
}

export function buildAiDeck() {
  const pool = getPlayableCards();
  const ids = [];
  while (ids.length < DECK_SIZE) {
    const c = pool[Math.floor(Math.random() * pool.length)];
    const counts = countById(ids);
    if ((counts[c.id] || 0) < MAX_COPIES_PER_CARD) ids.push(c.id);
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
