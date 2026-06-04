import {
  bannerStyleFor,
  frameClassFor,
  renderAvatarPreview,
} from "./cosmeticArt.js";

const LOADING_MS = 4000;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** @param {{ username: string, cosmetics: { equipped?: Record<string, string> } }} player */
export function buildPvpPlayerShowcaseHtml(player) {
  const { username, cosmetics } = player;
  const equipped = cosmetics?.equipped || {};
  return `
    <div class="pvp-loading__player">
      <div class="profile-showcase pvp-loading__showcase">
        <div class="profile-showcase__banner" style="background:${bannerStyleFor(equipped.banner)}"></div>
        <div class="profile-showcase__hero pvp-loading__hero">
          <div class="profile-avatar-stack ${frameClassFor(equipped.frame)}">
            <div class="profile-avatar-inner" aria-hidden="true">${renderAvatarPreview(equipped.avatar)}</div>
          </div>
        </div>
      </div>
      <p class="pvp-loading__name">${escapeHtml(username)}</p>
    </div>`;
}

/**
 * @param {HTMLElement} root
 * @param {{ local: { username: string, cosmetics: object }, opponent: { username: string, cosmetics: object } }} players
 */
export function showPvpMatchLoading(root, players) {
  root.innerHTML = `
    <div class="pvp-loading" role="dialog" aria-modal="true" aria-labelledby="pvp-loading-title">
      <p id="pvp-loading-title" class="pvp-loading__title">Match starting</p>
      <div class="pvp-loading__players">
        ${buildPvpPlayerShowcaseHtml(players.local)}
        <div class="pvp-loading__vs" aria-hidden="true">VS</div>
        ${buildPvpPlayerShowcaseHtml(players.opponent)}
      </div>
    </div>`;

  return new Promise((resolve) => {
    setTimeout(resolve, LOADING_MS);
  });
}
