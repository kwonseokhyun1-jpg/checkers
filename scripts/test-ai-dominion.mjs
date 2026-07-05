/**
 * AI should not cast Dominion when no piece gains a legal backward move this turn.
 * Run: node scripts/test-ai-dominion.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, dominionWouldEnableBackwardMoves } from "../js/cardEffects.js";
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

const dominion = getCardDef("dominion");

// Men on the back rank with nowhere to step backward.
const blockedBoard = emptyBoard();
blockedBoard[7][1] = createPiece(COLORS.BLACK, 7, 1);
blockedBoard[7][3] = createPiece(COLORS.BLACK, 7, 3);
blockedBoard[7][5] = createPiece(COLORS.BLACK, 7, 5);
const blockedState = makeState(blockedBoard);
assert.equal(
  dominionWouldEnableBackwardMoves(blockedState, COLORS.BLACK),
  false,
  "dominion should not help when no backward squares exist"
);
assert.equal(
  canAiPlay(blockedState, COLORS.BLACK, dominion),
  false,
  "AI should not play dominion when nothing can move backward"
);

// Only kings — already move backward; dominion adds nothing new.
const kingsBoard = emptyBoard();
kingsBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
kingsBoard[3][2].king = true;
kingsBoard[5][4] = createPiece(COLORS.BLACK, 5, 4);
kingsBoard[5][4].king = true;
const kingsState = makeState(kingsBoard);
assert.equal(
  dominionWouldEnableBackwardMoves(kingsState, COLORS.BLACK),
  false,
  "dominion should not help when only kings can move backward"
);
assert.equal(canAiPlay(kingsState, COLORS.BLACK, dominion), false);

// Man with an open backward square should make dominion playable.
const openBoard = emptyBoard();
openBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
const openState = makeState(openBoard);
assert.equal(
  dominionWouldEnableBackwardMoves(openState, COLORS.BLACK),
  true,
  "dominion should help when a man can step backward"
);
assert.equal(canAiPlay(openState, COLORS.BLACK, dominion), true);

// Men already under Retreat do not gain new moves from dominion.
const retreatBoard = emptyBoard();
retreatBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
retreatBoard[5][2].retreatTurns = 2;
const retreatState = makeState(retreatBoard);
assert.equal(
  dominionWouldEnableBackwardMoves(retreatState, COLORS.BLACK),
  false,
  "dominion should not help when retreat already enables backward movement"
);
assert.equal(canAiPlay(retreatState, COLORS.BLACK, dominion), false);

// Frozen men cannot move backward even with dominion.
const frozenBoard = emptyBoard();
frozenBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
frozenBoard[5][2].frozenTurns = 2;
const frozenState = makeState(frozenBoard);
assert.equal(
  dominionWouldEnableBackwardMoves(frozenState, COLORS.BLACK),
  false,
  "dominion should not help frozen pieces"
);
assert.equal(canAiPlay(frozenState, COLORS.BLACK, dominion), false);

console.log("test-ai-dominion.mjs: all assertions passed");
