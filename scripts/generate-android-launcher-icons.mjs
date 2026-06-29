/**
 * Generate Android launcher mipmaps from icons/icon.svg.
 * Run: node scripts/generate-android-launcher-icons.mjs
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svg = readFileSync(join(root, "icons/icon.svg"), "utf8");
const resRoot = join(root, "android/app/src/main/res");

const densities = [
  { dir: "mipmap-mdpi", launcher: 48, foreground: 108 },
  { dir: "mipmap-hdpi", launcher: 72, foreground: 162 },
  { dir: "mipmap-xhdpi", launcher: 96, foreground: 216 },
  { dir: "mipmap-xxhdpi", launcher: 144, foreground: 324 },
  { dir: "mipmap-xxxhdpi", launcher: 192, foreground: 432 },
];

function iconHtml(size) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;width:${size}px;height:${size}px;background:#080a12;display:flex;align-items:center;justify-content:center">${svg.replace(
    'width="512" height="512"',
    `width="${Math.round(size * 0.92)}" height="${Math.round(size * 0.92)}"`
  )}</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const { dir, launcher, foreground } of densities) {
  const outDir = join(resRoot, dir);
  mkdirSync(outDir, { recursive: true });

  for (const [name, size] of [
    ["ic_launcher.png", launcher],
    ["ic_launcher_round.png", launcher],
    ["ic_launcher_foreground.png", foreground],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(iconHtml(size), { waitUntil: "load" });
    await page.screenshot({ path: join(outDir, name), type: "png" });
    console.log("wrote", join(dir, name));
  }
}

await browser.close();
console.log("Done.");
