import { getCurrentUser, isAuthAvailable } from "./auth.js";
import { DECK_SIZE } from "./cardCatalog.js";
import { COLORS } from "./board.js";
import { MatchSession } from "./match.js";
import { getMatchHtml } from "./matchView.js";
import { enterMatchMode, exitMatchMode } from "./matchLifecycle.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { PvpService, probePvpBackend, subscribeOpenRooms } from "./pvp.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.root
 * @param {() => object} opts.getProfile
 * @param {() => void} opts.openAuthModal
 */
export function initPvpUI({ root, getProfile, openAuthModal }) {
  if (!root) return { render: () => {}, dispose: () => {} };

  let pvpService = null;
  let matchSession = null;
  let unsubscribeOpenRooms = null;
  let openRoomsPollId = null;

  function stopOpenRoomsSync() {
    if (openRoomsPollId) {
      clearInterval(openRoomsPollId);
      openRoomsPollId = null;
    }
    unsubscribeOpenRooms?.();
    unsubscribeOpenRooms = null;
  }

  function startOpenRoomsSync() {
    stopOpenRoomsSync();
    void refreshOpenRooms();
    openRoomsPollId = setInterval(() => void refreshOpenRooms(), 4000);
    unsubscribeOpenRooms = subscribeOpenRooms(() => void refreshOpenRooms());
  }

  function renderLobby(message = "", isError = false) {
    const user = getCurrentUser();
    const profile = getProfile();
    const decks = (profile.decks || []).filter((d) => d.cardIds?.length === DECK_SIZE);
    const selected =
      decks.find((d) => d.id === profile.selectedDeckId) ||
      decks.find((d) => d.cardIds?.length === DECK_SIZE);

    stopOpenRoomsSync();

    if (!isAuthAvailable()) {
      root.innerHTML = `
        <section class="panel game-panel pvp-panel">
          <header class="panel-head">
            <h2 class="panel-head__title">PvP Arena</h2>
            <p class="panel-head__desc">Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.</p>
          </header>
        </section>`;
      return;
    }

    if (!user) {
      root.innerHTML = `
        <section class="panel game-panel pvp-panel">
          <header class="panel-head">
            <h2 class="panel-head__title">PvP Arena</h2>
            <p class="panel-head__desc">Sign in to challenge other players in real-time 1v1 matches.</p>
          </header>
          <button type="button" class="btn-primary btn-lg" id="pvp-sign-in">Sign in / Sign up</button>
        </section>`;
      root.querySelector("#pvp-sign-in")?.addEventListener("click", openAuthModal);
      return;
    }

    root.innerHTML = `
      <section class="panel game-panel pvp-panel">
        <header class="panel-head">
          <h2 class="panel-head__title">PvP Arena</h2>
          <p class="panel-head__desc">Host a room or join an open match below. You play red; your opponent plays black.</p>
        </header>
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
              : '<option value="">No valid deck</option>'
          }
        </select>
        <div class="pvp-actions">
          <button type="button" class="btn-primary btn-lg" id="pvp-host">Host a room</button>
        </div>
        <div class="pvp-room-section pvp-your-rooms">
          <h3 class="pvp-room-section__title">Your rooms</h3>
          <p class="pvp-room-section__hint">Rooms you are hosting. Cancel anytime before someone joins.</p>
          <ul id="pvp-your-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty">Loading…</li>
          </ul>
        </div>
        <div class="pvp-room-section pvp-open-rooms">
          <h3 class="pvp-room-section__title">Open rooms</h3>
          <p class="pvp-room-section__hint">Rooms hosted by other players — tap to join.</p>
          <ul id="pvp-open-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty">Loading…</li>
          </ul>
        </div>
        <p id="pvp-status" class="pvp-status${isError ? " pvp-status--error" : ""}" role="status">${escapeHtml(message)}</p>
        <div id="pvp-waiting" class="pvp-waiting hidden"></div>
      </section>`;

    root.querySelector("#pvp-host")?.addEventListener("click", () => void hostRoom());
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
      renderRoomLists(mergedMine, others);
    } catch (e) {
      const err = `<li class="pvp-open-empty pvp-open-empty--error">${escapeHtml(e.message || "Could not load rooms")}</li>`;
      yourList.innerHTML = err;
      openList.innerHTML = err;
    }
  }

  function renderRoomLists(mine, others) {
    const yourList = root.querySelector("#pvp-your-list");
    const openList = root.querySelector("#pvp-open-list");
    if (!yourList || !openList) return;

    if (!mine.length) {
      yourList.innerHTML = `<li class="pvp-open-empty">No rooms yet — host one above.</li>`;
    } else {
      yourList.innerHTML = mine
        .map(
          (room) => `<li class="pvp-open-item pvp-open-item--mine">
            <span class="pvp-open-item__label">${escapeHtml(room.host_display_name || "Your room")}</span>
            <span class="pvp-open-item__meta">Waiting for opponent…</span>
            <button type="button" class="btn-secondary pvp-open-cancel" data-cancel-room="${room.id}">Cancel</button>
          </li>`
        )
        .join("");
    }

    if (!others.length) {
      const hint = mine.length
        ? "No open rooms from other players. Yours is listed above under <strong>Your rooms</strong>."
        : "No open rooms from other players.";
      openList.innerHTML = `<li class="pvp-open-empty">${hint}</li>`;
    } else {
      openList.innerHTML = others
        .map(
          (room) => `<li class="pvp-open-item">
            <button type="button" class="pvp-open-join" data-join-room="${room.id}">
              <span class="pvp-open-join__name">${escapeHtml(room.host_display_name || "Player")}</span>
              <span class="pvp-open-join__action">Join match</span>
            </button>
          </li>`
        )
        .join("");
    }

    openList.querySelectorAll("[data-join-room]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-join-room");
        if (id) void joinOpenRoom(id);
      });
    });

    yourList.querySelectorAll("[data-cancel-room]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-cancel-room");
        if (id) void cancelHostedRoom(id);
      });
    });
  }

  function getSelectedDeck() {
    const profile = getProfile();
    const id = root.querySelector("#pvp-deck-select")?.value || profile.selectedDeckId;
    return profile.decks.find((d) => d.id === id);
  }

  function getDisplayName() {
    const user = getCurrentUser();
    return (
      user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Player"
    );
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

  function onMatchRow(row) {
    if (!row) return;

    if (row.status === "waiting" && pvpService?.role === "host") {
      setStatus("Your room is open — waiting for an opponent…");
      showHosting();
      pvpService.startPolling();
      void refreshOpenRooms();
      return;
    }

    if (matchSession && row.status === "active" && row.state_json) {
      const ver = row.version ?? 0;
      if (ver <= (pvpService?._lastVersion ?? -1)) return;
      if (matchSession.actionBusy || matchSession._syncBusy) return;
      const isMyTurn = row.turn === pvpService.localColor;
      const opponentName =
        pvpService.localColor === COLORS.RED
          ? row.guest_display_name || "Opponent"
          : row.host_display_name || "Opponent";
      matchSession.importState(row.state_json);
      pvpService._lastVersion = ver;
      matchSession.setMessage(
        isMyTurn ? "Your turn — cast a spell or move." : `${opponentName} is acting…`
      );
      return;
    }

    if (row.status === "active" && row.state_json && !matchSession) {
      stopOpenRoomsSync();
      hideHosting();
      launchMatch(row);
    }
  }

  function launchMatch(row) {
    const profile = getProfile();
    const deck = getSelectedDeck();
    if (!deck || deck.cardIds.length !== DECK_SIZE) {
      setStatus("Invalid deck.", true);
      return;
    }

    const localColor = pvpService.localColor;
    const opponentName =
      localColor === COLORS.RED
        ? row.guest_display_name || "Opponent"
        : row.host_display_name || "Opponent";

    root.innerHTML = "";
    const matchRoot = document.createElement("div");
    matchRoot.id = "pvp-match-root";
    root.appendChild(matchRoot);
    matchRoot.innerHTML = getMatchHtml(opponentName, { exitLabel: "← Leave PvP" });

    pvpService._lastVersion = row.version ?? 0;

    enterMatchMode({ kind: "pvp" });
    matchSession = new MatchSession(
      deck.cardIds,
      matchRoot,
      () => {
        matchSession = null;
        exitMatchMode();
        pvpService?.dispose();
        pvpService = null;
        renderLobby();
      },
      null,
      {
        pvp: true,
        localColor,
        initialState: row.state_json,
        opponentName,
        cosmetics: getEquippedCosmetics(profile),
        onStateSync: async (state) => {
          const v = pvpService._lastVersion;
          const updated = await pvpService.pushState(state, v);
          if (updated) pvpService._lastVersion = updated.version;
        },
        onPvpWin: async (won) => {
          const user = getCurrentUser();
          if (!user) return;
          const winnerId = won
            ? user.id
            : localColor === COLORS.RED
              ? row.guest_id
              : row.host_id;
          if (winnerId) await pvpService.finishMatch(winnerId);
        },
      }
    );

    matchSession.setMessage(
      localColor === row.turn
        ? "Your turn — cast a spell or move."
        : `${opponentName} is thinking…`
    );
    matchSession.render();
    pvpService.startPolling(2000);
  }

  function ensurePvpService() {
    if (!pvpService) {
      pvpService = new PvpService();
      pvpService.onMatchRow = onMatchRow;
      pvpService.onError = (e) => setStatus(e.message || "Sync error", true);
    }
    return pvpService;
  }

  async function hostRoom() {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }

    const deck = getSelectedDeck();
    if (!deck || deck.cardIds.length !== DECK_SIZE) {
      setStatus("Build a 30-card deck in Decks first.", true);
      return;
    }

    pvpService?.dispose();
    pvpService = null;

    try {
      setStatus("Opening your room…");
      const svc = ensurePvpService();
      const row = await svc.createRoom(deck.cardIds, getDisplayName());
      renderRoomLists([row], [], getCurrentUser().id);
      setStatus("Room open — waiting under Your rooms.");
      onMatchRow(row);
      void refreshOpenRooms(row);
    } catch (e) {
      setStatus(e.message || "Could not host a room", true);
      pvpService?.dispose();
      pvpService = null;
    }
  }

  async function joinOpenRoom(matchId) {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }

    const deck = getSelectedDeck();
    if (!deck || deck.cardIds.length !== DECK_SIZE) {
      setStatus("Build a 30-card deck in Decks first.", true);
      return;
    }

    pvpService?.dispose();
    pvpService = null;

    try {
      setStatus("Joining match…");
      stopOpenRoomsSync();
      const svc = ensurePvpService();
      const row = await svc.joinRoomById(matchId, deck.cardIds, getDisplayName());
      onMatchRow(row);
    } catch (e) {
      setStatus(e.message || "Could not join room", true);
      pvpService?.dispose();
      pvpService = null;
      startOpenRoomsSync();
    }
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
      }
      hideHosting();
      setStatus("");
      void refreshOpenRooms();
    } catch (e) {
      setStatus(e.message || "Could not cancel room", true);
    }
  }

  renderLobby();

  return {
    render() {
      if (!matchSession) renderLobby();
    },
    dispose() {
      stopOpenRoomsSync();
      matchSession = null;
      pvpService?.dispose();
      pvpService = null;
    },
  };
}
