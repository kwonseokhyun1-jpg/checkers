const boundButtons = new WeakSet();
let globalListenersBound = false;
let activeTrigger = null;
let autoCloseTimer = null;

function getPopup() {
  return document.getElementById("panel-help-popup");
}

export function closePanelHelpPopup() {
  const popup = getPopup();
  if (!popup || popup.classList.contains("hidden")) return;

  popup.classList.add("hidden");
  document.body.classList.remove("panel-help-open");

  if (activeTrigger) {
    activeTrigger.setAttribute("aria-expanded", "false");
    activeTrigger.classList.remove("panel-help-btn--active");
    activeTrigger = null;
  }

  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

/**
 * @param {{ title?: string, bodyHtml?: string, triggerBtn?: HTMLElement | null, autoCloseMs?: number }} opts
 */
export function openPanelHelpPopup({ title, bodyHtml, triggerBtn = null, autoCloseMs = 0 }) {
  const popup = getPopup();
  if (!popup) return;

  closePanelHelpPopup();

  const titleEl = popup.querySelector("#panel-help-popup-title");
  const bodyEl = popup.querySelector("#panel-help-popup-body");
  if (titleEl) titleEl.textContent = title || "Help";
  if (bodyEl) bodyEl.innerHTML = bodyHtml || "";

  popup.classList.remove("hidden");
  document.body.classList.add("panel-help-open");

  if (triggerBtn) {
    activeTrigger = triggerBtn;
    triggerBtn.setAttribute("aria-expanded", "true");
    triggerBtn.classList.add("panel-help-btn--active");
  }

  if (autoCloseMs > 0) {
    autoCloseTimer = setTimeout(closePanelHelpPopup, autoCloseMs);
  }

  popup.querySelector(".panel-help-popup__dismiss")?.focus();
}

function bindPopupShell() {
  if (globalListenersBound) return;
  globalListenersBound = true;

  const popup = getPopup();
  if (!popup) return;

  popup.querySelectorAll("[data-panel-help-close]").forEach((el) => {
    el.addEventListener("click", closePanelHelpPopup);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanelHelpPopup();
  });
}

/**
 * @param {HTMLElement | string} btnOrId
 * @param {HTMLElement | string} descOrId
 */
export function initPanelHelp(btnOrId, descOrId) {
  const btn = typeof btnOrId === "string" ? document.getElementById(btnOrId) : btnOrId;
  const desc = typeof descOrId === "string" ? document.getElementById(descOrId) : descOrId;
  if (!btn || !desc || boundButtons.has(btn)) return;
  boundButtons.add(btn);
  bindPopupShell();

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const popup = getPopup();
    if (popup && !popup.classList.contains("hidden") && activeTrigger === btn) {
      closePanelHelpPopup();
      return;
    }

    openPanelHelpPopup({
      title: btn.getAttribute("aria-label") || "Help",
      bodyHtml: desc.innerHTML,
      triggerBtn: btn,
    });
  });
}
