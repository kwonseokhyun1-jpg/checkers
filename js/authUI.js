import {
  getCurrentUser,
  initAuth,
  signIn,
  signUp,
  signOut,
  onAuthChange,
  isAuthAvailable,
  fetchProfileRow,
  isUsernameAvailable,
  suggestAvailableUsername,
  validateUsernameFormat,
  USERNAME_PATTERN,
} from "./auth.js";
import { upsertProfileRow } from "./auth.js";
import { pullCloudProfile } from "./cloudProfile.js";
import { dismissTutorial } from "./tutorial.js";

const USERNAME_RE = USERNAME_PATTERN;

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
  const usernameHint = modal.querySelector("#auth-username-hint");
  const closeBtn = modal.querySelector("#auth-close");
  const backdrop = modal.querySelector(".auth-modal-backdrop");
  const submitBtn = form?.querySelector('button[type="submit"]');

  let mode = "signin";
  let usernameCheckTimer = null;

  function syncAuthFields() {
    form?.querySelectorAll(".auth-field-signup").forEach((el) => {
      el.classList.toggle("hidden", mode !== "signup");
    });
    const idInput = form?.querySelector("#auth-identifier");
    const idLabel = form?.querySelector('label[for="auth-identifier"]');
    if (idLabel) idLabel.textContent = mode === "signup" ? "Email" : "Username or email";
    if (idInput) {
      idInput.placeholder = mode === "signup" ? "you@email.com" : "username or email";
      idInput.type = mode === "signup" ? "email" : "text";
      idInput.autocomplete = mode === "signup" ? "email" : "username";
    }
    if (submitBtn) submitBtn.textContent = mode === "signup" ? "Create account" : "Sign in";
    if (usernameHint) usernameHint.textContent = "";
    usernameHint?.classList.remove("auth-username-hint--ok", "auth-username-hint--bad");
  }

  function setError(msg) {
    if (errorEl) errorEl.textContent = msg || "";
  }

  function setUsernameHint(msg, state = "") {
    if (!usernameHint) return;
    usernameHint.textContent = msg || "";
    usernameHint.classList.remove("auth-username-hint--ok", "auth-username-hint--bad");
    if (state === "ok") usernameHint.classList.add("auth-username-hint--ok");
    if (state === "bad") usernameHint.classList.add("auth-username-hint--bad");
  }

  async function scheduleUsernameCheck() {
    if (mode !== "signup") return;
    const username = form?.querySelector("#auth-username")?.value?.trim();
    if (!username) {
      setUsernameHint("");
      return;
    }
    if (!USERNAME_RE.test(username)) {
      setUsernameHint("3–24 letters, numbers, or underscore", "bad");
      return;
    }
    setUsernameHint("Checking…");
    const available = await isUsernameAvailable(username);
    if (!available) {
      const alt = await suggestAvailableUsername(username);
      setUsernameHint(
        alt ? `Taken — try "${alt}"` : "That username is taken",
        "bad"
      );
      if (alt && usernameHint) {
        usernameHint.dataset.suggestion = alt;
      }
      return;
    }
    if (usernameHint) delete usernameHint.dataset.suggestion;
    setUsernameHint("Available", "ok");
  }

  function open(modeOverride) {
    dismissTutorial({ persist: true });
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
    setUsernameHint("");
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

  const usernameInput = form?.querySelector("#auth-username");
  usernameInput?.addEventListener("input", () => {
    clearTimeout(usernameCheckTimer);
    usernameCheckTimer = setTimeout(() => {
      scheduleUsernameCheck().catch(() => setUsernameHint(""));
    }, 350);
  });

  usernameHint?.addEventListener("click", () => {
    const alt = usernameHint?.dataset?.suggestion;
    if (!alt || !usernameInput) return;
    usernameInput.value = alt;
    delete usernameHint.dataset.suggestion;
    scheduleUsernameCheck().catch(() => {});
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    setError("");
    const identifier = form.querySelector("#auth-identifier")?.value?.trim();
    const username = form.querySelector("#auth-username")?.value?.trim();
    const password = form.querySelector("#auth-password")?.value;
    if (!identifier || !password) {
      setError(mode === "signup" ? "Email and password required." : "Username or email and password required.");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

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

        let chosenUsername = username;
        if (!(await isUsernameAvailable(chosenUsername))) {
          const alt = await suggestAvailableUsername(chosenUsername);
          if (alt) {
            setError(`"${chosenUsername}" is taken. Try "${alt}" or tap the hint below.`);
            setUsernameHint(`Tap to use "${alt}"`, "bad");
            if (usernameHint) usernameHint.dataset.suggestion = alt;
            return;
          }
          setError(`Username "${chosenUsername}" is already taken. Pick another.`);
          return;
        }

        const data = await signUp(identifier, password, chosenUsername, chosenUsername);
        const user = data.session?.user ?? getCurrentUser();

        if (user) {
          const existing = await fetchProfileRow(user.id);
          const profileJson =
            existing?.profile_json && typeof existing.profile_json === "object"
              ? { ...existing.profile_json }
              : {};
          profileJson.loginEmail = identifier.toLowerCase();

          try {
            await upsertProfileRow(user.id, {
              username: chosenUsername,
              display_name: chosenUsername,
              profile_json: profileJson,
            });
          } catch (profileErr) {
            const code = profileErr?.code || profileErr?.details?.code;
            if (code === "23505") {
              const alt = await suggestAvailableUsername(chosenUsername);
              setError(
                alt
                  ? `Account created but "${chosenUsername}" was taken. Sign in and change your name to "${alt}", or try sign up again with that username.`
                  : "Account created but that username was just taken. Sign in with your email and pick another name in Profile."
              );
              mode = "signin";
              open("signin");
              return;
            }
            throw profileErr;
          }

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
      const user = getCurrentUser();
      if (!user) {
        setError("Sign-in failed — no session returned. Try again or confirm your email.");
        return;
      }
      try {
        await pullCloudProfile();
        onSignedIn?.();
      } catch (err) {
        console.warn("Profile sync after sign-in failed", err);
      }
      updateHeaderBtn(user);
      close();
    } catch (err) {
      let msg = err?.message || "Authentication failed";
      if (
        msg.includes("Database error saving new user") ||
        msg.includes("username_taken") ||
        err?.code === "23505"
      ) {
        const alt = username && USERNAME_RE.test(username) ? await suggestAvailableUsername(username) : null;
        msg = alt
          ? `Sign-up failed (username conflict). Try "${alt}" instead.`
          : "Sign-up failed on the server. Try a different username, or sign in if you already have an account.";
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
    } finally {
      if (submitBtn) submitBtn.disabled = false;
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
