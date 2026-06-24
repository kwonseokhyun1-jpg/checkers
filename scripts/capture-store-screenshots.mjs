/**
 * Capture store listing screenshots (390×844 mobile viewport).
 * Run: node scripts/capture-store-screenshots.mjs
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "assets/store");

function staticServer() {
  return createServer((req, res) => {
    let path = req.url.split("?")[0];
    if (path === "/") path = "/index.html";
    const file = join(root, path.replace(/^\//, ""));
    try {
      const data = readFileSync(file);
      const ext = file.split(".").pop();
      const types = { html: "text/html", css: "text/css", js: "text/javascript", svg: "image/svg+xml", png: "image/png", mp3: "audio/mpeg" };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
}

const shots = [
  { file: "01-decks.png", tab: "deck", wait: 800 },
  { file: "02-adventure.png", tab: "play", wait: 1200 },
  { file: "04-shop.png", tab: "chests", wait: 800 },
  { file: "05-pvp.png", tab: "pvp", wait: 800 },
];

const server = staticServer();
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

for (const shot of shots) {
  await page.goto(base);
  await page.waitForTimeout(1500);
  const btn = page.locator(`.tab-btn[data-tab="${shot.tab}"]`);
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(shot.wait);
  }
  await page.screenshot({ path: join(outDir, shot.file), fullPage: false });
  console.log("captured", shot.file);
}

await browser.close();
server.close();
console.log("Done — note: match screenshot (03) requires signed-in gameplay; capture manually or extend script.");
