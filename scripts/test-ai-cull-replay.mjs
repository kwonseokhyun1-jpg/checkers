#!/usr/bin/env node
/**
 * AI Cull must apply to live state during replay, not rely on sync fallback.
 */
import assert from "node:assert/strict";
import { planAiTurnWork, applyAiReplayEntry, cloneMatchState } from "../js/ai.js";
import { COLORS } from "../js/board.js";
import { createCardInstance, getCardById } from "../js/cards.js";
import { createMatchState } from "../js/match.js";

function replayAiLogSkippingCullApply(state, log, aiColor) {
  for (const entry of log) {
    if (entry.type === "spell" && entry.cardEffect === "cull") continue;
    applyAiReplayEntry(state, entry, aiColor);
  }
}

function replayAiLogWithCullApply(state, log, aiColor) {
  for (const entry of log) {
    if (entry.type === "spell" && entry.cardEffect === "cull" && entry.cullTarget) {
      applyAiReplayEntry(state, entry, aiColor);
      continue;
    }
    applyAiReplayEntry(state, entry, aiColor);
  }
}

const live = createMatchState(Array(30).fill("nudge"));
live.turn = COLORS.BLACK;
live.hands[COLORS.BLACK] = [createCardInstance(getCardById("cull"))];
live.hands[COLORS.RED] = [];
live.spellPlayed = { [COLORS.RED]: false, [COLORS.BLACK]: false };

const { log, work: planned } = planAiTurnWork(live, "AI", COLORS.BLACK);
const cullEntry = log.find((e) => e.type === "spell" && e.cardEffect === "cull");
assert.ok(cullEntry?.cullTarget, "AI should cast Cull on a standard opening board");
const [cr, cc] = cullEntry.cullTarget;
assert.ok(!planned.board[cr][cc], "planned state should remove the culled piece");

const buggy = cloneMatchState(live);
replayAiLogSkippingCullApply(buggy, log, COLORS.BLACK);
assert.ok(
  buggy.board[cr][cc],
  "skipping Cull apply during replay should leave the victim on the board (regression guard)"
);

const fixed = cloneMatchState(live);
replayAiLogWithCullApply(fixed, log, COLORS.BLACK);
assert.ok(!fixed.board[cr][cc], "Cull apply during replay should remove the victim");
assert.equal(fixed.hands[COLORS.BLACK].length, 0, "Cull card should leave AI hand");

console.log("AI Cull replay test passed");
