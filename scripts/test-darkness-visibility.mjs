#!/usr/bin/env node
/**
 * Darkness: owner-based duration, zone detection, and opponent piece cloaking.
 */
import assert from "node:assert/strict";
import { COLORS, tickEffects, SIZE } from "../js/board.js";
import { applyCard, getDarknessZoneCells } from "../js/cardEffectHandlers.js";
import { getCardById } from "../js/cards.js";
import { initCardState } from "../js/cardEffects.js";
import {
  createMatchMeta,
  getDarknessCasterForCell,
  isInDarknessZone,
  isPieceHiddenByDarknessFromViewer,
} from "../js/gameMeta.js";

function makeState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    squares: {},
    meta: createMatchMeta(),
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    drawPile: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    discardPile: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
  };
  initCardState(state);
  return state;
}

const card = getCardById("darkness");
const core = [3, 2];
const state = makeState();

const res = applyCard(state, COLORS.RED, card, [core]);
assert.equal(res.success, true);
assert.equal(state.squares["3,2"].darkness, 2);
assert.equal(state.squares["3,2"].darknessOwner, COLORS.RED);

const ring = getDarknessZoneCells(core[0], core[1]).filter(([r, c]) => !(r === core[0] && c === core[1]));
assert.ok(ring.length > 0, "darkness ring should include surrounding dark squares");
for (const [r, c] of ring) {
  assert.ok(isInDarknessZone(state, r, c), `ring cell ${r},${c} should be in zone`);
  assert.equal(getDarknessCasterForCell(state, r, c), COLORS.RED);
}
assert.equal(isInDarknessZone(state, core[0], core[1]), false, "core is not inside its own ring");

state.board[ring[0][0]][ring[0][1]] = {
  id: 99,
  color: COLORS.RED,
  king: false,
  row: ring[0][0],
  col: ring[0][1],
};
assert.equal(isPieceHiddenByDarknessFromViewer(state, ring[0][0], ring[0][1], COLORS.BLACK), true);
assert.equal(isPieceHiddenByDarknessFromViewer(state, ring[0][0], ring[0][1], COLORS.RED), false);

tickEffects(state.board, COLORS.BLACK, state);
assert.equal(state.squares["3,2"].darkness, 2, "opponent turn start should not tick darkness");

tickEffects(state.board, COLORS.RED, state);
assert.equal(state.squares["3,2"].darkness, 1, "caster turn start should tick darkness once");

tickEffects(state.board, COLORS.BLACK, state);
assert.equal(state.squares["3,2"].darkness, 1, "opponent turn start should not tick again");

tickEffects(state.board, COLORS.RED, state);
assert.equal(state.squares["3,2"].darkness, undefined, "second caster tick should clear darkness");

console.log("Darkness visibility test passed");
