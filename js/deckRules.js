import {
  DECK_SIZE,
  maxCopiesForCard,
  getPlayableCards,
  isEconomyCard,
  isKnightCard,
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
    if (isKnightCard(id)) errors.push(`Removed spell: ${getCardDef(id)?.name || id}`);
    if (isEconomyCard(id)) errors.push(`Economy spell disabled: ${getCardDef(id)?.name || id}`);
    const cap = maxCopiesForCard(id);
    if (n > cap) errors.push(`Max ${cap} copies of ${getCardDef(id)?.name || id}.`);
    if (profile && collectionCount(profile, id) < n) {
      errors.push(`Not enough copies of ${getCardDef(id)?.name || id} in collection.`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function canAddCardToDeck(deckIds, cardId, profile) {
  if (isKnightCard(cardId)) return { ok: false, reason: "This spell is no longer in the game." };
  if (isEconomyCard(cardId)) return { ok: false, reason: "Economy spells are disabled." };
  if (deckIds.length >= DECK_SIZE) return { ok: false, reason: "Deck is full (30 cards)." };
  const counts = countById(deckIds);
  const inDeck = counts[cardId] || 0;
  const cap = maxCopiesForCard(cardId);
  if (inDeck >= cap) return { ok: false, reason: `Max ${cap} copies of this card.` };
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
    if ((counts[c.id] || 0) < maxCopiesForCard(c)) ids.push(c.id);
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
