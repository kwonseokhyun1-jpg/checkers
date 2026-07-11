import assert from "node:assert/strict";
import { applyEffect } from "../js/cardEffectHandlers.js";
import {
  COLORS,
  createPiece,
  applyMove,
  resolveCapture,
  isAwakeZombie,
  isZombieSleeping,
  tickEffects,
} from "../js/board.js";

function emptyState(board) {
  return {
    board,
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: {},
    turn: COLORS.RED,
  };
}

function place(board, r, c, color, king = false) {
  board[r][c] = createPiece(color, r, c, king);
  return board[r][c];
}

const board = Array.from({ length: 8 }, () => Array(8).fill(null));
const state = emptyState(board);
place(board, 5, 0, COLORS.RED);
place(board, 4, 1, COLORS.BLACK);

const curse = applyEffect(state, COLORS.RED, "zombify", [[5, 0]]);
assert.equal(curse.success, true, curse.message || "zombify should succeed");

const main = board[5][0];
assert.equal(main.isMainZombie, true);
assert.equal(main.zombieSleepTurns, 2);
assert.equal(isZombieSleeping(main), true);
assert.equal(main.king, false);

tickEffects(board, COLORS.RED, state);
tickEffects(board, COLORS.RED, state);
assert.equal(main.zombieSleepTurns, 0);
assert.equal(main.king, true, "main zombie should crown on wake");
assert.equal(isAwakeZombie(main), true);

applyMove(
  board,
  { from: [5, 0], to: [3, 2], captures: [[4, 1]], type: "jump" },
  state
);
assert.equal(board[3][2]?.id, main.id);
const spread = board[5][0];
assert.equal(spread?.isZombie, true);
assert.equal(spread?.isMainZombie, false);
assert.equal(spread?.zombieMasterId, main.zombieMasterId);

resolveCapture(board, state, 3, 2, COLORS.BLACK, { nonCap: false });
assert.equal(board[3][2], null);
assert.equal(board[5][0]?.isZombie, true, "spread zombie should persist after zombie king dies");
assert.equal(board[5][0]?.isMainZombie, false);

console.log("Zombify mechanic test: OK");
