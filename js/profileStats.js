import { getPlayableCards } from "./cardCatalog.js";
import { repairAdventureProgress } from "./adventure.js";

export function getPvpWinCount(profile) {
  const n = Number(profile?.pvpWins);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function recordPvpWin(profile) {
  if (!profile) return 0;
  profile.pvpWins = getPvpWinCount(profile) + 1;
  return profile.pvpWins;
}

export function countAdventureStagesCleared(profile) {
  const progress = repairAdventureProgress(profile?.adventure);
  return Object.values(progress.cleared || {}).filter(Boolean).length;
}

export function getSpellPlayCount(profile) {
  const n = Number(profile?.spellsPlayed);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function recordSpellPlayed(profile) {
  if (!profile) return 0;
  profile.spellsPlayed = getSpellPlayCount(profile) + 1;
  return profile.spellsPlayed;
}

export function countSpellsUnlocked(profile) {
  const collection = profile?.collection || {};
  const playableIds = new Set(getPlayableCards().map((c) => c.id));
  let count = 0;
  for (const id of playableIds) {
    if ((collection[id] || 0) > 0) count += 1;
  }
  return count;
}

export function getProfileStats(profile) {
  return {
    pvpWins: getPvpWinCount(profile),
    adventureStagesCleared: countAdventureStagesCleared(profile),
    spellsPlayed: getSpellPlayCount(profile),
  };
}
