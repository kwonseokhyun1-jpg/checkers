import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const dest = resolve(root, "dist/assets");

if (existsSync(dest)) rmSync(dest, { recursive: true });
cpSync(resolve(root, "assets"), dest, { recursive: true });

const supabaseDest = resolve(root, "dist/supabase");
if (existsSync(supabaseDest)) rmSync(supabaseDest, { recursive: true });
cpSync(resolve(root, "supabase"), supabaseDest, { recursive: true });

console.log("Copied game assets and supabase into dist/");
