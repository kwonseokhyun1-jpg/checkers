import { getSupabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { COLORS, createInitialBoard } from "./board.js";
import { createMatchState } from "./match.js";
import { DECK_SIZE } from "./cardCatalog.js";
import { buildMysteryDeck } from "./deckRules.js";
import {
  DEFAULT_PIECE_SKIN,
  SAME_PIECE_SKIN_JOIN_MESSAGE,
  effectiveHostPieceSkin,
  pieceSkinFromProfileRow,
  pieceSkinsConflict,
} from "./cosmetics.js";

export { formatPvpError } from "./pvpErrors.js";
import {
  PVP_ONE_ROOM_HOST_MESSAGE,
  resolveOpenRoomBlock,
  resolveJoinRoomBlock,
} from "./pvpErrors.js";

export {
  PVP_ONE_ROOM_HOST_MESSAGE,
  PVP_ACTIVE_MATCH_BLOCK_MESSAGE,
  PVP_JOIN_WHILE_HOSTING_MESSAGE,
  resolveOpenRoomBlock,
  resolveJoinRoomBlock,
} from "./pvpErrors.js";

export const PVP_MODE_NORMAL = "normal";
export const PVP_MODE_MYSTERY = "mystery";

export function isMysteryMode(row) {
  const mode = row?.match_mode ?? row?.mode;
  return mode === PVP_MODE_MYSTERY;
}


function isMissingRpc(error) {
  const code = error?.code || "";
  const msg = String(error?.message || "");
  return code === "PGRST202" || msg.includes("Could not find the function");
}

function isMissingColumnError(error, columnName) {
  const msg = String(error?.message || "");
  return (
    error?.code === "42703" ||
    error?.code === "PGRST204" ||
    msg.includes(`column pvp_matches.${columnName} does not exist`) ||
    msg.includes(`Could not find the '${columnName}' column`)
  );
}

function isRowNotFound(error) {
  return error?.code === "PGRST116";
}

/** PostgREST returns PGRST116 when `.single()` matches 0 or 2+ rows — use with `.maybeSingle()`. */
function unwrapMaybeSingle({ data, error }, fallbackMessage) {
  if (error && !isRowNotFound(error)) throw error;
  if (!data) throw new Error(fallbackMessage);
  return data;
}

/** null = unknown; true/false after first probe against live Supabase. */
let _pieceSkinColumnsAvailable = null;

const PVP_LIST_COLUMNS_BASE =
  "id, host_id, host_display_name, created_at, status, guest_id, match_mode";

async function probePieceSkinColumns(sb) {
  if (_pieceSkinColumnsAvailable !== null) return _pieceSkinColumnsAvailable;
  const { error } = await sb.from("pvp_matches").select("host_piece_skin").limit(0);
  if (!error) {
    _pieceSkinColumnsAvailable = true;
    return true;
  }
  if (isMissingColumnError(error, "host_piece_skin")) {
    _pieceSkinColumnsAvailable = false;
    return false;
  }
  _pieceSkinColumnsAvailable = true;
  return true;
}

function pvpListColumns(withSkins) {
  return withSkins ? `${PVP_LIST_COLUMNS_BASE}, host_piece_skin` : PVP_LIST_COLUMNS_BASE;
}

function normalizeRoomRow(row, withSkins) {
  if (withSkins) {
    return { ...row, host_piece_skin: row.host_piece_skin || DEFAULT_PIECE_SKIN };
  }
  return { ...row, host_piece_skin: DEFAULT_PIECE_SKIN };
}

const _profileSkinCache = new Map();
const PROFILE_SKIN_CACHE_MS = 60_000;

async function fetchProfilePieceSkins(sb, userIds) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (!uniqueIds.length) return new Map();

  const staleIds = uniqueIds.filter((id) => {
    const hit = _profileSkinCache.get(id);
    return !hit || Date.now() - hit.at > PROFILE_SKIN_CACHE_MS;
  });

  if (staleIds.length) {
    const { data, error } = await sb
      .from("profiles")
      .select("id, profile_json")
      .in("id", staleIds);

    if (error) throw error;

    for (const row of data || []) {
      _profileSkinCache.set(row.id, {
        skin: pieceSkinFromProfileRow(row),
        at: Date.now(),
      });
    }
  }

  const skins = new Map();
  for (const id of uniqueIds) {
    skins.set(id, _profileSkinCache.get(id)?.skin ?? DEFAULT_PIECE_SKIN);
  }
  return skins;
}

async function enrichRoomRowsWithHostSkins(sb, rows, withSkins) {
  const normalized = (rows || []).map((row) => normalizeRoomRow(row, withSkins));
  const profileHostIds = normalized
    .filter((row) => (row.host_piece_skin || DEFAULT_PIECE_SKIN) === DEFAULT_PIECE_SKIN)
    .map((row) => row.host_id);
  const profileSkins = await fetchProfilePieceSkins(sb, profileHostIds);

  return normalized.map((row) => {
    const stored = row.host_piece_skin || DEFAULT_PIECE_SKIN;
    if (stored !== DEFAULT_PIECE_SKIN) return row;
    const profileSkin = profileSkins.get(row.host_id);
    return {
      ...row,
      host_piece_skin: effectiveHostPieceSkin(stored, profileSkin),
    };
  });
}

function guestJoinUpdateFields(userId, guestDeckIds, displayName, guestPieceSkin, withSkins) {
  const fields = {
    guest_id: userId,
    guest_deck_ids: guestDeckIds,
    guest_display_name: displayName,
    status: "active",
    turn: COLORS.RED,
    version: 1,
    updated_at: new Date().toISOString(),
  };
  if (withSkins) fields.guest_piece_skin = guestPieceSkin;
  return fields;
}

/** Bumped when the client should run a one-time global waiting-room reset. */
export const PVP_WAITING_RESET_KEY = "pvp_waiting_reset_v3";

/** Fast path for reconnecting to an in-progress PvP match after refresh. */
export const PVP_ACTIVE_MATCH_KEY = "cc_pvp_active_match";

export function saveActivePvpMatchId(matchId) {
  if (!matchId) return;
  try {
    sessionStorage.setItem(PVP_ACTIVE_MATCH_KEY, JSON.stringify({ matchId, savedAt: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

export function readActivePvpMatchId() {
  try {
    const raw = sessionStorage.getItem(PVP_ACTIVE_MATCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.matchId || null;
  } catch {
    return null;
  }
}

export function clearActivePvpMatchId() {
  try {
    sessionStorage.removeItem(PVP_ACTIVE_MATCH_KEY);
  } catch {
    /* ignore */
  }
}

function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export function serializeMatchState(state) {
  return JSON.parse(JSON.stringify(state));
}

/** Stable key for deduping match rows — version alone is not enough (stale polls vs pushes). */
export function matchRowFingerprint(row) {
  if (!row?.state_json) return `v${row?.version ?? 0}|nostate`;
  const s = row.state_json;
  const seq = s.pvpSpellSeq ?? 0;
  const tr = s.turn ?? "";
  const red = s.turnNumber?.red ?? 0;
  const blk = s.turnNumber?.black ?? 0;
  const hist = s.moveHistory?.length ?? 0;
  return `v${row.version ?? 0}|${tr}|${seq}|${red}|${blk}|${hist}`;
}

export function shouldApplyPvpRow(row, pvpService, matchSession = null) {
  if (!row?.state_json) return false;
  if (row.status === "finished") return true;
  const ver = row.version ?? 0;
  const fp = matchRowFingerprint(row);
  if (fp === pvpService?._lastAppliedFingerprint) return false;
  if (matchSession?._syncBusy && ver < (pvpService?._lastVersion ?? 0)) return false;
  if (ver < (pvpService?._lastVersion ?? 0)) return false;
  return true;
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
    this._lastAppliedFingerprint = "";
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
    this.role = null;
  }

  /** Reconnect to an existing match row after refresh (host, guest, or waiting host). */
  attachToMatch(row, userId = getCurrentUser()?.id) {
    if (!row?.id || !userId) throw new Error("Cannot attach to match");
    if (row.host_id === userId) {
      this.role = "host";
      this.localColor = COLORS.RED;
    } else if (row.guest_id === userId) {
      this.role = "guest";
      this.localColor = COLORS.BLACK;
    } else {
      throw new Error("You are not a participant in this match");
    }
    this.matchId = row.id;
    this._lastVersion = row.version ?? -1;
    this._lastAppliedFingerprint = matchRowFingerprint(row);
    this.subscribe(row.id);
  }

  async listActiveMatchForUser() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) return null;

    const { data, error } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("status", "active")
      .or(`host_id.eq.${user.id},guest_id.eq.${user.id}`)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async assertCanOpenRoom() {
    const [waiting, active] = await Promise.all([
      this.listMyWaitingRooms(),
      this.listActiveMatchForUser(),
    ]);
    const block = resolveOpenRoomBlock({
      waitingCount: waiting.length,
      hasActiveMatch: !!active,
    });
    if (block) throw new Error(block);
  }

  async assertCanJoinRoom() {
    const [waiting, active] = await Promise.all([
      this.listMyWaitingRooms(),
      this.listActiveMatchForUser(),
    ]);
    const block = resolveJoinRoomBlock({
      waitingCount: waiting.length,
      hasActiveMatch: !!active,
    });
    if (block) throw new Error(block);
  }

  async createRoom(
    hostDeckIds,
    displayName,
    { matchMode = PVP_MODE_NORMAL, hostPieceSkin = DEFAULT_PIECE_SKIN } = {}
  ) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    const mystery = matchMode === PVP_MODE_MYSTERY;
    if (
      !mystery &&
      (!Array.isArray(hostDeckIds) || hostDeckIds.length !== DECK_SIZE)
    ) {
      throw new Error(`Your deck needs exactly ${DECK_SIZE} cards — open Decks and finish building it.`);
    }

    await this.assertCanOpenRoom();

    const withSkins = await probePieceSkinColumns(sb);
    let code = randomCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const row = {
        code,
        host_id: user.id,
        host_deck_ids: mystery ? null : hostDeckIds,
        host_display_name: displayName,
        status: "waiting",
        match_mode: mystery ? PVP_MODE_MYSTERY : PVP_MODE_NORMAL,
      };
      if (withSkins) row.host_piece_skin = hostPieceSkin || DEFAULT_PIECE_SKIN;

      const { data, error } = await sb.from("pvp_matches").insert(row).select().maybeSingle();
      if (!error && data) {
        this.matchId = data.id;
        this.role = "host";
        this.localColor = COLORS.RED;
        this.subscribe(data.id);
        return data;
      }
      if (error?.code !== "23505") {
        throw error || new Error("Could not create room — try again");
      }
      const existing = await this.listMyWaitingRooms();
      if (existing.length) throw new Error(PVP_ONE_ROOM_HOST_MESSAGE);
      code = randomCode();
    }
    throw new Error("Could not create room — try again");
  }

  async listMyWaitingRooms() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) return [];

    const withSkins = await probePieceSkinColumns(sb);
    const { data, error } = await sb
      .from("pvp_matches")
      .select(pvpListColumns(withSkins))
      .eq("host_id", user.id)
      .eq("status", "waiting")
      .is("guest_id", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
    return enrichRoomRowsWithHostSkins(sb, data, withSkins);
  }

  async listOthersWaitingRooms() {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) return [];

    const withSkins = await probePieceSkinColumns(sb);
    const { data, error } = await sb
      .from("pvp_matches")
      .select(pvpListColumns(withSkins))
      .eq("status", "waiting")
      .is("guest_id", null)
      .neq("host_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) throw error;
    return enrichRoomRowsWithHostSkins(sb, data, withSkins);
  }

  /** @deprecated use listMyWaitingRooms + listOthersWaitingRooms */
  async listOpenRooms() {
    const [mine, others] = await Promise.all([
      this.listMyWaitingRooms(),
      this.listOthersWaitingRooms(),
    ]);
    return [...mine, ...others];
  }

  async joinRoomById(matchId, guestDeckIds, displayName, { guestPieceSkin = DEFAULT_PIECE_SKIN } = {}) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    await this.assertCanJoinRoom();

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

    return this.joinWaitingRow(row, guestDeckIds, displayName, { guestPieceSkin });
  }

  assertDistinctPieceSkins(hostPieceSkin, guestPieceSkin) {
    if (pieceSkinsConflict(hostPieceSkin, guestPieceSkin)) {
      throw new Error(SAME_PIECE_SKIN_JOIN_MESSAGE);
    }
  }

  async resolveEffectiveHostPieceSkin(sb, row) {
    const stored = row?.host_piece_skin || DEFAULT_PIECE_SKIN;
    if (stored !== DEFAULT_PIECE_SKIN) return stored;

    const skins = await fetchProfilePieceSkins(sb, [row?.host_id]);
    const profileSkin = skins.get(row?.host_id);
    return effectiveHostPieceSkin(stored, profileSkin);
  }

  async joinRoom(code, guestDeckIds, displayName, { guestPieceSkin = DEFAULT_PIECE_SKIN } = {}) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    await this.assertCanJoinRoom();

    const normalized = code.trim().toUpperCase();

    const { data: waitingRow, error: findErr } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("code", normalized)
      .eq("status", "waiting")
      .is("guest_id", null)
      .maybeSingle();

    if (findErr) throw findErr;
    if (!waitingRow) throw new Error("Room not found or already full.");
    if (waitingRow.host_id === user.id) throw new Error("You cannot join your own room");

    return this.joinWaitingRow(waitingRow, guestDeckIds, displayName, { guestPieceSkin });
  }

  async joinWaitingRow(row, guestDeckIds, displayName, { guestPieceSkin = DEFAULT_PIECE_SKIN } = {}) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    const { data: freshRow, error: freshErr } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("id", row.id)
      .maybeSingle();
    if (freshErr) throw freshErr;
    if (freshRow) row = freshRow;

    const withSkins = await probePieceSkinColumns(sb);
    const mystery = isMysteryMode(row);
    const resolvedHostSkin = await this.resolveEffectiveHostPieceSkin(sb, row);
    row = { ...row, host_piece_skin: resolvedHostSkin };
    this.assertDistinctPieceSkins(resolvedHostSkin, guestPieceSkin);
    if (mystery) {
      return this.joinMysteryRow(row, displayName, { guestPieceSkin, withSkins, guestMainDeckIds: guestDeckIds });
    }

    if (!Array.isArray(guestDeckIds) || guestDeckIds.length !== DECK_SIZE) {
      throw new Error(`Your deck needs exactly ${DECK_SIZE} cards — open Decks and finish building it.`);
    }

    const rpcArgs = {
      room_code: row.code,
      guest_deck_ids: guestDeckIds,
      guest_display_name: displayName,
      state_json: null,
    };
    if (withSkins) rpcArgs.guest_piece_skin = guestPieceSkin;

    const rpc = await sb.rpc("pvp_join_by_code", rpcArgs);

    let data = null;
    if (!rpc.error && rpc.data) {
      data = rpc.data;
    } else if (rpc.error && !isMissingRpc(rpc.error)) {
      throw rpc.error;
    } else {
      const result = await sb
        .from("pvp_matches")
        .update(guestJoinUpdateFields(user.id, guestDeckIds, displayName, guestPieceSkin, withSkins))
        .eq("id", row.id)
        .eq("status", "waiting")
        .is("guest_id", null)
        .select()
        .maybeSingle();

      data = unwrapMaybeSingle(result, "That room was just taken by another player.");
    }

    return this.finalizeGuestJoin(data, guestDeckIds);
  }

  async joinMysteryRow(
    row,
    displayName,
    { guestPieceSkin = DEFAULT_PIECE_SKIN, withSkins = null, guestMainDeckIds = null } = {}
  ) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !user) throw new Error("Sign in to play PvP");

    const skinsEnabled = withSkins ?? (await probePieceSkinColumns(sb));
    const resolvedHostSkin = await this.resolveEffectiveHostPieceSkin(sb, row);
    this.assertDistinctPieceSkins(resolvedHostSkin, guestPieceSkin);

    const hostDeckIds = buildMysteryDeck();
    const guestDeckIds = buildMysteryDeck(
      Array.isArray(guestMainDeckIds) && guestMainDeckIds.length === DECK_SIZE
        ? { excludeDeckIds: guestMainDeckIds }
        : {}
    );
    const state = createMatchState(hostDeckIds, guestDeckIds);
    state.turn = COLORS.RED;
    const stateJson = serializeMatchState(state);

    const updateFields = {
      guest_id: user.id,
      guest_deck_ids: guestDeckIds,
      host_deck_ids: hostDeckIds,
      guest_display_name: displayName,
      status: "active",
      state_json: stateJson,
      turn: COLORS.RED,
      version: 1,
      updated_at: new Date().toISOString(),
    };
    if (skinsEnabled) updateFields.guest_piece_skin = guestPieceSkin;

    const data = unwrapMaybeSingle(
      await sb
        .from("pvp_matches")
        .update(updateFields)
        .eq("id", row.id)
        .eq("status", "waiting")
        .is("guest_id", null)
        .select()
        .maybeSingle(),
      "That room was just taken by another player."
    );

    this.matchId = data.id;
    this.role = "guest";
    this.localColor = COLORS.BLACK;
    this.subscribe(data.id);
    return data;
  }

  async finalizeGuestJoin(data, guestDeckIds) {
    const sb = getSupabase();
    const mystery = isMysteryMode(data);
    const hostDeckIds = mystery ? buildMysteryDeck() : data.host_deck_ids;
    const resolvedGuestDeckIds = mystery
      ? buildMysteryDeck(
          Array.isArray(guestDeckIds) && guestDeckIds.length === DECK_SIZE
            ? { excludeDeckIds: guestDeckIds }
            : {}
        )
      : guestDeckIds;
    const state = createMatchState(hostDeckIds, resolvedGuestDeckIds);
    state.turn = COLORS.RED;
    const stateJson = serializeMatchState(state);

    const updatePayload = {
      state_json: stateJson,
      turn: COLORS.RED,
      version: 1,
      updated_at: new Date().toISOString(),
    };
    if (mystery) {
      updatePayload.host_deck_ids = hostDeckIds;
      updatePayload.guest_deck_ids = resolvedGuestDeckIds;
    }

    data = unwrapMaybeSingle(
      await sb
        .from("pvp_matches")
        .update(updatePayload)
        .eq("id", data.id)
        .select()
        .maybeSingle(),
      "Could not start the match — try joining again."
    );

    this.matchId = data.id;
    this.role = "guest";
    this.localColor = COLORS.BLACK;
    this.subscribe(data.id);
    return data;
  }

  _deliverMatchRow(row) {
    if (!row) return;
    this.onMatchRow?.(row);
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
          if (row.status === "active" || row.status === "finished") {
            void this.fetchMatch(matchId)
              .then((full) => this._deliverMatchRow(full))
              .catch((e) => this.onError?.(e));
            return;
          }
          this._deliverMatchRow(row);
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
    const { data, error } = await sb
      .from("pvp_matches")
      .select("*")
      .eq("id", matchId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async _reconcileFromServer() {
    const fresh = await this.fetchMatch(this.matchId);
    if (fresh) {
      this._lastVersion = fresh.version ?? this._lastVersion;
      this.onMatchRow?.(fresh);
    }
    return fresh;
  }

  async pushState(state, expectedVersion, { retry = true } = {}) {
    const sb = getSupabase();
    const user = getCurrentUser();
    if (!sb || !this.matchId || !user) return null;

    const baseVersion = expectedVersion ?? this._lastVersion;
    const nextVersion = baseVersion + 1;
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
      .eq("version", baseVersion)
      .select()
      .maybeSingle();

    if (error) {
      this.onError?.(error);
      return null;
    }

    if (!data) {
      const fresh = await this._reconcileFromServer();
      if (retry && fresh) {
        const latest = fresh.version ?? this._lastVersion;
        if (latest > baseVersion) {
          this._lastVersion = latest;
          return this.pushState(state, latest, { retry: false });
        }
      }
      return null;
    }

    this._lastVersion = data.version;
    this._lastAppliedFingerprint = matchRowFingerprint(data);
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
      .eq("id", this.matchId)
      .eq("status", "active");
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
      {
        event: "*",
        schema: "public",
        table: "pvp_matches",
        filter: "status=eq.waiting",
      },
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

  const withSkins = await probePieceSkinColumns(sb);
  const hints = [];
  if (!withSkins) {
    hints.push(
      "Run supabase/migration_pvp_piece_skin.sql (or fix_pvp_rls.sql) in the SQL Editor for custom piece skins in PvP."
    );
  }

  const { error } = await sb.rpc("pvp_find_waiting_room");
  if (error && isMissingRpc(error)) {
    hints.push("Optional: run supabase/fix_pvp_rls.sql for quick-match RPCs.");
    return { ok: true, hint: hints.join(" "), legacySchema: !withSkins };
  }
  if (error) return { ok: false, reason: error.message };
  return hints.length ? { ok: true, hint: hints.join(" "), legacySchema: !withSkins } : { ok: true };
}
