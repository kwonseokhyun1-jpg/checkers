import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState, tryAutoPlay } from "../js/cardEffects.js";

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

// Black hostile swap should land on a capture line, not the back rank.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[0][1] = createPiece(COLORS.RED, 0, 1);
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const card = getCardDef("hostile_swap");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "hostile_swap should succeed");
  assert.deepEqual(res.picks?.[1], [3, 2], "AI should swap onto the square with a follow-up capture");
  assert.equal(state.board[3][2]?.color, COLORS.BLACK, "black should occupy the capture square");
  assert.equal(state.board[0][1]?.color, COLORS.RED, "back-rank enemy should stay put");
}

// Hostile swap still works when no capture is available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[2][1] = createPiece(COLORS.RED, 2, 1);
  const state = makeState(board);
  const card = getCardDef("hostile_swap");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "hostile_swap should succeed without captures");
  assert.equal(state.board[res.picks[1][0]][res.picks[1][1]]?.color, COLORS.BLACK);
}

// Prefer mid-board enemy over back-rank target when no capture is available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[0][1] = createPiece(COLORS.RED, 0, 1);
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  const state = makeState(board);
  const card = getCardDef("hostile_swap");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "hostile_swap should succeed");
  assert.deepEqual(res.picks?.[1], [3, 2], "AI should not target the back-rank enemy when another exists");
  assert.equal(state.board[0][1]?.color, COLORS.RED, "back-rank enemy should stay put");
}

// Do not dump the opponent onto rank 8 when another swap is available.
{
  const board = emptyBoard();
  board[0][1] = createPiece(COLORS.RED, 0, 1);
  board[2][3] = createPiece(COLORS.RED, 2, 3);
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[5][4] = createPiece(COLORS.BLACK, 5, 4);
  const state = makeState(board);
  const card = getCardDef("hostile_swap");
  const res = tryAutoPlay(state, COLORS.RED, card);
  assert.equal(res.success, true, "hostile_swap should succeed");
  assert.notDeepEqual(res.picks?.[0], [0, 1], "AI should not swap from rank 8 when it sends the opponent there");
  assert.notEqual(state.board[0][1]?.color, COLORS.BLACK, "opponent should not be stranded on rank 8");
}

console.log("AI hostile swap test passed");
