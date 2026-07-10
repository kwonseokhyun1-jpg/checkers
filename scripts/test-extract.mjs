#!/usr/bin/env node
import assert from "node:assert/strict";
import { createMatchState } from "../js/match.js";
import { planAiTurnWork } from "../js/ai.js";
import { COLORS } from "../js/board.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { createCardInstance, getCardById } from "../js/cards.js";
import { canCastInstant, getInstantCastBlockReason } from "../js/cardEffects.js";

const human = COLORS.RED;
const ai = COLORS.BLACK;

function testExtractDiscardsRandomOpponentCard() {
  const state = createMatchState(Array(40).fill("nudge"));
  const cards = [
    createCardInstance(getCardById("nudge")),
    createCardInstance(getCardById("backstep")),
    createCardInstance(getCardById("ward")),
  ];
  state.hands[human] = cards.map((c) => ({ ...c }));
  const before = state.hands[human].length;

  const res = applyCard(state, ai, getCardById("extract"), []);
  assert.equal(res.success, true);
  assert.equal(state.hands[human].length, before - 1);
  assert.equal(state.discardPile[human].length, 1);
  assert.ok(
    cards.some((c) => c.id === state.discardPile[human][0]),
    "discarded card should come from opponent hand",
  );
}

function testExtractBlockedWhenOpponentHandEmpty() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.hands[human] = [];
  const card = getCardById("extract");
  assert.equal(getInstantCastBlockReason(state, ai, card), "Opponent has no cards in hand.");
  assert.equal(canCastInstant(state, ai, card), false);
  const res = applyCard(state, ai, card, []);
  assert.equal(res.success, false);
}

function testAiCastsExtractWhenOpponentHasCards() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turn = ai;
  state.hands[ai] = [getCardById("extract")];
  state.hands[human] = [createCardInstance(getCardById("nudge"))];
  const { log } = planAiTurnWork(state, "Opponent", ai);
  assert.ok(log.some((e) => e.type === "spell" && e.cardEffect === "extract"));
}

testExtractDiscardsRandomOpponentCard();
testExtractBlockedWhenOpponentHandEmpty();
testAiCastsExtractWhenOpponentHasCards();
console.log("test-extract.mjs: all passed");
