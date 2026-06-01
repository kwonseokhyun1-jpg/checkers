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
  "chameleon",
]);

/** Knight-movement spells removed from the game */
export const REMOVED_CARD_IDS = new Set([
  "wild_magic",
  "frost",
  "uno_reverse",
  "coronation_day",
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
  "parallel",
  "echo",
  "chameleon",
  "time_slip",
  "exile_king",
]);

export function isRemovedCard(cardOrId) {
  const id = typeof cardOrId === "string" ? cardOrId : cardOrId?.id;
  return REMOVED_CARD_IDS.has(id);
}

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
  return CARD_REGISTRY.filter((c) => !isEconomyCard(c.id) && !isKnightCard(c.id) && !isRemovedCard(c.id));
}

export function getCardDef(id) {
  return CARDS[id] || null;
}

export const DECK_SIZE = 30;
export const MAX_COPIES_PER_CARD = 3;
export const START_HAND = 3;
/** @deprecated No hand cap in match — kept for legacy references */
export const MAX_HAND = Infinity;
export const DRAW_EVERY_TURNS = 2;
