/** Keep adventure matches alive when switching tabs / backgrounding the app. */

const CHECKPOINT_KEY = "cc_match_checkpoint";
/** Discard checkpoints older than 24 hours. */
const CHECKPOINT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

let pendingNavigationTab = null;
let skipNextLeaveConfirm = false;
/** @type {object|null} */
let checkpointMeta = null;

export function isMatchActive() {
  return document.body.classList.contains("match-active");
}

function isVisibleShellElement(el) {
  if (!el || !(el instanceof Element)) return false;
  if (el.closest(".hidden")) return false;
  const style = getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return true;
}

/** True when the in-match board UI (with Leave match) is visible on screen. */
export function isLiveMatchUiVisible() {
  const leaveBtn = document.querySelector("#btn-leave-match");
  if (!leaveBtn) return false;
  if (isVisibleShellElement(leaveBtn)) return true;
  // PvP/adventure match may still be mounted in a hidden tab until the view is revealed.
  if (!isMatchActive()) return false;
  const matchView = document.getElementById("view-match");
  const pvpView = document.getElementById("play-arena-root");
  if (matchView?.contains(leaveBtn) || pvpView?.contains(leaveBtn)) return true;
  return false;
}

export function setPendingNavigationTab(tab) {
  pendingNavigationTab = tab;
}

export function consumePendingNavigationTab() {
  const tab = pendingNavigationTab;
  pendingNavigationTab = null;
  return tab;
}

export function clearPendingNavigationTab() {
  pendingNavigationTab = null;
}

export function armLeaveConfirmSkip() {
  skipNextLeaveConfirm = true;
}

export function consumeLeaveConfirmSkip() {
  const armed = skipNextLeaveConfirm;
  skipNextLeaveConfirm = false;
  return armed;
}

function cleanupOrphanMatchDom() {
  const matchView = document.getElementById("view-match");
  if (matchView?.classList.contains("hidden") && matchView.innerHTML.trim()) {
    matchView.innerHTML = "";
  }
  const pvpRoot = document.getElementById("play-arena-root");
  if (pvpRoot) {
    const leaveBtn = pvpRoot.querySelector("#btn-leave-match");
    if (!isVisibleShellElement(leaveBtn)) {
      pvpRoot.querySelector("#pvp-match-root")?.remove();
    }
  }
}

/** Drop stale match-active when menus/decks show but no visible match UI. */
export function reconcileMatchShellState() {
  if (!isMatchActive()) return false;
  if (isLiveMatchUiVisible()) return false;
  cleanupOrphanMatchDom();
  exitMatchMode({ clearCheckpoint: false });
  window.dispatchEvent(new CustomEvent("cc-match-shell-reconciled"));
  return true;
}

function syncMatchShellPresentation(active) {
  document.querySelector(".game-shell")?.classList.toggle("game-shell--in-match", active);
}

export function enterMatchMode(meta) {
  checkpointMeta = meta;
  document.body.classList.add("match-active");
  syncMatchShellPresentation(true);
}

export function clearMatchCheckpoint() {
  try {
    sessionStorage.removeItem(CHECKPOINT_KEY);
  } catch {
    /* ignore */
  }
}

/** @param {{ clearCheckpoint?: boolean }} [options] */
export function exitMatchMode(options = {}) {
  checkpointMeta = null;
  document.body.classList.remove("match-active");
  syncMatchShellPresentation(false);
  if (options.clearCheckpoint) clearMatchCheckpoint();
}

export function saveMatchCheckpoint(session) {
  if (!checkpointMeta || !session?.state || checkpointMeta.kind !== "adventure" || session.state.gameOver) return;
  try {
    sessionStorage.setItem(
      CHECKPOINT_KEY,
      JSON.stringify({
        ...checkpointMeta,
        state: session.state,
        winRewarded: !!session.winRewarded,
        savedAt: Date.now(),
      })
    );
  } catch {
    /* quota / private mode */
  }
}

export function readMatchCheckpoint() {
  try {
    const raw = sessionStorage.getItem(CHECKPOINT_KEY);
    if (!raw) return null;
    const cp = JSON.parse(raw);
    if (!cp?.state || cp.state.gameOver || cp.kind !== "adventure") {
      clearMatchCheckpoint();
      return null;
    }
    if (cp.savedAt && Date.now() - cp.savedAt > CHECKPOINT_MAX_AGE_MS) {
      clearMatchCheckpoint();
      return null;
    }
    return cp;
  } catch {
    clearMatchCheckpoint();
    return null;
  }
}

export function bindMatchVisibilityHandlers(getSession) {
  if (window.__ccMatchVisibilityBound) return;
  window.__ccMatchVisibilityBound = true;

  const onHide = () => {
    const session = getSession();
    if (session) saveMatchCheckpoint(session);
  };

  document.addEventListener("visibilitychange", () => {
    const session = getSession();
    if (document.hidden) {
      onHide();
      session?.pauseForBackground?.();
    } else {
      session?.resumeFromBackground?.();
    }
  });

  window.addEventListener("pagehide", onHide);
}
