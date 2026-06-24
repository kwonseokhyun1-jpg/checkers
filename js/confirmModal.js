/**
 * Themed in-app confirm dialog — replaces window.confirm().
 */

let activeDialog = null;

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function removeDialog() {
  if (activeDialog) {
    activeDialog.remove();
    activeDialog = null;
    document.body.classList.remove("confirm-modal-open");
  }
}

/**
 * @param {{
 *   title?: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   danger?: boolean,
 * }} opts
 * @returns {Promise<boolean>}
 */
export function showConfirm(opts) {
  const {
    title = "Confirm",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    danger = false,
  } = opts;

  removeDialog();

  return new Promise((resolve) => {
    const el = document.createElement("div");
    el.className = "confirm-modal";
    el.setAttribute("role", "alertdialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "confirm-modal-title");
    el.innerHTML = `
      <div class="confirm-modal__backdrop" data-action="cancel"></div>
      <div class="confirm-modal__sheet panel game-panel">
        <h2 id="confirm-modal-title" class="confirm-modal__title">${escapeHtml(title)}</h2>
        <p class="confirm-modal__message">${escapeHtml(message)}</p>
        <div class="confirm-modal__actions">
          <button type="button" class="btn-secondary confirm-modal__cancel" data-action="cancel">${escapeHtml(cancelLabel)}</button>
          <button type="button" class="btn-primary confirm-modal__confirm ${danger ? "confirm-modal__confirm--danger" : ""}" data-action="confirm">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>`;

    const finish = (result) => {
      removeDialog();
      resolve(result);
    };

    el.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "confirm") finish(true);
      if (action === "cancel") finish(false);
    });

    document.body.appendChild(el);
    document.body.classList.add("confirm-modal-open");
    activeDialog = el;
    el.querySelector(".confirm-modal__confirm")?.focus();
  });
}
