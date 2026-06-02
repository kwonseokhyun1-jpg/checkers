/**
 * Arcane Checkers — meta game (chests, decks, play) + match
 */
import { getPlayableCards, getCardDef, DECK_SIZE, maxCopiesForCard } from "./cardCatalog.js";
import {
  loadProfile,
  repairProfile,
  saveProfile,
  createDeck,
  upsertDeck,
  deleteDeck,
  collectionCount,
  buildBeginnerDeckCardIds,
} from "./storage.js";
import {
  getAdventureLevels,
  getLevelsForWorld,
  WORLDS,
  getWorldsForMap,
  areBonusWorldsUnlocked,
  defaultAdventureProgress,
  BONUS_WORLDS_UNLOCK_AT_LEVEL,
  isWorldUnlocked,
  getLevel,
  getOrCreateLevelEnemyDeck,
  getEnemyDeckPreview,
  isLevelUnlocked,
  isLevelCleared,
  gemsForLevelClear,
  recordLevelClear,
  formatStars,
  getLevelStars,
  MAP_PIN_LAYOUT,
  getNextPlayableLevelId,
  repairAdventureProgress,
  getWorldForLevel,
} from "./adventure.js";
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { openChest, CHESTS } from "./chests.js";
import { CHEST_TIERS, chestSvgMarkup } from "./chestArt.js";
import { MatchSession } from "./match.js";
import { renderProfileTab, renderCosmeticBoxes } from "./profileUI.js";
import { openMysteryBox, MYSTERY_BOX_COST } from "./mysteryBox.js";
import { playStarCollectAnimation } from "./starCollectAnimation.js";
import { playCosmeticOpenAnimation } from "./cosmeticOpenAnimation.js";
import { initAuthUI } from "./authUI.js";
import { initPvpUI } from "./pvpUI.js";
import { getMatchHtml } from "./matchView.js";
import { initAuth } from "./auth.js";
import { pullCloudProfile } from "./cloudProfile.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { renderSpellCardEl } from "./cardArt.js";
import { showCardPreview, bindCardPreviewModal, closeCardPreview } from "./cardPreview.js";
import { staggerCardReveal, onCardRevealed } from "./cardAnimations.js";
import { playChestOpenAnimation } from "./chestOpenAnimation.js";
import { getBuyCost, tryBuyCardCopy } from "./cardShop.js";

let profile;
try {
  profile = loadProfile();
} catch (err) {
  console.error("Failed to load profile, resetting save:", err);
  localStorage.removeItem("cardCheckersProfile_v6");
  localStorage.removeItem("cardCheckersProfile_v5");
  profile = loadProfile();
}
let activeTab = "deck";
/** @type {'list'|'edit'|'view'} */
let deckSubview = "list";
/** @type {string|null} null | 'new' | deck id */
let editingDeckId = null;
let viewingDeckId = null;
let workingDeck = [];
let collectionFilter = "";
let collectionRarity = "all";
let collectionSort = "rarity-desc";
let collectionOwnedOnly = true;

const RARITY_RANK = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };

function sortCollectionCards(cards) {
  return [...cards].sort((a, b) => {
    const ra = RARITY_RANK[a.rarity] ?? 0;
    const rb = RARITY_RANK[b.rarity] ?? 0;
    if (ra !== rb) return collectionSort === "rarity-asc" ? ra - rb : rb - ra;
    return a.name.localeCompare(b.name);
  });
}
let matchSession = null;
let pvpController = null;
/** @type {number|null} */
let selectedAdventureLevel = null;
let selectedAdventureWorldId = 1;
/** @type {string[]|null} */
let pendingEnemyDeck = null;

function rarityRank(def) {
  return RARITY_RANK[def?.rarity] ?? 0;
}

/** Unique cards in deck, rarest first */
function getDeckStacks(cardIds) {
  const counts = countById(cardIds);
  return Object.entries(counts)
    .map(([id, count]) => ({ def: getCardDef(id), count }))
    .filter((x) => x.def)
    .sort((a, b) => {
      const dr = rarityRank(b.def) - rarityRank(a.def);
      if (dr !== 0) return dr;
      return a.def.name.localeCompare(b.def.name);
    });
}

function removeOneFromDeck(cardId) {
  const i = workingDeck.indexOf(cardId);
  if (i < 0) return;
  workingDeck.splice(i, 1);
  renderDeckEditor();
}

function autoFinishDeck() {
  const candidates = getPlayableCards()
    .map((def) => ({ def, owned: collectionCount(profile, def.id) }))
    .filter((x) => x.owned > 0)
    .sort((a, b) => {
      const dr = rarityRank(b.def) - rarityRank(a.def);
      if (dr !== 0) return dr;
      return a.def.name.localeCompare(b.def.name);
    });

  workingDeck = [];
  for (const { def, owned } of candidates) {
    const copies = Math.min(owned, maxCopiesForCard(def));
    for (let i = 0; i < copies && workingDeck.length < DECK_SIZE; i++) {
      workingDeck.push(def.id);
    }
    if (workingDeck.length >= DECK_SIZE) break;
  }
  renderDeckEditor();
}

function autoFinishBeginnerDeck() {
  workingDeck = buildBeginnerDeckCardIds(profile.collection || {});
  renderDeckEditor();
}

const $ = (id) => document.getElementById(id);

function showTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("hidden", v.id !== `view-${tab}`);
  });
  if (tab === "chests") renderChests();
  if (tab === "deck") {
    deckSubview = "list";
    editingDeckId = null;
    viewingDeckId = null;
    showDeckSubview("list");
  }
  if (tab === "profile") renderProfile();
  if (tab === "play") showAdventureMap();
  if (tab === "pvp") pvpController?.render();
}

function renderProfile() {
  const root = $("view-profile");
  renderProfileTab(profile, root, { onGemsChange: updateGemHeader });
}

function updateCurrencyHeader() {
  const gemsEl = $("header-gems");
  if (gemsEl) gemsEl.textContent = String(profile.gems ?? 0);
  const starsEl = $("header-stars");
  if (starsEl) starsEl.textContent = String(profile.stars ?? 0);
  document.querySelector(".hud-gems")?.classList.toggle("hud-gems--low", (profile.gems ?? 0) < 50);
  document.querySelector(".hud-stars")?.classList.toggle("hud-stars--low", (profile.stars ?? 0) < MYSTERY_BOX_COST);
}

function updateGemHeader() {
  updateCurrencyHeader();
}


function syncCollectionFilterControls() {
  document.querySelectorAll(".collection-owned-only-toggle").forEach((el) => {
    el.checked = collectionOwnedOnly;
  });
  const searchIds = ["collection-search"];
  for (const id of searchIds) {
    const el = $(id);
    if (el) el.value = collectionFilter;
  }
  const rarityIds = ["collection-rarity"];
  for (const id of rarityIds) {
    const el = $(id);
    if (el) el.value = collectionRarity;
  }
  const sortIds = ["collection-sort"];
  for (const id of sortIds) {
    const el = $(id);
    if (el) el.value = collectionSort;
  }
}

function showDeckSubview(sub) {
  deckSubview = sub;
  $("deck-subview-list")?.classList.toggle("hidden", sub !== "list");
  $("deck-subview-edit")?.classList.toggle("hidden", sub !== "edit");
  $("deck-subview-view")?.classList.toggle("hidden", sub !== "view");

  if (sub === "edit") {
    repairProfile(profile);
    saveProfile(profile);
    collectionRarity = "all";
    collectionFilter = "";
    collectionOwnedOnly = false;
    syncCollectionFilterControls();
  }

  if (sub === "list") renderDeckList();
  if (sub === "edit") renderDeckEditor();
  if (sub === "view") renderDeckView();
}


function renderMysteryBox() {
  const root = $("mystery-box-card");
  if (!root) return;
  const canAfford = (profile.stars ?? 0) >= MYSTERY_BOX_COST;
  root.innerHTML = `
    <article class="mystery-box ${canAfford ? "" : "mystery-box--locked"}">
      <div class="mystery-box__glow" aria-hidden="true"></div>
      <div class="mystery-box__icon" aria-hidden="true">?</div>
      <h3 class="mystery-box__title">Mystery Box</h3>
      <p class="mystery-box__desc">Random spell reliquary <em>or</em> cosmetic vanity — tier odds match the Vault.</p>
      <p class="mystery-box__cost"><span aria-hidden="true">★</span> ${MYSTERY_BOX_COST} stars</p>
      <button type="button" class="btn-primary" id="btn-open-mystery" ${canAfford ? "" : "disabled"}>
        ${canAfford ? "Open mystery box" : "Need more stars"}
      </button>
    </article>`;
  root.querySelector("#btn-open-mystery")?.addEventListener("click", async () => {
    const log = $("mystery-box-log");
    const res = openMysteryBox(profile);
    if (!res.success) {
      if (log) log.textContent = res.message;
      return;
    }
    saveProfile(profile);
    updateCurrencyHeader();
    if (log) log.textContent = res.message;
    if (res.kind === "card") {
      const pullsEl = $("chest-pulls");
      if (pullsEl) {
        pullsEl.innerHTML = "";
        pullsEl.classList.remove("chest-pulls--hidden");
        for (const card of res.pulls) pullsEl.appendChild(renderSpellCardEl(card, { small: true }));
      }
    } else {
      await playCosmeticOpenAnimation({ boxId: res.tier?.id || "bronze", boxLabel: "Mystery", pulls: res.pulls });
    }
    renderMysteryBox();
    renderChests();
    renderProfile();
  });
}

function renderChests() {
  renderMysteryBox();
  updateCurrencyHeader();
  const list = $("chest-list");
  const pullsEl = $("chest-pulls");
  if (pullsEl) {
    pullsEl.innerHTML = "";
    pullsEl.classList.add("chest-pulls--hidden");
    pullsEl.classList.remove("chest-pulls--reveal");
  }
  if (!list) return;
  list.innerHTML = "";

  for (const chest of CHESTS) {
    const tier = CHEST_TIERS[chest.id] || CHEST_TIERS.bronze;
    const canAfford = profile.gems >= chest.cost;
    const card = document.createElement("article");
    card.className = `chest-card chest-card--${chest.id}${canAfford ? "" : " chest-card--locked"}`;

    const rarityHint =
      chest.id === "gold"
        ? "Epic & rare focus"
        : chest.id === "silver"
          ? "Balanced arcane haul"
          : "Starter spell tide";

    card.innerHTML = `
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${chestSvgMarkup(chest.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${tier.label}</span>
        <h3 class="chest-card__name">${chest.name}</h3>
        <p class="chest-card__tagline">${tier.tagline}</p>
        <ul class="chest-card__stats">
          <li><strong>${chest.cards}</strong> spells</li>
          <li>${rarityHint}</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${chest.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary chest-open chest-card__btn" data-id="${chest.id}">
        ${canAfford ? "Unseal" : "Need more gems"}
      </button>
    `;

    const btn = card.querySelector(".chest-open");
    btn.disabled = !canAfford;
    btn.addEventListener("click", async () => {
      if (btn.disabled) return;
      const res = openChest(profile, chest.id);
      const log = $("chest-log");
      if (!res.success) {
        if (log) {
          log.textContent = res.message;
          log.classList.add("chest-log--error");
        }
        return;
      }

      saveProfile(profile);
      updateCurrencyHeader();
      btn.disabled = true;

      await playChestOpenAnimation({
        tier: chest.id,
        tierLabel: tier.label,
        pulls: res.pulls,
      });

      if (log) {
        log.textContent = `The ${tier.label} yields ${res.pulls.length} new spells!`;
        log.classList.remove("chest-log--error");
      }

      if (pullsEl) {
        pullsEl.classList.remove("chest-pulls--hidden");
        pullsEl.classList.add("chest-pulls--reveal");
        pullsEl.innerHTML = `<p class="chest-pulls__label">Reliquary opened</p><div class="chest-pulls__grid"></div>`;
        const grid = pullsEl.querySelector(".chest-pulls__grid");
        res.pulls.forEach((def, i) => {
          const pulled = renderSpellCardEl(def, {
            button: true,
            deal: true,
            meta: "Added to collection",
            onClick: () => showCardPreview(def, { meta: "Added to collection" }),
          });
          pulled.style.animationDelay = `${i * 0.12}s`;
          grid.appendChild(pulled);
          onCardRevealed(pulled, def.rarity);
        });
        staggerCardReveal(grid);
        pullsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      renderChests();
    });
    list.appendChild(card);
  }

  renderCosmeticBoxes(profile, $("cosmetic-box-list"), {
    logEl: $("cosmetic-box-log"),
    onGemsChange: updateGemHeader,
    onOpened: () => {
      if (activeTab === "profile") renderProfile();
    },
  });
}

function getFilteredCollection() {
  const playable = getPlayableCards();
  const filtered = playable.filter((c) => {
    if (collectionRarity !== "all" && c.rarity !== collectionRarity) return false;
    if (collectionFilter) {
      const q = collectionFilter.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    }
    if (collectionOwnedOnly && collectionCount(profile, c.id) <= 0) return false;
    return true;
  });
  return sortCollectionCards(filtered);
}

function buyCardFromInventory(cardId, statusEl) {
  const res = tryBuyCardCopy(profile, cardId);
  if (statusEl) {
    statusEl.textContent = res.message;
    statusEl.className = res.success ? "deck-status ok" : "deck-status warn";
  }
  if (res.success) {
    saveProfile(profile);
    updateCurrencyHeader();
    if (deckSubview === "list") renderDeckList();
    if (deckSubview === "edit") renderDeckEditor();
  }
  return res;
}

/**
 * @param {HTMLElement|null} container
 * @param {{ deckEdit?: boolean, statusEl?: HTMLElement|null }} opts
 */
function addCardToWorkingDeck(cardId) {
  const addCheck = canAddCardToDeck(workingDeck, cardId, profile);
  if (!addCheck.ok) {
    const deckStatus = $("deck-status");
    if (deckStatus) deckStatus.textContent = addCheck.reason;
    return false;
  }
  workingDeck.push(cardId);
  renderDeckEditor();
  return true;
}

function renderInventoryGrid(container, opts = {}) {
  if (!container) return;
  const { deckEdit = false, statusEl = null } = opts;
  container.innerHTML = "";

  const cards = getFilteredCollection();
  if (!cards.length) {
    const empty = document.createElement("p");
    empty.className = "collection-grid-empty muted";
    empty.textContent = deckEdit
      ? "No spells match your filters. Try “All rarities”, clear search, or uncheck Owned only."
      : "No cards match your filters. Open chests in the Vault to discover spells.";
    container.appendChild(empty);
    return;
  }

  for (const def of cards) {
    try {
      const owned = collectionCount(profile, def.id);
      const cap = maxCopiesForCard(def);
      const atMaxCopies = owned >= cap;
      const cost = getBuyCost(def.rarity);
      const canAfford = profile.gems >= cost && !atMaxCopies;
      const addCheck = deckEdit ? canAddCardToDeck(workingDeck, def.id, profile) : { ok: false };
      const wrap = document.createElement("div");
      wrap.className = "collection-card-wrap" + (owned < 1 ? " collection-card-wrap--unowned" : "");

      const buyOne = () => buyCardFromInventory(def.id, statusEl);

      const openInspect = () => {
        const inDeck = deckEdit ? countById(workingDeck)[def.id] || 0 : 0;
        showCardPreview(def, {
          meta: deckEdit
            ? `Owned ${owned}/${cap} · In deck ${inDeck}/${cap} · ${atMaxCopies ? "max copies" : `${cost} gems per copy`}`
            : `Owned ${owned}/${cap}${atMaxCopies ? " · max copies" : ` · ${cost} gems per copy`}`,
          buyLabel: atMaxCopies ? "Max copies owned" : `Buy copy (${cost} gems)`,
          buyDisabled: !canAfford || atMaxCopies || owned < 1,
          onBuy: () => {
            buyOne();
            closeCardPreview();
          },
          addDisabled: !addCheck.ok,
          onAdd: deckEdit
            ? () => {
                if (addCardToWorkingDeck(def.id)) closeCardPreview();
              }
            : undefined,
        });
      };

      const card = renderSpellCardEl(def, {
        button: true,
        compact: true,
        disabled: !deckEdit && (owned < 1 || atMaxCopies),
        onClick: (e) => {
          if (e.shiftKey) {
            openInspect();
            return;
          }
          if (deckEdit) {
            if (addCheck.ok) addCardToWorkingDeck(def.id);
            else if ($("deck-status")) $("deck-status").textContent = addCheck.reason;
            return;
          }
          if (owned < 1 || atMaxCopies) return;
          buyOne();
        },
      });
      card.title = deckEdit
        ? addCheck.ok
          ? `${def.name} — tap to add to deck. Shift+click to inspect.`
          : `${def.name} — ${addCheck.reason}. Shift+click to inspect.`
        : atMaxCopies
          ? `${def.name} — max ${cap} copies owned. Shift+click to inspect.`
          : `${def.name} — tap to buy (${cost} gems). Shift+click to inspect.`;
      wrap.appendChild(card);

      const ownedBadge = document.createElement("span");
      ownedBadge.className = "collection-owned-count";
      ownedBadge.textContent = owned > 0 ? `×${owned}` : "—";
      wrap.appendChild(ownedBadge);

      if (!deckEdit) {
        const costBadge = document.createElement("span");
        costBadge.className = "collection-buy-cost";
        costBadge.textContent = atMaxCopies ? "MAX" : `${cost} ◆`;
        if (!canAfford || atMaxCopies) costBadge.classList.add("collection-buy-cost--cant");
        wrap.appendChild(costBadge);
      } else if (owned >= 1 && !atMaxCopies) {
        const costBadge = document.createElement("button");
        costBadge.type = "button";
        costBadge.className = "collection-buy-cost collection-buy-cost--btn";
        costBadge.textContent = `${cost} ◆`;
        costBadge.title = `Buy another copy (${cost} gems)`;
        costBadge.disabled = !canAfford;
        if (!canAfford) costBadge.classList.add("collection-buy-cost--cant");
        costBadge.addEventListener("click", (e) => {
          e.stopPropagation();
          buyOne();
        });
        wrap.appendChild(costBadge);
      }

      if (deckEdit) {
        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn-add-to-deck";
        addBtn.title = addCheck.ok ? "Add to deck" : addCheck.reason;
        addBtn.textContent = "+";
        addBtn.disabled = !addCheck.ok;
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          addCardToWorkingDeck(def.id);
        });
        wrap.appendChild(addBtn);
      }

      if (deckEdit && !addCheck.ok) card.classList.add("spell-card--deck-blocked");
      container.appendChild(wrap);
    } catch (err) {
      console.error("Failed to render card:", def?.id, err);
    }
  }

  if (cards.length > 0 && container.childElementCount === 0) {
    const fail = document.createElement("p");
    fail.className = "collection-grid-empty collection-grid-empty--error";
    fail.textContent = "Spells failed to display. Hard refresh the page (Ctrl+Shift+R).";
    container.appendChild(fail);
  }
}


function openDeckView(deckId) {
  viewingDeckId = deckId;
  showDeckSubview("view");
}

function renderDeckList() {
  if (repairProfile(profile)) saveProfile(profile);
  updateCurrencyHeader();
  const list = $("deck-list");
  if (!list) return;
  list.innerHTML = "";

  if (!profile.decks.length) {
    if (repairProfile(profile)) saveProfile(profile);
    if (profile.decks.length) {
      renderDeckList();
      return;
    }
    list.innerHTML = `<p class="empty-msg">No decks yet. Tap <strong>+ New deck</strong> to create one.</p>`;
    return;
  }

  for (const deck of profile.decks) {
    const val = validateDeck(deck.cardIds, profile);
    const statusClass = val.valid ? "ok" : "warn";
    const row = document.createElement("button");
    row.type = "button";
    row.className = "deck-row deck-row--open";
    row.innerHTML = `
      <div class="deck-row-info">
        <h3 class="deck-row-name">${deck.name}</h3>
        <p class="deck-status ${statusClass}">${deck.cardIds.length}/${DECK_SIZE} cards${val.valid ? " · Ready to play" : " · Incomplete"}</p>
        <p class="deck-row-hint">Tap to view cards</p>
      </div>
      <span class="deck-row-chevron" aria-hidden="true">›</span>
    `;
    row.addEventListener("click", () => openDeckView(deck.id));
    list.appendChild(row);
  }
}

function renderDeckView() {
  updateCurrencyHeader();
  const deck = profile.decks.find((d) => d.id === viewingDeckId);
  const title = $("view-deck-title");
  const status = $("view-deck-status");
  const grid = $("view-deck-cards");
  if (!deck || !grid) return;

  if (title) title.textContent = deck.name;
  const val = validateDeck(deck.cardIds, profile);
  if (status) {
    status.textContent = val.valid
      ? `${DECK_SIZE} cards — ready to play`
      : val.errors[0] || `${deck.cardIds.length}/${DECK_SIZE} cards`;
    status.className = val.valid ? "deck-status ok" : "deck-status warn";
  }

  grid.innerHTML = "";
  for (const { def, count } of getDeckStacks(deck.cardIds)) {
    const card = renderSpellCardEl(def, {
      button: true,
      meta: count > 1 ? `×${count}` : undefined,
      onClick: () =>
        showCardPreview(def, {
          meta: count > 1 ? `${count} copies in this deck` : "In your deck",
        }),
    });
    grid.appendChild(card);
  }
}

function renderDeckEditor() {
  updateCurrencyHeader();
  const collEl = $("collection-grid");
  const deckEl = $("deck-slots");
  const status = $("deck-status");
  const heading = $("edit-deck-heading");
  if (!collEl || !deckEl) return;

  if (heading) {
    heading.textContent = editingDeckId === "new" ? "New deck" : "Edit deck";
  }

  const val = validateDeck(workingDeck, profile);
  if (status) {
    status.textContent = val.valid
      ? `Ready — ${workingDeck.length}/${DECK_SIZE} cards`
      : val.errors[0] || `${workingDeck.length}/${DECK_SIZE} cards`;
    status.className = val.valid ? "deck-status ok" : "deck-status warn";
  }

  const progressFill = $("deck-progress-fill");
  const pct = Math.min(100, (workingDeck.length / DECK_SIZE) * 100);
  if (progressFill) progressFill.style.width = `${pct}%`;

  renderInventoryGrid(collEl, { deckEdit: true, statusEl: status });

  deckEl.innerHTML = "";
  for (const { def, count } of getDeckStacks(workingDeck)) {
    const slot = document.createElement("div");
    slot.className = "deck-slot-wrap";
    const card = renderSpellCardEl(def, {
      button: true,
      small: true,
      onClick: () => {
        showCardPreview(def, {
          meta: count > 1 ? `×${count} in your deck` : "In your deck",
          onRemove: () => removeOneFromDeck(def.id),
        });
      },
    });
    slot.appendChild(card);
    if (count > 1) {
      const badge = document.createElement("span");
      badge.className = "deck-stack-count";
      badge.textContent = `×${count}`;
      slot.appendChild(badge);
    }
    const rem = document.createElement("button");
    rem.type = "button";
    rem.className = "deck-slot-remove";
    rem.setAttribute("aria-label", "Remove one copy from deck");
    rem.textContent = "×";
    rem.addEventListener("click", (e) => {
      e.stopPropagation();
      removeOneFromDeck(def.id);
    });
    slot.appendChild(rem);
    deckEl.appendChild(slot);
  }
  const openSlots = DECK_SIZE - workingDeck.length;
  if (openSlots > 0) {
    const hint = document.createElement("p");
    hint.className = "deck-slots-open";
    hint.textContent = openSlots === 1 ? "1 open slot" : `${openSlots} open slots`;
    deckEl.appendChild(hint);
  }
}

function saveWorkingDeck() {
  const name = $("deck-name-input")?.value?.trim() || "My Deck";
  const val = validateDeck(workingDeck, profile);
  if (!val.valid) {
    $("deck-status").textContent = val.errors.join(" ");
    return;
  }
  let deck;
  if (editingDeckId && editingDeckId !== "new") {
    deck = profile.decks.find((d) => d.id === editingDeckId);
    if (deck) {
      deck.name = name;
      deck.cardIds = [...workingDeck];
      deck.updatedAt = Date.now();
    } else {
      deck = createDeck(name, workingDeck);
    }
  } else {
    deck = createDeck(name, workingDeck);
  }
  upsertDeck(profile, deck);
  profile.selectedDeckId = deck.id;
  saveProfile(profile);
  editingDeckId = null;
  workingDeck = [];
  showDeckSubview("list");
}

function startNewDeck() {
  editingDeckId = "new";
  workingDeck = [];
  const nameInput = $("deck-name-input");
  if (nameInput) nameInput.value = "New Deck";
  showDeckSubview("edit");
}

function showAdventureMap() {
  profile.adventure = repairAdventureProgress(profile.adventure);
  $("adventure-map-view")?.classList.remove("hidden");
  $("adventure-prebattle")?.classList.add("hidden");
  selectedAdventureLevel = null;
  pendingEnemyDeck = null;
  renderAdventureMap();
}


function getMapSceneryMarkup(theme) {
  if (theme === "verdant") {
    return `<svg class="adventure-map-scenery-svg" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5a9ec8"/>
          <stop offset="45%" stop-color="#8ec4a8"/>
          <stop offset="100%" stop-color="#2d5a38"/>
        </linearGradient>
        <linearGradient id="mapHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3d7a48"/>
          <stop offset="100%" stop-color="#1a3a24"/>
        </linearGradient>
      </defs>
      <rect width="400" height="700" fill="url(#mapSky)"/>
      <ellipse cx="200" cy="520" rx="260" ry="120" fill="url(#mapHill)" opacity="0.9"/>
      <ellipse cx="90" cy="560" rx="100" ry="70" fill="#1e4a2e" opacity="0.85"/>
      <ellipse cx="320" cy="550" rx="110" ry="75" fill="#1e4a2e" opacity="0.85"/>
      <!-- castle -->
      <path fill="#2a3548" d="M155 380 h90 v55 h-90z M170 355 h15 v25 h-15z M215 355 h15 v25 h-15z M185 340 h30 v15 h-30z"/>
      <path fill="#3a4a5a" d="M160 435 h80 v12 h-80z"/>
      <rect x="192" y="395" width="16" height="22" rx="2" fill="#1a2430"/>
      <!-- trees -->
      <polygon points="55,480 70,420 85,480" fill="#0f2818"/>
      <rect x="66" y="478" width="8" height="18" fill="#3d2818"/>
      <polygon points="30,510 48,440 66,510" fill="#143220"/>
      <rect x="42" y="508" width="10" height="22" fill="#3d2818"/>
      <polygon points="330,470 348,400 366,470" fill="#0f2818"/>
      <rect x="341" y="468" width="8" height="20" fill="#3d2818"/>
      <polygon points="355,500 375,430 395,500" fill="#143220"/>
      <rect x="368" y="498" width="10" height="24" fill="#3d2818"/>
      <polygon points="110,520 128,455 146,520" fill="#0f2818"/>
      <rect x="121" y="518" width="8" height="16" fill="#3d2818"/>
      <polygon points="250,515 268,450 286,515" fill="#143220"/>
      <rect x="259" y="513" width="8" height="18" fill="#3d2818"/>
    </svg>`;
  }
  return "";
}


function renderAdventureMap() {
  updateCurrencyHeader();
  const progress = repairAdventureProgress(profile.adventure);
  profile.adventure = progress;
  const nextId = getNextPlayableLevelId(progress);
  const nextLevel = getLevel(nextId);
  if (nextLevel) {
    progress.selectedWorld = nextLevel.worldId;
    selectedAdventureWorldId = nextLevel.worldId;
  } else {
    selectedAdventureWorldId = progress.selectedWorld || 1;
  }

  const tabs = $("adventure-world-tabs");
  if (tabs) {
    tabs.innerHTML = "";
    const worlds = getWorldsForMap(progress);
    for (const w of WORLDS) {
      const unlocked = isWorldUnlocked(progress, w.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "adventure-world-shield";
      btn.dataset.world = String(w.id);
      if (w.id === selectedAdventureWorldId) btn.classList.add("active");
      if (!unlocked) btn.classList.add("adventure-world-shield--locked");
      btn.disabled = !unlocked;
      btn.innerHTML = `<span class="adventure-world-shield__icon" aria-hidden="true"></span><span class="adventure-world-shield__label">Chapter ${w.id}</span>`;
      btn.title = unlocked ? w.name : `Clear stage ${BONUS_WORLDS_UNLOCK_AT_LEVEL} to unlock`;
      btn.addEventListener("click", () => {
        if (!isWorldUnlocked(progress, w.id)) return;
        selectedAdventureWorldId = w.id;
        progress.selectedWorld = w.id;
        saveProfile(profile);
        renderAdventureMap();
      });
      tabs.appendChild(btn);
    }
    if (!isWorldUnlocked(progress, selectedAdventureWorldId)) {
      selectedAdventureWorldId = worlds[0]?.id || 1;
      progress.selectedWorld = selectedAdventureWorldId;
    }
  }

  const hint = $("adventure-world-hint");
  const worldMeta = WORLDS.find((w) => w.id === selectedAdventureWorldId);
  if (hint && worldMeta) hint.textContent = `${worldMeta.name} — ${worldMeta.tagline}`;

  const map = $("adventure-map");
  if (!map) return;
  const theme = worldMeta?.theme || "verdant";
  map.className = `adventure-map-canvas adventure-map-canvas--${theme}`;
  map.setAttribute("role", "group");
  map.setAttribute("aria-label", "Stage map");
  map.innerHTML = `
    <div class="adventure-map-canvas__bg" aria-hidden="true">
      <div class="adventure-map-scenery adventure-map-scenery--${theme}" aria-hidden="true">${getMapSceneryMarkup(theme)}</div>
    </div>
    <svg class="adventure-map-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="pointer-events:none"></svg>
    <div class="adventure-map-pins"></div>`;

  const pathEl = map.querySelector(".adventure-map-path");
  const pinsLayer = map.querySelector(".adventure-map-pins");
  const points = [];
  const levels = getLevelsForWorld(selectedAdventureWorldId);

  function activateMapPin(levelId) {
    const live = repairAdventureProgress(profile.adventure);
    profile.adventure = live;
    if (!isLevelUnlocked(live, levelId)) {
      const hintEl = $("adventure-world-hint");
      if (hintEl) hintEl.textContent = `Locked — beat global stage ${levelId - 1} first, then return here.`;
      return;
    }
    saveProfile(profile);
    openAdventurePrebattle(levelId);
  }

  levels.forEach((level, i) => {
    const pos = MAP_PIN_LAYOUT[i] || MAP_PIN_LAYOUT[MAP_PIN_LAYOUT.length - 1];
    const unlocked = isLevelUnlocked(progress, level.id);
    const cleared = isLevelCleared(progress, level.id);
    const isNext = level.id === nextId && unlocked;
    const stars = getLevelStars(progress, level.id);
    points.push(`${pos.left},${pos.top}`);

    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "adventure-map-pin";
    pin.style.left = `${pos.left}%`;
    pin.style.top = `${pos.top}%`;
    pin.dataset.level = String(level.id);
    if (!unlocked) pin.classList.add("adventure-map-pin--locked");
    if (cleared) pin.classList.add("adventure-map-pin--cleared");
    if (isNext) pin.classList.add("adventure-map-pin--next");
    pin.setAttribute("aria-disabled", unlocked ? "false" : "true");
    if (!unlocked) pin.title = `Clear global stage ${level.id - 1} to unlock`;
    pin.setAttribute("aria-label", `Stage ${level.stageInWorld}: ${level.opponent}`);
    const starLine = stars > 0 ? `<span class="adventure-map-pin__stars">${formatStars(stars)}</span>` : "";
    pin.innerHTML = `
      ${isNext ? '<span class="adventure-map-pin__next">NEXT</span>' : ""}
      <span class="adventure-map-pin__diamond" aria-hidden="true"></span>
      <span class="adventure-map-pin__title">${level.stageInWorld}. ${level.opponent}</span>
      <span class="adventure-map-pin__flavor">${level.flavor}</span>
      ${starLine}`;
    if (!unlocked) pin.disabled = true;
    const go = (e) => {
      e.preventDefault();
      e.stopPropagation();
      activateMapPin(level.id);
    };
    pin.addEventListener("click", go);
    pin.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateMapPin(level.id);
      }
    });
    pinsLayer?.appendChild(pin);
  });

  if (pathEl && points.length > 1) {
    pathEl.innerHTML = `<polyline points="${points.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.35"/>`;
  }

  const nextPin = map.querySelector(".adventure-map-pin--next");
  if (nextPin) requestAnimationFrame(() => nextPin.scrollIntoView({ behavior: "smooth", block: "center" }));
}


function openAdventurePrebattle(levelId) {
  const level = getLevel(levelId);
  if (!level || !isLevelUnlocked(profile.adventure, levelId)) return;

  selectedAdventureLevel = levelId;
  pendingEnemyDeck = getOrCreateLevelEnemyDeck(profile, levelId);
  saveProfile(profile);

  $("adventure-map-view")?.classList.add("hidden");
  $("adventure-prebattle")?.classList.remove("hidden");
  requestAnimationFrame(() => {
    $("adventure-prebattle")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  const title = $("prebattle-title");
  const flavor = $("prebattle-flavor");
  const opponent = $("prebattle-opponent");
  const gemHint = $("prebattle-gem-hint");
  if (title) title.textContent = `${level.name}: ${level.opponent}`;
  if (flavor) flavor.textContent = level.flavor;
  if (opponent) opponent.textContent = "Review the enemy spell deck below, then choose your grimoire.";
  if (gemHint) {
    const gems = gemsForLevelClear(profile.adventure, levelId);
    gemHint.textContent = isLevelCleared(profile.adventure, levelId)
      ? `Repeat clear: +${gems} gems`
      : `First clear: +${gems} gems`;
  }

  const preview = $("enemy-deck-preview");
  if (preview) {
    preview.innerHTML = "";
    for (const { def, count } of getEnemyDeckPreview(pendingEnemyDeck)) {
      const card = renderSpellCardEl(def, {
        button: true,
        small: true,
        meta: count > 1 ? `×${count} in deck` : undefined,
        onClick: () =>
          showCardPreview(def, {
            meta: count > 1 ? `${count} copies in enemy deck` : "Enemy deck",
          }),
      });
      preview.appendChild(card);
    }
  }

  if (repairProfile(profile)) saveProfile(profile);

  const sel = $("adventure-deck-select");
  if (!sel) return;
  sel.innerHTML = "";
  const validDecks = profile.decks.filter((d) => validateDeck(d.cardIds, profile).valid);
  if (!validDecks.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No complete decks — build one in Decks";
    sel.appendChild(opt);
    sel.disabled = true;
    $("btn-start-adventure").disabled = true;
    requestAnimationFrame(() => {
      $("btn-start-adventure")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }
  sel.disabled = false;
  const preferredId =
    profile.selectedDeckId && validDecks.some((d) => d.id === profile.selectedDeckId)
      ? profile.selectedDeckId
      : validDecks[0].id;
  for (const d of validDecks) {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    if (d.id === preferredId) opt.selected = true;
    sel.appendChild(opt);
  }
  profile.selectedDeckId = preferredId;
  $("btn-start-adventure").disabled = false;
  const startBtn = $("btn-start-adventure");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      startBtn?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

function startAdventureMatch() {
  const deckId = $("adventure-deck-select")?.value;
  const deck = profile.decks.find((d) => d.id === deckId);
  const level = selectedAdventureLevel ? getLevel(selectedAdventureLevel) : null;
  if (!deck || deck.cardIds.length !== DECK_SIZE || !level || !pendingEnemyDeck) return;

  const opponentName = level.opponent;
  $("view-play").classList.add("hidden");
  $("view-match").classList.remove("hidden");
  const root = $("view-match");
  root.innerHTML = getMatchHtml(opponentName);

  const levelId = selectedAdventureLevel;
  matchSession = new MatchSession(
    deck.cardIds,
    root,
    () => {
      matchSession = null;
      root.innerHTML = "";
      $("view-match").classList.add("hidden");
      showTab("play");
    },
    (stars) => {
      const { gems, stars: bestStars, starsGained } = recordLevelClear(profile, levelId, stars);
      profile.gems += gems;
      saveProfile(profile);
      updateCurrencyHeader();
      return {
        message: `+${gems} gems! · Best: ${formatStars(bestStars)}`,
        starsGained,
      };
    },
    { aiDeckIds: [...pendingEnemyDeck], opponentName, cosmetics: getEquippedCosmetics(profile) }
  );

  matchSession.setMessage("Drag a spell onto the board or tap a card, then pick highlighted squares.");
  matchSession.render();
}


function init() {
  bindCardPreviewModal();
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  $("btn-new-deck")?.addEventListener("click", startNewDeck);
  $("btn-back-from-edit")?.addEventListener("click", () => showDeckSubview("list"));
  $("btn-back-from-view")?.addEventListener("click", () => showDeckSubview("list"));
  $("btn-edit-from-view")?.addEventListener("click", () => {
    const deck = profile.decks.find((d) => d.id === viewingDeckId);
    if (!deck) return;
    editingDeckId = deck.id;
    workingDeck = [...deck.cardIds];
    const nameInput = $("deck-name-input");
    if (nameInput) nameInput.value = deck.name;
    showDeckSubview("edit");
  });
  $("btn-delete-from-view")?.addEventListener("click", () => {
    const deck = profile.decks.find((d) => d.id === viewingDeckId);
    if (!deck || !confirm(`Delete deck "${deck.name}"?`)) return;
    deleteDeck(profile, deck.id);
    showDeckSubview("list");
    showAdventureMap();
  });

  const syncCollectionFilter = () => {
    if (deckSubview === "edit") renderDeckEditor();
    if (deckSubview === "list") renderDeckList();
  };

  document.querySelectorAll(".collection-owned-only-toggle").forEach((el) => {
    el.addEventListener("change", (e) => {
      collectionOwnedOnly = e.target.checked;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });

  document.querySelectorAll(".btn-reset-collection-filters").forEach((btn) => {
    btn.addEventListener("click", () => {
      collectionRarity = "all";
      collectionFilter = "";
      collectionOwnedOnly = false;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });

  syncCollectionFilterControls();

  $("collection-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    syncCollectionFilter();
  });
  $("collection-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    syncCollectionFilter();
  });
  $("collection-sort")?.addEventListener("change", (e) => {
    collectionSort = e.target.value;
    syncCollectionFilter();
  });

  $("btn-clear-deck")?.addEventListener("click", () => {
    workingDeck = [];
    renderDeckEditor();
  });
  $("btn-beginner-fill-deck")?.addEventListener("click", autoFinishBeginnerDeck);
  $("btn-auto-finish-deck")?.addEventListener("click", autoFinishDeck);
  $("btn-save-deck")?.addEventListener("click", saveWorkingDeck);
  $("btn-back-adventure")?.addEventListener("click", showAdventureMap);
  $("btn-start-adventure")?.addEventListener("click", startAdventureMatch);
  $("adventure-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  const authModal = document.getElementById("auth-modal");
  const authBtn = document.getElementById("auth-header-btn");
  initAuthUI({
    authBtn,
    modal: authModal,
    onSignedIn: () => {
      profile = loadProfile();
      updateCurrencyHeader();
      renderDeckList();
      pvpController?.render();
    },
  });

  pvpController = initPvpUI({
    root: document.getElementById("view-pvp"),
    getProfile: () => profile,
    openAuthModal: () => authModal?.classList.remove("hidden"),
  });

  initAuth().then(async (user) => {
    if (user) {
      try {
        const cloud = await pullCloudProfile();
        if (cloud) profile = cloud;
      } catch (e) {
        console.warn(e);
      }
      repairProfile(profile);
      saveProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
    }
  });

  repairProfile(profile);
  collectionOwnedOnly = false;
  syncCollectionFilterControls();
  showTab("deck");
}

init();
