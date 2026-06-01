/** SVG / preview helpers for profile cosmetics */

export function renderAvatarPreview(id) {
  const palettes = {
    avatar_default: ["#5a6a8a", "#8fa4c4"],
    avatar_mystic: ["#6b4fd4", "#c4a8ff"],
    avatar_shadow: ["#1a1f2e", "#4a5568"],
    avatar_sun: ["#c9a227", "#ffe08a"],
    avatar_void: ["#0d0a18", "#7b5cff"],
  };
  const [a, b] = palettes[id] || palettes.avatar_default;
  return `<svg viewBox="0 0 64 64" class="cosmetic-avatar-svg" aria-hidden="true">
    <defs><linearGradient id="av-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/></linearGradient></defs>
    <circle cx="32" cy="32" r="30" fill="url(#av-g)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    <circle cx="32" cy="26" r="10" fill="rgba(255,255,255,0.2)"/>
    <path d="M14 52 Q32 40 50 52" fill="rgba(0,0,0,0.25)"/>
    <text x="32" y="58" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.5)">✦</text>
  </svg>`;
}

export function bannerStyleFor(id) {
  const map = {
    banner_default: "linear-gradient(135deg,#1e2a44,#2d4a6e)",
    banner_nebula: "linear-gradient(135deg,#2a1f4e,#6b4fd4 55%,#1a1030)",
    banner_crimson: "linear-gradient(135deg,#3a1018,#8b2030 50%,#1a0a10)",
    banner_storm: "linear-gradient(135deg,#1a2840,#3d7ab8 45%,#9ad4ff)",
    banner_aurora: "linear-gradient(135deg,#0f3d3a,#5ce1e6 40%,#9f7aea 80%,#1a0a20)",
  };
  return map[id] || map.banner_default;
}
