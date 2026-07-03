#!/usr/bin/env node
/**
 * Capture 7" and 10" tablet store screenshots (guest mode — no credentials needed).
 * For signed-in captures with real progress: npm run screenshots:tablet
 *
 * Usage: npm run screenshots:tablet:guest
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const port = Number(process.env.SCREENSHOT_PORT || 8765);
const baseUrl = process.env.SCREENSHOT_BASE_URL || `http://127.0.0.1:${port}/index.html`;

const sizes = [
  { dir: "assets/store/tablet-7", width: 600, height: 1024, label: "7-inch" },
  { dir: "assets/store/tablet-10", width: 1200, height: 1920, label: "10-inch" },
];

async function startServer() {
  if (process.env.SCREENSHOT_BASE_URL) return null;
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-m", "http.server", String(port)], {
      cwd: distDir,
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

const TUTORIAL_KEYS = [
  "arcane_checkers_interactive_tutorial_v1",
  "arcane_checkers_meta_tutorial_v1",
  "arcane_checkers_quests_tutorial_v1",
  "arcane_checkers_pvp_tutorial_v1",
  "arcane_checkers_cosmetics_tutorial_v1",
  "arcane_checkers_tutorial_v1",
];

const PROFILE_STORAGE_KEY = "cardCheckersProfile_v7";
const PENDING_SIGNUP_TUTORIAL_KEY = "arcane_checkers_pending_signup_tutorial_v1";

async function skipTutorialsInStorage(page) {
  await page.evaluate(
    ({ keys, profileKey, pendingKey }) => {
      for (const key of keys) localStorage.setItem(key, "done");
      sessionStorage.removeItem(pendingKey);
      try {
        const raw = localStorage.getItem(profileKey);
        if (!raw) return;
        const profile = JSON.parse(raw);
        profile.interactiveTutorialDone = true;
        profile.metaTutorialDone = true;
        profile.questsTutorialDone = true;
        profile.pvpTutorialDone = true;
        profile.cosmeticsTutorialDone = true;
        profile.tutorialDone = true;
        localStorage.setItem(profileKey, JSON.stringify(profile));
      } catch {
        /* ignore */
      }
    },
    {
      keys: TUTORIAL_KEYS,
      profileKey: PROFILE_STORAGE_KEY,
      pendingKey: PENDING_SIGNUP_TUTORIAL_KEY,
    }
  );
}

async function enterAsGuest(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await skipTutorialsInStorage(page);
  await page.waitForTimeout(1200);
  await dismissSplash(page);

  const gate = page.locator("#auth-gate:not(.hidden)");
  if (await gate.isVisible().catch(() => false)) {
    await page.locator("#auth-gate-guest").click();
    await page.waitForFunction(
      () => {
        const gateEl = document.getElementById("auth-gate");
        return !gateEl || gateEl.classList.contains("hidden");
      },
      { timeout: 15000 }
    );
  }

  await skipTutorialsInStorage(page);
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  await dismissSplash(page);
  await skipTutorialsInStorage(page);
  await dismissTutorials(page);
  await page.waitForTimeout(1000);
  await dismissTutorials(page);
  await page.waitForTimeout(800);
}

async function leaveMatchIfNeeded(page) {
  const leaveBtn = page.locator("#btn-leave-match");
  if (await leaveBtn.isVisible().catch(() => false)) {
    await leaveBtn.evaluate((el) => el.click());
    await page.waitForTimeout(600);
    const leaveOk = page.locator("#mobile-confirm-ok");
    if (await leaveOk.isVisible().catch(() => false)) await leaveOk.click();
    await page.waitForSelector("#view-match.hidden", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }
}

async function closeAuthModalIfOpen(page) {
  const authModal = page.locator("#auth-modal:not(.hidden)");
  if (await authModal.isVisible().catch(() => false)) {
    await page.locator("#auth-close").click().catch(() => {});
    await page.waitForTimeout(500);
  }
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

  await clickIfNeeded(page, '[data-tab="deck"]');
  await page.waitForTimeout(1200);
  await page.waitForSelector("#view-deck:not(.hidden)", { timeout: 10000 }).catch(() => {});
  await dismissTutorials(page);
  await closeAuthModalIfOpen(page);
  await page.screenshot({ path: path.join(outDir, "05-decks.png") });
  console.log("  captured 05-decks.png");

  await clickIfNeeded(page, '[data-tab="play"]');
  await page.waitForTimeout(1000);
  await dismissTutorials(page);

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

  await page.waitForTimeout(700);
  await page.waitForSelector("#adventure-prebattle:not(.hidden)", { timeout: 8000 }).catch(() => {});
  const startBtn = page.locator("#btn-start-adventure");
  if (await startBtn.isVisible() && !(await startBtn.isDisabled())) {
    await startBtn.evaluate((el) => el.click());
    await page.waitForSelector("#board", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2500);
    await dismissTutorials(page);
    const onMatch = await page.locator("#view-match:not(.hidden) #board").count();
    if (onMatch) {
      await page.screenshot({ path: path.join(outDir, "01-match.png") });
      console.log("  captured 01-match.png");
    } else {
      console.log("  skipped 01-match.png (match did not start)");
    }
  }
}

try {
  await access(path.join(distDir, "index.html"));
} catch {
  console.error("dist/index.html not found. Run: npm run build");
  process.exit(1);
}

const serverProc = await startServer();
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
      await enterAsGuest(page);
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
try {
  await access(tenMatch);
  const { access: accessFile, unlink } = await import("node:fs/promises");
  let needSeven = true;
  try {
    const old = await import("node:fs/promises").then((m) => m.readFile(sevenMatch));
    // Replace stale 7" match if smaller than 500KB (likely wrong scene)
    needSeven = old.length < 500_000;
  } catch {
    needSeven = true;
  }
  if (needSeven) {
    const sharp = (await import("sharp")).default;
    await sharp(tenMatch).resize(600, 1024, { fit: "cover", position: "top" }).toFile(sevenMatch);
    console.log("  resized tablet-10/01-match.png → tablet-7/01-match.png");
  }
} catch {
  /* optional fallback */
}

if (failed) process.exit(1);
console.log("\nScreenshots saved.");
