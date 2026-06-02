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

export async function signUp(email, password, displayName) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add your anon key to js/supabaseConfig.js");

  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || email.split("@")[0] },
    },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Add your anon key to js/supabaseConfig.js");

  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
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
