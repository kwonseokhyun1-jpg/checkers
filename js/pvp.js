import { getSupabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { COLORS, createInitialBoard } from "./board.js";
import { createMatchState } from "./match.js";
import { DECK_SIZE } from "./cardCatalog.js";

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
  }

  dispose() {
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

  async joinRoom(code, guestDeckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    if (!Array.isArray(guestDeckIds) || guestDeckIds.length !== DECK_SIZE) {
      throw new Error("Select a valid 30-card deck first");
    }

    const normalized = code.trim().toUpperCase();
    const { data: row, error: findErr } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("code", normalized)
      .eq("status", "waiting")
      .is("guest_id", null)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!row) throw new Error("Room not found or already full");
    if (row.host_id === user.id) throw new Error("You cannot join your own room");

    const state = createMatchState(row.host_deck_ids, guestDeckIds);
    state.turn = COLORS.RED;
    const stateJson = serializeMatchState(state);

    const { data, error } = await sb
      .from("pvp_matches")
      .update({
        guest_id: user.id,
        guest_deck_ids: guestDeckIds,
        guest_display_name: displayName,
        status: "active",
        state_json: stateJson,
        turn: COLORS.RED,
        version: 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id)
      .eq("status", "waiting")
      .select()
      .single();

    if (error) throw error;

    this.matchId = data.id;
    this.role = "guest";
    this.localColor = COLORS.BLACK;
    this.subscribe(data.id);
    return data;
  }

  async findQuickMatch(deckIds, displayName) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    const { data: open } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("status", "waiting")
      .is("guest_id", null)
      .neq("host_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (open) return this.joinRoom(open.code, deckIds, displayName);
    return this.createRoom(deckIds, displayName);
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
          if (row.version <= this._lastVersion && payload.eventType !== "INSERT") return;
          this._lastVersion = row.version ?? 0;
          this.onMatchRow?.(row);
        }
      )
      .subscribe();
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

  async cancelWaitingRoom() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !this.matchId || !user) return;
    await sb.from("pvp_matches").delete().eq("id", this.matchId).eq("host_id", user.id).eq("status", "waiting");
    this.dispose();
  }
}
