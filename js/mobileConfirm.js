/** Bottom-sheet confirm on phones — falls back to window.confirm on desktop. */

const MOBILE_CONFIRM_MQ = "(max-width: 768px)";

let pendingResolve = null;

function getSheet() {
  return document.getElementById("mobile-confirm");
}

function finish(result) {
  const el = getSheet();
  if (!el) return;
  el.classList.add("hidden");
  document.body.classList.remove("mobile-confirm-open");
  const resolve = pendingResolve;
  pendingResolve = null;
  resolve?.(result);
}

/**
 * @param {string} message
 * @param {{ title?: string, confirmLabel?: string, cancelLabel?: string, destructive?: boolean }} [options]
 */
export function mobileConfirm(message, options = {}) {
  if (!window.matchMedia(MOBILE_CONFIRM_MQ).matches) {
    return Promise.resolve(window.confirm(message));
  }

  const el = getSheet();
  if (!el) return Promise.resolve(window.confirm(message));

  const {
    title = "Confirm",
    confirmLabel = "OK",
    cancelLabel = "Cancel",
    destructive = false,
  } = options;

  return new Promise((resolve) => {
    if (pendingResolve) finish(false);

    pendingResolve = resolve;

    el.querySelector("#mobile-confirm-title").textContent = title;
    el.querySelector("#mobile-confirm-body").textContent = message;
    const okBtn = el.querySelector("#mobile-confirm-ok");
    const cancelBtn = el.querySelector("#mobile-confirm-cancel");
    okBtn.textContent = confirmLabel;
    cancelBtn.textContent = cancelLabel;
    okBtn.classList.toggle("btn-danger", destructive);
    okBtn.classList.toggle("btn-primary", !destructive);

    el.classList.remove("hidden");
    document.body.classList.add("mobile-confirm-open");
    cancelBtn.focus();
  });
}

export function initMobileConfirm() {
  const el = getSheet();
  if (!el || el.dataset.bound) return;
  el.dataset.bound = "1";

  el.querySelector("#mobile-confirm-ok")?.addEventListener("click", () => finish(true));
  el.querySelector("#mobile-confirm-cancel")?.addEventListener("click", () => finish(false));
  el.querySelector("[data-mobile-confirm-backdrop]")?.addEventListener("click", () => finish(false));
}
