#!/usr/bin/env node
/**
 * Bomb and Pyromancy must respect spell protections (shield, Last Stand, fortify, deflect).
 * Run: node scripts/test-bomb-pyromancy-shields.mjs
 */
import {
  COLORS,
  createPiece,
  setPiece,
  applyMove,
  applyBurnToPiece,
  tickEffects,
  getAllMovesForColor,
  SIZE,
  LAST_STAND_SHIELD_TURNS,
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

// Bomb: Last Stand on adjacent enemy survives
{
  const state = baseState();
  const mover = createPiece(COLORS.RED, 5, 4);
  const victim = createPiece(COLORS.BLACK, 4, 4);
  setPiece(state.board, 5, 4, mover);
  setPiece(state.board, 4, 4, victim);

  const lastStand = CARD_REGISTRY.find((c) => c.id === "last_stand");
  applyCard(state, COLORS.BLACK, lastStand, [[4, 4]]);
  assert(state.board[4][4].lastStand, "Last Stand armed");

  applyCard(state, COLORS.RED, { effect: "bomb" }, [[5, 4]]);
  const moves = getAllMovesForColor(state.board, COLORS.RED, state);
  const move = moves.find((m) => m.from[0] === 5 && m.from[1] === 4 && m.to[0] === 4 && m.to[1] === 5);
  assert(move, "Bomb mover should have a step move");

  applyMove(state.board, move, state);
  const survivor = state.board[4][4];
  assert(survivor?.color === COLORS.BLACK, "Last Stand should survive bomb blast");
  assert(!survivor.lastStand, "Last Stand consumed");
  assert(survivor.shieldTurns === LAST_STAND_SHIELD_TURNS, "Last Stand grants ultra shield after bomb");
  console.log("OK: bomb respects Last Stand");
}

// Bomb: shield blocks blast
{
  const state = baseState();
  const mover = createPiece(COLORS.RED, 5, 4);
  const victim = createPiece(COLORS.BLACK, 4, 4);
  victim.shieldTurns = 1;
  setPiece(state.board, 5, 4, mover);
  setPiece(state.board, 4, 4, victim);

  applyCard(state, COLORS.RED, { effect: "bomb" }, [[5, 4]]);
  const moves = getAllMovesForColor(state.board, COLORS.RED, state);
  const move = moves.find((m) => m.from[0] === 5 && m.from[1] === 4 && m.to[0] === 4 && m.to[1] === 5);
  applyMove(state.board, move, state);

  assert(state.board[4][4]?.color === COLORS.BLACK, "Shielded piece survives bomb");
  assert(state.board[4][4].shieldTurns === 0, "Shield consumed by bomb");
  console.log("OK: bomb respects shield");
}

// Bomb: fortify blocks blast
{
  const state = baseState();
  const mover = createPiece(COLORS.RED, 5, 4);
  const victim = createPiece(COLORS.BLACK, 4, 4);
  victim.fortifyTurns = 2;
  setPiece(state.board, 5, 4, mover);
  setPiece(state.board, 4, 4, victim);

  applyCard(state, COLORS.RED, { effect: "bomb" }, [[5, 4]]);
  const moves = getAllMovesForColor(state.board, COLORS.RED, state);
  const move = moves.find((m) => m.from[0] === 5 && m.from[1] === 4 && m.to[0] === 4 && m.to[1] === 5);
  applyMove(state.board, move, state);

  assert(state.board[4][4]?.color === COLORS.BLACK, "Fortified piece survives bomb");
  assert(state.board[4][4].fortifyTurns === 2, "Fortify unchanged by bomb");
  console.log("OK: bomb respects fortify");
}

// Pyromancy: shield burns off instead of applying blaze
{
  const state = baseState();
  const victim = createPiece(COLORS.BLACK, 3, 2);
  victim.shieldTurns = 1;
  setPiece(state.board, 3, 2, victim);

  const pyro = CARD_REGISTRY.find((c) => c.id === "pyromancy");
  const res = applyCard(state, COLORS.RED, pyro, [[3, 2], [4, 3]]);
  assert(res.success, "Pyromancy cast succeeds when shield burns off");

  assert(state.board[3][2]?.color === COLORS.BLACK, "Shielded piece survives pyromancy");
  assert(state.board[3][2].shieldTurns === 0, "Shield burned off");
  assert(state.board[3][2].blazeTurns === 0, "No blaze applied when shield blocks");
  console.log("OK: pyromancy burns off shield");
}

// Pyromancy: Last Stand triggers when blaze kills
{
  const state = baseState();
  const victim = createPiece(COLORS.BLACK, 3, 2);
  setPiece(state.board, 3, 2, victim);

  const lastStand = CARD_REGISTRY.find((c) => c.id === "last_stand");
  applyCard(state, COLORS.BLACK, lastStand, [[3, 2]]);

  applyBurnToPiece(state.board, state, 3, 2, 1, COLORS.RED);
  assert(state.board[3][2].blazeTurns === 1, "Burn applied with Last Stand armed");

  tickEffects(state.board, COLORS.BLACK, state);
  const survivor = state.board[3][2];
  assert(survivor?.color === COLORS.BLACK, "Last Stand survives blaze kill");
  assert(!survivor.lastStand, "Last Stand consumed on blaze kill");
  assert(survivor.shieldTurns === LAST_STAND_SHIELD_TURNS, "Ultra shield after blaze Last Stand");
  console.log("OK: pyromancy blaze kill respects Last Stand");
}

// Pyromancy: fortify blocks burn application
{
  const state = baseState();
  const victim = createPiece(COLORS.BLACK, 3, 2);
  victim.fortifyTurns = 2;
  setPiece(state.board, 3, 2, victim);

  assert(!applyBurnToPiece(state.board, state, 3, 2, 2, COLORS.RED), "Burn blocked on fortified piece");
  assert(state.board[3][2].blazeTurns === 0, "No blaze on fortified piece");
  console.log("OK: pyromancy blocked by fortify");
}

console.log("All bomb/pyromancy shield tests passed");
