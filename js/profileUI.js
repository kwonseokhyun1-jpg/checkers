import { COSMETIC_BOXES, COSMETIC_BY_ID, COSMETIC_TYPES, equipCosmetic, getEquippedCosmetics, openCosmeticBox } from "./cosmetics.js";
import {
  ACHIEVEMENTS,
  achievementRewardTitle,
  canClaimAchievement,
  claimAchievement,
  isAchievementClaimed,
  isAchievementComplete,
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
  canChangeUsername,
  fetchProfileRow,
  getCurrentUser,
  isAuthAvailable,
  isUsernameAvailableForUser,
  signOut,
  suggestAvailableUsername,
  updateUsername,
  validateUsernameFormat,
} from "./auth.js";
import { saveProfile } from "./storage.js";

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

function profileHeroCardHtml(cos, profile, { username, email }) {
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
            ${email ? `<p class="profile-hero-card__email muted">${escapeHtml(email)}</p>` : ""}
          </div>
        </div>
      </div>
      <button type="button" class="btn-secondary btn-sm profile-hero-card__edit" id="profile-edit-btn">Edit profile</button>
    </div>`;
}

/** Cosmetic boxes — rendered in Shop → Cosmetics tab */
export function renderCosmeticBoxes(profile, listEl, { logEl, onGemsChange, onOpened } = {}) {
  if (!listEl) return;
  listEl.innerHTML = "";

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
        <p class="chest-card__tagline">${tier.tagline}</p>
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
      renderCosmeticBoxes(profile, listEl, { logEl, onGemsChange, onOpened });
    });
    listEl.appendChild(el);
  }
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
        <p id="profile-username-display" class="profile-username-display">${escapeHtml(username) || "—"}</p>
        <button type="button" class="btn-text profile-username-change" id="profile-username-change">Change username</button>
      </div>
      <div id="profile-username-editor" class="profile-username-editor hidden" hidden>
        <label class="label-sm" for="profile-username">New username</label>
        <div class="profile-username-row">
          <input
            type="text"
            id="profile-username"
            class="input-text"
            autocomplete="username"
            minlength="3"
            maxlength="24"
            pattern="[A-Za-z0-9_]{3,24}"
            value="${escapeHtml(username)}"
            placeholder="Your in-game name"
          />
          <button type="button" class="btn-primary" id="profile-username-save">Save</button>
        </div>
        <button type="button" class="btn-text profile-username-cancel" id="profile-username-cancel">Cancel</button>
        <p id="profile-username-hint" class="auth-username-hint" aria-live="polite"></p>
        <p id="profile-username-status" class="profile-username-status" role="status"></p>
      </div>
      <button type="button" class="btn-text profile-sign-out" id="profile-sign-out">Sign out</button>
    </div>`;
}

/** @param {HTMLElement} grid */
function bindAchievementsGrid(profile, grid, { onTitleChanged } = {}) {
  if (!grid) return;
  grid.innerHTML = "";
  for (const ach of ACHIEVEMENTS) {
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
      reward ? TITLE_RARITY_CLASS[reward.rarity] || "" : "",
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

export function renderAchievementsTab(profile, root, { onTitleChanged } = {}) {
  if (!root) return;
  root.innerHTML = `
    <section class="panel game-panel achievements-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Achievements</h2>
        <p class="panel-head__desc">Complete challenges to unlock mage titles.</p>
      </header>
      <div id="achievements-grid" class="profile-achievement-grid"></div>
    </section>`;
  bindAchievementsGrid(profile, root.querySelector("#achievements-grid"), { onTitleChanged });
}

export function headerProfileAvatarHtml(profile, username = "") {
  const cos = getEquippedCosmetics(profile);
  const initial = (username || "P").charAt(0).toUpperCase();
  const inner = renderAvatarPreview(cos.equipped.avatar) || `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
  return `<span class="header-profile-btn__stack profile-avatar-stack ${frameClassFor(cos.equipped.frame)}"><span class="header-profile-btn__inner profile-avatar-inner">${inner}</span></span>`;
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

export function renderProfileTab(profile, root, { onGemsChange, onUsernameChanged, onTitleChanged, initialSection } = {}) {
  if (!root) return;
  const cos = getEquippedCosmetics(profile);
  const user = getCurrentUser();
  const signedIn = isAuthAvailable() && !!user;

  root.innerHTML = `
    <section class="panel game-panel profile-panel">
      ${profileHeroCardHtml(cos, profile, { username: "", email: signedIn ? user?.email || "" : "" })}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="account">Account</button>
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
        <p class="muted profile-titles-hint">Unlock titles by completing achievements, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
      <div id="profile-section-account" class="profile-section-panel hidden" hidden>
        ${accountSectionHtml({ signedIn, username: "", email: user?.email || "" })}
      </div>
    </section>
  `;

  const grid = root.querySelector("#profile-cosmetic-grid");
  let filter = "avatar";
  let profileSection = "cosmetics";

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
    const nameRow = root.querySelector(".profile-hero-card__name-row");
    if (nameRow) {
      const badge = profileTitleBadgeHtml(profile);
      nameRow.innerHTML = `
        <h2 id="profile-hero-username" class="profile-hero-card__username">${escapeHtml(savedUsername || "Player")}</h2>
        ${badge ? `<span class="profile-hero-card__title-badge">${badge}</span>` : ""}`;
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
        const res = equipCosmetic(profile, filter, id);
        if (res.success) {
          saveProfile(profile);
          renderGrid();
          refreshShowcase();
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
    profileSection = section;
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
    const accountPanel = root.querySelector("#profile-section-account");
    if (accountPanel) {
      accountPanel.classList.toggle("hidden", section !== "account");
      accountPanel.hidden = section !== "account";
    }
    if (section === "titles") renderTitles();
  };

  for (const tab of root.querySelectorAll(".profile-section-tab")) {
    tab.addEventListener("click", () => setProfileSection(tab.dataset.profileSection));
  }
  renderTitles();
  if (initialSection && initialSection !== "cosmetics") setProfileSection(initialSection);

  if (!signedIn) return;

  const usernameDisplay = root.querySelector("#profile-username-display");
  const usernameEditor = root.querySelector("#profile-username-editor");
  const changeBtn = root.querySelector("#profile-username-change");
  const cancelBtn = root.querySelector("#profile-username-cancel");
  const usernameInput = root.querySelector("#profile-username");
  const usernameHint = root.querySelector("#profile-username-hint");
  const usernameStatus = root.querySelector("#profile-username-status");
  const saveBtn = root.querySelector("#profile-username-save");
  let usernameCheckTimer = null;

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

  root.querySelector("#profile-edit-btn")?.addEventListener("click", () => {
    setProfileSection("account");
    showUsernameEditor(true);
  });

  root.querySelector("#profile-sign-out")?.addEventListener("click", () => {
    void signOut();
  });

  let profileRow = null;

  void (async () => {
    try {
      profileRow = await fetchProfileRow(user.id);
      savedUsername = profileRow?.username || user.user_metadata?.display_name || "";
      setUsernameDisplay(savedUsername);
      refreshShowcase();
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
