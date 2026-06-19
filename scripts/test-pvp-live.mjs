#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { DECK_SIZE } from "../js/cardCatalog.js";

const url = "https://xhoskftcrgbsjkmzjscw.supabase.co";
const key = "sb_publishable_7AI9vdLLVGjrq_q98gYm7A_-tI7S6Si";
const pass = "TestPass123!xyz";
const deck = Array(DECK_SIZE).fill("bomb");

const sb = createClient(url, key);
const ts = Date.now();
const emailA = `pvpa${ts}@example.com`;
const emailB = `pvpb${ts}@example.com`;

const a = await sb.auth.signUp({ email: emailA, password: pass });
console.log("signup A:", a.error?.message || "ok", !!a.data.session);
if (!a.data.session) {
  console.log("No instant session (email confirm may be required)");
  process.exit(0);
}

const sbA = createClient(url, key);
await sbA.auth.setSession(a.data.session);

const code = "T" + String(ts).slice(-5);
const { data: room, error: cErr } = await sbA.from("pvp_matches").insert({
  code,
  host_id: a.data.user.id,
  host_deck_ids: deck,
  host_display_name: "Host",
  status: "waiting",
}).select().single();
console.log("create:", cErr?.message || room.code);

const b = await sb.auth.signUp({ email: emailB, password: pass });
if (!b.data.session) {
  console.log("B no session");
  process.exit(0);
}
const sbB = createClient(url, key);
await sbB.auth.setSession(b.data.session);

const { data: find, error: fErr } = await sbB
  .from("pvp_matches")
  .select("id,code")
  .eq("code", code)
  .maybeSingle();
console.log("B direct find:", fErr?.message || find || "BLOCKED");

const rpcFind = await sbB.rpc("pvp_find_waiting_room");
console.log("B rpc find:", rpcFind.error?.code, rpcFind.error?.message || rpcFind.data || "ok");

const rpcJoin = await sbB.rpc("pvp_join_by_code", {
  room_code: code,
  guest_deck_ids: deck,
  guest_display_name: "Guest",
  state_json: null,
});
console.log("B rpc join:", rpcJoin.error?.code, rpcJoin.error?.message || (rpcJoin.data ? `joined ${rpcJoin.data.status}` : "fail"));

if (room?.id) await sbA.from("pvp_matches").delete().eq("id", room.id);
