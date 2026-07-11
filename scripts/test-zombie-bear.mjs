import assert from "node:assert/strict";
import { applyEffect } from "../js/cardEffectHandlers.js";
import {
  COLORS,
  createPiece,
  applyMove,
  grantAwokenBear,
  isZombieBear,
  isZombieBearStack,
  isAwakeZombie,
  tickEffects,
  getAllMovesForColor,
} from "../js/board.js";

function emptyState(board) {
  return {
    board,
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: { bearBonusUsed: {} },
    turn: COLORS.RED,
  };
}

function place(board, r, c, color, king = false) {
  board[r][c] = createPiece(color, r, c, king);
  return board[r][c];
}

// Zombify on an Awoken Bear piece becomes a stacked Zombie Bear.
const board = Array.from({ length: 8 }, () => Array(8).fill(null));
const state = emptyState(board);
const bear = place(board, 5, 0, COLORS.RED);
grantAwokenBear(bear);
place(board, 4, 1, COLORS.BLACK);

const curse = applyEffect(state, COLORS.RED, "zombify", [[5, 0]]);
assert.equal(curse.success, true, curse.message || "zombify on bear should succeed");
assert.equal(isZombieBearStack(bear), true, "bear + zombie curse should stack");
assert.equal(isZombieBear(bear), false, "sleeping zombie bear is not awake yet");

tickEffects(board, COLORS.RED, state);
assert.equal(isZombieBear(bear), true, "awake zombie bear after gravestone sleep");
assert.equal(bear.king, true, "main zombie bear still crowns on wake");

applyMove(
  board,
  { from: [5, 0], to: [3, 2], captures: [[4, 1]], type: "jump" },
  state
);
const spread = board[4][1];
assert.equal(spread?.isZombie, true, "zombie bear capture should rise as a normal zombie");
assert.equal(spread?.isMainZombie, false);
assert.equal(spread?.zombieMasterId, bear.zombieMasterId);

const extras = getAllMovesForColor(board, COLORS.RED, state).filter(
  (m) => m.from[0] === 3 && m.from[1] === 2
);
assert.ok(extras.length > 0, "zombie bear should still have bear bonus moves available");

// Fusion of a zombie and a normal man creates a Zombie Bear.
const board2 = Array.from({ length: 8 }, () => Array(8).fill(null));
const state2 = emptyState(board2);
const zombieMan = place(board2, 5, 0, COLORS.RED);
zombieMan.isZombie = true;
zombieMan.isMainZombie = true;
zombieMan.zombieMasterId = zombieMan.id;
zombieMan.zombieSleepTurns = 0;
place(board2, 4, 1, COLORS.RED);

const fused = applyEffect(state2, COLORS.RED, "fusion", [[5, 0], [4, 1]]);
assert.equal(fused.success, true, fused.message || "fusion should succeed");
const survivor = board2[5][0];
assert.equal(survivor?.isMainZombie, true, "fused survivor keeps main zombie");
assert.equal(isZombieBearStack(survivor), true, "fusion grants bear to stacked zombie");
assert.equal(isAwakeZombie(survivor), true, "fused zombie bear is awake");

// Clone copies Awoken Bear and zombie horde marks (never a second main zombie).
{
  const board3 = Array.from({ length: 8 }, () => Array(8).fill(null));
  const state3 = emptyState(board3);
  const source = place(board3, 5, 0, COLORS.RED);
  grantAwokenBear(source);
  source.isZombie = true;
  source.isMainZombie = true;
  source.zombieMasterId = source.id;
  source.zombieSleepTurns = 1;

  const cloned = applyEffect(state3, COLORS.RED, "clone", [[5, 0], [4, 1]]);
  assert.equal(cloned.success, true, cloned.message || "clone sleeping zombie bear should succeed");
  const copy = board3[4][1];
  assert.equal(copy?.isClone, true, "clone should mark copy");
  assert.equal(copy?.bearAwakened, true, "clone should copy Awoken Bear");
  assert.equal(copy?.isZombie, true, "clone should copy zombie curse");
  assert.equal(copy?.isMainZombie, false, "clone should not create a second main zombie");
  assert.equal(copy?.zombieMasterId, source.zombieMasterId, "clone should stay in the same horde");
}

// Revive strips zombie curse and Awoken Bear from the revived piece.
{
  const board4 = Array.from({ length: 8 }, () => Array(8).fill(null));
  const state4 = emptyState(board4);
  state4.captured[COLORS.RED] = [{ king: true }];

  const revived = applyEffect(state4, COLORS.RED, "revive", [[6, 1]]);
  assert.equal(revived.success, true, revived.message || "revive should succeed");
  const piece = board4[6][1];
  assert.equal(piece?.king, true, "revive should restore king status");
  assert.equal(piece?.bearAwakened, false, "revive should strip Awoken Bear");
  assert.equal(piece?.isZombie, false, "revive should strip zombie curse from revived piece");
  assert.equal(piece?.isMainZombie, false, "revive should not restore main zombie");
  assert.equal(piece?.zombieMasterId, null, "revive should clear zombie master link on revived piece");
}

console.log("Zombie Bear stacked mechanic test: OK");
