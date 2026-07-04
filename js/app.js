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
  resetToDefaultProfile,
  getStoredProfileOwnerId,
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
  ADVENTURE_LEVEL_COUNT,
  gemsForLevelClear,
  recordLevelClear,
  formatStars,
  getLevelStars,
  MAP_THEME_PALETTES,
  repairAdventureProgress,
  getNextPlayableLevelId,
  getWorldForLevel,
  isQuestsAndPvpUnlocked,
  QUESTS_PVP_UNLOCK_MESSAGE,
  questsPvpUnlockMessage,
  isCosmeticsUnlocked,
  COSMETICS_UNLOCK_MESSAGE,
  isChallengeModeUnlocked,
  isChallengeModeEnabled,
} from "./adventure.js";
import { validateDeck, canAddCardToDeck, countById } from "./deckRules.js";
import { syncExplorer } from "./achievements.js";
import { trackDailyQuestEvent } from "./dailyQuests.js";
import { openChest, CHESTS } from "./chests.js";
import { formatRarityOdds } from "./chestOdds.js";
import { CHEST_TIERS, chestSvgMarkup } from "./chestArt.js";
import { smallMysteryBoxSvgMarkup, bigMysteryBoxSvgMarkup } from "./mysteryBoxArt.js";
import {
  openMysteryBox,
  openBigMysteryBox,
  MYSTERY_BOX_COST,
  BIG_MYSTERY_BOX_COST,
  SMALL_MYSTERY_BOX_COSMETIC_CHANCE,
} from "./mysteryBox.js";
import { initAuthUI } from "./authUI.js";
import { initAuthGate, requiresAuthGate, allowsAppAccess } from "./authGate.js";
import {
  shouldShowInteractiveTutorial,
  shouldShowMetaTutorial,
  shouldShowQuestsTutorial,
  shouldShowPvpTutorial,
  shouldShowCosmeticsTutorial,
  prepareInteractiveTutorialForNewAccount,
  syncTutorialStorageWithProfile,
} from "./tutorial.js";
import { initPanelHelp, openPanelHelpPopup } from "./panelHelp.js";
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
import {
  enterGuestMode,
  clearGuestMode,
  isGuestPlayer,
  GUEST_SIGN_IN_NUDGE_PVP,
  GUEST_SIGN_IN_NUDGE_SAVE,
} from "./guestMode.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { renderSpellCardEl, escapeHtml } from "./cardArt.js";
import { showCardPreview, bindCardPreviewModal, closeCardPreview } from "./cardPreview.js";
import { staggerCardReveal, onCardRevealed } from "./cardAnimations.js";
import { getBuyCost, tryBuyCardCopy } from "./cardShop.js";
import { initNavIcons } from "./navIcons.js";
import { initSettings } from "./settings.js";
import { initAudio, setAudioMode, AudioSfx } from "./audio.js";
import { initOrientation, lockPortrait } from "./orientation.js";
import { initNetworkBanner } from "./networkBanner.js";
import { initCapacitor } from "./capacitorInit.js";
import { hapticLight } from "./haptics.js";
import { headerProfileAvatarHtml, resolveDisplayUsername } from "./profileHeader.js";
import {
  loadMatchChunk,
  loadPvpChunk,
  loadProfileUIChunk,
  loadSettingsUIChunk,
  loadAnimationsChunk,
  loadTutorialMetaChunk,
  loadTutorialUnlocksChunk,
  loadTutorialMatchChunk,
} from "./lazyChunks.js";

function notifyMetaTutorial(event, data) {
  void loadTutorialMetaChunk().then((m) => m.notifyMetaTutorial(event, data));
}

function notifyUnlockTutorial(event, data) {
  void loadTutorialUnlocksChunk().then((m) => m.notifyUnlockTutorial(event, data));
}

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
/** @type {{ name: string, cardIds: string[] }|null} */
let deckEditSnapshot = null;
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
/** @type {Promise<ReturnType<typeof import('./pvpUI.js').initPvpUI>> | null} */
let pvpInitPromise = null;

function ensurePvpUI() {
  if (pvpController) return Promise.resolve(pvpController);
  if (!pvpInitPromise) {
    pvpInitPromise = loadPvpChunk().then(({ initPvpUI, clearAllWaitingRoomsOnce }) => {
      void clearAllWaitingRoomsOnce();
      pvpController = initPvpUI({
        root: document.getElementById("view-pvp"),
        getProfile: () => profile,
        openAuthModal: () => authUI?.open("signin", { forced: true }),
        onNavigateTab: showTab,
        onOpenDeckEdit: openDeckEdit,
        onPvpViewShown: () => {
          activeTab = "pvp";
          syncMainTabShellState();
        },
      });
      return pvpController;
    });
  }
  return pvpInitPromise;
}
/** @type {ReturnType<typeof initAuthGate> | null} */
let authGate = null;
/** @type {ReturnType<typeof initAuthUI> | null} */
let authUI = null;
let tutorialRunning = false;
let bypassQuestsPvpGate = false;
let bypassCosmeticsGate = false;
let pendingPostFloor1Tutorials = false;
let pendingPostFloor5CosmeticsTutorial = false;
/** @type {number|null} */
let postFloor1TutorialTimer = null;
/** @type {number|null} */
let postFloor5CosmeticsTutorialTimer = null;
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

function removeAllFromDeck(cardId) {
  const before = workingDeck.length;
  workingDeck = workingDeck.filter((id) => id !== cardId);
  if (workingDeck.length === before) return;
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

function ensureFloorModalOnBody() {
  const modal = document.getElementById("adventure-prebattle");
  if (modal && modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }
}

/** Bottom nav must be a direct child of body so position:fixed spans the viewport. */
function ensureBottomNavOnBody() {
  const nav = document.querySelector("nav.game-nav.tabs");
  if (nav && nav.parentElement !== document.body) {
    document.body.appendChild(nav);
  }
}

function getAdventureMapTabletScale() {
  if (window.matchMedia("(min-width: 1000px) and (max-width: 1400px)").matches) return 4;
  if (window.matchMedia("(min-width: 600px) and (max-width: 999px)").matches) return 2.6;
  return 1;
}

function showFloorModal() {
  ensureFloorModalOnBody();
  const modal = document.getElementById("adventure-prebattle");
  modal?.classList.remove("hidden");
  document.body.classList.add("adventure-floor-open");
}

function hideFloorModal() {
  document.getElementById("adventure-prebattle")?.classList.add("hidden");
  document.body.classList.remove("adventure-floor-open");
}

function showUnlockHint(message = QUESTS_PVP_UNLOCK_MESSAGE, title = "Locked") {
  openPanelHelpPopup({
    title,
    bodyHtml: message,
    autoCloseMs: 4500,
  });
}

function syncMainTabShellState() {
  document.body.classList.toggle("main-tab-active", MAIN_TABS.has(activeTab));
  document.body.classList.toggle("adventure-active", activeTab === "play");
}

function syncTabSignInBadge(btn, visible, text) {
  let badge = btn.querySelector(".tab-btn__sign-in-badge");
  if (visible) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "tab-btn__sign-in-badge";
      badge.setAttribute("aria-hidden", "true");
      btn.appendChild(badge);
    }
    badge.textContent = text;
    btn.classList.add("tab-btn--sign-in-nudge");
  } else {
    badge?.remove();
    btn.classList.remove("tab-btn--sign-in-nudge");
  }
}

function syncNavUnlockState() {
  const unlocked = isQuestsAndPvpUnlocked(profile);
  const guest = isGuestPlayer();
  for (const tab of ["quests", "pvp"]) {
    const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (!btn) continue;
    const feature = tab === "pvp" ? "PvP" : "Quests";
    const progressionLocked = !unlocked;
    const signInNudge = tab === "pvp" ? GUEST_SIGN_IN_NUDGE_PVP : GUEST_SIGN_IN_NUDGE_SAVE;

    btn.classList.toggle("tab-btn--locked", progressionLocked);
    btn.setAttribute("aria-disabled", progressionLocked ? "true" : "false");

    if (progressionLocked) {
      btn.title = guest
        ? `${questsPvpUnlockMessage(feature)} ${signInNudge}.`
        : questsPvpUnlockMessage(feature);
      syncTabSignInBadge(btn, guest, "Sign in");
    } else if (guest) {
      btn.title = signInNudge;
      syncTabSignInBadge(btn, tab === "pvp", "Sign in");
    } else {
      btn.title = "";
      syncTabSignInBadge(btn, false);
    }
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
    const feature = tab === "pvp" ? "PvP" : "Quests";
    const guest = isGuestPlayer();
    const signInNudge = tab === "pvp" ? GUEST_SIGN_IN_NUDGE_PVP : GUEST_SIGN_IN_NUDGE_SAVE;
    const message = guest
      ? `${questsPvpUnlockMessage(feature)}\n\n${signInNudge}.`
      : questsPvpUnlockMessage(feature);
    const goToAdventure = await mobileConfirm(message, {
      title: `${feature} locked`,
      confirmLabel: "Go to Adventure",
      cancelLabel: guest ? "Sign in" : "Not now",
    });
    if (goToAdventure) {
      bypassQuestsPvpGate = true;
      showTab("play");
      bypassQuestsPvpGate = false;
    } else if (guest) {
      authUI?.open("signin", { forced: true });
    }
    return;
  }
  reconcileMatchShellState();
  if (isMatchActive() && isLiveMatchUiVisible()) {
    if (tab === activeTab) return;
    const switchingToActivePvpMatch = tab === "pvp" && document.getElementById("pvp-match-root");
    if (!switchingToActivePvpMatch) {
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
  }
  if (
    deckSubview === "edit" &&
    (tab !== "deck" || (tab === "deck" && activeTab === "deck"))
  ) {
    if (!(await confirmDiscardDeckChanges())) return;
    discardDeckEdit();
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
    showDeckSubview("list");
  }
  if (tab === "profile") void renderProfile();
  if (tab === "settings") void renderSettings();
  if (tab === "quests") void renderQuests();
  if (tab === "play") showAdventureMap();
  if (tab === "pvp") {
    void ensurePvpUI()
      .then((c) => c?.render({ resume: true }))
      .catch((err) => {
        console.error("[PvP] init failed", err);
        const root = document.getElementById("view-pvp");
        if (root && !root.innerHTML.trim()) {
          root.innerHTML =
            '<section class="panel game-panel pvp-panel"><p class="pvp-status pvp-status--error">Couldn\'t load PvP — please reload the page.</p></section>';
        }
      });
  }
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

async function renderProfile() {
  const { renderProfileTab } = await loadProfileUIChunk();
  const root = $("view-profile");
  renderProfileTab(profile, root, {
    onGemsChange: updateGemHeader,
    onTitleChanged: () => updateHeaderProfileBtn(),
  });
}

async function renderSettings() {
  const { renderSettingsTab } = await loadSettingsUIChunk();
  const root = $("view-settings");
  renderSettingsTab(root, {
    onUsernameChanged: (name) => {
      headerDisplayUsername = name;
      updateHeaderProfileBtn(name);
    },
  });
}

async function renderQuests() {
  const { renderQuestsTab } = await loadProfileUIChunk();
  renderQuestsTab(profile, $("view-quests"), {
    onTitleChanged: () => updateHeaderProfileBtn(),
    onCurrencyChange: () => updateCurrencyHeader(),
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
const MAIN_TAB_INNER_SCROLL_MQ = "(max-width: 1280px)";
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
    captureDeckEditSnapshot();
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
  const { playChestOpenAnimation, playCosmeticOpenAnimation } = await loadAnimationsChunk();
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
      log.textContent = `Need ${cost} ★ stars. Clear Adventure floors to earn stars.`;
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
  void renderProfile();
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
    showUnlockHint(COSMETICS_UNLOCK_MESSAGE, "Cosmetics locked");
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
  void loadProfileUIChunk().then(({ renderCosmeticBoxes }) => {
    renderCosmeticBoxes(profile, $("cosmetic-box-list"), {
      logEl: $("cosmetic-box-log"),
      onGemsChange: updateGemHeader,
      cosmeticsUnlocked: isCosmeticsUnlocked(profile),
      onOpened: () => {
        if (activeTab === "profile") void renderProfile();
        if (activeTab === "quests") void renderQuests();
      },
    });
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
        <p class="chest-card__tagline">${formatRarityOdds(chest.weights)}</p>
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

      const { playChestOpenAnimation } = await loadAnimationsChunk();
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
    const ownedNow = collectionCount(profile, def.id);
    const inDeckNow = deckEdit ? countById(workingDeck)[def.id] || 0 : 0;
    const atMaxCopiesNow = ownedNow >= cap;
    const canAffordNow = profile.gems >= cost && !atMaxCopiesNow;
    const addCheckNow = deckEdit ? canAddCardToDeck(workingDeck, def.id, profile) : { ok: false };

    showCardPreview(def, {
      meta: deckEdit
        ? `Owned ${ownedNow}/${cap} · In deck ${inDeckNow}/${cap} · ${atMaxCopiesNow ? "max copies" : `${cost} gems per copy`}`
        : `Owned ${ownedNow}/${cap}${atMaxCopiesNow ? " · max copies" : ` · ${cost} gems per copy`}`,
      buyLabel: atMaxCopiesNow ? "Max copies owned" : `Buy copy (${cost} gems)`,
      buyDisabled: !canAffordNow || atMaxCopiesNow || ownedNow < 1,
      onBuy: () => {
        buyOne();
        closeCardPreview();
      },
      addDisabled: !addCheckNow.ok,
      onAdd: deckEdit
        ? () => {
            if (addCardToWorkingDeck(def.id)) openInspect();
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

function captureDeckEditSnapshot() {
  deckEditSnapshot = {
    name: $("deck-name-input")?.value?.trim() ?? "",
    cardIds: [...workingDeck],
  };
}

function hasUnsavedDeckChanges() {
  if (!deckEditSnapshot) return false;
  const name = $("deck-name-input")?.value?.trim() ?? "";
  if (name !== deckEditSnapshot.name) return true;
  if (workingDeck.length !== deckEditSnapshot.cardIds.length) return true;
  return workingDeck.some((id, i) => id !== deckEditSnapshot.cardIds[i]);
}

async function confirmDiscardDeckChanges() {
  if (!hasUnsavedDeckChanges()) return true;
  return mobileConfirm("Discard unsaved changes to this deck?", {
    title: "Unsaved changes",
    confirmLabel: "Discard",
    cancelLabel: "Keep editing",
    destructive: true,
  });
}

function discardDeckEdit() {
  editingDeckId = null;
  workingDeck = [];
  deckEditSnapshot = null;
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
          onRemove: () => removeAllFromDeck(def.id),
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
  discardDeckEdit();
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
  hideFloorModal();
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
  const p = MAP_THEME_PALETTES[theme] || MAP_THEME_PALETTES.verdant;
  const uid = `map-${theme}`;
  return `<svg class="adventure-map-scenery-svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#08060e"/>
        <stop offset="35%" stop-color="${p.sky}"/>
        <stop offset="70%" stop-color="${p.skyGlow}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${p.grassDark}"/>
      </linearGradient>
      <linearGradient id="${uid}-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.grassDark}"/>
        <stop offset="100%" stop-color="#0a0808"/>
      </linearGradient>
      <linearGradient id="${uid}-foundation" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.rock}"/>
        <stop offset="100%" stop-color="${p.rockDark}"/>
      </linearGradient>
      <radialGradient id="${uid}-glow" cx="50%" cy="22%" r="50%">
        <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${p.accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${uid}-storm" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stop-color="#1a1028" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#000" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="${uid}-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2"/>
      </filter>
      <filter id="${uid}-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.8" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="120" fill="url(#${uid}-sky)"/>
    <rect width="100" height="120" fill="url(#${uid}-storm)"/>
    <rect width="100" height="120" fill="url(#${uid}-glow)"/>
    <!-- distant ruined castle silhouettes -->
    <g opacity="0.35" fill="#1a1420">
      <rect x="6" y="36" width="5" height="22" rx="0.5"/>
      <rect x="4" y="42" width="9" height="3"/>
      <rect x="14" y="44" width="12" height="14"/>
      <polygon points="14,44 20,36 26,44" fill="#120e18"/>
      <rect x="76" y="34" width="6" height="24" rx="0.5"/>
      <rect x="74" y="40" width="10" height="3"/>
      <rect x="68" y="46" width="14" height="12"/>
      <polygon points="68,46 75,38 82,46" fill="#120e18"/>
      <rect x="42" y="48" width="3" height="10" opacity="0.6"/>
      <rect x="54" y="50" width="2" height="8" opacity="0.5"/>
    </g>
    <!-- jagged hills -->
    <path fill="${p.grassDark}" opacity="0.55" d="M0 48 C12 40 22 44 36 38 C50 32 62 40 76 36 C88 32 96 38 100 34 L100 68 L0 68 Z"/>
    <path fill="#0a0808" opacity="0.45" d="M0 54 C18 46 30 50 50 44 C70 38 84 46 100 42 L100 78 L0 78 Z"/>
    <!-- dead twisted trees -->
    <g opacity="0.5" stroke="${p.rockDark}" stroke-width="0.6" fill="none">
      <path d="M8 68 L10 56 M10 60 L6 58 M10 58 L13 55"/>
      <path d="M90 64 L92 52 M92 56 L88 54 M92 54 L95 50"/>
    </g>
    <!-- storm clouds -->
    <ellipse cx="18" cy="14" rx="16" ry="6" fill="#4a4068" opacity="0.85" filter="url(#${uid}-soft)"/>
    <ellipse cx="28" cy="12" rx="12" ry="5" fill="#3a3458" opacity="0.8" filter="url(#${uid}-soft)"/>
    <ellipse cx="72" cy="10" rx="18" ry="7" fill="#4a4068" opacity="0.9" filter="url(#${uid}-soft)"/>
    <ellipse cx="84" cy="9" rx="11" ry="5" fill="#3a3458" opacity="0.75" filter="url(#${uid}-soft)"/>
    <ellipse cx="48" cy="18" rx="14" ry="5" fill="#504070" opacity="0.65" filter="url(#${uid}-soft)"/>
    <!-- eerie moon -->
    <circle cx="78" cy="22" r="6" fill="#d8d0c0" opacity="0.35" filter="url(#${uid}-soft)"/>
    <circle cx="80" cy="20.5" r="5.2" fill="#141020" opacity="0.9"/>
    <!-- distant lightning flash -->
    <path d="M62 8 L64 18 L61 18 L63 28" stroke="${p.accent}" stroke-width="0.8" opacity="0.55" fill="none" filter="url(#${uid}-glow-filter)"/>
    <path d="M62 8 L64 18 L61 18 L63 28" stroke="#fff" stroke-width="0.3" opacity="0.4" fill="none"/>
    <!-- eerie embers / wisps -->
    <circle cx="24" cy="30" r="0.5" fill="${p.accent}" opacity="0.45" filter="url(#${uid}-glow-filter)"/>
    <circle cx="70" cy="26" r="0.4" fill="${p.flag}" opacity="0.35" filter="url(#${uid}-glow-filter)"/>
    <circle cx="44" cy="34" r="0.35" fill="${p.accent}" opacity="0.3" filter="url(#${uid}-glow-filter)"/>
    <!-- ravens -->
    <g opacity="0.4" fill="#0a0808">
      <path d="M32 28 Q34 26 36 28 Q34 27 32 28Z"/>
      <path d="M58 24 Q60 22 62 24 Q60 23 58 24Z"/>
    </g>
    <!-- ground -->
    <rect x="0" y="82" width="100" height="38" fill="url(#${uid}-hill)"/>
    <ellipse cx="50" cy="86" rx="48" ry="8" fill="rgba(0,0,0,0.35)"/>
    <!-- tower foundation platform -->
    <path fill="url(#${uid}-foundation)" d="M10 88 L90 88 L94 96 L6 96 Z"/>
    <path fill="${p.rockDark}" d="M6 96 L94 96 L92 102 L8 102 Z"/>
    <path fill="${p.rockDark}" opacity="0.85" d="M0 102 L100 102 L100 120 L0 120 Z"/>
    <path fill="none" stroke="${p.flag}" stroke-width="0.3" opacity="0.2" d="M12 90 L88 90"/>
    <!-- braziers flanking tower base -->
    <g opacity="0.9">
      <rect x="18" y="80" width="2" height="8" fill="${p.rockDark}"/>
      <ellipse cx="19" cy="79" rx="2.5" ry="3" fill="${p.accent}" filter="url(#${uid}-glow-filter)" opacity="0.7"/>
      <ellipse cx="19" cy="79" rx="1.2" ry="1.5" fill="#fff8e0" opacity="0.5"/>
      <rect x="80" y="80" width="2" height="8" fill="${p.rockDark}"/>
      <ellipse cx="81" cy="79" rx="2.5" ry="3" fill="${p.accent}" filter="url(#${uid}-glow-filter)" opacity="0.7"/>
      <ellipse cx="81" cy="79" rx="1.2" ry="1.5" fill="#fff8e0" opacity="0.5"/>
    </g>
    <!-- ground fog wisps -->
    <ellipse cx="30" cy="92" rx="22" ry="5" fill="#b8b0c8" opacity="0.22" filter="url(#${uid}-soft)"/>
    <ellipse cx="70" cy="94" rx="24" ry="6" fill="#b8b0c8" opacity="0.18" filter="url(#${uid}-soft)"/>
    <ellipse cx="50" cy="96" rx="30" ry="4" fill="#a8a0b8" opacity="0.15" filter="url(#${uid}-soft)"/>
  </svg>`;
}

function getMapPawnMarkup(accent = "#e8c547") {
  return `<svg class="adventure-map-tile__pawn-svg" viewBox="0 0 28 36" aria-hidden="true">
    <defs>
      <linearGradient id="pawn-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0e8d8"/>
        <stop offset="100%" stop-color="#c8b898"/>
      </linearGradient>
      <radialGradient id="pawn-gem" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="100%" stop-color="#8a6910"/>
      </radialGradient>
      <filter id="pawn-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="14" cy="34" rx="8" ry="2.2" fill="rgba(0,0,0,0.35)"/>
    <path fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.7"
      d="M14 3 C18 3 21 7 21 12 C21 17 17 19 14 23 C11 19 7 17 7 12 C7 7 10 3 14 3 Z"/>
    <circle cx="14" cy="11" r="4" fill="url(#pawn-gem)" stroke="#c9a227" stroke-width="0.8" filter="url(#pawn-glow)"/>
    <path fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.6"
      d="M14 6 L14 16 M11 9 L17 9 M11 13 L17 13"/>
    <rect x="11.5" y="21" width="5" height="11" rx="1.2" fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.6"/>
    <ellipse cx="14" cy="32" rx="6.5" ry="2.2" fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.6"/>
    <circle cx="14" cy="11" r="1.2" fill="#fff" opacity="0.55"/>
  </svg>`;
}

function getMapBannerMarkup(theme) {
  const p = MAP_THEME_PALETTES[theme] || MAP_THEME_PALETTES.verdant;
  return `<svg class="adventure-map-tile__banner-svg" viewBox="0 0 24 20" aria-hidden="true">
    <defs>
      <linearGradient id="banner-cloth" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.accent}"/>
        <stop offset="100%" stop-color="${p.flag}"/>
      </linearGradient>
    </defs>
    <rect x="11" y="2" width="2" height="16" fill="${p.rockDark}" rx="0.5"/>
    <circle cx="12" cy="2" r="1.5" fill="${p.flag}"/>
    <path fill="url(#banner-cloth)" d="M13 4 C18 5 20 8 20 10 C20 12 18 14 13 15 Z"/>
    <path fill="none" stroke="${p.flag}" stroke-width="0.5" opacity="0.6" d="M14 7 L18 8 M14 10 L18 10 M14 13 L17 12"/>
  </svg>`;
}


function fitAdventureMapCanvasHeight(map) {
  const tower = map?.querySelector(".adventure-map-tower");
  if (!map || !tower) return;

  const tabletMq = window.matchMedia("(min-width: 600px) and (max-width: 1400px)");

  const measureEls = () => [
    tower,
    ...tower.querySelectorAll(
      ".adventure-map-tile, .adventure-map-tower__base, .adventure-map-tower__mist, .adventure-map-tower__beacon"
    ),
  ];

  const sync = () => {
    const mapRect = map.getBoundingClientRect();
    let minY = Infinity;
    let maxY = -Infinity;
    for (const el of measureEls()) {
      const rect = el.getBoundingClientRect();
      if (!rect.height && !rect.width) continue;
      minY = Math.min(minY, rect.top);
      maxY = Math.max(maxY, rect.bottom);
    }
    if (!Number.isFinite(minY)) return;

    const span = maxY - minY;
    const topHeadroom = tabletMq.matches
      ? Math.max(Math.round(span * 0.06), 24)
      : Math.max(Math.round(span * 0.12), 32);
    const bottomOffset = parseFloat(getComputedStyle(tower).bottom) || 0;
    const visualBottom = maxY - mapRect.top;
    let height = Math.ceil(Math.max(visualBottom + bottomOffset, span + topHeadroom + bottomOffset));

    const scene = map.closest(".adventure-map-scene");
    if (scene && tabletMq.matches) {
      height = Math.max(height, scene.clientHeight);
    }

    map.style.minHeight = `${height}px`;
    map.style.height = `${height}px`;

    if (scene) {
      const maxScrollTop = Math.max(0, map.offsetHeight - scene.clientHeight);
      if (scene.scrollTop > maxScrollTop) scene.scrollTop = maxScrollTop;
    }
  };

  requestAnimationFrame(() => {
    sync();
    requestAnimationFrame(sync);
  });
}

function clampAdventureMapScroll() {
  const map = $("adventure-map");
  const scene = map?.closest(".adventure-map-scene");
  if (!map || !scene) return;
  const maxScrollTop = Math.max(0, map.offsetHeight - scene.clientHeight);
  if (scene.scrollTop > maxScrollTop) scene.scrollTop = maxScrollTop;
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
      btn.innerHTML = `<span class="adventure-world-shield__icon" aria-hidden="true"></span><span class="adventure-world-shield__label">Tower ${w.id}</span>`;
      btn.title = unlocked ? w.name : `Clear floor ${BONUS_WORLDS_UNLOCK_AT_LEVEL} to unlock`;
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

  const worldMeta = WORLDS.find((w) => w.id === selectedAdventureWorldId);

  const map = $("adventure-map");
  if (!map) return;
  const theme = worldMeta?.theme || "verdant";
  const palette = MAP_THEME_PALETTES[theme] || MAP_THEME_PALETTES.verdant;
  map.className = `adventure-map-canvas adventure-map-canvas--${theme} adventure-map-canvas--iso`;
  map.style.setProperty("--map-accent", palette.accent);
  map.style.setProperty("--map-glow", palette.glow);
  map.style.setProperty("--map-mist", palette.mist);
  map.style.setProperty("--map-stone-light", palette.stoneLight);
  map.style.setProperty("--map-stone-mid", palette.stoneMid);
  map.style.setProperty("--map-stone-dark", palette.stoneDark);
  map.style.setProperty("--map-stone-side", palette.stoneSide);
  map.style.setProperty("--map-moss", palette.moss);
  map.setAttribute("role", "group");
  map.setAttribute("aria-label", "Adventure floor map");
  const challengeUnlocked = isChallengeModeUnlocked(progress);
  const challengeOn = isChallengeModeEnabled(progress);
  const showChallengeToggle = selectedAdventureWorldId === 5 && challengeUnlocked;
  const challengeCornerHtml = showChallengeToggle
    ? `<div class="adventure-map-challenge-corner">
        <div class="adventure-map-ominous__moon" aria-hidden="true"></div>
        <button type="button" class="adventure-challenge-toggle${challengeOn ? " adventure-challenge-toggle--on" : ""}"
          aria-pressed="${challengeOn ? "true" : "false"}"
          title="Challenge mode: enemy starts with an extra rank of pieces on rank 5">
          <span class="adventure-challenge-toggle__icon" aria-hidden="true">⚔</span>
          <span class="adventure-challenge-toggle__label">Challenge</span>
        </button>
      </div>`
    : "";
  map.innerHTML = `
    <div class="adventure-map-canvas__bg" aria-hidden="true">
      <div class="adventure-map-scenery adventure-map-scenery--${theme}" aria-hidden="true">${getMapSceneryMarkup(theme)}</div>
      <div class="adventure-map-atmosphere" aria-hidden="true"></div>
      <div class="adventure-map-ominous" aria-hidden="true">
        <div class="adventure-map-ominous__sky"></div>
        <div class="adventure-map-ominous__moon" aria-hidden="true"></div>
        <div class="adventure-map-ominous__clouds"></div>
        <div class="adventure-map-ominous__vignette"></div>
        <div class="adventure-map-ominous__fog"></div>
        <div class="adventure-map-ominous__fog adventure-map-ominous__fog--slow"></div>
      </div>
    </div>
    ${challengeCornerHtml}
    <div class="adventure-map-tower">
      <div class="adventure-map-tower__base" aria-hidden="true"></div>
      <div class="adventure-map-tower__shaft" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--left" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--right" aria-hidden="true"></div>
      <div class="adventure-map-tiles"></div>
      <div class="adventure-map-tower__mist" aria-hidden="true"></div>
      <div class="adventure-map-tower__beacon" aria-hidden="true"></div>
      <div class="adventure-map-tower__haze" aria-hidden="true"></div>
    </div>`;

  const tilesLayer = map.querySelector(".adventure-map-tiles");
  const tower = map.querySelector(".adventure-map-tower");
  const levels = getLevelsForWorld(selectedAdventureWorldId);
  const nextId = getNextPlayableLevelId(progress);
  const mapScale = getAdventureMapTabletScale();

  tower?.style.setProperty("--tower-top-ratio", "0.72");
  tower?.style.setProperty("--adventure-map-scale", String(mapScale));

  levels.forEach((level, i) => {
    const unlocked = isLevelUnlocked(progress, level.id);
    const cleared = isLevelCleared(progress, level.id);
    const isNext = level.id === nextId && unlocked;
    const stars = getLevelStars(progress, level.id);
    const floorT = (level.floorInWorld - 1) / 9;
    const taper = 1 - floorT * 0.26;
    const floorScale = taper * mapScale;
    const floorHeightScale = (1 - floorT * 0.1) * mapScale;
    const spiralOffset = Math.sin((level.floorInWorld - 1) * 0.62) * 0.32 * taper * mapScale;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "adventure-map-tile";
    tile.classList.add(`adventure-map-tile--floor-${level.floorInWorld}`);
    tile.style.zIndex = String(i + 10);
    tile.style.setProperty("--floor-scale", floorScale.toFixed(4));
    tile.style.setProperty("--floor-height-scale", floorHeightScale.toFixed(4));
    tile.style.setProperty("--floor-offset-x", `${spiralOffset.toFixed(3)}rem`);
    tile.dataset.level = String(level.id);
    if (!unlocked) tile.classList.add("adventure-map-tile--locked");
    if (cleared) tile.classList.add("adventure-map-tile--cleared");
    if (isNext) tile.classList.add("adventure-map-tile--next");
    if (level.floorInWorld >= 7 && level.floorInWorld < 10) tile.classList.add("adventure-map-tile--rampart");
    if (level.floorInWorld === 10) tile.classList.add("adventure-map-tile--summit");
    tile.setAttribute("aria-disabled", unlocked ? "false" : "true");
    if (!unlocked) tile.title = `Clear global floor ${level.id - 1} to unlock`;
    tile.setAttribute("aria-label", `Floor ${level.floorInWorld}: ${level.opponent}, ${level.flavor}`);
    const starLine = cleared ? `<span class="adventure-map-tile__stars">${formatStars(stars)}</span>` : "";
    const pawn = isNext ? `<span class="adventure-map-tile__pawn">${getMapPawnMarkup(palette.accent)}</span>` : "";
    const banner = level.floorInWorld === 10 ? `<span class="adventure-map-tile__banner">${getMapBannerMarkup(theme)}</span>` : "";
    const windows = level.floorInWorld > 1 && level.floorInWorld < 10
      ? '<span class="adventure-map-tile__windows" aria-hidden="true"></span>'
      : "";
    const torch = cleared ? '<span class="adventure-map-tile__torch" aria-hidden="true"></span>' : "";
    const ivy = level.floorInWorld <= 3 ? '<span class="adventure-map-tile__ivy" aria-hidden="true"></span>' : "";
    tile.innerHTML = `
      ${pawn}
      ${banner}
      <span class="adventure-map-tile__stone" aria-hidden="true">
        <span class="adventure-map-tile__rune"></span>
        <span class="adventure-map-tile__crenel"></span>
        ${ivy}
        ${windows}
        ${torch}
        <span class="adventure-map-tile__face">
          <span class="adventure-map-tile__num">${level.floorInWorld}</span>
          ${starLine}
        </span>
        <span class="adventure-map-tile__side adventure-map-tile__side--left"></span>
        <span class="adventure-map-tile__side adventure-map-tile__side--right"></span>
        <span class="adventure-map-tile__moss"></span>
      </span>`;
    if (!unlocked) tile.disabled = true;
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAdventureFloor(level.id);
      }
    });
    tilesLayer?.appendChild(tile);
  });


  const floorList = $("adventure-floor-list");
  if (floorList) {
    floorList.classList.add("adventure-floor-list--sr");
    floorList.innerHTML = "";
    for (const level of levels) {
      const unlocked = isLevelUnlocked(progress, level.id);
      const cleared = isLevelCleared(progress, level.id);
      const isNext = level.id === nextId && unlocked;
      const stars = getLevelStars(progress, level.id);
      const row = document.createElement("button");
      row.type = "button";
      row.className = "adventure-floor-row";
      if (!unlocked) row.disabled = true;
      if (cleared) row.classList.add("adventure-floor-row--cleared");
      if (isNext) row.classList.add("adventure-floor-row--next");
      row.innerHTML = `
        <span class="adventure-floor-row__main">
          <span class="adventure-floor-row__title">${level.floorInWorld}. ${level.opponent}</span>
          <span class="adventure-floor-row__flavor">${level.flavor}</span>
        </span>
        ${isNext ? '<span class="adventure-floor-row__badge">Next</span>' : ""}
        ${stars > 0 ? `<span class="adventure-floor-row__stars">${formatStars(stars)}</span>` : ""}`;
      row.addEventListener("click", () => openAdventureFloor(level.id));
      floorList.appendChild(row);
    }
  }

  const nextTile = map.querySelector(".adventure-map-tile--next");
  fitAdventureMapCanvasHeight(map);
  if (nextTile) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => nextTile.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    });
  }

  const nextRow = floorList?.querySelector(".adventure-floor-row--next");
  if (nextRow) {
    requestAnimationFrame(() => nextRow.scrollIntoView({ behavior: "smooth", block: "end" }));
  }

  map.querySelector(".adventure-challenge-toggle")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    progress.challengeMode = !progress.challengeMode;
    profile.adventure = progress;
    saveProfile(profile);
    void hapticLight();
    AudioSfx.tap();
    renderAdventureMap();
  });
}


function openAdventurePrebattle(levelId) {
  const level = getLevel(levelId);
  if (!level || !isLevelUnlocked(profile.adventure, levelId)) return;

  selectedAdventureLevel = levelId;
  showFloorModal();

  const title = $("prebattle-title");
  const flavor = $("prebattle-flavor");
  const opponent = $("prebattle-opponent");
  if (title) title.textContent = `Tower ${level.worldId} · Floor ${level.floorInWorld}`;
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
    const base = isLevelCleared(profile.adventure, levelId)
      ? `Repeat clear: +${gems} gems`
      : `First clear: +${gems} gems`;
    const challenge =
      level.worldId === 5 && isChallengeModeEnabled(profile.adventure)
        ? " · Challenge mode: enemy has an extra rank of pieces"
        : "";
    gemHint.textContent = base + challenge;
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


async function launchAdventureMatch(
  deck,
  level,
  enemyDeck,
  levelId,
  resumeState = null,
  winRewarded = false,
  challengeModeOverride = undefined,
) {
  const opponentName = level.opponent;
  closeAdventurePrebattle();
  pendingEnemyDeck = null;

  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $("view-match")?.classList.remove("hidden");
  const root = $("view-match");
  if (!root) return;

  const { MatchSession, getMatchHtml } = await loadMatchChunk();
  root.innerHTML = getMatchHtml(opponentName);

  const challengeMode =
    challengeModeOverride ??
    (getWorldForLevel(levelId).id === 5 && isChallengeModeEnabled(profile.adventure));

  const adventureCtx = { levelId, deckId: deck.id, challengeMode };

  const sessionOpts = {
    aiDeckIds: enemyDeck,
    opponentName,
    cosmetics: getEquippedCosmetics(profile),
    profile,
    challengeMode,
    buildGameOverActions: ({ won, isTie }) => buildAdventureGameOverActions(adventureCtx, { won, isTie }),
    onGameOverAction: (actionId) => {
      void handleAdventureGameOverAction(actionId, adventureCtx, root);
    },
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
        if (pendingPostFloor1Tutorials) {
          schedulePostFloor1Tutorials();
        }
        if (pendingPostFloor5CosmeticsTutorial) {
          schedulePostFloor5CosmeticsTutorial();
        }
      },
      (stars) => {
        const result = recordLevelClear(profile, levelId, stars);
        const { gems, stars: bestStars, starsGained } = result;
        profile.gems += gems;
        trackDailyQuestEvent(profile, "adventure_floors", 1);
        syncExplorer(profile);
        saveProfile(profile);
        updateCurrencyHeader();
        syncNavUnlockState();
        if (levelId === 1 && result.firstTime) {
          pendingPostFloor1Tutorials = true;
          schedulePostFloor1Tutorials();
        }
        if (levelId === 5 && result.firstTime) {
          pendingPostFloor5CosmeticsTutorial = true;
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
    challengeMode,
  });
  await lockPortrait();
  setAudioMode("match");
  if (winRewarded) matchSession.winRewarded = true;
  saveMatchCheckpoint(matchSession);
  matchSession.setMessage("");
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
  await launchAdventureMatch(
    deck,
    level,
    cp.aiDeckIds,
    cp.levelId,
    cp.state,
    cp.winRewarded,
    cp.challengeMode,
  );
  matchSession?.setMessage("Match resumed — pick up where you left off.");
  return true;
}

function buildAdventureGameOverActions({ levelId }, { won, isTie }) {
  const nextId = levelId + 1;
  const hasNextFloor =
    won && nextId <= ADVENTURE_LEVEL_COUNT && isLevelUnlocked(profile.adventure, nextId);

  if (isTie) {
    return [{ id: "backToAdventure", label: "Back to Adventure", primary: true }];
  }

  if (won) {
    const actions = [];
    if (hasNextFloor) {
      actions.push({ id: "nextFloor", label: "Next floor", primary: true });
      actions.push({ id: "retry", label: "Retry floor" });
      actions.push({ id: "editDeck", label: "Edit deck" });
      actions.push({ id: "backToAdventure", label: "Back to Adventure" });
    } else {
      actions.push({ id: "backToAdventure", label: "Back to Adventure", primary: true });
      actions.push({ id: "retry", label: "Retry floor" });
      actions.push({ id: "editDeck", label: "Edit deck" });
    }
    return actions;
  }

  return [
    { id: "retry", label: "Retry floor", primary: true },
    { id: "editDeck", label: "Edit deck" },
    { id: "backToAdventure", label: "Back to Adventure" },
  ];
}

async function handleAdventureGameOverAction(actionId, { levelId, deckId, challengeMode }, root) {
  const deck = profile.decks.find((d) => d.id === deckId);

  if (actionId === "backToAdventure") {
    matchSession?.onExit?.();
    return;
  }

  if (actionId === "editDeck") {
    matchSession?.dispose();
    matchSession = null;
    exitMatchMode();
    void lockPortrait();
    setAudioMode("hub");
    root.innerHTML = "";
    root.classList.add("hidden");
    showTab("deck");
    openDeckEdit(deckId);
    return;
  }

  if (actionId === "retry" || actionId === "nextFloor") {
    const targetLevelId = actionId === "nextFloor" ? levelId + 1 : levelId;
    const level = getLevel(targetLevelId);
    if (!deck || deck.cardIds.length !== DECK_SIZE || !level) {
      matchSession?.onExit?.();
      return;
    }
    matchSession?.dispose();
    matchSession = null;
    exitMatchMode();
    const enemyDeck = getOrCreateLevelEnemyDeck(profile, targetLevelId);
    await launchAdventureMatch(
      deck,
      level,
      enemyDeck,
      targetLevelId,
      null,
      false,
      actionId === "retry" ? challengeMode : undefined,
    );
  }
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
        opponent.textContent = "Could not start battle — close and pick the floor again.";
      }
    }
    return;
  }

  void launchAdventureMatch(deck, level, enemyDeck, levelId);
}


function bindAdventureMapCapture() {
  if (window.__adventureMapCaptureBound) return;
  window.__adventureMapCaptureBound = true;

  const MAP_TARGET_SELECTOR = "#adventure-map .adventure-map-tile, #adventure-map .adventure-map-pin";
  const TAP_MOVE_THRESHOLD = 12;
  const SCROLL_DELTA_THRESHOLD = 3;

  let activeTap = null;
  let suppressClick = false;
  let suppressClickTimer = 0;

  const getMapTarget = (target) => target.closest?.(MAP_TARGET_SELECTOR);
  const getScrollParent = (el) => el?.closest?.(".adventure-map-scene");

  const suppressClickBriefly = () => {
    suppressClick = true;
    clearTimeout(suppressClickTimer);
    suppressClickTimer = setTimeout(() => {
      suppressClick = false;
    }, 280);
  };

  const activateFloor = (pin, e) => {
    if (!pin || pin.disabled) return;
    const levelId = Number(pin.dataset.level);
    if (!Number.isFinite(levelId) || levelId < 1) return;
    e.preventDefault();
    e.stopPropagation();
    openAdventureFloor(levelId);
  };

  document.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const pin = getMapTarget(e.target);
    if (!pin || pin.disabled) return;
    const scrollEl = getScrollParent(pin);
    activeTap = {
      pin,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      scrollTop: scrollEl?.scrollTop ?? 0,
      scrollLeft: scrollEl?.scrollLeft ?? 0,
      cancelled: false,
    };
  }, true);

  document.addEventListener("pointermove", (e) => {
    if (!activeTap || e.pointerId !== activeTap.pointerId || activeTap.cancelled) return;
    const dx = e.clientX - activeTap.startX;
    const dy = e.clientY - activeTap.startY;
    if (Math.hypot(dx, dy) > TAP_MOVE_THRESHOLD) activeTap.cancelled = true;
    const scrollEl = getScrollParent(activeTap.pin);
    if (scrollEl) {
      if (Math.abs(scrollEl.scrollTop - activeTap.scrollTop) > SCROLL_DELTA_THRESHOLD) activeTap.cancelled = true;
      if (Math.abs(scrollEl.scrollLeft - activeTap.scrollLeft) > SCROLL_DELTA_THRESHOLD) activeTap.cancelled = true;
    }
  }, true);

  document.addEventListener("pointerup", (e) => {
    if (!activeTap || e.pointerId !== activeTap.pointerId) return;
    const { pin, cancelled } = activeTap;
    activeTap = null;
    if (cancelled) {
      suppressClickBriefly();
      return;
    }
    activateFloor(pin, e);
    suppressClickBriefly();
  }, true);

  document.addEventListener("pointercancel", (e) => {
    if (!activeTap || e.pointerId !== activeTap.pointerId) return;
    activeTap = null;
    suppressClickBriefly();
  }, true);

  document.addEventListener("click", (e) => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const pin = getMapTarget(e.target);
    if (!pin || pin.disabled) return;
    activateFloor(pin, e);
  }, true);
}

function openAdventureFloor(levelId) {
  const live = repairAdventureProgress(profile.adventure);
  profile.adventure = live;
  if (!isLevelUnlocked(live, levelId)) {
    showUnlockHint(
      `Locked — beat global floor ${levelId - 1} first, then return here.`,
      "Floor locked",
    );
    return;
  }
  saveProfile(profile);
  openAdventurePrebattle(levelId);
}

function init() {
  ensureBottomNavOnBody();
  window.addEventListener("orientationchange", ensureBottomNavOnBody);
  window.addEventListener("resize", ensureBottomNavOnBody);
  syncMainTabShellState();
  initSettings();
  initNavIcons();
  initNetworkBanner();
  initAudio();
  void initOrientation();
  void initCapacitor();
  bindCardPreviewModal();
  bindAdventureMapCapture();
  ensureFloorModalOnBody();
  document.querySelector(".adventure-map-scene")?.addEventListener("scroll", clampAdventureMapScroll, { passive: true });
  let adventureMapResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(adventureMapResizeTimer);
    adventureMapResizeTimer = setTimeout(() => {
      if (!document.body.classList.contains("adventure-active")) return;
      const map = $("adventure-map");
      if (map) fitAdventureMapCanvasHeight(map);
    }, 120);
  });
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
  $("btn-back-from-edit")?.addEventListener("click", async () => {
    if (!(await confirmDiscardDeckChanges())) return;
    discardDeckEdit();
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
    discardDeckEdit();
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
  $("adventure-floor-backdrop")?.addEventListener("click", closeAdventurePrebattle);
  $("btn-start-adventure")?.addEventListener("click", startAdventureMatch);
  resolveNativeSelect("adventure-deck-select")?.addEventListener("change", (e) => {
    profile.selectedDeckId = e.target.value;
    saveProfile(profile);
  });

  const authModal = document.getElementById("auth-modal");
  const authBtn = document.getElementById("auth-header-btn");
  initHeaderProfileMenu();
  initPanelHelp("adventure-help-btn", "adventure-help-desc");
  initPanelHelp("shop-help-btn", "shop-help-desc");
  initPanelHelp("deck-help-btn", "deck-help-desc");

  authGate = initAuthGate({
    onSignIn: () => authUI?.open("signin", { forced: true }),
    onSignUp: () => authUI?.open("signup", { forced: true }),
    onGuest: () => {
      enterGuestMode();
      void startAppAfterAuthGate();
    },
  });

  authUI = initAuthUI({
    authBtn,
    modal: authModal,
    onNewAccount: () => {
      profile = getStoredProfileOwnerId() ? resetToDefaultProfile() : loadProfile();
      prepareInteractiveTutorialForNewAccount(profile, saveProfile);
    },
    onSignedIn: () => {
      clearGuestMode();
      profile = loadProfile();
      repairProfile(profile);
      syncTutorialStorageWithProfile(profile);
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
      authGate?.hide();
      void refreshHeaderIdentity().then(() => {
        if (activeTab === "profile") void renderProfile();
        if (activeTab === "quests") void renderQuests();
        if (activeTab === "pvp") void ensurePvpUI().then((c) => c?.render({ resume: true }));
      });
      void ensurePvpUI().then((c) => c?.render({ resume: true }));
      void maybeStartInteractiveTutorial();
      void maybeStartMetaTutorial();
      void maybeStartPostFloor1Tutorials();
      void maybeStartPostFloor5CosmeticsTutorial();
      if (!tutorialRunning) {
        showTab(activeTab);
      }
    },
    onSignedOut: () => {
      clearGuestMode();
      closeHeaderProfileMenu();
      headerDisplayUsername = "";
      updateHeaderProfileBtn();
      pvpController?.dispose?.();
      matchSession = null;
      exitMatchMode({ clearCheckpoint: true });
      reconcileMatchShellState();
      profile = resetToDefaultProfile();
      syncNavUnlockState();
      updateCurrencyHeader();
      renderDeckList();
      renderStarsShop();
      authGate?.show();
      showTab("deck");
    },
  });

  bindMatchVisibilityHandlers(() => matchSession);
  repairProfile(profile);
  syncCollectionFilterControls();
  syncNavUnlockState();

  void bootstrapAfterAuth();
}

function schedulePostFloor1Tutorials() {
  if (!pendingPostFloor1Tutorials) return;
  if (postFloor1TutorialTimer != null) return;

  let attempts = 0;
  const maxAttempts = 10;

  const tryStart = () => {
    postFloor1TutorialTimer = null;
    attempts += 1;
    if (!pendingPostFloor1Tutorials) return;
    if (isLiveMatchUiVisible()) {
      if (attempts < maxAttempts) {
        postFloor1TutorialTimer = window.setTimeout(tryStart, 400);
      }
      return;
    }
    syncTutorialStorageWithProfile(profile);
    if (maybeStartPostFloor1Tutorials()) {
      pendingPostFloor1Tutorials = false;
      return;
    }
    if (attempts < maxAttempts) {
      postFloor1TutorialTimer = window.setTimeout(tryStart, 500);
    }
  };

  postFloor1TutorialTimer = window.setTimeout(tryStart, 350);
}

function schedulePostFloor5CosmeticsTutorial() {
  if (!pendingPostFloor5CosmeticsTutorial) return;
  if (postFloor5CosmeticsTutorialTimer != null) return;

  let attempts = 0;
  const maxAttempts = 10;

  const tryStart = () => {
    postFloor5CosmeticsTutorialTimer = null;
    attempts += 1;
    if (!pendingPostFloor5CosmeticsTutorial) return;
    if (isLiveMatchUiVisible()) {
      if (attempts < maxAttempts) {
        postFloor5CosmeticsTutorialTimer = window.setTimeout(tryStart, 400);
      }
      return;
    }
    syncTutorialStorageWithProfile(profile);
    if (maybeStartPostFloor5CosmeticsTutorial()) {
      pendingPostFloor5CosmeticsTutorial = false;
      return;
    }
    if (attempts < maxAttempts) {
      postFloor5CosmeticsTutorialTimer = window.setTimeout(tryStart, 500);
    }
  };

  postFloor5CosmeticsTutorialTimer = window.setTimeout(tryStart, 350);
}

function maybeStartPvpTutorial() {
  if (tutorialRunning || !allowsAppAccess()) return false;
  if (!isQuestsAndPvpUnlocked(profile)) return false;
  if (!shouldShowPvpTutorial(profile)) return false;
  tutorialRunning = true;
  void loadTutorialUnlocksChunk().then(({ startPvpTutorial }) => {
    startPvpTutorial({
      profile,
      saveProfile,
      onComplete: () => {
        tutorialRunning = false;
        profile = loadProfile();
        repairProfile(profile);
        syncNavUnlockState();
        showTab("play");
        maybeStartPostFloor5CosmeticsTutorial();
      },
    });
  });
  return true;
}

function maybeStartPostFloor5CosmeticsTutorial() {
  if (tutorialRunning || !allowsAppAccess()) return false;
  if (!isCosmeticsUnlocked(profile)) return false;
  if (shouldShowInteractiveTutorial(profile) || shouldShowMetaTutorial(profile)) return false;
  if (shouldShowQuestsTutorial(profile) || shouldShowPvpTutorial(profile)) return false;
  if (!shouldShowCosmeticsTutorial(profile)) return false;
  tutorialRunning = true;
  showTab("play");
  void loadTutorialUnlocksChunk().then(({ startCosmeticsTutorial }) => {
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
  });
  return true;
}

function maybeStartPostFloor1Tutorials() {
  if (tutorialRunning || !allowsAppAccess()) return false;
  if (!isQuestsAndPvpUnlocked(profile)) return false;
  syncTutorialStorageWithProfile(profile);
  if (!shouldShowQuestsTutorial(profile)) return maybeStartPvpTutorial();
  tutorialRunning = true;
  showTab("play");
  void loadTutorialUnlocksChunk().then(({ startQuestsTutorial }) => {
    startQuestsTutorial({
      profile,
      saveProfile,
      onComplete: () => {
        tutorialRunning = false;
        profile = loadProfile();
        repairProfile(profile);
        syncNavUnlockState();
        maybeStartPvpTutorial();
        maybeStartPostFloor5CosmeticsTutorial();
      },
    });
  });
  return true;
}

function maybeStartInteractiveTutorial() {
  if (tutorialRunning || !allowsAppAccess()) return false;
  if (!shouldShowInteractiveTutorial(profile)) return false;
  tutorialRunning = true;
  void loadTutorialMatchChunk().then(({ startInteractiveTutorial }) => {
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
        maybeStartPostFloor1Tutorials();
        maybeStartPostFloor5CosmeticsTutorial();
      },
    });
  });
  return true;
}

function maybeStartMetaTutorial() {
  if (tutorialRunning || !allowsAppAccess()) return false;
  if (!shouldShowMetaTutorial(profile)) return false;
  tutorialRunning = true;
  showTab("deck");
  void loadTutorialMetaChunk().then(({ startMetaTutorial }) => {
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
        maybeStartPostFloor1Tutorials();
        maybeStartPostFloor5CosmeticsTutorial();
      },
    });
  });
  return true;
}

async function startAppAfterAuthGate() {
  authGate?.hide();

  if (maybeStartInteractiveTutorial()) return;
  if (maybeStartMetaTutorial()) return;
  if (maybeStartPostFloor1Tutorials()) return;
  if (maybeStartPostFloor5CosmeticsTutorial()) return;
  if (tutorialRunning) return;
  if (!(await tryResumeSavedMatch())) await showTab("deck");
  reconcileMatchShellState();
  setAudioMode("hub");
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
  if (pvpController) pvpController.render();
  reconcileMatchShellState();

  if (requiresAuthGate()) {
    authGate?.show();
    return;
  }

  await startAppAfterAuthGate();
}

init();
