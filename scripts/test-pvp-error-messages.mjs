#!/usr/bin/env node
import assert from "node:assert/strict";
import { DECK_SIZE } from "../js/cardCatalog.js";
import { describeDeckIssue, validateDeck } from "../js/deckRules.js";
import { formatPvpError } from "../js/pvpErrors.js";

const CARD_IDS = [
  "nudge", "backstep", "retreat", "anchor", "recall",
  "repel", "stab", "shatter", "destroy", "snipe",
];
const validDeck = CARD_IDS.flatMap((id) => [id, id, id]);
const profile = {
  collection: Object.fromEntries(CARD_IDS.map((id) => [id, 4])),
};

assert.equal(describeDeckIssue(validDeck, profile), null);

const short = describeDeckIssue(validDeck.slice(0, 24), profile);
assert.match(short, /24\/30/);
assert.match(short, /add 6 more spells/);

const overCopy = describeDeckIssue(validDeck, {
  collection: { nudge: 2, backstep: 4, retreat: 4, anchor: 4, recall: 4, repel: 4, stab: 4, shatter: 4, destroy: 4, snipe: 4 },
});
assert.match(overCopy, /Not enough copies/);
assert.match(overCopy, /buy more copies/);

const tooMany = describeDeckIssue([...validDeck, "nudge"], profile);
assert.match(tooMany, /31\/30/);
assert.match(tooMany, /remove 1 spell/);

assert.match(
  formatPvpError(new TypeError("Failed to fetch")),
  /Network error/
);
assert.match(
  formatPvpError(new TypeError("Failed to fetch"), { context: "sync" }),
  /retry automatically/
);
assert.match(
  formatPvpError({ code: "PGRST301", message: "JWT expired" }),
  /Session expired/
);
assert.equal(
  formatPvpError(new Error("That room is no longer available.")),
  "That room is no longer available."
);

const val = validateDeck(validDeck, profile);
assert.equal(val.valid, true);

console.log("test-pvp-error-messages: ok");
