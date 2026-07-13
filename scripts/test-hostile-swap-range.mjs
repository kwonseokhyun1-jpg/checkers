import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { applyCard, getValidTargets, initCardState } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";

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

const card = getCardDef("hostile_swap");

// Enemies beyond 3 squares are not valid targets.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[0][1] = createPiece(COLORS.RED, 0, 1);
  const state = makeState(board);
  const targets = getValidTargets(state, COLORS.BLACK, card, [[5, 0]]);
  assert.deepEqual(targets, [], "enemy 5 squares away should not be targetable");
  const res = applyCard(state, COLORS.BLACK, card, [[5, 0], [0, 1]]);
  assert.equal(res.success, false, "hostile_swap should fail out of range");
}

// Enemies exactly 3 squares away remain valid.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  board[0][1] = createPiece(COLORS.BLACK, 0, 1);
  const state = makeState(board);
  const targets = getValidTargets(state, COLORS.RED, card, [[3, 2]]);
  assert.deepEqual(targets, [[0, 1]], "enemy 3 squares away should be targetable");
  const res = applyCard(state, COLORS.RED, card, [[3, 2], [0, 1]]);
  assert.equal(res.success, true, "hostile_swap should succeed at max range");
}

// Friendly pieces with no enemy in range are not first-pick targets.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[0][1] = createPiece(COLORS.RED, 0, 1);
  const state = makeState(board);
  const starters = getValidTargets(state, COLORS.BLACK, card, []);
  assert.deepEqual(starters, [], "no friendly should be selectable without a target in range");
}

console.log("Hostile swap range test passed");
