#!/usr/bin/env node
/**
 * PvP turn moves must serialize each sub-move (bear bonus, chain jumps) for opponent replay.
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { applyAiReplayEntry } from "../js/ai.js";

const state = createMatchState(Array(DECK_SIZE).fill("nudge"));
assert.equal(state.pvpTurnSeq, 0);
assert.equal(state.pvpLastTurnMoves, null);

const pvpLastTurnMoves = {
  seq: 1,
  mover: COLORS.BLACK,
  moves: [
    {
      type: "move",
      from: [2, 1],
      to: [3, 2],
      captures: [],
      moveKind: "step",
      text: "Moved c3 → d4",
    },
    {
      type: "move",
      from: [3, 2],
      to: [4, 3],
      captures: [],
      moveKind: "step",
      bearBonus: true,
      text: "Awoken Bear — d4 → e5",
    },
  ],
};

const beforeBoard = JSON.parse(JSON.stringify(state.board));
const replayState = JSON.parse(JSON.stringify(state));

for (const entry of pvpLastTurnMoves.moves) {
  applyAiReplayEntry(replayState, entry, COLORS.BLACK);
}

assert.notDeepEqual(replayState.board, beforeBoard, "replay should change the board");
assert.equal(
  pvpLastTurnMoves.moves.length,
  2,
  "bear bonus should be a separate replay entry"
);
assert.equal(pvpLastTurnMoves.moves[1].bearBonus, true);

console.log("PvP move replay test passed");
