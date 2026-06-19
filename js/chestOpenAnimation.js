/**
 * Fullscreen chest opening cinematic — rumble, lid flip, burst, card reveal
 */
import { CHEST_TIERS, chestStageSvg } from "./chestArt.js";
import { renderSpellCardEl } from "./cardArt.js";
import { showCardPreview } from "./cardPreview.js";
import { staggerCardReveal, onCardRevealed } from "./cardAnimations.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function spawnParticles(container, tier) {
  const colors =
    tier === "gold"
      ? ["#f0d060", "#e8c547", "#fff8e7"]
      : tier === "silver"
        ? ["#d4dce8", "#a8b8d8", "#eef2f8"]
        : ["#cd7f32", "#e8a55a", "#ffcc80"];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("span");
    p.className = "chest-open-particle";
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 120;
    p.style.setProperty("--px", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--py", `${Math.sin(angle) * dist - 40}px`);
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.25}s`;
    container.appendChild(p);
  }
}

/**
 * @param {object} opts
 * @param {string} opts.tier — bronze | silver | gold
 * @param {string} opts.tierLabel
 * @param {object[]} opts.pulls — card defs
 */
export function playChestOpenAnimation({ tier, tierLabel, pulls }) {
  return new Promise((resolve) => {
    const t = CHEST_TIERS[tier] || CHEST_TIERS.bronze;
    const overlay = document.createElement("div");
    overlay.className = `chest-open-overlay chest-open-overlay--${tier}`;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Opening chest");

    overlay.innerHTML = `
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${tierLabel}</p>
        <div class="chest-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${chestStageSvg(tier)}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Opening…</p>
        <div class="chest-open-cards" hidden>
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect" disabled>Done</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("chest-open-active");

    const stage = overlay.querySelector(".chest-open-stage");
    const status = overlay.querySelector(".chest-open-status");
    const glow = overlay.querySelector(".chest-open-glow");
    const particleHost = overlay.querySelector(".chest-open-particles");
    const cardsWrap = overlay.querySelector(".chest-open-cards");
    const grid = overlay.querySelector(".chest-open-cards__grid");
    const collectBtn = overlay.querySelector(".chest-open-collect");

    const finish = () => {
      overlay.classList.add("chest-open-overlay--out");
      document.body.classList.remove("chest-open-active");
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
      if (status) status.textContent = "Opening…";
      await delay(900);

      stage.dataset.phase = "open";
      overlay.classList.add("chest-open-overlay--burst");
      glow?.classList.add("chest-open-glow--on");
      spawnParticles(particleHost, tier);
      if (status) status.textContent = "Opened!";
      await delay(750);

      if (status) status.textContent = "";
      cardsWrap.hidden = false;
      cardsWrap.classList.add("chest-open-cards--in");
      stage.classList.add("chest-open-stage--dim");

      pulls.forEach((def, i) => {
        const card = renderSpellCardEl(def, {
          button: true,
          deal: true,
          onClick: () => showCardPreview(def, { meta: "Added to collection" }),
        });
        card.style.animationDelay = `${i * 0.14}s`;
        grid.appendChild(card);
        onCardRevealed(card, def.rarity);
      });
      staggerCardReveal(grid);
      await delay(400 + pulls.length * 140);

      collectBtn.disabled = false;
      collectBtn.focus();
    })();
  });
}
