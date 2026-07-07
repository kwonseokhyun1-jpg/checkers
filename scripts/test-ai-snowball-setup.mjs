/**
 * AI Snowball should follow the tutorial line: freeze → approach → capture setup.
 * Run: node scripts/test-ai-snowball-setup.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { tryAutoPlay, initCardState } from "../js/cardEffects.js";
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

// Tutorial-style board: freeze the non-capturable enemy that enables a follow-up jump.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const snowball = getCardDef("snowball");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, snowball);
  assert.equal(res.success, true, "snowball should succeed on setup target");
  assert.deepEqual(res.picks, [[4, 3]], "snowball should target the setup capture victim");
}

// Skip already-frozen enemies.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  const frozen = createPiece(COLORS.RED, 4, 3);
  frozen.frozenTurns = 1;
  board[4][3] = frozen;
  board[3][6] = createPiece(COLORS.RED, 3, 6);
  const state = makeState(board);
  const snowball = getCardDef("snowball");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, snowball);
  assert.equal(res.success, true, "snowball should still be playable");
  assert.deepEqual(res.picks, [[3, 6]], "snowball should skip the already-frozen enemy");
}

// AI casts Snowball then moves adjacent to the frozen target (tutorial step 2).
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const snowball = getCardDef("snowball");
  const state = makeState(board, [snowball]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "snowball");
  assert.ok(spell, "AI should cast snowball when a setup capture is available");
  assert.deepEqual(spell.picks, [[4, 3]], "AI should freeze the setup target");

  const moves = log.filter((e) => e.type === "move");
  assert.ok(moves.length >= 1, "AI should move after casting snowball");
  const [tr, tc] = moves[0].to;
  assert.ok(
    Math.abs(tr - 4) <= 1 && Math.abs(tc - 3) <= 1 && (tr !== 4 || tc !== 3),
    "AI should move adjacent to the frozen enemy"
  );
  assert.equal(state.board[4][3]?.frozenTurns, 1, "target should be frozen after snowball");
}

// Prefer Snowball over another spell when the tutorial combo is available.
{
  const board = emptyBoard();
  board[2][3] = createPiece(COLORS.BLACK, 2, 3);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const snowball = getCardDef("snowball");
  const shield = getCardDef("ward");
  const state = makeState(board, [snowball, shield]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell");
  assert.equal(spell?.cardEffect, "snowball", "AI should prefer snowball when setup capture is strong");
}

console.log("test-ai-snowball-setup.mjs: all assertions passed");
