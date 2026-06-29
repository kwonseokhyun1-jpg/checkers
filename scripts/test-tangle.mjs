#!/usr/bin/env node
import assert from "node:assert/strict";
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState, getValidTargets } from "../js/cardEffects.js";
import { applyEffect } from "../js/cardEffectHandlers.js";

const COLOR = COLORS.RED;
const card = { id: "tangle", effect: "tangle", mode: "e_e" };

function baseState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLOR,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
  };
  initCardState(state);
  return state;
}

const state = baseState();
const enemyA = [1, 1];
const enemyB = [6, 6];
setPiece(state.board, enemyA[0], enemyA[1], createPiece(COLORS.BLACK, enemyA[0], enemyA[1]));
setPiece(state.board, enemyB[0], enemyB[1], createPiece(COLORS.BLACK, enemyB[0], enemyB[1]));

const firstTargets = getValidTargets(state, COLOR, card, []);
assert(firstTargets.some(([r, c]) => r === enemyA[0] && c === enemyA[1]), "first enemy should be targetable");

const secondTargets = getValidTargets(state, COLOR, card, [enemyA]);
assert(
  secondTargets.some(([r, c]) => r === enemyB[0] && c === enemyB[1]),
  "non-adjacent second enemy should be targetable"
);

const result = applyEffect(state, COLOR, "tangle", [enemyA, enemyB]);
assert.equal(result.success, true, result.message || "tangle should succeed on non-adjacent enemies");
assert.equal(state.board[enemyA[0]][enemyA[1]]?.color, COLORS.BLACK, "enemy A square should still hold an enemy");
assert.equal(state.board[enemyB[0]][enemyB[1]]?.color, COLORS.BLACK, "enemy B square should still hold an enemy");
assert.equal(state.board[enemyA[0]][enemyA[1]]?.frozenTurns, 1, "swapped enemy at A should be frozen");
assert.equal(state.board[enemyB[0]][enemyB[1]]?.frozenTurns, 1, "swapped enemy at B should be frozen");

console.log("Tangle non-adjacent targeting test: OK");
