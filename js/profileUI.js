import { COSMETIC_BOXES, COSMETIC_BY_ID, COSMETIC_TYPES, equipCosmetic, getEquippedCosmetics, openCosmeticBox } from "./cosmetics.js";
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
import { saveProfile } from "./storage.js";

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

function loadoutHtml(cos) {
  const avatar = COSMETIC_BY_ID[cos.equipped.avatar];
  const banner = COSMETIC_BY_ID[cos.equipped.banner];
  const frame = COSMETIC_BY_ID[cos.equipped.frame];
  const skin = COSMETIC_BY_ID[cos.equipped.pieceSkin];
  return `
    <p class="profile-showcase__title">Equipped loadout</p>
    <ul class="profile-loadout">
      <li class="profile-loadout__item">
        <span class="profile-loadout__label">Avatar</span>
        <span class="profile-loadout__value">${avatar?.name || "—"}</span>
      </li>
      <li class="profile-loadout__item">
        <span class="profile-loadout__label">Frame</span>
        <span class="profile-loadout__value">${frame?.name || "—"}</span>
      </li>
      <li class="profile-loadout__item">
        <span class="profile-loadout__label">Banner</span>
        <span class="profile-loadout__value">${banner?.name || "—"}</span>
      </li>
      <li class="profile-loadout__item">
        <span class="profile-loadout__label">Pieces</span>
        <span class="profile-loadout__value">${skin?.name || "—"}</span>
      </li>
    </ul>`;
}

/** Cosmetic boxes — rendered in Vault → Cards tab */
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
        ${canAfford ? "Unseal" : "Need more gems"}
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

export function renderProfileTab(profile, root, { onGemsChange } = {}) {
  if (!root) return;
  const cos = getEquippedCosmetics(profile);

  root.innerHTML = `
    <section class="panel game-panel profile-panel">
      <header class="panel-head">
        <h2 class="panel-head__title">Arcane Profile</h2>
        <p class="panel-head__desc">Equip avatars, portrait frames, banners, and piece skins from your Vault unlocks.</p>
      </header>
      <div class="profile-showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${bannerStyleFor(cos.equipped.banner)}"></div>
        <div class="profile-showcase__hero">
          <div class="profile-avatar-stack ${frameClassFor(cos.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${renderAvatarPreview(cos.equipped.avatar)}</div>
          </div>
          <div class="profile-showcase__meta" id="profile-loadout-meta">${loadoutHtml(cos)}</div>
        </div>
      </div>
      <h3 class="profile-section-title">Your collection</h3>
      <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
        ${COSMETIC_TYPES.map(
          (t) => `<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${t}">${filterTabLabel(t)}</button>`
        ).join("")}
      </div>
      <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
    </section>
  `;

  const grid = root.querySelector("#profile-cosmetic-grid");
  let filter = "avatar";

  const refreshShowcase = () => {
    const c = getEquippedCosmetics(profile);
    root.querySelector("#profile-banner-preview").style.background = bannerStyleFor(c.equipped.banner);
    root.querySelector("#profile-avatar-preview").innerHTML = renderAvatarPreview(c.equipped.avatar);
    const stack = root.querySelector("#profile-avatar-stack");
    if (stack) stack.className = `profile-avatar-stack ${frameClassFor(c.equipped.frame)}`;
    const meta = root.querySelector("#profile-loadout-meta");
    if (meta) meta.innerHTML = loadoutHtml(c);
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
      grid.innerHTML = '<p class="muted">Open cosmetic boxes in the Vault (Cards tab) to unlock items.</p>';
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
}
