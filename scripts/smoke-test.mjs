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

await page.locator('[data-tab="play"]').click();
await page.waitForTimeout(1200);
const stages = await page.locator("#adventure-stage-list .adventure-stage-row").count();
if (stages < 1) {
  console.error("Expected adventure stages, found", stages);
  process.exit(1);
}

await page.locator("#adventure-stage-list .adventure-stage-row").first().click();
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
await page.waitForTimeout(2500);
const squares = await page.locator(".square, .board-square").count();
if (squares < 64) {
  console.error("Expected 64 board squares, found", squares);
  process.exit(1);
}

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.locator("#auth-header-btn").click();
await page.waitForTimeout(500);
if (!(await page.locator("#auth-modal:not(.hidden)").isVisible())) {
  console.error("Auth modal did not open from header");
  process.exit(1);
}

console.log("Smoke test passed:", { baseUrl, stages, squares });
await browser.close();
