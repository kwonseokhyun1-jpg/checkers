/**
 * Settings panel HTML + bindings for Profile tab.
 */

import { getSettings, saveSettings } from "./settings.js";
import { refreshAudioFromSettings } from "./audio.js";

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
      <h3 class="settings-panel__heading">Settings</h3>
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

export function bindSettingsPanel(root, { onSignOut } = {}) {
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
