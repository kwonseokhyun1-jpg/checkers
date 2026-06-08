#!/usr/bin/env node
/**
 * Destroy spells should be consumed when Last Stand triggers (spell phase ends).
 * Run: node scripts/test-last-stand-destroy.mjs
 */
import { COLORS, createPiece, setPiece, SIZE } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState } from "../js/cardEffects.js";
import { CARD_REGISTRY } from "../js/cardRegistry.js";
import { isHiddenTrapSpell } from "../js/cardEffects.js";

function baseState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    turn: COLORS.RED,
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
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

const state = baseState();
setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, 4, 3));

const lastStand = CARD_REGISTRY.find((c) => c.id === "last_stand");
assert(isHiddenTrapSpell(lastStand), "Last Stand should be a hidden trap spell");

const arm = applyCard(state, COLORS.BLACK, lastStand, [[4, 3]]);
assert(arm.success, "Last Stand cast should succeed");
assert(state.board[4][3].lastStand === true, "Last Stand should be armed");

const shatter = CARD_REGISTRY.find((c) => c.id === "shatter");
const destroy = applyCard(state, COLORS.RED, shatter, [[4, 3]]);
assert(destroy.success, "Destroy spell should succeed when Last Stand triggers: " + (destroy.message || ""));
assert(state.board[4][3]?.color === COLORS.BLACK, "Piece should survive");
assert(state.board[4][3].lastStand === false, "Last Stand trap should be consumed");
assert(state.board[4][3].shieldTurns === 3, "Should grant 3-turn ultra shield");

console.log("OK: destroy spell consumed when Last Stand triggers");
