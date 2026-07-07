#!/usr/bin/env node
/**
 * Title Box: unlocks box-exclusive titles; duplicates refund stars.
 * Run: node scripts/test-title-box.mjs
 */
import { openTitleBox, TITLE_BOX_COST, TITLE_BOX_DUPE_STAR_REFUND } from "../js/mysteryBox.js";
import { DEFAULT_COSMETICS } from "../js/cosmetics.js";
import { TITLE_BOX_TITLES, ownsTitle } from "../js/mageTitles.js";

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

const profile = {
  gems: 0,
  stars: 100,
  collection: {},
  decks: [],
  cosmetics: structuredClone(DEFAULT_COSMETICS),
};

const res = openTitleBox(profile);
assert(res.success, res.message);
assert(res.kind === "title", "Expected title kind");
assert(res.pulls.length === 1, "Expected one title pull");
assert(!res.pulls[0].duplicate, "Expected new title");
assert(ownsTitle(profile, res.pulls[0].id), "Title should be unlocked");
assert(profile.stars === 100 - TITLE_BOX_COST, "Stars should be deducted");

for (const title of TITLE_BOX_TITLES) {
  if (!ownsTitle(profile, title.id)) {
    profile.cosmetics.unlockedTitles.push(title.id);
  }
}

profile.stars = 100;
const dupeRes = openTitleBox(profile);
assert(dupeRes.success, dupeRes.message);
assert(dupeRes.pulls[0].duplicate, "Expected duplicate title");
assert(dupeRes.bonusStars === TITLE_BOX_DUPE_STAR_REFUND, "Expected star refund");
assert(
  profile.stars === 100 - TITLE_BOX_COST + TITLE_BOX_DUPE_STAR_REFUND,
  "Stars should reflect duplicate refund"
);

console.log(`Title Box OK — ${TITLE_BOX_TITLES.length} exclusive titles`);
