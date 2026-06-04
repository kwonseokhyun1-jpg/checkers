# Supabase setup (auth + PvP)

Project: **xhoskftcrgbsjkmzjscw**  
Dashboard: https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api

## 1. Run database schema

1. Open [SQL Editor](https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new)
2. Paste and run the contents of `supabase/schema.sql`

This creates `profiles` and `pvp_matches` tables, RLS policies, and enables Realtime on `pvp_matches`.

Run `supabase/backfill_login_emails.sql` once so username sign-in works for existing accounts.

If sign-up shows **"Database error saving new user"**, run `supabase/fix_signup_trigger.sql` in the same SQL Editor (updates the auth trigger and username check RPC).

## 2. Enable Email auth

1. [Authentication → Providers](https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/auth/providers)
2. Ensure **Email** is enabled
3. For testing you may disable “Confirm email” under Email settings

## 3. Add API keys to the game

1. Open [API settings](https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api)
2. Copy the **Project URL** and **anon public** key
3. Edit `js/supabaseConfig.js`:

```javascript
export const SUPABASE_URL = "https://xhoskftcrgbsjkmzjscw.supabase.co";
export const SUPABASE_ANON_KEY = "eyJ..."; // your anon key
```

The anon key is safe to embed in a browser client when RLS is enabled (as in `schema.sql`).

## 4. Realtime

In [Database → Publications](https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/database/publications), confirm `pvp_matches` is in the `supabase_realtime` publication (the schema script adds it).

## Features

| Feature | Description |
|---------|-------------|
| **Sign up / Sign in** | Header button; profile saved to `profiles.profile_json` |
| **Cloud save** | Local profile syncs to Supabase when signed in |
| **PvP tab** | Host an open room or join any room listed under Open rooms |
| **1v1** | Host plays red, guest plays black; state synced via Realtime |

## GitHub Pages deploy

Commit `js/supabaseConfig.js` with your anon key, or inject it in CI from a repository secret before deploy.


## PvP rooms not working

Run `supabase/fix_pvp_rls.sql` in the [SQL Editor](https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/sql/new). This fixes row-level security so players can find/join waiting rooms and adds join/cancel/clear RPCs.

To grant **+1000 gems** to every signed-in player once, run `supabase/grant_gems_1000.sql` in the same SQL Editor.

To delete every open waiting room immediately, run `supabase/clear_waiting_pvp_rooms.sql` in the same editor.
