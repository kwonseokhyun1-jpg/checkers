/**
 * Offering grants an immediate follow-up spell (extraSpellCast), without marking spellPlayed.
 * Finish-card consumption must leave the caster able to cast again in the cards phase.
 * Run: node scripts/test-offering-bonus-cast.mjs
 */
import assert from "node:assert/strict";
import { COLORS, SIZE, createPiece, setPiece } from "../js/board.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import { createMatchState, PHASE } from "../js/match.js";

const offering = getCardDef("offering");

const state = createMatchState([
  "nudge",
  "nudge",
  "nudge",
  "nudge",
  "nudge",
  "nudge",
  "nudge",
  "nudge",
]);
state.board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
setPiece(state.board, 5, 2, createPiece(COLORS.RED, 5, 2));
setPiece(state.board, 5, 4, createPiece(COLORS.RED, 5, 4));

const handBefore = state.hands[COLORS.RED].length;
const result = applyEffect(state, COLORS.RED, offering.effect, [[5, 2]]);
assert.equal(result.success, true, "Offering should succeed");
assert.equal(state.board[5][2], null, "offered piece is removed");
assert.equal(state.meta.extraSpellCast[COLORS.RED], true, "Offering grants extraSpellCast");
assert.ok(state.hands[COLORS.RED].length > handBefore, "Offering draws cards");
assert.match(result.message, /cast another spell/i);

// Mimic finishCardPlay / castInstantSpell bonus consumption.
const bonusSpell = !!state.meta.extraSpellCast[COLORS.RED];
assert.equal(bonusSpell, true);
if (!bonusSpell) state.spellPlayed[COLORS.RED] = true;
else state.meta.extraSpellCast[COLORS.RED] = false;

assert.equal(state.spellPlayed[COLORS.RED], false, "bonus cast must not mark spellPlayed");
assert.equal(state.meta.extraSpellCast[COLORS.RED], false, "extraSpellCast is consumed for this cast");

state.phase = PHASE.CARDS;
assert.equal(
  !state.spellPlayed[COLORS.RED] && state.phase === PHASE.CARDS,
  true,
  "caster remains eligible for another spell immediately after Offering"
);

console.log("test-offering-bonus-cast.mjs: all assertions passed");
