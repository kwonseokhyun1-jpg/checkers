#!/usr/bin/env node
/**
 * Restriction — opponent cannot play movement spells for 2 turns.
 * Run: node scripts/test-restriction.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, setPiece } from "../js/board.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import {
  createMatchMeta,
  startTurnMeta,
  isMovementRestricted,
  restrictionTurnsRemaining,
  RESTRICTION_DURATION_TURNS,
} from "../js/gameMeta.js";
import {
  canAiPlay,
  getMovementSpellBlockReason,
  getValidTargets,
} from "../js/cardEffects.js";

const RED = COLORS.RED;
const BLACK = COLORS.BLACK;

function baseState() {
  return {
    board: Array.from({ length: 8 }, () => Array(8).fill(null)),
    hands: { [RED]: [], [BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [RED]: [], [BLACK]: [] },
    turnNumber: { [RED]: 0, [BLACK]: 0 },
    spellPlayed: { [RED]: false, [BLACK]: false },
  };
}

const restriction = getCardDef("restriction");
const nudge = getCardDef("nudge");
const blind = getCardDef("blind");

assert.equal(restriction.effect, "restriction_2");
assert.equal(restriction.rarity, "uncommon");

const state = baseState();
const cast = applyCard(state, RED, restriction, []);
assert.equal(cast.success, true);
assert.equal(state.meta.restrictionTurns[BLACK], RESTRICTION_DURATION_TURNS);
assert.equal(isMovementRestricted(state.meta, BLACK), false, "not active until opponent turn starts");

startTurnMeta(state, BLACK);
assert.equal(isMovementRestricted(state.meta, BLACK), true);
assert.equal(restrictionTurnsRemaining(state.meta, BLACK), 2);
assert.equal(getMovementSpellBlockReason(state, BLACK, nudge), "Movement spells restricted.");
assert.equal(getValidTargets(state, BLACK, nudge, []).length, 0);
assert.equal(canAiPlay(state, BLACK, nudge), false);
assert.equal(canAiPlay(state, BLACK, blind), true, "non-movement spells still work");

startTurnMeta(state, RED);
startTurnMeta(state, BLACK);
assert.equal(isMovementRestricted(state.meta, BLACK), true);
assert.equal(restrictionTurnsRemaining(state.meta, BLACK), 1);
assert.equal(canAiPlay(state, BLACK, nudge), false);

startTurnMeta(state, RED);
startTurnMeta(state, BLACK);
assert.equal(isMovementRestricted(state.meta, BLACK), false);
setPiece(state.board, 5, 0, createPiece(BLACK, 5, 0));
assert.equal(canAiPlay(state, BLACK, nudge), true);

console.log("test-restriction.mjs: all passed");
