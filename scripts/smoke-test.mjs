#!/usr/bin/env node
/**
 * Smoke test: app loads, tutorial does not block nav, adventure starts a match.
 * Run: node scripts/smoke-test.mjs [baseUrl]
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:8765/index.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1500);

if (errors.length) {
  console.error("JS errors on load:", errors);
  process.exit(1);
}

// Auth gate blocks nav when Supabase is configured and the player has not signed in or continued as guest.
if (await page.locator("#auth-gate:not(.hidden)").isVisible()) {
  const guestBtn = page.locator("#auth-gate-guest");
  if (await guestBtn.isVisible()) {
    await guestBtn.click();
  } else {
    await page.evaluate(() => {
      document.getElementById("auth-gate")?.classList.add("hidden");
      document.body.classList.remove("auth-gate-active");
    });
  }
  await page.waitForTimeout(300);
}

async function dismissInteractiveTutorialIfOpen(page) {
  const skipBtn = page.locator("#tutorial-match-skip");
  if (!(await skipBtn.isVisible().catch(() => false))) return;
  await skipBtn.click();
  await page.waitForTimeout(300);
  const okBtn = page.locator("#mobile-confirm-ok");
  if (await okBtn.isVisible().catch(() => false)) {
    await okBtn.click();
    await page.waitForTimeout(800);
  }
}

async function dismissMetaTutorialIfOpen(page) {
  const skipBtn = page.locator("#tutorial-meta-skip");
  if (!(await skipBtn.isVisible().catch(() => false))) return;
  await skipBtn.click();
  await page.waitForTimeout(300);
  const okBtn = page.locator("#mobile-confirm-ok");
  if (await okBtn.isVisible().catch(() => false)) {
    await okBtn.click();
    await page.waitForTimeout(800);
  }
}

await dismissInteractiveTutorialIfOpen(page);
await dismissMetaTutorialIfOpen(page);

async function openAdventureFromPlayTab(page) {
  await page.locator('[data-tab="play"]').click();
  await page.waitForTimeout(600);
  const adventureBtn = page.locator('[data-play-tab="adventure"]');
  if (await adventureBtn.isVisible().catch(() => false)) {
    await adventureBtn.click();
    await page.waitForTimeout(800);
  }
}

const tutorialVisible = await page.locator("#tutorial-modal:not(.hidden)").isVisible();
if (tutorialVisible) {
  await page.locator('[data-tab="play"]').click();
  await page.waitForTimeout(800);
  const stillBlocking = await page.locator("#tutorial-modal:not(.hidden)").isVisible();
  if (stillBlocking) {
    console.error("Tutorial still blocks after Play tab click");
    process.exit(1);
  }
}

await openAdventureFromPlayTab(page);
const tiles = await page.locator("#adventure-map .adventure-map-tile").count();
if (tiles < 1) {
  console.error("Expected adventure map tiles, found", tiles);
  process.exit(1);
}

await page.locator("#adventure-map .adventure-map-tile--next, #adventure-map .adventure-map-tile:not(.adventure-map-tile--locked)").first().click();
await page.waitForTimeout(800);
if (!(await page.locator("#adventure-prebattle:not(.hidden)").isVisible())) {
  console.error("Prebattle modal did not open");
  process.exit(1);
}

if (await page.locator("#btn-start-adventure").isDisabled()) {
  console.error("Start battle button disabled with no valid deck");
  process.exit(1);
}

await page.locator("#btn-start-adventure").click();
await page.waitForTimeout(4500);
const squares = await page.locator(".square, .board-square").count();
if (squares < 64) {
  console.error("Expected 64 board squares, found", squares);
  process.exit(1);
}
const boardMetrics = await page.evaluate(() => {
  const board = document.querySelector("#board");
  const ranks = document.querySelector(".board-ranks");
  const frame = document.querySelector("#board-frame");
  if (!board) return { size: 0, square: false, ranksBesideBoard: false };
  const r = board.getBoundingClientRect();
  const ranksRect = ranks?.getBoundingClientRect();
  const frameStyle = frame ? getComputedStyle(frame).display : "";
  return {
    size: Math.min(r.width, r.height),
    square: Math.abs(r.width - r.height) < 2,
    ranksBesideBoard: Boolean(
      ranksRect && ranksRect.width < r.width * 0.35 && ranksRect.height > r.height * 0.5
    ),
    frameDisplay: frameStyle,
  };
});
if (boardMetrics.size < 120) {
  console.error("Board too small to play —", boardMetrics.size, "px (expected at least 120px)");
  process.exit(1);
}
if (!boardMetrics.square) {
  console.error("Board is not square —", boardMetrics);
  process.exit(1);
}
if (!boardMetrics.ranksBesideBoard || boardMetrics.frameDisplay !== "grid") {
  console.error("Board coordinate layout broken on mobile —", boardMetrics);
  process.exit(1);
}

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
if (await page.locator("#auth-gate:not(.hidden)").isVisible()) {
  const guestBtn = page.locator("#auth-gate-guest");
  if (await guestBtn.isVisible()) {
    await guestBtn.click();
  } else {
    await page.evaluate(() => {
      document.getElementById("auth-gate")?.classList.add("hidden");
      document.body.classList.remove("auth-gate-active");
    });
  }
  await page.waitForTimeout(300);
}
await dismissInteractiveTutorialIfOpen(page);
await dismissMetaTutorialIfOpen(page);
if (await page.locator("#mobile-confirm:not(.hidden)").isVisible().catch(() => false)) {
  await page.locator("#mobile-confirm-cancel").click();
  await page.waitForTimeout(200);
}
const authHeader = page.locator("#auth-header-btn");
if (await authHeader.isVisible()) {
  await authHeader.click();
  await page.waitForTimeout(500);
  if (!(await page.locator("#auth-modal:not(.hidden)").isVisible())) {
    console.error("Auth modal did not open from header");
    process.exit(1);
  }
}

console.log("Smoke test passed:", { baseUrl, tiles, squares });
await browser.close();
