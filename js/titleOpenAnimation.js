/**
 * Fullscreen Title Box opening — reuses chest-open overlay beats.
 */
import { TITLE_RARITY_CLASS, titleTagClasses } from "./mageTitles.js";
import { lockBodyScroll, unlockBodyScroll } from "./scrollLock.js";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

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
      <span class="title-reveal-card__tag ${titleTagClasses(title)}">[${title.display}]</span>
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
    const overlay = document.createElement("div");
    overlay.className = "chest-open-overlay title-open-overlay chest-open-overlay--gold";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Opening title box");

    overlay.innerHTML = `
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${boxLabel}</p>
        <div class="chest-open-glow title-open-glow chest-open-glow--on" aria-hidden="true"></div>
        <p class="chest-open-status">Revealing title…</p>
        <div class="chest-open-cards title-open-reveals">
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid title-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect">Done</button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("chest-open-active", "title-open-active");
    lockBodyScroll();

    const status = overlay.querySelector(".chest-open-status");
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
      await delay(500);
      if (status) status.textContent = "";
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
