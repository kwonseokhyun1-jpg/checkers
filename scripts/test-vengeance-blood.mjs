#!/usr/bin/env node
/**
 * Vengeance trap: capturer dies; venging piece survives 2 owner turns (blood counters), then dies.
 * Run: node scripts/test-vengeance-blood.mjs
 */
import {
  COLORS,
  createPiece,
  setPiece,
  getJumpMoves,
  applyMove,
  tickEffects,
  SIZE,
  VENGEANCE_BLOOD_TURNS,
} from "../js/board.js";
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
// Black piece at (4,3) with Vengeance armed; red jumps from (5,2) over it to (3,4)
setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
const vengeance = CARD_REGISTRY.find((c) => c.id === "vengeance");
const cast = applyCard(state, COLORS.BLACK, vengeance, []);
assert(cast.success, "Vengeance cast should succeed: " + (cast.message || ""));

setPiece(state.board, 5, 2, createPiece(COLORS.RED, 5, 2));
const jumps = getJumpMoves(state.board, state.board[5][2], COLORS.RED, state);
const capture = jumps.find((m) => m.captures?.some(([r, c]) => r === 4 && c === 3));
assert(capture, "Jump capture over Vengeance piece should be legal");

applyMove(state.board, capture, state);
const survivor = state.board[4][3];
assert(survivor && survivor.color === COLORS.BLACK, "Venging piece should survive on the capture square");
assert(!state.board[3][4], "Capturer should be destroyed");
assert(survivor.bloodTurns === VENGEANCE_BLOOD_TURNS, "Venging piece should start with 2 blood counters");
assert(state.captured[COLORS.BLACK].length === 0, "Venging piece should not be in captured pile yet");
assert(state.captured[COLORS.RED].length === 1, "Capturer should be in captured pile");

tickEffects(state.board, COLORS.BLACK, state);
assert(state.board[4][3]?.bloodTurns === 1, "After 1 owner turn, 1 blood counter should remain");

tickEffects(state.board, COLORS.BLACK, state);
assert(!state.board[4][3], "After 2 owner turns, venging piece should die");
assert(state.captured[COLORS.BLACK].length === 1, "Venging piece should be captured after blood expires");

console.log("OK: Vengeance blood survival");
