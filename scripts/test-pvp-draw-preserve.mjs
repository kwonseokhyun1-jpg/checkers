#!/usr/bin/env node
/**
 * Regression: stale PvP sync must not wipe a locally drawn card when turnNumber is restored.
 */

const COLORS = { RED: "red", BLACK: "black" };

function preserveLocalPvpDeck(nextState, prevLocalPvpDeck, localColor, syncDirty) {
  if (
    prevLocalPvpDeck &&
    prevLocalPvpDeck.turnNumber > (nextState.turnNumber?.[localColor] ?? 0)
  ) {
    nextState.turnNumber[localColor] = prevLocalPvpDeck.turnNumber;
    if (prevLocalPvpDeck.hand) nextState.hands[localColor] = prevLocalPvpDeck.hand;
    if (prevLocalPvpDeck.drawPile) nextState.drawPile[localColor] = prevLocalPvpDeck.drawPile;
    if (prevLocalPvpDeck.discardPile) nextState.discardPile[localColor] = prevLocalPvpDeck.discardPile;
  } else if (syncDirty && prevLocalPvpDeck && nextState.turn === localColor) {
    if (prevLocalPvpDeck.hand) nextState.hands[localColor] = prevLocalPvpDeck.hand;
    if (prevLocalPvpDeck.drawPile) nextState.drawPile[localColor] = prevLocalPvpDeck.drawPile;
    if (prevLocalPvpDeck.discardPile) nextState.discardPile[localColor] = prevLocalPvpDeck.discardPile;
  }
  return nextState;
}

function cloneState(s) {
  return structuredClone(s);
}

const drawnCard = { instanceId: "fireball-1", id: "fireball", name: "Fireball" };
const local = {
  turn: COLORS.RED,
  turnNumber: { [COLORS.RED]: 2, [COLORS.BLACK]: 2 },
  hands: {
    [COLORS.RED]: [{ instanceId: "a-1", id: "a" }, { instanceId: "b-1", id: "b" }, drawnCard],
    [COLORS.BLACK]: [],
  },
  drawPile: { [COLORS.RED]: ["c", "d"], [COLORS.BLACK]: ["x"] },
  discardPile: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
  moveHistory: [{ type: "start" }, { type: "move" }, { type: "move" }],
};

const stale = cloneState(local);
stale.turnNumber[COLORS.RED] = 1;
stale.hands[COLORS.RED] = [{ instanceId: "a-1", id: "a" }, { instanceId: "b-1", id: "b" }];
stale.drawPile[COLORS.RED] = ["fireball", "c", "d"];

const prev = {
  turnNumber: local.turnNumber[COLORS.RED],
  hand: local.hands[COLORS.RED],
  drawPile: local.drawPile[COLORS.RED],
  discardPile: local.discardPile[COLORS.RED],
};

preserveLocalPvpDeck(stale, prev, COLORS.RED, false);
if (stale.hands[COLORS.RED].length !== 3) {
  throw new Error("stale sync should preserve locally drawn card in hand");
}
if (!stale.hands[COLORS.RED].some((c) => c.instanceId === "fireball-1")) {
  throw new Error("drawn card instance should survive stale overwrite");
}
if (stale.drawPile[COLORS.RED].length !== 2 || stale.drawPile[COLORS.RED][0] !== "c") {
  throw new Error("draw pile should reflect local draw after stale overwrite");
}

// Unpushed spell cast: hand shrinks locally while turnNumber matches server.
const castLocal = cloneState(local);
castLocal.hands[COLORS.RED] = [{ instanceId: "b-1", id: "b" }, drawnCard];
const serverAfterCast = cloneState(local);
serverAfterCast.hands[COLORS.RED] = cloneState(local.hands[COLORS.RED]);

preserveLocalPvpDeck(
  serverAfterCast,
  {
    turnNumber: castLocal.turnNumber[COLORS.RED],
    hand: castLocal.hands[COLORS.RED],
    drawPile: castLocal.drawPile[COLORS.RED],
    discardPile: castLocal.discardPile[COLORS.RED],
  },
  COLORS.RED,
  true
);
if (serverAfterCast.hands[COLORS.RED].length !== 2) {
  throw new Error("syncDirty should preserve local hand after unpushed cast");
}

console.log("pvp draw preserve tests ok");
