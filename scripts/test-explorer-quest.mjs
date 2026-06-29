/**
 * Unit tests for Explorer quest (clear Adventure tower 5).
 */
import {
  syncExplorer,
  isAchievementComplete,
  progressLabel,
  achievementProgressRatio,
  countChapter5StagesCleared,
} from "../js/achievements.js";
import { getWorldForLevel } from "../js/adventure.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function makeProfile(clearedLevelIds = []) {
  const cleared = {};
  for (const id of clearedLevelIds) cleared[String(id)] = true;
  return {
    adventure: { highestUnlocked: 50, cleared, stars: {} },
    achievements: { progress: {}, claimed: [] },
    collection: {},
    cosmetics: {},
  };
}

function testIncomplete() {
  const profile = makeProfile([41, 42, 43]);
  syncExplorer(profile);
  assert(profile.achievements.progress.explorer === 3, "progress should mirror tower 5 clears");
  assert(!isAchievementComplete(profile, "explorer"), "3 clears should not complete explorer");
  assert(progressLabel(profile, "explorer") === "3 / 10 tower 5 stages", "progress label should show clears");
  assert(achievementProgressRatio(profile, "explorer") === 0.3, "ratio should be 3/10");
}

function testComplete() {
  const chapter5Levels = [];
  const world = getWorldForLevel(41);
  for (let id = world.levelStart; id <= world.levelEnd; id++) chapter5Levels.push(id);
  const profile = makeProfile(chapter5Levels);
  const newly = syncExplorer(profile);
  assert(newly.includes("explorer"), "all chapter 5 stages should newly complete explorer");
  assert(isAchievementComplete(profile, "explorer"), "all chapter 5 stages should complete explorer");
  assert(achievementProgressRatio(profile, "explorer") === 1, "ratio should cap at 1");
}

function testIgnoresOtherChapters() {
  const profile = makeProfile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  syncExplorer(profile);
  assert(countChapter5StagesCleared(profile) === 0, "tower 1 clears should not count");
  assert(profile.achievements.progress.explorer === 0, "progress should stay at 0");
}

function testRetroactiveSync() {
  const chapter5Levels = [];
  const world = getWorldForLevel(41);
  for (let id = world.levelStart; id <= world.levelEnd; id++) chapter5Levels.push(id);
  const profile = makeProfile(chapter5Levels);
  syncExplorer(profile);
  assert(profile.achievements.progress.explorer === 10, "progress should cap at target");
  assert(isAchievementComplete(profile, "explorer"), "existing clears should complete on sync");
}

testIncomplete();
testComplete();
testIgnoresOtherChapters();
testRetroactiveSync();
console.log("All explorer quest tests passed.");
