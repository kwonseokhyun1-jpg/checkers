/**
 * Last King and Purify should only be playable when their conditions are met.
 * Run: node scripts/test-last-king-purify-gating.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, canCastInstant, getInstantCastBlockReason } from "../js/cardEffects.js";
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

const lastKing = getCardDef("last_king");
const purify = getCardDef("purify");

const twoPieces = makeState(emptyBoard());
twoPieces.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
twoPieces.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.equal(canCastInstant(twoPieces, COLORS.BLACK, lastKing), false);
assert.match(getInstantCastBlockReason(twoPieces, COLORS.BLACK, lastKing), /exactly one piece/i);
assert.equal(canAiPlay(twoPieces, COLORS.BLACK, lastKing), false);

const onePiece = makeState(emptyBoard());
onePiece.board[5][2] = createPiece(COLORS.BLACK, 5, 2);

assert.equal(canCastInstant(onePiece, COLORS.BLACK, lastKing), true);
assert.equal(getInstantCastBlockReason(onePiece, COLORS.BLACK, lastKing), null);
assert.equal(canAiPlay(onePiece, COLORS.BLACK, lastKing), true);

const cleanBoard = makeState(emptyBoard());
cleanBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
cleanBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.equal(canCastInstant(cleanBoard, COLORS.BLACK, purify), false);
assert.match(getInstantCastBlockReason(cleanBoard, COLORS.BLACK, purify), /debuff/i);
assert.equal(canAiPlay(cleanBoard, COLORS.BLACK, purify), false);

const debuffedBoard = makeState(emptyBoard());
debuffedBoard.board[5][2] = createPiece(COLORS.BLACK, 5, 2);
debuffedBoard.board[5][2].frozenTurns = 2;
debuffedBoard.board[5][4] = createPiece(COLORS.BLACK, 5, 4);

assert.equal(canCastInstant(debuffedBoard, COLORS.BLACK, purify), true);
assert.equal(getInstantCastBlockReason(debuffedBoard, COLORS.BLACK, purify), null);
assert.equal(canAiPlay(debuffedBoard, COLORS.BLACK, purify), true);

console.log("test-last-king-purify-gating.mjs: all assertions passed");
