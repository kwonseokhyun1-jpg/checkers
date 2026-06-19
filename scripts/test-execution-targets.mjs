#!/usr/bin/env node
/**
 * Execution must not target enemy pieces that can still step or jump on their own.
 * Run: node scripts/test-execution-targets.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, getValidTargets, tryAutoPlay } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";

function makeState(board) {
  return {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
}

const execution = getCardDef("execution");

// Enemy stepper can move even though another enemy piece must capture.
const mandatoryJumpBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
mandatoryJumpBoard[5][2] = createPiece(COLORS.RED, 5, 2);
mandatoryJumpBoard[4][3] = createPiece(COLORS.BLACK, 4, 3);
mandatoryJumpBoard[2][1] = createPiece(COLORS.RED, 2, 1);
const mandatoryJumpState = makeState(mandatoryJumpBoard);

assert.deepEqual(
  getValidTargets(mandatoryJumpState, COLORS.BLACK, execution, []),
  [],
  "Execution should not target a piece that still has step moves"
);
assert.equal(
  canAiPlay(mandatoryJumpState, COLORS.BLACK, execution),
  false,
  "AI should not cast Execution when only movable enemies exist"
);

// Truly stuck enemy (frozen — no steps or jumps) is a valid target.
const stuckBoard = Array.from({ length: 8 }, () => Array(8).fill(null));
stuckBoard[2][3] = createPiece(COLORS.RED, 2, 3);
stuckBoard[2][3].frozenTurns = 2;
const stuckState = makeState(stuckBoard);

assert.deepEqual(
  getValidTargets(stuckState, COLORS.BLACK, execution, []),
  [[2, 3]],
  "Execution should target a walled-in enemy"
);

const work = structuredClone(stuckState);
const res = tryAutoPlay(work, COLORS.BLACK, execution);
assert.equal(res.success, true, "AI Execution should succeed on a stuck enemy");
assert.deepEqual(res.picks, [[2, 3]]);

console.log("test-execution-targets.mjs: all assertions passed");
