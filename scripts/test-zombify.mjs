import assert from "node:assert/strict";
import { applyEffect } from "../js/cardEffectHandlers.js";
import {
  COLORS,
  createPiece,
  applyMove,
  resolveCapture,
  grantAwokenBear,
  isZombieBear,
  isZombieBearStack,
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
assert.equal(main.zombieSleepTurns, 1);
assert.equal(isZombieSleeping(main), true);
assert.equal(main.king, false);

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
const spread = board[4][1];
assert.equal(spread?.isZombie, true, "zombie should rise where the enemy was captured");
assert.equal(spread?.isMainZombie, false);
assert.equal(spread?.zombieMasterId, main.zombieMasterId);
assert.equal(board[5][0], null, "zombie should not spawn on the mover's starting square");

resolveCapture(board, state, 3, 2, COLORS.BLACK, { nonCap: false });
assert.equal(board[3][2], null);
assert.equal(board[4][1]?.isZombie, true, "spread zombie should persist after zombie king dies");
assert.equal(board[4][1]?.isMainZombie, false);

// Horde (non-king) zombie captures should also spread the curse on the kill square.
const board2 = Array.from({ length: 8 }, () => Array(8).fill(null));
const state2 = emptyState(board2);
place(board2, 4, 1, COLORS.RED);
board2[4][1].isZombie = true;
board2[4][1].isMainZombie = false;
board2[4][1].zombieMasterId = main.zombieMasterId;
board2[4][1].zombieSleepTurns = 0;
const horde = board2[4][1];
place(board2, 3, 2, COLORS.BLACK);
applyMove(
  board2,
  { from: [4, 1], to: [2, 3], captures: [[3, 2]], type: "jump" },
  state2
);
assert.equal(board2[2][3]?.id, horde.id);
const hordeSpread = board2[3][2];
assert.equal(hordeSpread?.isZombie, true, "non-king zombie capture should zombify the kill square");
assert.equal(hordeSpread?.isMainZombie, false);
assert.equal(hordeSpread?.zombieMasterId, main.zombieMasterId);

// Capturing a crowned enemy should also raise a horde zombie on the kill square.
const boardKing = Array.from({ length: 8 }, () => Array(8).fill(null));
const stateKing = emptyState(boardKing);
place(boardKing, 5, 0, COLORS.RED);
const kingVictim = place(boardKing, 4, 1, COLORS.BLACK, true);
assert.equal(kingVictim.king, true);
applyEffect(stateKing, COLORS.RED, "zombify", [[5, 0]]);
const kingHunter = boardKing[5][0];
tickEffects(boardKing, COLORS.RED, stateKing);
applyMove(
  boardKing,
  { from: [5, 0], to: [3, 2], captures: [[4, 1]], type: "jump" },
  stateKing
);
assert.equal(boardKing[3][2]?.id, kingHunter.id);
const kingSpread = boardKing[4][1];
assert.equal(kingSpread?.isZombie, true, "capturing a king should zombify the kill square");
assert.equal(kingSpread?.isMainZombie, false);
assert.equal(kingSpread?.zombieMasterId, kingHunter.zombieMasterId);

// Ghost Guard on the victim should not block the curse from rising on the kill square.
const boardGhost = Array.from({ length: 8 }, () => Array(8).fill(null));
const stateGhost = emptyState(boardGhost);
place(boardGhost, 5, 0, COLORS.RED);
const ghostVictim = place(boardGhost, 4, 1, COLORS.BLACK);
ghostVictim.ghostGuard = true;
applyEffect(stateGhost, COLORS.RED, "zombify", [[5, 0]]);
const ghostKing = boardGhost[5][0];
tickEffects(boardGhost, COLORS.RED, stateGhost);
applyMove(
  boardGhost,
  { from: [5, 0], to: [3, 2], captures: [[4, 1]], type: "jump" },
  stateGhost
);
assert.equal(boardGhost[4][1]?.isZombie, true, "ghost guard victim should still rise as a horde zombie");
assert.equal(boardGhost[4][1]?.zombieMasterId, ghostKing.zombieMasterId);

// A second zombify should create an independent horde without clearing the first.
const board3 = Array.from({ length: 8 }, () => Array(8).fill(null));
const state3 = emptyState(board3);
place(board3, 5, 0, COLORS.RED);
place(board3, 5, 2, COLORS.RED);
const firstCurse = applyEffect(state3, COLORS.RED, "zombify", [[5, 0]]);
assert.equal(firstCurse.success, true, firstCurse.message || "first zombify should succeed");
const firstKing = board3[5][0];
tickEffects(board3, COLORS.RED, state3);
assert.equal(firstKing.king, true, "first zombie king should crown on wake");

const secondCurse = applyEffect(state3, COLORS.RED, "zombify", [[5, 2]]);
assert.equal(secondCurse.success, true, secondCurse.message || "second zombify should succeed");
const secondKing = board3[5][2];
assert.equal(firstKing.isZombie, true, "first zombie king should remain cursed");
assert.equal(firstKing.isMainZombie, true, "first zombie king should stay a main zombie");
assert.equal(secondKing.isMainZombie, true, "second piece should become a main zombie");
assert.notEqual(
  firstKing.zombieMasterId,
  secondKing.zombieMasterId,
  "each zombie king should lead its own horde"
);

console.log("Zombify mechanic test: OK");
