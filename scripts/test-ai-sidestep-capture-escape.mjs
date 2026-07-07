/**
 * AI Sidestep should only fire for capture setups (priority) or escapes.
 * Run: node scripts/test-ai-sidestep-capture-escape.mjs
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

// Black sidesteps onto a jump line over red at b7.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[6][1] = createPiece(COLORS.RED, 6, 1);
  const state = makeState(board);
  const sidestep = getCardDef("sidestep");
  const res = tryAutoPlay(state, COLORS.BLACK, sidestep);
  assert.equal(res.success, true, "sidestep should succeed on a capture setup");
  assert.deepEqual(res.picks, [[5, 0], [5, 2]], "AI should sidestep onto the capture line");
  assert.equal(state.board[5][2]?.color, COLORS.BLACK, "black should land on the setup square");
}

// Sidestep not playable when it would only reposition without capture or escape.
{
  const board = emptyBoard();
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  const sidestep = getCardDef("sidestep");
  assert.equal(canAiPlay(state, COLORS.BLACK, sidestep), false, "sidestep should not play without capture or escape");
}

// Sidestep escapes a threatened piece when no capture setup exists.
{
  const board = emptyBoard();
  board[3][6] = createPiece(COLORS.BLACK, 3, 6);
  board[4][7] = createPiece(COLORS.RED, 4, 7);
  const state = makeState(board);
  const sidestep = getCardDef("sidestep");
  assert.equal(canAiPlay(state, COLORS.BLACK, sidestep), true, "sidestep should be playable for escape");
  const work = structuredClone(state);
  const res = tryAutoPlay(work, COLORS.BLACK, sidestep);
  assert.equal(res.success, true, "sidestep escape should succeed");
  assert.deepEqual(res.picks, [[3, 6], [3, 4]], "black should sidestep away from the threat");
  assert.equal(work.board[3][6], null, "threatened square should be vacated");
}

// Prefer capture setup over escape when both are available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[6][1] = createPiece(COLORS.RED, 6, 1);
  board[6][3] = createPiece(COLORS.BLACK, 6, 3);
  board[7][2] = createPiece(COLORS.RED, 7, 2);
  const state = makeState(board);
  const sidestep = getCardDef("sidestep");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, sidestep);
  assert.equal(res.success, true, "sidestep should succeed");
  assert.deepEqual(res.picks, [[5, 0], [5, 2]], "AI should prefer the capture setup over escape");
}

console.log("test-ai-sidestep-capture-escape.mjs: all assertions passed");
