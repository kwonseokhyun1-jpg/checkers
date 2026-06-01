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
} from "./adventure.js";
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { openChest, CHESTS } from "./chests.js";
import { CHEST_TIERS, chestSvgMarkup } from "./chestArt.js";
import { MatchSession } from "./match.js";
import { renderProfileTab, renderCosmeticBoxes } from "./profileUI.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { boardFrameHtml } from "./board.js";
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
}

function renderProfile() {
  const root = $("view-profile");
  renderProfileTab(profile, root, { onGemsChange: updateGemHeader });
}

function updateGemHeader() {
  const el = $("header-gems");
  if (el) el.textContent = String(profile.gems);
  document.querySelector(".hud-gems")?.classList.toggle("hud-gems--low", profile.gems < 50);
}


function syncCollectionFilterControls() {
  document.querySelectorAll(".collection-owned-only-toggle").forEach((el) => {
    el.checked = collectionOwnedOnly;
  });
  const searchIds = ["collection-search", "inventory-search"];
  for (const id of searchIds) {
    const el = $(id);
    if (el) el.value = collectionFilter;
  }
  const rarityIds = ["collection-rarity", "inventory-rarity"];
  for (const id of rarityIds) {
    const el = $(id);
    if (el) el.value = collectionRarity;
  }
  const sortIds = ["collection-sort", "inventory-sort"];
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
    if (repairProfile(profile)) saveProfile(profile);
    collectionRarity = "all";
    collectionFilter = "";
    collectionOwnedOnly = false;
    syncCollectionFilterControls();
  document.querySelectorAll(".btn-reset-collection-filters").forEach((btn) => {
    btn.addEventListener("click", () => {
      collectionRarity = "all";
      collectionFilter = "";
      collectionOwnedOnly = false;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });
  }
  if (sub === "list") renderDeckList();
  if (sub === "edit") renderDeckEditor();
  if (sub === "view") renderDeckView();
}

function renderChests() {
  updateGemHeader();
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
      updateGemHeader();
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
    statusEl.className = res.success ? "inventory-status inventory-status--ok" : "inventory-status inventory-status--warn";
  }
  if (res.success) {
    updateGemHeader();
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
  updateGemHeader();
  const list = $("deck-list");
  const invGrid = $("inventory-grid");
  const invStatus = $("inventory-status");
  if (invGrid) renderInventoryGrid(invGrid, { deckEdit: false, statusEl: invStatus });
  if (!list) return;
  list.innerHTML = "";

  if (!profile.decks.length) {
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
  updateGemHeader();
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
  updateGemHeader();
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
  $("adventure-map-view")?.classList.remove("hidden");
  $("adventure-prebattle")?.classList.add("hidden");
  selectedAdventureLevel = null;
  pendingEnemyDeck = null;
  renderAdventureMap();
}

function renderAdventureMap() {
  updateGemHeader();
  const progress = profile.adventure || defaultAdventureProgress();
  if (!progress.selectedWorld) progress.selectedWorld = 1;
  selectedAdventureWorldId = progress.selectedWorld;

  const tabs = $("adventure-world-tabs");
  if (tabs) {
    tabs.innerHTML = "";
    const worlds = getWorldsForMap(progress);
    for (const w of WORLDS) {
      const unlocked = isWorldUnlocked(progress, w.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "adventure-world-tab";
      btn.dataset.world = String(w.id);
      if (w.id === selectedAdventureWorldId) btn.classList.add("active");
      if (!unlocked) btn.classList.add("adventure-world-tab--locked");
      btn.disabled = !unlocked;
      btn.textContent = w.name;
      btn.title = unlocked ? w.tagline : `Clear stage ${BONUS_WORLDS_UNLOCK_AT_LEVEL} to unlock`;
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
  if (hint && worldMeta) hint.textContent = worldMeta.tagline;

  const map = $("adventure-map");
  if (!map) return;
  map.innerHTML = "";

  for (const level of getLevelsForWorld(selectedAdventureWorldId)) {
    const unlocked = isLevelUnlocked(progress, level.id);
    const cleared = isLevelCleared(progress, level.id);
    const node = document.createElement("button");
    node.type = "button";
    node.className = "adventure-node";
    node.dataset.level = String(level.id);
    if (!unlocked) node.classList.add("adventure-node--locked");
    if (cleared) node.classList.add("adventure-node--cleared");
    node.disabled = !unlocked;
    const stars = getLevelStars(progress, level.id);
    const starBadge = stars > 0 ? `<span class="adventure-node__stars" aria-label="${stars} stars">${formatStars(stars)}</span>` : "";
    node.innerHTML = `
      <span class="adventure-node__num">${level.stageInWorld}</span>
      <span class="adventure-node__name">${level.opponent}</span>
      <span class="adventure-node__flavor">${level.flavor}</span>
      ${starBadge}
    `;
    node.addEventListener("click", () => openAdventurePrebattle(level.id));
    map.appendChild(node);
  }
}

function openAdventurePrebattle(levelId) {
  const level = getLevel(levelId);
  if (!level || !isLevelUnlocked(profile.adventure, levelId)) return;

  selectedAdventureLevel = levelId;
  pendingEnemyDeck = getOrCreateLevelEnemyDeck(profile, levelId);
  saveProfile(profile);

  $("adventure-map-view")?.classList.add("hidden");
  $("adventure-prebattle")?.classList.remove("hidden");

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

  const sel = $("adventure-deck-select");
  if (!sel) return;
  sel.innerHTML = "";
  const validDecks = profile.decks.filter((d) => d.cardIds.length === DECK_SIZE);
  if (!validDecks.length) {
    const opt = document.createElement("option");
    opt.textContent = "No complete decks — build one in Decks";
    sel.appendChild(opt);
    $("btn-start-adventure").disabled = true;
    requestAnimationFrame(() => {
      $("btn-start-adventure")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return;
  }
  for (const d of validDecks) {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    if (d.id === profile.selectedDeckId) opt.selected = true;
    sel.appendChild(opt);
  }
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
      const { gems, stars: bestStars } = recordLevelClear(profile, levelId, stars);
      profile.gems += gems;
      saveProfile(profile);
      updateGemHeader();
      return `+${gems} gems! · Best: ${formatStars(bestStars)}`;
    },
    { aiDeckIds: [...pendingEnemyDeck], opponentName, cosmetics: getEquippedCosmetics(profile) }
  );

  matchSession.setMessage("Drag a spell onto the board or tap a card, then pick highlighted squares.");
  matchSession.render();
}

function getMatchHtml(opponentName = "Opponent") {
  const safe = opponentName.replace(/</g, "");
  return `
    <div class="match-wrap match-scene">
      <button type="button" id="btn-leave-match" class="btn-text">← Leave match</button>
      <div class="game-layout">
        <aside class="panel panel-opponent">
          <div class="player-badge opponent"><span class="piece-icon black"></span> ${safe}</div>
          <div class="hand-label">Enemy hand</div>
          <div id="hand-black" class="hand hand-hidden"></div>
        </aside>
        <section class="board-section">
          <div id="turn-banner" class="turn-banner match-banner">Your turn</div>
          <div id="spell-cast-bar" class="spell-cast-bar hidden">
            <div id="spell-cast-preview" class="spell-cast-preview"></div>
            <div class="spell-cast-copy">
              <p id="spell-cast-hint" class="spell-cast-hint">Select targets on the board</p>
              <button type="button" id="btn-cancel-card" class="btn-text">Cancel spell</button>
            </div>
          </div>
          <div id="ai-spell-banner" class="ai-spell-banner hidden" role="status" aria-live="assertive">
            <div class="ai-spell-banner__inner">
              <span class="ai-spell-banner__icon" aria-hidden="true">✦</span>
              <div class="ai-spell-banner__copy">
                <p class="ai-spell-banner__label">Enemy spell</p>
                <p id="ai-spell-banner-title" class="ai-spell-banner__title"></p>
                <p id="ai-spell-banner-desc" class="ai-spell-banner__desc"></p>
              </div>
            </div>
          </div>
          ${boardFrameHtml()}
          <div id="ai-action-panel" class="ai-action-panel">
            <h3 class="ai-action-panel__title">${safe}</h3>
            <div id="ai-action-log" class="ai-action-log"></div>
          </div>
          <div id="piece-info" class="piece-info hidden" role="status" aria-live="polite"></div>
          <div id="message" class="message"></div>
        </section>
        <aside class="panel panel-player">
          <div class="player-badge you"><span class="piece-icon red"></span> You</div>
          <div class="pile-info">Deck: <span id="pile-count">0</span> left · Draw every 2 turns</div>
          <div class="hand-label">Hand <span id="hand-count">0/5</span></div>
          <div id="hand-red" class="hand spell-hand"></div>
          <button id="btn-end-cards" type="button" class="btn-secondary">Skip spell (Enter)</button>
        </aside>
      </div>
      <div id="game-over" class="overlay hidden">
        <div class="overlay-card">
          <h2 id="game-over-title">Victory</h2>
          <div id="game-over-stars" class="game-over-stars hidden" aria-hidden="true"></div>
          <p id="game-over-text"></p>
          <button id="btn-restart-match" type="button" class="btn-primary">Back to map</button>
        </div>
      </div>
    </div>
  `;
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
  document.querySelectorAll(".btn-reset-collection-filters").forEach((btn) => {
    btn.addEventListener("click", () => {
      collectionRarity = "all";
      collectionFilter = "";
      collectionOwnedOnly = false;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });
      syncCollectionFilter();
    });
  });
  syncCollectionFilterControls();
  document.querySelectorAll(".btn-reset-collection-filters").forEach((btn) => {
    btn.addEventListener("click", () => {
      collectionRarity = "all";
      collectionFilter = "";
      collectionOwnedOnly = false;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });
  $("collection-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    const inv = $("inventory-search");
    if (inv && inv.value !== collectionFilter) inv.value = collectionFilter;
    syncCollectionFilter();
  });
  $("inventory-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    const coll = $("collection-search");
    if (coll && coll.value !== collectionFilter) coll.value = collectionFilter;
    syncCollectionFilter();
  });
  $("collection-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    const inv = $("inventory-rarity");
    if (inv) inv.value = collectionRarity;
    syncCollectionFilter();
  });
  $("inventory-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    const coll = $("collection-rarity");
    if (coll) coll.value = collectionRarity;
    syncCollectionFilter();
  });
  $("collection-sort")?.addEventListener("change", (e) => {
    collectionSort = e.target.value;
    const inv = $("inventory-sort");
    if (inv) inv.value = collectionSort;
    syncCollectionFilter();
  });
  $("inventory-sort")?.addEventListener("change", (e) => {
    collectionSort = e.target.value;
    const coll = $("collection-sort");
    if (coll) coll.value = collectionSort;
    syncCollectionFilter();
  });
  $("btn-clear-deck")?.addEventListener("click", () => {
    workingDeck = [];
    renderDeckEditor();
  });
  $("btn-auto-finish-deck")?.addEventListener("click", autoFinishDeck);
  $("btn-save-deck")?.addEventListener("click", saveWorkingDeck);
  $("btn-back-adventure")?.addEventListener("click", showAdventureMap);
  $("btn-start-adventure")?.addEventListener("click", startAdventureMatch);
  $("adventure-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  showTab("deck");
}

init();
