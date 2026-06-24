/**
 * Screen orientation — portrait on menus, unlock during match (Capacitor).
 */

let screenOrientation = null;
let native = false;
let ready = false;

async function ensurePlugin() {
  if (ready) return screenOrientation;
  ready = true;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return null;
    native = true;
    const mod = await import("@capacitor/screen-orientation");
    screenOrientation = mod.ScreenOrientation;
  } catch {
    screenOrientation = null;
  }
  return screenOrientation;
}

export async function lockPortrait() {
  document.body.classList.remove("orientation-match");
  document.body.classList.add("orientation-portrait");
  const plugin = await ensurePlugin();
  if (!plugin) return;
  try {
    await plugin.lock({ orientation: "portrait" });
  } catch {
    /* ignore */
  }
}

export async function unlockForMatch() {
  document.body.classList.remove("orientation-portrait");
  document.body.classList.add("orientation-match");
  const plugin = await ensurePlugin();
  if (!plugin) return;
  try {
    await plugin.unlock();
  } catch {
    /* ignore */
  }
}

export function isNativeApp() {
  return native;
}

export async function initOrientation() {
  await lockPortrait();
}
