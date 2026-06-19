#!/usr/bin/env node
/**
 * Apply supabase/grant_user_goomba.sql to the live Supabase project.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role).
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... node scripts/grant-user-goomba.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = "https://xhoskftcrgbsjkmzjscw.supabase.co";
const USERNAME = "goomba";
const GEMS = 10000;
const LEVEL_COUNT = 50;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_KEY;

function buildAdventurePatch(existing = {}) {
  const cleared = {};
  const stars = {};
  for (let i = 1; i <= LEVEL_COUNT; i++) {
    const key = String(i);
    cleared[key] = true;
    stars[key] = 3;
  }
  return {
    ...existing,
    highestUnlocked: LEVEL_COUNT,
    cleared,
    stars,
  };
}

async function patchViaRest(profileJson) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?username=ilike.${encodeURIComponent(USERNAME)}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        profile_json: profileJson,
        updated_at: new Date().toISOString(),
      }),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Profile update failed (${response.status}): ${text}`);
  }
  return JSON.parse(text || "[]");
}

async function main() {
  if (!serviceRoleKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY.");
    console.error("Run supabase/grant_user_goomba.sql in the Supabase SQL Editor instead.");
    process.exit(1);
  }

  const lookup = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?username=ilike.${encodeURIComponent(USERNAME)}&select=id,username,profile_json`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );
  const rows = await lookup.json();
  if (!lookup.ok) {
    throw new Error(`Profile lookup failed (${lookup.status}): ${JSON.stringify(rows)}`);
  }
  if (!rows.length) {
    throw new Error(`No profile found for username "${USERNAME}".`);
  }

  const row = rows[0];
  const current = row.profile_json && typeof row.profile_json === "object" ? row.profile_json : {};
  const next = {
    ...current,
    gems: GEMS,
    savedAt: Date.now(),
    adventure: buildAdventurePatch(current.adventure),
  };

  const updated = await patchViaRest(next);
  const result = updated[0];
  const clearedCount = Object.keys(result?.profile_json?.adventure?.cleared || {}).length;

  console.log(
    JSON.stringify(
      {
        username: result?.username,
        gems: result?.profile_json?.gems,
        clearedCount,
        sqlFile: join(__dirname, "../supabase/grant_user_goomba.sql"),
      },
      null,
      2
    )
  );

  if (result?.profile_json?.gems !== GEMS || clearedCount !== LEVEL_COUNT) {
    throw new Error("Update did not apply expected gems/adventure progress.");
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
