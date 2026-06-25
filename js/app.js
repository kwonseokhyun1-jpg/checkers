/**
 * Arcane Checkers — meta game (chests, decks, play) + match
 */
import { getPlayableCards, getCardDef, DECK_SIZE, maxCopiesForCard } from "./cardCatalog.js";
import {
  CARD_CATEGORY_ORDER,
  CARD_CATEGORY_LABELS,
  getCardCategory,
} from "./cardCategories.js";
import {
  loadProfile,
  repairProfile,
  saveProfile,
  createDeck,
  upsertDeck,
  deleteDeck,
  collectionCount,
  isCardNew,
  clearCardNew,
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
  repairAdventureProgress,
  getNextPlayableLevelId,
  getWorldForLevel,
  isQuestsAndPvpUnlocked,
  QUESTS_PVP_UNLOCK_MESSAGE,
  isCosmeticsUnlocked,
  COSMETICS_UNLOCK_MESSAGE,
} from "./adventure.js";
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { syncExplorer } from "./achievements.js";
import { openChest, CHESTS } from "./chests.js";
import { CHEST_TIERS, chestSvgMarkup } from "./chestArt.js";
import { smallMysteryBoxSvgMarkup, bigMysteryBoxSvgMarkup } from "./mysteryBoxArt.js";
import { MatchSession } from "./match.js";
import {
  renderProfileTab,
  renderCosmeticBoxes,
  renderQuestsTab,
  headerProfileAvatarHtml,
  resolveDisplayUsername,
} from "./profileUI.js";
import {
  openMysteryBox,
  openBigMysteryBox,
  MYSTERY_BOX_COST,
  BIG_MYSTERY_BOX_COST,
  SMALL_MYSTERY_BOX_COSMETIC_CHANCE,
} from "./mysteryBox.js";
import { playStarCollectAnimation } from "./starCollectAnimation.js";
import { playCosmeticOpenAnimation } from "./cosmeticOpenAnimation.js";
import { initAuthUI } from "./authUI.js";
import { initAuthGate, requiresAuthGate } from "./authGate.js";
import {
  shouldShowInteractiveTutorial,
  shouldShowMetaTutorial,
  shouldShowQuestsTutorial,
  shouldShowPvpTutorial,
  shouldShowCosmeticsTutorial,
  prepareInteractiveTutorialForNewAccount,
  syncTutorialStorageWithProfile,
} from "./tutorial.js";
import { startInteractiveTutorial } from "./tutorialMatch.js";
import { startMetaTutorial, notifyMetaTutorial } from "./tutorialMeta.js";
import { startQuestsTutorial, startPvpTutorial, startCosmeticsTutorial, notifyUnlockTutorial } from "./tutorialUnlocks.js";
import { initPvpUI } from "./pvpUI.js";
import { clearAllWaitingRoomsOnce } from "./pvp.js";
import { getMatchHtml } from "./matchView.js";
import {
  bindMatchVisibilityHandlers,
  enterMatchMode,
  exitMatchMode,
  isMatchActive,
  isLiveMatchUiVisible,
  reconcileMatchShellState,
  setPendingNavigationTab,
  consumePendingNavigationTab,
  armLeaveConfirmSkip,
  clearMatchCheckpoint,
  readMatchCheckpoint,
  saveMatchCheckpoint,
} from "./matchLifecycle.js";
import { mobileConfirm } from "./mobileConfirm.js";
import { enhanceAllSelectInputs, resolveNativeSelect } from "./customSelect.js";
import { getCurrentUser, initAuth } from "./auth.js";
import { pullCloudProfile } from "./cloudProfile.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { renderSpellCardEl, escapeHtml } from "./cardArt.js";
import { showCardPreview, bindCardPreviewModal, closeCardPreview } from "./cardPreview.js";
import { staggerCardReveal, onCardRevealed } from "./cardAnimations.js";
import { playChestOpenAnimation } from "./chestOpenAnimation.js";
import { getBuyCost, tryBuyCardCopy } from "./cardShop.js";
import { initNavIcons } from "./navIcons.js";
import { initSettings } from "./settings.js";
import { renderSettingsTab } from "./settingsUI.js";
import { initAudio, setAudioMode, AudioSfx } from "./audio.js";
import { initOrientation, lockPortrait } from "./orientation.js";
import { initNetworkBanner } from "./networkBanner.js";
import { initCapacitor } from "./capacitorInit.js";
import { hapticLight } from "./haptics.js";

let profile;

try {
  profile = loadProfile();
} catch (err) {
  console.error("Failed to load profile, resetting save:", err);
  localStorage.removeItem("cardCheckersProfile_v7");
  localStorage.removeItem("cardCheckersProfile_v5");
  profile = loadProfile();
}
let activeTab = "deck";
const TAB_LABELS = {
  deck: "Decks",
  chests: "Shop",
  play: "Play",
  pvp: "PvP",
  quests: "Quests",
  profile: "Profile",
  settings: "Settings",
};
const MAIN_TABS = new Set(Object.keys(TAB_LABELS));
/** @type {'cards'|'cosmetics'|'star'} */
let activeVaultTab = "cards";
/** @type {'list'|'edit'|'view'} */
let deckSubview = "list";
/** @type {string|null} null | 'new' | deck id */
let editingDeckId = null;
let workingDeck = [];
let collectionFilter = "";
let collectionRarity = "all";
let collectionSort = "rarity-desc";
let collectionCategory = "all";
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
/** @type {ReturnType<typeof initAuthGate> | null} */
let authGate = null;
/** @type {ReturnType<typeof initAuthUI> | null} */
let authUI = null;
let tutorialRunning = false;
let bypassQuestsPvpGate = false;
let bypassCosmeticsGate = false;
let pendingPostStage1Tutorials = false;
let pendingPostStage5CosmeticsTutorial = false;
/** @type {number|null} */
let postStage1TutorialTimer = null;
/** @type {number|null} */
let postStage5CosmeticsTutorialTimer = null;
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
  notifyMetaTutorial("card-removed-from-deck", { cardId });
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

function ensureStageModalOnBody() {
  const modal = document.getElementById("adventure-prebattle");
  if (modal && modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }
}

function showStageModal() {
  ensureStageModalOnBody();
  const modal = document.getElementById("adventure-prebattle");
  modal?.classList.remove("hidden");
  document.body.classList.add("adventure-stage-open");
}

function hideStageModal() {
  document.getElementById("adventure-prebattle")?.classList.add("hidden");
  document.body.classList.remove("adventure-stage-open");
}

function showUnlockHint(message = QUESTS_PVP_UNLOCK_MESSAGE) {
  const hint = $("adventure-world-hint");
  if (hint) hint.textContent = message;
}

function syncMainTabShellState() {
  document.body.classList.toggle("main-tab-active", MAIN_TABS.has(activeTab));
  document.body.classList.toggle("adventure-active", activeTab === "play");
}

function syncNavUnlockState() {
  const unlocked = isQuestsAndPvpUnlocked(profile);
  for (const tab of ["quests", "pvp"]) {
    const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (!btn) continue;
    btn.classList.toggle("tab-btn--locked", !unlocked);
    btn.title = unlocked ? "" : QUESTS_PVP_UNLOCK_MESSAGE;
    btn.setAttribute("aria-disabled", unlocked ? "false" : "true");
  }

  const cosmeticsUnlocked = isCosmeticsUnlocked(profile);
  const cosmeticsTab = document.querySelector('.vault-tab[data-vault-tab="cosmetics"]');
  if (cosmeticsTab) {
    cosmeticsTab.classList.toggle("vault-tab--locked", !cosmeticsUnlocked);
    cosmeticsTab.title = cosmeticsUnlocked ? "" : COSMETICS_UNLOCK_MESSAGE;
    cosmeticsTab.setAttribute("aria-disabled", cosmeticsUnlocked ? "false" : "true");
  }
}

async function showTab(tab) {
  const matchView = document.getElementById("view-match");
  if (tutorialRunning && matchView && !matchView.classList.contains("hidden")) {
    return;
  }
  if (
    !bypassQuestsPvpGate &&
    (tab === "quests" || tab === "pvp") &&
    !isQuestsAndPvpUnlocked(profile)
  ) {
    showUnlockHint();
    bypassQuestsPvpGate = true;
    showTab("play");
    bypassQuestsPvpGate = false;
    return;
  }
  reconcileMatchShellState();
  if (isMatchActive() && isLiveMatchUiVisible()) {
    if (tab === activeTab) return;
    const label = TAB_LABELS[tab] || tab;
    if (
      !(await mobileConfirm(`Leave your current match to open ${label}?`, {
        title: "Leave match?",
        confirmLabel: "Leave",
        cancelLabel: "Stay",
        destructive: true,
      }))
    ) {
      return;
    }
    setPendingNavigationTab(tab);
    armLeaveConfirmSkip();
    document.querySelector("#btn-leave-match")?.click();
    return;
  }
  if (tab !== "deck" && deckSubview === "edit") {
    unlockBodyScrollForDeckEdit();
    document.body.classList.remove("deck-editing");
  }
  activeTab = tab;
  syncMainTabShellState();
  if (MAIN_TABS.has(tab)) {
    scrollMainTabToTop();
  }
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document.querySelectorAll(".view").forEach((v) => {
    v.classList.toggle("hidden", v.id !== `view-${tab}`);
  });
  notifyMetaTutorial("tab-changed", { tab });
  notifyUnlockTutorial("tab-changed", { tab });
  if (tab === "chests") {
    showVaultTab(activeVaultTab);
    renderChests();
  }
  if (tab === "deck") {
    deckSubview = "list";
    editingDeckId = null;
    showDeckSubview("list");
  }
  if (tab === "profile") renderProfile();
  if (tab === "settings") renderSettings();
  if (tab === "quests") renderQuests();
  if (tab === "play") showAdventureMap();
  if (tab === "pvp") pvpController?.render({ resume: true });
  if (!isMatchActive()) {
    setAudioMode(tab === "play" || tab === "pvp" ? "hub" : "hub");
    await lockPortrait();
  }
}

let headerDisplayUsername = "";

function updateHeaderProfileBtn(username = headerDisplayUsername) {
  if (username) headerDisplayUsername = username;
  const profileMenu = document.getElementById("header-profile-menu");
  const profileBtn = document.getElementById("header-profile-btn");
  const usernameEl = document.getElementById("header-username");
  const authBtn = document.getElementById("auth-header-btn");
  const user = getCurrentUser();
  const signedIn = Boolean(user);

  if (authBtn) {
    authBtn.classList.toggle("hidden", signedIn);
    authBtn.hidden = signedIn;
  }
  if (profileMenu) {
    profileMenu.classList.toggle("hidden", !signedIn);
    profileMenu.hidden = !signedIn;
  }
  if (usernameEl) {
    const showUsername = signedIn && headerDisplayUsername;
    usernameEl.textContent = showUsername ? headerDisplayUsername : "";
    usernameEl.classList.toggle("hidden", !showUsername);
    usernameEl.hidden = !showUsername;
  }
  if (profileBtn && signedIn) {
    profileBtn.innerHTML = headerProfileAvatarHtml(profile, headerDisplayUsername);
    profileBtn.title = headerDisplayUsername ? `Account — ${headerDisplayUsername}` : "Account menu";
  }
}

function closeHeaderProfileMenu() {
  const profileBtn = document.getElementById("header-profile-btn");
  const dropdown = document.getElementById("header-profile-dropdown");
  if (!profileBtn || !dropdown) return;
  dropdown.classList.add("hidden");
  dropdown.hidden = true;
  profileBtn.setAttribute("aria-expanded", "false");
}

function initHeaderProfileMenu() {
  const menuRoot = document.getElementById("header-profile-menu");
  const profileBtn = document.getElementById("header-profile-btn");
  const dropdown = document.getElementById("header-profile-dropdown");
  if (!menuRoot || !profileBtn || !dropdown) return;

  const setOpen = (open) => {
    dropdown.classList.toggle("hidden", !open);
    dropdown.hidden = !open;
    profileBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.hidden;
    setOpen(!isOpen);
  });

  dropdown.querySelectorAll("[data-profile-menu-action]").forEach((item) => {
    item.addEventListener("click", () => {
      const action = item.dataset.profileMenuAction;
      closeHeaderProfileMenu();
      if (action === "settings") showTab("settings");
      else openProfileTab();
    });
  });

  document.addEventListener("click", (e) => {
    if (dropdown.hidden) return;
    if (menuRoot.contains(e.target)) return;
    closeHeaderProfileMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dropdown.hidden) closeHeaderProfileMenu();
  });
}

async function refreshHeaderIdentity() {
  const user = getCurrentUser();
  if (!user) {
    headerDisplayUsername = "";
    updateHeaderProfileBtn();
    return;
  }
  headerDisplayUsername = await resolveDisplayUsername(user);
  updateHeaderProfileBtn();
}

function openProfileTab() {
  closeHeaderProfileMenu();
  showTab("profile");
  notifyUnlockTutorial("profile-opened");
}

function renderProfile() {
  const root = $("view-profile");
  renderProfileTab(profile, root, {
    onGemsChange: updateGemHeader,
    onTitleChanged: () => updateHeaderProfileBtn(),
  });
}

function renderSettings() {
  const root = $("view-settings");
  renderSettingsTab(root, {
    onUsernameChanged: (name) => {
      headerDisplayUsername = name;
      updateHeaderProfileBtn(name);
    },
  });
}

function renderQuests() {
  renderQuestsTab(profile, $("view-quests"), {
    onTitleChanged: () => updateHeaderProfileBtn(),
  });
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
    const el = resolveNativeSelect(id);
    if (el) el.value = collectionRarity;
  }
  const categoryEl = resolveNativeSelect("collection-category");
  if (categoryEl) categoryEl.value = collectionCategory;
}

const DECK_EDIT_MOBILE_MQ = "(max-width: 899px)";
const MAIN_TAB_INNER_SCROLL_MQ = "(max-width: 768px)";
/** @type {number|null} */
let deckListScrollYBeforeEdit = null;

function usesMobileDeckEditorScrollLock() {
  return window.matchMedia(DECK_EDIT_MOBILE_MQ).matches;
}

function usesMainTabInnerScroll() {
  return (
    document.body.classList.contains("main-tab-active") &&
    !document.body.classList.contains("match-active") &&
    !document.body.classList.contains("deck-editing") &&
    window.matchMedia(MAIN_TAB_INNER_SCROLL_MQ).matches
  );
}

function getMainTabScrollEl() {
  return document.querySelector(".game-main");
}

function getMainTabScrollY() {
  const main = getMainTabScrollEl();
  if (usesMainTabInnerScroll() && main) return main.scrollTop;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function setMainTabScrollY(y) {
  const main = getMainTabScrollEl();
  if (usesMainTabInnerScroll() && main) {
    main.scrollTop = y;
    return;
  }
  window.scrollTo(0, y);
}

function scrollMainTabToTop() {
  const main = getMainTabScrollEl();
  if (usesMainTabInnerScroll() && main) {
    main.scrollTop = 0;
    return;
  }
  window.scrollTo(0, 0);
}

/** iOS keeps window scroll when body overflow is hidden; lock body at y=0 for mobile edit. */
function lockBodyScrollForDeckEdit() {
  if (!usesMobileDeckEditorScrollLock()) return;
  deckListScrollYBeforeEdit = getMainTabScrollY();
  document.body.style.position = "fixed";
  document.body.style.top = "0";
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockBodyScrollForDeckEdit() {
  if (deckListScrollYBeforeEdit == null) return;
  const restoreY = deckListScrollYBeforeEdit;
  deckListScrollYBeforeEdit = null;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  setMainTabScrollY(restoreY);
}

function scrollDeckEditViewToTop() {
  scrollMainTabToTop();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelector(".game-shell")?.scrollTo?.(0, 0);
  getMainTabScrollEl()?.scrollTo?.(0, 0);
  document.querySelector("#view-deck")?.scrollTo?.(0, 0);
  document
    .querySelectorAll(
      "#deck-subview-edit, #deck-subview-edit .deck-editor, #deck-subview-edit .deck-editor__body, #deck-subview-edit .deck-editor__grid, #deck-subview-edit .deck-editor__grid-cards"
    )
    .forEach((el) => {
      el.scrollTop = 0;
    });
}

function showDeckSubview(sub) {
  if (sub !== "edit") unlockBodyScrollForDeckEdit();

  deckSubview = sub;
  document.body.classList.toggle("deck-editing", sub === "edit");
  $("deck-subview-list")?.classList.toggle("hidden", sub !== "list");
  $("deck-subview-edit")?.classList.toggle("hidden", sub !== "edit");

  if (sub === "edit") {
    lockBodyScrollForDeckEdit();
    repairProfile(profile);
    saveProfile(profile);
    collectionRarity = "all";
    collectionFilter = "";
    collectionCategory = "all";
    collectionOwnedOnly = true;
    syncCollectionFilterControls();
  }

  if (sub === "list") renderDeckList();
  if (sub === "edit") {
    renderDeckEditor();
    scrollDeckEditViewToTop();
    requestAnimationFrame(() => {
      scrollDeckEditViewToTop();
      requestAnimationFrame(scrollDeckEditViewToTop);
    });
  }
}


function mysteryBoxHtml({ id, title, desc, cost, big = false }) {
  const canAfford = (profile.stars ?? 0) >= cost;
  const art = big ? bigMysteryBoxSvgMarkup() : smallMysteryBoxSvgMarkup();
  return `
    <article class="mystery-box ${big ? "mystery-box--big" : ""} ${canAfford ? "mystery-box--ready" : "mystery-box--locked"}" data-mystery-id="${id}" role="button" tabindex="0" aria-label="Open ${title} for ${cost} stars">
      <div class="mystery-box__glow" aria-hidden="true"></div>
      <div class="mystery-box__visual" aria-hidden="true">${art}</div>
      <h3 class="mystery-box__title">${title}</h3>
      <p class="mystery-box__desc">${desc}</p>
      <p class="mystery-box__cost"><span aria-hidden="true">★</span> ${cost} stars</p>
      <button type="button" class="btn-primary mystery-box__btn" data-mystery-open="${id}" ${canAfford ? "" : "disabled"}>
        ${canAfford ? `Open for ${cost} ★` : "Need more stars"}
      </button>
    </article>`;
}

function bindMysteryBoxCard(article, openFn) {
  const btn = article.querySelector("[data-mystery-open]");
  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    openFn();
  });
  article.addEventListener("click", openFn);
  article.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFn();
    }
  });
}

async function playMysteryResult(res, log) {
  if (res.kind === "card") {
    await playChestOpenAnimation({
      tier: res.tier.id,
      tierLabel: `Small Mystery Box — ${res.tier.name}`,
      pulls: res.pulls,
    });
    if (log) log.textContent = `Got ${res.pulls.length} spells from ${res.tier.name}.`;
  } else if (res.kind === "cosmetic") {
    await playCosmeticOpenAnimation({
      boxId: res.tier?.id || "bronze",
      boxLabel: "Small Mystery Box",
      pulls: res.pulls,
    });
    if (log) {
      log.textContent = res.message + (res.bonusGems ? ` (+${res.bonusGems} gem refund)` : "");
    }
  } else if (res.kind === "both") {
    await playChestOpenAnimation({
      tier: res.cardTier.id,
      tierLabel: `Big Mystery — ${res.cardTier.name}`,
      pulls: res.cardPulls,
    });
    await playCosmeticOpenAnimation({
      boxId: res.cosTier?.id || "gold",
      boxLabel: "Big Mystery Box",
      pulls: res.cosPulls,
    });
    if (log) {
      const refund = res.bonusGems ? ` (+${res.bonusGems} gem refund)` : "";
      log.textContent = `${res.message}${refund}`;
    }
  }
}

async function handleOpenMysteryBox({ big = false } = {}) {
  const log = $("mystery-box-log");
  const cost = big ? BIG_MYSTERY_BOX_COST : MYSTERY_BOX_COST;
  const canAfford = (profile.stars ?? 0) >= cost;
  if (!canAfford) {
    if (log) {
      log.textContent = `Need ${cost} ★ stars. Clear Adventure stages to earn stars.`;
      log.classList.add("chest-log--error");
    }
    return;
  }

  const res = big ? openBigMysteryBox(profile) : openMysteryBox(profile);
  if (!res.success) {
    if (log) {
      log.textContent = res.message;
      log.classList.add("chest-log--error");
    }
    return;
  }

  saveProfile(profile);
  updateCurrencyHeader();
  if (log) log.classList.remove("chest-log--error");

  const list = $("mystery-box-list");
  list?.querySelectorAll(".mystery-box__btn").forEach((btn) => {
    btn.disabled = true;
  });

  try {
    await playMysteryResult(res, log);
  } catch (err) {
    console.error("Mystery box animation failed:", err);
    if (log) log.textContent = res.message;
  }

  renderChests({ clearPulls: false });
  renderProfile();
}

function renderStarsShop() {
  const list = $("mystery-box-list");
  if (!list) return;
  list.innerHTML = `
    ${mysteryBoxHtml({
      id: "standard",
      title: "Small Mystery Box",
      desc: `${Math.round(SMALL_MYSTERY_BOX_COSMETIC_CHANCE * 100)}% cosmetics · ${Math.round((1 - SMALL_MYSTERY_BOX_COSMETIC_CHANCE) * 100)}% spells — same tier odds as Shop chests.`,
      cost: MYSTERY_BOX_COST,
    })}
    ${mysteryBoxHtml({
      id: "big",
      title: "Big Mystery Box",
      desc: "Spells and cosmetics in one open — better tier odds (50% gold).",
      cost: BIG_MYSTERY_BOX_COST,
      big: true,
    })}
  `;

  const articles = list.querySelectorAll(".mystery-box");
  bindMysteryBoxCard(articles[0], () => handleOpenMysteryBox({ big: false }));
  bindMysteryBoxCard(articles[1], () => handleOpenMysteryBox({ big: true }));
}

function showVaultTab(tab) {
  if (
    !bypassCosmeticsGate &&
    tab === "cosmetics" &&
    !isCosmeticsUnlocked(profile)
  ) {
    showUnlockHint(COSMETICS_UNLOCK_MESSAGE);
    bypassCosmeticsGate = true;
    showVaultTab("cards");
    bypassCosmeticsGate = false;
    return;
  }
  activeVaultTab = tab;
  document.querySelectorAll(".vault-tab").forEach((btn) => {
    const on = btn.dataset.vaultTab === tab;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll(".vault-tab-panel").forEach((panel) => {
    const on = panel.id === `vault-tab-${tab}`;
    panel.classList.toggle("hidden", !on);
    panel.hidden = !on;
  });
  notifyUnlockTutorial("vault-tab-changed", { tab });
}

function renderCosmeticsShop() {
  renderCosmeticBoxes(profile, $("cosmetic-box-list"), {
    logEl: $("cosmetic-box-log"),
    onGemsChange: updateGemHeader,
    cosmeticsUnlocked: isCosmeticsUnlocked(profile),
    onOpened: () => {
      if (activeTab === "profile") renderProfile();
      if (activeTab === "quests") renderQuests();
    },
  });
}

function renderChests(options = {}) {
  const { clearPulls = true } = options;
  updateCurrencyHeader();
  renderCosmeticsShop();
  renderStarsShop();
  const list = $("chest-list");
  const pullsEl = $("chest-pulls");
  if (pullsEl && clearPulls) {
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

    card.innerHTML = `
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${chestSvgMarkup(chest.id)}</div>
      <div class="chest-card__body">
        <h3 class="chest-card__name">${chest.name}</h3>
        <p class="chest-card__tagline">${tier.tagline}</p>
        <ul class="chest-card__stats">
          <li><strong>${chest.cards}</strong> spells</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${chest.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary chest-open chest-card__btn" data-id="${chest.id}">
        ${canAfford ? "Open" : "Need more gems"}
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

      notifyMetaTutorial("chest-opened", { chestId: chest.id });

      if (log) {
        log.textContent = `Got ${res.pulls.length} new cards from ${chest.name}.`;
        log.classList.remove("chest-log--error");
      }

      if (pullsEl) {
        pullsEl.classList.remove("chest-pulls--hidden");
        pullsEl.classList.add("chest-pulls--reveal");
        pullsEl.innerHTML = `<p class="chest-pulls__label">Chest opened</p><div class="chest-pulls__grid"></div>`;
        const grid = pullsEl.querySelector(".chest-pulls__grid");
        res.pulls.forEach((def, i) => {
          const pulled = renderSpellCardEl(def, {
            button: true,
            deal: true,
            gallery: true,
            onClick: () => showCardPreview(def),
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
  const filtered = playable.filter((c) => {
    if (collectionCategory !== "all" && getCardCategory(c) !== collectionCategory) return false;
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

function buyAndAddCardToWorkingDeck(cardId, statusEl) {
  const res = tryBuyCardCopy(profile, cardId);
  if (!res.success) {
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = res.message;
      statusEl.className = "deck-editor__error deck-status warn";
    }
    return false;
  }
  saveProfile(profile);
  updateCurrencyHeader();
  workingDeck.push(cardId);
  clearCardNew(profile, cardId);
  saveProfile(profile);
  renderDeckEditor();
  if (statusEl) {
    statusEl.hidden = false;
    statusEl.textContent = "Bought and added to deck.";
    statusEl.className = "deck-editor__error deck-status ok";
  }
  return true;
}

/**
 * @param {HTMLElement|null} container
 * @param {{ deckEdit?: boolean, statusEl?: HTMLElement|null }} opts
 */
function addCardToWorkingDeck(cardId) {
  const addCheck = canAddCardToDeck(workingDeck, cardId, profile);
  if (!addCheck.ok) return false;
  workingDeck.push(cardId);
  clearCardNew(profile, cardId);
  saveProfile(profile);
  renderDeckEditor();
  notifyMetaTutorial("card-added-to-deck", { cardId });
  return true;
}

function appendCollectionCard(parent, def, opts = {}) {
  const { deckEdit = false, statusEl = null } = opts;
  const owned = collectionCount(profile, def.id);
  const cap = maxCopiesForCard(def);
  const atMaxCopies = owned >= cap;
  const cost = getBuyCost(def.rarity);
  const canAfford = profile.gems >= cost && !atMaxCopies;
  const addCheck = deckEdit ? canAddCardToDeck(workingDeck, def.id, profile) : { ok: false };
  const inDeck = deckEdit ? countById(workingDeck)[def.id] || 0 : 0;
  const deckHasRoom = workingDeck.length < DECK_SIZE;
  const belowDeckCap = inDeck < cap;
  const allOwnedInDeck = owned >= 1 && owned <= inDeck;
  const canBuyMore = owned >= 1 && !atMaxCopies;
  const showBuyAdd =
    deckEdit && !addCheck.ok && deckHasRoom && belowDeckCap && allOwnedInDeck && canBuyMore;

  const buyOne = () => buyCardFromInventory(def.id, statusEl);

  const openInspect = () => {
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

  if (deckEdit) {
    const wrap = document.createElement("div");
    wrap.className = "deck-editor-tile" + (isCardNew(profile, def.id) ? " deck-editor-tile--new" : "");

    const card = renderSpellCardEl(def, {
      button: true,
      gallery: true,
      onClick: () => openInspect(),
    });
    card.classList.add("deck-editor-tile__card");
    card.title = `${def.name} — tap for full card`;

    const ownedLabel = owned > 0 ? `Owned ${owned}/${cap}` : "Not in collection";
    const meta = document.createElement("div");
    meta.className = "deck-editor-tile__meta";
    meta.innerHTML = `${ownedLabel} · In deck ${inDeck}/${cap}${isCardNew(profile, def.id) ? '<span class="deck-editor-tile__new">New</span>' : ""}`;
    meta.addEventListener("click", () => openInspect());

    const action = document.createElement("button");
    action.type = "button";
    action.className = "deck-editor-tile__action";

    if (addCheck.ok) {
      action.classList.add("deck-editor-tile__action--add");
      action.textContent = "+ Add to deck";
      action.addEventListener("click", (e) => {
        e.stopPropagation();
        addCardToWorkingDeck(def.id);
      });
    } else if (showBuyAdd) {
      action.classList.add("deck-editor-tile__action--buy");
      action.textContent = canAfford ? `Add for ${cost} gems` : `Need ${cost} gems`;
      action.disabled = !canAfford;
      action.addEventListener("click", (e) => {
        e.stopPropagation();
        buyAndAddCardToWorkingDeck(def.id, statusEl);
      });
    } else {
      action.classList.add("deck-editor-tile__action--disabled");
      action.disabled = true;
      if (workingDeck.length >= DECK_SIZE) action.textContent = `Deck full (${DECK_SIZE}/${DECK_SIZE})`;
      else if (inDeck >= cap) action.textContent = "Max copies in deck";
      else if (owned < 1) action.textContent = "Open Shop chests to unlock";
      else if (addCheck.reason) action.textContent = addCheck.reason;
      else action.textContent = "Can't add";
    }

    wrap.append(card, meta, action);
    parent.appendChild(wrap);
    return;
  }

  const wrap = document.createElement("div");
  wrap.className = "collection-card-wrap" + (owned < 1 ? " collection-card-wrap--unowned" : "");

  const card = renderSpellCardEl(def, {
    button: true,
    compact: true,
    disabled: owned < 1 || atMaxCopies,
    onClick: (e) => {
      if (e.shiftKey) {
        openInspect();
        return;
      }
      if (owned < 1 || atMaxCopies) return;
      buyOne();
    },
  });
  card.title = atMaxCopies
    ? `${def.name} — max ${cap} copies owned. Shift+click to inspect.`
    : `${def.name} — tap to buy (${cost} gems). Shift+click to inspect.`;
  wrap.appendChild(card);

  const ownedBadge = document.createElement("span");
  ownedBadge.className = "collection-owned-count";
  ownedBadge.textContent = owned > 0 ? `×${owned}` : "—";
  wrap.appendChild(ownedBadge);

  const costBadge = document.createElement("span");
  costBadge.className = "collection-buy-cost";
  costBadge.textContent = atMaxCopies ? "MAX" : `${cost} ◆`;
  if (!canAfford || atMaxCopies) costBadge.classList.add("collection-buy-cost--cant");
  wrap.appendChild(costBadge);

  parent.appendChild(wrap);
}


function renderInventoryGrid(container, opts = {}) {
  if (!container) return;
  const { deckEdit = false, statusEl = null } = opts;
  container.innerHTML = "";

  const cards = getFilteredCollection();
  if (!cards.length) {
    container.className = "deck-editor__grid collection-grid";
    const empty = document.createElement("p");
    empty.className = "collection-grid-empty muted";
    empty.textContent = deckEdit
      ? "No spells match your filters. Try “All types”, clear search, or uncheck Owned only."
      : "No cards match your filters. Open chests in the Shop to get more spells.";
    container.appendChild(empty);
    return;
  }

  let rendered = 0;
  const cardOpts = { deckEdit, statusEl };

  if (deckEdit || collectionCategory !== "all") {
    container.className = "deck-editor__grid collection-grid";
    for (const def of cards) {
      try {
        appendCollectionCard(container, def, cardOpts);
        rendered += 1;
      } catch (err) {
        console.error("Failed to render card:", def?.id, err);
      }
    }
  } else {
    container.className = "deck-editor__grid collection-categories";
    const byCategory = Object.fromEntries(CARD_CATEGORY_ORDER.map((cat) => [cat, []]));
    for (const def of cards) {
      byCategory[getCardCategory(def)].push(def);
    }

    for (const cat of CARD_CATEGORY_ORDER) {
      const group = byCategory[cat];
      if (!group.length) continue;
      const section = document.createElement("section");
      section.className = "collection-category-section";
      section.dataset.category = cat;

      const heading = document.createElement("h3");
      heading.className = "collection-category-title";
      heading.textContent = CARD_CATEGORY_LABELS[cat];
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "collection-grid deck-editor__grid-cards";
      for (const def of group) {
        try {
          appendCollectionCard(grid, def, cardOpts);
          rendered += 1;
        } catch (err) {
          console.error("Failed to render card:", def?.id, err);
        }
      }
      section.appendChild(grid);
      container.appendChild(section);
    }
  }

  if (cards.length > 0 && rendered === 0) {
    container.className = "deck-editor__grid collection-grid";
    const fail = document.createElement("p");
    fail.className = "collection-grid-empty collection-grid-empty--error";
    fail.textContent = "Spells failed to display. Hard refresh the page (Ctrl+Shift+R).";
    container.appendChild(fail);
  }
}

function openDeckEdit(deckId) {
  const deck = profile.decks.find((d) => d.id === deckId);
  if (!deck) return;
  editingDeckId = deck.id;
  workingDeck = [...deck.cardIds];
  const nameInput = $("deck-name-input");
  if (nameInput) nameInput.value = deck.name;
  showDeckSubview("edit");
  notifyMetaTutorial("deck-edit-opened", { deckId });
}

function getDeckCategoryBreakdown(cardIds) {
  const counts = Object.fromEntries(CARD_CATEGORY_ORDER.map((c) => [c, 0]));
  for (const id of cardIds) {
    const def = getCardDef(id);
    if (!def) continue;
    counts[getCardCategory(def)] += 1;
  }
  return counts;
}

function renderDeckCategoryDots(cardIds) {
  const counts = getDeckCategoryBreakdown(cardIds);
  const parts = [];
  for (const cat of CARD_CATEGORY_ORDER) {
    const n = counts[cat];
    if (n <= 0) continue;
    const label = CARD_CATEGORY_LABELS[cat];
    parts.push(
      `<span class="deck-row__cat" title="${escapeHtml(label)}: ${n}"><span class="deck-row__cat-dot deck-row__cat-dot--${cat}" aria-hidden="true"></span><span class="deck-row__cat-n">${n}</span></span>`
    );
  }
  if (!parts.length) return "";
  return `<div class="deck-row__cats">${parts.join("")}</div>`;
}

function renderDeckList() {
  if (repairProfile(profile)) saveProfile(profile);
  updateCurrencyHeader();
  const list = $("deck-list");
  if (!list) return;
  list.innerHTML = "";

  const countEl = $("deck-list-count");
  if (countEl) {
    const n = profile.decks.length;
    countEl.textContent = n ? `${n} deck${n === 1 ? "" : "s"}` : "";
  }

  if (!profile.decks.length) {
    if (repairProfile(profile)) saveProfile(profile);
    if (profile.decks.length) {
      renderDeckList();
      return;
    }
    list.innerHTML = `
      <div class="deck-list-empty">
        <span class="deck-list-empty__icon" aria-hidden="true">▣</span>
        <p class="deck-list-empty__title">No decks yet</p>
        <p class="deck-list-empty__desc">Tap <strong>New deck</strong> above to build your first 30-card list.</p>
      </div>`;
    return;
  }

  for (const deck of profile.decks) {
    const val = validateDeck(deck.cardIds, profile);
    const ready = val.valid;
    const pct = Math.min(100, Math.round((deck.cardIds.length / DECK_SIZE) * 100));
    const row = document.createElement("button");
    row.type = "button";
    row.className = `deck-row deck-row--open${ready ? " deck-row--ready" : ""}`;
    row.innerHTML = `
      <span class="deck-row__aura" aria-hidden="true"></span>
      <div class="deck-row__top">
        <span class="deck-row__sigil" aria-hidden="true">
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
        </span>
        <span class="deck-row__badge ${ready ? "deck-row__badge--ready" : "deck-row__badge--warn"}">${ready ? "Ready" : "Incomplete"}</span>
      </div>
      <h3 class="deck-row-name">${escapeHtml(deck.name)}</h3>
      <div class="deck-row__progress">
        <div class="deck-progress-bar deck-row__progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${DECK_SIZE}" aria-valuenow="${deck.cardIds.length}" aria-label="${escapeHtml(deck.name)} progress">
          <div class="deck-progress-fill deck-row__progress-fill${ready ? " deck-row__progress-fill--ready" : ""}" style="width:${pct}%"></div>
        </div>
        <span class="deck-row__count">${deck.cardIds.length}/${DECK_SIZE}</span>
      </div>
      ${renderDeckCategoryDots(deck.cardIds)}
      <div class="deck-row__footer">
        <span class="deck-row-hint">Tap to edit</span>
        <span class="deck-row-chevron" aria-hidden="true">›</span>
      </div>
    `;
    row.addEventListener("click", () => openDeckEdit(deck.id));
    list.appendChild(row);
  }
}

function renderDeckEditor() {
  updateCurrencyHeader();
  const collEl = $("collection-grid");
  const deckEl = $("deck-slots");
  const status = $("deck-status");
  const heading = $("edit-deck-heading");
  const countBadge = $("deck-count-badge");
  const progressBar = $("deck-progress-bar");
  if (!collEl || !deckEl) return;

  const deleteBtn = $("btn-delete-deck");
  if (deleteBtn) {
    const canDelete = editingDeckId && editingDeckId !== "new" && editingDeckId !== "deck-starter";
    deleteBtn.hidden = !canDelete;
  }

  if (heading) {
    heading.textContent = editingDeckId === "new" ? "New deck" : "In your deck";
  }

  const val = validateDeck(workingDeck, profile);
  const countLabel = `${workingDeck.length}/${DECK_SIZE}`;
  if (countBadge) {
    countBadge.textContent = countLabel;
    countBadge.classList.toggle("deck-editor__count--ready", val.valid);
  }
  const progressFill = $("deck-progress-fill");
  const pct = Math.min(100, (workingDeck.length / DECK_SIZE) * 100);
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressBar) {
    progressBar.hidden = val.valid;
    if (!val.valid) {
      progressBar.setAttribute("aria-valuenow", String(workingDeck.length));
      progressBar.setAttribute("aria-valuemax", String(DECK_SIZE));
    }
  }
  if (status) {
    if (val.valid) {
      status.textContent = "";
      status.hidden = true;
      status.className = "deck-editor__error deck-status ok";
    } else {
      status.hidden = false;
      status.textContent = val.errors[0] || `${countLabel} — keep adding spells`;
      status.className = "deck-editor__error deck-status warn";
    }
  }

  const hint = $("deck-collection-hint");
  if (hint) {
    hint.hidden = false;
    hint.innerHTML =
      workingDeck.length >= DECK_SIZE
        ? "Deck is full. Remove a card from the strip above, or save when ready."
        : "Tap <strong>+ Add to deck</strong> for copies you own. When all owned copies are in the deck, tap <strong>Add for X gems</strong> to buy another.";
  }

  renderInventoryGrid(collEl, { deckEdit: true, statusEl: status });

  deckEl.innerHTML = "";
  const stacks = getDeckStacks(workingDeck);
  if (!stacks.length) {
    const empty = document.createElement("p");
    empty.className = "deck-editor__strip-empty";
    empty.textContent = "Empty deck — tap + Add to deck below";
    deckEl.appendChild(empty);
  }
  for (const { def, count } of stacks) {
    const slot = document.createElement("div");
    slot.className = "deck-slot-wrap deck-slot-wrap--strip";
    const card = renderSpellCardEl(def, {
      button: true,
      tiny: true,
      onClick: () => {
        showCardPreview(def, {
          meta: count > 1 ? `${count} copies in deck` : "In your deck",
          onRemove: () => removeOneFromDeck(def.id),
        });
      },
    });
    slot.appendChild(card);
    if (count > 1) {
      const stack = document.createElement("span");
      stack.className = "deck-stack-count";
      stack.textContent = `×${count}`;
      slot.appendChild(stack);
    }
    const rem = document.createElement("button");
    rem.type = "button";
    rem.className = "deck-slot-remove deck-slot-remove--visible";
    rem.setAttribute("aria-label", `Remove one ${def.name} from deck`);
    rem.textContent = "−";
    rem.addEventListener("click", (e) => {
      e.stopPropagation();
      removeOneFromDeck(def.id);
    });
    slot.appendChild(rem);
    deckEl.appendChild(slot);
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
  notifyMetaTutorial("deck-saved", { deckId: deck.id });
  editingDeckId = null;
  workingDeck = [];
  showDeckSubview("list");
}

function nextDefaultDeckName(decks = []) {
  const base = "New Deck";
  const names = new Set(decks.map((d) => d.name?.trim()).filter(Boolean));
  if (!names.has(base)) return base;
  let n = 2;
  while (names.has(`${base} ${n}`)) n++;
  return `${base} ${n}`;
}

function startNewDeck() {
  editingDeckId = "new";
  workingDeck = [];
  const nameInput = $("deck-name-input");
  if (nameInput) nameInput.value = nextDefaultDeckName(profile.decks);
  showDeckSubview("edit");
}

function closeAdventurePrebattle() {
  hideStageModal();
  selectedAdventureLevel = null;
}

function showAdventureMap() {
  profile.adventure = repairAdventureProgress(profile.adventure);
  $("adventure-map-view")?.classList.remove("hidden");
  closeAdventurePrebattle();
  pendingEnemyDeck = null;
  renderAdventureMap();
}


function getMapSceneryMarkup(theme) {
  const ocean = theme === "frost" ? "#1a3050" : theme === "ember" ? "#2a1810" : theme === "void" ? "#12082a" : theme === "legend" ? "#0a1a10" : "#0d2848";
  const land = theme === "frost" ? "#5a7a6a" : theme === "ember" ? "#6a4a30" : theme === "void" ? "#4a3868" : theme === "legend" ? "#2d6a4f" : "#3d7a48";
  const beach = theme === "frost" ? "#9ab8c8" : theme === "ember" ? "#c8a070" : "#c4b090";
  return `<svg class="adventure-map-scenery-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="mapOcean" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${ocean}"/>
        <stop offset="100%" stop-color="#061018"/>
      </linearGradient>
      <linearGradient id="mapLand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${land}"/>
        <stop offset="100%" stop-color="#1a3020"/>
      </linearGradient>
      <filter id="mapSoft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>
    </defs>
    <rect width="100" height="100" fill="url(#mapOcean)"/>
    <!-- waves -->
    <ellipse cx="18" cy="88" rx="14" ry="3" fill="rgba(255,255,255,0.06)"/>
    <ellipse cx="82" cy="92" rx="18" ry="4" fill="rgba(255,255,255,0.05)"/>
    <ellipse cx="50" cy="95" rx="22" ry="4" fill="rgba(255,255,255,0.07)"/>
    <!-- island -->
    <path fill="url(#mapLand)" stroke="rgba(255,255,255,0.12)" stroke-width="0.35"
      d="M50 20 C62 20 72 26 78 36 C84 46 82 58 74 68 C68 78 58 84 50 86 C42 84 32 78 26 68 C18 58 16 46 22 36 C28 26 38 20 50 20 Z"/>
    <!-- beach cove -->
    <path fill="${beach}" opacity="0.55"
      d="M42 80 C48 84 56 84 62 80 C58 86 50 88 42 86 Z"/>
    <!-- castle summit -->
    <path fill="#2a3548" d="M46 24 h8 v6 h-8z M44 22 h4 v4 h-4z M52 22 h4 v4 h-4z M47 20 h6 v2 h-6z"/>
    <rect x="48.5" y="27" width="3" height="2" fill="#1a2430"/>
    <!-- trees -->
    <polygon points="24,62 26,56 28,62" fill="#0f2818"/>
    <polygon points="74,58 76,52 78,58" fill="#143220"/>
    <polygon points="34,70 36,64 38,70" fill="#0f2818"/>
    <polygon points="66,72 68,66 70,72" fill="#143220"/>
    <polygon points="58,38 60,32 62,38" fill="#0f2818"/>
    <!-- path on island (decorative) -->
    <path fill="none" stroke="rgba(200,180,120,0.35)" stroke-width="0.6" stroke-dasharray="2 1.5"
      d="M52 82 L64 74 L74 66 L72 56 L60 50 L46 46 L32 52 L26 62 L38 72 L50 28"/>
  </svg>`;
}


function renderAdventureMap() {
  updateCurrencyHeader();
  syncNavUnlockState();
  const progress = repairAdventureProgress(profile.adventure);
  profile.adventure = progress;
  selectedAdventureWorldId = progress.selectedWorld || 1;

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
  map.className = `adventure-map-canvas adventure-map-canvas--${theme} adventure-map-canvas--island`;
  map.setAttribute("role", "group");
  map.setAttribute("aria-label", "Island stage map");
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
  const nextId = getNextPlayableLevelId(progress);

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
    pin.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openAdventureStage(level.id);
    };
    pin.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAdventureStage(level.id);
      }
    });
    pinsLayer?.appendChild(pin);
  });


  const stageList = $("adventure-stage-list");
  if (stageList) {
    stageList.innerHTML = "";
    for (const level of levels) {
      const unlocked = isLevelUnlocked(progress, level.id);
      const cleared = isLevelCleared(progress, level.id);
      const isNext = level.id === nextId && unlocked;
      const stars = getLevelStars(progress, level.id);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "adventure-stage-row";
      if (!unlocked) row.disabled = true;
      if (cleared) row.classList.add("adventure-stage-row--cleared");
      if (isNext) row.classList.add("adventure-stage-row--next");
      row.innerHTML = `
        <span class="adventure-stage-row__main">
          <span class="adventure-stage-row__title">${level.stageInWorld}. ${level.opponent}</span>
          <span class="adventure-stage-row__flavor">${level.flavor}</span>
        </span>
        ${isNext ? '<span class="adventure-stage-row__badge">Next</span>' : ""}
        ${stars > 0 ? `<span class="adventure-stage-row__stars">${formatStars(stars)}</span>` : ""}`;
      row.addEventListener("click", () => openAdventureStage(level.id));
      stageList.appendChild(row);
    }
  }

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
  showStageModal();

  const title = $("prebattle-title");
  const flavor = $("prebattle-flavor");
  const opponent = $("prebattle-opponent");
  if (title) title.textContent = level.name + ": " + level.opponent;
  if (flavor) flavor.textContent = level.flavor || "";
  if (opponent) opponent.textContent = "Loading…";

  try {
    pendingEnemyDeck = getOrCreateLevelEnemyDeck(profile, levelId);
    saveProfile(profile);
  } catch (err) {
    console.error("Enemy deck failed", err);
    if (opponent) opponent.textContent = "Could not build enemy deck. Try again.";
    return;
  }

  if (opponent) opponent.textContent = "Review the enemy spell deck, then choose your grimoire below.";
  const gemHint = $("prebattle-gem-hint");
  if (gemHint) {
    const gems = gemsForLevelClear(profile.adventure, levelId);
    gemHint.textContent = isLevelCleared(profile.adventure, levelId)
      ? `Repeat clear: +${gems} gems`
      : `First clear: +${gems} gems`;
  }

  const preview = $("enemy-deck-preview");
  if (preview) {
    preview.innerHTML = "";
    try {
      for (const { def, count } of getEnemyDeckPreview(pendingEnemyDeck)) {
        if (!def) continue;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "enemy-deck-spell-btn";
        btn.title = `View ${def.name}`;

        const name = document.createElement("span");
        name.className = "enemy-deck-spell-btn__name";
        name.textContent = def.name;
        btn.appendChild(name);

        if (count > 1) {
          const qty = document.createElement("span");
          qty.className = "enemy-deck-spell-btn__count";
          qty.textContent = `×${count}`;
          btn.appendChild(qty);
        }
        btn.addEventListener("click", () =>
          showCardPreview(def, {
            meta: count > 1 ? `${count} copies in enemy deck` : "Enemy deck",
          }),
        );
        preview.appendChild(btn);
      }
    } catch (err) {
      console.error("Enemy preview failed", err);
      preview.innerHTML = "<p class=\"empty-msg\">Enemy deck preview unavailable.</p>";
    }
  }

  if (repairProfile(profile)) saveProfile(profile);

  const sel = resolveNativeSelect("adventure-deck-select");
  if (!sel) {
    if (opponent) opponent.textContent = "Deck selector missing — hard refresh the page.";
    return;
  }
  sel.innerHTML = "";
  const validDecks = profile.decks.filter((d) => validateDeck(d.cardIds, profile).valid);
  if (!validDecks.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "No complete decks — build one in Decks";
    sel.appendChild(opt);
    sel.disabled = true;
    $("btn-start-adventure").disabled = true;
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
}


async function launchAdventureMatch(deck, level, enemyDeck, levelId, resumeState = null, winRewarded = false) {
  const opponentName = level.opponent;
  closeAdventurePrebattle();
  pendingEnemyDeck = null;

  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("view-match")?.classList.remove("hidden");
  const root = $("view-match");
  if (!root) return;

  root.innerHTML = getMatchHtml(opponentName);

  const sessionOpts = {
    aiDeckIds: enemyDeck,
    opponentName,
    cosmetics: getEquippedCosmetics(profile),
    profile,
  };
  if (resumeState) {
    sessionOpts.initialState = resumeState;
  }

  try {
    matchSession = new MatchSession(
      deck.cardIds,
      root,
      () => {
        matchSession = null;
        exitMatchMode();
        void lockPortrait();
        setAudioMode("hub");
        root.innerHTML = "";
        $("view-match")?.classList.add("hidden");
        showTab(consumePendingNavigationTab() || "play");
        if (pendingPostStage1Tutorials) {
          schedulePostStage1Tutorials();
        }
        if (pendingPostStage5CosmeticsTutorial) {
          schedulePostStage5CosmeticsTutorial();
        }
      },
      (stars) => {
        const result = recordLevelClear(profile, levelId, stars);
        const { gems, stars: bestStars, starsGained } = result;
        profile.gems += gems;
        syncExplorer(profile);
        saveProfile(profile);
        updateCurrencyHeader();
        syncNavUnlockState();
        if (levelId === 1 && result.firstTime) {
          pendingPostStage1Tutorials = true;
          schedulePostStage1Tutorials();
        }
        if (levelId === 5 && result.firstTime) {
          pendingPostStage5CosmeticsTutorial = true;
        }
        return {
          message: `+${gems} gems! · Best: ${formatStars(bestStars)}`,
          starsGained,
        };
      },
      sessionOpts
    );
  } catch (err) {
    matchSession = null;
    root.innerHTML = "";
    $("view-match")?.classList.add("hidden");
    showTab("play");
    throw err;
  }

  enterMatchMode({
    kind: "adventure",
    deckId: deck.id,
    deckCardIds: deck.cardIds,
    aiDeckIds: enemyDeck,
    opponentName,
    levelId,
  });
  await lockPortrait();
  setAudioMode("match");
  if (winRewarded) matchSession.winRewarded = true;
  saveMatchCheckpoint(matchSession);
  matchSession.setMessage("Drag a spell onto the board or tap a card, then pick highlighted squares.");
  matchSession.render();
}

async function tryResumeSavedMatch() {
  const cp = readMatchCheckpoint();
  if (!cp) return false;
  const deck =
    profile.decks.find((d) => d.id === cp.deckId) ||
    profile.decks.find((d) => d.cardIds?.length === DECK_SIZE);
  const level = cp.levelId ? getLevel(cp.levelId) : null;
  if (!deck || deck.cardIds.length !== DECK_SIZE || !level || !cp.aiDeckIds?.length) {
    clearMatchCheckpoint();
    return false;
  }
  if (
    !(await mobileConfirm("Resume your adventure match where you left off?", {
      title: "Resume match?",
      confirmLabel: "Resume",
      cancelLabel: "Discard",
    }))
  ) {
    clearMatchCheckpoint();
    return false;
  }
  selectedAdventureLevel = cp.levelId;
  await launchAdventureMatch(deck, level, cp.aiDeckIds, cp.levelId, cp.state, cp.winRewarded);
  matchSession?.setMessage("Match resumed — pick up where you left off.");
  return true;
}


function startAdventureMatch() {
  const deckId = resolveNativeSelect("adventure-deck-select")?.value;
  const deck = profile.decks.find((d) => d.id === deckId);
  const levelId = selectedAdventureLevel;
  const level = levelId ? getLevel(levelId) : null;
  const enemyDeck = pendingEnemyDeck ? [...pendingEnemyDeck] : null;

  if (!deck || deck.cardIds.length !== DECK_SIZE || !level || !enemyDeck?.length) {
    const opponent = $("prebattle-opponent");
    if (opponent) {
      if (!deck || deck.cardIds.length !== DECK_SIZE) {
        opponent.textContent = `Build a complete ${DECK_SIZE}-card deck in the Decks tab, then try again.`;
      } else {
        opponent.textContent = "Could not start battle — close and pick the stage again.";
      }
    }
    return;
  }

  void launchAdventureMatch(deck, level, enemyDeck, levelId);
}


function bindAdventureMapCapture() {
  if (window.__adventureMapCaptureBound) return;
  window.__adventureMapCaptureBound = true;
  const handle = (e) => {
    const pin = e.target.closest?.("#adventure-map .adventure-map-pin");
    if (!pin || pin.disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const levelId = Number(pin.dataset.level);
    if (!Number.isFinite(levelId) || levelId < 1) return;
    openAdventureStage(levelId);
  };
  document.addEventListener("click", handle, true);
  document.addEventListener("touchend", handle, { capture: true, passive: false });
}

function openAdventureStage(levelId) {
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

function init() {
  syncMainTabShellState();
  initSettings();
  initNavIcons();
  initNetworkBanner();
  initAudio();
  void initOrientation();
  void initCapacitor();
  bindCardPreviewModal();
  bindAdventureMapCapture();
  ensureStageModalOnBody();
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAdventurePrebattle();
  });
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      void hapticLight();
      AudioSfx.tap();
      void showTab(btn.dataset.tab);
    });
  });

  document.querySelectorAll(".vault-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      reconcileMatchShellState();
      showVaultTab(btn.dataset.vaultTab);
    });
  });

  $("btn-new-deck")?.addEventListener("click", startNewDeck);
  $("btn-back-from-edit")?.addEventListener("click", () => {
    editingDeckId = null;
    workingDeck = [];
    showDeckSubview("list");
  });
  $("btn-delete-deck")?.addEventListener("click", async () => {
    if (!editingDeckId || editingDeckId === "new") return;
    const deck = profile.decks.find((d) => d.id === editingDeckId);
    if (!deck) return;
    if (
      !(await mobileConfirm(`Delete "${deck.name}"? This cannot be undone.`, {
        title: "Delete deck?",
        confirmLabel: "Delete",
        cancelLabel: "Keep",
        destructive: true,
      }))
    ) {
      return;
    }
    deleteDeck(profile, deck.id);
    editingDeckId = null;
    workingDeck = [];
    showDeckSubview("list");
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
      collectionCategory = "all";
      collectionOwnedOnly = true;
      syncCollectionFilterControls();
      syncCollectionFilter();
    });
  });

  syncCollectionFilterControls();
  enhanceAllSelectInputs();

  $("collection-search")?.addEventListener("input", (e) => {
    collectionFilter = e.target.value;
    syncCollectionFilter();
  });
  resolveNativeSelect("collection-category")?.addEventListener("change", (e) => {
    collectionCategory = e.target.value;
    syncCollectionFilter();
  });
  resolveNativeSelect("collection-rarity")?.addEventListener("change", (e) => {
    collectionRarity = e.target.value;
    syncCollectionFilter();
  });

  $("btn-clear-deck")?.addEventListener("click", () => {
    workingDeck = [];
    renderDeckEditor();
  });
  $("btn-auto-finish-deck")?.addEventListener("click", autoFinishDeck);
  $("btn-save-deck")?.addEventListener("click", saveWorkingDeck);
  $("btn-back-adventure")?.addEventListener("click", closeAdventurePrebattle);
  $("adventure-stage-backdrop")?.addEventListener("click", closeAdventurePrebattle);
  $("btn-start-adventure")?.addEventListener("click", startAdventureMatch);
  resolveNativeSelect("adventure-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  const authModal = document.getElementById("auth-modal");
  const authBtn = document.getElementById("auth-header-btn");
  initHeaderProfileMenu();

  authGate = initAuthGate({
    onSignIn: () => authUI?.open("signin", { forced: true }),
    onSignUp: () => authUI?.open("signup", { forced: true }),
  });

  authUI = initAuthUI({
    authBtn,
    modal: authModal,
    onNewAccount: () => {
      profile = loadProfile();
      prepareInteractiveTutorialForNewAccount(profile, saveProfile);
    },
    onSignedIn: () => {
      profile = loadProfile();
      repairProfile(profile);
      syncTutorialStorageWithProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
      authGate?.hide();
      void refreshHeaderIdentity().then(() => {
        if (activeTab === "profile") renderProfile();
        if (activeTab === "quests") renderQuests();
      });
      pvpController?.render();
      maybeStartInteractiveTutorial();
      maybeStartMetaTutorial();
      maybeStartPostStage1Tutorials();
      maybeStartPostStage5CosmeticsTutorial();
      if (!tutorialRunning) {
        showTab(activeTab);
      }
    },
    onSignedOut: () => {
      closeHeaderProfileMenu();
      headerDisplayUsername = "";
      updateHeaderProfileBtn();
      pvpController?.dispose?.();
      matchSession = null;
      exitMatchMode({ clearCheckpoint: true });
      reconcileMatchShellState();
      authGate?.show();
      showTab("deck");
    },
  });

  void clearAllWaitingRoomsOnce();

  pvpController = initPvpUI({
    root: document.getElementById("view-pvp"),
    getProfile: () => profile,
    openAuthModal: () => authUI?.open("signin", { forced: true }),
    onNavigateTab: showTab,
  });

  bindMatchVisibilityHandlers(() => matchSession);
  repairProfile(profile);
  syncCollectionFilterControls();
  syncNavUnlockState();

  void bootstrapAfterAuth();
}

function schedulePostStage1Tutorials() {
  if (!pendingPostStage1Tutorials) return;
  if (postStage1TutorialTimer != null) return;

  let attempts = 0;
  const maxAttempts = 10;

  const tryStart = () => {
    postStage1TutorialTimer = null;
    attempts += 1;
    if (!pendingPostStage1Tutorials) return;
    if (isLiveMatchUiVisible()) {
      if (attempts < maxAttempts) {
        postStage1TutorialTimer = window.setTimeout(tryStart, 400);
      }
      return;
    }
    syncTutorialStorageWithProfile(profile);
    if (maybeStartPostStage1Tutorials()) {
      pendingPostStage1Tutorials = false;
      return;
    }
    if (attempts < maxAttempts) {
      postStage1TutorialTimer = window.setTimeout(tryStart, 500);
    }
  };

  postStage1TutorialTimer = window.setTimeout(tryStart, 350);
}

function schedulePostStage5CosmeticsTutorial() {
  if (!pendingPostStage5CosmeticsTutorial) return;
  if (postStage5CosmeticsTutorialTimer != null) return;

  let attempts = 0;
  const maxAttempts = 10;

  const tryStart = () => {
    postStage5CosmeticsTutorialTimer = null;
    attempts += 1;
    if (!pendingPostStage5CosmeticsTutorial) return;
    if (isLiveMatchUiVisible()) {
      if (attempts < maxAttempts) {
        postStage5CosmeticsTutorialTimer = window.setTimeout(tryStart, 400);
      }
      return;
    }
    syncTutorialStorageWithProfile(profile);
    if (maybeStartPostStage5CosmeticsTutorial()) {
      pendingPostStage5CosmeticsTutorial = false;
      return;
    }
    if (attempts < maxAttempts) {
      postStage5CosmeticsTutorialTimer = window.setTimeout(tryStart, 500);
    }
  };

  postStage5CosmeticsTutorialTimer = window.setTimeout(tryStart, 350);
}

function maybeStartPvpTutorial() {
  if (tutorialRunning || !getCurrentUser()) return false;
  if (!isQuestsAndPvpUnlocked(profile)) return false;
  if (!shouldShowPvpTutorial(profile)) return false;
  tutorialRunning = true;
  startPvpTutorial({
    profile,
    saveProfile,
    onComplete: () => {
      tutorialRunning = false;
      profile = loadProfile();
      repairProfile(profile);
      syncNavUnlockState();
      showTab("play");
      maybeStartPostStage5CosmeticsTutorial();
    },
  });
  return true;
}

function maybeStartPostStage5CosmeticsTutorial() {
  if (tutorialRunning || !getCurrentUser()) return false;
  if (!isCosmeticsUnlocked(profile)) return false;
  if (shouldShowInteractiveTutorial(profile) || shouldShowMetaTutorial(profile)) return false;
  if (shouldShowQuestsTutorial(profile) || shouldShowPvpTutorial(profile)) return false;
  if (!shouldShowCosmeticsTutorial(profile)) return false;
  tutorialRunning = true;
  showTab("play");
  startCosmeticsTutorial({
    profile,
    saveProfile,
    onComplete: () => {
      tutorialRunning = false;
      profile = loadProfile();
      repairProfile(profile);
      syncNavUnlockState();
      showTab("play");
    },
  });
  return true;
}

function maybeStartPostStage1Tutorials() {
  if (tutorialRunning || !getCurrentUser()) return false;
  if (!isQuestsAndPvpUnlocked(profile)) return false;
  syncTutorialStorageWithProfile(profile);
  if (!shouldShowQuestsTutorial(profile)) return maybeStartPvpTutorial();
  tutorialRunning = true;
  showTab("play");
  startQuestsTutorial({
    profile,
    saveProfile,
    onComplete: () => {
      tutorialRunning = false;
      profile = loadProfile();
      repairProfile(profile);
      syncNavUnlockState();
      maybeStartPvpTutorial();
      maybeStartPostStage5CosmeticsTutorial();
    },
  });
  return true;
}

function maybeStartInteractiveTutorial() {
  if (tutorialRunning || !getCurrentUser()) return false;
  if (!shouldShowInteractiveTutorial(profile)) return false;
  tutorialRunning = true;
  startInteractiveTutorial({
    profile,
    saveProfile,
    onComplete: () => {
      tutorialRunning = false;
      profile = loadProfile();
      repairProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
      if (!maybeStartMetaTutorial()) {
        showTab("deck");
      }
      maybeStartPostStage1Tutorials();
      maybeStartPostStage5CosmeticsTutorial();
    },
  });
  return true;
}

function maybeStartMetaTutorial() {
  if (tutorialRunning || !getCurrentUser()) return false;
  if (!shouldShowMetaTutorial(profile)) return false;
  tutorialRunning = true;
  showTab("deck");
  startMetaTutorial({
    profile,
    saveProfile,
    onComplete: () => {
      tutorialRunning = false;
      profile = loadProfile();
      repairProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
      showTab("deck");
      maybeStartPostStage1Tutorials();
      maybeStartPostStage5CosmeticsTutorial();
    },
  });
  return true;
}

async function bootstrapAfterAuth() {
  try {
    const user = await initAuth();
    if (user) {
      try {
        const cloud = await pullCloudProfile();
        if (cloud) profile = cloud;
      } catch (e) {
        console.warn("Cloud sync on load failed", e);
      }
      repairProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
    }
  } catch (e) {
    console.warn("Auth init failed", e);
  }
  syncTutorialStorageWithProfile(profile);
  await refreshHeaderIdentity();
  reconcileMatchShellState();

  if (requiresAuthGate()) {
    authGate?.show();
    return;
  }
  authGate?.hide();

  if (maybeStartInteractiveTutorial()) return;
  if (maybeStartMetaTutorial()) return;
  if (maybeStartPostStage1Tutorials()) return;
  if (maybeStartPostStage5CosmeticsTutorial()) return;
  if (tutorialRunning) return;
  if (!(await tryResumeSavedMatch())) await showTab("deck");
  reconcileMatchShellState();
  setAudioMode("hub");
}

init();
