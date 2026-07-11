#!/usr/bin/env node
/**
 * Regression: stale PvP sync must not wipe unpushed piece moves.
 * Spells already triggered _syncDirty pushes; moves only sync at end of turn.
 */

const COLORS = { RED: "red", BLACK: "black" };

function localPvpStateAheadOf(local, incoming, localColor, { syncDirty = false, moveLog = 0 } = {}) {
  if (moveLog > 0 || syncDirty) return true;
  const localHist = local.moveHistory?.length ?? 0;
  const incomingHist = incoming.moveHistory?.length ?? 0;
  if (localHist > incomingHist) return true;
  const localSeq = local.pvpTurnSeq ?? 0;
  const incomingSeq = incoming.pvpTurnSeq ?? 0;
  if (localSeq > incomingSeq) return true;
  const localSpell = local.pvpLastSpell?.seq ?? 0;
  const incomingSpell = incoming.pvpLastSpell?.seq ?? 0;
  return localSpell > incomingSpell;
}

function preserveLocalPvpBoard(local, incoming, localColor, opts = {}) {
  if (!localPvpStateAheadOf(local, incoming, localColor, opts)) return incoming;
  const next = structuredClone(incoming);
  next.board = structuredClone(local.board);
  next.captured = structuredClone(local.captured);
  next.turn = local.turn;
  next.phase = local.phase;
  if ((local.moveHistory?.length ?? 0) > (incoming.moveHistory?.length ?? 0)) {
    next.moveHistory = structuredClone(local.moveHistory);
  }
  if ((local.pvpTurnSeq ?? 0) > (incoming.pvpTurnSeq ?? 0)) {
    next.pvpTurnSeq = local.pvpTurnSeq;
    next.pvpLastTurnMoves = structuredClone(local.pvpLastTurnMoves);
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
  pvpTurnSeq: 0,
  pvpLastTurnMoves: null,
};
const midMoveStale = structuredClone(midMoveLocal);
midMoveStale.board = [[{ color: localColor, type: "pawn", id: "before" }]];

const preservedMid = preserveLocalPvpBoard(midMoveLocal, midMoveStale, localColor, { moveLog: 1 });
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
  pvpTurnSeq: 1,
  pvpLastTurnMoves: { seq: 1, mover: localColor, moves: [{ type: "move" }] },
};
const endedStale = structuredClone(endedLocal);
endedStale.turn = localColor;
endedStale.phase = "move";
endedStale.board = [[{ color: localColor, type: "pawn", id: "before" }]];
endedStale.moveHistory = [{ type: "start" }];
endedStale.pvpTurnSeq = 0;
endedStale.pvpLastTurnMoves = null;

const preservedEnd = preserveLocalPvpBoard(endedLocal, endedStale, localColor);
if (preservedEnd.turn !== opponentColor) {
  throw new Error("failed end-turn push should keep local handoff to opponent");
}
if (preservedEnd.board[0][0].id !== "after-move") {
  throw new Error("failed end-turn push should keep moved board");
}
if (preservedEnd.pvpTurnSeq !== 1) {
  throw new Error("failed end-turn push should keep flushed move replay payload");
}

// Opponent progress should still apply when local is not ahead.
const opponentProgress = {
  turn: localColor,
  phase: "cards",
  board: [[{ color: opponentColor, type: "pawn", id: "opp" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }, { type: "move", label: "e5" }],
  pvpTurnSeq: 1,
  pvpLastTurnMoves: { seq: 1, mover: opponentColor, moves: [{ type: "move" }] },
};
const waitingLocal = {
  turn: opponentColor,
  phase: "cards",
  board: [[{ color: localColor, type: "pawn", id: "mine" }]],
  captured: { [localColor]: [], [opponentColor]: [] },
  moveHistory: [{ type: "start" }, { type: "move", label: "e4" }],
  pvpTurnSeq: 1,
  pvpLastTurnMoves: { seq: 1, mover: localColor, moves: [{ type: "move" }] },
};

const appliedOpp = preserveLocalPvpBoard(waitingLocal, opponentProgress, localColor);
if (appliedOpp.board[0][0].id !== "opp") {
  throw new Error("opponent progress should apply when local is not ahead");
}

console.log("pvp move preserve tests ok");
