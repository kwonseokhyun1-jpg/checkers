/**
 * AI Blink should only fire for capture setups (priority) or escapes.
 * Run: node scripts/test-ai-blink-capture-escape.mjs
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

// Black blinks onto a jump line over red at d5.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const blink = getCardDef("teleport");
  const res = tryAutoPlay(state, COLORS.BLACK, blink);
  assert.equal(res.success, true, "blink should succeed on a capture setup");
  assert.deepEqual(res.picks, [[5, 0], [3, 2]], "AI should blink onto the capture line");
  assert.equal(state.board[3][2]?.color, COLORS.BLACK, "black should land on the setup square");
}

// Blink not playable when it would only reposition without capture or escape.
{
  const board = emptyBoard();
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  const blink = getCardDef("teleport");
  assert.equal(canAiPlay(state, COLORS.BLACK, blink), false, "blink should not play without capture or escape");
}

// Blink escapes a threatened piece when no capture setup exists.
{
  const board = emptyBoard();
  board[3][6] = createPiece(COLORS.BLACK, 3, 6);
  board[4][7] = createPiece(COLORS.RED, 4, 7);
  const state = makeState(board);
  const blink = getCardDef("teleport");
  assert.equal(canAiPlay(state, COLORS.BLACK, blink), true, "blink should be playable for escape");
  const work = structuredClone(state);
  const res = tryAutoPlay(work, COLORS.BLACK, blink);
  assert.equal(res.success, true, "blink escape should succeed");
  assert.deepEqual(res.picks, [[3, 6], [1, 4]], "black should blink away from the threat");
  assert.equal(work.board[3][6], null, "threatened square should be vacated");
}

// Prefer capture setup over escape when both are available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[6][3] = createPiece(COLORS.BLACK, 6, 3);
  board[7][2] = createPiece(COLORS.RED, 7, 2);
  const state = makeState(board);
  const blink = getCardDef("teleport");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, blink);
  assert.equal(res.success, true, "blink should succeed");
  assert.deepEqual(res.picks, [[5, 0], [3, 2]], "AI should prefer the capture setup over escape");
}

console.log("test-ai-blink-capture-escape.mjs: all assertions passed");
