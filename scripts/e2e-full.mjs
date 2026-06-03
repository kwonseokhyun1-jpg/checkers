#!/usr/bin/env node
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:8765/index.html";
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error("FAIL:", msg);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});
page.on("dialog", (d) => {
  console.log("dialog:", d.message().slice(0, 80));
  d.accept();
});

async function dismissTutorial() {
  const vis = await page.locator("#tutorial-modal:not(.hidden)").isVisible();
  if (vis) await page.locator('[data-tab="play"]').click();
  await page.waitForTimeout(400);
}

async function startFirstStageMatch() {
  await page.locator('[data-tab="play"]').click();
  await page.waitForTimeout(600);
  await page.locator("#adventure-stage-list .adventure-stage-row").first().click();
  await page.waitForTimeout(500);
  if (!(await page.locator("#adventure-prebattle:not(.hidden)").isVisible())) fail("Prebattle did not open");
  if (await page.locator("#btn-start-adventure").isDisabled()) fail("Start battle disabled");
  await page.locator("#btn-start-adventure").click();
  await page.waitForTimeout(2000);
}

await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(800);
await dismissTutorial();

const deckVisible = await page.locator("#view-deck:not(.hidden)").isVisible();
if (!deckVisible) fail("Expected deck tab visible on fresh load");

for (const tab of ["play", "chests", "profile", "deck"]) {
  await page.locator(`[data-tab="${tab}"]`).click();
  await page.waitForTimeout(400);
  if (!(await page.locator(`#view-${tab}:not(.hidden)`).isVisible())) fail(`Tab ${tab} did not show`);
}

await startFirstStageMatch();
if ((await page.locator(".square, .board-square").count()) < 64) fail("Board missing squares");
if (!(await page.evaluate(() => document.body.classList.contains("match-active")))) fail("match-active not set");

const handLabel = await page.locator("#hand-count-label").textContent();
if (!handLabel?.includes("card")) fail(`Bad hand count: ${handLabel}`);

await page.locator("#btn-leave-match").click();
await page.waitForTimeout(800);
if (await page.evaluate(() => document.body.classList.contains("match-active"))) fail("Still in match after leave");
if (!(await page.locator("#view-play:not(.hidden)").isVisible())) fail("Play tab not visible after leave");

const hasCheckpoint = await page.evaluate(() => !!sessionStorage.getItem("cc_match_checkpoint"));
if (!hasCheckpoint) fail("Leave match should keep checkpoint for resume");

await page.locator('[data-tab="deck"]').click();
await page.waitForTimeout(400);
if (!(await page.locator("#view-deck:not(.hidden)").isVisible())) fail("Deck tab blocked after leave");

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
if ((await page.locator(".square, .board-square").count()) < 64) fail("Checkpoint resume failed after reload");
if (!(await page.locator("#btn-leave-match").isVisible())) fail("Leave button missing after resume");

await page.locator("#btn-leave-match").click();
await page.waitForTimeout(600);
await page.evaluate(() => sessionStorage.removeItem("cc_match_checkpoint"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1000);
if (await page.evaluate(() => document.body.classList.contains("match-active"))) fail("Stale checkpoint auto-resumed after clear");

await browser.close();
if (errors.length) {
  console.error("JS errors:", [...new Set(errors)]);
  process.exit(1);
}
if (failures.length) process.exit(1);
console.log("E2E full test passed");
