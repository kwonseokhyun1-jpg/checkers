/**
 * Boot splash — animated logo while app initializes.
 */

const MIN_SPLASH_MS = 1800;

export function showBootSplash() {
  const existing = document.getElementById("boot-splash");
  if (existing) return hideBootSplash;

  const el = document.createElement("div");
  el.id = "boot-splash";
  el.className = "boot-splash";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-label", "Loading Arcane Checkers");
  el.innerHTML = `
    <div class="boot-splash__inner">
      <div class="boot-splash__logo logo-mark" aria-hidden="true">
        <span class="logo-mark__piece logo-mark__piece--red"></span>
        <span class="logo-mark__piece logo-mark__piece--black"></span>
        <span class="logo-mark__spark">✦</span>
      </div>
      <h1 class="boot-splash__title">Arcane Checkers</h1>
      <p class="boot-splash__tagline">Spells on the checker board</p>
      <div class="boot-splash__progress" aria-hidden="true">
        <span class="boot-splash__progress-bar"></span>
      </div>
    </div>`;
  document.body.appendChild(el);
  document.body.classList.add("boot-splash-active");

  const shownAt = Date.now();

  return async function hideBootSplash() {
    const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - shownAt));
    if (wait) await new Promise((r) => setTimeout(r, wait));
    el.classList.add("boot-splash--hide");
    await new Promise((r) => setTimeout(r, 450));
    el.remove();
    document.body.classList.remove("boot-splash-active");
  };
}
