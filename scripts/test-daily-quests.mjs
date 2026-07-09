/**
 * Unit tests for daily quests (rotation, progress, claim rewards).
 */
import {
  pickDailyQuestIds,
  refreshDailyQuests,
  trackDailyQuestEvent,
  canClaimDailyQuest,
  claimDailyQuest,
  getActiveDailyQuests,
  getLocalDateKey,
  getMsUntilLocalMidnight,
  formatDailyResetCountdown,
  DAILY_QUEST_COUNT,
  DAILY_QUEST_BY_ID,
} from "../js/dailyQuests.js";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function makeProfile() {
  return {
    gems: 100,
    stars: 5,
    dailyQuests: null,
  };
}

function testDeterministicRotation() {
  const a = pickDailyQuestIds("2026-07-02");
  const b = pickDailyQuestIds("2026-07-02");
  const c = pickDailyQuestIds("2026-07-03");
  assert(a.length === DAILY_QUEST_COUNT, "should pick three quests");
  assert(JSON.stringify(a) === JSON.stringify(b), "same date should pick same quests");
  assert(new Set(a).size === a.length, "quest ids should be unique");
  for (const id of a) assert(DAILY_QUEST_BY_ID[id], `unknown quest id ${id}`);
  assert(JSON.stringify(a) !== JSON.stringify(c) || a.join() !== c.join(), "different dates may differ");
}

function testOneQuestPerKind() {
  const ids = pickDailyQuestIds("2026-07-15");
  const kinds = ids.map((id) => DAILY_QUEST_BY_ID[id].kind);
  assert(new Set(kinds).size === kinds.length, "daily quests should cover different kinds");
}

function pinDailyQuests(profile, activeIds, dateKey = getLocalDateKey()) {
  profile.dailyQuests = { dateKey, activeIds, progress: {}, claimed: [] };
  refreshDailyQuests(profile, dateKey);
}

function testProgressAndClaimGems() {
  const profile = makeProfile();
  pinDailyQuests(profile, ["spells_5", "pvp_wins_1", "adventure_floor_1"]);
  const spellQuest = "spells_5";

  trackDailyQuestEvent(profile, "spells_played", 1);
  assert(!canClaimDailyQuest(profile, spellQuest), "partial progress should not be claimable");

  const target = DAILY_QUEST_BY_ID[spellQuest].target;
  trackDailyQuestEvent(profile, "spells_played", target);
  assert(canClaimDailyQuest(profile, spellQuest), "completed quest should be claimable");

  const reward = DAILY_QUEST_BY_ID[spellQuest].reward;
  const res = claimDailyQuest(profile, spellQuest);
  assert(res.success, "claim should succeed");
  if (reward.currency === "gems") {
    assert(profile.gems === 100 + reward.amount, "gems should increase");
  } else {
    assert(profile.stars === 5 + reward.amount, "stars should increase");
  }
  assert(!canClaimDailyQuest(profile, spellQuest), "claimed quest should not be claimable again");
}

function testBoxOpenProgress() {
  const profile = makeProfile();
  pinDailyQuests(profile, ["box_open_1", "pvp_wins_1", "spells_5"]);

  trackDailyQuestEvent(profile, "boxes_opened", 1);
  assert(canClaimDailyQuest(profile, "box_open_1"), "opening a box should complete the quest");

  const res = claimDailyQuest(profile, "box_open_1");
  assert(res.success, "box quest claim should succeed");
  assert(profile.gems === 115, "box quest should award 15 gems");
}

function testDailyReset() {
  const profile = makeProfile();
  refreshDailyQuests(profile, "2026-07-01");
  const firstIds = [...profile.dailyQuests.activeIds];
  profile.dailyQuests.progress[firstIds[0]] = 1;
  profile.dailyQuests.claimed = [firstIds[0]];

  refreshDailyQuests(profile, "2026-07-02");
  assert(profile.dailyQuests.dateKey === "2026-07-02", "should roll to new date");
  assert(profile.dailyQuests.claimed.length === 0, "claimed list should reset");
  assert(Object.keys(profile.dailyQuests.progress).length === 0, "progress should reset");
  assert(profile.dailyQuests.activeIds.length === DAILY_QUEST_COUNT, "new quests should be assigned");
}

function testActiveDailyQuestsShape() {
  const profile = makeProfile();
  refreshDailyQuests(profile, "2026-07-02");
  const rows = getActiveDailyQuests(profile);
  assert(rows.length === DAILY_QUEST_COUNT, "active list should have three entries");
  for (const row of rows) {
    assert(row.template, "each row should include template");
    assert(typeof row.canClaim === "boolean", "canClaim should be boolean");
  }
}

function testResetCountdownHelpers() {
  const noon = new Date(2026, 6, 2, 12, 0, 0);
  const ms = getMsUntilLocalMidnight(noon);
  assert(ms === 12 * 60 * 60 * 1000, "noon should be 12 hours until midnight");

  const almostMidnight = new Date(2026, 6, 2, 23, 59, 30);
  assert(getMsUntilLocalMidnight(almostMidnight) === 30 * 1000, "30 seconds left at 23:59:30");

  assert(formatDailyResetCountdown(3661000) === "01:01:01", "should format HH:MM:SS");
  assert(formatDailyResetCountdown(0) === "00:00:00", "zero ms should format as 00:00:00");
  assert(formatDailyResetCountdown(-1000) === "00:00:00", "negative ms should clamp to zero");
}

testDeterministicRotation();
testOneQuestPerKind();
testProgressAndClaimGems();
testBoxOpenProgress();
testDailyReset();
testActiveDailyQuestsShape();
testResetCountdownHelpers();
console.log("All daily quest tests passed.");
