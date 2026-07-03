import { COSMETIC_BOXES, COSMETIC_BY_ID, COSMETIC_TYPES, equipCosmetic, getEquippedCosmetics, openCosmeticBox } from "./cosmetics.js";
import { formatRarityOdds } from "./chestOdds.js";
import { COSMETICS_UNLOCK_MESSAGE } from "./adventure.js";
import { notifyUnlockTutorial } from "./tutorialUnlocks.js";
import {
  ACHIEVEMENTS,
  achievementRewardTitle,
  canClaimAchievement,
  claimAchievement,
  isAchievementClaimed,
  isAchievementComplete,
  achievementProgressRatio,
  progressLabel,
} from "./achievements.js";
import {
  MAGE_TITLES,
  MAGE_TITLE_BY_ID,
  TITLE_RARITY_CLASS,
  equipTitle,
  getEquippedTitleId,
  ownsTitle,
  titleTagHtml,
} from "./mageTitles.js";
import {
  COSMETIC_BOX_TIERS,
  cosmeticBoxSvgMarkup,
  renderAvatarPreview,
  bannerStyleFor,
  renderCosmeticPreviewHtml,
  cosmeticTypeLabel,
  frameClassFor,
} from "./cosmeticArt.js";
import { playCosmeticOpenAnimation } from "./cosmeticOpenAnimation.js";
import {
  fetchProfileRow,
  getCurrentUser,
  isAuthAvailable,
} from "./auth.js";
import { saveProfile } from "./storage.js";
import { getProfileStats } from "./profileStats.js";
import {
  canClaimDailyQuest,
  claimDailyQuest,
  dailyQuestProgressLabel,
  dailyQuestProgressRatio,
  dailyQuestRewardLabel,
  getActiveDailyQuests,
  getDailyQuestProgress,
  getMsUntilLocalMidnight,
  formatDailyResetCountdown,
} from "./dailyQuests.js";

let dailyQuestResetTimerId = null;

function clearDailyQuestResetTimer() {
  if (dailyQuestResetTimerId != null) {
    clearInterval(dailyQuestResetTimerId);
    dailyQuestResetTimerId = null;
  }
}

function startDailyQuestResetCountdown(el) {
  if (!el) return;
  clearDailyQuestResetTimer();
  const tick = () => {
    el.textContent = `Resets in: ${formatDailyResetCountdown(getMsUntilLocalMidnight())}`;
  };
  tick();
  dailyQuestResetTimerId = setInterval(tick, 1000);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const RARITY_CLASS = {
  common: "rarity-common",
  uncommon: "rarity-uncommon",
  rare: "rarity-rare",
  epic: "rarity-epic",
  legendary: "rarity-legendary",
};

function filterTabLabel(type) {
  if (type === "pieceSkin") return "Piece skins";
  if (type === "frame") return "Frames";
  const label = cosmeticTypeLabel(type);
  return label.endsWith("s") ? label : `${label}s`;
}

function profileTitleBadgeHtml(profile) {
  const titleId = getEquippedTitleId(profile);
  return titleId ? titleTagHtml(titleId) : "";
}


const PROFILE_STAT_ICONS = {
  pvp: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 10h20v6c0 6-4 10-10 10S14 22 14 16v-6z" fill="#e8c547"/>
    <path d="M10 10h4v4c0 3-2 6-4 6V10zM34 10h4v10c-2 0-4-3-4-6v-4z" fill="#e8c547"/>
    <rect x="18" y="26" width="12" height="4" rx="1" fill="#c9942a"/>
    <rect x="16" y="30" width="16" height="4" rx="1" fill="#a67c1a"/>
    <rect x="20" y="34" width="8" height="6" rx="1" fill="#8b6914"/>
  </svg>`,
  adventure: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 12l12 4 8-4 12 4v28l-12-4-8 4-12-4V12z" fill="#d4a574" stroke="#8b6914" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M20 12v28M28 8v28" stroke="#8b6914" stroke-width="1.5"/>
    <circle cx="24" cy="22" r="3" fill="#e85d5d"/>
    <path d="M24 25v6" stroke="#e85d5d" stroke-width="2" stroke-linecap="round"/>
  </svg>`,
  spells: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 38l22-22 4 4-22 22-4-4z" fill="#8b6914"/>
    <path d="M32 14l4-4 2 2-4 4-2-2z" fill="#e8c547"/>
    <path d="M36 8l3-1 1 3-3 1-1-3z" fill="#5ce1e6"/>
    <path d="M38 14l2 2M40 10l-2 2" stroke="#e8c547" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="36" r="2" fill="#9f7aea"/>
  </svg>`,
};

function profileHeroStatsHtml(profile) {
  const stats = getProfileStats(profile);
  const cards = [
    { key: "pvp", label: "PvP wins", value: stats.pvpWins },
    { key: "adventure", label: "Floors cleared", value: stats.adventureFloorsCleared },
    { key: "spells", label: "Spells played", value: stats.spellsPlayed },
  ];
  return `
    <div class="profile-hero-stats" aria-label="Player statistics">
      ${cards
        .map(
          (card) => `
        <article class="profile-stat-card profile-stat-card--${card.key}">
          <span class="profile-stat-card__label">${escapeHtml(card.label)}</span>
          <span class="profile-stat-card__icon">${PROFILE_STAT_ICONS[card.key]}</span>
          <span class="profile-stat-card__value">${card.value}</span>
        </article>`
        )
        .join("")}
    </div>`;
}

function profileHeroCardHtml(cos, profile, { username }) {
  const titleBadge = profileTitleBadgeHtml(profile);
  const displayName = username || "Player";
  const initial = displayName.charAt(0).toUpperCase() || "?";
  return `
    <div class="profile-hero-card">
      <div class="profile-showcase profile-hero-card__showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${bannerStyleFor(cos.equipped.banner)}"></div>
        <div class="profile-showcase__hero profile-hero-card__hero">
          <div class="profile-avatar-stack ${frameClassFor(cos.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${renderAvatarPreview(cos.equipped.avatar) || `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`}</div>
          </div>
          <div class="profile-hero-card__info">
            <div class="profile-hero-card__name-row">
              <h2 id="profile-hero-username" class="profile-hero-card__username">${escapeHtml(displayName)}</h2>
              ${titleBadge ? `<span class="profile-hero-card__title-badge">${titleBadge}</span>` : ""}
            </div>
          </div>
        </div>
      </div>
      ${profileHeroStatsHtml(profile)}
    </div>`;
}

/** Cosmetic boxes — rendered in Shop → Cosmetics tab */
export function renderCosmeticBoxes(profile, listEl, { logEl, onGemsChange, onOpened, cosmeticsUnlocked = true } = {}) {
  if (!listEl) return;
  listEl.innerHTML = "";

  if (!cosmeticsUnlocked) {
    listEl.innerHTML = `<p class="vault-locked-msg muted">${COSMETICS_UNLOCK_MESSAGE}</p>`;
    return;
  }

  for (const box of COSMETIC_BOXES) {
    const tier = COSMETIC_BOX_TIERS[box.id] || COSMETIC_BOX_TIERS.style_crate;
    const canAfford = profile.gems >= box.cost;
    const el = document.createElement("article");
    el.className = `chest-card chest-card--${tier.visual} cosmetic-box-card cosmetic-box-card--${box.id}${canAfford ? "" : " chest-card--locked"}`;

    el.innerHTML = `
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${cosmeticBoxSvgMarkup(box.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${tier.label}</span>
        <h3 class="chest-card__name">${box.name}</h3>
        <p class="chest-card__tagline">${formatRarityOdds(box.weights)}</p>
        <ul class="chest-card__stats">
          <li><strong>${box.pulls}</strong> cosmetics</li>
          <li>Avatars · frames · banners · skins</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${box.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary btn-open-cosmetic chest-card__btn" data-box="${box.id}">
        ${canAfford ? "Open" : "Need more gems"}
      </button>`;

    const btn = el.querySelector(".btn-open-cosmetic");
    btn.disabled = !canAfford;
    btn.addEventListener("click", async () => {
      if (btn.disabled) return;
      const res = openCosmeticBox(profile, box.id);
      if (!res.success) {
        if (logEl) logEl.textContent = res.message;
        return;
      }

      saveProfile(profile);
      onGemsChange?.();
      btn.disabled = true;

      await playCosmeticOpenAnimation({
        boxId: box.id,
        boxLabel: tier.label,
        pulls: res.pulls,
      });

      const names = res.pulls.map((x) => `${x.name}${x.duplicate ? " (duplicate)" : ""}`).join(", ");
      if (logEl) {
        logEl.textContent = `Opened ${box.name}: ${names}${res.bonusGems ? ` · +${res.bonusGems} gems from duplicates` : ""}`;
      }
      onOpened?.(res);
      notifyUnlockTutorial("cosmetic-box-opened", { boxId: box.id, pulls: res.pulls });
      renderCosmeticBoxes(profile, listEl, { logEl, onGemsChange, onOpened, cosmeticsUnlocked });
    });
    listEl.appendChild(el);
  }
}

/** @param {HTMLElement} grid */
function bindAchievementsGrid(profile, grid, { onTitleChanged } = {}) {
  if (!grid) return;
  grid.innerHTML = "";
  const sortedAchievements = [...ACHIEVEMENTS].sort((a, b) => {
    const sortKey = (id) => {
      if (canClaimAchievement(profile, id)) return 0;
      if (isAchievementClaimed(profile, id)) return 2;
      return 1;
    };
    const keyDiff = sortKey(a.id) - sortKey(b.id);
    if (keyDiff !== 0) return keyDiff;
    const progressDiff = achievementProgressRatio(profile, b.id) - achievementProgressRatio(profile, a.id);
    if (progressDiff !== 0) return progressDiff;
    return a.title.localeCompare(b.title);
  });
  for (const ach of sortedAchievements) {
    const reward = achievementRewardTitle(ach.id);
    const complete = isAchievementComplete(profile, ach.id);
    const claimed = isAchievementClaimed(profile, ach.id);
    const canClaim = canClaimAchievement(profile, ach.id);
    const locked = !complete && !claimed;
    const card = document.createElement("article");
    card.className = [
      "profile-achievement-card",
      locked ? "profile-achievement-card--locked" : "",
      complete ? "profile-achievement-card--complete" : "",
      claimed ? "profile-achievement-card--claimed" : "",
      canClaim ? "profile-achievement-card--claimable" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const prog = progressLabel(profile, ach.id);
    const pct = ach.target ? Math.min(100, Math.round(((profile.achievements?.progress?.[ach.id] || 0) / ach.target) * 100)) : 0;
    const statusLabel = claimed ? "Unlocked" : canClaim ? "Claim Title" : complete ? "Complete" : "In progress";
    card.innerHTML = `
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${escapeHtml(ach.title)}</h4>
        ${reward ? `<span class="profile-achievement-card__reward mage-title-tag mage-title-tag--glow-${reward.glow} ${TITLE_RARITY_CLASS[reward.rarity] || ""}">[${escapeHtml(reward.display)}]</span>` : ""}
      </div>
      <p class="profile-achievement-card__desc">${escapeHtml(ach.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${pct}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${escapeHtml(prog)}</p>
      <span class="profile-achievement-card__status">${statusLabel}</span>`;
    if (canClaim) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-primary profile-achievement-card__claim";
      btn.textContent = "Claim Title";
      btn.addEventListener("click", () => {
        const res = claimAchievement(profile, ach.id);
        if (res.success) {
          saveProfile(profile);
          bindAchievementsGrid(profile, grid, { onTitleChanged });
          onTitleChanged?.();
        }
      });
      card.appendChild(btn);
    }
    grid.appendChild(card);
  }
}

/** @param {HTMLElement} grid */
function bindDailyQuestsGrid(profile, grid, { onCurrencyChange } = {}) {
  if (!grid) return;
  grid.innerHTML = "";
  const quests = [...getActiveDailyQuests(profile)].sort((a, b) => {
    const sortKey = (entry) => {
      if (entry.canClaim) return 0;
      if (entry.claimed) return 2;
      return 1;
    };
    const keyDiff = sortKey(a) - sortKey(b);
    if (keyDiff !== 0) return keyDiff;
    return dailyQuestProgressRatio(profile, b.templateId) - dailyQuestProgressRatio(profile, a.templateId);
  });

  for (const { template, templateId, complete, claimed, canClaim } of quests) {
    const locked = !complete && !claimed;
    const card = document.createElement("article");
    card.className = [
      "profile-achievement-card",
      "daily-quest-card",
      locked ? "profile-achievement-card--locked" : "",
      complete ? "profile-achievement-card--complete" : "",
      claimed ? "profile-achievement-card--claimed" : "",
      canClaim ? "profile-achievement-card--claimable" : "",
    ]
      .filter(Boolean)
      .join(" ");
    const prog = dailyQuestProgressLabel(profile, templateId);
    const pct = template.target
      ? Math.min(100, Math.round((getDailyQuestProgress(profile, templateId) / template.target) * 100))
      : 0;
    const reward = dailyQuestRewardLabel(templateId);
    const rewardClass =
      template.reward.currency === "stars" ? "daily-quest-card__reward--stars" : "daily-quest-card__reward--gems";
    const statusLabel = claimed ? "Claimed" : canClaim ? "Claim reward" : complete ? "Complete" : "In progress";
    card.innerHTML = `
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${escapeHtml(template.title)}</h4>
        <span class="daily-quest-card__reward ${rewardClass}">${escapeHtml(reward)}</span>
      </div>
      <p class="profile-achievement-card__desc">${escapeHtml(template.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${pct}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${escapeHtml(prog)}</p>
      <span class="profile-achievement-card__status">${statusLabel}</span>`;
    if (canClaim) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-primary profile-achievement-card__claim";
      btn.textContent = template.reward.currency === "stars" ? "Claim stars" : "Claim gems";
      btn.addEventListener("click", () => {
        const res = claimDailyQuest(profile, templateId);
        if (res.success) {
          saveProfile(profile);
          bindDailyQuestsGrid(profile, grid, { onCurrencyChange });
          onCurrencyChange?.();
        }
      });
      card.appendChild(btn);
    }
    grid.appendChild(card);
  }
}

export function renderQuestsTab(profile, root, { onTitleChanged, onCurrencyChange } = {}) {
  if (!root) return;
  clearDailyQuestResetTimer();
  root.innerHTML = `
    <section class="panel game-panel quests-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Quests</h2>
        <p class="panel-head__desc">Complete daily quests for gems and stars, or title quests for mage titles.</p>
      </header>
      <div class="quests-section-tabs" role="tablist" aria-label="Quest categories">
        <button type="button" class="quests-section-tab active" role="tab" aria-selected="true" data-quests-section="daily">Daily quests</button>
        <button type="button" class="quests-section-tab" role="tab" aria-selected="false" data-quests-section="title">Title quests</button>
      </div>
      <div id="quests-section-daily" class="quests-section-panel">
        <p id="daily-quests-reset-countdown" class="daily-quests-section__reset muted" aria-live="polite">Resets in: --:--:--</p>
        <div id="daily-quests-grid" class="profile-achievement-grid daily-quests-grid"></div>
      </div>
      <div id="quests-section-title" class="quests-section-panel hidden" hidden>
        <div id="quests-grid" class="profile-achievement-grid"></div>
      </div>
    </section>`;

  const setQuestsSection = (section) => {
    root.querySelectorAll(".quests-section-tab").forEach((tab) => {
      const active = tab.dataset.questsSection === section;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    const dailyPanel = root.querySelector("#quests-section-daily");
    const titlePanel = root.querySelector("#quests-section-title");
    if (dailyPanel) {
      dailyPanel.classList.toggle("hidden", section !== "daily");
      dailyPanel.hidden = section !== "daily";
    }
    if (titlePanel) {
      titlePanel.classList.toggle("hidden", section !== "title");
      titlePanel.hidden = section !== "title";
    }
  };

  for (const tab of root.querySelectorAll(".quests-section-tab")) {
    tab.addEventListener("click", () => setQuestsSection(tab.dataset.questsSection));
  }

  startDailyQuestResetCountdown(root.querySelector("#daily-quests-reset-countdown"));
  bindDailyQuestsGrid(profile, root.querySelector("#daily-quests-grid"), { onCurrencyChange });
  bindAchievementsGrid(profile, root.querySelector("#quests-grid"), { onTitleChanged });
}

/** @deprecated Use renderQuestsTab */
export const renderAchievementsTab = renderQuestsTab;

export function headerProfileAvatarHtml(profile, username = "") {
  const cos = getEquippedCosmetics(profile);
  const initial = (username || "P").charAt(0).toUpperCase();
  const inner = renderAvatarPreview(cos.equipped.avatar) || `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
  return `<span class="profile-avatar-stack header-profile-btn__stack ${frameClassFor(cos.equipped.frame)}"><span class="profile-avatar-inner header-profile-btn__inner">${inner}</span></span>`;
}

export async function resolveDisplayUsername(user) {
  if (!user) return "";
  try {
    const row = await fetchProfileRow(user.id);
    return row?.username || user.user_metadata?.display_name || user.email?.split("@")[0] || "";
  } catch {
    return user.user_metadata?.display_name || user.email?.split("@")[0] || "";
  }
}

export function renderProfileTab(profile, root, { onGemsChange, onTitleChanged } = {}) {
  if (!root) return;
  const cos = getEquippedCosmetics(profile);
  const user = getCurrentUser();
  const signedIn = isAuthAvailable() && !!user;

  root.innerHTML = `
    <section class="panel game-panel profile-panel">
      ${profileHeroCardHtml(cos, profile, { username: "" })}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
      </div>
      <div id="profile-section-cosmetics" class="profile-section-panel">
        <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
          ${COSMETIC_TYPES.map(
            (t) => `<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${t}">${filterTabLabel(t)}</button>`
          ).join("")}
        </div>
        <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
      </div>
      <div id="profile-section-titles" class="profile-section-panel hidden" hidden>
        <p class="muted profile-titles-hint">Unlock titles by completing quests, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
    </section>
  `;

  const grid = root.querySelector("#profile-cosmetic-grid");
  let filter = "avatar";
  let savedUsername = "";

  const refreshShowcase = () => {
    const c = getEquippedCosmetics(profile);
    root.querySelector("#profile-banner-preview").style.background = bannerStyleFor(c.equipped.banner);
    const preview = root.querySelector("#profile-avatar-preview");
    const initial = (savedUsername || "P").charAt(0).toUpperCase();
    if (preview) {
      preview.innerHTML = renderAvatarPreview(c.equipped.avatar) || `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
    }
    const stack = root.querySelector("#profile-avatar-stack");
    if (stack) stack.className = `profile-avatar-stack ${frameClassFor(c.equipped.frame)}`;
    const heroName = root.querySelector("#profile-hero-username");
    if (heroName) heroName.textContent = savedUsername || "Player";
    const badgeEl = root.querySelector(".profile-hero-card__title-badge");
    const badge = profileTitleBadgeHtml(profile);
    if (badge) {
      if (badgeEl) {
        badgeEl.innerHTML = badge;
      } else {
        const nameRow = root.querySelector(".profile-hero-card__name-row");
        if (nameRow) {
          const span = document.createElement("span");
          span.className = "profile-hero-card__title-badge";
          span.innerHTML = badge;
          nameRow.appendChild(span);
        }
      }
    } else if (badgeEl) {
      badgeEl.remove();
    }
    onTitleChanged?.();
  };

  const renderGrid = () => {
    const owned = profile.cosmetics?.owned?.[filter] || [];
    grid.innerHTML = "";
    for (const id of owned) {
      const item = COSMETIC_BY_ID[id];
      if (!item) continue;
      const equipped = profile.cosmetics.equipped[filter] === id;
      const card = document.createElement("button");
      card.type = "button";
      card.className = `profile-cosmetic-card ${RARITY_CLASS[item.rarity] || ""} ${equipped ? "profile-cosmetic-card--equipped" : ""}`;
      const preview = renderCosmeticPreviewHtml(id, item.type);
      card.innerHTML = `
        <span class="profile-cosmetic-card__rarity">${item.rarity}</span>
        <div class="profile-cosmetic-card__art">${preview}</div>
        <strong class="profile-cosmetic-card__name">${item.name}</strong>
        <span class="profile-cosmetic-card__action">${equipped ? "Equipped" : "Equip"}</span>`;
      card.addEventListener("click", () => {
        if (equipped) return;
        const res = equipCosmetic(profile, filter, id);
        if (res.success) {
          saveProfile(profile);
          renderGrid();
          refreshShowcase();
          notifyUnlockTutorial("cosmetic-equipped", { type: filter, id });
        }
      });
      grid.appendChild(card);
    }
    if (!owned.length) {
      grid.innerHTML = '<p class="muted">Open cosmetic boxes in the Shop to unlock items.</p>';
    }
  };

  for (const btn of root.querySelectorAll(".profile-filter-btn")) {
    btn.addEventListener("click", () => {
      filter = btn.dataset.cosFilter;
      root.querySelectorAll(".profile-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderGrid();
    });
  }
  root.querySelector(".profile-filter-btn")?.classList.add("active");
  renderGrid();

  const renderTitles = () => {
    const titleGrid = root.querySelector("#profile-title-grid");
    if (!titleGrid) return;
    titleGrid.innerHTML = "";
    const equippedId = getEquippedTitleId(profile);
    for (const title of MAGE_TITLES) {
      const unlocked = ownsTitle(profile, title.id);
      const equipped = equippedId === title.id;
      const card = document.createElement("button");
      card.type = "button";
      card.disabled = !unlocked;
      card.className = [
        "profile-title-card",
        TITLE_RARITY_CLASS[title.rarity] || "",
        `profile-title-card--glow-${title.glow}`,
        unlocked ? "" : "profile-title-card--locked",
        equipped ? "profile-title-card--equipped" : "",
      ]
        .filter(Boolean)
        .join(" ");
      card.innerHTML = `
        <span class="profile-title-card__tag mage-title-tag mage-title-tag--glow-${title.glow} ${TITLE_RARITY_CLASS[title.rarity] || ""}">[${escapeHtml(title.display)}]</span>
        <span class="profile-title-card__rarity">${title.rarity}</span>
        <span class="profile-title-card__action">${equipped ? "Equipped" : unlocked ? "Equip" : "Locked"}</span>`;
      card.addEventListener("click", () => {
        if (!unlocked) return;
        const res = equipTitle(profile, equipped ? null : title.id);
        if (res.success) {
          saveProfile(profile);
          renderTitles();
          refreshShowcase();
          onTitleChanged?.();
        }
      });
      titleGrid.appendChild(card);
    }
  };

  const setProfileSection = (section) => {
    root.querySelectorAll(".profile-section-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.profileSection === section);
    });
    const cosPanel = root.querySelector("#profile-section-cosmetics");
    if (cosPanel) {
      cosPanel.classList.toggle("hidden", section !== "cosmetics");
      cosPanel.hidden = section !== "cosmetics";
    }
    const titlePanel = root.querySelector("#profile-section-titles");
    if (titlePanel) {
      titlePanel.classList.toggle("hidden", section !== "titles");
      titlePanel.hidden = section !== "titles";
    }
    if (section === "titles") renderTitles();
  };

  for (const tab of root.querySelectorAll(".profile-section-tab")) {
    tab.addEventListener("click", () => setProfileSection(tab.dataset.profileSection));
  }
  renderTitles();

  if (!signedIn) return;

  void (async () => {
    try {
      const profileRow = await fetchProfileRow(user.id);
      savedUsername = profileRow?.username || user.user_metadata?.display_name || "";
      refreshShowcase();
    } catch (e) {
      console.warn("Could not load profile username", e);
    }
  })();
}
