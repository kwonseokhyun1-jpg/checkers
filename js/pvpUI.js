import { getCurrentUser, isAuthAvailable } from "./auth.js";
import { DECK_SIZE } from "./cardCatalog.js";
import { COLORS } from "./board.js";
import { MatchSession } from "./match.js";
import { getMatchHtml } from "./matchView.js";
import { enterMatchMode, exitMatchMode } from "./matchLifecycle.js";
import { getEquippedCosmetics } from "./cosmetics.js";
import { PvpService } from "./pvp.js";

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

  function renderLobby(message = "", isError = false) {
    const user = getCurrentUser();
    const profile = getProfile();
    const decks = (profile.decks || []).filter((d) => d.cardIds?.length === DECK_SIZE);
    const selected =
      decks.find((d) => d.id === profile.selectedDeckId) ||
      decks.find((d) => d.cardIds?.length === DECK_SIZE);

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
          <p class="panel-head__desc">1v1 online — you are red, opponent is black. Both players need a 30-card deck.</p>
        </header>
        <label class="label-sm" for="pvp-deck-select">Your deck</label>
        <select id="pvp-deck-select" class="select-input">
          ${
            decks.length
              ? decks
                  .map(
                    (d) =>
                      `<option value="${d.id}" ${d.id === selected?.id ? "selected" : ""}>${d.name}</option>`
                  )
                  .join("")
              : '<option value="">No valid deck</option>'
          }
        </select>
        <div class="pvp-actions">
          <button type="button" class="btn-primary btn-lg" id="pvp-quick">Quick match</button>
          <button type="button" class="btn-secondary" id="pvp-create">Create room</button>
        </div>
        <div class="pvp-join-row">
          <input type="text" id="pvp-code" class="input-text" placeholder="Room code" maxlength="6" autocomplete="off" />
          <button type="button" class="btn-secondary" id="pvp-join">Join</button>
        </div>
        <p id="pvp-status" class="pvp-status${isError ? " pvp-status--error" : ""}" role="status">${message}</p>
        <div id="pvp-waiting" class="pvp-waiting hidden"></div>
      </section>`;

    root.querySelector("#pvp-quick")?.addEventListener("click", () => startMatch("quick"));
    root.querySelector("#pvp-create")?.addEventListener("click", () => startMatch("create"));
    root.querySelector("#pvp-join")?.addEventListener("click", () => startMatch("join"));
  }

  function getSelectedDeck() {
    const profile = getProfile();
    const id = root.querySelector("#pvp-deck-select")?.value || profile.selectedDeckId;
    return profile.decks.find((d) => d.id === id);
  }

  function setStatus(text, isError = false) {
    const el = root.querySelector("#pvp-status");
    if (el) {
      el.textContent = text;
      el.classList.toggle("pvp-status--error", isError);
    }
  }

  function showWaiting(code) {
    const box = root.querySelector("#pvp-waiting");
    if (!box) return;
    box.classList.remove("hidden");
    box.innerHTML = `
      <p class="pvp-room-code">Room code: <strong>${code}</strong></p>
      <p class="pvp-wait-hint">Share this code. Waiting for opponent…</p>
      <button type="button" class="btn-text" id="pvp-cancel">Cancel</button>`;
    box.querySelector("#pvp-cancel")?.addEventListener("click", async () => {
      await pvpService?.cancelWaitingRoom();
      pvpService?.dispose();
      pvpService = null;
      renderLobby();
    });
  }

  function onMatchRow(row) {
    if (!row) return;

    if (row.status === "waiting" && pvpService?.role === "host") {
      setStatus("Waiting for opponent…");
      showWaiting(row.code);
      return;
    }

    if (matchSession && row.status === "active" && row.state_json) {
      if (row.version <= (pvpService?._lastVersion ?? -1)) return;
      pvpService._lastVersion = row.version;
      const isMyTurn = row.turn === pvpService.localColor;
      matchSession.importState(row.state_json);
      matchSession.setMessage(
        isMyTurn
          ? "Your turn — cast a spell or move."
          : `${row.guest_display_name || row.host_display_name || "Opponent"} is acting…`
      );
      return;
    }

    if (row.status === "active" && row.state_json && !matchSession) {
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
  }

  async function startMatch(mode) {
    if (!getCurrentUser()) {
      openAuthModal();
      return;
    }

    const deck = getSelectedDeck();
    if (!deck || deck.cardIds.length !== DECK_SIZE) {
      setStatus("Build a 30-card deck in Decks first.", true);
      return;
    }

    const displayName =
      getCurrentUser().user_metadata?.display_name ||
      getCurrentUser().email?.split("@")[0] ||
      "Player";

    pvpService?.dispose();
    pvpService = new PvpService();
    pvpService.onMatchRow = onMatchRow;
    pvpService.onError = (e) => setStatus(e.message || "Sync error", true);

    try {
      setStatus("Connecting…");
      let row;
      if (mode === "quick") row = await pvpService.findQuickMatch(deck.cardIds, displayName);
      else if (mode === "create") row = await pvpService.createRoom(deck.cardIds, displayName);
      else {
        const code = root.querySelector("#pvp-code")?.value;
        if (!code?.trim()) {
          setStatus("Enter a room code.", true);
          return;
        }
        row = await pvpService.joinRoom(code, deck.cardIds, displayName);
      }
      onMatchRow(row);
    } catch (e) {
      setStatus(e.message || "Could not start match", true);
      pvpService?.dispose();
      pvpService = null;
    }
  }

  renderLobby();

  return {
    render() {
      if (!matchSession) renderLobby();
    },
    dispose() {
      matchSession = null;
      pvpService?.dispose();
      pvpService = null;
    },
  };
}
