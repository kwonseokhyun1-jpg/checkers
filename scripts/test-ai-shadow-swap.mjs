import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState, tryAutoPlay, canAiPlay } from "../js/cardEffects.js";

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

// Swap frozen piece with mobile piece to open an immediate capture.
{
  const board = emptyBoard();
  const frozen = createPiece(COLORS.BLACK, 3, 2);
  frozen.frozenTurns = 1;
  board[3][2] = frozen;
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const card = getCardDef("shadow_swap");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, "shadow swap should be playable with a debuff");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "shadow swap should succeed");
  assert.deepEqual(res.picks, [[3, 2], [5, 6]], "AI should swap the frozen piece with the mobile one");
}

// Do not play shadow swap when neither piece has a buff or debuff.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const card = getCardDef("shadow_swap");
  assert.equal(canAiPlay(state, COLORS.BLACK, card), false, "shadow swap should not be playable without status");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, false, "shadow swap should not auto-play without status");
}

// Paralyzed piece swap for capture is preferred over a generic buff swap without capture.
{
  const board = emptyBoard();
  const paralyzed = createPiece(COLORS.BLACK, 3, 2);
  paralyzed.paralyzedTurns = 1;
  board[3][2] = paralyzed;
  board[5][6] = createPiece(COLORS.BLACK, 5, 6);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const shielded = createPiece(COLORS.BLACK, 1, 0);
  shielded.shieldTurns = 1;
  board[1][0] = shielded;
  board[7][2] = createPiece(COLORS.BLACK, 7, 2);
  const state = makeState(board);
  const card = getCardDef("shadow_swap");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, card);
  assert.equal(res.success, true, "shadow swap should succeed");
  const picks = res.picks || [];
  const usesParalyzedCaptureLine =
    (picks[0][0] === 3 && picks[0][1] === 2 && picks[1][0] === 5 && picks[1][1] === 6) ||
    (picks[1][0] === 3 && picks[1][1] === 2 && picks[0][0] === 5 && picks[0][1] === 6);
  assert.ok(usesParalyzedCaptureLine, "AI should prefer the paralyzed capture swap");
}

console.log("AI shadow swap test passed");
