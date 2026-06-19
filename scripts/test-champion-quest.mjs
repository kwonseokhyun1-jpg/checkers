/**
 * Unit tests for Champion quest (100 PvP wins).
 */
import { syncChampion, isAchievementComplete, progressLabel, achievementProgressRatio } from "../js/achievements.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function makeProfile(pvpWins) {
  return { pvpWins, achievements: { progress: {}, claimed: [] }, collection: {}, cosmetics: {} };
}

function testIncomplete() {
  const profile = makeProfile(42);
  syncChampion(profile);
  assert(profile.achievements.progress.champion === 42, "progress should mirror pvpWins");
  assert(!isAchievementComplete(profile, "champion"), "42 wins should not complete champion");
  assert(progressLabel(profile, "champion") === "42 / 100 PvP wins", "progress label should show wins");
  assert(achievementProgressRatio(profile, "champion") === 0.42, "ratio should be 42/100");
}

function testComplete() {
  const profile = makeProfile(100);
  const newly = syncChampion(profile);
  assert(newly.includes("champion"), "100 wins should newly complete champion");
  assert(isAchievementComplete(profile, "champion"), "100 wins should complete champion");
  assert(achievementProgressRatio(profile, "champion") === 1, "ratio should cap at 1");
}

function testRetroactiveSync() {
  const profile = makeProfile(150);
  syncChampion(profile);
  assert(profile.achievements.progress.champion === 100, "progress should cap at target");
  assert(isAchievementComplete(profile, "champion"), "existing wins above target should complete on sync");
}

testIncomplete();
testComplete();
testRetroactiveSync();
console.log("All champion quest tests passed.");
