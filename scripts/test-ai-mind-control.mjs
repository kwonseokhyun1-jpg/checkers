/**
 * AI Mind Control should prefer: (1) convert-and-capture now, (2) force opponent
 * to jump their own former piece. Do not cast on random enemies.
 * Run: node scripts/test-ai-mind-control.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { canAiPlay, initCardState, tryAutoPlay } from "../js/cardEffects.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board) {
  const state = {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  return state;
}

// Prefer convert-and-capture: mind-control the man that can jump immediately.
{
  const board = emptyBoard();
  // After MC, black-controlled (3,2) jumps red (4,3) → (5,4).
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  // Decoy with no follow-up capture after conversion.
  board[1][0] = createPiece(COLORS.RED, 1, 0);
  const state = makeState(board);
  const card = getCardDef("mind_control");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, "mind_control playable for capture-now");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "mind_control should succeed");
  assert.deepEqual(res.picks, [[3, 2]], "AI should mind-control the piece that can capture now");
}

// Prefer forcing the opponent to take their own former piece.
{
  const board = emptyBoard();
  // After MC on (4,3), red (5,2) must jump it to (3,4).
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[5][2] = createPiece(COLORS.RED, 5, 2);
  // Decoy — converting it does not force a capture.
  board[1][0] = createPiece(COLORS.RED, 1, 0);
  const state = makeState(board);
  const card = getCardDef("mind_control");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, "mind_control playable for force-own-capture");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "mind_control should succeed");
  assert.deepEqual(res.picks, [[4, 3]], "AI should mind-control the piece the opponent must take");
}

// Capture-now outranks force-own-capture when both exist.
{
  const board = emptyBoard();
  // Capture-now: MC (2,1) → jump red (3,2) to (4,3).
  board[2][1] = createPiece(COLORS.RED, 2, 1);
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  // Force-own: MC (5,4) makes red (6,3) jump it to (4,5).
  board[5][4] = createPiece(COLORS.RED, 5, 4);
  board[6][3] = createPiece(COLORS.RED, 6, 3);
  const state = makeState(board);
  const card = getCardDef("mind_control");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "mind_control should succeed");
  assert.deepEqual(res.picks, [[2, 1]], "AI should prefer convert-and-capture over force-own-capture");
}

// Do not cast Mind Control when neither tactic is available.
{
  const board = emptyBoard();
  board[1][0] = createPiece(COLORS.RED, 1, 0);
  board[2][5] = createPiece(COLORS.RED, 2, 5);
  const state = makeState(board);
  const card = getCardDef("mind_control");
  assert.equal(
    canAiPlay(state, COLORS.BLACK, card),
    false,
    "mind_control should not play on random enemies"
  );
}

console.log("test-ai-mind-control.mjs: all assertions passed");
