#!/usr/bin/env node
/**
 * Stab should only be playable when a friendly piece has a valid victim ahead on a forward diagonal.
 * Run: node scripts/test-stab-targets.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState, canAiPlay, getValidTargets } from "../js/cardEffects.js";
import { applyEffect, forwardBoltCanTarget } from "../js/cardEffectHandlers.js";
import { getCardDef } from "../js/cardCatalog.js";

const stab = getCardDef("stab");

function baseState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  return state;
}

// Red piece with no enemy ahead — card should be disabled.
const noVictim = baseState();
noVictim.board[4][3] = createPiece(COLORS.RED, 4, 3);
assert.equal(forwardBoltCanTarget(noVictim, COLORS.RED, 4, 3), false);
assert.deepEqual(getValidTargets(noVictim, COLORS.RED, stab, []), []);
assert.equal(canAiPlay(noVictim, COLORS.RED, stab), false);

// Red piece with enemy on forward diagonal — valid target.
const withVictim = baseState();
withVictim.board[4][3] = createPiece(COLORS.RED, 4, 3);
withVictim.board[3][2] = createPiece(COLORS.BLACK, 3, 2);
assert.equal(forwardBoltCanTarget(withVictim, COLORS.RED, 4, 3), true);
assert.deepEqual(getValidTargets(withVictim, COLORS.RED, stab, []), [[4, 3]]);
assert.deepEqual(getValidTargets(withVictim, COLORS.RED, stab, [[4, 3]]), [[3, 2]]);
assert.equal(canAiPlay(withVictim, COLORS.RED, stab), true);

const cast = applyEffect(withVictim, COLORS.RED, "forward_bolt", [[4, 3], [3, 2]]);
assert.equal(cast.success, true, cast.message || "stab should succeed");
assert.equal(withVictim.board[3][2], null, "victim should be removed");

// Shielded enemy ahead does not count as a valid stab target.
const shielded = baseState();
shielded.board[4][3] = createPiece(COLORS.RED, 4, 3);
shielded.board[3][4] = createPiece(COLORS.BLACK, 3, 4);
shielded.board[3][4].shieldTurns = 1;
assert.equal(forwardBoltCanTarget(shielded, COLORS.RED, 4, 3), false);
assert.deepEqual(getValidTargets(shielded, COLORS.RED, stab, []), []);

// Black piece: forward is toward row 7.
const blackCaster = baseState();
blackCaster.board[3][4] = createPiece(COLORS.BLACK, 3, 4);
blackCaster.board[4][3] = createPiece(COLORS.RED, 4, 3);
assert.equal(forwardBoltCanTarget(blackCaster, COLORS.BLACK, 3, 4), true);
assert.deepEqual(getValidTargets(blackCaster, COLORS.BLACK, stab, []), [[3, 4]]);

console.log("test-stab-targets.mjs: all assertions passed");
