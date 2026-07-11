#!/usr/bin/env node
/**
 * Bear bonus moves should sync to PvP incrementally (one replay entry per move).
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { applyAiReplayEntry } from "../js/ai.js";

const state = createMatchState(Array(DECK_SIZE).fill("nudge"));

// First bear move synced mid-turn
const move1 = {
  seq: 1,
  mover: COLORS.RED,
  moves: [
    {
      type: "move",
      from: [2, 1],
      to: [3, 2],
      captures: [],
      moveKind: "step",
      text: "Moved c3 → d4",
    },
  ],
};

// Second bear move synced when turn ends
const move2 = {
  seq: 2,
  mover: COLORS.RED,
  moves: [
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

const replayState = JSON.parse(JSON.stringify(state));
const before = JSON.stringify(replayState.board);

applyAiReplayEntry(replayState, move1.moves[0], COLORS.RED);
const afterMove1 = JSON.stringify(replayState.board);
assert.notEqual(afterMove1, before, "first bear move should change the board");

applyAiReplayEntry(replayState, move2.moves[0], COLORS.RED);
assert.notEqual(JSON.stringify(replayState.board), afterMove1, "second bear move should change the board again");
assert.equal(replayState.meta.bearBonusUsed?.[COLORS.RED], true, "bear bonus tag sets used flag on replay");

console.log("Bear PvP incremental sync test passed");
