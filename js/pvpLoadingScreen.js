import {
  bannerStyleFor,
  frameClassFor,
  renderAvatarPreview,
} from "./cosmeticArt.js";
import { equippedTitleTagHtml } from "./mageTitles.js";

const LOADING_MS = 4000;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {{ username: string, cosmetics: { equipped?: Record<string, string> } }} player
 * @param {{ label?: string }} [opts]
 */
export function buildPvpPlayerShowcaseHtml(player, { label } = {}) {
  const { username, cosmetics } = player;
  const equipped = cosmetics?.equipped || {};
  const titleHtml = equippedTitleTagHtml({ cosmetics }, { compact: true });
  return `
    <article class="pvp-loading__card">
      <div class="profile-showcase pvp-loading__showcase">
        <div class="profile-showcase__banner" style="background:${bannerStyleFor(equipped.banner)}"></div>
        <div class="profile-showcase__hero pvp-loading__hero">
          <div class="profile-avatar-stack ${frameClassFor(equipped.frame)}">
            <div class="profile-avatar-inner" aria-hidden="true">${renderAvatarPreview(equipped.avatar)}</div>
          </div>
        </div>
      </div>
      <div class="pvp-loading__identity">
        ${label ? `<p class="pvp-loading__label">${escapeHtml(label)}</p>` : ""}
        <p class="pvp-loading__name">${escapeHtml(username)}</p>
        ${titleHtml ? `<div class="pvp-loading__mage-title">${titleHtml}</div>` : ""}
      </div>
    </article>`;
}

/**
 * @param {HTMLElement} root
 * @param {{ local: { username: string, cosmetics: object }, opponent: { username: string, cosmetics: object } }} players
 */
export function showPvpMatchLoading(root, players) {
  root.innerHTML = `
    <div class="pvp-loading" role="dialog" aria-modal="true" aria-labelledby="pvp-loading-status">
      <header class="pvp-loading__header">
        <p id="pvp-loading-status" class="pvp-loading__status">Match starting</p>
        <div class="pvp-loading__progress" aria-hidden="true">
          <span class="pvp-loading__progress-bar"></span>
        </div>
      </header>
      <div class="pvp-loading__arena">
        ${buildPvpPlayerShowcaseHtml(players.local, { label: "You" })}
        <div class="pvp-loading__vs" aria-hidden="true"><span>VS</span></div>
        ${buildPvpPlayerShowcaseHtml(players.opponent, { label: "Opponent" })}
      </div>
    </div>`;

  return new Promise((resolve) => {
    setTimeout(resolve, LOADING_MS);
  });
}
