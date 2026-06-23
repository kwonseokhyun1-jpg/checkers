#!/usr/bin/env node
/**
 * Plague: infect friendly seed + adjacent enemies; all die after 2 owner turns.
 * Run: node scripts/test-plague.mjs
 */
import { applyCard } from "../js/cardEffectHandlers.js";
import {
  COLORS,
  createPiece,
  setPiece,
  SIZE,
  tickEffects,
  PLAGUE_TURNS,
} from "../js/board.js";
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

const state = baseState();
const seed = createPiece(COLORS.RED, 5, 4);
const adjacentEnemy = createPiece(COLORS.BLACK, 4, 5);
const farEnemy = createPiece(COLORS.BLACK, 1, 1);
setPiece(state.board, 5, 4, seed);
setPiece(state.board, 4, 5, adjacentEnemy);
setPiece(state.board, 1, 1, farEnemy);

const cast = applyCard(state, COLORS.RED, { effect: "plague" }, [[5, 4]]);
assert(cast.success, "Plague cast should succeed");
assert(state.board[5][4]?.plagueTurns === PLAGUE_TURNS, "Seed should be infected");
assert(state.board[4][5]?.plagueTurns === PLAGUE_TURNS, "Adjacent enemy should be infected");
assert(!state.board[1][1]?.plagueTurns, "Non-adjacent enemy should not be infected");

for (let i = 0; i < PLAGUE_TURNS; i++) {
  tickEffects(state.board, COLORS.RED, state);
}
assert(!state.board[5][4], "Friendly seed should die after 2 red turns");

for (let i = 0; i < PLAGUE_TURNS; i++) {
  tickEffects(state.board, COLORS.BLACK, state);
}
assert(!state.board[4][5], "Adjacent enemy should die after 2 black turns");
assert(state.board[1][1], "Uninfected enemy should survive");

console.log("test-plague.mjs: all assertions passed");
