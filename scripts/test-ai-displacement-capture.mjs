/**
 * AI Displacement should only fire for capture setups (priority) or escapes.
 * Run: node scripts/test-ai-displacement-capture.mjs
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

// Black displaces onto a jump line over red at d5 (own-side landing).
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const card = getCardDef("displacement");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "displacement should succeed on a capture setup");
  assert.deepEqual(res.picks, [[5, 0], [3, 2]], "AI should displace onto the capture line");
  assert.equal(state.board[3][2]?.color, COLORS.BLACK, "black should land on the setup square");
}

// Displacement not playable when it would only reposition without capture or escape.
{
  const board = emptyBoard();
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  const card = getCardDef("displacement");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), false, "displacement should not play without capture or escape");
}

// Displacement escapes a threatened piece when no capture setup exists.
{
  const board = emptyBoard();
  board[3][6] = createPiece(COLORS.BLACK, 3, 6);
  board[4][7] = createPiece(COLORS.RED, 4, 7);
  const state = makeState(board);
  const card = getCardDef("displacement");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, "displacement should be playable for escape");
  const work = structuredClone(state);
  const res = tryAutoPlay(work, COLORS.BLACK, card);
  assert.equal(res.success, true, "displacement escape should succeed");
  assert.deepEqual(res.picks?.[0], [3, 6], "threatened piece should be moved");
  assert.equal(work.board[3][6], null, "threatened square should be vacated");
  assert.equal(work.board[res.picks[1][0]][res.picks[1][1]]?.color, COLORS.BLACK, "piece should land on own side");
  assert.ok(res.picks[1][0] <= 3, "escape landing must be on black's side");
}

// Prefer capture setup over escape when both are available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[6][3] = createPiece(COLORS.BLACK, 6, 3);
  board[7][2] = createPiece(COLORS.RED, 7, 2);
  const state = makeState(board);
  const card = getCardDef("displacement");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "displacement should succeed");
  assert.deepEqual(res.picks, [[5, 0], [3, 2]], "AI should prefer the capture setup over escape");
}

console.log("test-ai-displacement-capture.mjs: all assertions passed");
