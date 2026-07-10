#!/usr/bin/env node
/**
 * Mystery PvP decks must be launchable even when the player does not own every spell.
 * Run: node scripts/test-pvp-mystery-deck.mjs
 */
import assert from "node:assert/strict";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { buildMysteryDeck, describeDeckIssue } from "../js/deckRules.js";

const sparseProfile = { collection: { nudge: 1 } };

const mysteryDeck = buildMysteryDeck();
assert.equal(mysteryDeck.length, DECK_SIZE, "Mystery deck should be full size");

const ownershipIssue = describeDeckIssue(mysteryDeck, sparseProfile);
assert.ok(ownershipIssue, "Sparse profile should flag unowned mystery spells");

const structureIssue = describeDeckIssue(mysteryDeck, null);
assert.equal(structureIssue, null, "Mystery deck structure should be valid without ownership");

console.log("test-pvp-mystery-deck: ok");
