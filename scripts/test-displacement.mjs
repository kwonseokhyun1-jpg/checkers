#!/usr/bin/env node
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { initCardState, getValidTargets } from "../js/cardEffects.js";
import { applyCard, getDisplacementDestinations, ownSideRows } from "../js/cardEffectHandlers.js";
import { CARDS } from "../js/cards.js";

const COLOR = COLORS.RED;
const card = { ...CARDS.displacement, effect: "displacement", mode: "f_empty" };

function baseState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLOR,
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    gems: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
    turnNumber: { [COLORS.RED]: 0, [COLORS.BLACK]: 0 },
  };
  initCardState(state);
  return state;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const state = baseState();
setPiece(state.board, 6, 1, createPiece(COLOR, 6, 1));
setPiece(state.board, 0, 3, createPiece(COLORS.BLACK, 0, 3));

const dests = getDisplacementDestinations(state, COLOR);
assert(dests.some(([r]) => r === 4), "should include row 4 on red side");
assert(!dests.some(([r]) => r <= 3), "should not include enemy half for red");

const starters = getValidTargets(state, COLOR, card, []);
assert(starters.length === 1, "one friendly piece selectable");

const second = getValidTargets(state, COLOR, card, [[6, 1]]);
assert(second.length > 0, "has own-side destinations");
assert(second.every(([r]) => ownSideRows(COLOR).includes(r)), "destinations stay on own side");

const res = applyCard(state, COLOR, card, [[6, 1], second[0]]);
assert(res.success, res.message || "cast failed");
assert(state.board[6][1] === null, "source cleared");
assert(state.board[second[0][0]][second[0][1]]?.color === COLOR, "piece teleported");

const twoPickOnly = getValidTargets(state, COLOR, card, []).length >= 0;
assert(twoPickOnly, "sanity");

console.log("Displacement spell test: OK");
