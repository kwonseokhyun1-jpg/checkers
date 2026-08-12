/**
 * AI should only cast Bonus Step when a safe follow-up move exists.
 * Run: node scripts/test-ai-quick-march.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, quickMarchWouldEnableSafeFollowUp } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";
import { runAiTurn } from "../js/ai.js";

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
    turn: COLORS.BLACK,
  };
}

const quickMarch = getCardDef("quick_march");

// Black can step once but has no legal second move from the landing square.
const noFollowUpBoard = emptyBoard();
noFollowUpBoard[6][1] = createPiece(COLORS.BLACK, 6, 1);
noFollowUpBoard[7][0] = createPiece(COLORS.RED, 7, 0);
noFollowUpBoard[7][2] = createPiece(COLORS.RED, 7, 2);
noFollowUpBoard[5][0] = createPiece(COLORS.RED, 5, 0);
noFollowUpBoard[5][2] = createPiece(COLORS.RED, 5, 2);
const noFollowUpState = makeState(noFollowUpBoard);
assert.equal(
  quickMarchWouldEnableSafeFollowUp(noFollowUpState, COLORS.BLACK),
  false,
  "bonus step should not help when no second move exists"
);
assert.equal(canAiPlay(noFollowUpState, COLORS.BLACK, quickMarch), false);

// Black can take two steps, but the only follow-up lands under a jump.
const unsafeBoard = emptyBoard();
unsafeBoard[2][1] = createPiece(COLORS.BLACK, 2, 1);
unsafeBoard[5][2] = createPiece(COLORS.RED, 5, 2);
const unsafeState = makeState(unsafeBoard);
assert.equal(
  quickMarchWouldEnableSafeFollowUp(unsafeState, COLORS.BLACK),
  false,
  "bonus step should not help when every follow-up is capturable"
);
assert.equal(canAiPlay(unsafeState, COLORS.BLACK, quickMarch), false);

// Black can take two steps and end on a safe square.
const safeBoard = emptyBoard();
safeBoard[2][1] = createPiece(COLORS.BLACK, 2, 1);
safeBoard[5][0] = createPiece(COLORS.RED, 5, 0);
const safeState = makeState(safeBoard);
assert.equal(
  quickMarchWouldEnableSafeFollowUp(safeState, COLORS.BLACK),
  true,
  "bonus step should be playable with a safe two-step line"
);
assert.equal(canAiPlay(safeState, COLORS.BLACK, quickMarch), true);

// After casting, AI should skip an unsafe bonus follow-up.
const execBoard = emptyBoard();
execBoard[2][1] = createPiece(COLORS.BLACK, 2, 1);
execBoard[5][2] = createPiece(COLORS.RED, 5, 2);
const execState = makeState(execBoard);
execState.hands[COLORS.BLACK] = [quickMarch];
execState.meta.pendingDouble[COLORS.BLACK] = true;
const execLog = runAiTurn(execState, "Opponent", COLORS.BLACK);
const bonusMoves = execLog.filter((e) => e.quickMarch);
assert.equal(bonusMoves.length, 0, "AI should not take an unsafe bonus follow-up move");

console.log("test-ai-quick-march.mjs: all assertions passed");
