/**
 * Mulligan shuffles the hand into the draw pile, redraws from the deck,
 * and grants a bonus spell this turn.
 * Run: node scripts/test-mulligan.mjs
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { createMatchMeta } from "../js/gameMeta.js";
import { getCardDef } from "../js/cardCatalog.js";
import { applyEffect } from "../js/cardEffectHandlers.js";
import { createCardInstance } from "../js/cards.js";
import { initDeckPiles } from "../js/deckPile.js";

const mulligan = getCardDef("mulligan");

function makeState(handIds, drawIds = []) {
  const state = {
    board: Array.from({ length: 8 }, () => Array(8).fill(null)),
    hands: {
      [COLORS.RED]: handIds.map((id) => createCardInstance(getCardDef(id))),
      [COLORS.BLACK]: [],
    },
    meta: createMatchMeta(),
    squares: {},
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initDeckPiles(state, drawIds, []);
  return state;
}

const deckIds = ["ward", "nudge", "backstep", "dash", "retreat"];
const state = makeState(["nudge", "backstep", "ward"], deckIds);
const beforeIds = state.hands[COLORS.RED].map((c) => c.instanceId);
const pileBefore = state.drawPile[COLORS.RED].length;

const result = applyEffect(state, COLORS.RED, mulligan.effect, []);
assert.equal(result.success, true);
assert.equal(state.hands[COLORS.RED].length, 3);
assert.equal(state.meta.extraSpellCast[COLORS.RED], true);
assert.match(result.message, /cast another spell/i);
assert.ok(
  state.hands[COLORS.RED].every((c) => !beforeIds.includes(c.instanceId)),
  "hand should contain freshly drawn card instances"
);
assert.equal(
  state.discardPile[COLORS.RED].length,
  0,
  "mulligan should shuffle into the deck, not the discard pile"
);
assert.equal(
  state.drawPile[COLORS.RED].length,
  pileBefore,
  "mulligan returns hand cards to the deck before redrawing"
);
assert.ok(
  state.hands[COLORS.RED].every((c) => deckIds.includes(c.id)),
  "redrawn cards must come from the player's deck"
);

const emptyHand = makeState([], ["nudge", "ward"]);
const emptyResult = applyEffect(emptyHand, COLORS.RED, mulligan.effect, []);
assert.equal(emptyResult.success, true);
assert.equal(emptyHand.hands[COLORS.RED].length, 0);
assert.equal(emptyHand.meta.extraSpellCast[COLORS.RED], true);
assert.equal(emptyHand.drawPile[COLORS.RED].length, 2, "empty hand draws nothing from deck");

const shortDeck = makeState(["nudge", "backstep", "ward"], ["dash"]);
const shortResult = applyEffect(shortDeck, COLORS.RED, mulligan.effect, []);
assert.equal(shortResult.success, true);
assert.equal(shortDeck.hands[COLORS.RED].length, 3, "draw up to hand size from shuffled deck");
assert.equal(shortDeck.drawPile[COLORS.RED].length, 1);
assert.ok(
  shortDeck.hands[COLORS.RED].every((c) => ["nudge", "backstep", "ward", "dash"].includes(c.id)),
  "short deck redraw must still come from deck cards"
);

assert.equal(getCardDef("purify").rarity, "uncommon");

console.log("test-mulligan.mjs: all assertions passed");
