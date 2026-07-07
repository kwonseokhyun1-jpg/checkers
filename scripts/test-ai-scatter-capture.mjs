/**
 * AI Scatter should push pieces into jump lines and capture immediately after.
 * Run: node scripts/test-ai-scatter-capture.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, countPieces } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { tryAutoPlay, initCardState, bestScatterCaptureScore } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";
import { runAiTurn } from "../js/ai.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board, hand = [], color = COLORS.BLACK) {
  const state = {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: hand },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    turn: color,
  };
  initCardState(state);
  return state;
}

// Scatter opens a jump capture on the same turn.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const scatter = getCardDef("scatter");
  assert.ok(bestScatterCaptureScore(state, COLORS.BLACK) >= 100, "scatter setup should score as a capture line");

  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, scatter);
  assert.equal(res.success, true, "scatter should succeed on a capture setup");
  assert.ok(res.picks?.length === 1, "scatter should pick one empty square");
}

// Skip scatter when the enemy is already capturable without the spell.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[3][4] = createPiece(COLORS.RED, 3, 4);
  const state = makeState(board, [getCardDef("scatter")]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "scatter");
  assert.equal(spell, undefined, "AI should not cast scatter when a normal capture is already available");
}

// AI casts Scatter then captures on the follow-up move.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const scatter = getCardDef("scatter");
  const state = makeState(board, [scatter]);
  const redBefore = countPieces(state.board, COLORS.RED);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "scatter");
  assert.ok(spell, "AI should cast scatter when a follow-up capture is available");
  assert.ok(spell.picks?.length === 1, "scatter should target an empty square");

  const moves = log.filter((e) => e.type === "move");
  assert.ok(moves.length >= 1, "AI should move after casting scatter");
  assert.ok(moves[0].captures?.length >= 1, "follow-up move should capture");

  const redAfter = countPieces(state.board, COLORS.RED);
  assert.ok(redAfter < redBefore, "scatter follow-up should kill at least one red piece");
}

// Prefer Scatter over another spell when the immediate capture line is available.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const scatter = getCardDef("scatter");
  const shield = getCardDef("ward");
  const state = makeState(board, [scatter, shield]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell");
  assert.equal(spell?.cardEffect, "scatter", "AI should prefer scatter when an immediate capture is available");
}

console.log("test-ai-scatter-capture.mjs: all assertions passed");
