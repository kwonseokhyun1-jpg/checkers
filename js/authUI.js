import {
  getCurrentUser,
  initAuth,
  signIn,
  signUp,
  signOut,
  onAuthChange,
  isAuthAvailable,
} from "./auth.js";
import { upsertProfileRow } from "./auth.js";
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

  function syncAuthFields() {
    form?.querySelectorAll(".auth-field-signup").forEach((el) => {
      el.classList.toggle("hidden", mode !== "signup");
    });
    const idInput = form?.querySelector("#auth-identifier");
    if (idInput) idInput.placeholder = mode === "signup" ? "you@email.com" : "username or email";
  }

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
    syncAuthFields();
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
    const identifier = form.querySelector("#auth-identifier")?.value?.trim();
    const username = form.querySelector("#auth-username")?.value?.trim();
    const password = form.querySelector("#auth-password")?.value;
    const displayName = form.querySelector("#auth-display-name")?.value?.trim();
    if (!identifier || !password) {
      setError("Username or email and password required.");
      return;
    }
    try {
      if (mode === "signup") {
        if (!username || username.length < 3) {
        setError("Choose a username (3–24 letters, numbers, underscore).");
        return;
      }
        await signUp(identifier, password, displayName, username);
        const user = getCurrentUser();
        if (user) {
          await upsertProfileRow(user.id, { username, display_name: displayName || username });
        }
        setError("Check your email to confirm your account (if confirmation is enabled).");
      } else {
        await signIn(identifier, password);
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
