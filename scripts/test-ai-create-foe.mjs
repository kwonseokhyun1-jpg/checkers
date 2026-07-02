import assert from "node:assert/strict";
import { COLORS, createPiece } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { initCardState, tryAutoPlay } from "../js/cardEffects.js";

function emptyBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

function makeState(board) {
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

// Prefer a spawn that enables a chain capture over the foe as stepping stone.
{
  const board = emptyBoard();
  board[2][1] = createPiece(COLORS.BLACK, 2, 1);
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  board[5][4] = createPiece(COLORS.RED, 5, 4);
  const state = makeState(board);
  const card = getCardDef("create_foe");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "create_foe should succeed");
  assert.deepEqual(
    res.picks?.[0],
    [3, 2],
    "AI should spawn on the chain-capture square (c6), not the single-capture square (b7)"
  );
  assert.equal(state.board[3][2]?.color, COLORS.RED, "spawned foe should be red");
}

// Fall back to a single capture when no chain is available.
{
  const board = emptyBoard();
  board[5][0] = createPiece(COLORS.BLACK, 5, 0);
  const state = makeState(board);
  const card = getCardDef("create_foe");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "create_foe should succeed");
  assert.deepEqual(
    res.picks?.[0],
    [6, 1],
    "AI should spawn on the square that enables a capture over the foe"
  );
}

// Still playable on any empty dark square when no capture setup exists.
{
  const board = emptyBoard();
  board[5][2] = createPiece(COLORS.BLACK, 5, 2);
  const state = makeState(board);
  const card = getCardDef("create_foe");
  const res = tryAutoPlay(state, COLORS.BLACK, card);
  assert.equal(res.success, true, "create_foe should succeed without capture setups");
  assert.ok(state.board[res.picks[0][0]][res.picks[0][1]]?.color === COLORS.RED, "foe should be spawned");
}

console.log("AI create foe test passed");
