/**
 * AI should only cast Retreat on pieces that gain a legal backward move.
 * Run: node scripts/test-ai-retreat.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, retreatWouldEnableBackwardMoves } from "../js/cardEffects.js";
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

const retreat = getCardDef("retreat");

// Man on the back rank with nowhere to step backward.
const blockedBoard = emptyBoard();
blockedBoard[7][1] = createPiece(COLORS.BLACK, 7, 1);
const blockedState = makeState(blockedBoard);
assert.equal(
  retreatWouldEnableBackwardMoves(blockedState, COLORS.BLACK, 7, 1),
  false,
  "retreat should not help when no backward squares exist"
);
assert.equal(canAiPlay(blockedState, COLORS.BLACK, retreat), false);

// Kings already move backward; retreat adds nothing new.
const kingsBoard = emptyBoard();
kingsBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
kingsBoard[3][2].king = true;
const kingsState = makeState(kingsBoard);
assert.equal(
  retreatWouldEnableBackwardMoves(kingsState, COLORS.BLACK, 3, 2),
  false,
  "retreat should not help kings"
);
assert.equal(canAiPlay(kingsState, COLORS.BLACK, retreat), false);

// Man with an open backward square should make retreat playable.
const openBoard = emptyBoard();
openBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
const openState = makeState(openBoard);
assert.equal(
  retreatWouldEnableBackwardMoves(openState, COLORS.BLACK, 5, 2),
  true,
  "retreat should help when a man can step backward"
);
assert.equal(canAiPlay(openState, COLORS.BLACK, retreat), true);

// Piece already under retreat does not gain new moves.
const existingBoard = emptyBoard();
existingBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
existingBoard[5][2].retreatTurns = 2;
const existingState = makeState(existingBoard);
assert.equal(
  retreatWouldEnableBackwardMoves(existingState, COLORS.BLACK, 5, 2),
  false,
  "retreat should not help when backward movement is already enabled"
);
assert.equal(canAiPlay(existingState, COLORS.BLACK, retreat), false);

// Frozen men cannot move backward even with retreat.
const frozenBoard = emptyBoard();
frozenBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
frozenBoard[5][2].frozenTurns = 2;
const frozenState = makeState(frozenBoard);
assert.equal(
  retreatWouldEnableBackwardMoves(frozenState, COLORS.BLACK, 5, 2),
  false,
  "retreat should not help frozen pieces"
);
assert.equal(canAiPlay(frozenState, COLORS.BLACK, retreat), false);

// Active dominion already enables backward movement board-wide.
const dominionBoard = emptyBoard();
dominionBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
const dominionState = makeState(dominionBoard);
dominionState.meta.dominionTurn[COLORS.BLACK] = 2;
assert.equal(
  retreatWouldEnableBackwardMoves(dominionState, COLORS.BLACK, 5, 2),
  false,
  "retreat should not help when dominion already enables backward movement"
);
assert.equal(canAiPlay(dominionState, COLORS.BLACK, retreat), false);

console.log("test-ai-retreat.mjs: all assertions passed");
