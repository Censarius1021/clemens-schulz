/* generate.mjs — Markdown → static HTML generator.
 *
 * Reads content/ (frontmatter via gray-matter, body via marked), renders each
 * route through the functions in src/render/, writes static HTML files at the
 * project root, plus sitemap.xml + robots.txt into public/, and emits
 * .vite-entries.json (the multi-page input manifest).
 *
 * Optional: if .image-manifest.json exists (written by scripts/optimize-images.mjs),
 * trip photos render as responsive <picture> elements.
 *
 * Env:
 *   SITE_BASE  deploy base path   (default "/")
 *   SITE_URL   absolute origin    (e.g. "https://user.github.io") — enables
 *              canonical/og:url and absolute sitemap/og:image. Optional.
 *
 * Run directly:  node scripts/generate.mjs
 * Or imported:   import { generate } from "./scripts/generate.mjs"
 */

import { readFile, writeFile, readdir, mkdir, rm } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

import { renderDocument } from "../src/render/layout.js";
import { renderHome } from "../src/render/home.js";
import { renderGalleries } from "../src/render/galleries.js";
import { renderTrip } from "../src/render/trip.js";
import { renderJournalIndex, renderJournalPost } from "../src/render/journal.js";
import { renderPage } from "../src/render/page.js";
import { withBase } from "../src/render/util.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = join(ROOT, "content");
const PUBLIC = join(ROOT, "public");

marked.setOptions({ gfm: true });

const mdBlock = (s) => (s ? marked.parse(String(s)) : "");
const mdInline = (s) => (s ? marked.parseInline(String(s)) : "");

function toDescription(html, fallback, max = 160) {
  const text = String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const out = text || fallback;
  return out.length > max ? out.slice(0, max - 1).trimEnd() + "…" : out;
}

async function readMd(relPath) {
  const raw = await readFile(join(CONTENT, relPath), "utf8");
  return matter(raw);
}

function loadImageManifest() {
  const p = join(ROOT, ".image-manifest.json");
  if (existsSync(p)) {
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      /* ignore malformed manifest → plain images */
    }
  }
  return {};
}

async function loadTrips() {
  const dir = join(CONTENT, "trips");
  const entries = await readdir(dir, { withFileTypes: true });
  const trips = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const { data } = await readMd(join("trips", e.name, "index.md"));
    const photos = (Array.isArray(data.photos) ? data.photos : []).map((ph) => ({
      ...ph,
      // manifest key matches the optimizer's: path relative to content/
      key: `trips/${e.name}/${String(ph.src).replace(/^\.?\//, "")}`,
    }));
    const cover = data.cover || "/placeholders/hero.svg";
    // A content-relative cover (e.g. "photos/01.jpg") resolves through the
    // optimizer manifest; an absolute "/placeholders/…" stays a plain asset.
    const isAbsolute = cover.startsWith("/") || /^https?:\/\//.test(cover);
    trips.push({
      slug: e.name,
      title: data.title || e.name,
      location: data.location || "",
      date: data.date || "",
      cover,
      coverKey: isAbsolute ? null : `trips/${e.name}/${cover.replace(/^\.?\//, "")}`,
      introHtml: mdInline(data.intro),
      introText: data.intro || "",
      photos,
    });
  }
  trips.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return trips;
}

async function loadJournal() {
  const dir = join(CONTENT, "journal");
  const files = await readdir(dir);
  const posts = [];
  for (const f of files) {
    if (!f.endsWith(".md") || f.startsWith("_")) continue;
    const { data, content } = await readMd(join("journal", f));
    posts.push({
      slug: f.replace(/\.md$/, ""),
      title: data.title || f,
      date: data.date || "",
      excerpt: data.excerpt || "",
      bodyHtml: mdBlock(content),
    });
  }
  posts.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return posts;
}

const GENERATED_ROOT = [
  "index.html",
  "galerien",
  "journal",
  "ueber",
  "ausruestung",
  "kontakt",
  "impressum",
  "datenschutz",
];
const GENERATED_PUBLIC = ["sitemap.xml", "robots.txt"];

async function cleanup() {
  await Promise.all([
    ...GENERATED_ROOT.map((p) =>
      rm(join(ROOT, p), { recursive: true, force: true })
    ),
    ...GENERATED_PUBLIC.map((p) => rm(join(PUBLIC, p), { force: true })),
  ]);
}

export async function generate({
  base = process.env.SITE_BASE || "/",
  siteUrl = process.env.SITE_URL || "",
} = {}) {
  await cleanup();
  const SITE_URL = siteUrl.replace(/\/$/, "");

  const images = loadImageManifest();
  const trips = await loadTrips();
  const posts = await loadJournal();
  // Resolve each trip's cover to its optimized manifest entry (if any).
  for (const t of trips) t.coverEntry = t.coverKey ? images[t.coverKey] : null;
  const tripBySlug = Object.fromEntries(trips.map((t) => [t.slug, t]));

  // canonical/og helpers
  const absUrl = (path) =>
    SITE_URL ? SITE_URL + withBase(base, path === "" ? "/" : path) : "";
  const ogImageOut = (img) =>
    SITE_URL ? SITE_URL + withBase(base, img) : withBase(base, img);

  /** @type {{name:string, path:string, route:string, html:string}[]} */
  const pages = [];

  /** Build a page object with canonical/og baked in. `path` ends with "/" (or "" for home). */
  function makePage({ name, path, title, description, active = "", hasHero = false, main, ogImage = "/placeholders/hero.svg" }) {
    const canonical = absUrl(path);
    const html = renderDocument({
      title,
      description,
      base,
      active,
      hasHero,
      main,
      ogImage: ogImageOut(ogImage),
      canonical,
      ogUrl: canonical,
    });
    return {
      name,
      path,
      route: path === "" ? "index.html" : `${path}index.html`,
      html,
    };
  }

  // ---- Home ----
  {
    const { data, content } = await readMd("pages/home.md");
    const bodyHtml = mdBlock(content);
    const featuredTrips = (data.featured || [])
      .map((slug) => tripBySlug[slug])
      .filter(Boolean);
    // Hero: content-relative (e.g. "home/hero.jpg") → optimized <picture>;
    // absolute "/placeholders/…" → plain placeholder image.
    const heroImg = data.hero_image || "/placeholders/hero.svg";
    const heroAbsolute = heroImg.startsWith("/") || /^https?:\/\//.test(heroImg);
    const heroKey = heroAbsolute ? null : heroImg.replace(/^\.?\//, "");
    const heroEntry = heroKey ? images[heroKey] : null;
    const heroFallback = heroEntry ? heroImg : heroAbsolute ? heroImg : "/placeholders/hero.svg";
    pages.push(
      makePage({
        name: "index",
        path: "",
        description: toDescription(
          bodyHtml,
          "Persönliches Fotografie-Portfolio von Clemens Schulz."
        ),
        hasHero: true,
        main: renderHome({ base, frontmatter: data, bodyHtml, featuredTrips, heroEntry, heroFallback }),
        ogImage: heroEntry ? heroEntry.fallback : heroFallback,
      })
    );
  }

  // ---- Galleries index ----
  pages.push(
    makePage({
      name: "galerien",
      path: "galerien/",
      title: "Galerien",
      description: "Alle Reisen und Orte — Fotogalerien von Clemens Schulz.",
      active: "galerien",
      main: renderGalleries({ base, trips }),
    })
  );

  // ---- Trip detail pages ----
  for (const trip of trips) {
    pages.push(
      makePage({
        name: `galerien-${trip.slug}`,
        path: `galerien/${trip.slug}/`,
        title: trip.title,
        description: toDescription(trip.introText, `Fotogalerie: ${trip.title}.`),
        active: "galerien",
        main: renderTrip({ base, trip, images }),
        ogImage: trip.cover,
      })
    );
  }

  // ---- Journal index ----
  pages.push(
    makePage({
      name: "journal",
      path: "journal/",
      title: "Journal",
      description: "Notizen zu Bildern, Reisen und Gedanken.",
      active: "journal",
      main: renderJournalIndex({ base, posts }),
    })
  );

  // ---- Journal posts ----
  for (const post of posts) {
    pages.push(
      makePage({
        name: `journal-${post.slug}`,
        path: `journal/${post.slug}/`,
        title: post.title,
        description: toDescription(post.excerpt || post.bodyHtml, post.title),
        active: "journal",
        main: renderJournalPost({ base, post }),
      })
    );
  }

  // ---- Text / legal pages ----
  const textPages = [
    { file: "about.md", path: "ueber/", name: "ueber", active: "ueber" },
    { file: "gear.md", path: "ausruestung/", name: "ausruestung", active: "ausruestung" },
    { file: "contact.md", path: "kontakt/", name: "kontakt", active: "kontakt" },
    { file: "imprint.md", path: "impressum/", name: "impressum", active: "" },
    { file: "privacy.md", path: "datenschutz/", name: "datenschutz", active: "" },
  ];

  for (const p of textPages) {
    const { data, content } = await readMd(`pages/${p.file}`);
    const bodyHtml = mdBlock(content);
    let extraHtml = "";
    if (p.name === "kontakt" && data.email) {
      extraHtml = `<p class="contact-email"><a class="link-inline" href="mailto:${data.email}">${data.email}</a></p>`;
    }
    pages.push(
      makePage({
        name: p.name,
        path: p.path,
        title: data.title || p.name,
        description: toDescription(bodyHtml, data.title || p.name),
        active: p.active,
        main: renderPage({ title: data.title || p.name, bodyHtml, extraHtml }),
      })
    );
  }

  // ---- Write HTML files + entry manifest ----
  const manifest = {};
  for (const page of pages) {
    const outPath = join(ROOT, page.route);
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, page.html, "utf8");
    manifest[page.name] = outPath;
  }
  await writeFile(
    join(ROOT, ".vite-entries.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  // ---- sitemap.xml + robots.txt (into public/, copied to dist root by Vite) ----
  await mkdir(PUBLIC, { recursive: true });
  const urls = pages
    .map((p) => {
      const loc = SITE_URL
        ? SITE_URL + withBase(base, p.path === "" ? "/" : p.path)
        : withBase(base, p.path === "" ? "/" : p.path);
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");
  await writeFile(
    join(PUBLIC, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8"
  );
  const sitemapRef = SITE_URL
    ? `\nSitemap: ${SITE_URL}${withBase(base, "sitemap.xml")}`
    : "";
  await writeFile(
    join(PUBLIC, "robots.txt"),
    `User-agent: *\nAllow: /${sitemapRef}\n`,
    "utf8"
  );

  return {
    pages: pages.length,
    trips: trips.length,
    posts: posts.length,
    base,
    siteUrl: SITE_URL || "(none)",
    optimizedImages: Object.keys(images).length,
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generate()
    .then((r) =>
      console.log(
        `✓ ${r.pages} pages (${r.trips} trips, ${r.posts} posts) · base "${r.base}" · site "${r.siteUrl}" · ${r.optimizedImages} optimized images`
      )
    )
    .catch((err) => {
      console.error("✗ generate failed:", err);
      process.exit(1);
    });
}
