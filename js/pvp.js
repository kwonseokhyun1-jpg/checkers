import { getSupabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { COLORS, createInitialBoard } from "./board.js";
import { createMatchState } from "./match.js";
import { DECK_SIZE } from "./cardCatalog.js";


function isMissingRpc(error) {
  const code = error?.code || "";
  const msg = String(error?.message || "");
  return code === "PGRST202" || msg.includes("Could not find the function");
}

/** Bumped when the client should run a one-time global waiting-room reset. */
export const PVP_WAITING_RESET_KEY = "pvp_waiting_reset_v3";

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function serializeMatchState(state) {
  return JSON.parse(JSON.stringify(state));
}

export class PvpService {
  constructor() {
    this.matchId = null;
    this.channel = null;
    this.role = null; // 'host' | 'guest'
    this.localColor = COLORS.RED;
    this.onMatchRow = null;
    this.onError = null;
    this._lastVersion = -1;
    this._pollId = null;
  }

  stopPolling() {
    if (this._pollId) {
      clearInterval(this._pollId);
      this._pollId = null;
    }
  }

  startPolling(intervalMs = 2500) {
    this.stopPolling();
    if (!this.matchId) return;
    const tick = async () => {
      if (!this.matchId) return;
      try {
        const row = await this.fetchMatch(this.matchId);
        if (row) this.onMatchRow?.(row);
      } catch (e) {
        this.onError?.(e);
      }
    };
    this._pollId = setInterval(tick, intervalMs);
    void tick();
  }

  dispose() {
    this.stopPolling();
    if (this.channel) {
      getSupabase()?.removeChannel(this.channel);
      this.channel = null;
    }
    this.matchId = null;
  }

  async createRoom(hostDeckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    if (!Array.isArray(hostDeckIds) || hostDeckIds.length !== DECK_SIZE) {
      throw new Error("Select a valid 30-card deck first");
    }

    let code = randomCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await sb
        .from("pvp_matches")
        .insert({
          code,
          host_id: user.id,
          host_deck_ids: hostDeckIds,
          host_display_name: displayName,
          status: "waiting",
        })
        .select()
        .single();
      if (!error) {
        this.matchId = data.id;
        this.role = "host";
        this.localColor = COLORS.RED;
        this.subscribe(data.id);
        return data;
      }
      if (error.code !== "23505") throw error;
      code = randomCode();
    }
    throw new Error("Could not create room — try again");
  }

  async listMyWaitingRooms() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) return [];

    const { data, error } = await sb
      .from("pvp_matches")
      .select("id, host_id, host_display_name, created_at, status, guest_id")
      .eq("host_id", user.id)
      .eq("status", "waiting")
      .is("guest_id", null)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async listOthersWaitingRooms() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) return [];

    const { data, error } = await sb
      .from("pvp_matches")
      .select("id, host_id, host_display_name, created_at, status, guest_id")
      .eq("status", "waiting")
      .is("guest_id", null)
      .neq("host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;
    return data || [];
  }

  /** @deprecated use listMyWaitingRooms + listOthersWaitingRooms */
  async listOpenRooms() {
    const [mine, others] = await Promise.all([
      this.listMyWaitingRooms(),
      this.listOthersWaitingRooms(),
    ]);
    return [...mine, ...others];
  }

  async joinRoomById(matchId, guestDeckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    const { data: row, error: findErr } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("id", matchId)
      .eq("status", "waiting")
      .is("guest_id", null)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!row) throw new Error("That room is no longer available.");
    if (row.host_id === user.id) throw new Error("You cannot join your own room");

    return this.joinWaitingRow(row, guestDeckIds, displayName);
  }

  async joinRoom(code, guestDeckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    if (!Array.isArray(guestDeckIds) || guestDeckIds.length !== DECK_SIZE) {
      throw new Error("Select a valid 30-card deck first");
    }

    const normalized = code.trim().toUpperCase();
    let data = null;

    const rpc = await sb.rpc("pvp_join_by_code", {
      room_code: normalized,
      guest_deck_ids: guestDeckIds,
      guest_display_name: displayName,
      state_json: null,
    });

    if (!rpc.error && rpc.data) {
      data = rpc.data;
    } else if (rpc.error && !isMissingRpc(rpc.error)) {
      throw rpc.error;
    } else {
      const { data: row, error: findErr } = await sb
        .from("pvp_matches")
        .select("*")
        .eq("code", normalized)
        .eq("status", "waiting")
        .is("guest_id", null)
        .maybeSingle();

      if (findErr) throw findErr;
      if (!row) throw new Error("Room not found or already full.");
      if (row.host_id === user.id) throw new Error("You cannot join your own room");

      const { data: updated, error } = await sb
        .from("pvp_matches")
        .update({
          guest_id: user.id,
          guest_deck_ids: guestDeckIds,
          guest_display_name: displayName,
          status: "active",
          turn: COLORS.RED,
          version: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("status", "waiting")
        .select()
        .single();

      if (error) throw error;
      data = updated;
    }

    return this.finalizeGuestJoin(data, guestDeckIds);
  }

  async joinWaitingRow(row, guestDeckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    if (!Array.isArray(guestDeckIds) || guestDeckIds.length !== DECK_SIZE) {
      throw new Error("Select a valid 30-card deck first");
    }

    const rpc = await sb.rpc("pvp_join_by_code", {
      room_code: row.code,
      guest_deck_ids: guestDeckIds,
      guest_display_name: displayName,
      state_json: null,
    });

    let data = null;
    if (!rpc.error && rpc.data) {
      data = rpc.data;
    } else if (rpc.error && !isMissingRpc(rpc.error)) {
      throw rpc.error;
    } else {
      const { data: updated, error } = await sb
        .from("pvp_matches")
        .update({
          guest_id: user.id,
          guest_deck_ids: guestDeckIds,
          guest_display_name: displayName,
          status: "active",
          turn: COLORS.RED,
          version: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("status", "waiting")
        .select()
        .single();

      if (error) throw error;
      data = updated;
    }

    return this.finalizeGuestJoin(data, guestDeckIds);
  }

  async finalizeGuestJoin(data, guestDeckIds) {
    const sb = getSupabase();
    const state = createMatchState(data.host_deck_ids, guestDeckIds);
    state.turn = COLORS.RED;
    const stateJson = serializeMatchState(state);

    const { data: ready, error: stateErr } = await sb
      .from("pvp_matches")
      .update({
        state_json: stateJson,
        turn: COLORS.RED,
        version: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .select()
      .single();

    if (stateErr) throw stateErr;
    data = ready;

    this.matchId = data.id;
    this.role = "guest";
    this.localColor = COLORS.BLACK;
    this.subscribe(data.id);
    return data;
  }

  subscribe(matchId) {
    const sb = getSupabase();
    if (!sb) return;

    if (this.channel) sb.removeChannel(this.channel);

    this.channel = sb
      .channel(`pvp:${matchId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "pvp_matches", filter: `id=eq.${matchId}` },
        (payload) => {
          const row = payload.new;
          if (!row) return;
          const ver = row.version ?? 0;
          if (
            ver <= this._lastVersion &&
            payload.eventType !== "INSERT" &&
            row.status !== "finished"
          ) {
            return;
          }
          this.onMatchRow?.(row);
        }
      )
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        try {
          const row = await this.fetchMatch(matchId);
          if (row) this.onMatchRow?.(row);
        } catch (e) {
          this.onError?.(e);
        }
      });
  }

  async fetchMatch(matchId) {
    const sb = getSupabase();
    const { data, error } = await sb.from("pvp_matches").select("*").eq("id", matchId).single();
    if (error) throw error;
    return data;
  }

  async pushState(state, expectedVersion) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !this.matchId || !user) return;

    const nextVersion = (expectedVersion ?? this._lastVersion) + 1;
    const stateJson = serializeMatchState(state);

    const { data, error } = await sb
      .from("pvp_matches")
      .update({
        state_json: stateJson,
        turn: state.turn,
        version: nextVersion,
        updated_at: new Date().toISOString(),
      })
      .eq("id", this.matchId)
      .eq("version", expectedVersion ?? this._lastVersion)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const fresh = await this.fetchMatch(this.matchId);
        if (fresh) {
          this._lastVersion = fresh.version;
          this.onMatchRow?.(fresh);
        }
      } else {
        this.onError?.(error);
      }
      return null;
    }

    this._lastVersion = data.version;
    return data;
  }

  async finishMatch(winnerId) {
    const sb = getSupabase();
    if (!sb || !this.matchId) return;
    await sb
      .from("pvp_matches")
      .update({
        status: "finished",
        winner_id: winnerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", this.matchId);
  }

  async cancelRoom(matchId) {
    const sb = getSupabase();
    const user = getCurrentUser();
    const id = matchId || this.matchId;
    if (!sb || !user || !id) return;

    const rpc = await sb.rpc("pvp_cancel_room", { p_match_id: id });
    if (rpc.error && !isMissingRpc(rpc.error)) throw rpc.error;

    if (rpc.error && isMissingRpc(rpc.error)) {
      const { error } = await sb
        .from("pvp_matches")
        .delete()
        .eq("id", id)
        .eq("host_id", user.id)
        .eq("status", "waiting");
      if (error) throw error;
    }

    if (this.matchId === id) this.dispose();
  }

  async cancelWaitingRoom() {
    return this.cancelRoom(this.matchId);
  }
}

/** Delete every waiting room once per browser (after deploy / reset token bump). */
export async function clearAllWaitingRoomsOnce() {
  try {
    if (sessionStorage.getItem(PVP_WAITING_RESET_KEY)) return;
  } catch {
    return;
  }

  const sb = getSupabase();
  if (!sb) return;

  const { error } = await sb.rpc("pvp_clear_all_waiting_rooms");
  if (!error || isMissingRpc(error)) {
    try {
      sessionStorage.setItem(PVP_WAITING_RESET_KEY, "1");
    } catch {
      /* private mode */
    }
  }
}

/** Live updates for the open-rooms list in the PvP lobby. */
export function subscribeOpenRooms(onChange) {
  const sb = getSupabase();
  if (!sb) return () => {};

  const channel = sb
    .channel("pvp-open-rooms")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "pvp_matches" },
      () => onChange?.()
    )
    .subscribe();

  return () => {
    sb.removeChannel(channel);
  };
}

export async function probePvpBackend() {
  const sb = getSupabase();
  if (!sb) return { ok: false, reason: "Supabase not configured" };
  const { error } = await sb.rpc("pvp_find_waiting_room");
  if (error && isMissingRpc(error)) {
    // Join/quick match can still work via RLS after fix_pvp_rls.sql (SELECT policy only).
    return { ok: true, hint: "Optional: run supabase/fix_pvp_rls.sql for quick-match RPCs." };
  }
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
