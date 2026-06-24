/** PWA install banner — Chrome/Edge beforeinstallprompt + iOS Add to Home Screen hint. */

const DISMISS_KEY = "cc_install_banner_dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function isIosSafari() {
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua);
}

export function initInstallPrompt() {
  if (isStandalone() || localStorage.getItem(DISMISS_KEY) === "1") return;

  const banner = document.getElementById("install-banner");
  if (!banner) return;

  let deferredPrompt = null;

  const show = () => {
    banner.classList.remove("hidden");
    document.body.classList.add("install-banner-visible");
  };

  const hide = () => {
    banner.classList.add("hidden");
    document.body.classList.remove("install-banner-visible");
  };

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    banner.querySelector("#install-banner-ios-hint")?.classList.add("hidden");
    banner.querySelector(".install-banner__hint--default")?.classList.remove("hidden");
    banner.querySelector("#install-banner-btn")?.classList.remove("hidden");
    show();
  });

  if (isIosSafari()) {
    banner.querySelector("#install-banner-ios-hint")?.classList.remove("hidden");
    banner.querySelector(".install-banner__hint--default")?.classList.add("hidden");
    banner.querySelector("#install-banner-btn")?.classList.add("hidden");
    window.setTimeout(show, 2500);
  }

  banner.querySelector("#install-banner-btn")?.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    hide();
  });

  banner.querySelector("#install-banner-dismiss")?.addEventListener("click", () => {
    localStorage.setItem(DISMISS_KEY, "1");
    hide();
  });
}
