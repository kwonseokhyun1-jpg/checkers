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
  "bait_switch",
  "bishops_sigil",
  "bolt",
  "bridge",
  "chain_pull",
  "chameleon",
  "conduct",
  "corner_hop",
  "coronation_day",
  "cross_bolt",
  "decoy",
  "detonate",
  "double",
  "drift",
  "echo",
  "exile_king",
  "fireblast",
  "fireline",
  "flank",
  "fog",
  "fortify",
  "frost",
  "gem_cache",
  "gem_knight",
  "ghost_guard",
  "gravity_well",
  "highlight_path",
  "hunters_mark",
  "identity_theft",
  "knight",
  "knights_charge",
  "mass_nudge",
  "mine",
  "mirror_board",
  "mirror_move",
  "mirror_shield",
  "obstacle",
  "overrun",
  "parallel",
  "pawns_zeal",
  "phalanx",
  "phase_walk",
  "pocket",
  "possession",
  "promote_zone",
  "queens_crown",
  "ricochet",
  "rooks_sigil",
  "roulette",
  "rules_lawyer",
  "sanctified",
  "sanctuary_pulse",
  "shield_bash",
  "sidestep",
  "silence",
  "slow",
  "spear_thrust",
  "succession",
  "time_slip",
  "uno_reverse",
  "vacuum",
  "venom",
  "warp_gate",
  "wild_magic",
  "wraith_2",
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

export function maxCopiesForRarity(_rarity) {
  return MAX_COPIES_PER_CARD;
}

export function maxCopiesForCard(cardOrId) {
  return MAX_COPIES_PER_CARD;
}
export const START_HAND = 3;
/** @deprecated No hand cap in match — kept for legacy references */
export const MAX_HAND = Infinity;
export const DRAW_EVERY_TURNS = 2;
