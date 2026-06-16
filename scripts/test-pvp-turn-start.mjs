#!/usr/bin/env node
/**
 * Regression: PvP must run turn-start cleanup whenever the server hands us a new turn,
 * even if local turn color never changed (stale spellPlayed / shatterSilenced).
 * moveHistory.length in the turn key prevents stuck turnNumber from skipping draws.
 */

const COLORS = { RED: "red", BLACK: "black" };
const PHASE = { CARDS: "cards", MOVE: "move" };

function pvpLocalTurnKey(state, localColor) {
  const n = state.turnNumber?.[localColor] ?? 0;
  const hist = state.moveHistory?.length ?? 0;
  return `${state.turn}_${n}_${hist}`;
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

const START_HIST = [{ type: "start", label: "Start" }];

// --- Turn 2 via new server turn key ---
let lastKey = "red_0_1";
let local = {
  turn: COLORS.RED,
  phase: PHASE.CARDS,
  turnNumber: { [COLORS.RED]: 1, [COLORS.BLACK]: 1 },
  moveHistory: [...START_HIST, { type: "move", label: "e4" }],
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
  moveHistory: [...START_HIST, { type: "move", label: "e4" }, { type: "move", label: "e5" }],
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
  moveHistory: [...START_HIST, { type: "move", label: "e4" }, { type: "move", label: "e5" }],
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

// --- Stuck turnNumber: opponent handoff with new moveHistory must still begin turn ---
let stuck = {
  turn: COLORS.RED,
  phase: PHASE.CARDS,
  turnNumber: { [COLORS.RED]: 1, [COLORS.BLACK]: 2 },
  moveHistory: [...START_HIST, { type: "move", label: "e4" }],
  spellPlayed: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  meta: {
    shatterSilenced: { [COLORS.RED]: false, [COLORS.BLACK]: false },
    shatterSilenceNext: { [COLORS.RED]: false, [COLORS.BLACK]: false },
  },
  gameOver: null,
};
const stuckKey = pvpLocalTurnKey(stuck, COLORS.RED); // red_1_2 — already ran begin for this key
stuck.turnNumber[COLORS.RED] = 2; // local had advanced before stale overwrite
const afterOpponent = cloneState(stuck);
afterOpponent.turnNumber[COLORS.RED] = 1; // stale server snapshot
afterOpponent.moveHistory = [
  ...START_HIST,
  { type: "move", label: "e4" },
  { type: "move", label: "e5" },
];
const newKey = beginLocalPvpTurnIfNeeded(afterOpponent, COLORS.RED, stuckKey, {
  prevTurn: COLORS.BLACK,
  opponentColor: COLORS.BLACK,
});
if (newKey === stuckKey) throw new Error("new opponent handoff should advance turn key via moveHistory");
if (afterOpponent.turnNumber[COLORS.RED] !== 2) {
  throw new Error("beginPlayerTurn should run after opponent handoff even when turnNumber was stuck");
}

console.log("pvp turn-start tests ok");
