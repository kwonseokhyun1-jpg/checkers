import {
  getCurrentUser,
  initAuth,
  signIn,
  signUp,
  isUsernameAvailable,
  signOut,
  onAuthChange,
  isAuthAvailable,
  fetchProfileRow,
} from "./auth.js";
import { upsertProfileRow } from "./auth.js";
import { pullCloudProfile } from "./cloudProfile.js";

const USERNAME_RE = /^[A-Za-z0-9_]{3,24}$/;

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
    if (idInput) {
      idInput.placeholder = mode === "signup" ? "you@email.com" : "username or email";
      idInput.type = mode === "signup" ? "email" : "text";
      idInput.autocomplete = mode === "signup" ? "email" : "username";
    }
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
    if (!identifier || !password) {
      setError("Username or email and password required.");
      return;
    }

    try {
      if (mode === "signup") {
        if (!identifier.includes("@")) {
          setError("Use your email address to sign up.");
          return;
        }
        if (!username || !USERNAME_RE.test(username)) {
          setError("Choose a username (3–24 letters, numbers, underscore).");
          return;
        }

        const available = await isUsernameAvailable(username);
        if (!available) {
          setError(`Username "${username}" is already taken. Pick another.`);
          return;
        }

        const data = await signUp(identifier, password, username, username);
        const user = data.session?.user ?? getCurrentUser();

        if (user) {
          const existing = await fetchProfileRow(user.id);
          const profileJson =
            existing?.profile_json && typeof existing.profile_json === "object"
              ? { ...existing.profile_json }
              : {};
          profileJson.loginEmail = identifier.toLowerCase();

          await upsertProfileRow(user.id, {
            username,
            display_name: username,
            profile_json: profileJson,
          });

          try {
            await pullCloudProfile();
            onSignedIn?.();
          } catch (err) {
            console.warn("Profile sync after signup failed", err);
          }
          close();
          return;
        }

        setError("Account created. Check your email to confirm, then sign in.");
        mode = "signin";
        open("signin");
        return;
      }

      await signIn(identifier, password);
      close();
    } catch (err) {
      let msg = err?.message || "Authentication failed";
      if (
        msg.includes("Database error saving new user") ||
        msg.includes("username_taken") ||
        err?.code === "23505"
      ) {
        msg =
          "Could not create your account. That username may already be taken, or the database needs an update — run supabase/fix_signup_trigger.sql in the Supabase SQL Editor, then try again.";
      } else if (msg.includes("over_email_send_rate_limit") || msg.includes("rate limit")) {
        msg = "Too many sign-up attempts. Wait a few minutes or sign in with an existing account.";
      } else if (msg.includes("User already registered")) {
        msg = "That email is already registered. Try Sign in instead.";
      }
      if (msg.includes("Invalid login credentials")) {
        setError("Wrong email/username or password.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Confirm your email first (check inbox), or disable email confirmation in Supabase for testing.");
      } else {
        setError(msg);
      }
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
