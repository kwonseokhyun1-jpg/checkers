#!/usr/bin/env node
/**
 * Simulates two-player move sync and room cancel/join races.
 * Usage: node scripts/test-pvp-sync.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = "https://xhoskftcrgbsjkmzjscw.supabase.co";
const key = "sb_publishable_7AI9vdLLVGjrq_q98gYm7A_-tI7S6Si";
const pass = "TestPass123!xyz";
const deck = Array(30).fill("bomb");

function clientFor(session) {
  const sb = createClient(url, key);
  return sb.auth.setSession(session).then(() => sb);
}

async function signUp(label) {
  const sb = createClient(url, key);
  const email = `${label}${Date.now()}@example.com`;
  const { data, error } = await sb.auth.signUp({ email, password: pass });
  if (error || !data.session) throw new Error(`signup ${label}: ${error?.message || "no session"}`);
  return { user: data.user, sb: await clientFor(data.session) };
}

function minimalState(turn = "red") {
  return { turn, phase: "cards", version: 1, board: [], meta: {} };
}

async function main() {
  const host = await signUp("host");
  const guest = await signUp("guest");

  const code = "S" + String(Date.now()).slice(-5);
  const { data: room, error: createErr } = await host.sb
    .from("pvp_matches")
    .insert({
      code,
      host_id: host.user.id,
      host_deck_ids: deck,
      host_display_name: "Host",
      status: "waiting",
    })
    .select()
    .single();
  if (createErr) throw createErr;

  const join = await guest.sb.rpc("pvp_join_by_code", {
    room_code: code,
    guest_deck_ids: deck,
    guest_display_name: "Guest",
    state_json: null,
  });
  if (join.error) throw join.error;

  const matchId = room.id;
  const state = minimalState("red");

  const v1 = await host.sb
    .from("pvp_matches")
    .update({ state_json: state, turn: "red", version: 1 })
    .eq("id", matchId)
    .select()
    .maybeSingle();
  if (!v1.data) throw new Error("host init state failed");

  const stale = await guest.sb
    .from("pvp_matches")
    .update({ state_json: { ...state, turn: "black" }, turn: "black", version: 2 })
    .eq("id", matchId)
    .eq("version", 0)
    .select()
    .maybeSingle();
  if (stale.data) throw new Error("stale version should not apply");
  console.log("stale push rejected:", stale.data === null);

  const guestMove = await guest.sb
    .from("pvp_matches")
    .update({
      state_json: { ...state, turn: "black" },
      turn: "black",
      version: 2,
    })
    .eq("id", matchId)
    .eq("version", 1)
    .select()
    .maybeSingle();
  if (!guestMove.data) throw new Error("guest move failed");
  console.log("guest move ok, version", guestMove.data.version);

  const { data: fresh } = await host.sb.from("pvp_matches").select("*").eq("id", matchId).maybeSingle();
  console.log("host sees turn:", fresh.turn, "version:", fresh.version);

  const cancel = await host.sb.rpc("pvp_cancel_room", { p_match_id: matchId });
  console.log("cancel active room (expect error):", cancel.error?.message || "unexpected ok");

  const code2 = "T" + String(Date.now()).slice(-5);
  const { data: room2 } = await host.sb
    .from("pvp_matches")
    .insert({
      code: code2,
      host_id: host.user.id,
      host_deck_ids: deck,
      host_display_name: "Host",
      status: "waiting",
    })
    .select()
    .single();

  await host.sb.rpc("pvp_cancel_room", { p_match_id: room2.id });
  const gone = await guest.sb.from("pvp_matches").select("id").eq("id", room2.id).maybeSingle();
  console.log("cancelled room visible to guest:", gone.data === null ? "no (good)" : "yes");

  await host.sb.from("pvp_matches").delete().eq("id", matchId);
  console.log("all sync tests passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
