/**
 * Audio manager — hub + match music, SFX. Royalty-free placeholder assets in assets/audio/.
 */

import { getSettings } from "./settings.js";

const TRACKS = {
  hub: "assets/audio/background.m4a",
  match: "assets/audio/background.m4a",
};

const SFX = {
  tap: "assets/audio/sfx/tap.mp3",
  spell: "assets/audio/sfx/spell.mp3",
  capture: "assets/audio/sfx/capture.mp3",
  win: "assets/audio/sfx/win.mp3",
  chest: "assets/audio/sfx/chest.mp3",
};

let hubAudio = null;
let matchAudio = null;
let currentMode = "hub";
let unlocked = false;

function canPlay() {
  return typeof Audio !== "undefined";
}

function playOneShot(src, volume) {
  if (!canPlay() || !getSettings().sfxEnabled) return;
  try {
    const a = new Audio(src);
    a.volume = Math.max(0, Math.min(1, volume * getSettings().sfxVolume));
    a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}

function ensureTrack(name) {
  const src = TRACKS[name];
  if (!src || !canPlay()) return null;
  let audio = name === "hub" ? hubAudio : matchAudio;
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    if (name === "hub") hubAudio = audio;
    else matchAudio = audio;
  }
  return audio;
}

function applyMusicVolume(audio) {
  if (!audio) return;
  audio.volume = Math.max(0, Math.min(1, getSettings().musicVolume));
}

function pauseAllMusic() {
  hubAudio?.pause();
  matchAudio?.pause();
}

export function unlockAudio() {
  if (unlocked || !canPlay()) return;
  unlocked = true;
  [hubAudio, matchAudio].forEach((a) => {
    if (a) {
      a.play()
        .then(() => a.pause())
        .catch(() => {});
    }
  });
}

export function setAudioMode(mode) {
  currentMode = mode;
  if (!getSettings().musicEnabled) {
    pauseAllMusic();
    return;
  }
  const hub = ensureTrack("hub");
  const match = ensureTrack("match");
  if (mode === "match") {
    hub?.pause();
    if (match) {
      applyMusicVolume(match);
      match.play().catch(() => {});
    }
  } else {
    match?.pause();
    if (hub) {
      applyMusicVolume(hub);
      hub.play().catch(() => {});
    }
  }
}

export function refreshAudioFromSettings() {
  if (!getSettings().musicEnabled) {
    pauseAllMusic();
    return;
  }
  applyMusicVolume(hubAudio);
  applyMusicVolume(matchAudio);
  setAudioMode(currentMode);
}

export function initAudio() {
  if (!canPlay()) return;
  window.addEventListener("arcane-settings-changed", () => refreshAudioFromSettings());
  const unlock = () => {
    unlockAudio();
    if (getSettings().musicEnabled) setAudioMode(currentMode);
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

export function playSfx(name) {
  const src = SFX[name];
  if (!src) return;
  playOneShot(src, 1);
}

export const AudioSfx = {
  tap: () => playSfx("tap"),
  spell: () => playSfx("spell"),
  capture: () => playSfx("capture"),
  win: () => playSfx("win"),
  chest: () => playSfx("chest"),
};
