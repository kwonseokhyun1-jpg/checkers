/**
 * Card Checkers — meta game (chests, decks, play) + match
 */
import { getPlayableCards, getCardDef, DECK_SIZE, MAX_COPIES_PER_CARD } from "./cardCatalog.js";
import {
  loadProfile,
  saveProfile,
  WIN_GEMS,
  createDeck,
  upsertDeck,
  deleteDeck,
  collectionCount,
} from "./storage.js";
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { openChest, CHESTS } from "./chests.js";
import { MatchSession } from "./match.js";
import { renderSpellCardEl } from "./cardArt.js";

let profile = loadProfile();
let activeTab = "chests";
/** @type {'list'|'edit'|'view'} */
let deckSubview = "list";
/** @type {string|null} null | 'new' | deck id */
let editingDeckId = null;
let viewingDeckId = null;
let workingDeck = [];
let collectionFilter = "";
let collectionRarity = "all";
let matchSession = null;

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
  if (tab === "play") renderPlayLobby();
}

function updateGemHeader() {
  const el = $("header-gems");
  if (el) el.textContent = String(profile.gems);
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
  if (pullsEl) pullsEl.innerHTML = "";
  if (!list) return;
  list.innerHTML = "";
  for (const chest of CHESTS) {
    const card = document.createElement("div");
    card.className = "chest-card";
    card.innerHTML = `
      <h3>${chest.name}</h3>
      <p class="chest-cost">${chest.cost} gems</p>
      <p class="chest-desc">${chest.cards} cards · non-economy spells only</p>
      <button type="button" class="btn-primary chest-open" data-id="${chest.id}">Open</button>
    `;
    const btn = card.querySelector(".chest-open");
    btn.disabled = profile.gems < chest.cost;
    btn.addEventListener("click", () => {
      const res = openChest(profile, chest.id);
      const log = $("chest-log");
      if (!res.success) {
        if (log) log.textContent = res.message;
        return;
      }
      if (log) log.textContent = `Opened ${res.chest.name}!`;
      if (pullsEl) {
        pullsEl.innerHTML = "";
        for (const def of res.pulls) {
          pullsEl.appendChild(
            renderSpellCardEl(def, { compact: true, meta: "Added to collection" })
          );
        }
      }
      saveProfile(profile);
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

function renderDeckList() {
  updateGemHeader();
  const list = $("deck-list");
  if (!list) return;
  list.innerHTML = "";

  if (!profile.decks.length) {
    list.innerHTML = `<p class="empty-msg">No decks yet. Create one to start playing!</p>`;
    return;
  }

  for (const deck of profile.decks) {
    const val = validateDeck(deck.cardIds, profile);
    const row = document.createElement("div");
    row.className = "deck-row";
    const statusClass = val.valid ? "ok" : "warn";
    row.innerHTML = `
      <div class="deck-row-info">
        <h3 class="deck-row-name">${deck.name}</h3>
        <p class="deck-status ${statusClass}">${deck.cardIds.length}/${DECK_SIZE} cards${val.valid ? " · Ready" : ""}</p>
      </div>
      <div class="deck-row-actions"></div>
    `;
    const actions = row.querySelector(".deck-row-actions");

    const btnView = document.createElement("button");
    btnView.type = "button";
    btnView.className = "btn-secondary";
    btnView.textContent = "View";
    btnView.addEventListener("click", () => {
      viewingDeckId = deck.id;
      showDeckSubview("view");
    });

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn-secondary";
    btnEdit.textContent = "Edit";
    btnEdit.addEventListener("click", () => {
      editingDeckId = deck.id;
      workingDeck = [...deck.cardIds];
      const nameInput = $("deck-name-input");
      if (nameInput) nameInput.value = deck.name;
      showDeckSubview("edit");
    });

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.className = "btn-secondary btn-danger";
    btnDelete.textContent = "Delete";
    btnDelete.addEventListener("click", () => {
      if (confirm(`Delete deck "${deck.name}"?`)) {
        deleteDeck(profile, deck.id);
        renderDeckList();
        renderPlayLobby();
      }
    });

    actions.append(btnView, btnEdit, btnDelete);
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
      : val.errors[0] || `${deck.cardIds.length}/${DECK_SIZE}`;
    status.className = val.valid ? "deck-status ok" : "deck-status warn";
  }

  grid.innerHTML = "";
  const counts = countById(deck.cardIds);
  const unique = [...new Set(deck.cardIds)];
  for (const id of unique.sort((a, b) => (getCardDef(a)?.name || "").localeCompare(getCardDef(b)?.name || ""))) {
    const def = getCardDef(id);
    if (!def) continue;
    const n = counts[id] || 0;
    grid.appendChild(renderSpellCardEl(def, { compact: true, meta: `×${n}` }));
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

  collEl.innerHTML = "";
  for (const def of getFilteredCollection()) {
    const owned = collectionCount(profile, def.id);
    const inDeck = countById(workingDeck)[def.id] || 0;
    const addCheck = canAddCardToDeck(workingDeck, def.id, profile);
    const card = renderSpellCardEl(def, {
      button: true,
      compact: true,
      disabled: !addCheck.ok,
      meta: `Owned ${owned} · In deck ${inDeck}/${MAX_COPIES_PER_CARD}`,
      onClick: () => {
        if (!addCheck.ok) {
          if (status) status.textContent = addCheck.reason;
          return;
        }
        workingDeck.push(def.id);
        renderDeckEditor();
      },
    });
    collEl.appendChild(card);
  }

  deckEl.innerHTML = "";
  workingDeck.forEach((id, i) => {
    const def = getCardDef(id);
    if (!def) return;
    const card = renderSpellCardEl(def, {
      button: true,
      tiny: true,
      onClick: () => {
        workingDeck.splice(i, 1);
        renderDeckEditor();
      },
    });
    card.title = "Click to remove";
    deckEl.appendChild(card);
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

function renderPlayLobby() {
  updateGemHeader();
  const sel = $("play-deck-select");
  if (!sel) return;
  sel.innerHTML = "";
  const validDecks = profile.decks.filter((d) => d.cardIds.length === DECK_SIZE);
  if (!validDecks.length) {
    const opt = document.createElement("option");
    opt.textContent = "No complete decks — build one in Decks tab";
    sel.appendChild(opt);
    $("btn-start-match").disabled = true;
    return;
  }
  for (const d of validDecks) {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = d.name;
    if (d.id === profile.selectedDeckId) opt.selected = true;
    sel.appendChild(opt);
  }
  $("btn-start-match").disabled = false;
}

function startMatch() {
  const deckId = $("play-deck-select")?.value;
  const deck = profile.decks.find((d) => d.id === deckId);
  if (!deck || deck.cardIds.length !== DECK_SIZE) return;

  $("view-play").classList.add("hidden");
  $("view-match").classList.remove("hidden");
  const root = $("view-match");
  root.innerHTML = getMatchHtml();

  matchSession = new MatchSession(
    deck.cardIds,
    root,
    () => {
      matchSession = null;
      root.innerHTML = "";
      $("view-match").classList.add("hidden");
      showTab("play");
    },
    () => {
      profile.gems += WIN_GEMS;
      saveProfile(profile);
      updateGemHeader();
    }
  );

  matchSession.setMessage("3 cards in hand · 1 spell per turn · draw every 2 turns.");
  matchSession.render();
}

function getMatchHtml() {
  return `
    <div class="match-wrap">
      <button type="button" id="btn-leave-match" class="btn-text">← Leave match</button>
      <div class="game-layout">
        <aside class="panel panel-opponent">
          <div class="player-badge opponent"><span class="piece-icon black"></span> Shadow Court</div>
          <div class="hand-label">AI hand</div>
          <div id="hand-black" class="hand hand-hidden"></div>
        </aside>
        <section class="board-section">
          <div id="turn-banner" class="turn-banner">Your turn</div>
          <div id="board" class="board"></div>
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
      <div id="card-modal" class="modal hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-content modal-content--card">
          <div id="modal-card-preview"></div>
          <h2 id="modal-title">Play card</h2>
          <p id="modal-desc" class="modal-desc"></p>
          <p id="modal-hint" class="modal-hint"></p>
          <button id="btn-cancel-card" type="button" class="btn-secondary">Cancel</button>
        </div>
      </div>
      <div id="game-over" class="overlay hidden">
        <div class="overlay-card">
          <h2 id="game-over-title">Victory</h2>
          <p id="game-over-text"></p>
          <button id="btn-restart-match" type="button" class="btn-primary">Back to lobby</button>
        </div>
      </div>
    </div>
  `;
}

function init() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.dataset.tab));
  });

  $("btn-new-deck")?.addEventListener("click", startNewDeck);
  $("btn-back-from-edit")?.addEventListener("click", () => showDeckSubview("list"));
  $("btn-back-from-view")?.addEventListener("click", () => showDeckSubview("list"));

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
  $("btn-start-match")?.addEventListener("click", startMatch);
  $("play-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  showTab("chests");
}

init();
