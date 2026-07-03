/**
 * Cold-start splash — dismiss after logo animation, before app bootstrap finishes.
 */

const MIN_VISIBLE_MS = 1100;
const REDUCED_MOTION_MS = 120;

function dismissSplash() {
  const splash = document.getElementById("app-splash");
  if (!splash || splash.classList.contains("app-splash--hide")) return;

  splash.classList.add("app-splash--hide");
  document.body.classList.remove("splash-active");

  const remove = () => {
    splash.remove();
  };
  splash.addEventListener("transitionend", remove, { once: true });
  window.setTimeout(remove, 600);
}

/** Reveal the game shell immediately (e.g. when a match or tutorial starts during splash). */
export function dismissAppSplash() {
  dismissSplash();
}

function scheduleDismiss() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = reduced ? REDUCED_MOTION_MS : MIN_VISIBLE_MS;
  const start = performance.now();

  const run = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, delay - elapsed);
    window.setTimeout(dismissSplash, wait);
  };

  if (document.readyState === "interactive" || document.readyState === "complete") run();
  else document.addEventListener("DOMContentLoaded", run, { once: true });
}

document.body.classList.add("splash-active");
scheduleDismiss();
