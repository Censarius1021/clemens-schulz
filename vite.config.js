import { defineConfig } from "vite";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { generate } from "./scripts/generate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Base path for GitHub Pages.
 * - Custom domain (clemensschulz.com)  → SITE_BASE="/"  (default)
 * - Project page (user.github.io/repo) → SITE_BASE="/<repo>/"
 * The CI workflow passes it automatically; for a manual build:
 *   SITE_BASE="/<repo>/" npm run build
 */
const base = process.env.SITE_BASE || "/";

// Multi-page input: the generator writes .vite-entries.json (name → html path).
// npm scripts run `generate` before vite, so this exists at config eval time.
function readEntries() {
  const manifestPath = resolve(__dirname, ".vite-entries.json");
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, "utf8"));
  }
  return { index: resolve(__dirname, "index.html") };
}

/**
 * Dev plugin: regenerate HTML when content or renderers change, then full-reload.
 * (CSS/JS in src/ are handled by Vite's own HMR.)
 */
function contentGeneratorPlugin() {
  const shouldRegen = (file) =>
    file.includes("/content/") ||
    file.includes("/src/render/") ||
    file.endsWith("scripts/generate.mjs");

  return {
    name: "content-generator",
    async configureServer(server) {
      await generate({ base }); // ensure fresh on server start
      const regen = async (file) => {
        if (!shouldRegen(file)) return;
        try {
          const r = await generate({ base });
          server.config.logger.info(
            `content regenerated (${r.pages} pages) — reloading`
          );
          server.ws.send({ type: "full-reload" });
        } catch (err) {
          server.config.logger.error("content generate failed: " + err.message);
        }
      };
      server.watcher.add(resolve(__dirname, "content"));
      server.watcher.on("change", regen);
      server.watcher.on("add", regen);
      server.watcher.on("unlink", regen);
    },
  };
}

export default defineConfig({
  base,
  appType: "mpa", // multi-page app: no SPA fallback
  plugins: [contentGeneratorPlugin()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: readEntries(),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
