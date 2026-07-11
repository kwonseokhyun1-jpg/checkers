#!/usr/bin/env node
/**
 * Martyr hidden trap — enemy capture/spell kill on their turn draws 2 cards.
 * Run: node scripts/test-martyr.mjs
 */
import {
  COLORS,
  createPiece,
  setPiece,
  getJumpMoves,
  applyMove,
  tickEffects,
  resolveCapture,
  removePiece,
  SIZE,
  MARTYR_TRAP_TURNS,
} from "../js/board.js";
import { createMatchMeta, takeTrapHistoryReveal } from "../js/gameMeta.js";
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
    drawPile: { [COLORS.RED]: [], [COLORS.BLACK]: ["nudge", "backstep", "sidestep"] },
    discardPile: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
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

// Enemy capture on their turn draws 2 cards
{
  const state = baseState();
  state.turn = COLORS.RED;
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const martyr = CARD_REGISTRY.find((c) => c.id === "martyr");
  const cast = applyCard(state, COLORS.BLACK, martyr, [[4, 3]]);
  assert(cast.success, "Martyr cast should succeed");
  assert(state.board[4][3].martyr === true, "Martyr should be armed");

  setPiece(state.board, 5, 2, createPiece(COLORS.RED, 5, 2));
  const jumps = getJumpMoves(state.board, state.board[5][2], COLORS.RED, state);
  const capture = jumps.find((m) => m.captures?.some(([r, c]) => r === 4 && c === 3));
  assert(capture, "Jump capture should be legal");

  applyMove(state.board, capture, state);
  assert(!state.board[4][3], "Martyred piece should be removed");
  assert(state.hands[COLORS.BLACK].length === 2, "Martyr should draw 2 cards on enemy capture");
  const trap = takeTrapHistoryReveal(state);
  assert(trap?.effect === "martyr", "Trap history should record Martyr");
  console.log("OK: Martyr draws 2 cards on enemy capture");
}

// Enemy spell kill on their turn draws 2 cards
{
  const state = baseState();
  state.turn = COLORS.RED;
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const martyr = CARD_REGISTRY.find((c) => c.id === "martyr");
  applyCard(state, COLORS.BLACK, martyr, [[4, 3]]);
  resolveCapture(state.board, state, 4, 3, COLORS.RED, { nonCap: true });
  assert(!state.board[4][3], "Piece should be destroyed");
  assert(state.hands[COLORS.BLACK].length === 2, "Martyr should draw 2 on enemy spell death");
  console.log("OK: Martyr draws 2 cards on enemy spell kill");
}

// Own-turn sacrifice does not trigger Martyr
{
  const state = baseState();
  state.turn = COLORS.BLACK;
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const martyr = CARD_REGISTRY.find((c) => c.id === "martyr");
  applyCard(state, COLORS.BLACK, martyr, [[4, 3]]);
  removePiece(state.board, 4, 3, { force: true, state });
  assert(state.hands[COLORS.BLACK].length === 0, "Martyr should not draw on own-turn removal");
  console.log("OK: Martyr does not trigger on own-turn removal");
}

// Debuff expiry on owner's turn does not trigger Martyr
{
  const state = baseState();
  state.turn = COLORS.BLACK;
  const piece = createPiece(COLORS.BLACK, 4, 3);
  piece.martyr = true;
  piece.martyrTurns = MARTYR_TRAP_TURNS;
  piece.venom = 1;
  setPiece(state.board, 4, 3, piece);
  tickEffects(state.board, COLORS.BLACK, state);
  assert(!state.board[4][3], "Piece should die to venom");
  assert(state.hands[COLORS.BLACK].length === 0, "Martyr should not draw on debuff expiry");
  console.log("OK: Martyr does not trigger on debuff expiry");
}

// Martyr expires after 2 owner turn cycles
{
  const state = baseState();
  setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));
  const martyr = CARD_REGISTRY.find((c) => c.id === "martyr");
  applyCard(state, COLORS.BLACK, martyr, [[4, 3]]);
  const piece = state.board[4][3];
  assert(piece.martyrTurns === MARTYR_TRAP_TURNS, "Martyr should start with 2 turn cycles");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(piece.martyr, "Martyr should still be armed after 1 turn cycle");
  assert(piece.martyrTurns === 1, "1 turn cycle should remain");

  tickEffects(state.board, COLORS.BLACK, state);
  assert(!piece.martyr, "Martyr should expire after 2 owner turn cycles");
  assert(piece.martyrTurns === 0, "Martyr turn counter should be cleared");
  console.log("OK: Martyr expires after 2 turn cycles");
}

console.log("All Martyr tests passed.");
