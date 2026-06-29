import { fetchProfileRow } from "./auth.js";
import { normalizeCosmetics } from "./cosmetics.js";
import {
  bannerStyleFor,
  frameClassFor,
  renderAvatarPreview,
} from "./cosmeticArt.js";
import { equippedTitleTagHtml } from "./mageTitles.js";
import { getProfileStats } from "./profileStats.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Compact framed avatar for PvP room rows.
 * @param {{ equipped?: Record<string, string> }} cosmetics
 * @param {string} displayName
 * @param {{ clickable?: boolean, userId?: string }} [opts]
 */
export function buildRoomHostAvatarHtml(cosmetics, displayName, { clickable = false, userId = "" } = {}) {
  const equipped = cosmetics?.equipped || {};
  const initial = (displayName || "P").charAt(0).toUpperCase();
  const inner =
    renderAvatarPreview(equipped.avatar) ||
    `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
  const frameClass = frameClassFor(equipped.frame);
  const avatarMarkup = `<span class="profile-avatar-stack ${frameClass}"><span class="profile-avatar-inner">${inner}</span></span>`;

  if (clickable && userId) {
    return `<button type="button" class="pvp-room-host-profile" data-view-profile="${escapeHtml(userId)}" data-profile-name="${escapeHtml(displayName)}" aria-label="View ${escapeHtml(displayName)}'s profile">${avatarMarkup}</button>`;
  }

  return `<span class="pvp-room-host-profile pvp-room-host-profile--static" aria-hidden="true">${avatarMarkup}</span>`;
}

function publicProfileStatsHtml(stats) {
  const cards = [
    { key: "pvp", label: "PvP wins", value: stats.pvpWins },
    { key: "adventure", label: "Floors cleared", value: stats.adventureFloorsCleared },
    { key: "spells", label: "Spells played", value: stats.spellsPlayed },
  ];
  return `
    <div class="profile-hero-stats public-profile-modal__stats" aria-label="Player statistics">
      ${cards
        .map(
          (card) => `
        <article class="profile-stat-card profile-stat-card--${card.key}">
          <span class="profile-stat-card__label">${escapeHtml(card.label)}</span>
          <span class="profile-stat-card__value">${card.value}</span>
        </article>`
        )
        .join("")}
    </div>`;
}

function publicProfileDialogHtml({ username, cosmetics, stats }) {
  const equipped = cosmetics.equipped || {};
  const initial = (username || "P").charAt(0).toUpperCase();
  const avatarInner =
    renderAvatarPreview(equipped.avatar) ||
    `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
  const titleHtml = equippedTitleTagHtml({ cosmetics }, { compact: false });

  return `
    <div class="public-profile-modal" role="dialog" aria-modal="true" aria-labelledby="public-profile-title">
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <div class="profile-showcase public-profile-modal__showcase">
          <div class="profile-showcase__banner" style="background:${bannerStyleFor(equipped.banner)}"></div>
          <div class="profile-showcase__hero public-profile-modal__hero">
            <div class="profile-avatar-stack ${frameClassFor(equipped.frame)}">
              <div class="profile-avatar-inner" aria-hidden="true">${avatarInner}</div>
            </div>
            <div class="public-profile-modal__identity">
              <h2 id="public-profile-title" class="public-profile-modal__name">${escapeHtml(username)}</h2>
              ${titleHtml ? `<div class="public-profile-modal__title">${titleHtml}</div>` : ""}
            </div>
          </div>
        </div>
        ${publicProfileStatsHtml(stats)}
      </div>
    </div>`;
}

let activeModal = null;

function closePublicProfileModal() {
  activeModal?.remove();
  activeModal = null;
  document.body.classList.remove("public-profile-modal-open");
}

function bindPublicProfileModal(modal) {
  modal.querySelectorAll("[data-close-public-profile]").forEach((el) => {
    el.addEventListener("click", closePublicProfileModal);
  });
  const onKey = (e) => {
    if (e.key === "Escape") {
      closePublicProfileModal();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

/**
 * @param {string} userId
 * @param {{ fallbackName?: string }} [opts]
 */
export async function openPublicProfileModal(userId, { fallbackName = "Player" } = {}) {
  if (!userId) return;

  closePublicProfileModal();

  const loading = document.createElement("div");
  loading.className = "public-profile-modal public-profile-modal--loading";
  loading.setAttribute("role", "dialog");
  loading.setAttribute("aria-modal", "true");
  loading.setAttribute("aria-label", "Loading profile");
  loading.innerHTML = `
    <div class="public-profile-modal__backdrop"></div>
    <div class="public-profile-modal__dialog panel game-panel">
      <p class="public-profile-modal__loading muted">Loading profile…</p>
    </div>`;
  document.body.appendChild(loading);
  document.body.classList.add("public-profile-modal-open");
  activeModal = loading;

  try {
    const row = await fetchProfileRow(userId);
    const profileJson = row?.profile_json && typeof row.profile_json === "object" ? row.profile_json : {};
    const cosmetics = normalizeCosmetics(profileJson.cosmetics);
    const username =
      (row?.username && String(row.username).trim()) ||
      (row?.display_name && String(row.display_name).trim()) ||
      fallbackName;
    const stats = getProfileStats({
      pvpWins: profileJson.pvpWins,
      adventure: profileJson.adventure,
      spellsPlayed: profileJson.spellsPlayed,
    });

    loading.remove();
    const modal = document.createElement("div");
    modal.innerHTML = publicProfileDialogHtml({ username, cosmetics, stats });
    const el = modal.firstElementChild;
    document.body.appendChild(el);
    activeModal = el;
    bindPublicProfileModal(el);
  } catch {
    loading.innerHTML = `
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <p class="public-profile-modal__loading muted">Could not load this profile.</p>
      </div>`;
    bindPublicProfileModal(loading);
  }
}

/** @param {ParentNode} container */
export function bindPublicProfileViewButtons(container) {
  container?.querySelectorAll("[data-view-profile]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const userId = btn.getAttribute("data-view-profile");
      const fallbackName = btn.getAttribute("data-profile-name") || "Player";
      if (userId) void openPublicProfileModal(userId, { fallbackName });
    });
  });
}
