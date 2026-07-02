import { getCurrentUser, isAuthAvailable } from "./auth.js";
import { isGuestMode } from "./guestMode.js";

/** Signed-in user or guest who chose to play locally. */
export function allowsAppAccess() {
  return Boolean(getCurrentUser()) || isGuestMode();
}

/**
 * Full-screen gate shown until the player signs in or continues as guest.
 * @param {{ onSignIn: () => void, onSignUp: () => void, onGuest?: () => void }} handlers
 */
export function initAuthGate({ onSignIn, onSignUp, onGuest }) {
  const gate = document.getElementById("auth-gate");
  if (!gate) return { show: () => {}, hide: () => {}, sync: () => {} };

  const signInBtn = gate.querySelector("#auth-gate-signin");
  const signUpBtn = gate.querySelector("#auth-gate-signup");
  const guestBtn = gate.querySelector("#auth-gate-guest");
  const notice = gate.querySelector("#auth-gate-notice");

  signInBtn?.addEventListener("click", () => onSignIn?.());
  signUpBtn?.addEventListener("click", () => onSignUp?.());
  guestBtn?.addEventListener("click", () => onGuest?.());

  function show() {
    if (!isAuthAvailable()) {
      if (notice) {
        notice.textContent = "Cloud sign-in is not configured. Add your Supabase keys in js/supabaseConfig.js.";
      }
    } else if (notice) {
      notice.textContent =
        "Create an account to sync decks, stars, and collection — or continue as guest to play Adventure on this device.";
    }
    gate.classList.remove("hidden");
    document.body.classList.add("auth-gate-active");
  }

  function hide() {
    gate.classList.add("hidden");
    document.body.classList.remove("auth-gate-active");
  }

  function sync() {
    if (allowsAppAccess()) hide();
    else show();
  }

  return { show, hide, sync };
}

export function requiresAuthGate() {
  return isAuthAvailable() && !allowsAppAccess();
}
