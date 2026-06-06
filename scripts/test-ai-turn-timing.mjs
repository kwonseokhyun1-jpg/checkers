import {
  planAiSpellLog,
  runAiMovePhase,
  cloneMatchState,
  applyAiReplayEntry,
} from "../js/ai.js";
import { createMatchState } from "../js/match.js";
import { COLORS } from "../js/board.js";

function boardDigest(board) {
  return JSON.stringify(
    board.map((row) => row.map((c) => (c ? `${c.color}@${c.row},${c.col}` : null)))
  );
}

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    failed++;
  } else {
    console.log("ok:", msg);
  }
}

const live = createMatchState(
  ["blink_2", "blink_2", "nudge", "nudge", "fireball"],
  ["blink_2", "blink_2", "nudge", "nudge", "fireball"]
);
live.turn = COLORS.BLACK;
live.hands[COLORS.BLACK] = live.hands[COLORS.BLACK].slice(0, 5);

const startDigest = boardDigest(live.board);
const spellLog = planAiSpellLog(live, "AI", COLORS.BLACK);
assert(boardDigest(live.board) === startDigest, "live board unchanged after planAiSpellLog");

const replay = cloneMatchState(live);
const spellEntry = spellLog.find((e) => e.type === "spell");
if (spellEntry) {
  const beforeSpell = boardDigest(replay.board);
  applyAiReplayEntry(replay, spellEntry, COLORS.BLACK);
  assert(boardDigest(replay.board) !== beforeSpell || spellEntry.countered, "spell changes board on apply");

  const beforeMove = boardDigest(replay.board);
  const movePlan = cloneMatchState(replay);
  runAiMovePhase(movePlan, "AI", COLORS.BLACK);
  assert(boardDigest(replay.board) === beforeMove, "replay unchanged until move is applied");

  const moveLog = runAiMovePhase(cloneMatchState(replay), "AI", COLORS.BLACK);
  const moveEntry = moveLog.find((e) => e.type === "move");
  if (moveEntry) {
    applyAiReplayEntry(replay, moveEntry, COLORS.BLACK);
    assert(boardDigest(replay.board) !== beforeMove, "move changes board on apply");
  }
}

process.exit(failed ? 1 : 0);
