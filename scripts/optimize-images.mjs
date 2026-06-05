/* optimize-images.mjs — turn raw trip photos into responsive web variants.
 *
 * Scans content/trips/<slug>/photos/*.{jpg,jpeg,png}, writes resized AVIF/WebP/JPEG
 * variants into public/media/trips/<slug>/photos/, and emits .image-manifest.json
 * (keyed by the content-relative path) that generate.mjs reads to build <picture>.
 *
 * Incremental: skips images whose variants are already newer than the source.
 * Requires `sharp`. If sharp is unavailable it exits 0 (build still works, images
 * just render as plain <img> / fall back to placeholders).
 *
 * Run:  node scripts/optimize-images.mjs   (also runs automatically before dev/build)
 */

import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, extname, basename, relative } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = join(ROOT, "content");
const OUT_BASE = join(ROOT, "public", "media");
const MANIFEST = join(ROOT, ".image-manifest.json");

const WIDTHS = [480, 800, 1200, 1600, 2000];
const RASTER = new Set([".jpg", ".jpeg", ".png"]);

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.warn(
    "⚠ sharp not installed — skipping image optimization (run `npm i` to enable). Images will use placeholders."
  );
  process.exit(0);
}

/** Recursively collect every raster image under content/. */
async function listPhotos(dir = CONTENT) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const dirent of await readdir(dir, { withFileTypes: true })) {
    const abs = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      out.push(...(await listPhotos(abs)));
    } else if (RASTER.has(extname(dirent.name).toLowerCase())) {
      // key = path relative to content/ (matches generate.mjs photo/cover/hero keys)
      out.push({ abs, key: relative(CONTENT, abs).split(/[/\\]/).join("/") });
    }
  }
  return out;
}

async function run() {
  const photos = await listPhotos();
  const manifest = {};

  // Fresh output dir only when there is something to do (keeps it simple/clean).
  if (photos.length && existsSync(OUT_BASE)) {
    await rm(OUT_BASE, { recursive: true, force: true });
  }

  for (const { abs, key } of photos) {
    const name = basename(key, extname(key));
    const relDir = dirname(key); // e.g. "trips/fulda/photos" or "home"
    const outDir = join(OUT_BASE, relDir);
    await mkdir(outDir, { recursive: true });

    const src = sharp(abs).rotate(); // respect EXIF orientation
    const meta = await src.metadata();
    const maxW = meta.width || WIDTHS[WIDTHS.length - 1];
    const widths = WIDTHS.filter((w) => w <= maxW);
    if (!widths.length) widths.push(maxW);

    const urlBase = `/media/${relDir}`;
    const entry = { width: maxW, height: meta.height || 0, avif: [], webp: [], fallback: "" };

    for (const w of widths) {
      const pipeline = src.clone().resize({ width: w, withoutEnlargement: true });
      const targets = [
        { ext: "avif", opts: { quality: 55 }, arr: entry.avif },
        { ext: "webp", opts: { quality: 78 }, arr: entry.webp },
        { ext: "jpg", opts: { quality: 82, mozjpeg: true }, arr: null },
      ];
      for (const t of targets) {
        const outName = `${name}-${w}.${t.ext}`;
        const outPath = join(outDir, outName);
        const url = `${urlBase}/${outName}`;
        if (t.ext === "avif") await pipeline.clone().avif(t.opts).toFile(outPath);
        else if (t.ext === "webp") await pipeline.clone().webp(t.opts).toFile(outPath);
        else await pipeline.clone().jpeg(t.opts).toFile(outPath);
        if (t.arr) t.arr.push({ w, url });
        if (t.ext === "jpg") entry.fallback = url; // largest jpeg wins (loop ascends)
      }
    }

    manifest[key] = entry;
    console.log(`✓ ${key} → ${widths.length} widths × 3 formats`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2), "utf8");
  console.log(
    photos.length
      ? `✓ optimized ${photos.length} photo(s) → .image-manifest.json`
      : "· no raster photos found (manifest empty) — placeholders in use"
  );
}

run().catch((err) => {
  console.error("✗ optimize-images failed:", err);
  process.exit(1);
});
