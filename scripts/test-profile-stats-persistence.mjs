/**
 * PvP wins and other monotonic profile stats must survive reload and cloud sync.
 */
import {
  readProfileFromStorage,
  saveProfile,
  isDefaultProfile,
} from "../js/storage.js";
import {
  getPvpWinCount,
  getSpellPlayCount,
  mergeMonotonicProfileStats,
  reconcileMonotonicProfileStats,
  resolveProfileConflict,
} from "../js/profileStats.js";
import { syncChampion } from "../js/achievements.js";

const store = new Map();

globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function testPvpWinsPersistOnReload() {
  store.clear();
  const profile = readProfileFromStorage();
  profile.pvpWins = 37;
  saveProfile(profile);

  const reloaded = readProfileFromStorage();
  assert(getPvpWinCount(reloaded) === 37, "pvpWins should survive localStorage reload");
}

function testDefaultProfileIgnoresPvpWins() {
  store.clear();
  const profile = readProfileFromStorage();
  profile.pvpWins = 12;
  assert(!isDefaultProfile(profile), "profile with PvP wins must not be treated as default");
}

function testCloudConflictKeepsHigherPvpWins() {
  const local = readProfileFromStorage();
  local.pvpWins = 42;
  local.savedAt = 1000;

  const remote = readProfileFromStorage();
  remote.pvpWins = 0;
  remote.savedAt = 2000;
  remote.gems = 9999;

  const merged = resolveProfileConflict(local, remote);
  assert(getPvpWinCount(merged) === 42, "newer remote must not erase higher local pvpWins");
  assert(merged.gems === 9999, "newer remote shell fields should still win");
}

function testCloudConflictKeepsHigherSpellsPlayed() {
  const local = readProfileFromStorage();
  local.spellsPlayed = 88;
  local.savedAt = 5000;

  const remote = readProfileFromStorage();
  remote.spellsPlayed = 3;
  remote.savedAt = 6000;

  const merged = resolveProfileConflict(local, remote);
  assert(getSpellPlayCount(merged) === 88, "newer remote must not erase higher local spellsPlayed");
}

function testRecoverPvpWinsFromChampionProgress() {
  const profile = {
    achievements: { progress: { champion: 25 }, claimed: [] },
    collection: {},
    cosmetics: {},
  };
  reconcileMonotonicProfileStats(profile);
  assert(getPvpWinCount(profile) === 25, "champion quest progress should restore missing pvpWins");
  syncChampion(profile);
  assert(profile.achievements.progress.champion === 25, "champion progress should stay in sync");
}

function testMergeUsesChampionBackup() {
  const a = { achievements: { progress: { champion: 15 }, claimed: [] } };
  const b = { pvpWins: 0, achievements: { progress: {}, claimed: [] } };
  mergeMonotonicProfileStats(b, a);
  assert(getPvpWinCount(b) === 15, "merge should recover pvpWins from champion progress backup");
}

testPvpWinsPersistOnReload();
testDefaultProfileIgnoresPvpWins();
testCloudConflictKeepsHigherPvpWins();
testCloudConflictKeepsHigherSpellsPlayed();
testRecoverPvpWinsFromChampionProgress();
testMergeUsesChampionBackup();
console.log("test-profile-stats-persistence: ok");
