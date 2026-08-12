/**
 * Full-size card inspect modal (art + name + description)
 */
import { renderSpellCardEl } from "./cardArt.js";

function $(id) {
  return document.getElementById(id);
}

function ensureCardPreviewOnBody() {
  const modal = $("card-preview-modal");
  if (modal && modal.parentElement !== document.body) {
    document.body.appendChild(modal);
  }
}

function setPreviewBodyState(open) {
  document.body.classList.toggle("card-preview-open", open);
  window.dispatchEvent(new CustomEvent("card-preview-change", { detail: { open } }));
}

export function closeCardPreview() {
  $("card-preview-modal")?.classList.add("hidden");
  $("card-preview-mount")?.classList.remove("card-preview-mount--reveal-only");
  setPreviewBodyState(false);
  // iOS can leave a horizontal visual-viewport offset after bottom-sheet modals.
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  window.scrollTo(0, y);
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
  document.querySelector(".game-main")?.scrollTo?.(0, document.querySelector(".game-main")?.scrollTop ?? 0);
}

/**
 * @param {object} def — card definition
 * @param {object} [opts]
 * @param {() => void} [opts.onAdd] — deck builder: add to deck
 * @param {() => void} [opts.onRemove] — remove from deck slot
 * @param {() => void} [opts.onPlay] — match: cast spell
 * @param {() => void} [opts.onBuy] — inventory: buy a copy
 * @param {boolean} [opts.buyDisabled]
 * @param {string} [opts.meta] — extra line under card
 */
export function showCardPreview(def, opts = {}) {
  ensureCardPreviewOnBody();
  const modal = $("card-preview-modal");
  const mount = $("card-preview-mount");
  const actions = $("card-preview-actions");
  if (!modal || !mount || !def) return;

  mount.innerHTML = "";
  mount.classList.toggle("card-preview-mount--reveal-only", !!opts.hideDesc);
  mount.appendChild(renderSpellCardEl(def, { static: true, hideDesc: opts.hideDesc }));

  if (actions) {
    actions.innerHTML = "";
    if (opts.meta) {
      const p = document.createElement("p");
      p.className = "card-preview-meta";
      p.textContent = opts.meta;
      actions.appendChild(p);
    }
    const row = document.createElement("div");
    row.className = "card-preview-actions-row";

    if (opts.onPlay) {
      const play = document.createElement("button");
      play.type = "button";
      play.className = "btn-primary";
      play.textContent = "Cast spell";
      play.addEventListener("click", () => {
        closeCardPreview();
        opts.onPlay();
      });
      row.appendChild(play);
    }
    if (opts.onAdd) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "btn-primary";
      add.textContent = "Add to deck";
      add.disabled = !!opts.addDisabled;
      add.addEventListener("click", () => {
        if (!opts.addDisabled) opts.onAdd();
      });
      row.appendChild(add);
    }
    if (opts.onBuy) {
      const buy = document.createElement("button");
      buy.type = "button";
      buy.className = "btn-primary";
      buy.textContent = opts.buyLabel || "Buy copy";
      buy.disabled = !!opts.buyDisabled;
      buy.addEventListener("click", () => {
        if (!opts.buyDisabled) {
          opts.onBuy();
        }
      });
      row.appendChild(buy);
    }
    if (opts.onRemove) {
      const rem = document.createElement("button");
      rem.type = "button";
      rem.className = "btn-secondary";
      rem.textContent = "Remove all from deck";
      rem.addEventListener("click", () => {
        opts.onRemove();
        closeCardPreview();
      });
      row.appendChild(rem);
    }

    if (row.children.length) actions.appendChild(row);
  }

  modal.classList.remove("hidden");
  setPreviewBodyState(true);
}

export function bindCardPreviewModal() {
  $("card-preview-close")?.addEventListener("click", closeCardPreview);
  $("card-preview-backdrop")?.addEventListener("click", closeCardPreview);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCardPreview();
  });
}
