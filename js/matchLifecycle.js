/** Keep adventure matches alive when switching tabs / backgrounding the app. */

const CHECKPOINT_KEY = "cc_match_checkpoint";

let checkpointMeta = null;

export function isMatchActive() {
  return document.body.classList.contains("match-active");
}

export function enterMatchMode(meta) {
  checkpointMeta = meta;
  document.body.classList.add("match-active");
}

export function exitMatchMode() {
  checkpointMeta = null;
  document.body.classList.remove("match-active");
  try {
    sessionStorage.removeItem(CHECKPOINT_KEY);
  } catch {
    /* ignore */
  }
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
      sessionStorage.removeItem(CHECKPOINT_KEY);
      return null;
    }
    return cp;
  } catch {
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
