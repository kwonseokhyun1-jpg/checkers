/**
 * Haptic feedback — Capacitor only (no-op on web).
 */

import { getSettings } from "./settings.js";

let hapticsPlugin = null;
let hapticsReady = false;

async function ensureHaptics() {
  if (hapticsReady) return hapticsPlugin;
  hapticsReady = true;
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return null;
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    hapticsPlugin = { Haptics, ImpactStyle };
  } catch {
    hapticsPlugin = null;
  }
  return hapticsPlugin;
}

export async function hapticLight() {
  if (!getSettings().hapticsEnabled) return;
  const plugin = await ensureHaptics();
  if (!plugin) return;
  try {
    await plugin.Haptics.impact({ style: plugin.ImpactStyle.Light });
  } catch {
    /* ignore */
  }
}

export async function hapticMedium() {
  if (!getSettings().hapticsEnabled) return;
  const plugin = await ensureHaptics();
  if (!plugin) return;
  try {
    await plugin.Haptics.impact({ style: plugin.ImpactStyle.Medium });
  } catch {
    /* ignore */
  }
}

export async function hapticHeavy() {
  if (!getSettings().hapticsEnabled) return;
  const plugin = await ensureHaptics();
  if (!plugin) return;
  try {
    await plugin.Haptics.impact({ style: plugin.ImpactStyle.Heavy });
  } catch {
    /* ignore */
  }
}
