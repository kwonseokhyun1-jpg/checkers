import {
  fetchProfileRow,
  getCurrentUser,
  initAuth,
  isAuthAvailable,
  onAuthChange,
} from "./auth.js";
import { GUEST_SIGN_IN_NUDGE_PVP } from "./guestMode.js";
import { DECK_SIZE } from "./cardCatalog.js";
import {
  deckCardIdsFromMatchState,
  deckIdsEqual,
  describeDeckIssue,
  validateDeck,
} from "./deckRules.js";
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
import {
  fetchPvpLeaderboard,
  fetchLivePvpMatches,
  subscribeLiveMatches,
} from "./pvpLeaderboard.js";
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
 * @param {HTMLElement} opts.arenaRoot
 * @param {HTMLElement} opts.leaderboardRoot
 * @param {() => object} opts.getProfile
 * @param {() => void} opts.openAuthModal
 */
export function initPvpUI({
  arenaRoot,
  leaderboardRoot,
  getProfile,
  openAuthModal,
  onNavigateTab,
  onNavigatePlayTab,
  onOpenDeckEdit,
}) {
  if (!arenaRoot || !leaderboardRoot) return { render: () => {}, dispose: () => {} };

  function screenRoot() {
    return pvpScreen === "leaderboard" ? leaderboardRoot : arenaRoot;
  }

  function bindPvpPanelHelp(scope = screenRoot()) {
    initPanelHelp(scope.querySelector("#pvp-help-btn"), scope.querySelector("#pvp-help-desc"));
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
  let pvpGameOverCtx = null;
  let rematchPollId = null;
  /** @type {"arena" | "leaderboard"} */
  let pvpScreen = "arena";
  let leaderboardPollId = null;
  let unsubscribeLiveMatches = null;
  let spectating = false;
  let leaderboardRefreshInFlight = false;

  function stopLeaderboardSync() {
    if (leaderboardPollId) {
      clearInterval(leaderboardPollId);
      leaderboardPollId = null;
    }
    unsubscribeLiveMatches?.();
    unsubscribeLiveMatches = null;
  }

  function returnToPvpShell() {
    stopRematchPoll();
    pvpGameOverCtx = null;
    spectating = false;
    pvpScreen = "arena";
    onNavigatePlayTab?.("arena");
    onNavigateTab?.("play");
    renderLobby();
  }

  function setLeaderboardStatus(text, isError = false) {
    const el = leaderboardRoot.querySelector("#pvp-leaderboard-status");
    if (el) {
      el.textContent = text;
      el.classList.toggle("pvp-status--error", isError);
    }
  }

  function rankMedal(rank) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return String(rank);
  }

  function renderLeaderboardRows(rows, currentUserId) {
    if (!rows.length) {
      return `<li class="pvp-leaderboard-empty">No ranked players yet — win PvP matches to appear here.</li>`;
    }
    return rows
      .map((row) => {
        const self = row.id === currentUserId ? " pvp-leaderboard-row--self" : "";
        return `<li class="pvp-leaderboard-row${self}">
          <span class="pvp-leaderboard-row__rank">${rankMedal(row.rank)}</span>
          <span class="pvp-leaderboard-row__name">${escapeHtml(row.username)}</span>
          <span class="pvp-leaderboard-row__wins">${row.pvpWins} win${row.pvpWins === 1 ? "" : "s"}</span>
        </li>`;
      })
      .join("");
  }

  function renderLiveMatchRows(matches, currentUserId) {
    if (!matches.length) {
      return `<li class="pvp-leaderboard-empty">No live matches right now.</li>`;
    }
    return matches
      .map((row) => {
        const host = escapeHtml(row.host_display_name?.trim() || "Red");
        const guest = escapeHtml(row.guest_display_name?.trim() || "Black");
        const isParticipant = row.host_id === currentUserId || row.guest_id === currentUserId;
        const mode = isMysteryMode(row) ? mysteryModeBadge() : "";
        const turnName =
          row.turn === COLORS.RED
            ? row.host_display_name?.trim() || "Red"
            : row.guest_display_name?.trim() || "Black";
        const action = isParticipant
          ? `<span class="pvp-live-match__tag">Your match</span>`
          : `<button type="button" class="btn-secondary pvp-live-spectate" data-spectate-match="${row.id}">Spectate</button>`;
        return `<li class="pvp-live-match">
          <div class="pvp-live-match__body">
            <span class="pvp-live-match__players">${host} vs ${guest} ${mode}</span>
            <span class="pvp-live-match__meta">${escapeHtml(turnName)}&apos;s turn</span>
          </div>
          ${action}
        </li>`;
      })
      .join("");
  }

  async function refreshLeaderboardPanel() {
    const rankList = leaderboardRoot.querySelector("#pvp-rank-list");
    const liveList = leaderboardRoot.querySelector("#pvp-live-list");
    const user = getCurrentUser();
    if (!rankList || !liveList || !user || matchSession || spectating) return;
    if (leaderboardRefreshInFlight) return;
    leaderboardRefreshInFlight = true;

    try {
      const [ranks, live] = await Promise.all([fetchPvpLeaderboard(50), fetchLivePvpMatches(20)]);
      rankList.innerHTML = renderLeaderboardRows(ranks, user.id);
      liveList.innerHTML = renderLiveMatchRows(live, user.id);
      liveList.querySelectorAll("[data-spectate-match]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-spectate-match");
          if (id) void startSpectate(id);
        });
      });
    } catch (e) {
      const err = `<li class="pvp-leaderboard-empty pvp-open-empty--error">${escapeHtml(formatPvpError(e))}</li>`;
      rankList.innerHTML = err;
      liveList.innerHTML = err;
    } finally {
      leaderboardRefreshInFlight = false;
    }
  }

  function startLeaderboardSync() {
    stopLeaderboardSync();
    void refreshLeaderboardPanel();
    leaderboardPollId = setInterval(() => void refreshLeaderboardPanel(), 8000);
    unsubscribeLiveMatches = subscribeLiveMatches(() => void refreshLeaderboardPanel());
  }

  function renderLeaderboard(message = "", isError = false) {
    stopOpenRoomsSync();
    pvpScreen = "leaderboard";
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }

    leaderboardRoot.innerHTML = `
      <section class="panel game-panel pvp-leaderboard-panel">
        <div class="pvp-panel-content">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">Leaderboard</h2>
            <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How the leaderboard works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
          </div>
          <p id="pvp-help-desc" class="panel-head__desc" hidden>Players are ranked by total PvP wins. Spectate ongoing matches — hands stay hidden, but you can scrub move history during the watch.</p>
        </header>
        <div class="pvp-leaderboard-section">
          <h3 class="pvp-room-section__title">Global ranks</h3>
          <ol id="pvp-rank-list" class="pvp-leaderboard-list" aria-live="polite">
            <li class="pvp-leaderboard-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ol>
        </div>
        <div class="pvp-leaderboard-section">
          <h3 class="pvp-room-section__title">Live matches</h3>
          <p class="pvp-room-section__hint">Watch ongoing games — hands are hidden, but move history is available.</p>
          <ul id="pvp-live-list" class="pvp-live-list" aria-live="polite">
            <li class="pvp-leaderboard-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <p id="pvp-leaderboard-status" class="pvp-status${isError ? " pvp-status--error" : ""}" role="status">${escapeHtml(message)}</p>
        </div>
      </section>`;

    bindPvpPanelHelp(leaderboardRoot);
    startLeaderboardSync();
  }

  async function startSpectate(matchId) {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }
    if (matchSession || matchLaunching || spectating) return;

    try {
      setLeaderboardStatus("Joining as spectator…");
      const svc = new PvpService();
      const row = await svc.fetchMatch(matchId);
      if (!row || row.status !== "active" || !row.guest_id || !row.state_json) {
        setLeaderboardStatus("That match is no longer live.", true);
        void refreshLeaderboardPanel();
        return;
      }
      const user = getCurrentUser();
      if (row.host_id === user.id || row.guest_id === user.id) {
        pvpScreen = "arena";
        ensurePvpService().attachToMatch(row, user.id);
        saveActivePvpMatchId(row.id);
        matchLaunching = true;
        await launchMatch(row, { resume: true });
        return;
      }
      stopLeaderboardSync();
      pvpService?.dispose();
      pvpService = svc;
      pvpService.onMatchRow = onMatchRow;
      pvpService.onError = (e) => matchSession?.setMessage(formatPvpError(e));
      pvpService.attachAsSpectator(row);
      matchLaunching = true;
      await launchSpectate(row);
    } catch (e) {
      setLeaderboardStatus(formatPvpError(e), true);
      matchLaunching = false;
      spectating = false;
    }
  }

  function applySpectateRow(row) {
    if (!matchSession || !spectating || !row?.state_json) return;
    if (!shouldApplyPvpRow(row, pvpService, matchSession)) return;
    const hostName = row.host_display_name?.trim() || "Red";
    const guestName = row.guest_display_name?.trim() || "Black";
    if (row.status === "finished") {
      matchSession.actionBusy = false;
      matchSession.importState(row.state_json);
      if (!row.winner_id && isMutualElimination(row.state_json)) {
        matchSession.setMessage("Match over — tie game.");
      } else if (row.winner_id) {
        const winnerName = row.winner_id === row.host_id ? hostName : guestName;
        matchSession.setMessage(`Match over — ${winnerName} wins.`);
      } else {
        matchSession.setMessage("Match over.");
      }
      return;
    }
    matchSession.importState(row.state_json);
    const turnName = row.turn === COLORS.RED ? hostName : guestName;
    matchSession.setMessage(`${turnName} is playing…`);
  }

  async function launchSpectate(row) {
    if (!row?.state_json || row.status !== "active") {
      matchLaunching = false;
      spectating = false;
      renderLeaderboard("That match is no longer live.", true);
      return;
    }

    spectating = true;
    showPvpView();

    const hostName = row.host_display_name?.trim() || "Red";
    const guestName = row.guest_display_name?.trim() || "Black";
    const profile = getProfile();

    const [hostCosmeticsBase, guestCosmeticsBase] = await Promise.all([
      cosmeticsForUser(row.host_id, profile),
      cosmeticsForUser(row.guest_id, profile),
    ]);
    const hostCosmetics = cosmeticsWithPieceSkin(hostCosmeticsBase, row.host_piece_skin);
    const guestCosmetics = cosmeticsWithPieceSkin(guestCosmeticsBase, row.guest_piece_skin);

    arenaRoot.innerHTML = "";
    const matchRoot = document.createElement("div");
    matchRoot.id = "pvp-match-root";
    arenaRoot.appendChild(matchRoot);
    matchRoot.innerHTML = getMatchHtml(guestName, {
      exitLabel: "← Leave spectate",
      pvp: true,
      spectator: true,
      localName: hostName,
    });

    pvpService._lastVersion = row.version ?? 0;
    pvpService._lastAppliedFingerprint = matchRowFingerprint(row);

    const deckIds = Array.isArray(row.host_deck_ids) ? row.host_deck_ids : row.host_deck_ids || [];

    matchSession = new MatchSession(
      deckIds,
      matchRoot,
      () => {
        matchSession = null;
        matchLaunching = false;
        spectating = false;
        exitMatchMode();
        void lockPortrait();
        setAudioMode("hub");
        pvpService?.dispose();
        pvpService = null;
        pvpScreen = "leaderboard";
        onNavigatePlayTab?.("leaderboard");
        onNavigateTab?.("play");
        renderLeaderboard();
      },
      null,
      {
        pvp: true,
        spectator: true,
        localColor: COLORS.RED,
        initialState: row.state_json,
        opponentName: guestName,
        cosmetics: hostCosmetics,
        opponentCosmetics: guestCosmetics,
        skipCheckpoint: true,
      }
    );

    enterMatchMode({ kind: "pvp" });
    await lockPortrait();
    setAudioMode("match");
    matchSession.setMessage(`Spectating ${hostName} vs ${guestName}`);
    matchSession.render();
    pvpService.startPolling(1200);
    matchLaunching = false;
  }

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
      arenaRoot.innerHTML = `
        <section class="panel game-panel pvp-panel">
          ${pvpPanelHead(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`;
      bindPvpPanelHelp(arenaRoot);
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    arenaRoot.innerHTML = `
      <section class="panel game-panel pvp-panel pvp-panel--arena">
        <div class="pvp-panel-content">
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
          <p class="pvp-room-section__hint">You can host one room at a time. Cancel anytime before someone joins.</p>
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
        </div>
      </section>`;

    arenaRoot.querySelector("#pvp-host")?.addEventListener("click", () => void hostRoom());
    enhanceSelect(arenaRoot.querySelector("#pvp-deck-select"));
    enhanceSelect(arenaRoot.querySelector("#pvp-mode-select"));
    arenaRoot.querySelector("#pvp-mode-select")?.addEventListener("change", syncModeUi);
    syncModeUi();
    bindPvpPanelHelp(arenaRoot);
    startOpenRoomsSync();

    void probePvpBackend().then((probe) => {
      if (!probe.ok && probe.reason) {
        const el = arenaRoot.querySelector("#pvp-status");
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
    const yourList = arenaRoot.querySelector("#pvp-your-list");
    const openList = arenaRoot.querySelector("#pvp-open-list");
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
      syncHostButtonState(mergedMine.length);
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

  function syncHostButtonState(hostingCount = 0) {
    const hostBtn = arenaRoot.querySelector("#pvp-host");
    if (!hostBtn) return;
    const blocked = hostingCount > 0;
    hostBtn.disabled = blocked;
    hostBtn.title = blocked ? "You already have a room open — cancel it first." : "";
    hostBtn.setAttribute("aria-disabled", blocked ? "true" : "false");
  }

  function renderRoomLists(mine, others, hostProfiles = new Map()) {
    const yourList = arenaRoot.querySelector("#pvp-your-list");
    const openList = arenaRoot.querySelector("#pvp-open-list");
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

    syncHostButtonState(mine.length);

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
    return arenaRoot.querySelector("#pvp-mode-select")?.value || PVP_MODE_NORMAL;
  }

  function syncModeUi() {
    const mystery = getSelectedMode() === PVP_MODE_MYSTERY;
    const deckSelect = arenaRoot.querySelector("#pvp-deck-select");
    const hint = arenaRoot.querySelector("#pvp-mode-hint");
    if (deckSelect) deckSelect.disabled = mystery;
    hint?.classList.toggle("hidden", !mystery);
  }

  function getSelectedDeck() {
    const profile = getProfile();
    const id = arenaRoot.querySelector("#pvp-deck-select")?.value || profile.selectedDeckId;
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
    const el = arenaRoot.querySelector("#pvp-status");
    if (el) {
      el.textContent = text;
      el.classList.toggle("pvp-status--error", isError);
    }
  }

  function showHosting() {
    const box = arenaRoot.querySelector("#pvp-waiting");
    if (!box) return;
    box.classList.remove("hidden");
    box.innerHTML = `<p class="pvp-wait-hint">Your room is listed under <strong>Your rooms</strong>. Waiting for someone to join…</p>`;
  }

  function hideHosting() {
    const box = arenaRoot.querySelector("#pvp-waiting");
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

    if (spectating && matchSession) {
      applySpectateRow(row);
      return;
    }

    if (matchSession?._gameOverUiShown && pvpGameOverCtx) {
      if (
        row.status === "active" &&
        row.state_json &&
        (row.id === pvpGameOverCtx.localRematchRoomId || row.id === pvpGameOverCtx.opponentRematchRoomId)
      ) {
        void launchRematchFromGameOver(row);
        return;
      }
      if (row.status === "waiting" && row.id === pvpGameOverCtx.localRematchRoomId) return;
      if (row.status === "finished" && row.id === pvpGameOverCtx.finishedRow?.id) {
        pvpGameOverCtx.finishedRow = row;
        return;
      }
    }

    if (row.status === "waiting" && pvpService?.role === "host" && !matchSession?._gameOverUiShown) {
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
        (matchSession.actionBusy ||
          matchSession._syncBusy ||
          matchSession._syncDirty ||
          matchSession._pvpTurnMoveLog?.length > 0 ||
          matchSession.localPvpStateAheadOf(row.state_json)) &&
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
        const user = getCurrentUser();
        if (user && isParticipant(row, user.id)) {
          pvpService?.attachToMatch(row, user.id);
        }
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
    const mystery = isMysteryMode(row);
    const localColor = pvpService?.localColor;

    if (mystery && row?.state_json && localColor) {
      const fromState = deckCardIdsFromMatchState(row.state_json, localColor);
      if (Array.isArray(fromState) && fromState.length === DECK_SIZE) {
        return fromState;
      }
    }

    const storedIds = localColor === COLORS.RED ? row.host_deck_ids : row.guest_deck_ids;
    // Mystery decks include spells outside the player's collection — skip ownership checks.
    const deckProfile = mystery ? null : profile;
    if (Array.isArray(storedIds) && !describeDeckIssue(storedIds, deckProfile)) {
      if (mystery) {
        const mainDeck = getSelectedDeck()?.cardIds;
        if (mainDeck && deckIdsEqual(storedIds, mainDeck)) {
          const fromState =
            localColor && deckCardIdsFromMatchState(row?.state_json, localColor);
          if (Array.isArray(fromState) && fromState.length === DECK_SIZE) return fromState;
          return null;
        }
      }
      return storedIds;
    }
    if (mystery) return null;
    const deck = getSelectedDeck();
    if (deck && !describeDeckIssue(deck.cardIds, profile)) return deck.cardIds;
    return null;
  }

  function stopRematchPoll() {
    if (rematchPollId) {
      clearInterval(rematchPollId);
      rematchPollId = null;
    }
  }

  function buildPvpGameOverActions(ctx, { isTie }) {
    if (isTie) {
      return [
        { id: "rematch", label: "Rematch", primary: true },
        { id: "back", label: "Back to PvP" },
      ];
    }

    if (ctx?.opponentRematchRoomId) {
      const actions = [{ id: "joinRematch", label: "Join rematch", primary: true }];
      if (!isMysteryMode(ctx.finishedRow)) actions.push({ id: "editDeck", label: "Edit deck" });
      actions.push({ id: "back", label: "Back to PvP" });
      return actions;
    }

    const actions = [];
    if (ctx?.localRematchRoomId) {
      actions.push({ id: "rematch", label: "Waiting for opponent…", primary: true, disabled: true });
    } else {
      actions.push({ id: "rematch", label: "Rematch", primary: true });
    }
    if (!isMysteryMode(ctx?.finishedRow)) actions.push({ id: "editDeck", label: "Edit deck" });
    actions.push({ id: "back", label: "Back to PvP" });
    return actions;
  }

  function refreshPvpGameOverActions() {
    if (!matchSession?._gameOverUiShown || !pvpGameOverCtx) return;
    const title = matchSession.root.querySelector("#game-over-title")?.textContent || "";
    const won = title.startsWith("Victory");
    const isTie = title.startsWith("Tie");
    matchSession.renderGameOverActions({ won, isTie, stars: 0 });
  }

  function rematchRoomCreatedAfter(room, sinceMs) {
    if (!room?.created_at || !sinceMs) return true;
    return new Date(room.created_at).getTime() >= sinceMs - 10_000;
  }

  async function findOpponentRematchRoom(opponentId, sinceMs) {
    if (!opponentId || !pvpService) return null;
    const others = await pvpService.listOthersWaitingRooms();
    return (
      others
        .filter((r) => r.host_id === opponentId && rematchRoomCreatedAfter(r, sinceMs))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null
    );
  }

  async function pollRematchState(ctx) {
    if (!matchSession?._gameOverUiShown || !ctx || !pvpService) return;

    try {
      if (ctx.localRematchRoomId) {
        const localRoom = await pvpService.fetchMatch(ctx.localRematchRoomId);
        if (localRoom?.status === "active" && localRoom.state_json) {
          stopRematchPoll();
          await launchRematchFromGameOver(localRoom);
          return;
        }
        if (localRoom?.status !== "waiting") ctx.localRematchRoomId = null;
      }

      const opponentRoom = await findOpponentRematchRoom(ctx.opponentId, ctx.matchEndedAt);
      if (opponentRoom && opponentRoom.id !== ctx.opponentRematchRoomId) {
        ctx.opponentRematchRoomId = opponentRoom.id;
        refreshPvpGameOverActions();
        const textEl = matchSession.root.querySelector("#game-over-text");
        if (textEl) {
          textEl.textContent = `${ctx.opponentName} wants a rematch — join when you're ready.`;
        }
      }
    } catch {
      /* polling is best-effort */
    }
  }

  function startRematchPoll(ctx) {
    stopRematchPoll();
    rematchPollId = setInterval(() => void pollRematchState(ctx), 2000);
    void pollRematchState(ctx);
  }

  async function launchRematchFromGameOver(row) {
    stopRematchPoll();
    pvpGameOverCtx = null;
    matchSession?.dispose();
    matchSession = null;
    matchLaunching = true;
    try {
      pvpService?.attachToMatch(row);
      saveActivePvpMatchId(row.id);
      await launchMatch(row);
    } finally {
      if (!matchSession) matchLaunching = false;
    }
  }

  async function joinRematchRoom(matchId, ctx) {
    const mystery = isMysteryMode(ctx.finishedRow);
    if (!mystery) {
      const deck = getProfile().decks.find((d) => d.id === ctx.deckId) || getSelectedDeck();
      const issue = describeDeckIssue(deck?.cardIds ?? [], getProfile());
      if (issue) {
        const textEl = matchSession?.root.querySelector("#game-over-text");
        if (textEl) textEl.textContent = issue;
        return;
      }
    }

    stopRematchPoll();
    if (ctx.localRematchRoomId && ctx.localRematchRoomId !== matchId) {
      await cancelHostedRoom(ctx.localRematchRoomId);
      ctx.localRematchRoomId = null;
    }

    const guestDeckIds = mystery ? null : (getProfile().decks.find((d) => d.id === ctx.deckId) || getSelectedDeck())?.cardIds;
    const svc = ensurePvpService();
    const row = await svc.joinRoomById(matchId, guestDeckIds, await getDisplayName(), {
      guestPieceSkin: getEquippedPieceSkin(getProfile()),
    });
    pvpGameOverCtx = null;
    await launchRematchFromGameOver(row);
  }

  async function startRematchFlow(ctx, { joinOnly = false } = {}) {
    if (!ctx || !pvpService) return;

    try {
      const opponentRoom =
        joinOnly && ctx.opponentRematchRoomId
          ? await pvpService.fetchMatch(ctx.opponentRematchRoomId)
          : await findOpponentRematchRoom(ctx.opponentId, ctx.matchEndedAt);

      if (opponentRoom?.status === "waiting" && !opponentRoom.guest_id) {
        await joinRematchRoom(opponentRoom.id, ctx);
        return;
      }

      if (joinOnly) return;

      const mystery = isMysteryMode(ctx.finishedRow);
      if (!mystery) {
        const deck = getProfile().decks.find((d) => d.id === ctx.deckId) || getSelectedDeck();
        const issue = describeDeckIssue(deck?.cardIds ?? [], getProfile());
        if (issue) {
          const textEl = matchSession?.root.querySelector("#game-over-text");
          if (textEl) textEl.textContent = issue;
          return;
        }
      }

      const deck = getProfile().decks.find((d) => d.id === ctx.deckId) || getSelectedDeck();
      const rematchRow = await pvpService.createRoom(
        mystery ? null : deck.cardIds,
        await getDisplayName(),
        {
          matchMode: ctx.finishedRow.match_mode || PVP_MODE_NORMAL,
          hostPieceSkin: getEquippedPieceSkin(getProfile()),
        }
      );
      ctx.localRematchRoomId = rematchRow.id;
      ctx.opponentRematchRoomId = null;
      pvpService.attachToMatch(rematchRow);
      saveActivePvpMatchId(rematchRow.id);
      pvpService.startPolling(2000);
      startRematchPoll(ctx);
      refreshPvpGameOverActions();
      const textEl = matchSession?.root.querySelector("#game-over-text");
      if (textEl) textEl.textContent = `Waiting for ${ctx.opponentName} to join rematch…`;
    } catch (e) {
      const textEl = matchSession?.root.querySelector("#game-over-text");
      if (textEl) textEl.textContent = formatPvpError(e, { context: "rematch" });
    }
  }

  async function handlePvpGameOverAction(actionId, ctx) {
    if (actionId === "back") {
      stopRematchPoll();
      if (ctx?.localRematchRoomId) await cancelHostedRoom(ctx.localRematchRoomId);
      pvpGameOverCtx = null;
      matchSession?.onExit?.();
      return;
    }

    if (actionId === "editDeck") {
      stopRematchPoll();
      if (ctx?.localRematchRoomId) await cancelHostedRoom(ctx.localRematchRoomId);
      const deckId = ctx?.deckId || getProfile().selectedDeckId;
      matchSession?.dispose();
      matchSession = null;
      matchLaunching = false;
      pvpGameOverCtx = null;
      exitMatchMode();
      void lockPortrait();
      setAudioMode("hub");
      clearActivePvpMatchId();
      pvpService?.dispose();
      pvpService = null;
      arenaRoot.innerHTML = "";
      onNavigateTab?.("deck");
      if (deckId) onOpenDeckEdit?.(deckId);
      return;
    }

    if (actionId === "rematch") {
      await startRematchFlow(ctx);
      return;
    }

    if (actionId === "joinRematch") {
      await startRematchFlow(ctx, { joinOnly: true });
    }
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

  function resolveLocalColor(row, userId = getCurrentUser()?.id) {
    if (row?.host_id && row.host_id === userId) return COLORS.RED;
    if (row?.guest_id && row.guest_id === userId) return COLORS.BLACK;
    return pvpService?.localColor ?? COLORS.RED;
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

    const user = getCurrentUser();
    if (user && isParticipant(row, user.id)) {
      pvpService.attachToMatch(row, user.id);
    }
    const localColor = resolveLocalColor(row, user?.id);
    const opponentName = opponentNameFromRow(row);
    const localName = localNameFromRow(row);

    const [localCosmeticsBase, opponentCosmeticsBase] = await Promise.all([
      cosmeticsForUser(user?.id, profile),
      cosmeticsForUser(opponentIdFromRow(row), profile),
    ]);

    const isLocalHost = localColor === COLORS.RED;
    const localMatchSkin = isLocalHost ? row.host_piece_skin : row.guest_piece_skin;
    const opponentMatchSkin = isLocalHost ? row.guest_piece_skin : row.host_piece_skin;
    const localCosmetics = cosmeticsWithPieceSkin(localCosmeticsBase, localMatchSkin);
    const opponentCosmetics = cosmeticsWithPieceSkin(opponentCosmeticsBase, opponentMatchSkin);

    const selectedDeck =
      profile.decks.find((d) => d.id === profile.selectedDeckId) || profile.decks[0];
    pvpGameOverCtx = {
      finishedRow: row,
      opponentId: opponentIdFromRow(row),
      opponentName,
      matchEndedAt: null,
      localRematchRoomId: null,
      opponentRematchRoomId: null,
      deckId: selectedDeck?.id || profile.selectedDeckId,
    };

    if (!resume) {
      await showPvpMatchLoading(arenaRoot, {
        local: { username: localName, cosmetics: localCosmetics },
        opponent: { username: opponentName, cosmetics: opponentCosmetics },
      });
    }

    if (!pvpService || row.status !== "active" || !row.state_json) {
      matchLaunching = false;
      if (!matchSession) renderLobby();
      return;
    }

    arenaRoot.innerHTML = "";
    const matchRoot = document.createElement("div");
    matchRoot.id = "pvp-match-root";
    arenaRoot.appendChild(matchRoot);
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
          stopRematchPoll();
          pvpGameOverCtx = null;
          exitMatchMode();
          void lockPortrait();
          setAudioMode("hub");
          clearActivePvpMatchId();
          pvpService?.dispose();
          pvpService = null;
          const tab = consumePendingNavigationTab();
          if (tab) onNavigateTab?.(tab);
          else returnToPvpShell();
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
            const updated = await pvpService.pushState(state, pvpService._lastVersion);
            if (updated) {
              pvpService._lastVersion = updated.version;
              pvpService._lastAppliedFingerprint = matchRowFingerprint(updated);
              return;
            }
            if (matchSession?.localPvpStateAheadOf(state)) {
              matchSession.pushPvpState();
              return;
            }
            const fresh = await pvpService.fetchMatch(pvpService.matchId);
            if (fresh && !matchSession?.localPvpStateAheadOf(fresh.state_json)) {
              onMatchRow(fresh);
            }
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
            } else {
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
            }
            if (pvpGameOverCtx) {
              try {
                const fresh = await pvpService.fetchMatch(pvpService.matchId);
                if (fresh) pvpGameOverCtx.finishedRow = fresh;
              } catch {
                /* use existing row */
              }
              pvpGameOverCtx.matchEndedAt = new Date(
                pvpGameOverCtx.finishedRow?.updated_at || Date.now()
              ).getTime();
              startRematchPoll(pvpGameOverCtx);
            }
          },
          onPvpPendingRow: (pendingRow) => applyPvpMatchRow(pendingRow),
          buildGameOverActions: ({ won, isTie }) =>
            buildPvpGameOverActions(pvpGameOverCtx, { won, isTie }),
          onGameOverAction: (actionId) => {
            void handlePvpGameOverAction(actionId, pvpGameOverCtx);
          },
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

    const matchMode = getSelectedMode();
    const mystery = matchMode === PVP_MODE_MYSTERY;
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
          matchMode,
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

  function showPvpView(screen = pvpScreen) {
    onNavigatePlayTab?.(screen === "leaderboard" ? "leaderboard" : "arena");
    onNavigateTab?.("play");
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
      pvpScreen = "arena";
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
          pvpScreen = "arena";
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
    arenaRoot.querySelector("#pvp-match-root")?.remove();
    return true;
  }

  function renderPvpSurface({ resume = false } = {}) {
    clearStalePvpSession();
    if (matchLaunching || arenaRoot.querySelector(".pvp-loading")) return;
    if (!matchSession) {
      if (pvpScreen === "leaderboard") renderLeaderboard();
      else renderLobby();
      if (resume) void tryResumePvpMatch();
    }
  }

  const onShellReconciled = () => {
    const panel = arenaRoot?.closest(".play-tab-panel");
    if (!panel || panel.classList.contains("hidden")) return;
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
    setScreen(screen) {
      if (screen === "arena" || screen === "leaderboard") {
        pvpScreen = screen;
      }
    },
    dispose() {
      unsubAuth();
      window.removeEventListener("cc-match-shell-reconciled", onShellReconciled);
      stopOpenRoomsSync();
      stopLeaderboardSync();
      stopRematchPoll();
      pvpGameOverCtx = null;
      matchSession = null;
      spectating = false;
      pvpScreen = "arena";
      clearActivePvpMatchId();
      pvpService?.dispose();
      pvpService = null;
      exitMatchMode({ clearCheckpoint: true });
      reconcileMatchShellState();
    },
  };
}
