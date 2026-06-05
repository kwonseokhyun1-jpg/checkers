import assert from "node:assert/strict";
import {
  appendHistoryEntry,
  buildViewState,
  captureStateSnapshot,
  ensureStartHistory,
  formatHistoryChipLabel,
  formatPieceMoveLabel,
} from "../js/moveHistory.js";
import { createMatchState } from "../js/match.js";

const state = createMatchState(["c1", "c2", "c3"]);
ensureStartHistory(state);

const move = { from: [5, 2], to: [4, 3], captures: [], type: "step" };
const label = formatPieceMoveLabel(state.board, move);
assert.ok(label.length > 0, "move label");

appendHistoryEntry(state, { label, type: "move", color: "red", from: move.from, to: move.to });
assert.equal(state.moveHistory.length, 2);

const snap = captureStateSnapshot(state);
assert.equal(snap.moveHistory, undefined);

const view = buildViewState(state, 1);
assert.equal(view.moveHistory.length, 2);
assert.deepEqual(view.board, state.board);

const chip = formatHistoryChipLabel({ type: "move", color: "red", label: "c4" }, 1);
assert.match(chip, /^1\./);

console.log("test-move-history: ok");
