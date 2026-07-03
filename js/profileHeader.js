import { getEquippedCosmetics } from "./cosmetics.js";
import { renderAvatarPreview, frameClassFor } from "./cosmeticArt.js";
import { fetchProfileRow } from "./auth.js";

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function headerProfileAvatarHtml(profile, username = "") {
  const cos = getEquippedCosmetics(profile);
  const initial = (username || "P").charAt(0).toUpperCase();
  const inner =
    renderAvatarPreview(cos.equipped.avatar) ||
    `<span class="profile-avatar-fallback">${escapeHtml(initial)}</span>`;
  return `<span class="profile-avatar-stack header-profile-btn__stack ${frameClassFor(cos.equipped.frame)}"><span class="profile-avatar-inner header-profile-btn__inner">${inner}</span></span>`;
}

export async function resolveDisplayUsername(user) {
  if (!user) return "";
  try {
    const row = await fetchProfileRow(user.id);
    return row?.username || user.user_metadata?.display_name || user.email?.split("@")[0] || "";
  } catch {
    return user.user_metadata?.display_name || user.email?.split("@")[0] || "";
  }
}
