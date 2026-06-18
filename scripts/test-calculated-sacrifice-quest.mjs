/**
 * Unit tests for Calculated Sacrifice quest tracking.
 */
import { COLORS } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import { createMatchAchievementTracker } from "../js/achievementTracker.js";
import { getAchievementProgress, isAchievementComplete } from "../js/achievements.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function emptyBoard(state) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) state.board[r][c] = null;
  }
}

function testSacrificeWinCounts() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["sacrifice"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "sacrifice", { success: true });
  tracker.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 1,
    "win with Sacrifice should count toward calculated_sacrifice"
  );
}

function testOfferingWinCounts() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["offering"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "offering", { success: true });
  tracker.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 1,
    "win with Offering should count toward calculated_sacrifice"
  );
}

function testFailedSacrificeDoesNotCount() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["sacrifice"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "sacrifice", { success: false });
  tracker.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 0,
    "failed Sacrifice should not count"
  );
}

function testWinWithoutSacrificeDoesNotCount() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["c1"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 0,
    "win without Sacrifice/Offering should not count"
  );
}

function testCheckpointResumePreservesSacrificeFlag() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["sacrifice"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "sacrifice", { success: true });
  assert(
    state.meta.achievementSession?.usedSacrificeOffering === true,
    "sacrifice flag should be written to state.meta for checkpoints"
  );

  const resumed = createMatchAchievementTracker(profile, COLORS.RED, state);
  resumed.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 1,
    "resumed tracker should still count sacrifice win"
  );
}

function testVictoryOnlyCountsOnce() {
  const profile = { achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["sacrifice"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "sacrifice", { success: true });
  tracker.onVictory(state);
  tracker.onVictory(state);
  assert(
    getAchievementProgress(profile, "calculated_sacrifice") === 1,
    "onVictory should only apply calculated_sacrifice once"
  );
}

function testFiveWinsCompletesQuest() {
  const profile = { achievements: { progress: { calculated_sacrifice: 4 }, claimed: [] }, collection: {}, cosmetics: {} };
  const state = createMatchState(["sacrifice"], null);
  emptyBoard(state);
  state.board[7][0] = { color: COLORS.RED, king: false };
  const tracker = createMatchAchievementTracker(profile, COLORS.RED, state);
  tracker.onSpellAfter(state, "sacrifice", { success: true });
  tracker.onVictory(state);
  assert(isAchievementComplete(profile, "calculated_sacrifice"), "5th sacrifice win should complete quest");
}

testSacrificeWinCounts();
testOfferingWinCounts();
testFailedSacrificeDoesNotCount();
testWinWithoutSacrificeDoesNotCount();
testCheckpointResumePreservesSacrificeFlag();
testVictoryOnlyCountsOnce();
testFiveWinsCompletesQuest();
console.log("All calculated sacrifice quest tests passed.");
