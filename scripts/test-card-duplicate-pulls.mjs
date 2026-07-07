#!/usr/bin/env node
/**
 * Card box pulls: duplicates at 3 copies refund gems; mystery boxes have a star refund chance.
 * Run: node scripts/test-card-duplicate-pulls.mjs
 */
import { getPlayableCards } from "../js/cardCatalog.js";
import { grantChestCard, openChest } from "../js/chests.js";
import { RARITY_GEM_DUPE } from "../js/cosmetics.js";
import {
  MYSTERY_BOX_DUPE_STAR_CHANCE,
  openMysteryBox,
} from "../js/mysteryBox.js";
import { DEFAULT_COSMETICS } from "../js/cosmetics.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] ?? null,
  setItem: (k, v) => {
    storage[k] = v;
  },
};

const sampleCard = getPlayableCards()[0];
assert(sampleCard, "Need at least one playable card");

const profile = {
  gems: 10_000,
  stars: 1_000_000,
  collection: { [sampleCard.id]: 3 },
  decks: [],
  cosmetics: structuredClone(DEFAULT_COSMETICS),
};

const gemPull = grantChestCard(profile, sampleCard);
assert(gemPull.duplicate, "Expected duplicate when at 3 copies");
assert(gemPull.gemRefund === RARITY_GEM_DUPE[sampleCard.rarity], "Expected rarity gem refund");
assert((profile.collection[sampleCard.id] || 0) === 3, "Collection should stay capped at 3");

profile.collection = {};
profile.gems = 10_000;
const newPull = grantChestCard(profile, sampleCard);
assert(!newPull.duplicate, "Expected new card grant below cap");
assert(profile.collection[sampleCard.id] === 1, "Expected one copy added");

profile.collection = { [sampleCard.id]: 3 };
profile.gems = 100;
const chestRes = openChest(profile, "bronze");
assert(chestRes.success, chestRes.message);
const dupes = chestRes.pulls.filter((p) => p.duplicate);
if (dupes.length) {
  assert(chestRes.bonusGems > 0, "Expected bonus gems from duplicate chest pulls");
}

let starRefunds = 0;
let gemRefunds = 0;
const trials = 3000;
const originalRandom = Math.random;
for (let i = 0; i < trials; i++) {
  let call = 0;
  Math.random = () => {
    call += 1;
    if (call === 1) return 0.99;
    if (call === 2) return 0.05;
    if (call === 3) return 0.99;
    if (call === 4) return 0.2;
    return 0.99;
  };
  profile.stars = 1_000_000;
  profile.collection = { [sampleCard.id]: 3 };
  profile.gems = 0;
  const res = openMysteryBox(profile);
  assert(res.success && res.cardPulls.length > 0, "Expected spell mystery open");
  for (const pull of res.cardPulls) {
    if (!pull.duplicate) continue;
    if (pull.starRefund) starRefunds += 1;
    if (pull.gemRefund) gemRefunds += 1;
  }
}
Math.random = originalRandom;

assert(MYSTERY_BOX_DUPE_STAR_CHANCE === 0.1, "Expected 10% star refund chance constant");

console.log("Card duplicate pulls OK");
console.log(`Mystery duplicate refunds over ${trials} trials: ${starRefunds} star, ${gemRefunds} gem`);
