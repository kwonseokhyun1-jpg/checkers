#!/usr/bin/env node
/**
 * Capture store screenshots while signed in (real cloud profile).
 *
 * Usage:
 *   SCREENSHOT_EMAIL=you@example.com SCREENSHOT_PASSWORD=secret \
 *     node scripts/capture-authenticated-screenshots.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets/store/phone");
const port = Number(process.env.SCREENSHOT_PORT || 8765);
const baseUrl = process.env.SCREENSHOT_BASE_URL || `http://127.0.0.1:${port}/index.html`;
const email = process.env.SCREENSHOT_EMAIL || "";
const password = process.env.SCREENSHOT_PASSWORD || "";

if (!email || !password) {
  console.error("Set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD environment variables.");
  process.exit(1);
}

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

async function dismissSplash(page) {
  await page.evaluate(() => {
    document.getElementById("app-splash")?.remove();
    document.body.classList.remove("splash-active");
  });
}

async function dismissTutorials(page) {
  for (let i = 0; i < 4; i++) {
    const skip = page.locator("#tutorial-skip, [data-tutorial-skip], .tutorial-skip-btn");
    if (await skip.first().isVisible().catch(() => false)) {
      await skip.first().click().catch(() => {});
      await page.waitForTimeout(500);
      continue;
    }
    const close = page.locator(".tutorial-modal__close, #tutorial-close");
    if (await close.first().isVisible().catch(() => false)) {
      await close.first().click().catch(() => {});
      await page.waitForTimeout(500);
      continue;
    }
    const mobileOk = page.locator("#mobile-confirm-ok");
    if (await mobileOk.isVisible().catch(() => false)) {
      await mobileOk.click().catch(() => {});
      await page.waitForTimeout(400);
      continue;
    }
    break;
  }
}

async function signIn(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1200);
  await dismissSplash(page);

  const gate = page.locator("#auth-gate:not(.hidden)");
  if (await gate.isVisible().catch(() => false)) {
    await page.locator("#auth-gate-signin").click();
  } else {
    await page.locator("#auth-header-btn").click().catch(() => {});
  }

  await page.locator("#auth-modal:not(.hidden)").waitFor({ timeout: 15000 });
  await page.locator("#auth-identifier").fill(email);
  await page.locator("#auth-password").fill(password);
  await page.locator("#auth-form button[type='submit']").click();

  await page.waitForFunction(
    () => {
      const gateEl = document.getElementById("auth-gate");
      const signInBtn = document.getElementById("auth-header-btn");
      const gateHidden = !gateEl || gateEl.classList.contains("hidden");
      const signedIn = !signInBtn || signInBtn.classList.contains("hidden");
      return gateHidden && signedIn;
    },
    { timeout: 45000 }
  );

  await page.waitForTimeout(2500);
  await dismissTutorials(page);
  await page.waitForTimeout(800);
}

const serverProc = process.env.SCREENSHOT_BASE_URL ? null : await startServer();
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await signIn(page);

  await page.locator('[data-tab="play"]').click();
  await page.waitForTimeout(1200);
  await dismissTutorials(page);
  await page.screenshot({ path: path.join(outDir, "02-adventure.png") });
  console.log("captured 02-adventure.png");

  const nextRow = page.locator("#adventure-floor-list .adventure-floor-row--next").first();
  const anyRow = page.locator("#adventure-floor-list .adventure-floor-row").last();
  const mapPin = page.locator(".adventure-map-pin:not([disabled])").last();
  if (await nextRow.count()) {
    await nextRow.evaluate((el) => el.click());
  } else if (await mapPin.count()) {
    await mapPin.evaluate((el) => el.click());
  } else if (await anyRow.count()) {
    await anyRow.evaluate((el) => el.click());
  }

  await page.waitForTimeout(700);
  const startBtn = page.locator("#btn-start-adventure");
  if (await startBtn.isVisible() && !(await startBtn.isDisabled())) {
    await startBtn.click();
    await page.waitForTimeout(3500);
    await dismissTutorials(page);
    await page.screenshot({ path: path.join(outDir, "01-match.png") });
    console.log("captured 01-match.png");
    await page.locator("#btn-leave-match").click().catch(() => {});
    await page.waitForTimeout(600);
    const leaveOk = page.locator("#mobile-confirm-ok");
    if (await leaveOk.isVisible().catch(() => false)) await leaveOk.click();
    await page.waitForTimeout(1200);
  }

  await page.locator('[data-tab="chests"]').click();
  await page.waitForTimeout(1000);
  const cardsTab = page.locator('.vault-tab[data-vault-tab="cards"]');
  if (await cardsTab.count()) await cardsTab.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(outDir, "04-shop.png") });
  console.log("captured 04-shop.png");

  await page.locator('[data-tab="quests"]').click();
  await page.waitForTimeout(1200);
  await dismissTutorials(page);
  await page.screenshot({ path: path.join(outDir, "05-quests.png") });
  console.log("captured 05-quests.png");
} catch (err) {
  console.error("Screenshot capture failed:", err.message);
  await page.screenshot({ path: path.join(outDir, "_error-state.png") }).catch(() => {});
  process.exitCode = 1;
} finally {
  await browser.close();
  serverProc?.kill("SIGTERM");
}

console.log("Screenshots saved to", outDir);
