/**
 * Fullscreen Title Box opening — reuses chest-open overlay beats.
 */
import { titleBoxStageSvg } from "./mysteryBoxArt.js";
import { TITLE_RARITY_CLASS } from "./mageTitles.js";
import { lockBodyScroll, unlockBodyScroll } from "./scrollLock.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function spawnParticles(container) {
  const colors = ["#ffd87a", "#ff9de2", "#fff8e7", "#fbbf24"];
  for (let i = 0; i < 26; i++) {
    const p = document.createElement("span");
    p.className = "chest-open-particle title-open-particle";
    const angle = (i / 26) * Math.PI * 2 + Math.random() * 0.4;
    const dist = 45 + Math.random() * 130;
    p.style.setProperty("--px", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--py", `${Math.sin(angle) * dist - 40}px`);
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.25}s`;
    container.appendChild(p);
  }
}

function renderTitleRevealEl(title) {
  const el = document.createElement("article");
  el.className = [
    "title-reveal-card",
    TITLE_RARITY_CLASS[title.rarity] || "",
    `title-reveal-card--glow-${title.glow}`,
    title.duplicate ? "title-reveal-card--duplicate" : "",
  ]
    .filter(Boolean)
    .join(" ");

  el.innerHTML = `
    <div class="title-reveal-card__frame">
      <span class="title-reveal-card__rarity">${title.rarity}</span>
      <span class="title-reveal-card__tag mage-title-tag mage-title-tag--glow-${title.glow} ${TITLE_RARITY_CLASS[title.rarity] || ""}">[${title.display}]</span>
      <strong class="title-reveal-card__name">${title.name}</strong>
      <span class="title-reveal-card__type">Mage Title</span>
      ${
        title.duplicate
          ? `<span class="title-reveal-card__dup">Duplicate · +${title.starRefund || 0} ★ refunded</span>`
          : '<span class="title-reveal-card__new">Unlocked!</span>'
      }
    </div>`;

  return el;
}

/**
 * @param {object} opts
 * @param {string} opts.boxLabel
 * @param {object[]} opts.pulls — title defs from openTitleBox
 */
export function playTitleOpenAnimation({ boxLabel, pulls }) {
  return new Promise((resolve) => {
    const pulledTitle = pulls[0];
    const overlay = document.createElement("div");
    overlay.className = "chest-open-overlay title-open-overlay chest-open-overlay--gold";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Opening title box");

    overlay.innerHTML = `
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${boxLabel}</p>
        <div class="chest-open-glow title-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${titleBoxStageSvg(pulledTitle?.display || pulledTitle?.name || "")}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Opening…</p>
        <div class="chest-open-cards title-open-reveals" hidden>
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid title-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect" disabled>Done</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("chest-open-active", "title-open-active");
    lockBodyScroll();

    const stage = overlay.querySelector(".chest-open-stage");
    const status = overlay.querySelector(".chest-open-status");
    const glow = overlay.querySelector(".chest-open-glow");
    const particleHost = overlay.querySelector(".chest-open-particles");
    const cardsWrap = overlay.querySelector(".chest-open-cards");
    const grid = overlay.querySelector(".chest-open-cards__grid");
    const collectBtn = overlay.querySelector(".chest-open-collect");

    const finish = () => {
      overlay.classList.add("chest-open-overlay--out");
      document.body.classList.remove("chest-open-active", "title-open-active");
      unlockBodyScroll();
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
      spawnParticles(particleHost);
      if (status) status.textContent = pulledTitle ? `Unlocked ${pulledTitle.name}!` : "Opened!";
      await delay(750);

      if (status) status.textContent = "";
      cardsWrap.hidden = false;
      cardsWrap.classList.add("chest-open-cards--in");
      stage.classList.add("chest-open-stage--dim");

      pulls.forEach((title, i) => {
        const card = renderTitleRevealEl(title);
        card.classList.add("title-reveal-card--deal");
        card.style.animationDelay = `${i * 0.14}s`;
        grid.appendChild(card);
      });
      await delay(400 + pulls.length * 200);

      collectBtn.disabled = false;
      collectBtn.focus();
    })();
  });
}
