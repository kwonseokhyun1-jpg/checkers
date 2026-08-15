/** Local guest play — Adventure on this device without signing in. */

import { getCurrentUser } from "./auth.js";

const GUEST_MODE_KEY = "arcane_checkers_guest_mode_v1";

/** Shown on locked / guest-only nav tabs to encourage account creation. */
export const GUEST_SIGN_IN_NUDGE_PVP = "Create an account to save progress / play PvP";
export const GUEST_SIGN_IN_NUDGE_SAVE = "Create an account to save progress";

/** Guest who chose local play and has not signed in this session. */
export function isGuestPlayer() {
  return isGuestMode() && !getCurrentUser();
}

export function isGuestMode() {
  try {
    return localStorage.getItem(GUEST_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function enterGuestMode() {
  try {
    localStorage.setItem(GUEST_MODE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearGuestMode() {
  try {
    localStorage.removeItem(GUEST_MODE_KEY);
  } catch {
    /* ignore */
  }
}
