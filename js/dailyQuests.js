/**
 * Daily quests — rotate each local calendar day; reward gems or stars.
 */

export const DAILY_QUEST_TEMPLATES = [
  {
    templateId: "pvp_wins_1",
    kind: "pvp_wins",
    title: "Arena Victor",
    description: "Win 1 PvP match today.",
    target: 1,
    reward: { currency: "gems", amount: 20 },
  },
  {
    templateId: "pvp_wins_2",
    kind: "pvp_wins",
    title: "Duelist",
    description: "Win 2 PvP matches today.",
    target: 2,
    reward: { currency: "gems", amount: 35 },
  },
  {
    templateId: "spells_5",
    kind: "spells_played",
    title: "Arcane Practice",
    description: "Cast 5 spells in any match today.",
    target: 5,
    reward: { currency: "gems", amount: 25 },
  },
  {
    templateId: "spells_10",
    kind: "spells_played",
    title: "Spell Slinger",
    description: "Cast 10 spells in any match today.",
    target: 10,
    reward: { currency: "gems", amount: 45 },
  },
  {
    templateId: "adventure_floor_1",
    kind: "adventure_floors",
    title: "Tower Climber",
    description: "Clear 1 Adventure floor today.",
    target: 1,
    reward: { currency: "stars", amount: 2 },
  },
  {
    templateId: "adventure_floor_2",
    kind: "adventure_floors",
    title: "Deep Ascent",
    description: "Clear 2 Adventure floors today.",
    target: 2,
    reward: { currency: "stars", amount: 3 },
  },
  {
    templateId: "box_open_1",
    kind: "boxes_opened",
    title: "Treasure Hunter",
    description: "Open 1 box of any type today.",
    target: 1,
    reward: { currency: "gems", amount: 15 },
  },
];

export const DAILY_QUEST_BY_ID = Object.fromEntries(DAILY_QUEST_TEMPLATES.map((q) => [q.templateId, q]));

export const DAILY_QUEST_COUNT = 3;

export const DEFAULT_DAILY_QUESTS = {
  dateKey: "",
  activeIds: [],
  progress: {},
  claimed: [],
};

export function getLocalDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMsUntilLocalMidnight(date = new Date()) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return next.getTime() - date.getTime();
}

export function formatDailyResetCountdown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function nextSeed(seed) {
  return (Math.imul(seed, 1103515245) + 12345) >>> 0;
}

/** Deterministic pick: one quest per kind, up to DAILY_QUEST_COUNT. */
export function pickDailyQuestIds(dateKey) {
  const byKind = {};
  for (const template of DAILY_QUEST_TEMPLATES) {
    if (!byKind[template.kind]) byKind[template.kind] = [];
    byKind[template.kind].push(template);
  }

  let seed = hashString(`daily:${dateKey}`);
  const kinds = Object.keys(byKind);
  for (let i = kinds.length - 1; i > 0; i--) {
    seed = nextSeed(seed);
    const j = seed % (i + 1);
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }

  const picked = [];
  for (const kind of kinds) {
    if (picked.length >= DAILY_QUEST_COUNT) break;
    const pool = byKind[kind];
    seed = nextSeed(seed);
    const template = pool[seed % pool.length];
    picked.push(template.templateId);
  }
  return picked;
}

export function normalizeDailyQuests(raw, dateKey = getLocalDateKey()) {
  const base = structuredClone(DEFAULT_DAILY_QUESTS);
  if (!raw || typeof raw !== "object") {
    base.dateKey = dateKey;
    base.activeIds = pickDailyQuestIds(dateKey);
    return base;
  }

  if (raw.dateKey !== dateKey) {
    base.dateKey = dateKey;
    base.activeIds = pickDailyQuestIds(dateKey);
    return base;
  }

  base.dateKey = dateKey;
  base.activeIds = Array.isArray(raw.activeIds)
    ? raw.activeIds.filter((id) => DAILY_QUEST_BY_ID[id]).slice(0, DAILY_QUEST_COUNT)
    : [];
  if (base.activeIds.length < DAILY_QUEST_COUNT) {
    base.activeIds = pickDailyQuestIds(dateKey);
  }

  if (raw.progress && typeof raw.progress === "object") {
    for (const [id, n] of Object.entries(raw.progress)) {
      if (base.activeIds.includes(id) && typeof n === "number" && n >= 0) {
        base.progress[id] = n;
      }
    }
  }

  if (Array.isArray(raw.claimed)) {
    base.claimed = raw.claimed.filter((id) => base.activeIds.includes(id));
  }

  return base;
}

export function refreshDailyQuests(profile, dateKey = getLocalDateKey()) {
  profile.dailyQuests = normalizeDailyQuests(profile.dailyQuests, dateKey);
  return profile.dailyQuests;
}

export function getDailyQuestProgress(profile, templateId) {
  refreshDailyQuests(profile);
  return profile.dailyQuests.progress[templateId] || 0;
}

export function isDailyQuestComplete(profile, templateId) {
  const def = DAILY_QUEST_BY_ID[templateId];
  if (!def) return false;
  return getDailyQuestProgress(profile, templateId) >= def.target;
}

export function isDailyQuestClaimed(profile, templateId) {
  refreshDailyQuests(profile);
  return profile.dailyQuests.claimed.includes(templateId);
}

export function canClaimDailyQuest(profile, templateId) {
  refreshDailyQuests(profile);
  return (
    profile.dailyQuests.activeIds.includes(templateId) &&
    isDailyQuestComplete(profile, templateId) &&
    !isDailyQuestClaimed(profile, templateId)
  );
}

/** @returns {{ newlyComplete: string[] }} */
export function incrementDailyQuest(profile, kind, amount = 1) {
  refreshDailyQuests(profile);
  const newlyComplete = [];
  if (!amount || amount <= 0) return { newlyComplete };

  for (const templateId of profile.dailyQuests.activeIds) {
    const def = DAILY_QUEST_BY_ID[templateId];
    if (!def || def.kind !== kind) continue;
    const prev = profile.dailyQuests.progress[templateId] || 0;
    const next = Math.min(def.target, prev + amount);
    if (next <= prev) continue;
    profile.dailyQuests.progress[templateId] = next;
    if (next >= def.target && prev < def.target) newlyComplete.push(templateId);
  }

  return { newlyComplete };
}

export function claimDailyQuest(profile, templateId) {
  if (!canClaimDailyQuest(profile, templateId)) {
    return { success: false, message: "Daily quest not ready to claim." };
  }

  const def = DAILY_QUEST_BY_ID[templateId];
  profile.dailyQuests.claimed.push(templateId);

  if (def.reward.currency === "stars") {
    profile.stars = (profile.stars ?? 0) + def.reward.amount;
  } else {
    profile.gems = (profile.gems ?? 0) + def.reward.amount;
  }

  const rewardLabel =
    def.reward.currency === "stars"
      ? `+${def.reward.amount} ★`
      : `+${def.reward.amount} ◆`;

  return {
    success: true,
    message: `Claimed ${rewardLabel}!`,
    reward: def.reward,
  };
}

export function dailyQuestProgressLabel(profile, templateId) {
  const def = DAILY_QUEST_BY_ID[templateId];
  if (!def) return "";
  const cur = Math.min(def.target, getDailyQuestProgress(profile, templateId));
  return `${cur} / ${def.target}`;
}

export function dailyQuestProgressRatio(profile, templateId) {
  const def = DAILY_QUEST_BY_ID[templateId];
  if (!def?.target) return 0;
  return Math.min(1, getDailyQuestProgress(profile, templateId) / def.target);
}

export function dailyQuestRewardLabel(templateId) {
  const def = DAILY_QUEST_BY_ID[templateId];
  if (!def) return "";
  if (def.reward.currency === "stars") return `${def.reward.amount} ★`;
  return `${def.reward.amount} ◆`;
}

export function getActiveDailyQuests(profile) {
  refreshDailyQuests(profile);
  return profile.dailyQuests.activeIds.map((templateId) => {
    const template = DAILY_QUEST_BY_ID[templateId];
    const complete = isDailyQuestComplete(profile, templateId);
    const claimed = isDailyQuestClaimed(profile, templateId);
    const canClaim = canClaimDailyQuest(profile, templateId);
    return { template, templateId, complete, claimed, canClaim };
  });
}

export function countClaimableDailyQuests(profile) {
  refreshDailyQuests(profile);
  return profile.dailyQuests.activeIds.filter((id) => canClaimDailyQuest(profile, id)).length;
}

export function trackDailyQuestEvent(profile, kind, amount = 1) {
  return incrementDailyQuest(profile, kind, amount);
}
