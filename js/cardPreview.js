/**
 * Full-size card inspect modal (art + name + description)
 */
import { renderSpellCardEl } from "./cardArt.js";

function $(id) {
  return document.getElementById(id);
}

export function closeCardPreview() {
  $("card-preview-modal")?.classList.add("hidden");
}

/**
 * @param {object} def — card definition
 * @param {object} [opts]
 * @param {() => void} [opts.onAdd] — deck builder: add to deck
 * @param {() => void} [opts.onRemove] — remove from deck slot
 * @param {() => void} [opts.onPlay] — match: cast spell
 * @param {string} [opts.meta] — extra line under card
 */
export function showCardPreview(def, opts = {}) {
  const modal = $("card-preview-modal");
  const mount = $("card-preview-mount");
  const actions = $("card-preview-actions");
  if (!modal || !mount || !def) return;

  mount.innerHTML = "";
  mount.appendChild(renderSpellCardEl(def, { static: true }));

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
        if (!opts.addDisabled) {
          opts.onAdd();
          closeCardPreview();
        }
      });
      row.appendChild(add);
    }
    if (opts.onRemove) {
      const rem = document.createElement("button");
      rem.type = "button";
      rem.className = "btn-secondary";
      rem.textContent = "Remove from deck";
      rem.addEventListener("click", () => {
        opts.onRemove();
        closeCardPreview();
      });
      row.appendChild(rem);
    }

    if (row.children.length) actions.appendChild(row);
  }

  modal.classList.remove("hidden");
}

export function bindCardPreviewModal() {
  $("card-preview-close")?.addEventListener("click", closeCardPreview);
  $("card-preview-backdrop")?.addEventListener("click", closeCardPreview);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCardPreview();
  });
}
