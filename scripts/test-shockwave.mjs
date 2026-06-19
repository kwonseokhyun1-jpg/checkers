#!/usr/bin/env node
/**
 * Shockwave: arm on cast, paralyze adjacent pieces on move (non-lethal).
 * Run: node scripts/test-shockwave.mjs
 */
import { applyCard } from "../js/cardEffectHandlers.js";
import { applyMove, COLORS, createPiece, setPiece, SIZE, getAllMovesForColor } from "../js/board.js";
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
const mover = createPiece(COLORS.RED, 5, 4);
const adjacentEnemy = createPiece(COLORS.BLACK, 3, 4);
const adjacentFriendly = createPiece(COLORS.RED, 5, 5);
setPiece(state.board, 5, 4, mover);
setPiece(state.board, 3, 4, adjacentEnemy);
setPiece(state.board, 5, 5, adjacentFriendly);

const cast = applyCard(state, COLORS.RED, { effect: "shockwave" }, [[5, 4]]);
assert(cast.success, "Shockwave cast should succeed");
assert(state.board[5][4].shockwaveArmed, "Mover should be shockwave armed");

const moves = getAllMovesForColor(state.board, COLORS.RED, state);
const move = moves.find((m) => m.from[0] === 5 && m.from[1] === 4 && m.to[0] === 4 && m.to[1] === 5);
assert(move, "Should have a step move to (4,5)");

const survivor = applyMove(state.board, move, state);
assert(survivor, "Mover should survive (unlike bomb)");
assert(!survivor.shockwaveArmed, "Shockwave should be consumed");
assert(state.board[4][5]?.color === COLORS.RED, "Mover should be on destination");
assert(state.board[3][4]?.paralyzedTurns === 1, "Adjacent enemy should be paralyzed");
assert(state.board[5][5]?.paralyzedTurns === 1, "Adjacent friendly should be paralyzed");

console.log("test-shockwave.mjs: all assertions passed");
