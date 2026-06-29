#!/usr/bin/env node
/**
 * After casting Bomb, AI must move the armed piece and kill at least one enemy.
 * Run: node scripts/test-ai-bomb-follow-up.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece, countPieces } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState } from "../js/cardEffects.js";
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

// AI casts bomb then moves the armed piece onto an adjacent enemy kill line.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  board[3][4] = createPiece(COLORS.RED, 3, 4);
  board[6][2] = createPiece(COLORS.RED, 6, 2);
  const bomb = getCardDef("bomb");
  const state = makeState(board, [bomb]);
  const redBefore = countPieces(state.board, COLORS.RED);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "bomb");
  assert.ok(spell, "AI should cast bomb");
  assert.deepEqual(spell.picks, [[5, 2]], "AI should arm the front-row piece that can bomb-kill an enemy");

  const moves = log.filter((e) => e.type === "move");
  assert.ok(moves.length >= 1, "AI should move after arming bomb");
  const firstMove = moves[0];
  assert.deepEqual(firstMove.from, [5, 2], "First move should be from the bomb-armed piece");

  const redAfter = countPieces(state.board, COLORS.RED);
  assert.ok(redAfter < redBefore, "Bomb follow-up should kill at least one red piece");
}

// Shielded adjacent enemy: bomb should not be cast (no guaranteed kill).
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  const shielded = createPiece(COLORS.RED, 3, 4);
  shielded.shieldTurns = 1;
  board[3][4] = shielded;
  const bomb = getCardDef("bomb");
  const state = makeState(board, [bomb]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "bomb");
  assert.equal(spell, undefined, "AI should not cast bomb when blast cannot kill an enemy");
}

// AI casts shockwave then moves the armed piece to pulse an adjacent enemy.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  board[3][4] = createPiece(COLORS.RED, 3, 4);
  board[6][2] = createPiece(COLORS.RED, 6, 2);
  const shockwave = getCardDef("shockwave");
  const state = makeState(board, [shockwave]);

  const log = runAiTurn(state, "You", COLORS.BLACK);
  const spell = log.find((e) => e.type === "spell" && e.cardEffect === "shockwave");
  assert.ok(spell, "AI should cast shockwave");
  assert.deepEqual(spell.picks, [[5, 2]], "AI should arm the front-row piece that can pulse an enemy");

  const moves = log.filter((e) => e.type === "move");
  assert.ok(moves.length >= 1, "AI should move after arming shockwave");
  assert.deepEqual(moves[0].from, [5, 2], "First move should be from the shockwave-armed piece");
  assert.equal(state.board[6][2]?.paralyzedTurns, 1, "Shockwave follow-up should paralyze adjacent enemy");
}

console.log("test-ai-bomb-follow-up.mjs: all assertions passed");
