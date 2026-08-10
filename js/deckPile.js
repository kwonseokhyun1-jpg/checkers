import { createCardInstance } from "./cards.js";
import { getCardDef } from "./cardCatalog.js";

import { createMatchPile } from "./deckRules.js";

export function initDeckPiles(state, redIds, blackIds) {
  state.deckLists = {
    red: [...(redIds || [])],
    black: [...(blackIds || [])],
  };
  state.drawPile = {
    red: createMatchPile(redIds),
    black: createMatchPile(blackIds),
  };
  state.discardPile = { red: [], black: [] };
}

export function drawToHand(state, color, n = 1) {
  let drawn = 0;
  for (let i = 0; i < n; i++) {
const id = state.drawPile[color].pop();
    if (!id) break;
    const def = getCardDef(id);
    if (!def) continue;
    state.hands[color].push(createCardInstance(def));
    drawn++;
  }
  return drawn;
}

export function discardFromHand(state, color, instanceId) {
  const hand = state.hands[color];
  const i = hand.findIndex((c) => c.instanceId === instanceId);
  if (i < 0) return null;
  const [card] = hand.splice(i, 1);
  state.discardPile[color].push(card.id);
  return card;
}

export function pileRemaining(state, color) {
  return state.drawPile[color]?.length ?? 0;
}
