/**
 * Achievements catalog, progress, and title claim flow.
 */
import { countClearedLevelsInWorld } from "./adventure.js";
import { getPlayableCards } from "./cardCatalog.js";
import { normalizeCosmetics } from "./cosmetics.js";
import { unlockTitleForAchievement, TITLE_BY_ACHIEVEMENT, MAGE_TITLE_BY_ID } from "./mageTitles.js";
import { getPvpWinCount } from "./profileStats.js";

export const ACHIEVEMENTS = [
  {
    id: "storm_summoner",
    title: "Storm Summoner",
    description: "Deal damage or destroy pieces using Chain Lightning 25 times.",
    target: 25,
    track: "cumulative",
  },
  {
    id: "calculated_sacrifice",
    title: "Calculated Sacrifice",
    description: "Win 5 matches where you cast Sacrifice or Offering on your own pieces.",
    target: 5,
    track: "cumulative",
  },
  {
    id: "close_call",
    title: "Close Call",
    description: "Win a battle with only 1 friendly piece remaining on the board.",
    target: 1,
    track: "once",
  },
  {
    id: "magical_sweep",
    title: "Magical Sweep",
    description: "Capture 4 enemy pieces in a single turn using spell card boosts.",
    target: 1,
    track: "once",
  },
  {
    id: "no_mercy",
    title: "No Mercy",
    description: "Win a match without letting the opponent capture any of your pieces.",
    target: 1,
    track: "once",
  },
  {
    id: "frozen_hearth",
    title: "Frozen Hearth",
    description: "Freeze 3 or more enemy pieces simultaneously (using Blizzard or Deep Freeze).",
    target: 1,
    track: "once",
  },
  {
    id: "royal_fleet",
    title: "Royal Fleet",
    description: "Promote 4 of your men to Kings in a single match.",
    target: 1,
    track: "once",
  },
  {
    id: "mind_bender",
    title: "Mind Bender",
    description: "Convert 10 enemy pieces using Mind Control or swap them with Hostile Swap.",
    target: 10,
    track: "cumulative",
  },
  {
    id: "silent_assassin",
    title: "Silent Assassin",
    description: "Trigger 15 hidden traps (Quicksand or Landmine) on enemy pieces.",
    target: 15,
    track: "cumulative",
  },
  {
    id: "executioner",
    title: "Executioner",
    description: "Execute 50 enemy pieces using the Execution spell.",
    target: 50,
    track: "cumulative",
  },
  {
    id: "arcane_mastery",
    title: "Arcane Mastery",
    description: "Collect 3 copies of 50 spell cards in your inventory.",
    target: 50,
    track: "state",
  },
  {
    id: "champion",
    title: "Champion",
    description: "Win 100 PvP matches.",
    target: 100,
    track: "state",
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Clear all 10 floors in Adventure tower 5 (Legend's End).",
    target: 10,
    track: "state",
  },
];

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

const ARCANE_MASTERY_TARGET = 50;
const ARCANE_MASTERY_COPIES = 3;
const CHAMPION_TARGET = 100;
const EXPLORER_CHAPTER = 5;
const EXPLORER_TARGET = 10;

const PLAYABLE_SPELL_IDS = getPlayableCards().map((c) => c.id);

export const DEFAULT_ACHIEVEMENTS = {
  progress: {},
  claimed: [],
};

export function normalizeAchievements(raw) {
  const base = structuredClone(DEFAULT_ACHIEVEMENTS);
  if (!raw || typeof raw !== "object") return base;
  if (raw.progress && typeof raw.progress === "object") {
    for (const [id, n] of Object.entries(raw.progress)) {
      if (ACHIEVEMENT_BY_ID[id] && typeof n === "number" && n >= 0) {
        base.progress[id] = n;
      }
    }
  }
  if (Array.isArray(raw.claimed)) {
    base.claimed = raw.claimed.filter((id) => ACHIEVEMENT_BY_ID[id]);
  }
  return base;
}

export function getAchievementProgress(profile, id) {
  profile.achievements = normalizeAchievements(profile.achievements);
  return profile.achievements.progress[id] || 0;
}

export function isAchievementComplete(profile, id) {
  const def = ACHIEVEMENT_BY_ID[id];
  if (!def) return false;
  if (id === "arcane_mastery") return hasArcaneMastery(profile);
  if (id === "champion") return getPvpWinCount(profile) >= CHAMPION_TARGET;
  if (id === "explorer") return countChapter5FloorsCleared(profile) >= EXPLORER_TARGET;
  return getAchievementProgress(profile, id) >= def.target;
}

export function isAchievementClaimed(profile, id) {
  profile.achievements = normalizeAchievements(profile.achievements);
  return profile.achievements.claimed.includes(id);
}

export function canClaimAchievement(profile, id) {
  return isAchievementComplete(profile, id) && !isAchievementClaimed(profile, id);
}

/** @returns {{ newlyComplete: string[], newlyUnlocked: object[] }} */
export function incrementAchievement(profile, id, amount = 1) {
  const def = ACHIEVEMENT_BY_ID[id];
  if (!def || def.track === "state") return { newlyComplete: [], newlyUnlocked: [] };
  profile.achievements = normalizeAchievements(profile.achievements);
  const prev = profile.achievements.progress[id] || 0;
  const next = Math.min(def.target, prev + amount);
  if (next <= prev) return { newlyComplete: [], newlyUnlocked: [] };
  profile.achievements.progress[id] = next;
  const newlyComplete = next >= def.target && prev < def.target ? [id] : [];
  return { newlyComplete, newlyUnlocked: [] };
}

export function setAchievementProgress(profile, id, value) {
  const def = ACHIEVEMENT_BY_ID[id];
  if (!def) return { newlyComplete: [], newlyUnlocked: [] };
  profile.achievements = normalizeAchievements(profile.achievements);
  const prev = profile.achievements.progress[id] || 0;
  const next = Math.min(def.target, Math.max(0, value));
  profile.achievements.progress[id] = next;
  const newlyComplete = next >= def.target && prev < def.target ? [id] : [];
  return { newlyComplete, newlyUnlocked: [] };
}

export function claimAchievement(profile, id) {
  if (!canClaimAchievement(profile, id)) {
    return { success: false, message: "Achievement not ready to claim." };
  }
  profile.achievements = normalizeAchievements(profile.achievements);
  profile.cosmetics = normalizeCosmetics(profile.cosmetics);
  profile.achievements.claimed.push(id);
  const title = unlockTitleForAchievement(profile, id);
  const titleDef = title || TITLE_BY_ACHIEVEMENT[id];
  return {
    success: true,
    message: titleDef ? `Unlocked [${titleDef.display}]!` : "Title claimed!",
    title: titleDef,
  };
}

export function countTripledSpells(profile) {
  const coll = profile.collection || {};
  return PLAYABLE_SPELL_IDS.filter((cardId) => (coll[cardId] || 0) >= ARCANE_MASTERY_COPIES).length;
}

export function hasArcaneMastery(profile) {
  return countTripledSpells(profile) >= ARCANE_MASTERY_TARGET;
}

export function countChapter5FloorsCleared(profile) {
  return countClearedLevelsInWorld(profile?.adventure, EXPLORER_CHAPTER);
}

/** Sync arcane_mastery progress from collection; returns newly completed ids */
export function syncArcaneMastery(profile) {
  profile.achievements = normalizeAchievements(profile.achievements);
  const count = Math.min(ARCANE_MASTERY_TARGET, countTripledSpells(profile));
  const prev = profile.achievements.progress.arcane_mastery || 0;
  profile.achievements.progress.arcane_mastery = count;
  if (count >= ARCANE_MASTERY_TARGET && prev < ARCANE_MASTERY_TARGET) return ["arcane_mastery"];
  return [];
}

/** Sync champion progress from PvP wins; returns newly completed ids */
export function syncChampion(profile) {
  profile.achievements = normalizeAchievements(profile.achievements);
  const count = Math.min(CHAMPION_TARGET, getPvpWinCount(profile));
  const prev = profile.achievements.progress.champion || 0;
  profile.achievements.progress.champion = count;
  if (count >= CHAMPION_TARGET && prev < CHAMPION_TARGET) return ["champion"];
  return [];
}

/** Sync explorer progress from Adventure tower 5 clears; returns newly completed ids */
export function syncExplorer(profile) {
  profile.achievements = normalizeAchievements(profile.achievements);
  const count = Math.min(EXPLORER_TARGET, countChapter5FloorsCleared(profile));
  const prev = profile.achievements.progress.explorer || 0;
  profile.achievements.progress.explorer = count;
  if (count >= EXPLORER_TARGET && prev < EXPLORER_TARGET) return ["explorer"];
  return [];
}

export function achievementRewardTitle(id) {
  const titleId = TITLE_BY_ACHIEVEMENT[id]?.id;
  return titleId ? MAGE_TITLE_BY_ID[titleId] : null;
}

export function progressLabel(profile, id) {
  const def = ACHIEVEMENT_BY_ID[id];
  if (!def) return "";
  if (id === "arcane_mastery") {
    const owned = Math.min(ARCANE_MASTERY_TARGET, countTripledSpells(profile));
    return `${owned} / ${ARCANE_MASTERY_TARGET} spells at 3×`;
  }
  if (id === "champion") {
    const wins = Math.min(CHAMPION_TARGET, getPvpWinCount(profile));
    return `${wins} / ${CHAMPION_TARGET} PvP wins`;
  }
  if (id === "explorer") {
    const cleared = Math.min(EXPLORER_TARGET, countChapter5FloorsCleared(profile));
    return `${cleared} / ${EXPLORER_TARGET} tower 5 floors`;
  }
  const cur = Math.min(def.target, getAchievementProgress(profile, id));
  return `${cur} / ${def.target}`;
}

/** @returns {number} Progress from 0 (not started) to 1 (complete). */
export function achievementProgressRatio(profile, id) {
  const def = ACHIEVEMENT_BY_ID[id];
  if (!def?.target) return 0;
  if (id === "arcane_mastery") {
    return Math.min(1, countTripledSpells(profile) / def.target);
  }
  if (id === "champion") {
    return Math.min(1, getPvpWinCount(profile) / def.target);
  }
  if (id === "explorer") {
    return Math.min(1, countChapter5FloorsCleared(profile) / def.target);
  }
  return Math.min(1, getAchievementProgress(profile, id) / def.target);
}
