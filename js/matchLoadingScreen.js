/**
 * Unified match loading screen — PvP and AI, with rotate hint.
 */

import {
  bannerStyleFor,
  frameClassFor,
  renderAvatarPreview,
} from "./cosmeticArt.js";
import { equippedTitleTagHtml } from "./mageTitles.js";

export const MATCH_LOADING_MS = 3500;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function playerCardHtml(player, { label } = {}) {
  const { username, cosmetics } = player;
  const equipped = cosmetics?.equipped || {};
  const titleHtml = equippedTitleTagHtml({ cosmetics }, { compact: true });
  return `
    <article class="match-loading__card">
      <div class="profile-showcase match-loading__showcase">
        <div class="profile-showcase__banner" style="background:${bannerStyleFor(equipped.banner)}"></div>
        <div class="profile-showcase__hero match-loading__hero">
          <div class="profile-avatar-stack ${frameClassFor(equipped.frame)}">
            <div class="profile-avatar-inner" aria-hidden="true">${renderAvatarPreview(equipped.avatar)}</div>
          </div>
        </div>
      </div>
      <div class="match-loading__identity">
        ${label ? `<p class="match-loading__label">${escapeHtml(label)}</p>` : ""}
        <p class="match-loading__name">${escapeHtml(username)}</p>
        ${titleHtml ? `<div class="match-loading__mage-title">${titleHtml}</div>` : ""}
      </div>
    </article>`;
}

function aiOpponentCardHtml(opponentName, { subtitle } = {}) {
  return `
    <article class="match-loading__card match-loading__card--ai">
      <div class="match-loading__ai-emblem" aria-hidden="true">
        <span class="match-loading__ai-piece match-loading__ai-piece--red"></span>
        <span class="match-loading__ai-piece match-loading__ai-piece--black"></span>
        <span class="match-loading__ai-spark">✦</span>
      </div>
      <div class="match-loading__identity">
        <p class="match-loading__label">Opponent</p>
        <p class="match-loading__name">${escapeHtml(opponentName)}</p>
        ${subtitle ? `<p class="match-loading__subtitle muted">${escapeHtml(subtitle)}</p>` : ""}
      </div>
    </article>`;
}

/**
 * @param {HTMLElement} root
 * @param {{
 *   mode: 'pvp' | 'ai',
 *   local: { username: string, cosmetics?: object },
 *   opponent: { username: string, cosmetics?: object },
 *   stageLabel?: string,
 * }} config
 */
export function showMatchLoading(root, config) {
  const { mode, local, opponent, stageLabel } = config;
  const isPvp = mode === "pvp";

  const opponentHtml = isPvp
    ? playerCardHtml(opponent, { label: "Opponent" })
    : aiOpponentCardHtml(opponent.username, { subtitle: stageLabel });

  root.innerHTML = `
    <div class="match-loading pvp-loading" role="dialog" aria-modal="true" aria-labelledby="match-loading-status">
      <header class="match-loading__header pvp-loading__header">
        <p id="match-loading-status" class="match-loading__status pvp-loading__status">Match starting</p>
        <p class="match-loading__rotate-hint">
          <span class="match-loading__rotate-icon" aria-hidden="true">↻</span>
          Rotate your phone for landscape play
        </p>
        <div class="match-loading__progress pvp-loading__progress" aria-hidden="true">
          <span class="match-loading__progress-bar pvp-loading__progress-bar"></span>
        </div>
      </header>
      <div class="match-loading__arena pvp-loading__arena">
        ${playerCardHtml(local, { label: "You" })}
        <div class="match-loading__vs pvp-loading__vs" aria-hidden="true"><span>VS</span></div>
        ${opponentHtml}
      </div>
    </div>`;

  return new Promise((resolve) => {
    setTimeout(resolve, MATCH_LOADING_MS);
  });
}

/** @deprecated Use showMatchLoading */
export function showPvpMatchLoading(root, players) {
  return showMatchLoading(root, {
    mode: "pvp",
    local: players.local,
    opponent: players.opponent,
  });
}
