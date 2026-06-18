#!/usr/bin/env node
/**
 * PvP chain lightning replay must use pre-spell animation squares, not post-spell board.
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { getChainLightningAnimSquares } from "../js/cardEffectHandlers.js";

const state = createMatchState(Array(30).fill("nudge"));
const picks = [[1, 0]];
const chainSquares = [
  [1, 0],
  [0, 1],
  [1, 2],
];

const pvpLastSpell = {
  seq: 1,
  caster: COLORS.BLACK,
  cardEffect: "chain_lightning",
  picks: picks.map((p) => [...p]),
  chainSquares: chainSquares.map((p) => [...p]),
};

for (const [r, c] of chainSquares.slice(1)) {
  state.board[r][c] = null;
}

const recomputed = getChainLightningAnimSquares(state, picks[0][0], picks[0][1], COLORS.BLACK);
assert.notDeepEqual(
  recomputed,
  pvpLastSpell.chainSquares,
  "post-spell board should not reproduce pre-spell chain animation squares"
);

function buildReplayExtra(spell, liveState, casterColor) {
  const extra = {};
  if (spell.chainSquares?.length) extra.chainSquares = spell.chainSquares;
  else if (spell.cardEffect === "chain_lightning" && spell.picks?.length) {
    const [pr, pc] = spell.picks[0];
    extra.chainSquares = getChainLightningAnimSquares(liveState, pr, pc, casterColor);
  }
  return extra;
}

assert.deepEqual(
  buildReplayExtra(pvpLastSpell, state, COLORS.BLACK).chainSquares,
  chainSquares,
  "stored chainSquares should drive opponent replay visuals"
);

console.log("PvP spell replay test passed");
