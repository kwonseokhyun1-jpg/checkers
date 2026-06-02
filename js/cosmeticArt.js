/** SVG art, vault thumbnails, and reveal tiles for profile cosmetics */

export const COSMETIC_BOX_TIERS = {
  bronze: {
    label: "Bronze Vanity",
    tagline: "Same odds as Bronze Reliquary",
    visual: "bronze",
    accent: "#c77dff",
    glow: "rgba(199, 125, 255, 0.45)",
  },
  silver: {
    label: "Silver Vanity",
    tagline: "Same odds as Silver Reliquary",
    visual: "silver",
    accent: "#7dd3fc",
    glow: "rgba(125, 211, 252, 0.5)",
  },
  gold: {
    label: "Gold Vanity",
    tagline: "Same odds as Gold Reliquary",
    visual: "gold",
    accent: "#ffd87a",
    glow: "rgba(255, 216, 122, 0.55)",
  },
};

function boxColors(boxId) {
  const tier = COSMETIC_BOX_TIERS[boxId] || COSMETIC_BOX_TIERS.style_crate;
  const v = tier.visual;
  const lid = v === "gold" ? "#f0e6c8" : v === "silver" ? "#e4ecf8" : "#e8c4f8";
  const body = v === "gold" ? "#5a4518" : v === "silver" ? "#3d4a62" : "#4a2860";
  const trim = tier.accent;
  const ribbon = v === "gold" ? "#ff9de2" : v === "silver" ? "#a5f3fc" : "#d8b4fe";
  return { tier, lid, body, trim, ribbon };
}

function vanityDefs(boxId, id) {
  const { lid, body, trim, ribbon } = boxColors(boxId);
  return `
    <defs>
      <linearGradient id="${id}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${body}"/>
        <stop offset="50%" stop-color="${lid}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0c0814"/>
      </linearGradient>
      <linearGradient id="${id}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${lid}"/>
        <stop offset="100%" stop-color="${body}"/>
      </linearGradient>
      <radialGradient id="${id}-inner" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="${trim}" stop-opacity="0.9"/>
        <stop offset="55%" stop-color="${ribbon}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${id}-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${ribbon}"/>
        <stop offset="100%" stop-color="${trim}"/>
      </linearGradient>
      <filter id="${id}-glow">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
}

function vanityBodyGroup(boxId, id, forStage) {
  const { trim, ribbon, tier } = boxColors(boxId);
  const interior = forStage
    ? `<g class="chest-stage__interior">
        <rect x="28" y="48" width="64" height="32" rx="3" fill="url(#${id}-inner)" opacity="0"/>
        <circle cx="60" cy="58" r="14" fill="url(#${id}-inner)" opacity="0"/>
      </g>`
    : "";
  const lidClass = forStage ? ` class="chest-stage__lid"` : "";
  const bodyClass = forStage ? ` class="chest-stage__body"` : "";
  const bow =
    tier.visual === "gold"
      ? `<circle cx="60" cy="26" r="6" fill="url(#${id}-ribbon)" filter="url(#${id}-glow)"/>
         <path d="M52 26 Q60 18 68 26" fill="none" stroke="${trim}" stroke-width="1.5"/>`
      : `<ellipse cx="60" cy="28" rx="8" ry="5" fill="url(#${id}-ribbon)" filter="url(#${id}-glow)"/>`;

  return `
    ${interior}
    <g${bodyClass}>
      <rect x="24" y="44" width="72" height="40" rx="6" fill="url(#${id}-body)" stroke="${trim}" stroke-width="2"/>
      <ellipse cx="60" cy="62" rx="18" ry="12" fill="none" stroke="${trim}" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="60" cy="62" rx="12" ry="8" fill="rgba(255,255,255,0.08)"/>
      <path d="M48 56 L60 48 L72 56" fill="none" stroke="${ribbon}" stroke-width="1" opacity="0.6"/>
      <rect x="54" y="66" width="12" height="10" rx="2" fill="url(#${id}-ribbon)" opacity="0.5"/>
    </g>
    <g${lidClass}>
      <path d="M18 44 L60 20 L102 44 Z" fill="url(#${id}-lid)" stroke="${trim}" stroke-width="2" filter="url(#${id}-glow)"/>
      <path d="M24 44 L60 26 L96 44" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      ${bow}
      <rect x="22" y="40" width="76" height="5" rx="1" fill="url(#${id}-ribbon)" opacity="0.85"/>
    </g>`;
}

/** Animated vanity chest for opening cinematic */
export function cosmeticBoxStageSvg(boxId) {
  const id = `vanityStage-${boxId}`;
  return `<svg class="chest-stage-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${vanityDefs(boxId, id)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${vanityBodyGroup(boxId, id, true)}
  </svg>`;
}

/** Static thumbnail for vault cosmetic box cards */
export function cosmeticBoxSvgMarkup(boxId) {
  const id = `vanityCard-${boxId}`;
  return `<svg class="chest-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${vanityDefs(boxId, id)}
    <ellipse cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${vanityBodyGroup(boxId, id, false)}
  </svg>`;
}

export function renderAvatarPreview(id) {
  const art = AVATAR_ART[id] || AVATAR_ART.avatar_default;
  const gid = `av-${id.replace(/[^a-z0-9]/gi, "")}`;
  return `<svg viewBox="0 0 64 64" class="cosmetic-avatar-svg cosmetic-avatar-svg--${id.replace("avatar_", "")}" aria-hidden="true">
    <defs>
      <linearGradient id="${gid}-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${art.bg[0]}"/>
        <stop offset="100%" stop-color="${art.bg[1]}"/>
      </linearGradient>
      <radialGradient id="${gid}-glow" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stop-color="${art.glow}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${art.bg[1]}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#${gid}-bg)"/>
    <circle cx="32" cy="30" r="22" fill="url(#${gid}-glow)"/>
    ${art.svg}
  </svg>`;
}

const AVATAR_ART = {
  avatar_default: {
    bg: ["#4a5f7a", "#1e2a3a"],
    glow: "#8fa4c4",
    svg: `<ellipse cx="32" cy="38" rx="14" ry="16" fill="#2a3548"/>
      <circle cx="32" cy="24" r="11" fill="#c5d4ea"/>
      <rect x="22" y="14" width="20" height="6" rx="2" fill="#6b7f9c"/>
      <circle cx="28" cy="24" r="2" fill="#1a2030"/>
      <circle cx="36" cy="24" r="2" fill="#1a2030"/>`,
  },
  avatar_mystic: {
    bg: ["#4c1d95", "#1e1035"],
    glow: "#c4a8ff",
    svg: `<path d="M32 12 L42 22 L38 44 L26 44 L22 22 Z" fill="#2d1b4e" stroke="#c4a8ff" stroke-width="1.5"/>
      <circle cx="32" cy="28" r="8" fill="#0f0618" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="32" cy="28" r="3" fill="#a78bfa"/>
      <path d="M20 48 Q32 36 44 48" fill="none" stroke="#7c3aed" stroke-width="2"/>`,
  },
  avatar_shadow: {
    bg: ["#111827", "#030712"],
    glow: "#6b7280",
    svg: `<path d="M18 50 Q32 20 46 50 Z" fill="#0a0f18"/>
      <ellipse cx="32" cy="26" rx="12" ry="14" fill="#1f2937"/>
      <path d="M22 18 Q32 8 42 18 L40 26 Q32 22 24 26 Z" fill="#030712"/>
      <ellipse cx="27" cy="28" rx="2" ry="3" fill="#9ca3af" opacity="0.8"/>
      <ellipse cx="37" cy="28" rx="2" ry="3" fill="#9ca3af" opacity="0.8"/>`,
  },
  avatar_sun: {
    bg: ["#b45309", "#451a03"],
    glow: "#fde68a",
    svg: `<circle cx="32" cy="30" r="14" fill="#fbbf24" stroke="#fef3c7" stroke-width="2"/>
      <path d="M32 6 L34 14 M32 54 L34 46 M6 30 L14 32 M54 30 L46 32 M12 14 L18 20 M46 46 L52 52 M46 14 L52 8 M12 46 L18 52" stroke="#fde68a" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 48 Q32 40 40 48" fill="#d97706"/>`,
  },
  avatar_void: {
    bg: ["#0c0a14", "#312e81"],
    glow: "#818cf8",
    svg: `<circle cx="32" cy="32" r="18" fill="#05030a" stroke="#6366f1" stroke-width="2"/>
      <ellipse cx="32" cy="32" rx="10" ry="14" fill="#1e1b4b"/>
      <circle cx="32" cy="32" r="4" fill="#c7d2fe"/>
      <circle cx="26" cy="24" r="1.5" fill="#fff" opacity="0.9"/>
      <circle cx="38" cy="28" r="1" fill="#fff" opacity="0.7"/>
      <circle cx="30" cy="38" r="1.2" fill="#fff" opacity="0.6"/>`,
  },
};

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

export function cosmeticTypeLabel(type) {
  if (type === "pieceSkin") return "Piece skin";
  if (type === "frame") return "Frame";
  if (type === "avatar") return "Avatar";
  if (type === "banner") return "Banner";
  return type;
}

export function frameClassFor(frameId) {
  const slug = (frameId || "frame_default").replace(/^frame_/, "");
  return `profile-frame profile-frame--${slug}`;
}

export function renderFramePreview(frameId) {
  const slug = (frameId || "frame_default").replace(/^frame_/, "");
  return `<div class="cosmetic-frame-preview ${frameClassFor(frameId)}">
    <div class="cosmetic-frame-preview__inner">${renderAvatarPreview("avatar_default")}</div>
  </div>`;
}

/** Shared preview markup for profile inventory, reveals, etc. */
export function renderCosmeticPreviewHtml(id, type) {
  if (type === "avatar") return renderAvatarPreview(id);
  if (type === "frame") return renderFramePreview(id);
  if (type === "banner") {
    return `<div class="cosmetic-preview-banner" style="background:${bannerStyleFor(id)}"></div>`;
  }
  if (type === "pieceSkin") return skinPreviewHtml(id);
  return "";
}

function skinPreviewHtml(skinId) {
  const slug = skinId.replace("skin_", "");
  return `<div class="cosmetic-skin-preview">
    <span class="piece red piece-skin-${slug} king"></span>
    <span class="piece black piece-skin-${slug}"></span>
  </div>`;
}

/**
 * Reveal tile for cosmetic open cinematic (matches spell card deal styling).
 * @param {{ id: string, name: string, type: string, rarity: string, duplicate?: boolean }} item
 */
export function renderCosmeticRevealEl(item) {
  const el = document.createElement("article");
  el.className = `cosmetic-reveal-card rarity-${item.rarity} cosmetic-reveal-card--${item.type}`;
  if (item.duplicate) el.classList.add("cosmetic-reveal-card--duplicate");

  const preview = renderCosmeticPreviewHtml(item.id, item.type);
  const typeLabel = cosmeticTypeLabel(item.type);

  el.innerHTML = `
    <div class="cosmetic-reveal-card__frame">
      <span class="cosmetic-reveal-card__rarity">${item.rarity}</span>
      <div class="cosmetic-reveal-card__preview">${preview}</div>
      <strong class="cosmetic-reveal-card__name">${item.name}</strong>
      <span class="cosmetic-reveal-card__type">${typeLabel}</span>
      ${item.duplicate ? '<span class="cosmetic-reveal-card__dup">Duplicate · gems refunded</span>' : '<span class="cosmetic-reveal-card__new">Unlocked!</span>'}
    </div>`;

  el.style.animationDelay = "0s";
  return el;
}
