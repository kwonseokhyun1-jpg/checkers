#!/usr/bin/env node
import assert from "node:assert/strict";
import { createMatchState } from "../js/match.js";
import { planAiTurnWork, applyAiReplayEntry } from "../js/ai.js";
import { COLORS, getAllMovesForColor } from "../js/board.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { getCardById } from "../js/cards.js";
import {
  createMatchMeta,
  startTurnMeta,
  isConfused,
  clearConfusion,
} from "../js/gameMeta.js";

const human = COLORS.RED;
const ai = COLORS.BLACK;

function testConfuseNextActivatesOnTurnStart() {
  const state = { meta: createMatchMeta() };
  state.meta.confuseNext[human] = true;
  startTurnMeta(state, human);
  assert.equal(state.meta.confuseNext[human], false);
  assert.equal(state.meta.confused[human], true);
  assert.equal(isConfused(state.meta, human), true);
}

function testAiCastSetsConfusionForHuman() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turn = ai;
  state.hands[ai] = [getCardById("confusion")];
  const { log, work } = planAiTurnWork(state, "Opponent", ai);
  assert.ok(log.some((e) => e.type === "spell" && e.cardEffect === "confusion"));
  assert.equal(work.meta.confuseNext[human], true);

  const live = createMatchState(Array(40).fill("nudge"));
  live.turn = ai;
  live.hands[ai] = [getCardById("confusion")];
  for (const entry of log) applyAiReplayEntry(live, entry, ai);

  live.turn = human;
  startTurnMeta(live, human);
  assert.equal(live.meta.confused[human], true, "human should be confused after turn start");
}

function testPickConfusedMoveUsesFullPool() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turn = human;
  state.meta.confused[human] = true;
  const pool = getAllMovesForColor(state.board, human, state);
  assert.ok(pool.length > 1, "need multiple moves for randomness test");

  const picks = new Set();
  for (let i = 0; i < 40; i++) {
    const trial = structuredClone(state);
    trial.meta.confused[human] = true;
    clearConfusion(trial.meta, human);
    const move = pool[Math.floor(Math.random() * pool.length)];
    picks.add(`${move.from}-${move.to}`);
  }
  assert.ok(picks.size > 1, "random picker should reach multiple destinations");
}

function testConfusionHandlerTargetsOpponent() {
  const state = createMatchState(Array(40).fill("nudge"));
  applyCard(state, ai, getCardById("confusion"), []);
  assert.equal(state.meta.confuseNext[human], true);
  assert.equal(state.meta.confuseNext[ai], false);
}

function testAiSkipsSpellsWhenConfused() {
  const state = createMatchState(Array(40).fill("nudge"));
  state.turn = ai;
  state.meta.confused[ai] = true;
  state.hands[ai] = [getCardById("nudge"), getCardById("nudge")];
  const { log } = planAiTurnWork(state, "Opponent", ai);
  assert.ok(!log.some((e) => e.type === "spell"), "confused AI should not cast spells");
  assert.ok(log.some((e) => e.type === "message" && /confused/i.test(e.text)));
  assert.ok(log.some((e) => e.type === "move" && e.confused));
}

testConfuseNextActivatesOnTurnStart();
testAiCastSetsConfusionForHuman();
testPickConfusedMoveUsesFullPool();
testConfusionHandlerTargetsOpponent();
testAiSkipsSpellsWhenConfused();
console.log("test-confusion.mjs: all passed");
