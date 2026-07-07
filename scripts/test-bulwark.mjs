#!/usr/bin/env node
/**
 * Bulwark shields all friendly pieces on the main diagonal through the pick.
 * Run: node scripts/test-bulwark.mjs
 */
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState } from "../js/cardEffects.js";
import { CARDS } from "../js/cardRegistry.js";

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
  };
  initCardState(state);
  return state;
}

function place(state, color, row, col, king = false) {
  setPiece(state.board, row, col, createPiece(color, row, col, king));
}

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

const card = CARDS.bulwark;

{
  const state = baseState();
  // Main diagonal through (5, 1): (5, 1), (7, 3)
  place(state, COLORS.RED, 5, 1);
  place(state, COLORS.RED, 7, 3);
  // Off-diagonal ally
  place(state, COLORS.RED, 5, 3);

  const res = applyCard(state, COLORS.RED, card, [[5, 1]]);
  assert(res.success, "bulwark should succeed");
  assert(state.board[5][1].shieldTurns === 2, "picked piece on diagonal gets shield");
  assert(state.board[7][3].shieldTurns === 2, "other ally on same diagonal gets shield");
  assert(state.board[5][3].shieldTurns === 0, "off-diagonal ally should not be shielded");
}

{
  const state = baseState();
  place(state, COLORS.RED, 2, 5);
  place(state, COLORS.RED, 4, 7);

  const res = applyCard(state, COLORS.RED, card, [[2, 5]]);
  assert(res.success, "bulwark should succeed on another diagonal");
  assert(state.board[2][5].shieldTurns === 2, "anchor piece shielded");
  assert(state.board[4][7].shieldTurns === 2, "diagonal ally shielded");
}

console.log("OK: bulwark shields allies on the diagonal through the pick");
