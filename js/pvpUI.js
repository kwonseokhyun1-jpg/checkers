import {
  fetchProfileRow,
  getCurrentUser,
  initAuth,
  isAuthAvailable,
  onAuthChange,
} from "./auth.js";
import { DECK_SIZE } from "./cardCatalog.js";
import { describeDeckIssue, validateDeck } from "./deckRules.js";
import { COLORS } from "./board.js";
import { MatchSession, isPvpTerminalBoard, isMutualElimination } from "./match.js";
import { getMatchHtml } from "./matchView.js";
import {
  enterMatchMode,
  exitMatchMode,
  reconcileMatchShellState,
  consumePendingNavigationTab,
  isLiveMatchUiVisible,
} from "./matchLifecycle.js";
import {
  COSMETIC_BY_ID,
  cosmeticsWithPieceSkin,
  getEquippedCosmetics,
  getEquippedPieceSkin,
  normalizeCosmetics,
  pieceSkinsConflict,
  SAME_PIECE_SKIN_JOIN_MESSAGE,
} from "./cosmetics.js";
import {
  PvpService,
  probePvpBackend,
  subscribeOpenRooms,
  isMysteryMode,
  PVP_MODE_MYSTERY,
  PVP_MODE_NORMAL,
  saveActivePvpMatchId,
  readActivePvpMatchId,
  clearActivePvpMatchId,
  matchRowFingerprint,
  shouldApplyPvpRow,
  formatPvpError,
} from "./pvp.js";
import { showPvpMatchLoading } from "./pvpLoadingScreen.js";
import { lockPortrait } from "./orientation.js";
import { setAudioMode } from "./audio.js";
import { syncChampion } from "./achievements.js";
import { trackDailyQuestEvent } from "./dailyQuests.js";
import { recordPvpWin } from "./profileStats.js";
import { saveProfile } from "./storage.js";
import {
  bindPublicProfileViewButtons,
  buildRoomHostAvatarHtml,
} from "./userProfileModal.js";
import { enhanceSelect } from "./customSelect.js";
import { initPanelHelp } from "./panelHelp.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mysteryModeBadge() {
  return `<span class="pvp-mode-badge pvp-mode-badge--mystery">Mystery</span>`;
}

function roomModeLabel(room) {
  return isMysteryMode(room) ? mysteryModeBadge() : "";
}

function pvpPanelHead(descHtml) {
  return `
    <header class="panel-head panel-head--compact">
      <div class="panel-head-title-row">
        <h2 class="panel-head__title">PvP Arena</h2>
        <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How PvP Arena works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
      </div>
      <p id="pvp-help-desc" class="panel-head__desc" hidden>${descHtml}</p>
    </header>`;
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.root
 * @param {() => object} opts.getProfile
 * @param {() => void} opts.openAuthModal
 */
export function initPvpUI({ root, getProfile, openAuthModal, onNavigateTab, onPvpViewShown }) {
  if (!root) return { render: () => {}, dispose: () => {} };

  function bindPvpPanelHelp() {
    initPanelHelp(root.querySelector("#pvp-help-btn"), root.querySelector("#pvp-help-desc"));
  }

  let pvpService = null;
  let matchSession = null;
  let matchLaunching = false;
  let unsubscribeOpenRooms = null;
  let openRoomsPollId = null;
  let openRoomsRefreshTimer = null;
  let openRoomsRefreshPendingHost = null;
  let hostWaitingSync = false;
  let hostLaunchSync = false;
  let openRoomsRefreshInFlight = false;

  function stopOpenRoomsSync() {
    if (openRoomsPollId) {
      clearInterval(openRoomsPollId);
      openRoomsPollId = null;
    }
    if (openRoomsRefreshTimer) {
      clearTimeout(openRoomsRefreshTimer);
      openRoomsRefreshTimer = null;
    }
    openRoomsRefreshPendingHost = null;
    hostWaitingSync = false;
    hostLaunchSync = false;
    unsubscribeOpenRooms?.();
    unsubscribeOpenRooms = null;
  }

  function scheduleRefreshOpenRooms(pendingHostRow = null) {
    if (pendingHostRow) openRoomsRefreshPendingHost = pendingHostRow;
    if (openRoomsRefreshTimer) return;
    openRoomsRefreshTimer = setTimeout(() => {
      openRoomsRefreshTimer = null;
      const pending = openRoomsRefreshPendingHost;
      openRoomsRefreshPendingHost = null;
      void refreshOpenRooms(pending);
    }, 300);
  }

  function startOpenRoomsSync() {
    stopOpenRoomsSync();
    scheduleRefreshOpenRooms();
    openRoomsPollId = setInterval(() => scheduleRefreshOpenRooms(), 5000);
    unsubscribeOpenRooms = subscribeOpenRooms(() => scheduleRefreshOpenRooms());
  }

  function renderLobby(message = "", isError = false) {
    const user = getCurrentUser();
    const profile = getProfile();
    const decks = (profile.decks || []).filter(
      (d) => validateDeck(d.cardIds, profile).valid
    );
    const selected =
      decks.find((d) => d.id === profile.selectedDeckId) ||
      decks[0];

    stopOpenRoomsSync();

    if (!isAuthAvailable()) {
      root.innerHTML = `
        <section class="panel game-panel pvp-panel">
          ${pvpPanelHead(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`;
      bindPvpPanelHelp();
      return;
    }

    if (!user) {
      root.innerHTML = `
        <section class="panel game-panel pvp-panel">
          ${pvpPanelHead("Sign in to challenge other players in real-time 1v1 matches.")}
          <button type="button" class="btn-primary btn-lg" id="pvp-sign-in">Sign in / Sign up</button>
        </section>`;
      root.querySelector("#pvp-sign-in")?.addEventListener("click", openAuthModal);
      bindPvpPanelHelp();
      return;
    }

    root.innerHTML = `
      <section class="panel game-panel pvp-panel">
        ${pvpPanelHead("Host a room or join an open match below. Piece skins are shown on the board — matching non-default skins block joins so both sides stay distinct.")}
        <div class="pvp-setup-row">
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-deck-select">Your deck</label>
            <select id="pvp-deck-select" class="select-input">
              ${
                decks.length
                  ? decks
                      .map(
                        (d) =>
                          `<option value="${d.id}" ${d.id === selected?.id ? "selected" : ""}>${escapeHtml(d.name)}</option>`
                      )
                      .join("")
                  : `<option value="">No PvP-ready deck — open Decks</option>`
              }
            </select>
          </div>
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-mode-select">Mode</label>
            <select id="pvp-mode-select" class="select-input">
              <option value="${PVP_MODE_NORMAL}" selected>Normal</option>
              <option value="${PVP_MODE_MYSTERY}">Mystery</option>
            </select>
          </div>
        </div>
        <p id="pvp-mode-hint" class="pvp-mode-hint hidden">Mystery — both players get a fully random deck, including spells you haven't unlocked.</p>
        <div class="pvp-actions">
          <button type="button" class="btn-primary btn-lg" id="pvp-host">Host a room</button>
        </div>
        <div class="pvp-room-section pvp-your-rooms">
          <h3 class="pvp-room-section__title">Your rooms</h3>
          <p class="pvp-room-section__hint">Rooms you are hosting. Cancel anytime before someone joins.</p>
          <ul id="pvp-your-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <div class="pvp-room-section pvp-open-rooms">
          <h3 class="pvp-room-section__title">Open rooms</h3>
          <p class="pvp-room-section__hint">Rooms hosted by other players — tap to join.</p>
          <ul id="pvp-open-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <p id="pvp-status" class="pvp-status${isError ? " pvp-status--error" : ""}" role="status">${escapeHtml(message)}</p>
        <div id="pvp-waiting" class="pvp-waiting hidden"></div>
      </section>`;

    root.querySelector("#pvp-host")?.addEventListener("click", () => void hostRoom());
    enhanceSelect(root.querySelector("#pvp-deck-select"));
    enhanceSelect(root.querySelector("#pvp-mode-select"));
    root.querySelector("#pvp-mode-select")?.addEventListener("change", syncModeUi);
    syncModeUi();
    bindPvpPanelHelp();
    startOpenRoomsSync();

    void probePvpBackend().then((probe) => {
      if (!probe.ok && probe.reason) {
        const el = root.querySelector("#pvp-status");
        if (el && !el.textContent) {
          el.textContent = probe.reason;
          el.classList.add("pvp-status--error");
        }
        return;
      }
      if (probe.hint) console.info("[PvP]", probe.hint);
    });
  }

  async function refreshOpenRooms(pendingHostRow = null) {
    const yourList = root.querySelector("#pvp-your-list");
    const openList = root.querySelector("#pvp-open-list");
    const user = getCurrentUser();
    if (!yourList || !openList || !user || matchSession) return;
    if (openRoomsRefreshInFlight) {
      if (pendingHostRow) openRoomsRefreshPendingHost = pendingHostRow;
      return;
    }
    openRoomsRefreshInFlight = true;

    try {
      const svc = pvpService ?? new PvpService();
      const [mine, others] = await Promise.all([
        svc.listMyWaitingRooms(),
        svc.listOthersWaitingRooms(),
      ]);
      let mergedMine = mine;
      if (pendingHostRow && !mine.some((r) => r.id === pendingHostRow.id)) {
        mergedMine = [pendingHostRow, ...mine];
      }
      const hostProfiles = await fetchHostProfilesMap([...mergedMine, ...others]);
      renderRoomLists(mergedMine, others, hostProfiles);
    } catch (e) {
      const err = `<li class="pvp-open-empty pvp-open-empty--error">${escapeHtml(formatPvpError(e))}</li>`;
      yourList.innerHTML = err;
      openList.innerHTML = err;
    } finally {
      openRoomsRefreshInFlight = false;
      if (openRoomsRefreshPendingHost) {
        const pending = openRoomsRefreshPendingHost;
        openRoomsRefreshPendingHost = null;
        scheduleRefreshOpenRooms(pending);
      }
    }
  }

  function pieceSkinLabel(skinId) {
    return COSMETIC_BY_ID[skinId]?.name || "Classic Disc";
  }

  function hostDisplayNameForRoom(room, hostProfiles) {
    return (
      hostProfiles?.get(room.host_id)?.displayName ||
      room.host_display_name ||
      "Player"
    );
  }

  function hostAvatarForRoom(room, hostProfiles, { clickable = false } = {}) {
    const displayName = hostDisplayNameForRoom(room, hostProfiles);
    const cosmetics =
      hostProfiles?.get(room.host_id)?.cosmetics || normalizeCosmetics(null);
    return buildRoomHostAvatarHtml(cosmetics, displayName, {
      clickable,
      userId: room.host_id,
    });
  }

  async function fetchHostProfilesMap(rooms) {
    const user = getCurrentUser();
    const profile = getProfile();
    const ids = [...new Set(rooms.map((r) => r.host_id).filter(Boolean))];
    const map = new Map();

    await Promise.all(
      ids.map(async (hostId) => {
        if (hostId === user?.id) {
          map.set(hostId, {
            displayName: await getDisplayName(),
            cosmetics: getEquippedCosmetics(profile),
          });
          return;
        }

        try {
          const row = await fetchProfileRow(hostId);
          const roomName = rooms.find((r) => r.host_id === hostId)?.host_display_name;
          const displayName =
            (row?.username && String(row.username).trim()) ||
            (row?.display_name && String(row.display_name).trim()) ||
            (roomName && String(roomName).trim()) ||
            "Player";
          const fromCloud = row?.profile_json?.cosmetics;
          map.set(hostId, {
            displayName,
            cosmetics: fromCloud ? normalizeCosmetics(fromCloud) : normalizeCosmetics(null),
          });
        } catch {
          const roomName = rooms.find((r) => r.host_id === hostId)?.host_display_name;
          map.set(hostId, {
            displayName: roomName || "Player",
            cosmetics: normalizeCosmetics(null),
          });
        }
      })
    );

    return map;
  }

  function renderRoomLists(mine, others, hostProfiles = new Map()) {
    const yourList = root.querySelector("#pvp-your-list");
    const openList = root.querySelector("#pvp-open-list");
    if (!yourList || !openList) return;

    const mySkin = getEquippedPieceSkin(getProfile());
    const currentUserId = getCurrentUser()?.id;

    if (!mine.length) {
      yourList.innerHTML = `<li class="pvp-open-empty">No rooms yet — host one above.</li>`;
    } else {
      yourList.innerHTML = mine
        .map((room) => {
          const displayName = hostDisplayNameForRoom(room, hostProfiles);
          const avatar = hostAvatarForRoom(room, hostProfiles, { clickable: false });
          return `<li class="pvp-open-item pvp-open-item--mine">
            ${avatar}
            <div class="pvp-open-item__body">
              <span class="pvp-open-item__label">${escapeHtml(displayName)} ${roomModeLabel(room)}</span>
              <span class="pvp-open-item__meta">${isMysteryMode(room) ? "Mystery — waiting for opponent…" : "Waiting for opponent…"}</span>
            </div>
            <button type="button" class="btn-secondary pvp-open-cancel" data-cancel-room="${room.id}">Cancel</button>
          </li>`;
        })
        .join("");
    }

    if (!others.length) {
      const hint = mine.length
        ? "No open rooms from other players. Yours is listed above under <strong>Your rooms</strong>."
        : "No open rooms from other players.";
      openList.innerHTML = `<li class="pvp-open-empty">${hint}</li>`;
    } else {
      openList.innerHTML = others
        .map((room) => {
          const hostSkin = room.host_piece_skin || "skin_classic";
          const sameSkin = pieceSkinsConflict(hostSkin, mySkin);
          const skinLabel = pieceSkinLabel(hostSkin);
          const displayName = hostDisplayNameForRoom(room, hostProfiles);
          const avatar = hostAvatarForRoom(room, hostProfiles, {
            clickable: room.host_id !== currentUserId,
          });
          if (sameSkin) {
            return `<li class="pvp-open-item pvp-open-item--blocked">
              ${avatar}
              <div class="pvp-open-join pvp-open-join--disabled" title="${escapeHtml(SAME_PIECE_SKIN_JOIN_MESSAGE)}">
                <span class="pvp-open-join__name">${escapeHtml(displayName)} ${roomModeLabel(room)}</span>
                <span class="pvp-open-join__skin">${escapeHtml(skinLabel)} skin — same as yours</span>
              </div>
            </li>`;
          }
          return `<li class="pvp-open-item">
            ${avatar}
            <button type="button" class="pvp-open-join" data-join-room="${room.id}" data-mystery="${isMysteryMode(room) ? "1" : "0"}">
              <span class="pvp-open-join__name">${escapeHtml(displayName)} ${roomModeLabel(room)}</span>
              <span class="pvp-open-join__skin">${escapeHtml(skinLabel)} skin</span>
              <span class="pvp-open-join__action">${isMysteryMode(room) ? "Join Mystery" : "Join match"}</span>
            </button>
          </li>`;
        })
        .join("");
    }

    bindPublicProfileViewButtons(yourList);
    bindPublicProfileViewButtons(openList);

    openList.querySelectorAll("[data-join-room]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-join-room");
        const mystery = btn.getAttribute("data-mystery") === "1";
        if (id) void joinOpenRoom(id, { mystery });
      });
    });

    yourList.querySelectorAll("[data-cancel-room]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-cancel-room");
        if (id) void cancelHostedRoom(id);
      });
    });
  }

  function getSelectedMode() {
    return root.querySelector("#pvp-mode-select")?.value || PVP_MODE_NORMAL;
  }

  function syncModeUi() {
    const mystery = getSelectedMode() === PVP_MODE_MYSTERY;
    const deckSelect = root.querySelector("#pvp-deck-select");
    const hint = root.querySelector("#pvp-mode-hint");
    if (deckSelect) deckSelect.disabled = mystery;
    hint?.classList.toggle("hidden", !mystery);
  }

  function getSelectedDeck() {
    const profile = getProfile();
    const id = root.querySelector("#pvp-deck-select")?.value || profile.selectedDeckId;
    return profile.decks.find((d) => d.id === id);
  }

  async function getDisplayName() {
    const user = getCurrentUser();
    if (!user) return "Player";
    try {
      const row = await fetchProfileRow(user.id);
      const fromProfile = row?.username || row?.display_name;
      if (fromProfile && String(fromProfile).trim()) return String(fromProfile).trim();
    } catch {
      /* fall through */
    }
    return user.user_metadata?.display_name || user.email?.split("@")[0] || "Player";
  }

  function opponentNameFromRow(row) {
    const name =
      pvpService?.localColor === COLORS.RED
        ? row.guest_display_name
        : row.host_display_name;
    return name && String(name).trim() ? String(name).trim() : "Opponent";
  }

  function localNameFromRow(row) {
    const name =
      pvpService?.localColor === COLORS.RED
        ? row.host_display_name
        : row.guest_display_name;
    return name && String(name).trim() ? String(name).trim() : "You";
  }

  function opponentIdFromRow(row) {
    return pvpService?.localColor === COLORS.RED ? row.guest_id : row.host_id;
  }

  async function cosmeticsForUser(userId, fallbackProfile) {
    if (!userId) return getEquippedCosmetics(fallbackProfile);
    try {
      const row = await fetchProfileRow(userId);
      const fromCloud = row?.profile_json?.cosmetics;
      if (fromCloud) return normalizeCosmetics(fromCloud);
    } catch {
      /* use local defaults */
    }
    return getEquippedCosmetics(fallbackProfile);
  }

  function setStatus(text, isError = false) {
    const el = root.querySelector("#pvp-status");
    if (el) {
      el.textContent = text;
      el.classList.toggle("pvp-status--error", isError);
    }
  }

  function showHosting() {
    const box = root.querySelector("#pvp-waiting");
    if (!box) return;
    box.classList.remove("hidden");
    box.innerHTML = `<p class="pvp-wait-hint">Your room is listed under <strong>Your rooms</strong>. Waiting for someone to join…</p>`;
  }

  function hideHosting() {
    const box = root.querySelector("#pvp-waiting");
    if (box) {
      box.classList.add("hidden");
      box.innerHTML = "";
    }
  }

  function applyPvpMatchRow(row) {
    if (!matchSession || !row?.state_json) return;
    if (!shouldApplyPvpRow(row, pvpService, matchSession)) return;
    const ver = row.version ?? 0;
    const terminal = isPvpTerminalBoard(row.state_json, pvpService.localColor);
    const finished = row.status === "finished";
    if (terminal || finished) matchSession.actionBusy = false;
    const isMyTurn = row.turn === pvpService.localColor;
    const opponentName = opponentNameFromRow(row);
    matchSession.opponentName = opponentName;
    const applied = matchSession.importState(row.state_json);
    if (applied) {
      pvpService._lastAppliedFingerprint = matchRowFingerprint(row);
      if (ver > (pvpService?._lastVersion ?? -1)) pvpService._lastVersion = ver;
    }
    if (!matchSession._gameOverUiShown && finished) {
      if (!row.winner_id && isMutualElimination(row.state_json)) {
        void matchSession.showGameOver("Tie!", "Both players lost all their pieces.");
      } else if (row.winner_id) {
        const user = getCurrentUser();
        const won = user?.id === row.winner_id;
        const forfeited = !isPvpTerminalBoard(row.state_json, pvpService.localColor);
        void matchSession.showGameOver(
          won ? "Victory!" : "Defeat",
          won
            ? forfeited
              ? "Your opponent left the match."
              : "You won the match!"
            : "You lost the match."
        );
      }
    }
    if (!matchSession._gameOverUiShown) {
      matchSession.setMessage(
        isMyTurn ? "Your turn — cast a spell or move." : `${opponentName} is acting…`
      );
    }
  }

  function onMatchRow(row) {
    if (!row) return;

    if (row.status === "waiting" && pvpService?.role === "host") {
      setStatus("Your room is open — waiting for an opponent…");
      showHosting();
      if (!hostWaitingSync) {
        hostWaitingSync = true;
        pvpService.startPolling(4000);
      }
      scheduleRefreshOpenRooms();
      return;
    }

    if (matchSession && row.state_json && (row.status === "active" || row.status === "finished")) {
      const terminal = isPvpTerminalBoard(row.state_json, pvpService.localColor);
      const finished = row.status === "finished";
      if (!finished && !shouldApplyPvpRow(row, pvpService, matchSession)) return;
      if (
        (matchSession.actionBusy || matchSession._syncBusy || matchSession._syncDirty) &&
        !terminal &&
        !finished
      ) {
        matchSession.queuePvpRow(row);
        return;
      }
      applyPvpMatchRow(row);
      return;
    }

    if (row.status === "active" && !matchSession && !matchLaunching) {
      if (row.state_json) {
        stopOpenRoomsSync();
        hideHosting();
        hostLaunchSync = false;
        matchLaunching = true;
        void launchMatch(row).finally(() => {
          if (!matchSession) matchLaunching = false;
        });
        return;
      }
      if (!hostLaunchSync) {
        hostLaunchSync = true;
        pvpService.startPolling(600);
      }
      return;
    }
  }

  function localDeckIdsFromRow(row) {
    const profile = getProfile();
    const storedIds =
      pvpService?.localColor === COLORS.RED ? row.host_deck_ids : row.guest_deck_ids;
    if (Array.isArray(storedIds) && !describeDeckIssue(storedIds, profile)) {
      return storedIds;
    }
    if (isMysteryMode(row)) return null;
    const deck = getSelectedDeck();
    if (deck && !describeDeckIssue(deck.cardIds, profile)) return deck.cardIds;
    return null;
  }

  function localDeckLaunchIssue(row) {
    if (isMysteryMode(row)) {
      return "Mystery deck not ready yet — wait a moment, then try again.";
    }
    const profile = getProfile();
    const storedIds =
      pvpService?.localColor === COLORS.RED ? row.host_deck_ids : row.guest_deck_ids;
    if (Array.isArray(storedIds)) {
      const storedIssue = describeDeckIssue(storedIds, profile);
      if (storedIssue) return storedIssue;
    }
    const deck = getSelectedDeck();
    if (!deck) {
      return `No deck selected — open Decks and build a complete ${DECK_SIZE}-card deck.`;
    }
    return (
      describeDeckIssue(deck.cardIds, profile) ||
      `Deck not ready for PvP — open Decks and fix your deck.`
    );
  }

  async function launchMatch(row, { resume = false } = {}) {
    const profile = getProfile();
    let deckIds = localDeckIdsFromRow(row);
    if (!deckIds && isMysteryMode(row) && pvpService?.matchId) {
      try {
        const fresh = await pvpService.fetchMatch(pvpService.matchId);
        if (fresh) {
          row = fresh;
          deckIds = localDeckIdsFromRow(row);
        }
      } catch {
        /* retry below */
      }
    }
    if (!deckIds) {
      matchLaunching = false;
      setStatus(localDeckLaunchIssue(row), true);
      if (!isMysteryMode(row)) renderLobby();
      return;
    }

    showPvpView();

    const localColor = pvpService.localColor;
    const opponentName = opponentNameFromRow(row);
    const localName = localNameFromRow(row);
    const user = getCurrentUser();

    const [localCosmeticsBase, opponentCosmeticsBase] = await Promise.all([
      cosmeticsForUser(user?.id, profile),
      cosmeticsForUser(opponentIdFromRow(row), profile),
    ]);

    const isLocalHost = pvpService?.localColor === COLORS.RED;
    const localMatchSkin = isLocalHost ? row.host_piece_skin : row.guest_piece_skin;
    const opponentMatchSkin = isLocalHost ? row.guest_piece_skin : row.host_piece_skin;
    const localCosmetics = cosmeticsWithPieceSkin(localCosmeticsBase, localMatchSkin);
    const opponentCosmetics = cosmeticsWithPieceSkin(opponentCosmeticsBase, opponentMatchSkin);

    if (!resume) {
      await showPvpMatchLoading(root, {
        local: { username: localName, cosmetics: localCosmetics },
        opponent: { username: opponentName, cosmetics: opponentCosmetics },
      });
    }

    if (!pvpService || row.status !== "active" || !row.state_json) {
      matchLaunching = false;
      if (!matchSession) renderLobby();
      return;
    }

    root.innerHTML = "";
    const matchRoot = document.createElement("div");
    matchRoot.id = "pvp-match-root";
    root.appendChild(matchRoot);
    matchRoot.innerHTML = getMatchHtml(opponentName, { exitLabel: "← Leave PvP", pvp: true });

    pvpService._lastVersion = row.version ?? 0;
    pvpService._lastAppliedFingerprint = matchRowFingerprint(row);

    try {
      matchSession = new MatchSession(
        deckIds,
        matchRoot,
        () => {
          matchSession = null;
          matchLaunching = false;
          exitMatchMode();
          void lockPortrait();
          setAudioMode("hub");
          clearActivePvpMatchId();
          pvpService?.dispose();
          pvpService = null;
          const tab = consumePendingNavigationTab();
          if (tab) onNavigateTab?.(tab);
          else renderLobby();
        },
        null,
        {
          pvp: true,
          localColor,
          initialState: row.state_json,
          opponentName,
          cosmetics: localCosmetics,
          opponentCosmetics,
          onStateSync: async (state) => {
            const v = pvpService._lastVersion;
            const updated = await pvpService.pushState(state, v);
            if (updated) {
              pvpService._lastVersion = updated.version;
              pvpService._lastAppliedFingerprint = matchRowFingerprint(updated);
              return;
            }
            const fresh = await pvpService.fetchMatch(pvpService.matchId);
            if (fresh) onMatchRow(fresh);
          },
          onPvpForfeit: async () => {
            if (!pvpService || matchSession?._gameOverUiShown) return;
            const opponentId = opponentIdFromRow(row);
            if (opponentId) await pvpService.finishMatch(opponentId);
          },
          onPvpWin: async (won) => {
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            if (won === null) {
              await pvpService.finishMatch(null);
              return;
            }
            if (won) {
              const profile = getProfile();
              recordPvpWin(profile);
              trackDailyQuestEvent(profile, "pvp_wins", 1);
              syncChampion(profile);
              saveProfile(profile);
            }
            const winnerId = won
              ? currentUser.id
              : localColor === COLORS.RED
                ? row.guest_id
                : row.host_id;
            if (winnerId) await pvpService.finishMatch(winnerId);
          },
          onPvpPendingRow: (pendingRow) => applyPvpMatchRow(pendingRow),
          buildGameOverActions: () => [{ id: "back", label: "Back to PvP", primary: true }],
          onGameOverAction: () => matchSession?.onExit?.(),
          onPvpSyncError: (err) => {
            if (!matchSession?._gameOverUiShown) {
              matchSession.setMessage(formatPvpError(err, { context: "sync" }));
            }
          },
        }
      );
    } catch (err) {
      matchSession = null;
      matchLaunching = false;
      matchRoot.remove();
      renderLobby();
      throw err;
    }

    enterMatchMode({ kind: "pvp" });
    await lockPortrait();
    setAudioMode("match");

    matchSession.setMessage(
      resume
        ? "Match resumed — pick up where you left off."
        : isMysteryMode(row)
          ? localColor === row.turn
            ? "Mystery Mode — your turn with a random deck!"
            : `${opponentName} is thinking…`
          : localColor === row.turn
            ? "Your turn — cast a spell or move."
            : `${opponentName} is thinking…`
    );
    matchSession.render();
    saveActivePvpMatchId(row.id);
    pvpService.startPolling(800);
    matchLaunching = false;
  }

  function ensurePvpService() {
    if (!pvpService) {
      pvpService = new PvpService();
      pvpService.onMatchRow = onMatchRow;
      pvpService.onError = (e) => setStatus(formatPvpError(e), true);
    }
    return pvpService;
  }

  async function hostRoom() {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }

    const mystery = getSelectedMode() === PVP_MODE_MYSTERY;
    const deck = getSelectedDeck();
    if (!mystery) {
      const issue = describeDeckIssue(deck?.cardIds ?? [], getProfile());
      if (issue) {
        setStatus(issue, true);
        return;
      }
    }

    pvpService?.dispose();
    pvpService = null;

    try {
      setStatus(mystery ? "Opening Mystery room…" : "Opening your room…");
      const svc = ensurePvpService();
      const row = await svc.createRoom(
        mystery ? null : deck.cardIds,
        await getDisplayName(),
        {
          matchMode: getSelectedMode(),
          hostPieceSkin: getEquippedPieceSkin(getProfile()),
        }
      );
      const hostProfiles = await fetchHostProfilesMap([row]);
      renderRoomLists([row], [], hostProfiles);
      setStatus(
        mystery
          ? "Mystery room open — waiting under Your rooms."
          : "Room open — waiting under Your rooms."
      );
      saveActivePvpMatchId(row.id);
      onMatchRow(row);
      scheduleRefreshOpenRooms(row);
    } catch (e) {
      setStatus(formatPvpError(e), true);
      pvpService?.dispose();
      pvpService = null;
    }
  }

  async function joinOpenRoom(matchId, { mystery = false } = {}) {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }

    if (!mystery) {
      const deck = getSelectedDeck();
      const issue = describeDeckIssue(deck?.cardIds ?? [], getProfile());
      if (issue) {
        setStatus(issue, true);
        return;
      }
    }

    pvpService?.dispose();
    pvpService = null;

    try {
      setStatus(mystery ? "Joining Mystery match…" : "Joining match…");
      stopOpenRoomsSync();
      const svc = ensurePvpService();
      const guestDeckIds = mystery ? null : getSelectedDeck().cardIds;
      const guestPieceSkin = getEquippedPieceSkin(getProfile());
      const row = await svc.joinRoomById(matchId, guestDeckIds, await getDisplayName(), {
        guestPieceSkin,
      });
      saveActivePvpMatchId(row.id);
      onMatchRow(row);
    } catch (e) {
      setStatus(formatPvpError(e), true);
      pvpService?.dispose();
      pvpService = null;
      startOpenRoomsSync();
    }
  }

  function isParticipant(row, userId) {
    return row?.host_id === userId || row?.guest_id === userId;
  }

  function showPvpView() {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === "pvp");
    });
    document.querySelectorAll(".view").forEach((v) => {
      v.classList.toggle("hidden", v.id !== "view-pvp");
    });
    onPvpViewShown?.();
  }

  async function tryResumePvpMatch() {
    if (matchSession || matchLaunching) return false;
    const user = getCurrentUser();
    if (!user || !isAuthAvailable()) return false;

    const svc = ensurePvpService();
    let row = null;

    const savedId = readActivePvpMatchId();
    if (savedId) {
      try {
        const fetched = await svc.fetchMatch(savedId);
        if (fetched && isParticipant(fetched, user.id) && fetched.status !== "finished") {
          row = fetched;
        } else {
          clearActivePvpMatchId();
        }
      } catch {
        clearActivePvpMatchId();
      }
    }

    if (!row) {
      try {
        row = await svc.listActiveMatchForUser();
      } catch (e) {
        setStatus(formatPvpError(e), true);
        return false;
      }
    }

    if (row?.status === "active") {
      showPvpView();
      if (!row.state_json) {
        svc.attachToMatch(row, user.id);
        saveActivePvpMatchId(row.id);
        svc.startPolling(800);
        return true;
      }
      stopOpenRoomsSync();
      hideHosting();
      svc.attachToMatch(row, user.id);
      matchLaunching = true;
      try {
        await launchMatch(row, { resume: true });
        return !!matchSession;
      } finally {
        if (!matchSession) matchLaunching = false;
      }
    }

    if (!pvpService?.matchId) {
      try {
        const waiting = await svc.listMyWaitingRooms();
        if (waiting.length) {
          showPvpView();
          const room = waiting[0];
          svc.attachToMatch({ ...room, status: "waiting" }, user.id);
          saveActivePvpMatchId(room.id);
          onMatchRow(room);
          scheduleRefreshOpenRooms(room);
          return true;
        }
      } catch {
        /* lobby still usable */
      }
    }

    return false;
  }

  async function cancelHostedRoom(matchId) {
    if (!matchId && pvpService?.matchId) matchId = pvpService.matchId;
    if (!matchId) return;

    try {
      setStatus("Cancelling room…");
      const svc = pvpService ?? new PvpService();
      await svc.cancelRoom(matchId);
      if (pvpService?.matchId === matchId) {
        pvpService.dispose();
        pvpService = null;
        clearActivePvpMatchId();
      }
      hideHosting();
      setStatus("");
      scheduleRefreshOpenRooms();
    } catch (e) {
      setStatus(formatPvpError(e), true);
    }
  }

  /** Drop in-memory PvP session when shell reconciliation removed the board DOM. */
  function clearStalePvpSession() {
    if (!matchSession || matchLaunching || isLiveMatchUiVisible()) return false;
    matchSession = null;
    exitMatchMode({ clearCheckpoint: false });
    root.querySelector("#pvp-match-root")?.remove();
    return true;
  }

  function renderPvpSurface({ resume = false } = {}) {
    clearStalePvpSession();
    if (matchLaunching || root.querySelector(".pvp-loading")) return;
    if (!matchSession) {
      renderLobby();
      if (resume) void tryResumePvpMatch();
    }
  }

  const onShellReconciled = () => {
    if (!root || root.classList.contains("hidden")) return;
    renderPvpSurface({ resume: true });
  };
  window.addEventListener("cc-match-shell-reconciled", onShellReconciled);

  let lastAuthUserId = null;
  const unsubAuth = onAuthChange((user) => {
    if (matchSession || matchLaunching) return;
    const nextId = user?.id ?? null;
    if (nextId === lastAuthUserId) return;
    lastAuthUserId = nextId;
    renderPvpSurface({ resume: !!nextId });
  });

  void initAuth().then((user) => {
    lastAuthUserId = user?.id ?? null;
    renderPvpSurface({ resume: !!user });
  });

  return {
    render: renderPvpSurface,
    tryResume: tryResumePvpMatch,
    dispose() {
      unsubAuth();
      window.removeEventListener("cc-match-shell-reconciled", onShellReconciled);
      stopOpenRoomsSync();
      matchSession = null;
      clearActivePvpMatchId();
      pvpService?.dispose();
      pvpService = null;
      exitMatchMode({ clearCheckpoint: true });
      reconcileMatchShellState();
    },
  };
}
