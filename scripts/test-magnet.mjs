#!/usr/bin/env node
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState, getValidTargets } from "../js/cardEffects.js";
import { applyEffect, magnetHasPull } from "../js/cardEffectHandlers.js";

const COLOR = COLORS.RED;
const card = { effect: "magnet", mode: "friendly" };

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

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const state = baseState();
const casterRow = 3;
const casterCol = 2;
setPiece(state.board, casterRow, casterCol, createPiece(COLOR, casterRow, casterCol));
setPiece(state.board, casterRow - 2, casterCol - 2, createPiece(COLORS.BLACK, casterRow - 2, casterCol - 2));
setPiece(state.board, casterRow - 2, casterCol + 2, createPiece(COLORS.BLACK, casterRow - 2, casterCol + 2));
setPiece(state.board, casterRow + 2, casterCol - 2, createPiece(COLORS.BLACK, casterRow + 2, casterCol - 2));
setPiece(state.board, casterRow + 2, casterCol + 2, createPiece(COLORS.BLACK, casterRow + 2, casterCol + 2));

assert(magnetHasPull(state, COLOR, casterRow, casterCol), "magnet should see pullable enemies");
const targets = getValidTargets(state, COLOR, card, []);
assert(targets.some(([r, c]) => r === casterRow && c === casterCol), "caster should be a valid magnet target");

const result = applyEffect(state, COLOR, "magnet", [[casterRow, casterCol]]);
assert(result.success, result.message || "magnet should succeed");
assert(state.board[casterRow - 1][casterCol - 1], "NW enemy should land adjacent");
assert(state.board[casterRow - 1][casterCol + 1], "NE enemy should land adjacent");
assert(state.board[casterRow + 1][casterCol - 1], "SW enemy should land adjacent");
assert(state.board[casterRow + 1][casterCol + 1], "SE enemy should land adjacent");
assert(!state.board[casterRow - 2][casterCol - 2], "NW origin should be empty");
assert(!state.board[casterRow - 2][casterCol + 2], "NE origin should be empty");
assert(!state.board[casterRow + 2][casterCol - 2], "SW origin should be empty");
assert(!state.board[casterRow + 2][casterCol + 2], "SE origin should be empty");

const singleState = baseState();
setPiece(singleState.board, casterRow, casterCol, createPiece(COLOR, casterRow, casterCol));
setPiece(singleState.board, casterRow - 2, casterCol - 2, createPiece(COLORS.BLACK, casterRow - 2, casterCol - 2));
const single = applyEffect(singleState, COLOR, "magnet", [[casterRow, casterCol]]);
assert(single.success, single.message || "single pull should succeed");
assert(singleState.board[casterRow - 1][casterCol - 1], "single enemy should land adjacent");

console.log("test-magnet: ok");
