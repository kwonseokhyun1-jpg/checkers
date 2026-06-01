import {
  COSMETIC_BOXES,
  COSMETIC_ITEMS,
  COSMETIC_BY_ID,
  COSMETIC_TYPES,
  cosmeticCssClass,
  equipCosmetic,
  getEquippedCosmetics,
  openCosmeticBox,
} from "./cosmetics.js";
import { renderAvatarPreview, bannerStyleFor } from "./cosmeticArt.js";
import { saveProfile } from "./storage.js";

const RARITY_CLASS = {
  common: "rarity-common",
  uncommon: "rarity-uncommon",
  rare: "rarity-rare",
  epic: "rarity-epic",
  legendary: "rarity-legendary",
};

export function renderProfileTab(profile, root, { onGemsChange } = {}) {
  if (!root) return;
  const cos = getEquippedCosmetics(profile);
  const avatar = COSMETIC_BY_ID[cos.equipped.avatar];
  const banner = COSMETIC_BY_ID[cos.equipped.banner];
  const skin = COSMETIC_BY_ID[cos.equipped.pieceSkin];

  root.innerHTML = `
    <section class="panel game-panel profile-panel">
      <header class="panel-head">
        <h2 class="panel-head__title">Arcane Profile</h2>
        <p class="panel-head__desc">Equip cosmetics and open style boxes for avatars, banners, and piece skins.</p>
      </header>
      <div class="profile-showcase">
        <div class="profile-banner" id="profile-banner-preview" style="background:${bannerStyleFor(cos.equipped.banner)}"></div>
        <div class="profile-avatar-wrap" id="profile-avatar-preview">${renderAvatarPreview(cos.equipped.avatar)}</div>
        <div class="profile-showcase__meta">
          <p class="profile-equipped-line"><strong>Avatar:</strong> ${avatar?.name || "—"}</p>
          <p class="profile-equipped-line"><strong>Banner:</strong> ${banner?.name || "—"}</p>
          <p class="profile-equipped-line"><strong>Piece skin:</strong> ${skin?.name || "—"}</p>
        </div>
      </div>
      <h3 class="profile-section-title">Cosmetic boxes</h3>
      <div class="cosmetic-box-list" id="cosmetic-box-list"></div>
      <p id="profile-cosmetic-log" class="chest-log" role="status"></p>
      <h3 class="profile-section-title">Your collection</h3>
      <div class="profile-cosmetic-filters">
        ${COSMETIC_TYPES.map(
          (t) => `<button type="button" class="btn-text profile-filter-btn" data-cos-filter="${t}">${t === "pieceSkin" ? "Piece skins" : t.charAt(0).toUpperCase() + t.slice(1)}</button>`
        ).join("")}
      </div>
      <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
    </section>
  `;

  const log = root.querySelector("#profile-cosmetic-log");
  const boxList = root.querySelector("#cosmetic-box-list");
  const grid = root.querySelector("#profile-cosmetic-grid");
  let filter = "avatar";

  const refreshShowcase = () => {
    const c = getEquippedCosmetics(profile);
    root.querySelector("#profile-banner-preview").style.background = bannerStyleFor(c.equipped.banner);
    root.querySelector("#profile-avatar-preview").innerHTML = renderAvatarPreview(c.equipped.avatar);
    const av = COSMETIC_BY_ID[c.equipped.avatar];
    const bn = COSMETIC_BY_ID[c.equipped.banner];
    const sk = COSMETIC_BY_ID[c.equipped.pieceSkin];
    const meta = root.querySelector(".profile-showcase__meta");
    if (meta) {
      meta.innerHTML = `
        <p class="profile-equipped-line"><strong>Avatar:</strong> ${av?.name || "—"}</p>
        <p class="profile-equipped-line"><strong>Banner:</strong> ${bn?.name || "—"}</p>
        <p class="profile-equipped-line"><strong>Piece skin:</strong> ${sk?.name || "—"}</p>`;
    }
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
      card.innerHTML = `
        <span class="profile-cosmetic-card__rarity">${item.rarity}</span>
        <strong class="profile-cosmetic-card__name">${item.name}</strong>
        <span class="profile-cosmetic-card__type">${item.type}</span>
        <span class="profile-cosmetic-card__action">${equipped ? "Equipped" : "Equip"}</span>`;
      card.addEventListener("click", () => {
        const res = equipCosmetic(profile, filter, id);
        if (res.success) {
          saveProfile(profile);
          renderGrid();
          refreshShowcase();
          if (log) log.textContent = res.message;
        } else if (log) log.textContent = res.message;
      });
      grid.appendChild(card);
    }
    if (!owned.length) grid.innerHTML = '<p class="muted">Open cosmetic boxes to unlock items.</p>';
  };

  for (const btn of root.querySelectorAll(".profile-filter-btn")) {
    btn.addEventListener("click", () => {
      filter = btn.dataset.cosFilter;
      root.querySelectorAll(".profile-filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderGrid();
    });
  }
  root.querySelector(".profile-filter-btn")?.classList.add("active");

  for (const box of COSMETIC_BOXES) {
    const el = document.createElement("div");
    el.className = "chest-card cosmetic-box-card";
    el.innerHTML = `
      <h3 class="chest-card__name">${box.name}</h3>
      <p class="chest-card__meta">${box.pulls} cosmetics · mixed rarities</p>
      <p class="chest-card__cost"><span class="gem-cost">◆ ${box.cost}</span></p>
      <button type="button" class="btn-primary btn-open-cosmetic" data-box="${box.id}">Unseal</button>`;
    boxList.appendChild(el);
  }

  root.querySelectorAll(".btn-open-cosmetic").forEach((btn) => {
    btn.addEventListener("click", () => {
      const res = openCosmeticBox(profile, btn.dataset.box);
      if (!res.success) {
        if (log) log.textContent = res.message;
        return;
      }
      saveProfile(profile);
      onGemsChange?.();
      const names = res.pulls.map((p) => `${p.name}${p.duplicate ? " (duplicate)" : ""}`).join(", ");
      if (log) {
        log.textContent = `Opened ${res.box.name}: ${names}${res.bonusGems ? ` · +${res.bonusGems} gems from duplicates` : ""}`;
      }
      renderGrid();
      refreshShowcase();
    });
  });

  renderGrid();
}
