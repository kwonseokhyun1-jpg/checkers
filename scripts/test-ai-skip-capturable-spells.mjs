/**
 * AI should not waste attack spells on enemies capturable with a normal move this turn.
 * Run: node scripts/test-ai-skip-capturable-spells.mjs
 */
import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { canAiPlay, tryAutoPlay } from "../js/cardEffects.js";
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

// Black at c6 can jump-capture red at d5; snowball should not target d5.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[3][6] = createPiece(COLORS.RED, 3, 6);
  const state = makeState(board);
  const snowball = getCardDef("snowball");
  assert.equal(canAiPlay(state, COLORS.BLACK, snowball), true, "snowball playable on non-capturable enemy");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, snowball);
  assert.equal(res.success, true, "snowball cast should succeed");
  assert.deepEqual(res.picks, [[3, 6]], "snowball should skip the capturable enemy");
}

// Snowball not playable when every enemy is capturable this turn.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const snowball = getCardDef("snowball");
  assert.equal(canAiPlay(state, COLORS.BLACK, snowball), false, "snowball should not play when only capturable targets exist");
}

// Berserk should teleport instead of slamming a capturable enemy.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  const state = makeState(board);
  const berserk = getCardDef("berserk");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, berserk);
  assert.equal(res.success, true, "berserk should succeed");
  assert.notDeepEqual(res.picks?.[1], [4, 3], "berserk should not land on a capturable enemy");
}

// Berserk still destroys enemies that cannot be captured normally (existing behavior).
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[3][2] = createPiece(COLORS.RED, 3, 2);
  const state = makeState(board);
  const berserk = getCardDef("berserk");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, berserk);
  assert.equal(res.success, true, "berserk should succeed");
  assert.deepEqual(res.picks?.[1], [3, 2], "berserk should still slam non-capturable enemies");
}

// Pyromancy should skip capturable enemies for the first pick.
{
  const board = emptyBoard();
  board[3][2] = createPiece(COLORS.BLACK, 3, 2);
  board[4][3] = createPiece(COLORS.RED, 4, 3);
  board[3][6] = createPiece(COLORS.RED, 3, 6);
  const state = makeState(board);
  const pyro = getCardDef("pyromancy");
  assert.equal(canAiPlay(state, COLORS.BLACK, pyro), true, "pyromancy playable when a non-capturable enemy exists");
  const res = tryAutoPlay(structuredClone(state), COLORS.BLACK, pyro);
  assert.equal(res.success, true, "pyromancy cast should succeed");
  assert.deepEqual(res.picks?.[0], [3, 6], "pyromancy should skip the capturable enemy");
}

console.log("test-ai-skip-capturable-spells.mjs: all assertions passed");
