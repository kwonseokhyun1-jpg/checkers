/**
 * Player-facing PvP error text (no Supabase imports — safe for unit tests).
 * @param {unknown} error
 * @param {{ context?: "sync" | "lobby" }} [opts]
 */
export function formatPvpError(error, { context = "lobby" } = {}) {
  if (!error) {
    return context === "sync"
      ? "Couldn't sync your move — we'll keep trying."
      : "Something went wrong — please try again.";
  }
  if (typeof error === "string") return error;

  const msg = String(error.message || error.error_description || "").trim();
  const code = error.code || "";

  const networkLike =
    error.name === "TypeError" ||
    /failed to fetch|networkerror|load failed|network request failed/i.test(msg);
  if (networkLike) {
    return context === "sync"
      ? "Connection problem — your move may not show for your opponent yet. We'll retry automatically."
      : "Network error — check your connection and try again.";
  }

  if (code === "PGRST301" || /jwt|token expired|invalid.*session/i.test(msg)) {
    return "Session expired — sign out and sign back in, then try again.";
  }

  if (msg) return msg;

  return context === "sync"
    ? "Couldn't sync your move — we'll keep trying."
    : "Something went wrong — please try again.";
}
