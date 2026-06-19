#!/usr/bin/env node
/**
 * Pieces placed on the far row via swaps/teleports should auto-crown.
 * Run: node scripts/test-promote-on-placement.mjs
 */
import { applyCard } from "../js/cardEffectHandlers.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState } from "../js/cardEffects.js";
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";

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

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Hostile Swap: red man swaps onto black's back rank (row 0) and crowns.
{
  const state = baseState();
  const friendly = createPiece(COLORS.RED, 3, 2, false);
  const enemy = createPiece(COLORS.BLACK, 0, 1, false);
  setPiece(state.board, 3, 2, friendly);
  setPiece(state.board, 0, 1, enemy);
  const res = applyCard(state, COLORS.RED, { effect: "hostile_swap" }, [[3, 2], [0, 1]]);
  assert(res.success, "hostile_swap should succeed");
  assert(state.board[0][1]?.king === true, "friendly piece on far row should be king");
  assert(state.board[0][1]?.color === COLORS.RED, "friendly piece should occupy enemy square");
  assert(state.board[3][2]?.color === COLORS.BLACK, "enemy should occupy friendly square");
}

// Shadow Swap: two friendlies swap; one lands on far row and crowns.
{
  const state = baseState();
  const a = createPiece(COLORS.RED, 2, 1, false);
  const b = createPiece(COLORS.RED, 0, 3, false);
  setPiece(state.board, 2, 1, a);
  setPiece(state.board, 0, 3, b);
  const res = applyCard(state, COLORS.RED, { effect: "swap_friendly" }, [[2, 1], [0, 3]]);
  assert(res.success, "swap_friendly should succeed");
  assert(state.board[0][3]?.king === true, "man swapped onto far row should crown");
}

// Long Step: red man leaps onto the far rank and crowns.
{
  const state = baseState();
  const friendly = createPiece(COLORS.RED, 2, 1, false);
  setPiece(state.board, 2, 1, friendly);
  const res = applyCard(state, COLORS.RED, { effect: "long_step" }, [[2, 1], [0, 3]]);
  assert(res.success, "long_step should succeed");
  assert(state.board[0][3]?.king === true, "long_step onto far row should crown");
  assert(res.message.includes("Crowned"), "long_step should report crown");
}

// Nudge: red man steps onto the far rank and crowns.
{
  const state = baseState();
  const friendly = createPiece(COLORS.RED, 1, 2, false);
  setPiece(state.board, 1, 2, friendly);
  const res = applyCard(state, COLORS.RED, { effect: "nudge" }, [[1, 2], [0, 3]]);
  assert(res.success, "nudge should succeed");
  assert(state.board[0][3]?.king === true, "nudge onto far row should crown");
  assert(res.message.includes("Crowned"), "nudge should report crown");
}

console.log("test-promote-on-placement: ok");
