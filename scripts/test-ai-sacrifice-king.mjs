/**
 * AI must never sacrifice its own kings (Sacrifice / Offering).
 * Run: node scripts/test-ai-sacrifice-king.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, getValidTargets, tryAutoPlay } from "../js/cardEffects.js";
import { getCardDef } from "../js/cardCatalog.js";
import { createMatchState } from "../js/match.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board, hand = []) {
  return {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: hand },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
}

const sacrifice = getCardDef("sacrifice");
const offering = getCardDef("offering");

// Sacrifice: king + man available — AI should only offer the man as the friendly pick.
const sacrificeBoard = emptyBoard();
sacrificeBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
sacrificeBoard[3][2].king = true;
sacrificeBoard[5][4] = createPiece(COLORS.BLACK, 5, 4);
sacrificeBoard[4][3] = createPiece(COLORS.RED, 4, 3);
const sacrificeState = makeState(sacrificeBoard, [sacrifice]);

const sacrificeFriendly = getValidTargets(sacrificeState, COLORS.BLACK, sacrifice, []);
assert.ok(
  sacrificeFriendly.some(([r, c]) => sacrificeBoard[r][c]?.king),
  "player Sacrifice can still target kings"
);

const res = tryAutoPlay(sacrificeState, COLORS.BLACK, sacrifice);
assert.equal(res.success, true, "Sacrifice should be playable with a man available");
assert.notEqual(res.picks[0].join(","), "3,2", "AI must not sacrifice its king");

// Sacrifice: only kings — AI should not play.
const kingsOnlyBoard = emptyBoard();
kingsOnlyBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
kingsOnlyBoard[3][2].king = true;
kingsOnlyBoard[5][4] = createPiece(COLORS.BLACK, 5, 4);
kingsOnlyBoard[5][4].king = true;
kingsOnlyBoard[4][3] = createPiece(COLORS.RED, 4, 3);
const kingsOnlyState = makeState(kingsOnlyBoard, [sacrifice]);
assert.equal(
  canAiPlay(kingsOnlyState, COLORS.BLACK, sacrifice),
  false,
  "Sacrifice should not be AI-playable when only kings can be sacrificed"
);

// Offering: king + man — AI should offer the man only.
const offeringState = createMatchState(Array(20).fill("nudge"));
offeringState.board = emptyBoard();
offeringState.board[2][1] = createPiece(COLORS.BLACK, 2, 1);
offeringState.board[2][1].king = true;
offeringState.board[6][5] = createPiece(COLORS.BLACK, 6, 5);
offeringState.hands[COLORS.BLACK] = [offering];

const offeringRes = tryAutoPlay(offeringState, COLORS.BLACK, offering);
assert.equal(offeringRes.success, true, "Offering should be playable with a man available");
assert.notEqual(offeringRes.picks[0].join(","), "2,1", "AI must not offer its king");

// Offering: only kings — AI should not play.
const offeringKingsState = createMatchState(Array(20).fill("nudge"));
offeringKingsState.board = emptyBoard();
offeringKingsState.board[2][1] = createPiece(COLORS.BLACK, 2, 1);
offeringKingsState.board[2][1].king = true;
offeringKingsState.board[6][5] = createPiece(COLORS.BLACK, 6, 5);
offeringKingsState.board[6][5].king = true;
offeringKingsState.hands[COLORS.BLACK] = [offering];
assert.equal(
  canAiPlay(offeringKingsState, COLORS.BLACK, offering),
  false,
  "Offering should not be AI-playable when only kings can be offered"
);

console.log("All AI sacrifice-king tests passed.");
