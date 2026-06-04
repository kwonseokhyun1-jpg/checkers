#!/usr/bin/env node
/**
 * PvP end-of-match helpers: terminal board detection.
 * Run: node scripts/test-pvp-gameover.mjs
 */
import { COLORS, createInitialBoard, countPieces, removePiece } from "../js/board.js";
import { createMatchState, isPvpTerminalBoard } from "../js/match.js";

const deck = Array(30).fill("bomb");

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

console.log("All PvP game-over tests passed.");
