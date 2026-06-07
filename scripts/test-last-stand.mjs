#!/usr/bin/env node
/**
 * Last Stand should survive a jump capture and grant ultra shield.
 * Run: node scripts/test-last-stand.mjs
 */
import { COLORS, createPiece, setPiece, getJumpMoves, applyMove, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState } from "../js/cardEffects.js";
import { CARD_REGISTRY } from "../js/cardRegistry.js";

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
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

const state = baseState();
// Black piece at (4,3) with Last Stand; red jumps from (5,2) over it to (3,4)
setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
const lastStand = CARD_REGISTRY.find((c) => c.id === "last_stand");
const cast = applyCard(state, COLORS.BLACK, lastStand, [[4, 3]]);
assert(cast.success, "Last Stand cast should succeed: " + (cast.message || ""));
assert(state.board[4][3].lastStand === true, "Last Stand should be armed");

setPiece(state.board, 5, 2, createPiece(COLORS.RED, 5, 2));
const jumps = getJumpMoves(state.board, state.board[5][2], COLORS.RED, state);
const capture = jumps.find((m) => m.captures?.some(([r, c]) => r === 4 && c === 3));
assert(capture, "Jump capture over Last Stand piece should be legal");

applyMove(state.board, capture, state);
const survivor = state.board[4][3];
assert(survivor && survivor.color === COLORS.BLACK, "Last Stand piece should survive capture");
assert(survivor.lastStand === false, "Last Stand should be consumed");
assert(survivor.shieldTurns === 3, "Last Stand should grant 3-turn ultra shield");
assert(state.captured[COLORS.BLACK].length === 0, "Piece should not be added to captured pile");

console.log("OK: Last Stand survives jump capture");
