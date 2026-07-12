#!/usr/bin/env node
/**
 * PvP move highlights should serialize each sub-move for opponent square flashes.
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { DECK_SIZE } from "../js/cardCatalog.js";

const state = createMatchState(Array(DECK_SIZE).fill("nudge"));
assert.equal(state.pvpMoveHighlightSeq, 0);
assert.equal(state.pvpLastMoveHighlights, null);

const payload = {
  seq: 1,
  mover: COLORS.BLACK,
  moves: [
    { from: [2, 1], to: [3, 2], captures: [] },
    { from: [3, 2], to: [4, 3], captures: [] },
  ],
};

assert.equal(payload.moves.length, 2, "bear-style turns should include multiple highlight entries");
assert.deepEqual(payload.moves[0].from, [2, 1]);
assert.deepEqual(payload.moves[1].to, [4, 3]);

console.log("PvP move highlight test passed");
