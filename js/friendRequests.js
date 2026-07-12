import { getSupabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";

function isMissingTableOrRpcError(error) {
  const code = error?.code || error?.details?.code;
  const msg = String(error?.message || "");
  return (
    code === "PGRST202" ||
    code === "42P01" ||
    code === "42883" ||
    /friend_requests/i.test(msg) ||
    /accept_friend_request/i.test(msg) ||
    /does not exist/i.test(msg)
  );
}

export function friendRequestsUnavailableMessage() {
  return "Friend requests are not available yet. Ask the host to run supabase/migration_friend_requests.sql in Supabase.";
}

/**
 * @returns {Promise<Array<{ id: string, from_user_id: string, to_user_id: string, status: string, created_at: string }>>}
 */
export async function fetchIncomingFriendRequests() {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) return [];
  const { data, error } = await sb
    .from("friend_requests")
    .select("id, from_user_id, to_user_id, status, created_at")
    .eq("to_user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    if (isMissingTableOrRpcError(error)) return [];
    throw error;
  }
  return data || [];
}

/**
 * @returns {Promise<Array<{ id: string, from_user_id: string, to_user_id: string, status: string, created_at: string }>>}
 */
export async function fetchOutgoingFriendRequests() {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) return [];
  const { data, error } = await sb
    .from("friend_requests")
    .select("id, from_user_id, to_user_id, status, created_at")
    .eq("from_user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) {
    if (isMissingTableOrRpcError(error)) return [];
    throw error;
  }
  return data || [];
}

/**
 * @param {string} toUserId
 */
export async function sendFriendRequest(toUserId) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) throw new Error("Sign in to send friend requests.");
  if (!toUserId || toUserId === user.id) return null;

  const { data, error } = await sb
    .from("friend_requests")
    .insert({
      from_user_id: user.id,
      to_user_id: toUserId,
      status: "pending",
    })
    .select("id, from_user_id, to_user_id, status, created_at")
    .single();

  if (error) {
    if (isMissingTableOrRpcError(error)) {
      throw new Error(friendRequestsUnavailableMessage());
    }
    if (error.code === "23505") {
      throw new Error("Friend request already sent.");
    }
    throw error;
  }
  return data;
}

/**
 * @param {string} requestId
 */
export async function acceptFriendRequest(requestId) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) throw new Error("Sign in to accept friend requests.");
  const { error } = await sb.rpc("accept_friend_request", { request_id: requestId });
  if (error) {
    if (isMissingTableOrRpcError(error)) {
      throw new Error(friendRequestsUnavailableMessage());
    }
    throw error;
  }
}

/**
 * @param {string} requestId
 */
export async function declineFriendRequest(requestId) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) throw new Error("Sign in to decline friend requests.");
  const { error } = await sb
    .from("friend_requests")
    .update({ status: "declined", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("to_user_id", user.id)
    .eq("status", "pending");
  if (error) {
    if (isMissingTableOrRpcError(error)) {
      throw new Error(friendRequestsUnavailableMessage());
    }
    throw error;
  }
}

/**
 * @param {string} requestId
 */
export async function cancelFriendRequest(requestId) {
  const sb = getSupabase();
  const user = getCurrentUser();
  if (!sb || !user) throw new Error("Sign in to cancel friend requests.");
  const { error } = await sb
    .from("friend_requests")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("from_user_id", user.id)
    .eq("status", "pending");
  if (error) {
    if (isMissingTableOrRpcError(error)) {
      throw new Error(friendRequestsUnavailableMessage());
    }
    throw error;
  }
}