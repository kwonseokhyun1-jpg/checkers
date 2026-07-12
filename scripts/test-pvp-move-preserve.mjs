#!/usr/bin/env node
/**
 * Regression: stale PvP sync must not wipe unpushed piece moves.
 * Spells already triggered _syncDirty pushes; moves only sync at end of turn.
 */

const COLORS = { RED: "red", BLACK: "black" };

function localPvpStateAheadOf(local, incoming, { syncDirty = false } = {}) {
  if (syncDirty) return true;
  const localHist = local.moveHistory?.length ?? 0;
  const incomingHist = incoming.moveHistory?.length ?? 0;
  if (localHist > incomingHist) return true;
  const localSpell = local.pvpLastSpell?.seq ?? 0;
  const incomingSpell = incoming.pvpLastSpell?.seq ?? 0;
  return localSpell > incomingSpell;
}

function preserveLocalPvpBoard(local, incoming, opts = {}) {
  if (!localPvpStateAheadOf(local, incoming, opts)) return incoming;
  const next = structuredClone(incoming);
  next.board = structuredClone(local.board);
  next.captured = structuredClone(local.captured);
  next.turn = local.turn;
  next.phase = local.phase;
  if ((local.moveHistory?.length ?? 0) > (incoming.moveHistory?.length ?? 0)) {
    next.moveHistory = structuredClone(local.moveHistory);
  }
  return next;
}

const localColor = COLORS.RED;
const opponentColor = COLORS.BLACK;

// Mid-turn move not yet pushed.
const midMoveLocal = {
  turn: localColor,
  phase: "move",
  board: [[{ color: localColor, type: "pawn", id: "moved" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }],
};
const midMoveStale = structuredClone(midMoveLocal);
midMoveStale.board = [[{ color: localColor, type: "pawn", id: "before" }]];

const preservedMid = preserveLocalPvpBoard(midMoveLocal, midMoveStale, { syncDirty: true });
if (preservedMid.board[0][0].id !== "moved") {
  throw new Error("unpushed mid-turn move should survive stale sync");
}

// End-of-turn push failed: local already handed off, server still on our turn.
const endedLocal = {
  turn: opponentColor,
  phase: "cards",
  board: [[{ color: localColor, type: "pawn", id: "after-move" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }, { type: "move", label: "e4" }],
};
const endedStale = structuredClone(endedLocal);
endedStale.turn = localColor;
endedStale.phase = "move";
endedStale.board = [[{ color: localColor, type: "pawn", id: "before" }]];
endedStale.moveHistory = [{ type: "start" }];

const preservedEnd = preserveLocalPvpBoard(endedLocal, endedStale);
if (preservedEnd.turn !== opponentColor) {
  throw new Error("failed end-turn push should keep local handoff to opponent");
}
if (preservedEnd.board[0][0].id !== "after-move") {
  throw new Error("failed end-turn push should keep moved board");
}

// Opponent progress should still apply when local is not ahead.
const opponentProgress = {
  turn: localColor,
  phase: "cards",
  board: [[{ color: opponentColor, type: "pawn", id: "opp" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }, { type: "move", label: "e5" }],
};
const waitingLocal = {
  turn: opponentColor,
  phase: "cards",
  board: [[{ color: localColor, type: "pawn", id: "mine" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }, { type: "move", label: "e4" }],
};

const appliedOpp = preserveLocalPvpBoard(waitingLocal, opponentProgress);
if (appliedOpp.board[0][0].id !== "opp") {
  throw new Error("opponent progress should apply when local is not ahead");
}

console.log("pvp move preserve tests ok");
