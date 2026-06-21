#!/usr/bin/env node
/**
 * Duel: both pieces die unless shielded; friendly survives vs frozen/paralyzed enemy.
 * Run: node scripts/test-duel.mjs
 */
import { applyCard } from "../js/cardEffectHandlers.js";
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState } from "../js/cardEffects.js";

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

const duel = { effect: "duel" };

// Normal duel — both destroyed.
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.RED, 4, 3));
  setPiece(state.board, 3, 4, createPiece(COLORS.BLACK, 3, 4));
  const res = applyCard(state, COLORS.RED, duel, [[4, 3], [3, 4]]);
  assert(res.success, "Duel should succeed");
  assert(!state.board[4][3], "Friendly should be destroyed");
  assert(!state.board[3][4], "Enemy should be destroyed");
}

// Frozen enemy — friendly survives.
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.RED, 4, 3));
  const enemy = createPiece(COLORS.BLACK, 3, 4);
  enemy.frozenTurns = 2;
  setPiece(state.board, 3, 4, enemy);
  const res = applyCard(state, COLORS.RED, duel, [[4, 3], [3, 4]]);
  assert(res.success, "Duel vs frozen enemy should succeed");
  assert(state.board[4][3]?.color === COLORS.RED, "Friendly should survive vs frozen enemy");
  assert(!state.board[3][4], "Frozen enemy should be destroyed");
  assert(/survives/i.test(res.message), "Should mention friendly survival");
}

// Paralyzed enemy — friendly survives.
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.RED, 4, 3));
  const enemy = createPiece(COLORS.BLACK, 3, 4);
  enemy.paralyzedTurns = 1;
  setPiece(state.board, 3, 4, enemy);
  const res = applyCard(state, COLORS.RED, duel, [[4, 3], [3, 4]]);
  assert(res.success, "Duel vs paralyzed enemy should succeed");
  assert(state.board[4][3]?.color === COLORS.RED, "Friendly should survive vs paralyzed enemy");
  assert(!state.board[3][4], "Paralyzed enemy should be destroyed");
}

// Shielded friendly still survives normal duel.
{
  const state = baseState();
  const friendly = createPiece(COLORS.RED, 4, 3);
  friendly.shieldTurns = 1;
  setPiece(state.board, 4, 3, friendly);
  setPiece(state.board, 3, 4, createPiece(COLORS.BLACK, 3, 4));
  const res = applyCard(state, COLORS.RED, duel, [[4, 3], [3, 4]]);
  assert(res.success, "Duel vs shielded friendly should succeed");
  assert(state.board[4][3]?.color === COLORS.RED, "Shielded friendly should survive");
  assert(!state.board[3][4], "Enemy should be destroyed");
}

console.log("test-duel.mjs: all assertions passed");
