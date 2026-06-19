#!/usr/bin/env node
/**
 * Deflect: hidden trap, spell-only redirect to closest enemy for 2 turns.
 * Run: node scripts/test-deflect.mjs
 */
import assert from "node:assert/strict";
import {
  COLORS,
  createPiece,
  setPiece,
  SIZE,
  resolveCapture,
  findClosestEnemySquare,
} from "../js/board.js";
import { createMatchMeta, takeTrapHistoryReveal } from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState, isHiddenTrapSpell } from "../js/cardEffects.js";
import { CARD_REGISTRY } from "../js/cardRegistry.js";

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

const deflectCard = CARD_REGISTRY.find((c) => c.id === "deflect");
const snipe = CARD_REGISTRY.find((c) => c.id === "snipe");

assert(isHiddenTrapSpell(deflectCard), "Deflect should be a hidden trap spell");

const state = baseState();
setPiece(state.board, 4, 3, createPiece(COLORS.BLACK, false, 4, 3));
setPiece(state.board, 2, 5, createPiece(COLORS.RED, false, 2, 5));
setPiece(state.board, 6, 1, createPiece(COLORS.RED, false, 6, 1));

const arm = applyCard(state, COLORS.BLACK, deflectCard, [[4, 3]]);
assert(arm.success, "Deflect should arm");
assert.equal(state.board[4][3].deflectTurns, 2, "Deflect should last 2 turns");

const closest = findClosestEnemySquare(state.board, 4, 3, COLORS.BLACK, [4, 3]);
assert.deepEqual(closest, [2, 5], "Closest enemy of defender should be picked");

const spellHit = resolveCapture(state.board, state, 4, 3, COLORS.BLACK, { nonCap: true });
assert.equal(spellHit, false, "Deflected piece should survive spell kill");
assert.equal(state.board[4][3]?.color, COLORS.BLACK, "Deflected piece should remain");
assert.equal(state.board[4][3].deflectTurns, 0, "Deflect should be consumed");
assert.equal(state.board[2][5], null, "Closest enemy should die instead");
assert(state.boardFx?.kind === "deflect", "Deflect should queue board fx");
const trap = takeTrapHistoryReveal(state);
assert.equal(trap?.effect, "deflect_1", "Trap history should reveal Deflect");

const capState = baseState();
setPiece(capState.board, 4, 3, createPiece(COLORS.BLACK, false, 4, 3));
setPiece(capState.board, 3, 4, createPiece(COLORS.RED, false, 3, 4));
capState.board[4][3].deflectTurns = 2;
const captured = resolveCapture(capState.board, capState, 4, 3, COLORS.RED, { nonCap: false });
assert.equal(captured, true, "Capture should not trigger deflect");
assert.equal(capState.board[4][3], null, "Piece should be captured normally");

const snipeState = baseState();
setPiece(snipeState.board, 4, 3, createPiece(COLORS.BLACK, false, 4, 3));
setPiece(snipeState.board, 1, 1, createPiece(COLORS.RED, false, 1, 1));
snipeState.board[4][3].deflectTurns = 2;
const snipeRes = applyCard(snipeState, COLORS.RED, snipe, [[4, 3]]);
assert(snipeRes.success, "Snipe should succeed when deflect triggers");
assert(snipeState.board[4][3]?.color === COLORS.BLACK, "Snipe target survives via deflect");
assert.equal(snipeState.board[1][1], null, "Redirected enemy should die");

console.log("Deflect test: OK");
