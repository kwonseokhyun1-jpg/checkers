/**
 * Sync bottom/top insets when env(safe-area-inset-*) is 0 but the visual
 * viewport is shorter than the layout viewport (common on Capacitor Android).
 */
function readInsetTop() {
  const vv = window.visualViewport;
  if (!vv) return 0;
  return Math.max(0, Math.round(vv.offsetTop));
}

function readInsetBottom() {
  const vv = window.visualViewport;
  if (!vv) return 0;
  return Math.max(0, Math.round(window.innerHeight - vv.offsetTop - vv.height));
}

export function syncViewportInsets() {
  const root = document.documentElement;
  const apply = () => {
    root.style.setProperty("--viewport-inset-top", `${readInsetTop()}px`);
    root.style.setProperty("--viewport-inset-bottom", `${readInsetBottom()}px`);
  };

  apply();
  window.visualViewport?.addEventListener("resize", apply);
  window.visualViewport?.addEventListener("scroll", apply);
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
}

syncViewportInsets();
