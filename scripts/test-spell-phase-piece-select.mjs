#!/usr/bin/env node
/**
 * Regression: selecting a piece during the spell phase must not disable casting.
 * Run: node scripts/test-spell-phase-piece-select.mjs [baseUrl]
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:8765/index.html";

function handState(page) {
  return page.evaluate(() => {
    const hand = document.querySelector("#hand-red");
    const cards = [...(hand?.querySelectorAll(".spell-card") || [])];
    return {
      banner: document.querySelector("#turn-banner")?.textContent,
      handLocked: hand?.classList.contains("spell-hand--locked"),
      enabled: cards.filter((c) => !c.classList.contains("disabled")).length,
      total: cards.length,
      skippedTitles: cards.filter((c) => c.title.includes("Spells skipped")).length,
      selected: !!document.querySelector(".square.selected"),
    };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1200);

await page.evaluate(() => {
  document.getElementById("auth-gate")?.classList.add("hidden");
  document.body.classList.remove("auth-gate-active");
});

await page.locator('[data-tab="play"]').click();
await page.waitForTimeout(700);
await page.locator("#adventure-floor-list .adventure-floor-row").first().click();
await page.waitForTimeout(500);
await page.locator("#btn-start-adventure").click();
await page.waitForTimeout(4000);

const before = await handState(page);
if (before.handLocked) {
  console.error("Expected spell hand unlocked at turn start, got locked hand");
  process.exit(1);
}

let clicked = false;
for (const row of [5, 6, 7]) {
  for (const col of [0, 2, 4, 6]) {
    const hasPiece = await page.locator(`[data-row="${row}"][data-col="${col}"] .piece.red`).count();
    if (!hasPiece) continue;
    await page.locator(`[data-row="${row}"][data-col="${col}"]`).click();
    clicked = true;
    break;
  }
  if (clicked) break;
}

if (!clicked) {
  console.error("Could not find a red piece to select");
  process.exit(1);
}

await page.waitForTimeout(400);
const after = await handState(page);

if (after.handLocked) {
  console.error("Spell hand locked after selecting a piece:", after);
  process.exit(1);
}
if (after.skippedTitles > 0) {
  console.error("Spells show skipped tooltip after piece select:", after);
  process.exit(1);
}
if (after.enabled < before.enabled) {
  console.error("Fewer castable spells after piece select:", { before, after });
  process.exit(1);
}
if (!after.banner?.includes("Cast a spell")) {
  console.error("Turn banner should still offer casting spells:", after.banner);
  process.exit(1);
}
if (!after.selected) {
  console.error("Expected a selected piece after click");
  process.exit(1);
}

// Explicit skip (button) should lock spells.
const skipBtn = page.locator("#btn-end-cards");
if (!(await skipBtn.isVisible())) {
  console.error("Skip spell phase button should be visible during spell phase");
  process.exit(1);
}
await skipBtn.click();
await page.waitForTimeout(400);
const skipped = await handState(page);
if (!skipped.handLocked) {
  console.error("Spell hand should lock after skipping spell phase with button");
  process.exit(1);
}

console.log("spell-phase-piece-select: ok");
await browser.close();
