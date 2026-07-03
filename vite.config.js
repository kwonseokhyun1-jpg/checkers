import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sirv from "sirv";
import { VitePWA } from "vite-plugin-pwa";

const root = fileURLToPath(new URL(".", import.meta.url));
const gameStaticDirs = ["assets", "supabase"];

/** Serve game assets during `vite` dev (not part of the JS bundle). */
function serveGameStaticDirs() {
  return {
    name: "serve-game-static",
    configureServer(server) {
      for (const dir of gameStaticDirs) {
        const abs = resolve(root, dir);
        server.middlewares.use(`/${dir}`, sirv(abs, { dev: true, etag: true }));
      }
      server.middlewares.use("/manifest.json", sirv(resolve(root, "public"), { dev: true, etag: true }));
      server.middlewares.use("/icons", sirv(resolve(root, "public/icons"), { dev: true, etag: true }));
    },
  };
}

export default defineConfig({
  base: "./",
  publicDir: resolve(root, "public"),
  build: {
    outDir: "dist",
    assetsDir: "bundled",
    modulePreload: false,
  },
  plugins: [
    serveGameStaticDirs(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/**/*"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{html,woff2,woff,ico,svg,png,json}"],
        globIgnores: ["**/bundled/**", "**/assets/audio/**"],
        runtimeCaching: [
          {
            urlPattern: /\/bundled\/.*\.(js|css)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "js-chunks",
              expiration: { maxEntries: 48, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\/assets\//,
            handler: "CacheFirst",
            options: {
              cacheName: "game-assets",
              expiration: { maxEntries: 256, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
