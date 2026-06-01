/**
 * Arcane Checkers — meta game (chests, decks, play) + match
 */
import { getPlayableCards, getCardDef, DECK_SIZE, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import {
  loadProfile,
  saveProfile,
  createDeck,
  upsertDeck,
  deleteDeck,
  collectionCount,
} from "./storage.js";
import {
  getAdventureLevels,
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
import { boardFrameHtml } from "./board.js";
import { renderSpellCardEl } from "./cardArt.js";
import { showCardPreview, bindCardPreviewModal } from "./cardPreview.js";
import { staggerCardReveal, onCardRevealed } from "./cardAnimations.js";
import { playChestOpenAnimation } from "./chestOpenAnimation.js";

let profile = loadProfile();
let activeTab = "deck";
/** @type {'list'|'edit'|'view'} */
let deckSubview = "list";
/** @type {string|null} null | 'new' | deck id */
let editingDeckId = null;
let viewingDeckId = null;
let workingDeck = [];
let collectionFilter = "";
let collectionRarity = "all";
let matchSession = null;
/** @type {number|null} */
let selectedAdventureLevel = null;
/** @type {string[]|null} */
let pendingEnemyDeck = null;

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
  if (tab === "play") showAdventureMap();
}

function updateGemHeader() {
  const el = $("header-gems");
  if (el) el.textContent = String(profile.gems);
  document.querySelector(".hud-gems")?.classList.toggle("hud-gems--low", profile.gems < 50);
}

function showDeckSubview(sub) {
  deckSubview = sub;
  $("deck-subview-list")?.classList.toggle("hidden", sub !== "list");
  $("deck-subview-edit")?.classList.toggle("hidden", sub !== "edit");
  $("deck-subview-view")?.classList.toggle("hidden", sub !== "view");

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
}

function getFilteredCollection() {
  const playable = getPlayableCards();
  return playable.filter((c) => {
    if (collectionRarity !== "all" && c.rarity !== collectionRarity) return false;
    if (collectionFilter) {
      const q = collectionFilter.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) return false;
    }
    return collectionCount(profile, c.id) > 0;
  });
}

function openDeckView(deckId) {
  viewingDeckId = deckId;
  showDeckSubview("view");
}

function renderDeckList() {
  updateGemHeader();
  const list = $("deck-list");
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
  for (const id of deck.cardIds) {
    const def = getCardDef(id);
    if (def) {
      const card = renderSpellCardEl(def, { button: true, onClick: () => showCardPreview(def) });
      grid.appendChild(card);
    }
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

  collEl.innerHTML = "";
  for (const def of getFilteredCollection()) {
    const owned = collectionCount(profile, def.id);
    const inDeck = countById(workingDeck)[def.id] || 0;
    const addCheck = canAddCardToDeck(workingDeck, def.id, profile);
    const wrap = document.createElement("div");
    wrap.className = "collection-card-wrap";

    const addToDeck = () => {
      if (!addCheck.ok) {
        if (status) status.textContent = addCheck.reason;
        return;
      }
      workingDeck.push(def.id);
      renderDeckEditor();
    };

    const card = renderSpellCardEl(def, {
      button: true,
      onClick: () => {
        showCardPreview(def, {
          meta: `Owned ${owned} · In deck ${inDeck}/${MAX_COPIES_PER_CARD}`,
          addDisabled: !addCheck.ok,
          onAdd: addToDeck,
        });
      },
    });
    wrap.appendChild(card);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn-add-to-deck";
    addBtn.title = addCheck.ok ? "Add to deck" : addCheck.reason;
    addBtn.textContent = "+";
    addBtn.disabled = !addCheck.ok;
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToDeck();
    });
    wrap.appendChild(addBtn);
    collEl.appendChild(wrap);
  }

  deckEl.innerHTML = "";
  workingDeck.forEach((id, i) => {
    const def = getCardDef(id);
    if (!def) return;
    const slot = document.createElement("div");
    slot.className = "deck-slot-wrap";
    const card = renderSpellCardEl(def, {
      button: true,
      small: true,
      onClick: () => {
        showCardPreview(def, {
          meta: "In your deck",
          onRemove: () => {
            workingDeck.splice(i, 1);
            renderDeckEditor();
          },
        });
      },
    });
    const rem = document.createElement("button");
    rem.type = "button";
    rem.className = "deck-slot-remove";
    rem.setAttribute("aria-label", "Remove from deck");
    rem.textContent = "×";
    rem.addEventListener("click", (e) => {
      e.stopPropagation();
      workingDeck.splice(i, 1);
      renderDeckEditor();
    });
    slot.appendChild(card);
    slot.appendChild(rem);
    deckEl.appendChild(slot);
  });
  for (let i = workingDeck.length; i < DECK_SIZE; i++) {
    const empty = document.createElement("div");
    empty.className = "deck-slot-empty";
    empty.textContent = "+";
    deckEl.appendChild(empty);
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
  const map = $("adventure-map");
  if (!map) return;
  map.innerHTML = "";
  const progress = profile.adventure;

  for (const level of getAdventureLevels()) {
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
      <span class="adventure-node__num">${level.id}</span>
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
    { aiDeckIds: [...pendingEnemyDeck], opponentName }
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
          <div id="message" class="message"></div>
        </section>
        <aside class="panel panel-player">
          <div class="player-badge you"><span class="piece-icon red"></span> You</div>
          <div class="pile-info">Deck: <span id="pile-count">0</span> left · Draw every 2 turns</div>
          <div class="hand-label">Hand <span id="hand-count">0/5</span></div>
          <div id="hand-red" class="hand spell-hand"></div>
          <button id="btn-end-cards" type="button" class="btn-secondary">Done with spells → move</button>
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

  $("collection-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    if (deckSubview === "edit") renderDeckEditor();
  });
  $("collection-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    if (deckSubview === "edit") renderDeckEditor();
  });
  $("btn-clear-deck")?.addEventListener("click", () => {
    workingDeck = [];
    renderDeckEditor();
  });
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
