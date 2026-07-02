#!/usr/bin/env node
/**
 * Nudge may only move forward-diagonally (not backward).
 * Run: node scripts/test-nudge-forward-only.mjs
 */
import { COLORS, createPiece, setPiece, getNudgeTarget, getBackstepTarget } from "../js/board.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { getValidTargets } from "../js/cardEffects.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState } from "../js/cardEffects.js";
import { SIZE } from "../js/board.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

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

const card = { id: "nudge", effect: "nudge", mode: "f_empty" };

// Forward nudge succeeds for red.
{
  const state = baseState();
  setPiece(state.board, 3, 2, createPiece(COLORS.RED, 3, 2, false));
  const res = applyCard(state, COLORS.RED, { effect: "nudge" }, [[3, 2], [2, 3]]);
  assert(res.success, "forward nudge should succeed");
  assert(state.board[2][3]?.color === COLORS.RED, "piece should land forward");
}

// Backward nudge fails for red.
{
  const state = baseState();
  setPiece(state.board, 3, 2, createPiece(COLORS.RED, 3, 2, false));
  const res = applyCard(state, COLORS.RED, { effect: "nudge" }, [[3, 2], [4, 1]]);
  assert(!res.success, "backward nudge should fail");
}

// Valid targets exclude backward squares.
{
  const state = baseState();
  const piece = createPiece(COLORS.RED, 3, 2, false);
  setPiece(state.board, 3, 2, piece);
  const forward = getNudgeTarget(state.board, piece, state);
  const backward = getBackstepTarget(state.board, piece, state);
  assert(forward.length > 0, "should have forward targets");
  assert(backward.length > 0, "should have backward targets for backstep comparison");
  const dests = getValidTargets(state, COLORS.RED, card, [[3, 2]]);
  for (const [r, c] of backward) {
    assert(!dests.some(([dr, dc]) => dr === r && dc === c), "nudge must not offer backward squares");
  }
  for (const [r, c] of forward) {
    assert(dests.some(([dr, dc]) => dr === r && dc === c), "nudge should offer forward squares");
  }
}

console.log("test-nudge-forward-only: ok");
