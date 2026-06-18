/**
 * Move-dependent friendly spells should only target pieces that can actually move.
 * Run: node scripts/test-ai-spell-targets.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, getValidTargets, tryAutoPlay } from "../js/cardEffects.js";
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

const board = emptyBoard();
board[5][2] = createPiece(COLORS.BLACK, 5, 2);
board[5][4] = createPiece(COLORS.BLACK, 5, 4);
board[5][4].frozenTurns = 3;
board[5][6] = createPiece(COLORS.BLACK, 5, 6);
board[5][6].paralyzedTurns = 2;
board[5][0] = createPiece(COLORS.BLACK, 5, 0);
board[5][0].hibernationTurns = 2;

const state = makeState(board);

for (const id of ["bomb", "shockwave", "bishops_mark", "rooks_mark"]) {
  const card = getCardDef(id);
  const targets = getValidTargets(state, COLORS.BLACK, card, []);
  assert.deepEqual(
    targets,
    [[5, 2]],
    `${id} should only target the movable friendly piece`
  );
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, `${id} should be AI-playable`);
}

const bomb = getCardDef("bomb");
const work = structuredClone(state);
const res = tryAutoPlay(work, COLORS.BLACK, bomb);
assert.equal(res.success, true, "AI bomb cast should succeed");
assert.deepEqual(res.picks, [[5, 2]], "AI bomb should arm the movable piece");

console.log("test-ai-spell-targets.mjs: all assertions passed");
