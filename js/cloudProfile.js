import { getCurrentUser, fetchProfileRow, upsertProfileRow, isAuthAvailable } from "./auth.js";
import { isGuestMode } from "./guestMode.js";
import {
  readProfileFromStorage,
  saveProfile,
  repairProfile,
  isDefaultProfile,
  getStoredProfileOwnerId,
  resetToDefaultProfile,
} from "./storage.js";
import {
  mergeMonotonicProfileStats,
  reconcileMonotonicProfileStats,
  resolveProfileConflict,
} from "./profileStats.js";

let cloudSaveTimer = null;

/** True when remote is missing or only has auth shell fields (no real progress). */
export function isEmptyRemoteProfile(json) {
  if (!json || typeof json !== "object") return true;
  const keys = Object.keys(json);
  if (keys.length === 0) return true;
  if (keys.every((k) => k === "loginEmail" || k === "login_email" || k === "savedAt")) return true;
  const hasCollection = json.collection && Object.keys(json.collection).length > 0;
  const hasDecks = Array.isArray(json.decks) && json.decks.length > 0;
  const cleared = json.adventure?.cleared;
  const hasProgress =
    (Array.isArray(cleared) ? cleared.length : Object.keys(cleared || {}).length) > 0;
  const hasCurrency = typeof json.gems === "number" || typeof json.stars === "number";
  const hasStats =
    (typeof json.pvpWins === "number" && json.pvpWins > 0) ||
    (typeof json.spellsPlayed === "number" && json.spellsPlayed > 0);
  return !(hasCollection || hasDecks || hasProgress || hasCurrency || hasStats);
}

function applyRemoteProfile(remote) {
  repairProfile(remote);
  saveProfile(remote, { bumpTimestamp: false });
  return remote;
}

function localBelongsToUser(userId, remote) {
  const ownerId = getStoredProfileOwnerId();
  if (ownerId !== userId && ownerId !== null) return false;
  // Guest session progress must not replace an existing cloud save on sign-in.
  // Auth notify() stamps owner before pull/onSignedIn, so do not require ownerId === null.
  if (isGuestMode() && remote && !isEmptyRemoteProfile(remote)) {
    return false;
  }
  return true;
}

/**
 * Build the profile_json payload for a new account upsert, claiming guest local
 * progress when the cloud row is still an empty auth shell.
 */
export function profileJsonForSignupUpsert(existingRemote, loginEmail, { wasGuest = false } = {}) {
  const email = String(loginEmail || "").trim().toLowerCase();
  const remote =
    existingRemote && typeof existingRemote === "object" ? { ...existingRemote } : {};

  if (wasGuest) {
    const local = readProfileFromStorage();
    if (!isDefaultProfile(local) && isEmptyRemoteProfile(remote)) {
      const claimed = { ...local, loginEmail: email };
      repairProfile(claimed);
      if (typeof claimed.savedAt !== "number") claimed.savedAt = Date.now();
      return claimed;
    }
  }

  remote.loginEmail = email;
  return remote;
}

export async function pullCloudProfile() {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable()) return null;

  const row = await fetchProfileRow(user.id);
  const local = readProfileFromStorage();
  const remote = row?.profile_json;
  const ownedLocal = localBelongsToUser(user.id, remote);

  if (!remote || typeof remote !== "object" || isEmptyRemoteProfile(remote)) {
    if (!isDefaultProfile(local) && ownedLocal) {
      applyRemoteProfile(local);
      // Guest → new account: empty cloud must receive local progress immediately,
      // not only via the debounced scheduleCloudSave (easy to miss on close/reload).
      if (isGuestMode()) {
        try {
          await flushCloudSave(readProfileFromStorage());
        } catch (e) {
          console.warn("Guest progress cloud claim failed", e);
        }
      }
    } else if (!isDefaultProfile(local) && !ownedLocal) {
      return applyRemoteProfile(resetToDefaultProfile());
    }
    return readProfileFromStorage();
  }

  if (isDefaultProfile(local) || !ownedLocal) {
    const merged = { ...remote };
    if (ownedLocal) mergeMonotonicProfileStats(merged, local);
    reconcileMonotonicProfileStats(merged);
    return applyRemoteProfile(merged);
  }

  const remoteTime = remote.savedAt || 0;
  const localTime = local.savedAt || 0;

  if (remoteTime >= localTime) {
    return applyRemoteProfile(resolveProfileConflict(local, remote));
  }

  mergeMonotonicProfileStats(local, remote);
  saveProfile(local);
  return local;
}

export function scheduleCloudSave(profile) {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable()) return;

  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(async () => {
    try {
      await flushCloudSave(profile);
    } catch (e) {
      console.warn("Cloud save failed", e);
    }
  }, 800);
}

/** Immediate cloud upsert (cancels any pending debounced save). */
export async function flushCloudSave(profile) {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable() || !profile) return null;

  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = null;

  return upsertProfileRow(user.id, {
    profile_json: profile,
    display_name: user.user_metadata?.display_name || user.email?.split("@")[0],
  });
}
