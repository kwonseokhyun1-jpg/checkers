import { applyEffect } from "../js/cardEffectHandlers.js";
import assert from "node:assert/strict";
import { COLORS, applyMove } from "../js/board.js";
import { createMatchMeta, tryConsumeCounterspell, takeTrapHistoryReveal, queueTrapHistoryReveal } from "../js/gameMeta.js";
import { isHiddenTrapSpell } from "../js/cardEffects.js";
import { appendHistoryEntry, ensureStartHistory } from "../js/moveHistory.js";
import { createInitialBoard } from "../js/board.js";

function baseState() {
  return {
    board: createInitialBoard(),
    squares: {},
    meta: createMatchMeta(),
    captured: { [COLORS.RED]: [], [COLORS.BLACK]: [] },
    moveHistory: [],
  };
}

assert.equal(isHiddenTrapSpell({ effect: "landmine" }), true);
assert.equal(isHiddenTrapSpell({ effect: "quicksand" }), true);
assert.equal(isHiddenTrapSpell({ effect: "counterspell" }), true);
assert.equal(isHiddenTrapSpell({ effect: "copycat" }), true);
assert.equal(isHiddenTrapSpell({ effect: "last_stand" }), true);
assert.equal(isHiddenTrapSpell({ effect: "martyr" }), true);
assert.equal(isHiddenTrapSpell({ effect: "fireball" }), false);

const cs = baseState();
cs.meta.counterspell[COLORS.BLACK] = true;
const trapped = tryConsumeCounterspell(cs, COLORS.RED);
assert.ok(trapped);
assert.deepEqual(takeTrapHistoryReveal(cs), {
  label: "Counterspell",
  effect: "counterspell",
  color: COLORS.BLACK,
  picks: [],
});

const mine = baseState();
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) mine.board[r][c] = null;
mine.board[5][2] = { color: COLORS.RED, row: 5, col: 2, king: false };
mine.squares["4,3"] = { hiddenMine: { owner: COLORS.BLACK, turnsLeft: 2 } };
applyMove(mine.board, { from: [5, 2], to: [4, 3], captures: [], type: "step" }, mine);
const mineTrap = takeTrapHistoryReveal(mine);
assert.equal(mineTrap?.label, "Landmine");
assert.equal(mineTrap?.color, COLORS.BLACK);
assert.deepEqual(mineTrap?.picks, [[4, 3]]);
assert.equal(mine.board[4][3], null, "landmine destroys mover");

const spellMine = baseState();
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) spellMine.board[r][c] = null;
spellMine.board[5][2] = { id: 1, color: COLORS.RED, row: 5, col: 2, king: false };
spellMine.squares["4,3"] = { hiddenMine: { owner: COLORS.BLACK, turnsLeft: 2 } };
const callForwardResult = applyEffect(spellMine, COLORS.BLACK, "call_forward", [[5, 2], [4, 3]]);
assert.ok(callForwardResult.success, callForwardResult.message);
const spellMineTrap = takeTrapHistoryReveal(spellMine);
assert.equal(spellMineTrap?.label, "Landmine");
assert.equal(spellMine.board[4][3], null, "call forward onto landmine destroys enemy");
assert.deepEqual(spellMine.boardFx?.squares, [[4, 3]], "landmine blast is single square");

const qs = baseState();
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) qs.board[r][c] = null;
qs.board[2][3] = { color: COLORS.BLACK, row: 2, col: 3, king: false };
qs.squares["3,2"] = { hiddenQuicksand: { owner: COLORS.RED } };
applyMove(qs.board, { from: [2, 3], to: [3, 2], captures: [], type: "step" }, qs);
const qsTrap = takeTrapHistoryReveal(qs);
assert.equal(qsTrap?.label, "Quicksand");
assert.equal(qsTrap?.color, COLORS.RED);

const historyState = baseState();
ensureStartHistory(historyState);
appendHistoryEntry(historyState, { label: "e4", type: "move", color: COLORS.RED, from: [5, 4], to: [4, 5] });
queueTrapHistoryReveal(historyState, { effect: "landmine", color: COLORS.RED, picks: [[4, 5]] });
const trap = takeTrapHistoryReveal(historyState);
appendHistoryEntry(historyState, {
  label: trap.label,
  type: "spell",
  color: trap.color,
  picks: trap.picks,
  trapTriggered: true,
});
assert.equal(historyState.moveHistory.length, 3);
assert.equal(historyState.moveHistory[1].label, "e4");
assert.equal(historyState.moveHistory[2].label, "Landmine");
assert.equal(historyState.moveHistory[2].trapTriggered, true);

console.log("test-trap-history: ok");
