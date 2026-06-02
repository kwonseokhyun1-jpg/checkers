import {
  initAuth,
  signIn,
  signUp,
  signOut,
  onAuthChange,
  getCurrentUser,
  isAuthAvailable,
} from "./auth.js";
import { pullCloudProfile } from "./cloudProfile.js";

/**
 * @param {object} opts
 * @param {HTMLElement} opts.authBtn
 * @param {HTMLElement} opts.modal
 * @param {() => void} opts.onSignedIn
 */
export function initAuthUI({ authBtn, modal, onSignedIn }) {
  if (!authBtn || !modal) return;

  const form = modal.querySelector("#auth-form");
  const title = modal.querySelector("#auth-modal-title");
  const toggle = modal.querySelector("#auth-toggle-mode");
  const errorEl = modal.querySelector("#auth-error");
  const closeBtn = modal.querySelector("#auth-close");
  const backdrop = modal.querySelector(".auth-modal-backdrop");

  let mode = "signin";

  function setError(msg) {
    if (errorEl) errorEl.textContent = msg || "";
  }

  function open(modeOverride) {
    if (!isAuthAvailable()) {
      setError("Add Supabase anon key in js/supabaseConfig.js");
      modal.classList.remove("hidden");
      return;
    }
    mode = modeOverride || mode;
    if (title) title.textContent = mode === "signup" ? "Create account" : "Sign in";
    if (toggle) toggle.textContent = mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up";
    setError("");
    modal.classList.remove("hidden");
  }

  function close() {
    modal.classList.add("hidden");
    setError("");
  }

  function updateHeaderBtn(user) {
    if (!authBtn) return;
    if (!isAuthAvailable()) {
      authBtn.textContent = "Setup cloud";
      authBtn.title = "Configure Supabase";
      return;
    }
    if (user) {
      const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "Account";
      authBtn.textContent = name;
      authBtn.title = "Sign out";
    } else {
      authBtn.textContent = "Sign in";
      authBtn.title = "Sign in or sign up";
    }
  }

  authBtn.addEventListener("click", async () => {
    const user = getCurrentUser();
    if (user) {
      await signOut();
      return;
    }
    open("signin");
  });

  toggle?.addEventListener("click", (e) => {
    e.preventDefault();
    mode = mode === "signup" ? "signin" : "signup";
    open(mode);
  });

  closeBtn?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    const email = form.querySelector("#auth-email")?.value?.trim();
    const password = form.querySelector("#auth-password")?.value;
    const displayName = form.querySelector("#auth-display-name")?.value?.trim();
    if (!email || !password) {
      setError("Email and password required.");
      return;
    }
    try {
      if (mode === "signup") {
        await signUp(email, password, displayName);
        setError("Check your email to confirm your account (if confirmation is enabled).");
      } else {
        await signIn(email, password);
        close();
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  });

  onAuthChange(async (user) => {
    updateHeaderBtn(user);
    if (user) {
      try {
        await pullCloudProfile();
        onSignedIn?.();
      } catch (err) {
        console.warn("Profile sync failed", err);
      }
      close();
    }
  });

  initAuth().then(updateHeaderBtn);
  return { open, close };
}
