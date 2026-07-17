#!/usr/bin/env node
/**
 * Toll — for 2 turns, opponent spell casts draw 2 cards.
 * Run: node scripts/test-toll.mjs
 */
import assert from "node:assert/strict";
import { COLORS, SIZE } from "../js/board.js";
import {
  createMatchMeta,
  ensureTollTurns,
  payTollOnSpellCast,
  flushPendingTollMessage,
  startTurnMeta,
  TOLL_DURATION_TURNS,
} from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState } from "../js/cardEffects.js";
import { CARD_REGISTRY } from "../js/cardRegistry.js";
import { getCardCategory } from "../js/cardCategories.js";
import { applyAiReplayEntry } from "../js/ai.js";
import { getCardDef } from "../js/cardCatalog.js";

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
    drawPile: {
      [COLORS.RED]: ["nudge", "backstep", "sidestep", "press", "ward", "panic"],
      [COLORS.BLACK]: ["nudge", "backstep"],
    },
    discardPile: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  };
  initCardState(state);
  return state;
}

const toll = CARD_REGISTRY.find((c) => c.id === "toll");
assert.ok(toll, "Toll card should exist");
assert.equal(toll.rarity, "uncommon");
assert.equal(toll.mode, "instant");
assert.equal(getCardCategory(toll), "special");

{
  const state = baseState();
  const cast = applyCard(state, COLORS.BLACK, toll, []);
  assert.equal(cast.success, true, "Toll cast should succeed");
  assert.equal(
    ensureTollTurns(state.meta)[COLORS.BLACK],
    TOLL_DURATION_TURNS,
    "Toll should arm for 2 turn cycles"
  );

  const before = state.hands[COLORS.BLACK].length;
  const drawn = payTollOnSpellCast(state, COLORS.RED);
  assert.equal(drawn, 2, "opponent cast should draw 2");
  assert.equal(state.hands[COLORS.BLACK].length, before + 2);
  assert.equal(
    flushPendingTollMessage(state.meta, COLORS.BLACK),
    "Toll — drew 2 cards."
  );
  console.log("OK: Toll draws 2 on opponent cast");
}

{
  const state = baseState();
  applyCard(state, COLORS.BLACK, toll, []);
  assert.equal(payTollOnSpellCast(state, COLORS.BLACK), 0, "own cast should not pay Toll");
  assert.equal(state.hands[COLORS.BLACK].length, 0);
  console.log("OK: Toll does not trigger on own cast");
}

{
  const state = baseState();
  applyCard(state, COLORS.BLACK, toll, []);
  assert.equal(state.meta.tollTurns[COLORS.BLACK], 2);

  startTurnMeta(state, COLORS.BLACK);
  assert.equal(state.meta.tollTurns[COLORS.BLACK], 1, "1 cycle after first owner turn start");
  assert.equal(payTollOnSpellCast(state, COLORS.RED), 2, "still active after 1 tick");

  startTurnMeta(state, COLORS.BLACK);
  assert.equal(state.meta.tollTurns[COLORS.BLACK], 0, "expires after 2 owner turn cycles");
  assert.equal(payTollOnSpellCast(state, COLORS.RED), 0, "no draw after expiry");
  console.log("OK: Toll expires after 2 owner turn cycles");
}

{
  const state = baseState();
  applyCard(state, COLORS.RED, toll, []);
  state.hands[COLORS.BLACK] = [getCardDef("press")];
  const ok = applyAiReplayEntry(
    state,
    {
      type: "spell",
      cardId: "press",
      cardName: "Press",
      picks: [],
    },
    COLORS.BLACK
  );
  assert.equal(ok, true);
  assert.equal(state.hands[COLORS.RED].length, 2, "AI spell replay should pay Toll");
  console.log("OK: AI spell replay pays Toll");
}

console.log("All Toll tests passed.");
