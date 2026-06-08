import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { pickBestMove } from "../js/ai.js";

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

// Black can step to c5 (unsafe) or a5 (safe); red at d4 can jump c5 next turn.
const board = emptyBoard();
board[2][1] = createPiece(COLORS.BLACK, 2, 1);
board[4][3] = createPiece(COLORS.RED, 4, 3);

const state = makeState(board);
const move = pickBestMove(state.board, COLORS.BLACK, state);

assert.ok(move, "AI should have a legal move");
assert.deepEqual(move.to, [3, 0], "AI should avoid the square where red can capture next turn");

// When every move hangs, AI still picks one (no safe option).
const trapped = emptyBoard();
trapped[2][1] = createPiece(COLORS.BLACK, 2, 1);
trapped[3][2] = createPiece(COLORS.RED, 3, 2);
trapped[4][3] = createPiece(COLORS.RED, 4, 3);

const trappedState = makeState(trapped);
const forced = pickBestMove(trappedState.board, COLORS.BLACK, trappedState);
assert.ok(forced, "AI should still move when every option is capturable");

console.log("AI move safety test passed");
