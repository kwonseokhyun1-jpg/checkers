#!/usr/bin/env node
/**
 * Hidden traps expire after their turn-cycle duration if unused.
 * Run: node scripts/test-trap-expiration.mjs
 */
import {
  COLORS,
  createPiece,
  setPiece,
  tickEffects,
  SIZE,
  LAST_STAND_TRAP_TURNS,
  VENGEANCE_TRAP_TURNS,
  MARTYR_TRAP_TURNS,
} from "../js/board.js";
import { createMatchMeta, hasVengeanceArmed } from "../js/gameMeta.js";
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

// Vengeance expires after 2 owner turn cycles
{
  const state = baseState();
  const vengeance = CARD_REGISTRY.find((c) => c.id === "vengeance");
  const cast = applyCard(state, COLORS.BLACK, vengeance, []);
  assert(cast.success, "Vengeance cast should succeed");
  assert(state.meta.vengeance[COLORS.BLACK] === VENGEANCE_TRAP_TURNS, "Vengeance should start with 2 turn cycles");
  assert(hasVengeanceArmed(state, COLORS.BLACK), "Vengeance should be armed");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(state.meta.vengeance[COLORS.BLACK] === 1, "After 1 owner turn cycle, 1 should remain");
  assert(hasVengeanceArmed(state, COLORS.BLACK), "Vengeance should still be armed");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(state.meta.vengeance[COLORS.BLACK] === 0, "After 2 owner turn cycles, Vengeance should deactivate");
  assert(!hasVengeanceArmed(state, COLORS.BLACK), "Vengeance should no longer be armed");
  console.log("OK: Vengeance expires after 2 turn cycles");
}

// Last Stand disappears after 1 owner turn cycle
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const lastStand = CARD_REGISTRY.find((c) => c.id === "last_stand");
  const cast = applyCard(state, COLORS.BLACK, lastStand, [[4, 3]]);
  assert(cast.success, "Last Stand cast should succeed");
  const piece = state.board[4][3];
  assert(piece.lastStand, "Last Stand should be armed");
  assert(piece.lastStandTurns === LAST_STAND_TRAP_TURNS, "Last Stand should start with 1 turn cycle");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(!piece.lastStand, "Last Stand should disappear after 1 owner turn cycle");
  assert(piece.lastStandTurns === 0, "Last Stand turn counter should be cleared");
  console.log("OK: Last Stand expires after 1 turn cycle");
}

// Martyr disappears after 2 owner turn cycles
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const martyr = CARD_REGISTRY.find((c) => c.id === "martyr");
  const cast = applyCard(state, COLORS.BLACK, martyr, [[4, 3]]);
  assert(cast.success, "Martyr cast should succeed");
  const piece = state.board[4][3];
  assert(piece.martyr, "Martyr should be armed");
  assert(piece.martyrTurns === MARTYR_TRAP_TURNS, "Martyr should start with 2 turn cycles");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(piece.martyr, "Martyr should still be armed after 1 turn cycle");
  assert(piece.martyrTurns === 1, "1 turn cycle should remain");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(!piece.martyr, "Martyr should disappear after 2 owner turn cycles");
  assert(piece.martyrTurns === 0, "Martyr turn counter should be cleared");
  console.log("OK: Martyr expires after 2 turn cycles");
}

console.log("All trap expiration tests passed.");
