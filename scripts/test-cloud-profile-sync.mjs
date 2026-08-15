/**
 * Fresh local default profile must not overwrite cloud progress on sign-in.
 * Guest signup must claim local progress onto an empty cloud shell.
 */
import {
  readProfileFromStorage,
  saveProfile,
  isDefaultProfile,
  getStoredProfileOwnerId,
  setStoredProfileOwnerId,
  resetToDefaultProfile,
  repairProfile,
} from "../js/storage.js";
import {
  mergeMonotonicProfileStats,
  reconcileMonotonicProfileStats,
  resolveProfileConflict,
} from "../js/profileStats.js";

const GUEST_MODE_KEY = "arcane_checkers_guest_mode_v1";

const store = new Map();

globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

function enterGuestMode() {
  localStorage.setItem(GUEST_MODE_KEY, "1");
}

function clearGuestMode() {
  localStorage.removeItem(GUEST_MODE_KEY);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function mergeDefaultLocalWithRemote(local, remote) {
  const merged = { ...remote };
  mergeMonotonicProfileStats(merged, local);
  reconcileMonotonicProfileStats(merged);
  return merged;
}

/** Mirrors cloudProfile.isEmptyRemoteProfile */
function isEmptyRemoteProfile(json) {
  if (!json || typeof json !== "object") return true;
  const keys = Object.keys(json);
  if (keys.length === 0) return true;
  if (keys.every((k) => k === "loginEmail" || k === "login_email" || k === "savedAt")) return true;
  const hasCollection = json.collection && Object.keys(json.collection).length > 0;
  const hasDecks = Array.isArray(json.decks) && json.decks.length > 0;
  const cleared = json.adventure?.cleared;
  const hasProgress =
    (Array.isArray(cleared) ? cleared.length : Object.keys(cleared || {}).length) > 0;
  const hasCurrency = typeof json.gems === "number" || typeof json.stars === "number";
  const hasStats =
    (typeof json.pvpWins === "number" && json.pvpWins > 0) ||
    (typeof json.spellsPlayed === "number" && json.spellsPlayed > 0);
  return !(hasCollection || hasDecks || hasProgress || hasCurrency || hasStats);
}

/** Mirrors cloudProfile.localBelongsToUser (post owner-stamp timing). */
function resolveOwnedLocal(userId, remote, guestMode) {
  const ownerId = getStoredProfileOwnerId();
  if (ownerId !== userId && ownerId !== null) return false;
  if (guestMode && remote && !isEmptyRemoteProfile(remote)) return false;
  return true;
}

/** Mirrors cloudProfile.profileJsonForSignupUpsert */
function profileJsonForSignupUpsert(existingRemote, loginEmail, { wasGuest = false } = {}) {
  const email = String(loginEmail || "").trim().toLowerCase();
  const remote =
    existingRemote && typeof existingRemote === "object" ? { ...existingRemote } : {};

  if (wasGuest) {
    const local = readProfileFromStorage();
    if (!isDefaultProfile(local) && isEmptyRemoteProfile(remote)) {
      const claimed = { ...local, loginEmail: email };
      repairProfile(claimed);
      if (typeof claimed.savedAt !== "number") claimed.savedAt = Date.now();
      return claimed;
    }
  }

  remote.loginEmail = email;
  return remote;
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

function testSignOutClearsProfile() {
  store.clear();
  const local = readProfileFromStorage();
  local.gems = 9999;
  saveProfile(local, { ownerUserId: "user-a" });
  assert(getStoredProfileOwnerId() === "user-a", "owner should be stored");

  resetToDefaultProfile();
  const after = readProfileFromStorage();
  assert(isDefaultProfile(after), "reset should restore default profile");
  assert(after.gems === 200, "reset should clear custom gems");
  assert(getStoredProfileOwnerId() === null, "owner should be cleared");
}

function testForeignLocalNotUploadedToEmptyRemote() {
  store.clear();
  const local = readProfileFromStorage();
  local.gems = 5000;
  saveProfile(local, { ownerUserId: "user-a" });

  const currentUserId = "user-b";
  const ownedLocal = resolveOwnedLocal(currentUserId, null, false);
  assert(!ownedLocal, "user-a local must not belong to user-b");

  const remote = { loginEmail: "b@example.com" };
  assert(isEmptyRemoteProfile(remote), "fixture remote should be empty");

  if (!isDefaultProfile(local) && !ownedLocal) {
    resetToDefaultProfile();
  }
  const result = readProfileFromStorage();
  assert(isDefaultProfile(result), "foreign local must not persist for new user");
  assert(result.gems === 200, "new user should get starter gems");
}

function testGuestSignInPreservesCloudProgress() {
  store.clear();
  clearGuestMode();
  const local = readProfileFromStorage();
  local.gems = 50;
  local.adventure = { cleared: { 1: 1 } };
  saveProfile(local);
  enterGuestMode();
  // Production: notify() stamps owner before pullCloudProfile runs.
  setStoredProfileOwnerId("user-b");

  const remote = readProfileFromStorage();
  remote.gems = 4820;
  remote.stars = 12;
  remote.adventure = { cleared: { 1: 3, 2: 2, 3: 1 } };
  remote.savedAt = Date.now() - 86_400_000;

  const ownedLocal = resolveOwnedLocal("user-b", remote, true);
  assert(!ownedLocal, "guest local must not overwrite existing cloud on sign-in");

  const merged = mergeDefaultLocalWithRemote(local, remote);
  assert(merged.gems === 4820, "remote gems must win over guest session");
  assert(merged.adventure.cleared["3"] === 1, "remote adventure must win over guest session");
}

function testGuestSignUpKeepsLocalProgress() {
  store.clear();
  clearGuestMode();
  const local = readProfileFromStorage();
  local.gems = 50;
  local.adventure = { cleared: { 1: true, 2: true }, stars: { 1: 3, 2: 2 }, highestUnlocked: 3 };
  saveProfile(local);
  enterGuestMode();
  // Production: owner is stamped to the new user before pull.
  setStoredProfileOwnerId("new-user");

  const remote = { loginEmail: "new@example.com" };
  assert(isEmptyRemoteProfile(remote), "new account cloud shell should be empty");
  const ownedLocal = resolveOwnedLocal("new-user", remote, true);
  assert(ownedLocal, "guest local should carry over when cloud save is empty");
  assert(!isDefaultProfile(local), "guest adventure clears must count as progress");
}

function testGuestSignUpUpsertClaimsLocalProfile() {
  store.clear();
  clearGuestMode();
  const local = readProfileFromStorage();
  local.gems = 275;
  local.stars = 33;
  local.adventure = { cleared: { 1: true }, stars: { 1: 3 }, highestUnlocked: 2 };
  saveProfile(local);
  enterGuestMode();

  const claimed = profileJsonForSignupUpsert({ loginEmail: "x@y.com" }, "New@Example.com", {
    wasGuest: true,
  });
  assert(claimed.gems === 275, "signup upsert must include guest gems");
  assert(claimed.stars === 33, "signup upsert must include guest stars");
  assert(claimed.adventure.cleared["1"], "signup upsert must include adventure clears");
  assert(claimed.loginEmail === "new@example.com", "signup upsert must set loginEmail");
}

function testGuestSignUpDoesNotOverwriteExistingCloud() {
  store.clear();
  clearGuestMode();
  const local = readProfileFromStorage();
  local.gems = 10;
  saveProfile(local);
  enterGuestMode();

  const existing = {
    loginEmail: "old@example.com",
    gems: 900,
    stars: 12,
    adventure: { cleared: { 1: true, 2: true } },
  };
  const payload = profileJsonForSignupUpsert(existing, "old@example.com", { wasGuest: true });
  assert(payload.gems === 900, "must not replace existing cloud gems with guest session");
  assert(payload.adventure.cleared["2"], "must keep existing adventure progress");
}

function testAdventureClearsMakeProfileNonDefault() {
  store.clear();
  const local = readProfileFromStorage();
  // Same currency as default — only adventure clears differ (object map, not array).
  local.adventure = { cleared: { 1: true }, stars: { 1: 0 }, highestUnlocked: 2 };
  saveProfile(local, { skipCloudSync: true });
  assert(!isDefaultProfile(local), "cleared floors must make profile non-default");
}

testFreshDefaultLosesToOlderRemote();
testDefaultLocalKeepsHigherMonotonicStats();
testSignOutClearsProfile();
testForeignLocalNotUploadedToEmptyRemote();
testGuestSignInPreservesCloudProgress();
testGuestSignUpKeepsLocalProgress();
testGuestSignUpUpsertClaimsLocalProfile();
testGuestSignUpDoesNotOverwriteExistingCloud();
testAdventureClearsMakeProfileNonDefault();
console.log("test-cloud-profile-sync: ok");
