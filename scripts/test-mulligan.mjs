/**
 * Mulligan shuffles the hand into the deck, redraws from that pile,
 * and grants a bonus spell this turn.
 * Run: node scripts/test-mulligan.mjs
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyCard, applyEffect } from "../js/cardEffectHandlers.js";
import { createCardInstance } from "../js/cards.js";
import { initDeckPiles } from "../js/deckPile.js";

const mulligan = getCardDef("mulligan");

function makeState(handIds, drawIds = []) {
  const state = {
    board: Array.from({ length: 8 }, () => Array(8).fill(null)),
    hands: {
      [COLORS.RED]: handIds.map((id) => createCardInstance(getCardDef(id))),
      [COLORS.BLACK]: [],
    },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initDeckPiles(state, drawIds, []);
  return state;
}

const deckIds = ["ward", "nudge", "backstep", "dash", "retreat"];
const handIds = ["nudge", "backstep", "ward"];
const state = makeState(handIds, deckIds);
const beforeIds = state.hands[COLORS.RED].map((c) => c.instanceId);
const poolBefore = [...state.drawPile[COLORS.RED], ...handIds];

const result = applyEffect(state, COLORS.RED, mulligan.effect, []);
assert.equal(result.success, true);
assert.equal(state.hands[COLORS.RED].length, 3);
assert.equal(state.meta.extraSpellCast[COLORS.RED], true);
assert.match(result.message, /cast another spell/i);
assert.ok(
  state.hands[COLORS.RED].every((c) => !beforeIds.includes(c.instanceId)),
  "hand should contain freshly drawn card instances"
);
assert.equal(state.discardPile[COLORS.RED].length, 0, "mulliganed cards return to the deck, not discard");
assert.equal(
  state.drawPile[COLORS.RED].length + state.hands[COLORS.RED].length,
  poolBefore.length,
  "hand + remaining pile should equal the pre-mulligan card pool"
);
assert.ok(
  state.hands[COLORS.RED].every((c) => poolBefore.includes(c.id)),
  "redrawn cards must come from the shuffled deck+hand pool"
);

// Casting Mulligan via applyCard spends the cast copy so it is not reshuffled.
const castState = makeState(["mulligan", "nudge", "backstep"], ["ward", "dash", "retreat"]);
const castCard = castState.hands[COLORS.RED][0];
assert.equal(castCard.id, "mulligan");
const castPool = ["nudge", "backstep", "ward", "dash", "retreat"];
const castResult = applyCard(castState, COLORS.RED, castCard, []);
assert.equal(castResult.success, true);
assert.equal(castState.hands[COLORS.RED].length, 2, "draw the non-cast hand size");
assert.equal(
  castState.drawPile[COLORS.RED].length + castState.hands[COLORS.RED].length,
  castPool.length,
  "spent Mulligan leaves the match; other cards stay in deck pool"
);
assert.ok(
  castState.hands[COLORS.RED].every((c) => castPool.includes(c.id)),
  "post-cast hand comes only from the remaining deck pool"
);
assert.ok(
  !castState.hands[COLORS.RED].some((c) => c.instanceId === castCard.instanceId),
  "spent Mulligan instance must not remain in hand"
);

const emptyHand = makeState([], ["nudge", "ward"]);
const emptyResult = applyEffect(emptyHand, COLORS.RED, mulligan.effect, []);
assert.equal(emptyResult.success, true);
assert.equal(emptyHand.hands[COLORS.RED].length, 0);
assert.equal(emptyHand.meta.extraSpellCast[COLORS.RED], true);
assert.equal(emptyHand.drawPile[COLORS.RED].length, 2, "empty hand draws nothing from deck");

assert.equal(getCardDef("purify").rarity, "uncommon");

console.log("test-mulligan.mjs: all assertions passed");
