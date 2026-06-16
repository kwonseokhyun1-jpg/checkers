#!/usr/bin/env node
/**
 * Regression: PvP must run turn-start cleanup whenever the server hands us a new turn,
 * even if local turn color never changed (stale spellPlayed / shatterSilenced).
 */

const COLORS = { RED: "red", BLACK: "black" };
const PHASE = { CARDS: "cards", MOVE: "move" };

function pvpLocalTurnKey(state, localColor) {
  return `${state.turn}_${state.turnNumber?.[localColor] ?? 0}`;
}

function startTurnMeta(state, color) {
  if (state.meta.shatterSilenceNext?.[color]) {
    state.meta.shatterSilenceNext[color] = false;
    state.meta.shatterSilenced[color] = true;
  } else {
    state.meta.shatterSilenced[color] = false;
  }
}

function beginPlayerTurn(state, localColor) {
  state.turnNumber[localColor] += 1;
  state.spellPlayed[localColor] = false;
  state.phase = PHASE.CARDS;
  startTurnMeta(state, localColor);
}

function resetLocalPvpTurnFlags(state, localColor) {
  state.spellPlayed[localColor] = false;
  state.phase = PHASE.CARDS;
  startTurnMeta(state, localColor);
}

function beginLocalPvpTurnIfNeeded(state, localColor, lastKey, { prevTurn = null, opponentColor }) {
  const key = pvpLocalTurnKey(state, localColor);
  if (key === lastKey) {
    if (
      prevTurn === opponentColor &&
      (state.spellPlayed[localColor] ||
        (state.meta.shatterSilenced?.[localColor] && !state.meta.shatterSilenceNext?.[localColor]))
    ) {
      resetLocalPvpTurnFlags(state, localColor);
      return lastKey;
    }
    return lastKey;
  }
  beginPlayerTurn(state, localColor);
  return key;
}

function cloneState(s) {
  return structuredClone(s);
}

// --- Turn 2 via new server turn key ---
let lastKey = "red_0";
let local = {
  turn: COLORS.RED,
  phase: PHASE.CARDS,
  turnNumber: { [COLORS.RED]: 1, [COLORS.BLACK]: 1 },
  spellPlayed: { [COLORS.RED]: true, [COLORS.BLACK]: true },
  meta: {
    shatterSilenced: { [COLORS.RED]: true, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  },
  gameOver: null,
};
lastKey = beginLocalPvpTurnIfNeeded(local, COLORS.RED, lastKey, {
  prevTurn: COLORS.BLACK,
  opponentColor: COLORS.BLACK,
});
if (local.spellPlayed[COLORS.RED] !== false) throw new Error("spellPlayed should reset on new PvP turn");
if (local.meta.shatterSilenced[COLORS.RED] !== false) {
  throw new Error("shatterSilenced should clear when silence-next is not set");
}

// --- Stale flags when turn key did not advance (desync) ---
local = {
  turn: COLORS.RED,
  phase: PHASE.MOVE,
  turnNumber: { [COLORS.RED]: 2, [COLORS.BLACK]: 2 },
  spellPlayed: { [COLORS.RED]: true, [COLORS.BLACK]: false },
  meta: {
    shatterSilenced: { [COLORS.RED]: true, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  },
  gameOver: null,
};
lastKey = pvpLocalTurnKey(local, COLORS.RED);
const incoming = cloneState(local);
incoming.phase = PHASE.CARDS;
lastKey = beginLocalPvpTurnIfNeeded(incoming, COLORS.RED, lastKey, {
  prevTurn: COLORS.BLACK,
  opponentColor: COLORS.BLACK,
});
if (incoming.spellPlayed[COLORS.RED] !== false) {
  throw new Error("stale spellPlayed should clear when opponent hands turn back");
}

// --- Mid-turn duplicate import must not reset ---
const mid = {
  turn: COLORS.RED,
  phase: PHASE.MOVE,
  turnNumber: { [COLORS.RED]: 2, [COLORS.BLACK]: 2 },
  spellPlayed: { [COLORS.RED]: true, [COLORS.BLACK]: false },
  meta: {
    shatterSilenced: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  },
  gameOver: null,
};
const midKey = pvpLocalTurnKey(mid, COLORS.RED);
const midCopy = cloneState(mid);
beginLocalPvpTurnIfNeeded(midCopy, COLORS.RED, midKey, {
  prevTurn: COLORS.RED,
  opponentColor: COLORS.BLACK,
});
if (midCopy.spellPlayed[COLORS.RED] !== true) {
  throw new Error("mid-turn duplicate import should not clear spellPlayed");
}

console.log("pvp turn-start tests ok");
