#!/usr/bin/env node
/**
 * AI should avoid bomb when friendly collateral exceeds enemy kills,
 * but use it when more enemies would be destroyed.
 * Run: node scripts/test-ai-bomb-friendly-fire.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, countPieces } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState } from "../js/cardEffects.js";
import { canAiPlay, tryAutoPlay } from "../js/cardEffects.js";
import { runAiTurn } from "../js/ai.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board, hand, color = COLORS.BLACK) {
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

// 1 enemy, 1 other friendly in blast: not worth it — AI should skip bomb.
{
  const board = emptyBoard();
  board[2][1] = createPiece(COLORS.BLACK, 2, 1);
  board[2][2] = createPiece(COLORS.BLACK, 2, 2);
  board[4][2] = createPiece(COLORS.RED, 4, 2);
  const bomb = getCardDef("bomb");
  const state = makeState(board, [bomb]);

  assert.equal(canAiPlay(state, COLORS.BLACK, bomb), false, "bomb should not be playable when friendly collateral equals enemy kills");
  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "bomb");
  assert.equal(spell, undefined, "AI should not cast bomb when it would kill another friendly for only one enemy");
}

// 2 enemies, 1 other friendly in blast: worth it — AI should use bomb.
{
  const board = emptyBoard();
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  board[5][3] = createPiece(COLORS.BLACK, 5, 3);
  board[6][2] = createPiece(COLORS.RED, 6, 2);
  board[6][4] = createPiece(COLORS.RED, 6, 4);
  const bomb = getCardDef("bomb");
  const state = makeState(board, [bomb]);

  assert.equal(canAiPlay(state, COLORS.BLACK, bomb), true, "bomb should be playable when more enemies die than other friendlies");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, bomb);
  assert.equal(res.success, true, "AI bomb cast should succeed");
  assert.deepEqual(res.picks, [[5, 2]], "AI should arm the piece that can net-kill two enemies");
}

// 1 enemy, no other friendly casualties: still playable (bomber sacrifice only).
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[3][4] = createPiece(COLORS.RED, 3, 4);
  const bomb = getCardDef("bomb");
  const state = makeState(board, [bomb]);

  assert.equal(canAiPlay(state, COLORS.BLACK, bomb), true, "bomb should remain playable with no extra friendly casualties");
  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "bomb");
  assert.ok(spell, "AI should still cast bomb when only the armed piece is lost");
  const redAfter = countPieces(state.board, COLORS.RED);
  assert.equal(redAfter, 0, "Bomb follow-up should kill the enemy");
}

console.log("test-ai-bomb-friendly-fire.mjs: all assertions passed");
