#!/usr/bin/env node
/**
 * Verify interactive tutorial mounts a visible board during splash.
 * Run: node scripts/test-tutorial-board.mjs [baseUrl]
 */
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:8765/index.html";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.addInitScript(() => {
  localStorage.setItem(
    "sb-xhoskftcrgbsjkmzjscw-auth-token",
    JSON.stringify({
      access_token: "test-token",
      refresh_token: "test-refresh",
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      token_type: "bearer",
      user: {
        id: "test-user-id",
        email: "test@example.com",
        app_metadata: {},
        user_metadata: {},
      },
    })
  );
  localStorage.removeItem("arcane_checkers_interactive_tutorial_v1");
  sessionStorage.setItem("arcane_checkers_pending_signup_tutorial_v1", "1");
});

await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });

let ready = false;
for (let i = 0; i < 40 && !ready; i++) {
  await page.waitForTimeout(50);
  ready = await page.evaluate(
    () => !!document.getElementById("tutorial-match-overlay") && document.querySelectorAll("#board .square").length >= 64
  );
}

if (!ready) {
  console.error("Tutorial board never mounted");
  process.exit(1);
}

const duringSplash = await page.evaluate(() => ({
  splash: document.body.classList.contains("splash-active"),
  tutorial: document.body.classList.contains("tutorial-match-active"),
  squares: document.querySelectorAll("#board .square").length,
  shellVis: getComputedStyle(document.querySelector(".game-shell")).visibility,
}));

if (duringSplash.shellVis !== "visible") {
  console.error("Board hidden while tutorial is active:", duringSplash);
  process.exit(1);
}

const continueVisible = await page.locator("#tutorial-match-continue:not(.hidden)").isVisible();
if (continueVisible) {
  await page.locator("#tutorial-match-continue").click();
  await page.waitForTimeout(500);
}

const moveStep = await page.evaluate(() => ({
  pieces: document.querySelectorAll("#board .piece").length,
  message: document.getElementById("message")?.textContent || "",
}));

if (moveStep.pieces < 2) {
  console.error("Move lesson did not place tutorial pieces:", moveStep);
  process.exit(1);
}

await page.evaluate(() => {
  const sq = [...document.querySelectorAll("#board .square")].find((s) => s.querySelector(".piece.red"));
  sq?.click();
});
await page.waitForTimeout(200);

const afterSelect = await page.evaluate(() => ({
  playable: document.querySelectorAll("#board .square.playable").length,
  message: document.getElementById("message")?.textContent || "",
}));

if (afterSelect.playable < 1) {
  console.error("Tutorial move step has no legal destinations:", afterSelect);
  process.exit(1);
}

if (errors.length) {
  console.error("JS errors:", errors);
  process.exit(1);
}

console.log("PASS: tutorial board visible during splash and move step is playable");
await browser.close();
