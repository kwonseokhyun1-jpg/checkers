/**
 * Fresh local default profile must not overwrite cloud progress on sign-in.
 */
import { readProfileFromStorage, saveProfile, isDefaultProfile } from "../js/storage.js";
import {
  mergeMonotonicProfileStats,
  reconcileMonotonicProfileStats,
  resolveProfileConflict,
} from "../js/profileStats.js";

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

function mergeDefaultLocalWithRemote(local, remote) {
  const merged = { ...remote };
  mergeMonotonicProfileStats(merged, local);
  reconcileMonotonicProfileStats(merged);
  return merged;
}

function testFreshDefaultLosesToOlderRemote() {
  store.clear();
  const local = readProfileFromStorage();
  saveProfile(local);
  assert(isDefaultProfile(local), "local should be default");

  const remote = readProfileFromStorage();
  remote.gems = 4820;
  remote.stars = 12;
  remote.adventure = { cleared: { 1: 3, 2: 2, 3: 1 } };
  remote.savedAt = Date.now() - 86_400_000;

  const buggy = resolveProfileConflict(local, remote);
  assert(buggy.gems === 200, "timestamp conflict wrongly prefers fresh default shell");

  const fixed = mergeDefaultLocalWithRemote(local, remote);
  assert(fixed.gems === 4820, "default local must restore remote gems");
  assert(fixed.stars === 12, "default local must restore remote stars");
  assert(fixed.adventure.cleared["3"] === 1, "default local must restore adventure clears");
}

function testDefaultLocalKeepsHigherMonotonicStats() {
  store.clear();
  const local = readProfileFromStorage();
  local.pvpWins = 9;
  saveProfile(local);

  const remote = readProfileFromStorage();
  remote.pvpWins = 2;
  remote.gems = 900;
  remote.savedAt = Date.now() - 86_400_000;

  const fixed = mergeDefaultLocalWithRemote(local, remote);
  assert(fixed.gems === 900, "remote progress should win");
  assert(fixed.pvpWins === 9, "higher monotonic stats should be preserved");
}

testFreshDefaultLosesToOlderRemote();
testDefaultLocalKeepsHigherMonotonicStats();
console.log("test-cloud-profile-sync: ok");
