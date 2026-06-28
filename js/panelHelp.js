const boundButtons = new WeakSet();
let globalListenersBound = false;

function closeAllPanelHelp() {
  document.querySelectorAll(".panel-help-btn--active").forEach((btn) => {
    const controlsId = btn.getAttribute("aria-controls");
    const desc = controlsId ? document.getElementById(controlsId) : null;
    if (!desc) return;
    desc.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    btn.classList.remove("panel-help-btn--active");
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

  const setOpen = (open) => {
    desc.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.classList.toggle("panel-help-btn--active", open);
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(desc.hidden);
  });

  if (!globalListenersBound) {
    globalListenersBound = true;
    document.addEventListener("click", closeAllPanelHelp);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllPanelHelp();
    });
  }
}
