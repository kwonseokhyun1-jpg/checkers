#!/usr/bin/env node
/**
 * Capture 7" and 10" tablet store screenshots.
 * Run: node scripts/capture-tablet-screenshots.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.SCREENSHOT_PORT || 8765);
const baseUrl = `http://127.0.0.1:${port}/index.html`;

const sizes = [
  { dir: "assets/store/tablet-7", width: 600, height: 1024, label: "7-inch" },
  { dir: "assets/store/tablet-10", width: 1200, height: 1920, label: "10-inch" },
];

const scenes = [
  { file: "01-match.png", async capture(page) {
    await page.locator('[data-tab="play"]').click();
    await page.waitForTimeout(900);
    const stage = page.locator("#adventure-floor-list .adventure-floor-row").first();
    if (await stage.count()) {
      await stage.click();
      await page.waitForTimeout(600);
      const startBtn = page.locator("#btn-start-adventure");
      if (await startBtn.isVisible() && !(await startBtn.isDisabled())) {
        await startBtn.click();
        await page.waitForTimeout(2600);
      }
    }
  }},
  { file: "02-adventure.png", async capture(page) {
    await page.goto(baseUrl);
    await dismissOverlays(page);
    await page.locator('[data-tab="play"]').click();
    await page.waitForTimeout(1000);
  }},
  { file: "03-decks.png", async capture(page) {
    await page.goto(baseUrl);
    await dismissOverlays(page);
    await page.locator('[data-tab="deck"]').click();
    await page.waitForTimeout(800);
  }},
  { file: "04-shop.png", async capture(page) {
    await page.goto(baseUrl);
    await dismissOverlays(page);
    await page.locator('[data-tab="chests"]').click();
    await page.waitForTimeout(900);
  }},
];

async function dismissOverlays(page) {
  await page.waitForTimeout(1200);
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

const serverProc = spawn("python3", ["-m", "http.server", String(port)], {
  cwd: root,
  stdio: "ignore",
});
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch();

for (const size of sizes) {
  const outDir = path.join(root, size.dir);
  await mkdir(outDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
  console.log(`\n${size.label} (${size.width}x${size.height})`);

  for (const scene of scenes) {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
    await dismissOverlays(page);
    await scene.capture(page);
    await page.screenshot({ path: path.join(outDir, scene.file), fullPage: false });
    console.log("  wrote", path.join(size.dir, scene.file));
  }

  await page.close();
}

await browser.close();
serverProc.kill("SIGTERM");

console.log("\nDone.");
