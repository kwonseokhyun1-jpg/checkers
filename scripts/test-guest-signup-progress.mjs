/**
 * Guest Adventure progress must be written into profile_json on signup,
 * not replaced by an empty { loginEmail } cloud shell.
 */
import {
  readProfileFromStorage,
  saveProfile,
  isDefaultProfile,
  getStoredProfileOwnerId,
  clearStoredProfile,
} from "../js/storage.js";
import { recordLevelClear } from "../js/adventure.js";

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

/** Mirrors cloudProfile.buildProfileJsonForSignup ownership rules */
function buildSignupJsonLocal({ userId, loginEmail, remote, local, ownerId }) {
  const email = String(loginEmail || "").trim().toLowerCase();
  const remoteCopy = remote && typeof remote === "object" ? { ...remote } : {};
  const remoteHasProgress = !isEmptyRemoteProfile(remoteCopy);
  const canPromoteLocal =
    !remoteHasProgress &&
    !isDefaultProfile(local) &&
    (ownerId === null || ownerId === userId);

  const profileJson = canPromoteLocal ? { ...local } : remoteCopy;
  if (email) profileJson.loginEmail = email;
  if (canPromoteLocal) profileJson.savedAt = Date.now();
  return { profileJson, promoted: canPromoteLocal };
}

function testAdventureClearsCountAsProgress() {
  store.clear();
  clearGuestMode();
  clearStoredProfile();
  const profile = readProfileFromStorage();
  profile.adventure.cleared = { 1: true, 2: true };
  profile.adventure.highestUnlocked = 3;
  assert(!isDefaultProfile(profile), "adventure clears must make profile non-default");
}

function testEmptyRemoteIgnoresLoginEmailOnly() {
  assert(isEmptyRemoteProfile({ loginEmail: "a@b.com" }), "loginEmail-only remote is empty");
  assert(isEmptyRemoteProfile({ loginEmail: "a@b.com", savedAt: 1 }), "loginEmail+savedAt is empty");
  assert(!isEmptyRemoteProfile({ loginEmail: "a@b.com", gems: 200 }), "gems mean progress");
  assert(
    !isEmptyRemoteProfile({ adventure: { cleared: { 1: true } } }),
    "adventure clears mean progress"
  );
}

function testGuestSignupPromotesAdventureProgress() {
  store.clear();
  clearGuestMode();
  clearStoredProfile();

  let local = readProfileFromStorage();
  const result = recordLevelClear(local, 1, 3);
  local.gems += result.gems;
  saveProfile(local);
  enterGuestMode();

  local = readProfileFromStorage();
  assert(local.adventure.cleared["1"], "fixture should have floor 1 cleared");
  assert(!isDefaultProfile(local), "guest progress must be non-default");

  // After auth.signUp, notify() sets owner to the new user id while guest flag is still on.
  const userId = "new-user-1";
  const { profileJson, promoted } = buildSignupJsonLocal({
    userId,
    loginEmail: "guest@example.com",
    remote: { loginEmail: "guest@example.com" },
    local,
    ownerId: userId,
  });

  assert(promoted, "guest progress should be promoted into signup profile_json");
  assert(profileJson.adventure.cleared["1"], "promoted json must keep adventure clears");
  assert(profileJson.gems === local.gems, "promoted json must keep gems");
  assert(profileJson.loginEmail === "guest@example.com", "loginEmail must be stamped");

  // Old bug: signup wrote only { loginEmail }, wiping guest progress from the cloud row.
  assert(
    !isEmptyRemoteProfile(profileJson),
    "signup must not upload an empty loginEmail-only shell when guest has progress"
  );

  // claimPromotedSignupProfile equivalent
  saveProfile(profileJson, { bumpTimestamp: false, skipCloudSync: true, ownerUserId: userId });
  assert(getStoredProfileOwnerId() === userId, "promoted profile should claim ownership");
  const stored = readProfileFromStorage();
  assert(stored.adventure.cleared["1"], "local profile must still have adventure progress");
}

function testGuestSignupDoesNotOverwriteExistingCloud() {
  store.clear();
  clearGuestMode();
  clearStoredProfile();

  let local = readProfileFromStorage();
  local.gems = 50;
  local.adventure = { cleared: { 1: true }, highestUnlocked: 2, stars: {}, selectedWorld: 1 };
  saveProfile(local);
  enterGuestMode();

  const remote = {
    gems: 4820,
    stars: 12,
    adventure: { cleared: { 1: true, 2: true, 3: true } },
    loginEmail: "vet@example.com",
    savedAt: Date.now() - 1000,
  };

  const { profileJson, promoted } = buildSignupJsonLocal({
    userId: "vet-user",
    loginEmail: "vet@example.com",
    remote,
    local: readProfileFromStorage(),
    ownerId: null,
  });

  assert(!promoted, "must not promote guest over an existing cloud save");
  assert(profileJson.gems === 4820, "existing cloud gems must win");
  assert(profileJson.adventure.cleared["3"], "existing cloud adventure must win");
}

function testDefaultGuestDoesNotFabricateProgress() {
  store.clear();
  clearGuestMode();
  clearStoredProfile();
  enterGuestMode();
  const local = readProfileFromStorage();
  assert(isDefaultProfile(local), "fresh guest should be default");

  const { profileJson, promoted } = buildSignupJsonLocal({
    userId: "fresh",
    loginEmail: "fresh@example.com",
    remote: { loginEmail: "fresh@example.com" },
    local,
    ownerId: "fresh",
  });

  assert(!promoted, "default shell should not be treated as promoted progress");
  assert(profileJson.loginEmail === "fresh@example.com");
  assert(isEmptyRemoteProfile(profileJson), "default signup json stays empty aside from email");
}

testAdventureClearsCountAsProgress();
testEmptyRemoteIgnoresLoginEmailOnly();
testGuestSignupPromotesAdventureProgress();
testGuestSignupDoesNotOverwriteExistingCloud();
testDefaultGuestDoesNotFabricateProgress();
console.log("test-guest-signup-progress: ok");
