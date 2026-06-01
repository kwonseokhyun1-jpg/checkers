/** Playable card pool — economy spells disabled for chests and decks */
import { CARD_REGISTRY, CARDS } from "./cardRegistry.js";

/** Gem / draw-engine spells — not in chests or decks */
export const ECONOMY_CARD_IDS = new Set([
  "gem_cache",
  "bribery",
  "prospect",
  "tax",
  "gamble",
  "haggle",
  "recycle",
  "scout",
  "forge",
  "heist",
  "donate",
  "interest",
  "bankrupt",
  "coupon",
  "hand_expand",
  "mulligan",
  "regicide",
  "krabby_patty",
  "loading",
  "gem_knight",
  "parallel",
  "echo",
]);

/** Knight-movement spells removed from the game */
export const KNIGHT_CARD_IDS = new Set([
  "knight",
  "knights_charge",
  "gem_knight",
  "queens_crown",
]);

export function isKnightCard(cardOrId) {
  const id = typeof cardOrId === "string" ? cardOrId : cardOrId?.id;
  return KNIGHT_CARD_IDS.has(id);
}

export function isEconomyCard(cardOrId) {
  const id = typeof cardOrId === "string" ? cardOrId : cardOrId?.id;
  return ECONOMY_CARD_IDS.has(id);
}

export function getPlayableCards() {
  return CARD_REGISTRY.filter((c) => !isEconomyCard(c.id) && !isKnightCard(c.id));
}

export function getCardDef(id) {
  return CARDS[id] || null;
}

export const DECK_SIZE = 30;
export const MAX_COPIES_PER_CARD = 3;
export const START_HAND = 3;
export const MAX_HAND = 5;
export const DRAW_EVERY_TURNS = 2;
