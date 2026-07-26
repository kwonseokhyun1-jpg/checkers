import { PROFILE_STAT_ICONS } from "./profileStatIcons.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Shared stat card grid for own profile and public/friend profile modal.
 * @param {{ pvpWins: number, adventureFloorsCleared: number, spellsPlayed: number }} stats
 * @param {{ wrapperClass?: string, ariaLabel?: string }} [opts]
 */
export function profileStatCardsHtml(stats, { wrapperClass = "profile-hero-stats", ariaLabel = "Player statistics" } = {}) {
  const cards = [
    { key: "pvp", label: "PvP wins", value: stats.pvpWins },
    { key: "adventure", label: "Floors cleared", value: stats.adventureFloorsCleared },
    { key: "spells", label: "Spells played", value: stats.spellsPlayed },
  ];

  return `
    <div class="${escapeHtml(wrapperClass)}" aria-label="${escapeHtml(ariaLabel)}">
      ${cards
        .map(
          (card) => `
        <article class="profile-stat-card profile-stat-card--${card.key}">
          <span class="profile-stat-card__label">${escapeHtml(card.label)}</span>
          <span class="profile-stat-card__icon" aria-hidden="true">${PROFILE_STAT_ICONS[card.key]}</span>
          <span class="profile-stat-card__value">${card.value}</span>
        </article>`
        )
        .join("")}
    </div>`;
}
