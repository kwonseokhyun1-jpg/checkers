import { getCurrentUser, fetchProfileRow, upsertProfileRow, isAuthAvailable } from "./auth.js";
import { loadProfile, saveProfile, repairProfile } from "./storage.js";

let cloudSaveTimer = null;

export async function pullCloudProfile() {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable()) return null;

  const row = await fetchProfileRow(user.id);
  if (!row?.profile_json || typeof row.profile_json !== "object") return null;

  const local = loadProfile();
  const remote = row.profile_json;
  const remoteTime = remote.savedAt || 0;
  const localTime = local.savedAt || 0;

  if (remoteTime >= localTime) {
    repairProfile(remote);
    saveProfile(remote);
    return remote;
  }
  return local;
}

export function scheduleCloudSave(profile) {
  const user = getCurrentUser();
  if (!user || !isAuthAvailable()) return;

  profile.savedAt = Date.now();
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
