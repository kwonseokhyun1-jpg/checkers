/** Card draw pool and helpers */
import { CARD_REGISTRY, CARDS } from "./cardRegistry.js";

export const DRAW_COST = 10;
export const START_GEMS = 200;
export const HAND_MAX = 6;

export { CARD_REGISTRY, CARDS };

export const CARD_IDS = Object.fromEntries(
  CARD_REGISTRY.map((c) => [
    c.id.replace(/[^a-z0-9]/gi, "_").toUpperCase(),
    c.id,
  ])
);

const TOTAL_WEIGHT = CARD_REGISTRY.reduce((s, c) => s + c.weight, 0);

export function drawRandomCard() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const card of CARD_REGISTRY) {
    roll -= card.weight;
    if (roll <= 0) return { ...card };
  }
  return { ...CARD_REGISTRY[0] };
}

export function createCardInstance(cardDef) {
  return {
    instanceId: `${cardDef.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...cardDef,
  };
}

export function getCardById(id) {
  return CARDS[id] || null;
}
