#!/usr/bin/env node
import assert from "node:assert/strict";
import { createMatchState } from "../js/match.js";
import { planAiTurnWork } from "../js/ai.js";
import { COLORS } from "../js/board.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { getCardById } from "../js/cards.js";
import { DRAW_EVERY_TURNS } from "../js/cardCatalog.js";
import {
  createMatchMeta,
  startTurnMeta,
  applyPeriodicTurnDraw,
  isPeriodicDrawTurn,
} from "../js/gameMeta.js";

const human = COLORS.RED;
const ai = COLORS.BLACK;

function testBlindHandlerTargetsOpponent() {
  const state = createMatchState(Array(40).fill("nudge"));
  applyCard(state, ai, getCardById("blind"), []);
  assert.equal(state.meta.blindNext[human], true);
  assert.equal(state.meta.blindNext[ai], false);
}

function testBlindNextActivatesOnTurnStart() {
  const state = { meta: createMatchMeta() };
  state.meta.blindNext[human] = true;
  startTurnMeta(state, human);
  assert.equal(state.meta.blindNext[human], false);
  assert.equal(state.meta.blinded[human], true);
}

function testBlindClearsAfterOneTurn() {
  const state = { meta: createMatchMeta() };
  state.meta.blindNext[human] = true;
  startTurnMeta(state, human);
  assert.equal(state.meta.blinded[human], true);
  startTurnMeta(state, human);
  assert.equal(state.meta.blinded[human], false);
  assert.equal(state.meta.blindNext[human], false);
}

function testPeriodicDrawBlockedOnlyWhileBlindPending() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turnNumber[human] = DRAW_EVERY_TURNS;
  assert.equal(isPeriodicDrawTurn(state.turnNumber[human]), true);

  const before = state.hands[human].length;
  const pileBefore = state.drawPile[human].length;
  state.meta.blindNext[human] = true;

  const blocked = applyPeriodicTurnDraw(state, human);
  assert.equal(blocked.blockedByBlind, true);
  assert.equal(blocked.drew, 0);
  assert.equal(state.hands[human].length, before);
  assert.equal(state.drawPile[human].length, pileBefore);

  startTurnMeta(state, human);
  assert.equal(state.meta.blinded[human], true);
  assert.equal(state.meta.blindNext[human], false);

  // Later draw turns are not affected once Blind has expired.
  state.turnNumber[human] = DRAW_EVERY_TURNS * 2;
  state.meta.blinded[human] = false;
  const later = applyPeriodicTurnDraw(state, human);
  assert.equal(later.blockedByBlind, false);
  assert.equal(later.drew, 1);
  assert.equal(state.hands[human].length, before + 1);
}

function testBlindDoesNotBlockNonDrawTurns() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turnNumber[human] = DRAW_EVERY_TURNS + 1;
  assert.equal(isPeriodicDrawTurn(state.turnNumber[human]), false);
  state.meta.blindNext[human] = true;
  const before = state.hands[human].length;
  const result = applyPeriodicTurnDraw(state, human);
  assert.equal(result.blockedByBlind, false);
  assert.equal(result.drew, 0);
  assert.equal(state.hands[human].length, before);
  startTurnMeta(state, human);
  assert.equal(state.meta.blinded[human], true, "still suppresses spells on non-draw turns");
}

function testNormalPeriodicDrawStillWorks() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turnNumber[human] = DRAW_EVERY_TURNS;
  const before = state.hands[human].length;
  const result = applyPeriodicTurnDraw(state, human);
  assert.equal(result.blockedByBlind, false);
  assert.equal(result.drew, 1);
  assert.equal(state.hands[human].length, before + 1);
}

function testAiSkipsSpellsWhenBlinded() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turn = ai;
  state.meta.blinded[ai] = true;
  state.hands[ai] = [getCardById("nudge"), getCardById("nudge")];
  const { log } = planAiTurnWork(state, "Opponent", ai);
  assert.ok(!log.some((e) => e.type === "spell"), "blinded AI should not cast spells");
  assert.ok(log.some((e) => e.type === "message" && /blinded/i.test(e.text)));
}

function testCardDescriptionMentionsDraw() {
  const card = getCardById("blind");
  assert.match(card.desc, /draw/i);
  assert.match(card.desc, /cannot play cards/i);
}

testBlindHandlerTargetsOpponent();
testBlindNextActivatesOnTurnStart();
testBlindClearsAfterOneTurn();
testPeriodicDrawBlockedOnlyWhileBlindPending();
testBlindDoesNotBlockNonDrawTurns();
testNormalPeriodicDrawStillWorks();
testAiSkipsSpellsWhenBlinded();
testCardDescriptionMentionsDraw();
console.log("test-blind.mjs: all passed");
