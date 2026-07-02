/**
 * Settings page HTML + bindings.
 */

import { getSettings, saveSettings } from "./settings.js";
import { refreshAudioFromSettings } from "./audio.js";
import {
  canChangeUsername,
  deleteAccount,
  fetchProfileRow,
  getCurrentUser,
  isAuthAvailable,
  isUsernameAvailableForUser,
  signOut,
  suggestAvailableUsername,
  updateUsername,
  validateUsernameFormat,
} from "./auth.js";
import { mobileConfirm } from "./mobileConfirm.js";

export const PRIVACY_POLICY_URL = "https://sites.google.com/view/arcane-checkers/home";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function settingsSectionHtml() {
  const s = getSettings();
  return `
    <div class="settings-panel">
      <section class="settings-group" aria-labelledby="settings-audio-heading">
        <h4 id="settings-audio-heading" class="settings-group__title">Audio</h4>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Music</span>
          <input type="checkbox" id="settings-music" ${s.musicEnabled ? "checked" : ""} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <label class="settings-range">
          <span class="settings-range__label">Music volume</span>
          <input type="range" id="settings-music-volume" min="0" max="100" value="${Math.round(s.musicVolume * 100)}" />
        </label>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Sound effects</span>
          <input type="checkbox" id="settings-sfx" ${s.sfxEnabled ? "checked" : ""} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <label class="settings-range">
          <span class="settings-range__label">SFX volume</span>
          <input type="range" id="settings-sfx-volume" min="0" max="100" value="${Math.round(s.sfxVolume * 100)}" />
        </label>
      </section>
      <section class="settings-group" aria-labelledby="settings-haptics-heading">
        <h4 id="settings-haptics-heading" class="settings-group__title">Haptics</h4>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Vibration (mobile app)</span>
          <input type="checkbox" id="settings-haptics" ${s.hapticsEnabled ? "checked" : ""} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <p class="settings-hint muted">Haptics work in the native app only.</p>
      </section>
      <p class="settings-credits muted">Music &amp; SFX: royalty-free placeholders. See <code>assets/audio/LICENSES.md</code>.</p>
    </div>`;
}

function legalSectionHtml() {
  return `
    <section class="settings-group" aria-labelledby="settings-legal-heading">
      <h4 id="settings-legal-heading" class="settings-group__title">Legal</h4>
      <p class="settings-legal">
        <a
          class="settings-legal__link"
          href="${PRIVACY_POLICY_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >Privacy policy</a>
      </p>
    </section>`;
}

function accountSectionHtml({ signedIn, username, email }) {
  if (!signedIn) {
    return `
      <div class="profile-account profile-account--guest">
        <p class="muted">Sign in from the header to save progress and set a username.</p>
      </div>`;
  }
  return `
    <div class="profile-account">
      <p class="profile-account__email muted">${escapeHtml(email)}</p>
      <div class="profile-username-summary">
        <span class="label-sm">Username</span>
        <p id="settings-username-display" class="profile-username-display">${escapeHtml(username) || "—"}</p>
        <button type="button" class="btn-text profile-username-change" id="settings-username-change">Change username</button>
      </div>
      <div id="settings-username-editor" class="profile-username-editor hidden" hidden>
        <label class="label-sm" for="settings-username">New username</label>
        <div class="profile-username-row">
          <input
            type="text"
            id="settings-username"
            class="input-text"
            autocomplete="username"
            minlength="3"
            maxlength="24"
            pattern="[A-Za-z0-9_]{3,24}"
            value="${escapeHtml(username)}"
            placeholder="Your in-game name"
          />
          <button type="button" class="btn-primary" id="settings-username-save">Save</button>
        </div>
        <button type="button" class="btn-text profile-username-cancel" id="settings-username-cancel">Cancel</button>
        <p id="settings-username-hint" class="auth-username-hint" aria-live="polite"></p>
        <p id="settings-username-status" class="profile-username-status" role="status"></p>
      </div>
      <button type="button" class="btn-text profile-sign-out" id="settings-sign-out">Sign out</button>
      <div class="profile-delete-account">
        <button type="button" class="btn-text profile-delete-account__btn" id="settings-delete-account">Delete account</button>
        <p class="profile-delete-account__hint muted">Permanently removes your account, cloud save, and username. This cannot be undone.</p>
        <p id="settings-delete-account-status" class="profile-delete-account__status" role="status"></p>
      </div>
    </div>`;
}

export function bindSettingsPanel(root) {
  const music = root.querySelector("#settings-music");
  const musicVol = root.querySelector("#settings-music-volume");
  const sfx = root.querySelector("#settings-sfx");
  const sfxVol = root.querySelector("#settings-sfx-volume");
  const haptics = root.querySelector("#settings-haptics");

  const apply = (patch) => {
    saveSettings(patch);
    refreshAudioFromSettings();
  };

  music?.addEventListener("change", () => apply({ musicEnabled: music.checked }));
  musicVol?.addEventListener("input", () => apply({ musicVolume: Number(musicVol.value) / 100 }));
  sfx?.addEventListener("change", () => apply({ sfxEnabled: sfx.checked }));
  sfxVol?.addEventListener("input", () => apply({ sfxVolume: Number(sfxVol.value) / 100 }));
  haptics?.addEventListener("change", () => apply({ hapticsEnabled: haptics.checked }));
}

export function renderSettingsTab(root, { onUsernameChanged } = {}) {
  if (!root) return;

  const user = getCurrentUser();
  const signedIn = isAuthAvailable() && !!user;

  root.innerHTML = `
    <section class="panel game-panel settings-page-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Settings</h2>
        <p class="panel-head__desc">Audio, haptics, and account preferences.</p>
      </header>
      ${settingsSectionHtml()}
      ${legalSectionHtml()}
      <section class="settings-group settings-account-section" aria-labelledby="settings-account-heading">
        <h4 id="settings-account-heading" class="settings-group__title">Account</h4>
        ${accountSectionHtml({ signedIn, username: "", email: user?.email || "" })}
      </section>
    </section>
  `;

  bindSettingsPanel(root);

  root.querySelector("#settings-sign-out")?.addEventListener("click", () => {
    void signOut();
  });

  const deleteBtn = root.querySelector("#settings-delete-account");
  const deleteStatus = root.querySelector("#settings-delete-account-status");
  deleteBtn?.addEventListener("click", async () => {
    const confirmed = await mobileConfirm(
      "This permanently deletes your account, cloud save, decks, and username. You will need a new account to play again.",
      {
        title: "Delete account?",
        confirmLabel: "Delete account",
        cancelLabel: "Keep account",
        destructive: true,
      }
    );
    if (!confirmed) return;

    deleteStatus.textContent = "";
    deleteStatus.classList.remove("profile-delete-account__status--error");
    deleteBtn.disabled = true;
    try {
      await deleteAccount();
    } catch (e) {
      deleteStatus.textContent = e.message || "Could not delete account";
      deleteStatus.classList.add("profile-delete-account__status--error");
      deleteBtn.disabled = false;
    }
  });

  if (!signedIn) return;

  const usernameDisplay = root.querySelector("#settings-username-display");
  const usernameEditor = root.querySelector("#settings-username-editor");
  const changeBtn = root.querySelector("#settings-username-change");
  const cancelBtn = root.querySelector("#settings-username-cancel");
  const usernameInput = root.querySelector("#settings-username");
  const usernameHint = root.querySelector("#settings-username-hint");
  const usernameStatus = root.querySelector("#settings-username-status");
  const saveBtn = root.querySelector("#settings-username-save");
  let usernameCheckTimer = null;
  let savedUsername = "";
  let profileRow = null;

  const setUsernameDisplay = (name) => {
    if (usernameDisplay) usernameDisplay.textContent = name || "—";
  };

  const setHint = (msg, state = "") => {
    if (!usernameHint) return;
    usernameHint.textContent = msg || "";
    usernameHint.classList.remove("auth-username-hint--ok", "auth-username-hint--bad");
    if (state === "ok") usernameHint.classList.add("auth-username-hint--ok");
    if (state === "bad") usernameHint.classList.add("auth-username-hint--bad");
  };

  const setStatus = (msg, isError = false) => {
    if (!usernameStatus) return;
    usernameStatus.textContent = msg || "";
    usernameStatus.classList.toggle("profile-username-status--error", isError);
  };

  const scheduleUsernameCheck = () => {
    clearTimeout(usernameCheckTimer);
    usernameCheckTimer = setTimeout(async () => {
      const name = usernameInput?.value?.trim() || "";
      if (!name) {
        setHint("");
        return;
      }
      const formatErr = validateUsernameFormat(name);
      if (formatErr) {
        setHint(formatErr, "bad");
        return;
      }
      if (name.toLowerCase() === savedUsername.toLowerCase()) {
        setHint("Current username", "ok");
        return;
      }
      setHint("Checking…");
      try {
        const available = await isUsernameAvailableForUser(name, user.id);
        if (!available) {
          const alt = await suggestAvailableUsername(name);
          setHint(alt ? `Taken — try "${alt}"` : "That username is taken", "bad");
          if (alt && usernameHint) usernameHint.dataset.suggestion = alt;
          return;
        }
        if (usernameHint) delete usernameHint.dataset.suggestion;
        setHint("Available", "ok");
      } catch {
        setHint("");
      }
    }, 350);
  };

  const showUsernameEditor = (show) => {
    usernameEditor?.classList.toggle("hidden", !show);
    if (usernameEditor) usernameEditor.hidden = !show;
    changeBtn?.classList.toggle("hidden", show);
    if (show) {
      if (usernameInput) {
        usernameInput.value = savedUsername;
        usernameInput.focus();
        usernameInput.select();
      }
      setStatus("");
      scheduleUsernameCheck();
    } else if (usernameInput) {
      usernameInput.value = savedUsername;
      setHint("");
      setStatus("");
    }
  };

  usernameHint?.addEventListener("click", () => {
    const alt = usernameHint?.dataset?.suggestion;
    if (!alt || !usernameInput) return;
    usernameInput.value = alt;
    delete usernameHint.dataset.suggestion;
    scheduleUsernameCheck();
  });

  usernameInput?.addEventListener("input", scheduleUsernameCheck);
  changeBtn?.addEventListener("click", () => showUsernameEditor(true));
  cancelBtn?.addEventListener("click", () => showUsernameEditor(false));

  void (async () => {
    try {
      profileRow = await fetchProfileRow(user.id);
      savedUsername = profileRow?.username || user.user_metadata?.display_name || "";
      setUsernameDisplay(savedUsername);
      onUsernameChanged?.(savedUsername);
      if (usernameInput && savedUsername) usernameInput.value = savedUsername;
      const cooldown = canChangeUsername(profileRow);
      if (!cooldown.ok) setHint(cooldown.message, "bad");
    } catch (e) {
      console.warn("Could not load profile username", e);
    }
  })();

  saveBtn?.addEventListener("click", async () => {
    const name = usernameInput?.value?.trim() || "";
    setStatus("");
    saveBtn.disabled = true;
    try {
      const cooldown = canChangeUsername(profileRow);
      if (!cooldown.ok) throw new Error(cooldown.message);
      const updated = await updateUsername(name);
      profileRow = await fetchProfileRow(user.id);
      savedUsername = updated;
      setUsernameDisplay(savedUsername);
      showUsernameEditor(false);
      onUsernameChanged?.(updated);
    } catch (e) {
      setStatus(e.message || "Could not save username", true);
    } finally {
      saveBtn.disabled = false;
    }
  });
}
