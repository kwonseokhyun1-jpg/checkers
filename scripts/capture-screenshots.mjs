#!/usr/bin/env node
/**
 * Capture mobile screenshots for README / store listings.
 * Run: python3 -m http.server 8765 &  &&  npm run screenshots
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "screenshots");
const port = Number(process.env.SCREENSHOT_PORT || 8765);
const baseUrl = process.argv[2] || `http://127.0.0.1:${port}/index.html`;

async function startServer() {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-m", "http.server", String(port)], {
      cwd: root,
      stdio: "ignore",
    });
    proc.on("error", reject);
    setTimeout(() => resolve(proc), 800);
  });
}

async function dismissOverlays(page) {
  if (await page.locator("#auth-gate:not(.hidden)").isVisible().catch(() => false)) {
    await page.evaluate(() => {
      document.getElementById("auth-gate")?.classList.add("hidden");
      document.body.classList.remove("auth-gate-active");
    });
  }
  await page.evaluate(() => {
    document.getElementById("app-splash")?.remove();
    document.body.classList.remove("splash-active");
  });
  const tutorial = page.locator("#tutorial-modal:not(.hidden)");
  if (await tutorial.isVisible().catch(() => false)) {
    await page.locator("#tutorial-skip").click().catch(() => {});
    await page.waitForTimeout(400);
  }
}

let serverProc = null;
const useOwnServer = !process.argv[2];

if (useOwnServer) {
  serverProc = await startServer();
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// Splash frame (before dismiss)
await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForTimeout(450);
await page.screenshot({ path: path.join(outDir, "splash-mobile.png") });

await dismissOverlays(page);
await page.waitForTimeout(600);

// Decks tab (default)
await page.screenshot({ path: path.join(outDir, "decks-mobile.png"), fullPage: false });

await page.locator('[data-tab="chests"]').click();
await page.waitForTimeout(900);
await page.screenshot({ path: path.join(outDir, "shop-mobile.png"), fullPage: false });

await page.locator('[data-tab="play"]').click();
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(outDir, "adventure-mobile.png"), fullPage: false });

const stage = page.locator("#adventure-floor-list .adventure-floor-row").first();
if (await stage.count()) {
  await stage.click();
  await page.waitForTimeout(700);
  const startBtn = page.locator("#btn-start-adventure");
  if (await startBtn.isVisible() && !(await startBtn.isDisabled())) {
    await startBtn.click();
    await page.waitForTimeout(2800);
    await page.screenshot({ path: path.join(outDir, "match-mobile.png"), fullPage: false });
  }
}

await browser.close();
if (serverProc) serverProc.kill("SIGTERM");

console.log("Screenshots saved to", outDir);
