/**
 * Conjure adds 2 random playable cards that are not in the caster's deck list.
 * Run: node scripts/test-conjure.mjs
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef, getPlayableCards, DECK_SIZE } from "../js/cardCatalog.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import { canCastInstant, getInstantCastBlockReason } from "../js/cardEffects.js";
import { createCardInstance } from "../js/cards.js";
import { initDeckPiles } from "../js/deckPile.js";

const conjure = getCardDef("conjure");
assert.ok(conjure, "conjure must exist in registry");
assert.equal(conjure.rarity, "epic");
assert.equal(conjure.mode, "instant");
assert.equal(conjure.effect, "conjure");

const playable = getPlayableCards();
const outsideIds = playable.filter((c) => c.id !== "nudge" && c.id !== "conjure").map((c) => c.id);
assert.ok(outsideIds.length >= 2, "need outside-deck options for the test");

const deckIds = Array(DECK_SIZE).fill("nudge");
deckIds[0] = "conjure";

function makeState(handIds = ["conjure"]) {
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
  initDeckPiles(state, deckIds, []);
  // Match start draws from pile — keep hand as provided for the effect test.
  state.hands[COLORS.RED] = handIds.map((id) => createCardInstance(getCardDef(id)));
  return state;
}

const state = makeState();
const beforeLen = state.hands[COLORS.RED].length;
const result = applyEffect(state, COLORS.RED, conjure.effect, []);
assert.equal(result.success, true);
assert.equal(state.hands[COLORS.RED].length, beforeLen + 2);
assert.match(result.message, /Conjure/i);

const added = state.hands[COLORS.RED].slice(beforeLen);
for (const card of added) {
  assert.ok(!deckIds.includes(card.id), `conjured card ${card.id} must not be in deck list`);
  assert.ok(getCardDef(card.id), `conjured card ${card.id} must be a real spell`);
}

const fullDeckIds = playable.slice(0, DECK_SIZE).map((c) => c.id);
while (fullDeckIds.length < DECK_SIZE) fullDeckIds.push("nudge");
const emptyPool = makeState(["conjure"]);
emptyPool.deckLists[COLORS.RED] = playable.map((c) => c.id);
assert.equal(canCastInstant(emptyPool, COLORS.RED, conjure), false);
assert.match(getInstantCastBlockReason(emptyPool, COLORS.RED, conjure), /outside your deck/i);
const emptyResult = applyEffect(emptyPool, COLORS.RED, conjure.effect, []);
assert.equal(emptyResult.success, false);
assert.match(emptyResult.message, /outside your deck/i);

console.log("test-conjure.mjs: all assertions passed");
