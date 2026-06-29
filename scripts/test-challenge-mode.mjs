#!/usr/bin/env node
/**
 * Challenge mode: unlock gate, toggle state, and extra black rank on board row 3 (rank 5).
 * Run: node scripts/test-challenge-mode.mjs
 */
import { COLORS, SIZE, createInitialBoard, countPieces, isDarkSquare } from "../js/board.js";
import { createMatchState } from "../js/match.js";
import {
  CHALLENGE_MODE_UNLOCK_LEVEL,
  defaultAdventureProgress,
  isChallengeModeUnlocked,
  isChallengeModeEnabled,
  repairAdventureProgress,
  recordLevelClear,
} from "../js/adventure.js";
import { DECK_SIZE } from "../js/cardCatalog.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

assert(CHALLENGE_MODE_UNLOCK_LEVEL === 50, "Challenge unlock should be tower 5 floor 10 (level 50)");

const fresh = defaultAdventureProgress();
assert(!isChallengeModeUnlocked(fresh), "Fresh profile should not unlock challenge mode");
assert(!isChallengeModeEnabled(fresh), "Challenge mode should default off");

const cleared = { ...fresh, cleared: { "50": true } };
assert(isChallengeModeUnlocked(cleared), "Clearing level 50 should unlock challenge mode");

const toggled = repairAdventureProgress({ ...cleared, challengeMode: true });
assert(isChallengeModeEnabled(toggled), "Challenge toggle should persist in progress");

const normalBoard = createInitialBoard();
const challengeBoard = createInitialBoard({ challengeMode: true });
assert(
  countPieces(normalBoard, COLORS.BLACK) === 12,
  `Normal board should have 12 black pieces, got ${countPieces(normalBoard, COLORS.BLACK)}`,
);
assert(
  countPieces(challengeBoard, COLORS.BLACK) === 16,
  `Challenge board should have 16 black pieces, got ${countPieces(challengeBoard, COLORS.BLACK)}`,
);

let rank5Black = 0;
for (let col = 0; col < SIZE; col++) {
  if (!isDarkSquare(3, col)) continue;
  if (challengeBoard[3][col]?.color === COLORS.BLACK) rank5Black++;
}
assert(rank5Black === 4, `Rank 5 (row 3) should have 4 black pieces, got ${rank5Black}`);

for (let col = 0; col < SIZE; col++) {
  if (!isDarkSquare(3, col)) continue;
  assert(!normalBoard[3][col], "Normal board rank 5 should be empty");
}

const deck = Array(DECK_SIZE).fill("bomb");
const match = createMatchState(deck, deck, { challengeMode: true });
assert(
  countPieces(match.board, COLORS.BLACK) === 16,
  "Challenge match state should start with extra black rank",
);

const profile = { adventure: defaultAdventureProgress(), gems: 0, stars: 0 };
recordLevelClear(profile, 50, 3);
assert(isChallengeModeUnlocked(profile.adventure), "recordLevelClear on 50 should unlock challenge");

console.log("challenge mode: OK");
