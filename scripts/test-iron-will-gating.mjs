/**
 * Iron Will should only be playable on frozen or paralyzed friendly pieces.
 * Run: node scripts/test-iron-will-gating.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffects.js";
import { canAiPlay, getValidTargets } from "../js/cardEffects.js";
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

const ironWill = getCardDef("iron_will");

const cleanBoard = makeState(emptyBoard());
cleanBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
cleanBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.deepEqual(getValidTargets(cleanBoard, COLORS.BLACK, ironWill, []), []);
assert.equal(canAiPlay(cleanBoard, COLORS.BLACK, ironWill), false);

const frozenBoard = makeState(emptyBoard());
frozenBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
frozenBoard.board[5][2].frozenTurns = 2;
frozenBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.deepEqual(getValidTargets(frozenBoard, COLORS.BLACK, ironWill, []), [[5, 2]]);
assert.equal(canAiPlay(frozenBoard, COLORS.BLACK, ironWill), true);

const paralyzedBoard = makeState(emptyBoard());
paralyzedBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
paralyzedBoard.board[5][2].paralyzedTurns = 1;
paralyzedBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.deepEqual(getValidTargets(paralyzedBoard, COLORS.BLACK, ironWill, []), [[5, 2]]);
assert.equal(canAiPlay(paralyzedBoard, COLORS.BLACK, ironWill), true);

const rootedBoard = makeState(emptyBoard());
rootedBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
rootedBoard.board[5][2].rooted = 1;
rootedBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.deepEqual(getValidTargets(rootedBoard, COLORS.BLACK, ironWill, []), [[5, 2]]);
assert.equal(canAiPlay(rootedBoard, COLORS.BLACK, ironWill), true);

const rejectBoard = makeState(emptyBoard());
rejectBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
const reject = applyCard(rejectBoard, COLORS.BLACK, ironWill, [[5, 2]]);
assert.equal(reject.success, false);
assert.match(reject.message, /frozen or paralyzed/i);

const consumeBoard = makeState(emptyBoard());
consumeBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
consumeBoard.board[5][2].frozenTurns = 2;
consumeBoard.board[5][2].paralyzedTurns = 1;
consumeBoard.board[5][2].rooted = 1;
const consume = applyCard(consumeBoard, COLORS.BLACK, ironWill, [[5, 2]]);
assert.equal(consume.success, true);
assert.equal(consumeBoard.board[5][2].frozenTurns, 0);
assert.equal(consumeBoard.board[5][2].paralyzedTurns, 0);
assert.equal(consumeBoard.board[5][2].rooted, 0);

console.log("test-iron-will-gating.mjs: all assertions passed");
