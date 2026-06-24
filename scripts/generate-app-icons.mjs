/**
 * Generate PNG app icons from SVG (Playwright).
 * Run: node scripts/generate-app-icons.mjs
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const iconDir = join(root, "assets/icon");
const svg = readFileSync(join(iconDir, "app-icon.svg"), "utf8");

const html = `<!DOCTYPE html><html><body style="margin:0;background:#080a12;display:flex;align-items:center;justify-content:center;width:1024px;height:1024px">${svg}</body></html>`;

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
await page.goto(`http://127.0.0.1:${port}/`);
const sizes = [1024, 512, 192, 180];
for (const size of sizes) {
  await page.setViewportSize({ width: size, height: size });
  const out = join(iconDir, size === 1024 ? "app-icon-1024.png" : `app-icon-${size}.png`);
  await page.screenshot({ path: out, type: "png" });
  console.log("wrote", out);
}
await browser.close();
server.close();
