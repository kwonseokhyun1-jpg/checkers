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
  if (ownerId === null && isGuestMode() && remote && !isEmptyRemoteProfile(remote)) {
    return false;
  }
  return true;
}

export async function pullCloudProfile() {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable()) return null;

  const row = await fetchProfileRow(user.id);
  const local = readProfileFromStorage();
  const remote = row?.profile_json;
  const ownedLocal = localBelongsToUser(user.id, remote);

  if (!remote || typeof remote !== "object" || isEmptyRemoteProfile(remote)) {
    if (!isDefaultProfile(local) && ownedLocal) applyRemoteProfile(local);
    else if (!isDefaultProfile(local) && !ownedLocal) return applyRemoteProfile(resetToDefaultProfile());
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
      await upsertProfileRow(user.id, {
        profile_json: profile,
        display_name: user.user_metadata?.display_name || user.email?.split("@")[0],
      });
    } catch (e) {
      console.warn("Cloud save failed", e);
    }
  }, 800);
}

/**
 * Build profile_json for a brand-new account signup.
 * Guest / unowned device progress is carried into the cloud save when the remote row is empty.
 */
export async function buildProfileJsonForSignup(userId, loginEmail) {
  const email = String(loginEmail || "").trim().toLowerCase();
  const row = await fetchProfileRow(userId);
  const remote = row?.profile_json && typeof row.profile_json === "object" ? { ...row.profile_json } : {};
  const local = readProfileFromStorage();
  const ownerId = getStoredProfileOwnerId();

  const remoteHasProgress = !isEmptyRemoteProfile(remote);
  const canPromoteLocal =
    !remoteHasProgress &&
    !isDefaultProfile(local) &&
    (ownerId === null || ownerId === userId);

  const profileJson = canPromoteLocal ? { ...local } : remote;
  if (email) profileJson.loginEmail = email;
  if (canPromoteLocal) profileJson.savedAt = Date.now();
  return { profileJson, promoted: canPromoteLocal };
}

/**
 * After signup upsert, claim ownership of promoted guest progress locally (no second cloud write).
 */
export function claimPromotedSignupProfile(userId, profileJson) {
  if (!userId || !profileJson || typeof profileJson !== "object") return;
  saveProfile(profileJson, { bumpTimestamp: false, skipCloudSync: true, ownerUserId: userId });
}
