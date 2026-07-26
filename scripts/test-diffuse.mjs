/**
 * Diffuse clears all traps, grants a bonus spell, and can't be countered.
 * Run: node scripts/test-diffuse.mjs
 */
import assert from "node:assert/strict";
import {
  COLORS,
  SIZE,
  createPiece,
  setPiece,
  LAST_STAND_TRAP_TURNS,
  VENGEANCE_TRAP_TURNS,
  MARTYR_TRAP_TURNS,
} from "../js/board.js";
import {
  createMatchMeta,
  hasAnyTrapArmed,
  placeMine,
  placeHiddenQuicksand,
} from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import { initCardState } from "../js/cardEffects.js";

const diffuse = getCardDef("diffuse");

function makeState() {
  const state = {
    board: Array.from({ length: SIZE }, () => Array(SIZE).fill(null)),
    hands: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  return state;
}

assert.equal(diffuse.rarity, "uncommon");
assert.equal(diffuse.uncounterable, true);

const state = makeState();
state.meta.counterspell[COLORS.BLACK] = true;
state.meta.vengeance[COLORS.RED] = VENGEANCE_TRAP_TURNS;
setPiece(state.board, 3, 3, createPiece(COLORS.RED, 3, 3));
const piece = state.board[3][3];
piece.lastStand = true;
piece.lastStandTurns = LAST_STAND_TRAP_TURNS;
piece.martyr = true;
piece.martyrTurns = MARTYR_TRAP_TURNS;
piece.deflectTurns = 2;
const sq = state.squares["4,4"] = {};
placeMine(sq, COLORS.BLACK, true);
placeHiddenQuicksand(state.squares["5,5"] = {}, COLORS.RED);

assert.equal(hasAnyTrapArmed(state), true);

const result = applyEffect(state, COLORS.RED, diffuse.effect, []);
assert.equal(result.success, true);
assert.equal(hasAnyTrapArmed(state), false);
assert.equal(state.meta.counterspell[COLORS.BLACK], false);
assert.equal(state.meta.vengeance[COLORS.RED], 0);
assert.equal(piece.lastStand, false);
assert.equal(piece.martyr, false);
assert.equal(piece.deflectTurns, 0);
assert.equal(state.squares["4,4"].hiddenMine, undefined);
assert.equal(state.squares["5,5"].hiddenQuicksand, undefined);
assert.equal(state.meta.extraSpellCast[COLORS.RED], true);
assert.match(result.message, /cast another spell/i);

const counterState = makeState();
counterState.meta.counterspell[COLORS.BLACK] = true;
const counterResult = applyEffect(counterState, COLORS.RED, diffuse.effect, []);
assert.equal(counterResult.success, true);
assert.equal(counterState.meta.counterspell[COLORS.BLACK], false);
assert.equal(counterState.meta.extraSpellCast[COLORS.RED], true);

console.log("test-diffuse.mjs: all assertions passed");
