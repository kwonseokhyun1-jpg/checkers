#!/usr/bin/env node
/**
 * Plague: infect seed + all adjacent pieces; seed spreads on move; die after 2 owner turns.
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
  applyMove,
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

// Initial cast infects seed, adjacent enemy, and adjacent friendly
const state = baseState();
const seed = createPiece(COLORS.RED, 5, 4);
const adjacentEnemy = createPiece(COLORS.BLACK, 4, 5);
const adjacentAlly = createPiece(COLORS.RED, 4, 3);
const farEnemy = createPiece(COLORS.BLACK, 1, 1);
setPiece(state.board, 5, 4, seed);
setPiece(state.board, 4, 5, adjacentEnemy);
setPiece(state.board, 4, 3, adjacentAlly);
setPiece(state.board, 1, 1, farEnemy);

const cast = applyCard(state, COLORS.RED, { effect: "plague" }, [[5, 4]]);
assert(cast.success, "Plague cast should succeed");
assert(state.board[5][4]?.plagueTurns === PLAGUE_TURNS, "Seed should be infected");
assert(state.board[5][4]?.plagueSeed, "Seed should be marked as plague seed");
assert(state.board[4][5]?.plagueTurns === PLAGUE_TURNS, "Adjacent enemy should be infected");
assert(state.board[4][3]?.plagueTurns === PLAGUE_TURNS, "Adjacent ally should be infected");
assert(!state.board[1][1]?.plagueTurns, "Non-adjacent enemy should not be infected");

// Seed spreads plague to pieces adjacent to its new square when it moves
const spreadState = baseState();
const mobileSeed = createPiece(COLORS.RED, 5, 4);
const neighborAtDest = createPiece(COLORS.BLACK, 3, 4);
setPiece(spreadState.board, 5, 4, mobileSeed);
setPiece(spreadState.board, 3, 4, neighborAtDest);
applyCard(spreadState, COLORS.RED, { effect: "plague" }, [[5, 4]]);
assert(spreadState.board[5][4]?.plagueSeed, "Mobile seed should be marked");
assert(!spreadState.board[3][4]?.plagueTurns, "Far piece should not be infected yet");

applyMove(
  spreadState.board,
  { from: [5, 4], to: [4, 5], captures: [], type: "step" },
  spreadState,
);
assert(spreadState.board[3][4]?.plagueTurns === PLAGUE_TURNS, "Piece adjacent to seed after move should be infected");

// Infected allies die after 2 owner turns (caster's tick already ran before infection)
for (let i = 0; i < PLAGUE_TURNS; i++) {
  tickEffects(state.board, COLORS.RED, state);
}
assert(!state.board[5][4], "Friendly seed should die after 2 red turns");
assert(!state.board[4][3], "Adjacent ally should die after 2 red turns");

// Enemies infected during the caster's turn defer their first owner tick
const deferState = baseState();
setPiece(deferState.board, 5, 4, createPiece(COLORS.RED, 5, 4));
setPiece(deferState.board, 4, 5, createPiece(COLORS.BLACK, 4, 5));
tickEffects(deferState.board, COLORS.RED, deferState);
applyCard(deferState, COLORS.RED, { effect: "plague" }, [[5, 4]]);
assert(deferState.board[4][5]?.plagueTurns === PLAGUE_TURNS, "Enemy should start at 2 when infected");
tickEffects(deferState.board, COLORS.BLACK, deferState);
assert(deferState.board[4][5]?.plagueTurns === PLAGUE_TURNS, "Enemy should still show 2 after deferred first owner tick");

for (let i = 0; i < PLAGUE_TURNS; i++) {
  tickEffects(deferState.board, COLORS.BLACK, deferState);
}
assert(!deferState.board[4][5], "Adjacent enemy should die after 2 black owner turns (plus deferred tick)");
assert(state.board[1][1], "Uninfected enemy should survive");

console.log("test-plague.mjs: all assertions passed");
