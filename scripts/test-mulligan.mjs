/**
 * Mulligan redraws the hand and grants a bonus spell this turn.
 * Run: node scripts/test-mulligan.mjs
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import { createCardInstance } from "../js/cards.js";

const mulligan = getCardDef("mulligan");

function makeState(handIds) {
  return {
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
}

const state = makeState(["nudge", "backstep", "ward"]);
const beforeIds = state.hands[COLORS.RED].map((c) => c.instanceId);

const result = applyEffect(state, COLORS.RED, mulligan.effect, []);
assert.equal(result.success, true);
assert.equal(state.hands[COLORS.RED].length, 3);
assert.equal(state.meta.extraSpellCast[COLORS.RED], true);
assert.match(result.message, /cast another spell/i);
assert.ok(
  state.hands[COLORS.RED].every((c) => !beforeIds.includes(c.instanceId)),
  "hand should contain freshly drawn card instances"
);

const emptyHand = makeState([]);
const emptyResult = applyEffect(emptyHand, COLORS.RED, mulligan.effect, []);
assert.equal(emptyResult.success, true);
assert.equal(emptyHand.hands[COLORS.RED].length, 0);
assert.equal(emptyHand.meta.extraSpellCast[COLORS.RED], true);

assert.equal(getCardDef("purify").rarity, "uncommon");

console.log("test-mulligan.mjs: all assertions passed");
