import { getCurrentUser, isAuthAvailable, searchProfilesByUsername, fetchProfileRow } from "./auth.js";
import { GUEST_SIGN_IN_NUDGE_SAVE } from "./guestMode.js";
import { normalizeCosmetics } from "./cosmetics.js";
import { buildRoomHostAvatarHtml, openPublicProfileModal } from "./userProfileModal.js";
import { isUserOnline, onFriendPresenceChange } from "./friendPresence.js";
import { initPanelHelp } from "./panelHelp.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  fetchIncomingFriendRequests,
  fetchOutgoingFriendRequests,
} from "./friendRequests.js";

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function displayNameFromRow(row) {
  return (
    (row?.username && String(row.username).trim()) ||
    (row?.display_name && String(row.display_name).trim()) ||
    "Player"
  );
}

function normalizeFriends(profile) {
  if (!Array.isArray(profile.friends)) profile.friends = [];
  profile.friends = [...new Set(profile.friends.filter((id) => typeof id === "string" && id.length > 0))];
  return profile.friends;
}

function buildRequestStateMap(incoming, outgoing) {
  const map = new Map();
  for (const req of incoming) {
    const entry = map.get(req.from_user_id) || {};
    entry.incoming = req;
    map.set(req.from_user_id, entry);
  }
  for (const req of outgoing) {
    const entry = map.get(req.to_user_id) || {};
    entry.outgoing = req;
    map.set(req.to_user_id, entry);
  }
  return map;
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.root
 * @param {() => object} opts.getProfile
 * @param {(p: object) => void} opts.saveProfile
 * @param {() => void} opts.openAuthModal
 */
export function initSocialUI({ root, getProfile, saveProfile, openAuthModal }) {
  if (!root) return { render: () => {} };

  let searchTimer = null;
  let searchResults = [];
  let incomingRequests = [];
  let outgoingRequests = [];
  let requestStatesByUserId = new Map();
  let unsubPresence = null;

  function setStatus(text, isError = false) {
    const el = root.querySelector("#social-status");
    if (!el) return;
    el.textContent = text;
    el.classList.toggle("pvp-status--error", isError);
  }

  function isFriend(userId) {
    const friends = normalizeFriends(getProfile());
    return friends.includes(userId);
  }

  async function refreshRequests() {
    const user = getCurrentUser();
    if (!user) {
      incomingRequests = [];
      outgoingRequests = [];
      requestStatesByUserId = new Map();
      return;
    }
    try {
      [incomingRequests, outgoingRequests] = await Promise.all([
        fetchIncomingFriendRequests(),
        fetchOutgoingFriendRequests(),
      ]);
      requestStatesByUserId = buildRequestStateMap(incomingRequests, outgoingRequests);
    } catch (e) {
      setStatus(e?.message || "Could not load friend requests.", true);
    }
  }

  function addFriendLocally(userId) {
    const profile = getProfile();
    const friends = normalizeFriends(profile);
    if (friends.includes(userId)) return;
    profile.friends = [...friends, userId];
    saveProfile(profile);
  }

  async function sendRequest(toUserId) {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!toUserId || toUserId === user.id) return;
    try {
      await sendFriendRequest(toUserId);
      setStatus("Friend request sent.");
      await refreshRequests();
      renderSearchResults();
    } catch (e) {
      setStatus(e?.message || "Could not send friend request.", true);
    }
  }

  async function acceptRequest(requestId, fromUserId) {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      await acceptFriendRequest(requestId);
      addFriendLocally(fromUserId);
      setStatus("Friend request accepted.");
      await refreshRequests();
      void renderInbox();
      void renderFriendsList();
      renderSearchResults();
    } catch (e) {
      setStatus(e?.message || "Could not accept friend request.", true);
    }
  }

  async function declineRequest(requestId) {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      await declineFriendRequest(requestId);
      setStatus("Friend request declined.");
      await refreshRequests();
      void renderInbox();
      renderSearchResults();
    } catch (e) {
      setStatus(e?.message || "Could not decline friend request.", true);
    }
  }

  async function cancelRequest(requestId) {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      await cancelFriendRequest(requestId);
      setStatus("Friend request cancelled.");
      await refreshRequests();
      renderSearchResults();
    } catch (e) {
      setStatus(e?.message || "Could not cancel friend request.", true);
    }
  }

  function removeFriend(userId) {
    const profile = getProfile();
    const friends = normalizeFriends(profile);
    profile.friends = friends.filter((id) => id !== userId);
    saveProfile(profile);
    setStatus("Friend removed.");
    void renderFriendsList();
    renderSearchResults();
  }

  function renderPlayerAction(row, user) {
    const self = user?.id === row.id;
    const friend = isFriend(row.id);
    const state = requestStatesByUserId.get(row.id);

    if (self) {
      return `<span class="social-tag">You</span>`;
    }
    if (friend) {
      return `<button type="button" class="btn-text social-remove-btn" data-remove-friend="${escapeHtml(row.id)}">Remove</button>`;
    }
    if (state?.incoming) {
      return `<div class="social-request-actions">
        <button type="button" class="btn-secondary social-accept-btn" data-accept-request="${escapeHtml(state.incoming.id)}" data-from-user="${escapeHtml(row.id)}">Accept</button>
        <button type="button" class="btn-text social-decline-btn" data-decline-request="${escapeHtml(state.incoming.id)}">Deny</button>
      </div>`;
    }
    if (state?.outgoing) {
      return `<button type="button" class="btn-text social-cancel-btn" data-cancel-request="${escapeHtml(state.outgoing.id)}">Request sent</button>`;
    }
    return `<button type="button" class="btn-secondary social-send-btn" data-send-request="${escapeHtml(row.id)}">Send friend request</button>`;
  }

  function bindPresenceUpdates() {
    unsubPresence?.();
    unsubPresence = onFriendPresenceChange(() => {
      void renderFriendsList();
    });
  }

  function friendAvatarHtml(row, name, { showOnline = false } = {}) {
    const cosmetics = normalizeCosmetics(row.profile_json?.cosmetics);
    return buildRoomHostAvatarHtml(cosmetics, name, {
      clickable: true,
      userId: row.id,
      isOnline: showOnline && isUserOnline(row.id),
    });
  }

  function bindProfileAvatars(container) {
    container?.querySelectorAll("[data-view-profile]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const userId = btn.getAttribute("data-view-profile");
        const fallbackName = btn.getAttribute("data-profile-name") || "Player";
        if (userId) void openPublicProfileModal(userId, { fallbackName });
      });
    });
  }

  function bindRequestActions(container) {
    container?.querySelectorAll("[data-send-request]").forEach((btn) => {
      btn.addEventListener("click", () => void sendRequest(btn.getAttribute("data-send-request")));
    });
    container?.querySelectorAll("[data-accept-request]").forEach((btn) => {
      btn.addEventListener("click", () =>
        void acceptRequest(btn.getAttribute("data-accept-request"), btn.getAttribute("data-from-user"))
      );
    });
    container?.querySelectorAll("[data-decline-request]").forEach((btn) => {
      btn.addEventListener("click", () => void declineRequest(btn.getAttribute("data-decline-request")));
    });
    container?.querySelectorAll("[data-cancel-request]").forEach((btn) => {
      btn.addEventListener("click", () => void cancelRequest(btn.getAttribute("data-cancel-request")));
    });
    container?.querySelectorAll("[data-remove-friend]").forEach((btn) => {
      btn.addEventListener("click", () => removeFriend(btn.getAttribute("data-remove-friend")));
    });
  }

  function renderSearchResults() {
    const list = root.querySelector("#social-search-results");
    if (!list) return;
    const user = getCurrentUser();
    if (!searchResults.length) {
      list.innerHTML = `<li class="social-empty">Search by username or display name to find players.</li>`;
      return;
    }
    list.innerHTML = searchResults
      .map((row) => {
        const name = displayNameFromRow(row);
        const cosmetics = normalizeCosmetics(row.profile_json?.cosmetics);
        const avatar = buildRoomHostAvatarHtml(cosmetics, name, {
          clickable: true,
          userId: row.id,
        });
        const action = renderPlayerAction(row, user);
        return `<li class="social-player-row">
          ${avatar}
          <div class="social-player-row__body">
            <span class="social-player-row__name">${escapeHtml(name)}</span>
            <span class="social-player-row__handle">@${escapeHtml(row.username || "player")}</span>
          </div>
          ${action}
        </li>`;
      })
      .join("");

    bindRequestActions(list);
    bindProfileAvatars(list);
  }

  async function renderInbox() {
    const list = root.querySelector("#social-inbox-list");
    if (!list) return;
    const user = getCurrentUser();
    if (!user) {
      list.innerHTML = `<li class="social-empty">Sign in to see friend requests.</li>`;
      return;
    }
    if (!incomingRequests.length) {
      list.innerHTML = `<li class="social-empty">No pending friend requests.</li>`;
      return;
    }

    list.innerHTML = `<li class="social-empty">Loading requests…</li>`;
    try {
      const rows = await Promise.all(incomingRequests.map((req) => fetchProfileRow(req.from_user_id)));
      list.innerHTML = incomingRequests
        .map((req, index) => {
          const row = rows[index];
          const name = row ? displayNameFromRow(row) : "Player";
          const cosmetics = normalizeCosmetics(row?.profile_json?.cosmetics);
          const avatar = buildRoomHostAvatarHtml(cosmetics, name, {
            clickable: true,
            userId: req.from_user_id,
          });
          return `<li class="social-player-row">
            ${avatar}
            <div class="social-player-row__body">
              <span class="social-player-row__name">${escapeHtml(name)}</span>
              <span class="social-player-row__handle">@${escapeHtml(row?.username || "player")}</span>
            </div>
            <div class="social-request-actions">
              <button type="button" class="btn-secondary social-accept-btn" data-accept-request="${escapeHtml(req.id)}" data-from-user="${escapeHtml(req.from_user_id)}">Accept</button>
              <button type="button" class="btn-text social-decline-btn" data-decline-request="${escapeHtml(req.id)}">Deny</button>
            </div>
          </li>`;
        })
        .join("");

      bindRequestActions(list);
      bindProfileAvatars(list);
    } catch {
      list.innerHTML = `<li class="social-empty social-empty--error">Could not load friend requests.</li>`;
    }
  }

  async function renderFriendsList() {
    const list = root.querySelector("#social-friends-list");
    if (!list) return;
    const user = getCurrentUser();
    const friends = normalizeFriends(getProfile());
    if (!user) {
      list.innerHTML = `<li class="social-empty">Sign in to add friends.</li>`;
      return;
    }
    if (!friends.length) {
      list.innerHTML = `<li class="social-empty">No friends yet — accept requests or search above.</li>`;
      return;
    }

    list.innerHTML = `<li class="social-empty">Loading friends…</li>`;
    try {
      const rows = await Promise.all(friends.map((id) => fetchProfileRow(id)));
      const valid = rows.filter(Boolean);
      if (!valid.length) {
        list.innerHTML = `<li class="social-empty">No friends found.</li>`;
        return;
      }
      list.innerHTML = valid
        .map((row) => {
          const name = displayNameFromRow(row);
          const avatar = friendAvatarHtml(row, name, { showOnline: true });
          return `<li class="social-player-row">
            ${avatar}
            <div class="social-player-row__body">
              <span class="social-player-row__name">${escapeHtml(name)}</span>
              <span class="social-player-row__handle">@${escapeHtml(row.username || "player")}</span>
            </div>
            <button type="button" class="btn-text social-view-btn" data-view-friend="${escapeHtml(row.id)}" data-friend-name="${escapeHtml(name)}">Profile</button>
            <button type="button" class="btn-text social-remove-btn" data-remove-friend="${escapeHtml(row.id)}">Remove</button>
          </li>`;
        })
        .join("");

      list.querySelectorAll("[data-remove-friend]").forEach((btn) => {
        btn.addEventListener("click", () => removeFriend(btn.getAttribute("data-remove-friend")));
      });
      list.querySelectorAll("[data-view-friend]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const userId = btn.getAttribute("data-view-friend");
          const fallbackName = btn.getAttribute("data-friend-name") || "Player";
          if (userId) void openPublicProfileModal(userId, { fallbackName });
        });
      });
      bindProfileAvatars(list);
    } catch {
      list.innerHTML = `<li class="social-empty social-empty--error">Could not load friends.</li>`;
    }
  }

  async function runSearch(query) {
    const q = String(query || "").trim();
    if (q.length < 2) {
      searchResults = [];
      renderSearchResults();
      setStatus(q.length ? "Type at least 2 characters to search." : "");
      return;
    }
    if (!isAuthAvailable()) {
      setStatus("Player search needs an online connection — check your config.", true);
      return;
    }
    setStatus("Searching…");
    try {
      searchResults = await searchProfilesByUsername(q, 12);
      renderSearchResults();
      setStatus(searchResults.length ? "" : "No players matched that search.");
    } catch (e) {
      searchResults = [];
      renderSearchResults();
      setStatus(e?.message || "Search failed.", true);
    }
  }

  function bindPanel() {
    initPanelHelp(root.querySelector("#social-help-btn"), root.querySelector("#social-help-desc"));

    const input = root.querySelector("#social-search-input");
    input?.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => void runSearch(input.value), 320);
    });
    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        clearTimeout(searchTimer);
        void runSearch(input.value);
      }
    });
    root.querySelector("#social-search-btn")?.addEventListener("click", () => {
      void runSearch(input?.value || "");
    });
  }

  function syncGuestNudge() {
    const user = getCurrentUser();
    const existingNudge = root.querySelector(".social-sign-in-nudge");
    if (user) {
      existingNudge?.remove();
      return;
    }
    if (existingNudge) return;
    const search = root.querySelector(".social-search");
    if (!search) return;
    search.insertAdjacentHTML(
      "beforebegin",
      `<p class="social-sign-in-nudge">${escapeHtml(GUEST_SIGN_IN_NUDGE_SAVE)}</p>`
    );
  }

  async function refresh() {
    if (!root.querySelector(".social-panel")) {
      render();
      return;
    }
    syncGuestNudge();
    bindPresenceUpdates();
    await refreshRequests();
    renderSearchResults();
    void renderInbox();
    void renderFriendsList();
  }

  function render() {
    const user = getCurrentUser();
    root.innerHTML = `
      <section class="panel game-panel social-panel">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">Social</h2>
            <button type="button" id="social-help-btn" class="panel-help-btn" aria-label="How Social works" aria-expanded="false" aria-controls="social-help-desc">?</button>
          </div>
          <p id="social-help-desc" class="panel-head__desc" hidden>Search players by username or display name, send friend requests, and accept or deny requests in your inbox. Sign in to save your friends list.</p>
        </header>
        ${
          user
            ? ""
            : `<p class="social-sign-in-nudge">${escapeHtml(GUEST_SIGN_IN_NUDGE_SAVE)}</p>`
        }
        <div class="social-search">
          <label class="social-search__label" for="social-search-input">Find players</label>
          <div class="social-search__row">
            <input type="search" id="social-search-input" class="input-text social-search__input" placeholder="Username or name…" aria-label="Search players by username or display name" autocomplete="off" />
            <button type="button" id="social-search-btn" class="btn-secondary social-search__btn">Search</button>
          </div>
        </div>
        <p id="social-status" class="pvp-status social-status" role="status"></p>
        <h3 class="social-section-title">Friend requests</h3>
        <ul id="social-inbox-list" class="social-player-list" aria-live="polite"></ul>
        <h3 class="social-section-title">Search results</h3>
        <ul id="social-search-results" class="social-player-list" aria-live="polite"></ul>
        <h3 class="social-section-title">Friends</h3>
        <ul id="social-friends-list" class="social-player-list" aria-live="polite"></ul>
      </section>`;

    bindPanel();
    bindPresenceUpdates();
    searchResults = [];
    void refreshRequests().then(() => {
      renderSearchResults();
      void renderInbox();
      void renderFriendsList();
    });
  }

  return { render, refresh };
}
