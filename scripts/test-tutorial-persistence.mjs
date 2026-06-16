/**
 * Tutorial completion must survive profile reload (localStorage round-trip).
 */
import { readProfileFromStorage, saveProfile } from "../js/storage.js";
import {
  dismissInteractiveTutorial,
  shouldShowInteractiveTutorial,
  syncTutorialStorageWithProfile,
} from "../js/tutorial.js";

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

function testTutorialFlagsSurviveReload() {
  store.clear();
  const profile = readProfileFromStorage();
  dismissInteractiveTutorial({ persist: true, profile, saveProfile });
  assert(profile.interactiveTutorialDone, "dismiss should set profile flag");

  const reloaded = readProfileFromStorage();
  assert(reloaded.interactiveTutorialDone, "interactiveTutorialDone should persist after reload");
  assert(!shouldShowInteractiveTutorial(reloaded), "tutorial should not show after reload");

  syncTutorialStorageWithProfile(reloaded);
  assert(
    store.get("arcane_checkers_interactive_tutorial_v1") === "done",
    "sync should keep per-device done flag when profile is complete"
  );
}

testTutorialFlagsSurviveReload();
console.log("test-tutorial-persistence: ok");
