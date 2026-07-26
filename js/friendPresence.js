import { getCurrentUser } from "./auth.js";
import { getSupabase, isSupabaseConfigured } from "./supabaseClient.js";

const PRESENCE_CHANNEL = "online-players";

/** @type {import("@supabase/supabase-js").RealtimeChannel | null} */
let channel = null;
/** @type {Set<string>} */
let onlineUserIds = new Set();
/** @type {Set<(online: Set<string>) => void>} */
const listeners = new Set();

function notifyListeners() {
  const snapshot = new Set(onlineUserIds);
  for (const fn of listeners) fn(snapshot);
}

function syncPresenceFromState(state) {
  const next = new Set();
  for (const presences of Object.values(state || {})) {
    for (const presence of presences) {
      const userId = presence?.user_id;
      if (typeof userId === "string" && userId.length > 0) next.add(userId);
    }
  }
  onlineUserIds = next;
  notifyListeners();
}

export function isUserOnline(userId) {
  return Boolean(userId) && onlineUserIds.has(userId);
}

export function getOnlineUserIds() {
  return new Set(onlineUserIds);
}

/** @param {(online: Set<string>) => void} fn */
export function onFriendPresenceChange(fn) {
  listeners.add(fn);
  fn(new Set(onlineUserIds));
  return () => listeners.delete(fn);
}

export function startFriendPresence() {
  stopFriendPresence();

  const user = getCurrentUser();
  const sb = getSupabase();
  if (!user || !sb || !isSupabaseConfigured()) return;

  channel = sb.channel(PRESENCE_CHANNEL, {
    config: { presence: { key: user.id } },
  });

  const refresh = () => syncPresenceFromState(channel?.presenceState());

  channel
    .on("presence", { event: "sync" }, refresh)
    .on("presence", { event: "join" }, refresh)
    .on("presence", { event: "leave" }, refresh)
    .subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      try {
        await channel.track({ user_id: user.id });
      } catch (err) {
        console.warn("Friend presence track failed", err);
      }
    });
}

export function stopFriendPresence() {
  const sb = getSupabase();
  if (channel) {
    sb?.removeChannel(channel);
    channel = null;
  }
  onlineUserIds = new Set();
  notifyListeners();
}
