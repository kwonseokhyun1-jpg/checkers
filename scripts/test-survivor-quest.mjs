/**
 * Unit tests for Close Call (Survivor) quest tracking.
 */
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { createMatchAchievementTracker } from "../js/achievementTracker.js";
import { isAchievementComplete } from "../js/achievements.js";
import { pieceSkinsConflict, effectiveHostPieceSkin } from "../js/cosmetics.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function emptyBoard(state) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) state.board[r][c] = null;
  }
}

function testCloseCallWithOnePiece() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["c1"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED);
  tracker.onVictory(state);
  assert(isAchievementComplete(profile, "close_call"), "1 piece at victory should complete close_call");
}

function testCloseCallVengeanceWin() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["c1"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED);
  tracker.onMoveBefore(state);
  emptyBoard(state);
  tracker.onVictory(state);
  assert(isAchievementComplete(profile, "close_call"), "vengeance win with 1 piece before final blow should count");
}

function testCloseCallDoesNotTriggerWithTwoPieces() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["c1"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  state.board[7][2] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED);
  tracker.onVictory(state);
  assert(!isAchievementComplete(profile, "close_call"), "2 pieces should not complete close_call");
}

function testDefaultSkinJoinAllowed() {
  assert(!pieceSkinsConflict("skin_classic", "skin_classic"), "default skins should not conflict");
  assert(pieceSkinsConflict("skin_ember", "skin_ember"), "matching custom skins should conflict");
  assert(!pieceSkinsConflict("skin_classic", "skin_ember"), "different skins should not conflict");
}

function testEffectiveHostPieceSkin() {
  assert(
    effectiveHostPieceSkin("skin_void", "skin_ember") === "skin_void",
    "stored custom skin should win over profile"
  );
  assert(
    effectiveHostPieceSkin("skin_classic", "skin_void") === "skin_void",
    "profile skin should be used when row still has default"
  );
  assert(
    effectiveHostPieceSkin("skin_classic", "skin_classic") === "skin_classic",
    "classic profile should stay classic when row is default"
  );
  assert(
    effectiveHostPieceSkin(null, "skin_frost") === "skin_frost",
    "missing stored skin should fall back to profile"
  );
}

testCloseCallWithOnePiece();
testCloseCallVengeanceWin();
testCloseCallDoesNotTriggerWithTwoPieces();
testDefaultSkinJoinAllowed();
testEffectiveHostPieceSkin();
console.log("All survivor quest / PvP skin tests passed.");
