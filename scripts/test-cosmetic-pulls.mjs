#!/usr/bin/env node
/**
 * Cosmetic boxes must be able to award every non-starter catalog item.
 * Run: node scripts/test-cosmetic-pulls.mjs
 */
import {
  COSMETIC_ITEMS,
  DEFAULT_COSMETICS,
  STARTER_COSMETIC_IDS,
  drawCosmeticItem,
} from "../js/cosmetics.js";

const GOLD_WEIGHTS = { common: 32, uncommon: 38, rare: 22, epic: 6, legendary: 2 };

const pullableIds = COSMETIC_ITEMS.map((c) => c.id).filter((id) => !STARTER_COSMETIC_IDS.has(id));

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

const profile = { gems: 0, cosmetics: structuredClone(DEFAULT_COSMETICS) };
const pulled = new Set();

for (let i = 0; i < 10_000; i++) {
  const item = drawCosmeticItem(profile, GOLD_WEIGHTS);
  assert(item, `drawCosmeticItem returned null on pull ${i + 1}`);
  if (!item.duplicate) pulled.add(item.id);
  if (pulled.size === pullableIds.length) break;
}

const missing = pullableIds.filter((id) => !pulled.has(id));
assert(
  missing.length === 0,
  `Could not pull all cosmetics. Missing (${missing.length}): ${missing.join(", ")}`
);

for (const id of pullableIds) {
  const item = drawCosmeticItem(profile, GOLD_WEIGHTS);
  assert(item?.duplicate, `Expected duplicate refund after full collection, got ${item?.id}`);
}

console.log(`test-cosmetic-pulls: ok — all ${pullableIds.length} pullable cosmetics awarded`);
