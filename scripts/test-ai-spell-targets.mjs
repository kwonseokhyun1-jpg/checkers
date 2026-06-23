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

for (const id of ["bomb", "bishops_mark", "rooks_mark"]) {
  const card = getCardDef(id);
  const targets = getValidTargets(state, COLORS.BLACK, card, []);
  assert.deepEqual(
    targets,
    [[5, 2]],
    `${id} should only target the movable friendly piece`
  );
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, `${id} should be AI-playable`);
}

const shockwaveNoEnemy = getCardDef("shockwave");
assert.deepEqual(
  getValidTargets(state, COLORS.BLACK, shockwaveNoEnemy, []),
  [],
  "shockwave should not target pieces with no landing square adjacent to an enemy"
);
assert.equal(
  canAiPlay(state, COLORS.BLACK, shockwaveNoEnemy),
  false,
  "shockwave should not be AI-playable when no move lands next to an enemy"
);

const shockwaveBoard = emptyBoard();
shockwaveBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
shockwaveBoard[3][4] = createPiece(COLORS.RED, 3, 4);
const shockwaveState = makeState(shockwaveBoard);
const shockwave = getCardDef("shockwave");
assert.deepEqual(
  getValidTargets(shockwaveState, COLORS.BLACK, shockwave, []),
  [[3, 2]],
  "shockwave should target movable piece that can land adjacent to an enemy"
);
assert.equal(canAiPlay(shockwaveState, COLORS.BLACK, shockwave), true, "shockwave should be AI-playable");
const shockwaveRes = tryAutoPlay(structuredClone(shockwaveState), COLORS.BLACK, shockwave);
assert.equal(shockwaveRes.success, true, "AI shockwave cast should succeed");
assert.deepEqual(shockwaveRes.picks, [[3, 2]], "AI shockwave should arm the piece that can pulse an enemy");

const bomb = getCardDef("bomb");
const work = structuredClone(state);
const res = tryAutoPlay(work, COLORS.BLACK, bomb);
assert.equal(res.success, true, "AI bomb cast should succeed");
assert.deepEqual(res.picks, [[5, 2]], "AI bomb should arm the movable piece");

console.log("test-ai-spell-targets.mjs: all assertions passed");
