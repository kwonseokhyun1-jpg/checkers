#!/usr/bin/env node
/**
 * Star Chest: 50% cosmetics / 50% spells.
 * Run: node scripts/test-star-chest.mjs
 */
import { STAR_CHEST_COSMETIC_CHANCE, openMysteryBox } from "../js/mysteryBox.js";
import { DEFAULT_COSMETICS } from "../js/cosmetics.js";

if (STAR_CHEST_COSMETIC_CHANCE !== 0.5) {
  console.error(`Expected STAR_CHEST_COSMETIC_CHANCE 0.5, got ${STAR_CHEST_COSMETIC_CHANCE}`);
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
};

let cosmeticOpens = 0;
const trials = 4000;
const originalRandom = Math.random;

for (let i = 0; i < trials; i++) {
  let call = 0;
  Math.random = () => {
    call += 1;
    if (call === 1) return i / trials;
    return 0.1;
  };
  profile.stars = 1_000_000;
  const res = openMysteryBox(profile);
  if (!res.success) {
    console.error("openMysteryBox failed:", res.message);
    process.exit(1);
  }
  if (res.kind === "cosmetic") cosmeticOpens += 1;
}

Math.random = originalRandom;

const rate = cosmeticOpens / trials;
if (rate < 0.48 || rate > 0.52) {
  console.error(`Cosmetic rate ${(rate * 100).toFixed(1)}% outside 48–52% band`);
  process.exit(1);
}

console.log(`Star Chest: ${(rate * 100).toFixed(1)}% cosmetics over ${trials} opens (expected 50%)`);
