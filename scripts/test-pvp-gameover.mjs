#!/usr/bin/env node
/**
 * PvP end-of-match helpers: terminal board detection.
 * Run: node scripts/test-pvp-gameover.mjs
 */
import { COLORS, createInitialBoard, countPieces, removePiece } from "../js/board.js";
import { createMatchState, isPvpTerminalBoard, isMutualElimination } from "../js/match.js";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { starsForRemainingPieces } from "../js/adventure.js";

const deck = Array(DECK_SIZE).fill("bomb");

{
  const board = createInitialBoard();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p?.color === COLORS.BLACK) removePiece(board, r, c, { force: true });
    }
  }
  const state = { board };
  if (!isPvpTerminalBoard(state, COLORS.RED)) throw new Error("Red should see terminal board when black is gone");
  if (!isPvpTerminalBoard(state, COLORS.BLACK)) throw new Error("Black should see terminal when they have no pieces");
  if (countPieces(board, COLORS.BLACK) !== 0) throw new Error("Expected no black pieces");
  console.log("isPvpTerminalBoard: OK");
}

{
  const full = createMatchState(deck);
  if (isPvpTerminalBoard(full, COLORS.RED)) throw new Error("Fresh match should not be terminal");
  console.log("non-terminal start: OK");
}

{
  const board = createInitialBoard();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p) removePiece(board, r, c, { force: true });
    }
  }
  const state = { board };
  if (!isMutualElimination(state)) throw new Error("Empty board should be mutual elimination");
  if (!isPvpTerminalBoard(state, COLORS.RED)) throw new Error("Mutual elimination should be terminal");
  console.log("mutual elimination: OK");
}

if (starsForRemainingPieces(0) !== 0) throw new Error("0 remaining pieces should award 0 stars");
if (starsForRemainingPieces(1) !== 1) throw new Error("1 remaining piece should award 1 star");
console.log("adventure zero-star rule: OK");

console.log("All PvP game-over tests passed.");
