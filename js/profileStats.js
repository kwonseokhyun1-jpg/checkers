import { getPlayableCards } from "./cardCatalog.js";
import { repairAdventureProgress } from "./adventure.js";

function championProgressBackup(profile) {
  const n = Number(profile?.achievements?.progress?.champion);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function getPvpWinCount(profile) {
  const n = Number(profile?.pvpWins);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** Restore pvpWins from mirrored champion quest progress when the counter was stripped. */
export function reconcileMonotonicProfileStats(profile) {
  if (!profile) return profile;
  const pvp = Math.max(getPvpWinCount(profile), championProgressBackup(profile));
  if (pvp > 0) profile.pvpWins = pvp;
  return profile;
}

/** Keep the highest monotonic counters when merging local/cloud profile copies. */
export function mergeMonotonicProfileStats(into, ...sources) {
  if (!into) return into;
  let pvp = Math.max(getPvpWinCount(into), championProgressBackup(into));
  let spells = getSpellPlayCount(into);
  for (const src of sources) {
    if (!src) continue;
    pvp = Math.max(pvp, getPvpWinCount(src), championProgressBackup(src));
    spells = Math.max(spells, getSpellPlayCount(src));
  }
  if (pvp > 0) into.pvpWins = pvp;
  if (spells > 0) into.spellsPlayed = spells;
  return into;
}

/** Pick the newer profile shell, then merge monotonic stats from both copies. */
export function resolveProfileConflict(local, remote) {
  if (!remote || typeof remote !== "object") {
    reconcileMonotonicProfileStats(local);
    return local;
  }
  const remoteTime = remote.savedAt || 0;
  const localTime = local?.savedAt || 0;
  const useRemote = remoteTime >= localTime;
  const base = useRemote ? { ...remote } : { ...local };
  mergeMonotonicProfileStats(base, useRemote ? local : remote);
  reconcileMonotonicProfileStats(base);
  return base;
}

export function recordPvpWin(profile) {
  if (!profile) return 0;
  profile.pvpWins = getPvpWinCount(profile) + 1;
  return profile.pvpWins;
}

export function countAdventureFloorsCleared(profile) {
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
    adventureFloorsCleared: countAdventureFloorsCleared(profile),
    spellsPlayed: getSpellPlayCount(profile),
  };
}
