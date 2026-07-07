#!/usr/bin/env node
/**
 * Mystery Box: 6 pulls with ~50% cosmetics per slot (when cosmetics unlocked).
 * Run: node scripts/test-small-mystery-box.mjs
 */
import {
  MYSTERY_BOX_MIX_COSMETIC_CHANCE,
  MYSTERY_BOX_PULL_COUNT,
  openMysteryBox,
} from "../js/mysteryBox.js";
import { DEFAULT_COSMETICS } from "../js/cosmetics.js";

if (MYSTERY_BOX_MIX_COSMETIC_CHANCE !== 0.5) {
  console.error(`Expected MYSTERY_BOX_MIX_COSMETIC_CHANCE 0.5, got ${MYSTERY_BOX_MIX_COSMETIC_CHANCE}`);
  process.exit(1);
}

if (MYSTERY_BOX_PULL_COUNT !== 6) {
  console.error(`Expected MYSTERY_BOX_PULL_COUNT 6, got ${MYSTERY_BOX_PULL_COUNT}`);
  process.exit(1);
}

const storage = {};
globalThis.localStorage = {
  getItem: (k) => storage[k] ?? null,
  setItem: (k, v) => {
    storage[k] = v;
  },
};

const profile = {
  gems: 0,
  stars: 1_000_000,
  collection: {},
  decks: [],
  cosmetics: structuredClone(DEFAULT_COSMETICS),
  adventure: { cleared: { 5: true }, stars: {} },
};

let cosmeticPulls = 0;
let cardPulls = 0;
const trials = 800;

for (let i = 0; i < trials; i++) {
  profile.stars = 1_000_000;
  const res = openMysteryBox(profile);
  if (!res.success) {
    console.error("openMysteryBox failed:", res.message);
    process.exit(1);
  }
  const total = res.cardPulls.length + res.cosPulls.length;
  if (total !== MYSTERY_BOX_PULL_COUNT) {
    console.error(`Expected ${MYSTERY_BOX_PULL_COUNT} pulls, got ${total}`);
    process.exit(1);
  }
  cosmeticPulls += res.cosPulls.length;
  cardPulls += res.cardPulls.length;
}

const rate = cosmeticPulls / (cosmeticPulls + cardPulls);
if (rate < 0.45 || rate > 0.55) {
  console.error(`Cosmetic rate ${(rate * 100).toFixed(1)}% outside 45–55% band`);
  process.exit(1);
}

console.log(
  `Mystery Box: ${(rate * 100).toFixed(1)}% cosmetic pulls over ${trials} opens (${MYSTERY_BOX_PULL_COUNT} per open)`
);
