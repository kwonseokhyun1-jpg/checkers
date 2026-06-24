/**
 * Branded store screenshot placeholders (no auth required).
 */
import { chromium } from "playwright";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "assets/store");

const frames = [
  { file: "01-decks.png", title: "Build your spell deck", subtitle: "30 cards · max 3 copies per spell" },
  { file: "02-adventure.png", title: "Adventure mode", subtitle: "50 stages across 5 worlds" },
  { file: "03-match.png", title: "Spells on the board", subtitle: "Cast · move · capture · crown" },
  { file: "04-shop.png", title: "Shop & collection", subtitle: "Chests · cosmetics · mystery boxes" },
  { file: "05-pvp.png", title: "Real-time PvP", subtitle: "Challenge players worldwide" },
];

function frameHtml({ title, subtitle }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
    *{box-sizing:border-box} body{margin:0;width:390px;height:844px;font-family:system-ui,sans-serif;background:#080a12;color:#eef2f8;overflow:hidden}
    .bg{position:absolute;inset:0;background:radial-gradient(ellipse 90% 60% at 50% 0%,#1a2438,#080a12)}
    .logo{position:relative;width:72px;height:72px;margin:72px auto 16px;border-radius:16px;background:#121a28;border:1px solid #3d5270;display:flex;align-items:center;justify-content:center}
    .piece{position:absolute;width:20px;height:20px;border-radius:50%}.r{top:18px;left:16px;background:#c53030}.b{bottom:14px;right:14px;background:#2d3748}
    .spark{position:relative;color:#e8c547;font-size:1.2rem}
    h1{position:relative;text-align:center;font-size:1.55rem;margin:0 1rem}
    p{position:relative;text-align:center;color:#8b9cb3;margin:0.5rem 1.5rem 0}
    .shot{position:absolute;left:24px;right:24px;bottom:120px;height:380px;border-radius:18px;border:1px solid #3d5270;background:linear-gradient(160deg,#121a28,#1a2438);box-shadow:0 20px 50px rgba(0,0,0,.45)}
    .tabbar{position:absolute;left:0;right:0;bottom:0;height:84px;background:#121a28;border-top:1px solid #3d5270;display:flex;justify-content:space-around;align-items:center;padding:0 8px 12px}
    .tab{font-size:.65rem;color:#8b9cb3;text-align:center}.tab strong{display:block;color:#e8c547;margin-bottom:4px}
  </style></head><body>
    <div class="bg"></div>
    <div class="logo"><span class="piece r"></span><span class="piece b"></span><span class="spark">✦</span></div>
    <h1>${title}</h1><p>${subtitle}</p>
    <div class="shot"></div>
    <div class="tabbar">
      <div class="tab"><strong>◆</strong>Decks</div>
      <div class="tab"><strong>◇</strong>Shop</div>
      <div class="tab"><strong>▶</strong>Play</div>
      <div class="tab"><strong>⚔</strong>PvP</div>
      <div class="tab"><strong>★</strong>Quests</div>
    </div>
  </body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
for (const frame of frames) {
  await page.setContent(frameHtml(frame), { waitUntil: "load" });
  await page.screenshot({ path: join(outDir, frame.file), type: "png" });
  console.log("wrote", frame.file);
}
await browser.close();
