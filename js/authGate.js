import { getCurrentUser, isAuthAvailable } from "./auth.js";

/**
 * Full-screen gate shown until the player signs in.
 * @param {{ onSignIn: () => void, onSignUp: () => void }} handlers
 */
export function initAuthGate({ onSignIn, onSignUp }) {
  const gate = document.getElementById("auth-gate");
  if (!gate) return { show: () => {}, hide: () => {}, sync: () => {} };

  const signInBtn = gate.querySelector("#auth-gate-signin");
  const signUpBtn = gate.querySelector("#auth-gate-signup");
  const notice = gate.querySelector("#auth-gate-notice");

  signInBtn?.addEventListener("click", () => onSignIn?.());
  signUpBtn?.addEventListener("click", () => onSignUp?.());

  function show() {
    if (!isAuthAvailable()) {
      if (notice) {
        notice.textContent = "Cloud sign-in is not configured. Add your Supabase keys in js/supabaseConfig.js.";
      }
    } else if (notice) {
      notice.textContent = "Create an account to play. Your decks, stars, and collection sync to the cloud.";
    }
    gate.classList.remove("hidden");
    document.body.classList.add("auth-gate-active");
  }

  function hide() {
    gate.classList.add("hidden");
    document.body.classList.remove("auth-gate-active");
  }

  function sync() {
    if (getCurrentUser()) hide();
    else show();
  }

  return { show, hide, sync };
}

export function requiresAuthGate() {
  return isAuthAvailable() && !getCurrentUser();
}
