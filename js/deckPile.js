import { createCardInstance } from "./cards.js";
import { getCardDef } from "./cardCatalog.js";

import { createMatchPile, shuffle } from "./deckRules.js";

export function initDeckPiles(state, redIds, blackIds) {
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

/** Move every card currently in hand into the draw pile and reshuffle. */
export function shuffleHandIntoDrawPile(state, color) {
  const hand = state.hands[color];
  if (!hand?.length) return 0;
  if (!state.drawPile[color]) state.drawPile[color] = [];
  let n = 0;
  for (const card of hand) {
    if (!card?.id) continue;
    state.drawPile[color].push(card.id);
    n++;
  }
  hand.length = 0;
  state.drawPile[color] = shuffle(state.drawPile[color]);
  return n;
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
