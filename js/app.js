/**
 * Card Checkers — meta game (chests, deck builder, play lobby) + match
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
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { openChest, CHESTS } from "./chests.js";
import { MatchSession } from "./match.js";

let profile = loadProfile();
let activeTab = "chests";
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
  if (tab === "deck") renderDeckBuilder();
  if (tab === "play") renderPlayLobby();
}

function updateGemHeader() {
  const el = $("header-gems");
  if (el) el.textContent = String(profile.gems);
}

function renderChests() {
  updateGemHeader();
  const list = $("chest-list");
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
      const names = res.pulls.map((c) => c.name).join(", ");
      if (log) log.textContent = `Opened ${res.chest.name}: ${names}`;
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

function renderDeckBuilder() {
  updateGemHeader();
  const collEl = $("collection-grid");
  const deckEl = $("deck-slots");
  const status = $("deck-status");
  if (!collEl || !deckEl) return;

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
    const row = document.createElement("button");
    row.type = "button";
    row.className = `collection-card ${def.rarity}`;
    row.innerHTML = `
      <span class="card-name">${def.name}</span>
      <span class="card-meta">Owned ${owned} · In deck ${inDeck}/${MAX_COPIES_PER_CARD}</span>
    `;
    const addCheck = canAddCardToDeck(workingDeck, def.id, profile);
    if (!addCheck.ok) row.classList.add("disabled");
    row.addEventListener("click", () => {
      if (!addCheck.ok) {
        if (status) status.textContent = addCheck.reason;
        return;
      }
      workingDeck.push(def.id);
      renderDeckBuilder();
    });
    collEl.appendChild(row);
  }

  deckEl.innerHTML = "";
  workingDeck.forEach((id, i) => {
    const def = getCardDef(id);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "deck-chip";
    chip.textContent = def?.name || id;
    chip.title = "Click to remove";
    chip.addEventListener("click", () => {
      workingDeck.splice(i, 1);
      renderDeckBuilder();
    });
    deckEl.appendChild(chip);
  });
  for (let i = workingDeck.length; i < DECK_SIZE; i++) {
    const empty = document.createElement("div");
    empty.className = "deck-chip empty";
    empty.textContent = "—";
    deckEl.appendChild(empty);
  }

  const saved = $("saved-decks");
  if (saved) {
    saved.innerHTML = "";
    for (const d of profile.decks) {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = `${d.name} (${d.cardIds.length}/${DECK_SIZE})`;
      if (d.id === profile.selectedDeckId) opt.selected = true;
      saved.appendChild(opt);
    }
  }
}

function renderPlayLobby() {
  updateGemHeader();
  const sel = $("play-deck-select");
  if (!sel) return;
  sel.innerHTML = "";
  const validDecks = profile.decks.filter((d) => d.cardIds.length === DECK_SIZE);
  if (!validDecks.length) {
    const opt = document.createElement("option");
    opt.textContent = "No complete decks — build one first";
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

function loadWorkingDeckFromSelected() {
  const id = $("saved-decks")?.value || profile.selectedDeckId;
  const deck = profile.decks.find((d) => d.id === id);
  workingDeck = deck ? [...deck.cardIds] : [];
}

function saveWorkingDeck() {
  const name = $("deck-name-input")?.value?.trim() || "My Deck";
  const val = validateDeck(workingDeck, profile);
  if (!val.valid) {
    $("deck-status").textContent = val.errors.join(" ");
    return;
  }
  const existingId = $("saved-decks")?.value;
  let deck;
  if (existingId && profile.decks.some((d) => d.id === existingId)) {
    deck = profile.decks.find((d) => d.id === existingId);
    deck.name = name;
    deck.cardIds = [...workingDeck];
    deck.updatedAt = Date.now();
  } else {
    deck = createDeck(name, workingDeck);
  }
  upsertDeck(profile, deck);
  profile.selectedDeckId = deck.id;
  saveProfile(profile);
  $("deck-status").textContent = `Saved "${deck.name}".`;
  renderDeckBuilder();
}

function startMatch() {
  const deckId = $("play-deck-select")?.value;
  const deck = profile.decks.find((d) => d.id === deckId);
  if (!deck || deck.cardIds.length !== DECK_SIZE) return;

  $("view-play").classList.add("hidden");
  $("view-match").classList.remove("hidden");
  const root = $("view-match");
  root.innerHTML = getMatchHtml();

  matchSession = new MatchSession(deck.cardIds, root, () => {
    matchSession = null;
    root.innerHTML = "";
    $("view-match").classList.add("hidden");
    showTab("play");
  });

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
          <div id="hand-red" class="hand"></div>
          <button id="btn-end-cards" type="button" class="btn-secondary">Done with spells → move</button>
        </aside>
      </div>
      <div id="card-modal" class="modal hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
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

  $("collection-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    renderDeckBuilder();
  });
  $("collection-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    renderDeckBuilder();
  });
  $("btn-clear-deck")?.addEventListener("click", () => {
    workingDeck = [];
    renderDeckBuilder();
  });
  $("btn-save-deck")?.addEventListener("click", saveWorkingDeck);
  $("saved-decks")?.addEventListener("change", () => {
    loadWorkingDeckFromSelected();
    const d = profile.decks.find((x) => x.id === $("saved-decks").value);
    if ($("deck-name-input") && d) $("deck-name-input").value = d.name;
    renderDeckBuilder();
  });
  $("btn-delete-deck")?.addEventListener("click", () => {
    const id = $("saved-decks")?.value;
    if (!id) return;
    deleteDeck(profile, id);
    workingDeck = [];
    renderDeckBuilder();
    renderPlayLobby();
  });
  $("btn-start-match")?.addEventListener("click", startMatch);
  $("play-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  if (profile.decks.length) {
    loadWorkingDeckFromSelected();
    const d = profile.decks.find((x) => x.id === profile.selectedDeckId);
    if ($("deck-name-input") && d) $("deck-name-input").value = d.name;
  }

  showTab("chests");
}

init();
