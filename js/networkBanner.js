/**
 * Online connectivity banner.
 */

let bannerEl = null;

function ensureBanner() {
  if (bannerEl) return bannerEl;
  bannerEl = document.createElement("div");
  bannerEl.id = "network-banner";
  bannerEl.className = "network-banner hidden";
  bannerEl.setAttribute("role", "status");
  bannerEl.setAttribute("aria-live", "polite");
  document.body.appendChild(bannerEl);
  return bannerEl;
}

function syncBanner() {
  const el = ensureBanner();
  const offline = !navigator.onLine;
  el.textContent = offline ? "No connection — some features need internet" : "";
  el.classList.toggle("hidden", !offline);
}

export function initNetworkBanner() {
  syncBanner();
  window.addEventListener("online", syncBanner);
  window.addEventListener("offline", syncBanner);
}

export function isOnline() {
  return navigator.onLine !== false;
}
