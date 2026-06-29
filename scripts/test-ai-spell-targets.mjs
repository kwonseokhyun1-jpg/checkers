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

for (const id of ["bishops_mark", "rooks_mark"]) {
  const card = getCardDef(id);
  const targets = getValidTargets(state, COLORS.BLACK, card, []);
  assert.deepEqual(
    targets,
    [[5, 2]],
    `${id} should only target the movable friendly piece`
  );
  assert.equal(canAiPlay(state, COLORS.BLACK, card), true, `${id} should be AI-playable`);
}

const bombNoEnemy = getCardDef("bomb");
assert.deepEqual(
  getValidTargets(state, COLORS.BLACK, bombNoEnemy, []),
  [],
  "bomb should not target pieces with no landing square adjacent to an enemy"
);
assert.equal(
  canAiPlay(state, COLORS.BLACK, bombNoEnemy),
  false,
  "bomb should not be AI-playable when no move lands next to an enemy"
);

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

const bombBoard = emptyBoard();
bombBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
bombBoard[3][4] = createPiece(COLORS.RED, 3, 4);
const bombState = makeState(bombBoard);
const bomb = getCardDef("bomb");
assert.deepEqual(
  getValidTargets(bombState, COLORS.BLACK, bomb, []),
  [[3, 2]],
  "bomb should target movable piece that can land adjacent to an enemy"
);
assert.equal(canAiPlay(bombState, COLORS.BLACK, bomb), true, "bomb should be AI-playable");
const bombRes = tryAutoPlay(structuredClone(bombState), COLORS.BLACK, bomb);
assert.equal(bombRes.success, true, "AI bomb cast should succeed");
assert.deepEqual(bombRes.picks, [[3, 2]], "AI bomb should arm the piece that can explode an enemy");

const frontRowBoard = emptyBoard();
frontRowBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
frontRowBoard[5][2] = createPiece(COLORS.BLACK, 5, 2);
frontRowBoard[3][4] = createPiece(COLORS.RED, 3, 4);
frontRowBoard[6][2] = createPiece(COLORS.RED, 6, 2);
const frontRowState = makeState(frontRowBoard);
for (const id of ["bomb", "shockwave"]) {
  const card = getCardDef(id);
  const targets = getValidTargets(frontRowState, COLORS.BLACK, card, []);
  assert.ok(targets.some(([r]) => r === 5), `${id} should include front-row target`);
  assert.ok(targets.some(([r]) => r === 3), `${id} should include back-row target when both can pulse`);
  const auto = tryAutoPlay(structuredClone(frontRowState), COLORS.BLACK, card);
  assert.equal(auto.success, true, `AI ${id} cast should succeed`);
  assert.deepEqual(auto.picks, [[5, 2]], `AI ${id} should prefer the front-row piece`);
}

const plagueNoEnemy = getCardDef("plague");
assert.deepEqual(
  getValidTargets(state, COLORS.BLACK, plagueNoEnemy, []).sort((a, b) => a[0] - b[0] || a[1] - b[1]),
  [
    [5, 0],
    [5, 2],
    [5, 4],
    [5, 6],
  ],
  "plague should target any friendly piece for the player"
);
assert.equal(
  canAiPlay(state, COLORS.BLACK, plagueNoEnemy),
  false,
  "plague should not be AI-playable when no friendly piece is adjacent to an enemy"
);

const plagueBoard = emptyBoard();
plagueBoard[3][2] = createPiece(COLORS.BLACK, 3, 2);
plagueBoard[4][3] = createPiece(COLORS.RED, 4, 3);
const plagueState = makeState(plagueBoard);
const plague = getCardDef("plague");
assert.deepEqual(
  getValidTargets(plagueState, COLORS.BLACK, plague, []),
  [[3, 2]],
  "plague should target friendly pieces adjacent to an enemy"
);
assert.equal(canAiPlay(plagueState, COLORS.BLACK, plague), true, "plague should be AI-playable");
const plagueRes = tryAutoPlay(structuredClone(plagueState), COLORS.BLACK, plague);
assert.equal(plagueRes.success, true, "AI plague cast should succeed");
assert.deepEqual(plagueRes.picks, [[3, 2]], "AI plague should infect the piece adjacent to an enemy");

console.log("test-ai-spell-targets.mjs: all assertions passed");
