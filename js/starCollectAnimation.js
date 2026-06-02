/**
 * Animate adventure stars flying from the victory overlay to the header HUD.
 */
export function playStarCollectAnimation(count, fromEl) {
  const n = Math.max(1, Math.min(3, Number(count) || 1));
  const source = fromEl || document.getElementById("game-over-stars");
  const target = document.querySelector(".hud-stars");
  if (!source || !target) return Promise.resolve();

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.className = "star-collect-layer";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const promises = [];
  for (let i = 0; i < n; i++) {
    const star = document.createElement("span");
    star.className = "star-collect-fly";
    star.textContent = "★";
    const startX = from.left + from.width / 2 + (i - 1) * 14;
    const startY = from.top + from.height / 2;
    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    layer.appendChild(star);

    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;
    const delay = i * 120;

    promises.push(
      new Promise((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            star.style.transition =
              "transform 0.75s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.75s";
            star.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.35)`;
            star.style.opacity = "0.15";
            setTimeout(resolve, 780);
          }, delay);
        });
      })
    );
  }

  target.classList.add("hud-stars--pulse");
  return Promise.all(promises).then(() => {
    layer.remove();
    setTimeout(() => target.classList.remove("hud-stars--pulse"), 400);
  });
}
