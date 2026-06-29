/**
 * Unit tests for dungeon unlock after Tower 5 (chapter 5).
 */
import {
  areDungeonWorldsUnlocked,
  isWorldUnlocked,
  countClearedLevelsInWorld,
  LEVELS_PER_WORLD,
} from "../js/adventure.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function makeProgress(clearedLevelIds = []) {
  const cleared = {};
  for (const id of clearedLevelIds) cleared[String(id)] = true;
  return { highestUnlocked: 70, cleared, stars: {} };
}

function testLockedBeforeTower5() {
  const progress = makeProgress([41, 42, 43, 44, 45]);
  assert(!areDungeonWorldsUnlocked(progress), "9 tower 5 clears should not unlock dungeons");
  assert(!isWorldUnlocked(progress, 6), "dungeon 1 should stay locked");
  assert(!isWorldUnlocked(progress, 7), "dungeon 2 should stay locked");
}

function testLockedAtFloor49() {
  const cleared = [];
  for (let i = 1; i <= 49; i++) cleared.push(i);
  const progress = makeProgress(cleared);
  assert(countClearedLevelsInWorld(progress, 5) === 9, "floor 49 should mean 9 tower 5 clears");
  assert(!areDungeonWorldsUnlocked(progress), "floor 49 alone should not unlock dungeons");
}

function testUnlockedAfterTower5() {
  const cleared = [];
  for (let i = 1; i <= 50; i++) cleared.push(i);
  const progress = makeProgress(cleared);
  assert(countClearedLevelsInWorld(progress, 5) === LEVELS_PER_WORLD, "all tower 5 floors cleared");
  assert(areDungeonWorldsUnlocked(progress), "all tower 5 floors should unlock dungeons");
  assert(isWorldUnlocked(progress, 6), "dungeon 1 should unlock");
  assert(isWorldUnlocked(progress, 7), "dungeon 2 should unlock");
}

testLockedBeforeTower5();
testLockedAtFloor49();
testUnlockedAfterTower5();
console.log("test-dungeon-unlock: all passed");
