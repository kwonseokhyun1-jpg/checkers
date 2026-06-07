import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { runAiTurn } from "../js/ai.js";

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
    spellPlayed: { [COLORS.RED]: true, [COLORS.BLACK]: true },
  };
}

function countRedPieces(board) {
  let n = 0;
  for (const row of board) for (const cell of row) if (cell?.color === COLORS.RED) n++;
  return n;
}

// Black at c6 can jump d5 then c3 in one turn.
const board = emptyBoard();
board[2][1] = createPiece(COLORS.BLACK, 2, 1);
board[3][2] = createPiece(COLORS.RED, 3, 2);
board[5][2] = createPiece(COLORS.RED, 5, 2);

const state = makeState(board);
const log = runAiTurn(state, "AI", COLORS.BLACK);

const moveEntries = log.filter((e) => e.type === "move");
assert.equal(moveEntries.length, 2, "AI should log two jumps in a double capture");
assert.equal(countRedPieces(state.board), 0, "Both red pieces should be removed from the board");
assert.ok(state.board[6]?.[1], "AI piece should land on b2 after the chain");

// Sanity: single jump position should only produce one move entry.
const singleBoard = emptyBoard();
singleBoard[2][1] = createPiece(COLORS.BLACK, 2, 1);
singleBoard[3][2] = createPiece(COLORS.RED, 3, 2);
const singleState = makeState(singleBoard);
const singleLog = runAiTurn(singleState, "AI", COLORS.BLACK);
assert.equal(
  singleLog.filter((e) => e.type === "move").length,
  1,
  "Single capture should stay one move"
);

console.log("AI multi-jump test passed");
