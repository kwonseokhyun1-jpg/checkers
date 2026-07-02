/** Local guest play — Adventure on this device without signing in. */

const GUEST_MODE_KEY = "arcane_checkers_guest_mode_v1";

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
