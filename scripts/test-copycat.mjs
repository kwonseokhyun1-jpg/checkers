#!/usr/bin/env node
/**
 * Copycat — next opponent spell is copied into your hand.
 * Run: node scripts/test-copycat.mjs
 */
import assert from "node:assert/strict";
import { COLORS, SIZE } from "../js/board.js";
import {
  createMatchMeta,
  tryConsumeCopycat,
  flushPendingCopycatMessage,
  hasCopycatArmed,
  takeTrapHistoryReveal,
  queueTrapHistoryReveal,
} from "../js/gameMeta.js";
import { applyCard } from "../js/cardEffectHandlers.js";
import { initCardState, isHiddenTrapSpell } from "../js/cardEffects.js";
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

const copycat = CARD_REGISTRY.find((c) => c.id === "copycat");
assert.ok(copycat, "Copycat card should exist");
assert.equal(copycat.rarity, "common");
assert.equal(copycat.mode, "instant");
assert.equal(getCardCategory(copycat), "trap");
assert.equal(isHiddenTrapSpell(copycat), true);

{
  const state = baseState();
  const cast = applyCard(state, COLORS.BLACK, copycat, []);
  assert.equal(cast.success, true, "Copycat cast should succeed");
  assert.equal(hasCopycatArmed(state, COLORS.BLACK), true, "Copycat should arm");

  const before = state.hands[COLORS.BLACK].length;
  const deckBefore = state.drawPile[COLORS.BLACK].length;
  const got = tryConsumeCopycat(state, COLORS.RED, "press");
  assert.ok(got, "opponent cast should trigger Copycat");
  assert.equal(got.cardId, "press");
  assert.equal(state.hands[COLORS.BLACK].length, before + 1);
  assert.equal(state.drawPile[COLORS.BLACK].length, deckBefore, "copy must not consume draw pile");
  const copied = state.hands[COLORS.BLACK][0];
  assert.equal(copied.id, "press");
  assert.equal(copied.effect, "press");
  assert.ok(copied.instanceId, "copy should be a normal card instance");
  assert.equal(hasCopycatArmed(state, COLORS.BLACK), false, "Copycat should consume");
  assert.equal(flushPendingCopycatMessage(state.meta, COLORS.BLACK), "Copycat — copied Press.");
  assert.deepEqual(takeTrapHistoryReveal(state), {
    label: "Copycat",
    effect: "copycat",
    color: COLORS.BLACK,
    picks: [],
  });
  console.log("OK: Copycat copies opponent spell into hand");
}

{
  const state = baseState();
  applyCard(state, COLORS.BLACK, copycat, []);
  assert.equal(tryConsumeCopycat(state, COLORS.BLACK, "press"), null, "own cast should not trigger");
  assert.equal(state.hands[COLORS.BLACK].length, 0);
  assert.equal(hasCopycatArmed(state, COLORS.BLACK), true);
  console.log("OK: Copycat does not trigger on own cast");
}

{
  const state = baseState();
  applyCard(state, COLORS.BLACK, copycat, []);
  tryConsumeCopycat(state, COLORS.RED, "press");
  takeTrapHistoryReveal(state);
  flushPendingCopycatMessage(state.meta, COLORS.BLACK);
  assert.equal(tryConsumeCopycat(state, COLORS.RED, "ward"), null, "second cast should not trigger");
  assert.equal(state.hands[COLORS.BLACK].length, 1);
  console.log("OK: Copycat is one-shot");
}

{
  const state = baseState();
  applyCard(state, COLORS.RED, copycat, []);
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
  assert.equal(state.hands[COLORS.RED].length, 1, "AI spell replay should trigger Copycat");
  assert.equal(state.hands[COLORS.RED][0].id, "press");
  console.log("OK: AI spell replay triggers Copycat");
}

{
  const state = baseState();
  applyCard(state, COLORS.RED, copycat, []);
  state.meta.counterspell[COLORS.RED] = true;
  state.hands[COLORS.BLACK] = [getCardDef("press")];
  applyAiReplayEntry(
    state,
    {
      type: "spell",
      cardId: "press",
      cardName: "Press",
      picks: [],
      countered: true,
    },
    COLORS.BLACK
  );
  assert.equal(state.hands[COLORS.RED].length, 1, "countered cast should still copy");
  assert.equal(state.hands[COLORS.RED][0].id, "press");
  const first = takeTrapHistoryReveal(state);
  const second = takeTrapHistoryReveal(state);
  assert.equal(first.effect, "counterspell");
  assert.equal(second.effect, "copycat");
  console.log("OK: Counterspell + Copycat both queue on countered cast");
}

{
  const state = baseState();
  queueTrapHistoryReveal(state, { effect: "counterspell", color: COLORS.RED, picks: [] });
  queueTrapHistoryReveal(state, { effect: "copycat", color: COLORS.RED, picks: [] });
  assert.equal(state.pendingTrapHistory.effect, "counterspell");
  assert.equal(takeTrapHistoryReveal(state).effect, "counterspell");
  assert.equal(takeTrapHistoryReveal(state).effect, "copycat");
  assert.equal(takeTrapHistoryReveal(state), null);
  console.log("OK: trap history queue drains FIFO");
}

console.log("All Copycat tests passed.");
