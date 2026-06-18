import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState, tryAutoPlay } from "../js/cardEffects.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board, color = COLORS.BLACK) {
  const state = {
    board,
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  return state;
}

// Black berserks onto red at c5 instead of an empty square when both are valid.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0); // a3 (dark)
  board[3][2] = createPiece(COLORS.RED, 3, 2); // c5 (dark)
  const state = makeState(board);
  const card = getCardDef("berserk");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "berserk should succeed");
  assert.deepEqual(res.picks?.[1], [3, 2], "AI should land on the destroyable enemy");
  assert.equal(state.board[3][2]?.color, COLORS.BLACK, "black should occupy the enemy square");
  assert.equal(state.board[5][0], null, "source square should be empty");
}

// Empty teleport still works when no destroy is available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  const state = makeState(board);
  const card = getCardDef("berserk");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "berserk should succeed without enemies");
  assert.ok(state.board[res.picks[1][0]][res.picks[1][1]]?.color === COLORS.BLACK);
}

console.log("AI berserk test passed");
