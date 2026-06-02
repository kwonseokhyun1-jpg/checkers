import { getSupabase, isSupabaseConfigured } from "./supabaseClient.js";

/** @type {import('@supabase/supabase-js').User | null} */
let currentUser = null;
const listeners = new Set();

export function isAuthAvailable() {
  return isSupabaseConfigured();
}

export function getCurrentUser() {
  return currentUser;
}

export function onAuthChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  for (const fn of listeners) fn(currentUser);
}

export async function initAuth() {
  const sb = getSupabase();
  if (!sb) return null;

  const { data } = await sb.auth.getSession();
  currentUser = data.session?.user ?? null;
  notify();

  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    notify();
  });

  return currentUser;
}

export async function isUsernameAvailable(username) {
  const sb = getSupabase();
  if (!sb) return true;
  const name = String(username || "").trim();
  if (!name) return false;

  const { data, error } = await sb.rpc("username_is_available", { name });
  if (!error && typeof data === "boolean") return data;

  const { data: row, error: qErr } = await sb
    .from("profiles")
    .select("id")
    .ilike("username", name)
    .maybeSingle();
  if (qErr) throw qErr;
  return !row;
}

export async function signUp(email, password, displayName, username) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add your anon key to js/supabaseConfig.js");

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    throw new Error("Sign up requires a valid email address.");
  }

  const { data, error } = await sb.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        display_name: displayName || normalizedEmail.split("@")[0],
        username: username || displayName || normalizedEmail.split("@")[0],
      },
    },
  });
  if (error) throw error;

  if (data.session?.user) {
    currentUser = data.session.user;
    notify();
  }

  return data;
}

function isMissingRpcError(error) {
  const code = error?.code || error?.details?.code;
  const msg = String(error?.message || "");
  return code === "PGRST202" || msg.includes("email_for_login") || msg.includes("Could not find the function");
}

/** @param {Record<string, unknown> | null | undefined} profileJson */
function loginEmailFromProfileJson(profileJson) {
  if (!profileJson || typeof profileJson !== "object") return null;
  const email = profileJson.loginEmail || profileJson.login_email;
  return typeof email === "string" && email.includes("@") ? email.trim().toLowerCase() : null;
}

async function resolveLoginEmailFromProfile(username) {
  const sb = getSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("profiles")
    .select("profile_json")
    .ilike("username", username)
    .maybeSingle();

  if (error) throw error;
  return loginEmailFromProfileJson(data?.profile_json);
}

export async function resolveLoginEmail(identifier) {
  const trimmed = String(identifier || "").trim();
  if (!trimmed) throw new Error("Enter your username or email.");
  if (trimmed.includes("@")) return trimmed.toLowerCase();

  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured.");

  const { data, error } = await sb.rpc("email_for_login", { identifier: trimmed });
  if (!error && data) return String(data).toLowerCase();
  if (error && !isMissingRpcError(error)) throw error;

  const fromProfile = await resolveLoginEmailFromProfile(trimmed);
  if (fromProfile) return fromProfile;

  if (error && isMissingRpcError(error)) {
    throw new Error(
      "Unknown username. Sign in with your email once, or ask the host to run supabase/schema.sql in the Supabase SQL Editor."
    );
  }

  throw new Error("Unknown username or email.");
}

export async function signIn(identifier, password) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add your anon key to js/supabaseConfig.js");

  const email = await resolveLoginEmail(identifier);
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;

  if (data.session?.user) {
    currentUser = data.session.user;
    notify();
    await backfillLoginEmail(data.session.user.id, email);
  }

  return data;
}

async function backfillLoginEmail(userId, email) {
  const sb = getSupabase();
  if (!sb || !userId || !email) return;

  try {
    const row = await fetchProfileRow(userId);
    const json = row?.profile_json && typeof row.profile_json === "object" ? { ...row.profile_json } : {};
    if (loginEmailFromProfileJson(json) === email.toLowerCase()) return;

    json.loginEmail = email.toLowerCase();
    await upsertProfileRow(userId, { profile_json: json });
  } catch (e) {
    console.warn("Could not backfill login email on profile", e);
  }
}

export async function signOut() {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
  currentUser = null;
  notify();
}

export async function fetchProfileRow(userId) {
  const sb = getSupabase();
  if (!sb || !userId) return null;
  const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfileRow(userId, patch) {
  const sb = getSupabase();
  if (!sb || !userId) return null;
  const { data, error } = await sb
    .from("profiles")
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}
