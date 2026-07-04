#!/usr/bin/env node
/**
 * Capture store screenshots while signed in (real cloud profile).
 *
 * Usage:
 *   SCREENSHOT_EMAIL=you@example.com SCREENSHOT_PASSWORD=secret npm run screenshots:auth
 *   SCREENSHOT_EMAIL=... SCREENSHOT_PASSWORD=... npm run screenshots:tablet
 *
 * Env:
 *   SCREENSHOT_SIZES — comma list: phone, tablet-7, tablet-10 (default: all)
 *   SCREENSHOT_BASE_URL — skip local server (e.g. preview URL)
 *   SCREENSHOT_PORT — local server port (default 8765)
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.SCREENSHOT_PORT || 8765);
const baseUrl = process.env.SCREENSHOT_BASE_URL || `http://127.0.0.1:${port}/index.html`;
const email = process.env.SCREENSHOT_EMAIL || "";
const password = process.env.SCREENSHOT_PASSWORD || "";

const VIEWPORTS = {
  phone: { dir: "assets/store/phone", width: 390, height: 844, label: "phone" },
  "tablet-7": { dir: "assets/store/tablet-7", width: 600, height: 1024, label: "7-inch tablet" },
  "tablet-10": { dir: "assets/store/tablet-10", width: 1200, height: 1920, label: "10-inch tablet" },
};

function requestedSizes() {
  const raw = (process.env.SCREENSHOT_SIZES || "phone,tablet-7,tablet-10").trim();
  const keys = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const sizes = keys.map((k) => VIEWPORTS[k]).filter(Boolean);
  if (!sizes.length) {
    console.error(`Unknown SCREENSHOT_SIZES: ${raw}. Use phone, tablet-7, tablet-10`);
    process.exit(1);
  }
  return sizes;
}

if (!email || !password) {
  console.error("Set SCREENSHOT_EMAIL and SCREENSHOT_PASSWORD environment variables.");
  process.exit(1);
}

async function startServer() {
  const serveDir = process.env.SCREENSHOT_BASE_URL ? null : distDir;
  if (!serveDir) return null;
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-m", "http.server", String(port)], {
      cwd: serveDir,
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
  for (let i = 0; i < 6; i++) {
    const matchSkip = page.locator("#tutorial-match-skip, #btn-leave-match");
    if (await matchSkip.first().isVisible().catch(() => false)) {
      await matchSkip.first().click().catch(() => {});
      await page.waitForTimeout(400);
      const confirmSkip = page.locator("#mobile-confirm-ok");
      if (await confirmSkip.isVisible().catch(() => false)) {
        await confirmSkip.click().catch(() => {});
        await page.waitForTimeout(1200);
      }
      continue;
    }
    const skip = page.locator("#tutorial-skip, #tutorial-meta-skip, [data-tutorial-skip], .tutorial-skip-btn");
    if (await skip.first().isVisible().catch(() => false)) {
      await skip.first().click().catch(() => {});
      await page.waitForTimeout(500);
      const confirmSkip = page.locator("#mobile-confirm-ok");
      if (await confirmSkip.isVisible().catch(() => false)) {
        await confirmSkip.click().catch(() => {});
        await page.waitForTimeout(800);
      }
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

async function closeAuthModalIfOpen(page) {
  const authModal = page.locator("#auth-modal:not(.hidden)");
  if (await authModal.isVisible().catch(() => false)) {
    await page.locator("#auth-close").click().catch(() => {});
    await page.waitForTimeout(500);
  }
}

async function dismissBlockingSheets(page) {
  const cancel = page.locator("#mobile-confirm-cancel");
  if (await cancel.isVisible().catch(() => false)) {
    await cancel.click().catch(() => {});
    await page.waitForTimeout(400);
  }
  await closeAuthModalIfOpen(page);
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

async function clickIfNeeded(page, selector) {
  const el = page.locator(selector).first();
  if (!(await el.count())) return false;
  await el.evaluate((node) => node.click());
  return true;
}

async function captureScenes(page, outDir) {
  await clickIfNeeded(page, '[data-tab="play"]');
  await page.waitForTimeout(1200);
  await dismissTutorials(page);
  await page.screenshot({ path: path.join(outDir, "02-adventure.png") });
  console.log("  captured 02-adventure.png");

  await clickIfNeeded(page, '[data-tab="chests"]');
  await page.waitForTimeout(1000);
  await page.waitForSelector("#view-chests:not(.hidden)", { timeout: 12000 }).catch(() => {});
  const cardsTab = page.locator('.vault-tab[data-vault-tab="cards"]');
  if ((await cardsTab.count()) && (await cardsTab.getAttribute("aria-selected")) !== "true") {
    await cardsTab.evaluate((el) => el.click());
  }
  await page.waitForTimeout(900);
  await dismissTutorials(page);
  await closeAuthModalIfOpen(page);
  await page.screenshot({ path: path.join(outDir, "04-shop.png") });
  console.log("  captured 04-shop.png");

  await clickIfNeeded(page, '[data-tab="quests"]');
  await page.waitForTimeout(1200);
  await dismissBlockingSheets(page);
  await page.waitForSelector("#view-quests:not(.hidden)", { timeout: 12000 }).catch(() => {});
  const titleTab = page.locator('[data-quests-section="title"]');
  if (await titleTab.count()) {
    await titleTab.evaluate((el) => el.click());
    await page.waitForTimeout(800);
  }
  await dismissTutorials(page);
  await page.screenshot({ path: path.join(outDir, "05-quests.png") });
  console.log("  captured 05-quests.png (Title quests)");

  await clickIfNeeded(page, '[data-tab="play"]');
  await page.waitForTimeout(1000);
  await dismissTutorials(page);

  const towerOne = page.locator(".adventure-world-shield:not(.adventure-world-shield--locked)").first();
  if (await towerOne.count()) {
    await towerOne.evaluate((el) => el.click());
    await page.waitForTimeout(800);
  }

  const nextRow = page.locator("#adventure-floor-list .adventure-floor-row--next").first();
  const anyRow = page.locator("#adventure-floor-list .adventure-floor-row").first();
  const mapNext = page.locator(".adventure-map-tile--next:not([disabled])").first();
  const mapPin = page.locator(".adventure-map-pin:not([disabled])").first();
  const mapTile = page.locator(".adventure-map-tile:not([disabled])").first();
  if (await mapNext.count()) {
    await mapNext.evaluate((el) => el.click());
  } else if (await mapPin.count()) {
    await mapPin.evaluate((el) => el.click());
  } else if (await mapTile.count()) {
    await mapTile.evaluate((el) => el.click());
  } else if (await nextRow.count()) {
    await nextRow.evaluate((el) => el.click());
  } else if (await anyRow.count()) {
    await anyRow.evaluate((el) => el.click());
  }

  await page.waitForTimeout(1000);
  await page.waitForSelector("#adventure-prebattle:not(.hidden)", { timeout: 12000 }).catch(() => {});
  const startBtn = page.locator("#btn-start-adventure");
  if (await startBtn.count()) {
    await startBtn.evaluate((el) => el.click());
    await page.waitForSelector("#view-match:not(.hidden) #board", { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await dismissTutorials(page);
    const onMatch = await page.locator("#view-match:not(.hidden) #board").count();
    if (onMatch) {
      await page.screenshot({ path: path.join(outDir, "01-match.png") });
      console.log("  captured 01-match.png");
    } else {
      console.log("  skipped 01-match.png (match did not start)");
    }
  } else {
    console.log("  skipped 01-match.png (no Start battle button)");
  }
}

const sizes = requestedSizes();
const serverProc = await startServer();

if (!process.env.SCREENSHOT_BASE_URL) {
  try {
    await access(path.join(distDir, "index.html"));
  } catch {
    console.error("dist/index.html not found. Run: npm run build");
    serverProc?.kill("SIGTERM");
    process.exit(1);
  }
}

const browser = await chromium.launch();
let failed = false;

try {
  for (const size of sizes) {
    const outDir = path.join(root, size.dir);
    await mkdir(outDir, { recursive: true });
    console.log(`\n${size.label} (${size.width}×${size.height}) → ${size.dir}/`);

    const page = await browser.newPage({
      viewport: { width: size.width, height: size.height },
    });

    try {
      await signIn(page);
      await captureScenes(page, outDir);
    } catch (err) {
      failed = true;
      console.error(`  failed: ${err.message}`);
      await page.screenshot({ path: path.join(outDir, "_error-state.png") }).catch(() => {});
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
  serverProc?.kill("SIGTERM");
}

const sevenMatch = path.join(root, "assets/store/tablet-7/01-match.png");
const tenMatch = path.join(root, "assets/store/tablet-10/01-match.png");
const capturedTablet7 = sizes.some((s) => s.dir.includes("tablet-7"));
const capturedTablet10 = sizes.some((s) => s.dir.includes("tablet-10"));
if (capturedTablet7 && capturedTablet10) {
  try {
    await access(tenMatch);
    const sharp = (await import("sharp")).default;
    await sharp(tenMatch).resize(600, 1024, { fit: "cover", position: "top" }).toFile(sevenMatch);
    console.log("  resized tablet-10/01-match.png → tablet-7/01-match.png");
  } catch {
    /* 10-inch match may be missing */
  }
}

if (failed) process.exit(1);
console.log("\nScreenshots saved.");
