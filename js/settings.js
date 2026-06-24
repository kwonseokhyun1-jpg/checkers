/**
 * Player settings — persisted in localStorage.
 */

const SETTINGS_KEY = "arcaneCheckersSettings_v1";

const DEFAULTS = {
  musicEnabled: true,
  musicVolume: 0.45,
  sfxEnabled: true,
  sfxVolume: 0.7,
  hapticsEnabled: true,
};

/** @type {typeof DEFAULTS} */
let cache = { ...DEFAULTS };

function load() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function getSettings() {
  return { ...cache };
}

export function saveSettings(patch) {
  cache = { ...cache, ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(cache));
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent("arcane-settings-changed", { detail: getSettings() }));
  return getSettings();
}

export function initSettings() {
  cache = load();
  return getSettings();
}
