/**
 * AI should play Ignore (not capture) when every mandatory jump enables a counter-capture
 * and a non-capture move is available after Ignore.
 * Run: node scripts/test-ai-ignore-counter-capture.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { createCardInstance } from "../js/cards.js";
import { shouldAiPlayIgnore, planAiTurn } from "../js/ai.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board, blackHand = []) {
  return {
    board,
    hands: {
      [COLORS.RED]: [],
      [COLORS.BLACK]: blackHand.map((id) => createCardInstance({ id, name: id, effect: id, mode: "instant" })),
    },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: true, [COLORS.BLACK]: false },
  };
}

// Black a8 must jump b7; landing c6 lets red d5 capture back. Black a3 can step after Ignore.
const counterTrap = emptyBoard();
counterTrap[1][0] = createPiece(COLORS.BLACK, 1, 0);
counterTrap[2][1] = createPiece(COLORS.RED, 2, 1);
counterTrap[4][3] = createPiece(COLORS.RED, 4, 3);
counterTrap[5][0] = createPiece(COLORS.BLACK, 5, 0);

const trapState = makeState(counterTrap, ["ignore"]);
assert.equal(
  shouldAiPlayIgnore(trapState, COLORS.BLACK),
  true,
  "AI should want Ignore when every jump enables counter-capture"
);

const trapLog = planAiTurn(trapState, "Opponent", COLORS.BLACK);
assert.equal(trapLog[0]?.type, "spell", "AI should cast a spell first");
assert.equal(trapLog[0]?.cardId, "ignore", "AI should cast Ignore");
assert.equal(trapLog[1]?.type, "move", "AI should move after Ignore");
assert.equal(trapLog[1]?.captures?.length ?? 0, 0, "AI should not capture after Ignore");

// Same jump is safe when the counter-attacker is absent.
const safeCapture = emptyBoard();
safeCapture[1][0] = createPiece(COLORS.BLACK, 1, 0);
safeCapture[2][1] = createPiece(COLORS.RED, 2, 1);
safeCapture[5][0] = createPiece(COLORS.BLACK, 5, 0);

const safeState = makeState(safeCapture, ["ignore"]);
assert.equal(
  shouldAiPlayIgnore(safeState, COLORS.BLACK),
  false,
  "AI should not want Ignore when a safe capture exists"
);

console.log("test-ai-ignore-counter-capture.mjs: all assertions passed");
