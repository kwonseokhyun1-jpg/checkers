#!/usr/bin/env node
/**
 * Mystery PvP decks must be launchable even when the player does not own every spell.
 * Run: node scripts/test-pvp-mystery-deck.mjs
 */
import assert from "node:assert/strict";
import { COLORS } from "../js/board.js";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { createMatchState } from "../js/match.js";
import {
  buildMysteryDeck,
  deckCardIdsFromMatchState,
  deckIdsEqual,
  describeDeckIssue,
} from "../js/deckRules.js";
import { buildStarterDeckCardIds } from "../js/storage.js";

const sparseProfile = { collection: { nudge: 1 } };
const starterDeck = buildStarterDeckCardIds();

const mysteryDeck = buildMysteryDeck();
assert.equal(mysteryDeck.length, DECK_SIZE, "Mystery deck should be full size");

const ownershipIssue = describeDeckIssue(mysteryDeck, sparseProfile);
assert.ok(ownershipIssue, "Sparse profile should flag unowned mystery spells");

const structureIssue = describeDeckIssue(mysteryDeck, null);
assert.equal(structureIssue, null, "Mystery deck structure should be valid without ownership");

assert.ok(
  buildMysteryDeck({ excludeDeckIds: starterDeck }),
  "Mystery deck builder should support excluding a known deck"
);

let excludedMatch = false;
for (let i = 0; i < 40; i++) {
  if (deckIdsEqual(buildMysteryDeck({ excludeDeckIds: starterDeck }), starterDeck)) {
    excludedMatch = true;
    break;
  }
}
assert.equal(excludedMatch, false, "Excluded mystery deck should not match the excluded list");

const state = createMatchState(buildMysteryDeck(), buildMysteryDeck());
const hostFromState = deckCardIdsFromMatchState(state, COLORS.RED);
assert.equal(hostFromState.length, DECK_SIZE, "Match state should reconstruct a full host deck");

function isMysteryMode(row) {
  const mode = row?.match_mode ?? row?.mode;
  return mode === "mystery";
}

assert.equal(isMysteryMode({ match_mode: "mystery" }), true);
assert.equal(isMysteryMode({ mode: "mystery" }), true, "Legacy mode column should still count as mystery");

console.log("test-pvp-mystery-deck: ok");
