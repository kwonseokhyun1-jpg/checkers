/**
 * Fullscreen cosmetic box opening — same beats as spell reliquaries
 */
import { COSMETIC_BOX_TIERS, cosmeticBoxStageSvg, renderCosmeticRevealEl } from "./cosmeticArt.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function spawnParticles(container, visual) {
  const colors =
    visual === "gold"
      ? ["#ffd87a", "#ff9de2", "#fff8e7"]
      : visual === "silver"
        ? ["#a5f3fc", "#c4b5fd", "#eef2f8"]
        : ["#d8b4fe", "#f0abfc", "#e9d5ff"];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("span");
    p.className = "chest-open-particle cosmetic-open-particle";
    const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 45 + Math.random() * 130;
    p.style.setProperty("--px", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--py", `${Math.sin(angle) * dist - 40}px`);
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.25}s`;
    container.appendChild(p);
  }
}

/**
 * @param {object} opts
 * @param {string} opts.boxId
 * @param {string} opts.boxLabel
 * @param {object[]} opts.pulls — cosmetic items from openCosmeticBox
 */
export function playCosmeticOpenAnimation({ boxId, boxLabel, pulls }) {
  return new Promise((resolve) => {
    const tier = COSMETIC_BOX_TIERS[boxId] || COSMETIC_BOX_TIERS.style_crate;
    const visual = tier.visual;
    const overlay = document.createElement("div");
    overlay.className = `chest-open-overlay cosmetic-open-overlay chest-open-overlay--${visual} cosmetic-open-overlay--${boxId}`;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Opening cosmetic box");

    overlay.innerHTML = `
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${boxLabel}</p>
        <div class="chest-open-glow cosmetic-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${cosmeticBoxStageSvg(boxId)}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Unsealing…</p>
        <div class="chest-open-cards cosmetic-open-reveals" hidden>
          <p class="chest-open-cards__title">Cosmetics acquired</p>
          <div class="chest-open-cards__grid cosmetic-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect">Collect cosmetics</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("chest-open-active", "cosmetic-open-active");

    const stage = overlay.querySelector(".chest-open-stage");
    const status = overlay.querySelector(".chest-open-status");
    const glow = overlay.querySelector(".chest-open-glow");
    const particleHost = overlay.querySelector(".chest-open-particles");
    const cardsWrap = overlay.querySelector(".chest-open-cards");
    const grid = overlay.querySelector(".chest-open-cards__grid");
    const collectBtn = overlay.querySelector(".chest-open-collect");

    const finish = () => {
      overlay.classList.add("chest-open-overlay--out");
      document.body.classList.remove("chest-open-active", "cosmetic-open-active");
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 350);
    };

    collectBtn.addEventListener("click", finish);

    requestAnimationFrame(() => {
      overlay.classList.add("chest-open-overlay--in");
    });

    (async () => {
      await delay(350);
      stage.dataset.phase = "rumble";
      if (status) status.textContent = "The vanity lock trembles…";
      await delay(900);

      stage.dataset.phase = "open";
      overlay.classList.add("chest-open-overlay--burst");
      glow?.classList.add("chest-open-glow--on");
      spawnParticles(particleHost, visual);
      if (status) status.textContent = "Styles burst forth!";
      await delay(750);

      if (status) status.textContent = "";
      cardsWrap.hidden = false;
      cardsWrap.classList.add("chest-open-cards--in");
      stage.classList.add("chest-open-stage--dim");

      pulls.forEach((item, i) => {
        const card = renderCosmeticRevealEl(item);
        card.classList.add("cosmetic-reveal-card--deal");
        card.style.animationDelay = `${i * 0.14}s`;
        grid.appendChild(card);
      });
      await delay(400 + pulls.length * 160);

      collectBtn.disabled = false;
      collectBtn.focus();
    })();
  });
}
