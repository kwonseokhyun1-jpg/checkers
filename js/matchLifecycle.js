/** Keep adventure matches alive when switching tabs / backgrounding the app. */

const CHECKPOINT_KEY = "cc_match_checkpoint";
/** Discard checkpoints older than 24 hours. */
const CHECKPOINT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

let checkpointMeta = null;

export function isMatchActive() {
  return document.body.classList.contains("match-active");
}

export function enterMatchMode(meta) {
  checkpointMeta = meta;
  document.body.classList.add("match-active");
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
