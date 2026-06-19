/**
 * Custom starter deck edits must survive profile reload and repairProfile.
 */
import {
  readProfileFromStorage,
  saveProfile,
  repairProfile,
  buildStarterDeckCardIds,
} from "../js/storage.js";
import { DECK_SIZE } from "../js/cardCatalog.js";

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

function testCustomStarterDeckPersists() {
  store.clear();
  const profile = readProfileFromStorage();
  const starter = profile.decks.find((d) => d.id === "deck-starter");
  assert(starter, "profile should include starter deck");

  const defaultIds = buildStarterDeckCardIds().join(",");
  const customIds = starter.cardIds.map((id) =>
    id === "backstep" ? "coin_flip" : id === "coin_flip" ? "backstep" : id
  );
  starter.cardIds = customIds;
  saveProfile(profile);

  assert(
    customIds.join(",") !== defaultIds,
    "test setup should use a non-default starter composition"
  );

  const repaired = repairProfile(profile);
  assert(!repaired, "repairProfile should not reset a valid customized starter deck");

  const reloaded = readProfileFromStorage();
  const reloadedStarter = reloaded.decks.find((d) => d.id === "deck-starter");
  assert(reloadedStarter, "reloaded profile should still have starter deck");
  assert(
    reloadedStarter.cardIds.length === DECK_SIZE,
    `starter deck should stay ${DECK_SIZE} cards`
  );
  assert(
    reloadedStarter.cardIds.join(",") === customIds.join(","),
    "custom starter deck cards should persist after reload"
  );
}

function testBrokenStarterDeckStillRepaired() {
  store.clear();
  const profile = readProfileFromStorage();
  const starter = profile.decks.find((d) => d.id === "deck-starter");
  starter.cardIds = starter.cardIds.slice(0, 10);

  const repaired = repairProfile(profile);
  assert(repaired, "repairProfile should fix an undersized starter deck");
  assert(
    starter.cardIds.length === DECK_SIZE,
    "undersized starter deck should be restored to full size"
  );
}

testCustomStarterDeckPersists();
testBrokenStarterDeckStillRepaired();
console.log("test-starter-deck-persistence: ok");
