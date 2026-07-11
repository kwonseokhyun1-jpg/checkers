import { getSupabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { getPvpWinCount } from "./profileStats.js";

function isMissingRpc(error) {
  const code = error?.code || "";
  const msg = String(error?.message || "");
  return code === "PGRST202" || msg.includes("Could not find the function");
}

function displayNameFromRow(row) {
  return (
    (row?.username && String(row.username).trim()) ||
    (row?.display_name && String(row.display_name).trim()) ||
    "Player"
  );
}

/**
 * @returns {Promise<Array<{ id: string, username: string, pvpWins: number, rank: number }>>}
 */
export async function fetchPvpLeaderboard(limit = 50) {
  const sb = getSupabase();
  if (!sb) return [];

  const rpc = await sb.rpc("pvp_leaderboard", { p_limit: limit });
  if (!rpc.error && Array.isArray(rpc.data)) {
    return rpc.data.map((row, index) => ({
      id: row.id,
      username: displayNameFromRow(row),
      pvpWins: Math.max(0, Number(row.pvp_wins) || 0),
      rank: index + 1,
    }));
  }

  if (rpc.error && !isMissingRpc(rpc.error)) throw rpc.error;

  const { data, error } = await sb
    .from("profiles")
    .select("id, username, display_name, profile_json")
    .limit(200);

  if (error) throw error;

  return (data || [])
    .map((row) => ({
      id: row.id,
      username: displayNameFromRow(row),
      pvpWins: getPvpWinCount(row.profile_json || {}),
    }))
    .filter((row) => row.pvpWins > 0)
    .sort((a, b) => b.pvpWins - a.pvpWins || a.username.localeCompare(b.username))
    .slice(0, limit)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

/**
 * @returns {Promise<Array<object>>}
 */
export async function fetchLivePvpMatches(limit = 20) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) return [];

  const { data, error } = await sb
    .from("pvp_matches")
    .select(
      "id, host_id, guest_id, host_display_name, guest_display_name, turn, match_mode, updated_at, version"
    )
    .eq("status", "active")
    .not("guest_id", "is", null)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/** Realtime hook for live match list refresh. */
export function subscribeLiveMatches(onChange) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel("pvp-live-matches")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pvp_matches",
        filter: "status=eq.active",
      },
      () => onChange?.()
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}
