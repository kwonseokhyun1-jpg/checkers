import { getCurrentUser, isAuthAvailable, searchProfilesByUsername, fetchProfileRow } from "./auth.js";
import { GUEST_SIGN_IN_NUDGE_SAVE } from "./guestMode.js";
import { normalizeCosmetics } from "./cosmetics.js";
import { buildRoomHostAvatarHtml, openPublicProfileModal } from "./userProfileModal.js";
import { initPanelHelp } from "./panelHelp.js";

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

  function addFriend(userId) {
    const user = getCurrentUser();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!userId || userId === user.id) return;
    const profile = getProfile();
    const friends = normalizeFriends(profile);
    if (friends.includes(userId)) return;
    profile.friends = [...friends, userId];
    saveProfile(profile);
    setStatus("Friend added.");
    void renderFriendsList();
    renderSearchResults();
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

  function renderSearchResults() {
    const list = root.querySelector("#social-search-results");
    if (!list) return;
    const user = getCurrentUser();
    if (!searchResults.length) {
      list.innerHTML = `<li class="social-empty">Search by username to find players.</li>`;
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
        const self = user?.id === row.id;
        const friend = isFriend(row.id);
        let action = "";
        if (self) {
          action = `<span class="social-tag">You</span>`;
        } else if (friend) {
          action = `<button type="button" class="btn-text social-remove-btn" data-remove-friend="${escapeHtml(row.id)}">Remove</button>`;
        } else {
          action = `<button type="button" class="btn-secondary social-add-btn" data-add-friend="${escapeHtml(row.id)}">Add friend</button>`;
        }
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

    list.querySelectorAll("[data-add-friend]").forEach((btn) => {
      btn.addEventListener("click", () => addFriend(btn.getAttribute("data-add-friend")));
    });
    list.querySelectorAll("[data-remove-friend]").forEach((btn) => {
      btn.addEventListener("click", () => removeFriend(btn.getAttribute("data-remove-friend")));
    });
    list.querySelectorAll("[data-view-profile]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const userId = btn.getAttribute("data-view-profile");
        const fallbackName = btn.getAttribute("data-profile-name") || "Player";
        if (userId) void openPublicProfileModal(userId, { fallbackName });
      });
    });
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
      list.innerHTML = `<li class="social-empty">No friends yet — search above to add players.</li>`;
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
          const cosmetics = normalizeCosmetics(row.profile_json?.cosmetics);
          const avatar = buildRoomHostAvatarHtml(cosmetics, name, {
            clickable: true,
            userId: row.id,
          });
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
      list.querySelectorAll("[data-view-profile]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const userId = btn.getAttribute("data-view-profile");
          const fallbackName = btn.getAttribute("data-profile-name") || "Player";
          if (userId) void openPublicProfileModal(userId, { fallbackName });
        });
      });
    } catch {
      list.innerHTML = `<li class="social-empty social-empty--error">Could not load friends.</li>`;
    }
  }

  async function runSearch(query) {
    const q = String(query || "").trim();
    if (q.length < 2) {
      searchResults = [];
      renderSearchResults();
      setStatus("");
      return;
    }
    if (!getCurrentUser()) {
      setStatus("Sign in to search players.", true);
      return;
    }
    if (!isAuthAvailable()) {
      setStatus("Social features need Supabase — check your config.", true);
      return;
    }
    setStatus("Searching…");
    try {
      searchResults = await searchProfilesByUsername(q, 12);
      renderSearchResults();
      setStatus(searchResults.length ? "" : "No players matched that username.");
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

  function render() {
    const user = getCurrentUser();
    root.innerHTML = `
      <section class="panel game-panel social-panel">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">Social</h2>
            <button type="button" id="social-help-btn" class="panel-help-btn" aria-label="How Social works" aria-expanded="false" aria-controls="social-help-desc">?</button>
          </div>
          <p id="social-help-desc" class="panel-head__desc" hidden>Search players by username, add them as friends, and view their public profiles.</p>
        </header>
        ${
          user
            ? ""
            : `<p class="social-sign-in-nudge">${escapeHtml(GUEST_SIGN_IN_NUDGE_SAVE)}</p>`
        }
        <div class="social-search">
          <label class="social-search__label" for="social-search-input">Find players</label>
          <div class="social-search__row">
            <input type="search" id="social-search-input" class="input-text social-search__input" placeholder="Username…" aria-label="Search by username" autocomplete="off" />
            <button type="button" id="social-search-btn" class="btn-secondary social-search__btn">Search</button>
          </div>
        </div>
        <p id="social-status" class="pvp-status social-status" role="status"></p>
        <h3 class="social-section-title">Search results</h3>
        <ul id="social-search-results" class="social-player-list" aria-live="polite"></ul>
        <h3 class="social-section-title">Friends</h3>
        <ul id="social-friends-list" class="social-player-list" aria-live="polite"></ul>
      </section>`;

    bindPanel();
    searchResults = [];
    renderSearchResults();
    void renderFriendsList();
  }

  return { render };
}
