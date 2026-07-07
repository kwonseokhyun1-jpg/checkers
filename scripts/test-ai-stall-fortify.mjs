/**
 * AI should only Stall/Fortify when a piece is threatened next turn and cannot
 * capture this turn, or when it is the last friendly piece on the board.
 * Run: node scripts/test-ai-stall-fortify.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, tryAutoPlay } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board) {
  return {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
}

const stall = getCardDef("stall");

// Threatened piece that cannot capture — Stall should play.
{
  const board = emptyBoard();
  board[2][1] = createPiece(COLORS.BLACK, 2, 1);
  board[3][0] = createPiece(COLORS.RED, 3, 0);
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  assert.equal(canAiPlay(state, COLORS.BLACK, stall), true, "stall playable on threatened non-capturing piece");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, stall);
  assert.equal(res.success, true, "stall cast should succeed");
  assert.deepEqual(res.picks, [[2, 1]], "stall should fortify the threatened piece");
}

// Threatened piece that can capture — Stall should not play when another piece exists.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  assert.equal(canAiPlay(state, COLORS.BLACK, stall), false, "stall should not play when the threatened piece can capture");
}

// Safe piece — Stall should not play.
{
  const board = emptyBoard();
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  assert.equal(canAiPlay(state, COLORS.BLACK, stall), false, "stall should not play when no piece is threatened");
}

// Last piece standing — Stall should play even if not threatened and can capture.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[6][1] = createPiece(COLORS.RED, 6, 1);
  const state = makeState(board);
  assert.equal(canAiPlay(state, COLORS.BLACK, stall), true, "stall playable with only one friendly piece left");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, stall);
  assert.equal(res.success, true, "stall cast should succeed for last piece");
  assert.deepEqual(res.picks, [[3, 2]], "stall should fortify the last friendly piece");
}

console.log("test-ai-stall-fortify.mjs: all assertions passed");
