/** Card reveal / pull animation helpers */

export function staggerCardReveal(container, selector = ".spell-card") {
  if (!container) return;
  const cards = container.querySelectorAll(selector);
  cards.forEach((el, i) => {
    el.classList.add("spell-card--deal");
    el.style.animationDelay = `${i * 0.1}s`;
  });
}

export function playRareReveal(cardEl) {
  if (!cardEl) return;
  cardEl.classList.add("spell-card--rare-burst");
  setTimeout(() => cardEl.classList.remove("spell-card--rare-burst"), 900);
}

export function playEpicReveal(cardEl) {
  if (!cardEl) return;
  cardEl.classList.add("spell-card--epic-burst");
  setTimeout(() => cardEl.classList.remove("spell-card--epic-burst"), 1200);
}

export function playLegendaryReveal(cardEl) {
  if (!cardEl) return;
  cardEl.classList.add("spell-card--legendary-burst");
  setTimeout(() => cardEl.classList.remove("spell-card--legendary-burst"), 1500);
}

export function onCardRevealed(cardEl, rarity) {
  if (rarity === "legendary") playLegendaryReveal(cardEl);
  else if (rarity === "epic") playEpicReveal(cardEl);
  else if (rarity === "rare") playRareReveal(cardEl);
}
