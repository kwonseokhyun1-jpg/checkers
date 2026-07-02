#!/usr/bin/env node
/**
 * Backstab should only be playable when a friendly piece has a valid victim behind it.
 * Run: node scripts/test-backstab-targets.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState, canAiPlay, getValidTargets } from "../js/cardEffects.js";
import { applyEffect, backstabCanTarget } from "../js/cardEffectHandlers.js";
import { getCardDef } from "../js/cardCatalog.js";

const backstab = getCardDef("backstab");

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

// Red piece with no enemy behind — card should be disabled.
const noVictim = baseState();
noVictim.board[3][3] = createPiece(COLORS.RED, 3, 3);
assert.equal(backstabCanTarget(noVictim, COLORS.RED, 3, 3), false);
assert.deepEqual(getValidTargets(noVictim, COLORS.RED, backstab, []), []);
assert.equal(canAiPlay(noVictim, COLORS.RED, backstab), false);

// Red piece with enemy on backward diagonal — valid target.
const withVictim = baseState();
withVictim.board[3][3] = createPiece(COLORS.RED, 3, 3);
withVictim.board[4][2] = createPiece(COLORS.BLACK, 4, 2);
assert.equal(backstabCanTarget(withVictim, COLORS.RED, 3, 3), true);
assert.deepEqual(getValidTargets(withVictim, COLORS.RED, backstab, []), [[3, 3]]);
assert.equal(canAiPlay(withVictim, COLORS.RED, backstab), true);

const cast = applyEffect(withVictim, COLORS.RED, "backstab", [[3, 3]]);
assert.equal(cast.success, true, cast.message || "backstab should succeed");
assert.equal(withVictim.board[4][2], null, "victim should be removed");

// Shielded enemy behind does not count as a valid backstab target.
const shielded = baseState();
shielded.board[3][3] = createPiece(COLORS.RED, 3, 3);
shielded.board[4][4] = createPiece(COLORS.BLACK, 4, 4);
shielded.board[4][4].shieldTurns = 1;
assert.equal(backstabCanTarget(shielded, COLORS.RED, 3, 3), false);
assert.deepEqual(getValidTargets(shielded, COLORS.RED, backstab, []), []);

// Black piece: backward is toward row 0.
const blackCaster = baseState();
blackCaster.board[4][4] = createPiece(COLORS.BLACK, 4, 4);
blackCaster.board[3][3] = createPiece(COLORS.RED, 3, 3);
assert.equal(backstabCanTarget(blackCaster, COLORS.BLACK, 4, 4), true);
assert.deepEqual(getValidTargets(blackCaster, COLORS.BLACK, backstab, []), [[4, 4]]);

console.log("test-backstab-targets.mjs: all assertions passed");
