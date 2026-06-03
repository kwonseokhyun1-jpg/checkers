import { getSupabase, isSupabaseConfigured } from "./supabaseClient.js";

/** @type {import('@supabase/supabase-js').User | null} */
let currentUser = null;
let authListenerBound = false;
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

  if (!authListenerBound) {
    authListenerBound = true;
    sb.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ?? null;
      notify();
    });
  }

  return currentUser;
}

export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,24}$/;

export function validateUsernameFormat(username) {
  const name = String(username || "").trim();
  if (!USERNAME_PATTERN.test(name)) {
    return "Username must be 3–24 letters, numbers, or underscore.";
  }
  return null;
}

export async function isUsernameAvailable(username) {
  return isUsernameAvailableForUser(username, null);
}

/** @param {string | null} exceptUserId — current user may keep their own name */
export async function isUsernameAvailableForUser(username, exceptUserId) {
  const sb = getSupabase();
  if (!sb) return true;
  const name = String(username || "").trim();
  if (!name) return false;

  const { data, error } = await sb.rpc("username_is_available", { name });
  if (!error && typeof data === "boolean") {
    if (data) return true;
    if (!exceptUserId) return false;
  }

  const { data: row, error: qErr } = await sb
    .from("profiles")
    .select("id")
    .ilike("username", name)
    .maybeSingle();
  if (qErr) throw qErr;
  if (!row) return true;
  return exceptUserId != null && row.id === exceptUserId;
}

export async function updateUsername(newUsername) {
  const user = getCurrentUser();
  if (!user) throw new Error("Sign in to change your username.");

  const name = String(newUsername || "").trim();
  const formatErr = validateUsernameFormat(name);
  if (formatErr) throw new Error(formatErr);

  if (!(await isUsernameAvailableForUser(name, user.id))) {
    throw new Error("That username is already taken.");
  }

  await upsertProfileRow(user.id, {
    username: name,
    display_name: name,
  });
  return name;
}


export async function suggestAvailableUsername(base, maxTries = 8) {
  const root = String(base || "").trim().replace(/[^A-Za-z0-9_]/g, "").slice(0, 20);
  if (!root || root.length < 3) return null;
  const candidates = [root];
  for (let i = 2; i <= maxTries; i += 1) candidates.push(`${root}${i}`);
  for (const name of candidates) {
    if (name.length > 24) continue;
    if (await isUsernameAvailable(name)) return name;
  }
  const suffix = String(Date.now()).slice(-5);
  const fallback = `${root.slice(0, 18)}_${suffix}`.slice(0, 24);
  return (await isUsernameAvailable(fallback)) ? fallback : null;
}

export async function signUp(email, password, displayName, username) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add your anon key to js/supabaseConfig.js");

  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail.includes("@")) {
    throw new Error("Sign up requires a valid email address.");
  }

  // Do not pass username in auth metadata — the DB trigger inserts profiles and
  // fails the whole signup on duplicate usernames. We set username after sign-up.
  const { data, error } = await sb.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        display_name: displayName || normalizedEmail.split("@")[0],
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

  const { data: knownUser } = await sb
    .from("profiles")
    .select("id")
    .ilike("username", trimmed)
    .maybeSingle();
  if (knownUser?.id) {
    throw new Error(
      "That username exists — sign in with your email address once. After that, username sign-in will work."
    );
  }

  if (error && isMissingRpcError(error)) {
    throw new Error(
      "Unknown username. Sign in with your email address, or ask the host to run supabase/backfill_login_emails.sql in Supabase."
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
