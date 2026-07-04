/**
 * AI backstep should prefer landing where a follow-up capture is available.
 * Run: node scripts/test-ai-backstep-capture.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { tryAutoPlay } from "../js/cardEffects.js";
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

// Black backstep should set up a jump over red at d5, not a harmless retreat.
{
  const board = emptyBoard();
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  board[5][4] = createPiece(COLORS.RED, 5, 4);
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  const card = getCardDef("backstep");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "backstep should succeed");
  assert.deepEqual(res.picks, [[5, 2], [4, 3]], "AI should backstep onto the capture line");
  assert.equal(state.board[4][3]?.color, COLORS.BLACK, "black should land on the capture square");
}

// Backstep still works when no capture is available.
{
  const board = emptyBoard();
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  const state = makeState(board);
  const card = getCardDef("backstep");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "backstep should succeed without captures");
  assert.deepEqual(res.picks?.[0], [5, 6], "black should backstep the only movable piece");
  assert.equal(state.board[res.picks[1][0]][res.picks[1][1]]?.color, COLORS.BLACK, "black should land on a backstep square");
}

console.log("test-ai-backstep-capture.mjs: all assertions passed");
