/**
 * AI should only mark bounty on enemies it can jump-capture this turn.
 * Run: node scripts/test-ai-bounty-capturable.mjs
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

// Bounty should mark the capturable enemy, not the one out of jump range.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[3][6] = createPiece(COLORS.RED, 3, 6);
  const state = makeState(board);
  const bounty = getCardDef("bounty");
  assert.equal(canAiPlay(state, COLORS.BLACK, bounty), true, "bounty playable when a capturable enemy exists");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, bounty);
  assert.equal(res.success, true, "bounty cast should succeed");
  assert.deepEqual(res.picks, [[4, 3]], "bounty should mark the capturable enemy");
}

// Bounty not playable when no enemy can be captured this turn.
{
  const board = emptyBoard();
  board[3][6] = createPiece(COLORS.RED, 3, 6);
  const state = makeState(board);
  const bounty = getCardDef("bounty");
  assert.equal(canAiPlay(state, COLORS.BLACK, bounty), false, "bounty should not play without a capturable target");
}

console.log("test-ai-bounty-capturable.mjs: all assertions passed");
