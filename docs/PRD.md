# Product Requirements Document — clemensschulz.com

> **Status:** Draft v1 · **Owner:** Clemens (maintainer, building on behalf of *Clemens Schulz*, the photographer) · **Date:** 2026-06-04
> **Source brief:** [`../Clemens-Schulz-Webseite`](../Clemens-Schulz-Webseite) — the visual/design spec. This PRD turns that brief into a structured product plan: scope, decisions, milestones, and acceptance criteria.

---

## 1. Summary

A personal photography portfolio for **Clemens Schulz**, a hobby photographer. The site does two things: **shows his photographs**, organised by the trips and places where they were taken, and **tells a little about him** (his life, how he got into photography, his gear, and short written notes on individual images).

It is content-light and image-heavy: the photographs carry the experience; text stays brief and personal. The aesthetic is strictly monochrome, editorial, and quiet — the chrome recedes so the work owns the screen.

**One-line vision:** *An understated, image-first portfolio where a passionate amateur's photographs speak for themselves.*

---

## 2. Goals & non-goals

### Goals
- Present Clemens's photographs beautifully, grouped by trip/location.
- Tell his story (about, gear) and let him publish short notes (journal).
- Look polished and editorial; feel personal, never corporate.
- Be **fast** — image performance is the single most important technical concern for a photo site.
- Be **easy to maintain** by a technical maintainer editing Markdown + committing images via Git.
- Be **cheap and simple to host** — static files on GitHub Pages.
- Meet German legal requirements (Impressum, Datenschutzhinweis) and WCAG AA accessibility.

### Non-goals (explicitly out of scope)
- No e-commerce, print sales, or pricing.
- No authentication, user accounts, comments, or likes.
- No CMS / visual editor for v1 (maintainer edits Markdown directly; revisit later if Clemens wants to self-edit).
- No blog engine beyond a simple Markdown-driven journal.
- No multi-language / i18n — the site is **German-only** (see §11).
- No analytics or tracking beyond what's strictly necessary (keeps the privacy story simple).

---

## 3. Audience

| Audience | Need |
|---|---|
| Friends, family, acquaintances | Browse Clemens's photos easily, read a bit about him. |
| Fellow photography enthusiasts | See the work and the gear behind it. |
| Casual visitors / link recipients | Understand who he is within seconds, with no friction. |

Primary device split is assumed mixed desktop + mobile; the design must collapse gracefully to a single column on mobile.

---

## 4. Success criteria

The build is successful when:
- A visitor lands and within ~5 seconds understands "this is Clemens, a photographer" and can reach a gallery in one click.
- Galleries load fast: **LCP < 2.5s** on a typical connection; images served as modern formats (`webp`/`avif`) with correct `srcset`/`sizes`.
- Lighthouse: **Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95** on the homepage and a gallery page.
- Adding a new trip is: create one Markdown file + drop photos in a folder → it appears in the galleries index and gets its own page. No code edits.
- WCAG AA: full keyboard navigation, visible focus, semantic landmarks, correct heading order, meaningful `alt` on every photo.
- Impressum and Datenschutzhinweis are present and reachable from every page.

---

## 5. Tech stack & architecture (decided)

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Vanilla HTML/CSS/JS + Vite** | Maintainer's choice. No React/framework overhead; ships almost no JS; full control over the editorial design. |
| Content authoring | **Markdown files with frontmatter** | Trips, journal posts, and page copy live as `.md`. Natural for prose, Git-tracked, no database. |
| Markdown → HTML | **Small custom generator** (`scripts/generate.mjs`, using `gray-matter` + `marked`) | Vanilla Vite can't build pages from Markdown alone. A tiny, readable build step renders content to static HTML so the authoring experience stays pure-Markdown. Single source of truth for header/footer/templates. |
| Images | **Committed in the repo**, optimised at build time | Fully version-controlled, no external dependency or cost. Build step generates responsive `srcset` + modern formats. Revisit a CDN only if the repo grows large. |
| Hosting | **GitHub Pages — project page** (`<user>.github.io/<repo>/`) | Free static hosting. Base path configurable via env, defaulting to `/<repo>/`; switch to `/` trivially when a custom domain is added. |
| Deployment | GitHub Actions → build → publish `dist/` | Push to `main` builds and deploys automatically. |

**Architecture in one paragraph:** Content lives in `/content` as Markdown + image folders. `scripts/generate.mjs` reads it, renders each route through a renderer function (shared header/footer/layout), and writes static HTML. Vite bundles the HTML + CSS + JS into `/dist`, which GitHub Pages serves. There is no runtime server and no client-side framework.

---

## 6. Information architecture (German-only)

UI labels and routes are in German for coherence. (English glosses in brackets.)

### Navigation
- Wordmark **"Clemens Schulz"** → `/`
- **Galerien** [Galleries] → `/galerien`
- **Über mich** [About] → `/ueber`
- **Journal** → `/journal`
- **Ausrüstung** [Gear] → `/ausruestung`
- **Kontakt** [Contact] → `/kontakt`
- Optional: Instagram icon (omit if Clemens doesn't want it)

### Footer
- Name / tagline: *"Clemens Schulz — Fotografie"*
- Legal: **Impressum** (`/impressum`) · **Datenschutz** (`/datenschutz`)
- Copyright: *"© {Jahr} Clemens Schulz. Alle Fotografien sind meine eigenen."*

### Sitemap

```
/                       Startseite — Intro + ausgewählte Bilder
/galerien               Übersicht aller Reisen/Orte
/galerien/{slug}        Galerie einer Reise (Detail)
/ueber                  Über mich
/journal                Journal-Übersicht
/journal/{slug}         Einzelner Journal-Beitrag
/ausruestung            Ausrüstung
/kontakt                Kontakt
/impressum              Impressum (rechtlich erforderlich)
/datenschutz            Datenschutzhinweis (rechtlich erforderlich)
```

Slugs stay clean and human-readable (`/galerien/fulda`, `/journal/warum-ich-analog-fotografiere`). The slug is the stable identifier, derived from the title.

> **Open decision (D1):** German routes (`/galerien`, `/ueber`) vs. keeping the brief's English routes (`/galleries`, `/about`). Recommendation: German routes, since the site is German-only. Flag if you prefer English paths.

---

## 7. Content model

```
Trip (Galerie)
  slug         "fulda"               (stable id)
  title        "Fulda"
  location     "Fulda, Deutschland"  (optional)
  date         "2024-09"             (for ordering/labels)
  intro        1–3 sentences         (optional)
  cover        cover image for the index
  photos[]     ordered list of Photo

Photo
  url / src
  alt          meaningful description (Ort + Motiv) — required
  caption      short note (optional)
  meta         { location, date, camera, lens } (optional)

JournalPost
  slug, title, date
  body         Markdown, interleaved with images
  images[]     { url, alt, caption }

AboutPage   (singleton)  bio + optional portrait
GearPage    (singleton)  equipment list/prose
ContactPage (singleton)  contact details (+ optional mailto)
```

Plus two static legal pages.

**Scaffold trips** (placeholders to start, from the brief): `fulda` (Fulda), `stuttgart` (Stuttgart).

---

## 8. Page requirements

There are **five templates**. All share the global header + footer; only the centre changes.

### T1 — Startseite (`/`)
- Optional full-width hero image or short slideshow of favourite shots (up to `100vh`).
- One or two lines of personal intro.
- A small selection of featured trips/images linking into the galleries.
- *Acceptance:* hero is the eager-loaded LCP image; intro + featured grid present; everything reachable by keyboard.

### T2 — Galerien-Übersicht (`/galerien`)
- Heading (e.g. *GALERIEN*).
- Two-column grid (gap 60px) of trip covers; trip name as italic label below each; collapses to one column on mobile.
- Each entry links to `/galerien/{slug}`. No long body copy.

### T3 — Galerie-Detail (`/galerien/{slug}`)
- Heading: trip name.
- Short 1–3 sentence intro.
- Large photographs stacked vertically near full content width (occasional full-bleed allowed); optional per-image captions; subtle meta line (Ort, Datum, Kamera).
- Link back to `/galerien`. Consistent crop ratios within a gallery.

### T4 — Textseite (`/ueber`, `/ausruestung`, `/kontakt`)
- Single column, comfortable reading measure (~600–720px).
- **Über mich:** heading + multi-paragraph life story; optional portrait.
- **Ausrüstung:** heading + list/prose of cameras, lenses, equipment (a list is natural here).
- **Kontakt:** heading + how to reach him. Default to a plain `mailto:` link. A contact *form* is optional and **must not** be wired to any third-party endpoint without explicit confirmation of the provider.

### T5 — Journal (`/journal`, `/journal/{slug}`)
- **Index:** heading + reverse-chronological list (title, date, optional thumbnail + one-line excerpt).
- **Post:** title + date + Markdown body interleaved with images; same reading measure as text pages.

---

## 9. Design system (from the brief — summary)

Full spec lives in [`../Clemens-Schulz-Webseite`](../Clemens-Schulz-Webseite). Key tokens:

- **Strictly monochrome:** `#000` / `#FFF` only. Colour enters *only* through photographs. No accent colour.
- **Type contrast is the signature:** display serif **Fraunces** (free, OFL) for headlines; **system-ui sans** for body/nav/UI. Italic used deliberately for captions and secondary headlines, never the H1.
- **H1/H2:** 64px / 72px line-height, uppercase, weight 400 (H2 italic). **Body:** 15px/24px, weight 300. **Nav:** 15px uppercase.
- **Layout:** max-width 1440px; side padding ~56.6px (≈5%); fixed transparent header, height 80px → every page reserves ~140px top padding. Section padding 140px; grid gap 60px.
- **Footer:** black background, white text, padding 60px.
- **Motion (sparing):** soft fade-up on images entering viewport; subtle link hover. **Respect `prefers-reduced-motion`.**
- **Avoid:** shadows, heavy borders, rounded "cards", gradients, SaaS/dashboard aesthetics, decorative colour, competing display fonts.

Tokens will be implemented as CSS custom properties (see brief §"Recommended CSS Tokens").

---

## 10. Cross-cutting requirements

- **Performance:** responsive `srcset`/`sizes`; lazy-load below-fold; eager-load hero/LCP; serve `webp`/`avif`; `font-display: swap` (or self-host Fraunces) to avoid layout shift.
- **Accessibility (WCAG AA):** semantic landmarks (`header`/`nav`/`main`/`footer`), correct heading order, visible focus states, full keyboard nav, meaningful `alt` per photo.
- **SEO:** per-page `<title>` + meta description, Open Graph tags for sharing (cover image), sensible `lang="de"`, sitemap optional.
- **Legal:** German Impressum + Datenschutzhinweis reachable site-wide; no third-party trackers without a privacy entry.
- **Browser support:** current evergreen browsers (Chrome, Firefox, Safari, Edge); graceful on mobile Safari/Chrome.

---

## 11. Localisation

**German-only.** UI labels, navigation, headings, and content are all German. The two legal pages are German by definition. No language switcher, no i18n framework. (If English is ever wanted, it would be a future epic, not a v1 concern.)

---

## 12. Authoring workflow (maintainer)

The maintainer (you) edits content; Clemens supplies photos and text.

**To add a trip:**
1. Create `content/trips/<slug>/index.md` with frontmatter (title, location, date, intro, cover).
2. Drop photos into `content/trips/<slug>/photos/`.
3. Add `alt` text (and optional captions) in the Markdown.
4. Commit + push → CI builds and deploys.

**To add a journal post:** create `content/journal/<slug>.md` with frontmatter + body.
**To edit a page** (about, gear, contact, legal): edit the matching file in `content/pages/`.

Authoring conventions will be documented in `content/_CONTENT.md`. Brand voice in `brand/voice-and-tone.md`.

---

## 13. Repository structure (planned)

```
/
├── CLAUDE.md                  Routing map: where everything is + what it does
├── README.md                  Human quickstart (install, dev, deploy)
├── docs/
│   └── PRD.md                 ← this document
├── brand/                     Brand voice, tone, design principles (Markdown notes)
├── content/                   ← what the maintainer edits (Markdown + images)
│   ├── pages/                 about, gear, contact, imprint, privacy, home intro
│   ├── trips/<slug>/          index.md + photos/
│   └── journal/<slug>.md
├── src/
│   ├── render/                renderer functions (layout, home, trip, journal, page)
│   └── styles/                tokens.css, base.css, layout.css, components.css
├── scripts/generate.mjs       Markdown → static HTML generator
├── public/                    favicon, static assets, .nojekyll
└── .github/workflows/         deploy to GitHub Pages
```

Each folder gets a small `_*.md` note explaining what lives there and why. A single `CLAUDE.md` at the root maps the whole tree for fast navigation.

---

## 14. Milestones / roadmap

### ✅ M1 — Design system + homepage *(this milestone)*
Proves the look and the foundation.
- Working Vite project (`npm install && npm run dev`).
- Design system implemented: tokens, typography (Fraunces + system sans), layout primitives.
- Global header (fixed, transparent) + footer (black), responsive.
- Polished **Startseite** with hero + intro + featured grid (placeholder images).
- Repo structure, `CLAUDE.md`, per-folder notes, brand voice doc.
- Base path configured for GitHub project page.

**Out of M1:** other routes, the full content generator, real photos.

### ✅ M2 — Content pipeline + full skeleton *(DONE)*
- `scripts/generate.mjs` renders all routes from Markdown (gray-matter + marked).
- Galerien index + trip detail; journal index + post; text pages; legal pages — all navigable.
- Renderers in `src/render/` (single layout source); base-path-aware links; Vite MPA + dev regen watcher.
- Content authored in `content/` (placeholder copy + SVG images).

### ✅ M3 — Performance, a11y, SEO hardening *(DONE)*
- Self-hosted **Fraunces** (no Google Fonts) + `font-display: swap` + preload → privacy + LCP.
- Responsive image pipeline: `scripts/optimize-images.mjs` (sharp) → AVIF/WebP/JPEG `srcset` via `<picture>`; lazy/eager; `width`/`height` for CLS.
- SEO: `sitemap.xml` + `robots.txt`, `<link rel="canonical">`, absolute `og:url`/`og:image` via `SITE_URL`; favicon + `theme-color`.
- A11y: visible focus, semantic landmarks, skip-link, heading order, `prefers-reduced-motion`, meaningful `alt`.
- *Remaining for launch:* run Lighthouse manually; real photos replace placeholders (M4).

### M4 — Real content + launch
- Replace placeholders with Clemens's real trips, photos, bio, gear, journal.
- Final Impressum + Datenschutz text.
- Custom domain (optional) → flip base path to `/`.
- GitHub Actions deploy verified.

---

## 15. Acceptance criteria — M1

- [ ] `npm install && npm run dev` serves the homepage locally with no errors.
- [ ] Monochrome palette only; Fraunces loads for H1/H2; system sans for body/nav.
- [ ] Fixed transparent header with German nav; content clears it (~140px top padding).
- [ ] Black footer with name/tagline + Impressum/Datenschutz links (can point to stubs in M1).
- [ ] Homepage shows hero + intro + featured grid; collapses cleanly to one column on mobile.
- [ ] Image fade-up motion respects `prefers-reduced-motion`.
- [ ] `CLAUDE.md`, per-folder `_*.md` notes, and `brand/voice-and-tone.md` exist.
- [ ] `npm run build` produces a `dist/` that works under a `/<repo>/` base path.

---

## 16. Risks & open questions

| # | Item | Note / recommendation |
|---|---|---|
| D1 | German vs English routes | Recommend German (`/galerien`, `/ueber`). Confirm. |
| R1 | Custom generator is bespoke code | Keep it small, well-commented, single-purpose. Documented in `scripts/_SCRIPTS.md`. |
| R2 | Images in repo could bloat it | Fine for hundreds; if it grows large, move to Git LFS or a CDN (M4+ decision). |
| R3 | Fraunces loading / layout shift | Self-host or `font-display: swap`; preload the display weight used by H1. |
| R4 | Real content availability | Photos, bio, gear, journal copy needed before M4. Placeholders until then. |
| R5 | Datenschutz scope | If a contact form or any third-party (fonts CDN, Instagram embed) is added, the privacy page must reflect it. Prefer self-hosted fonts + `mailto:` to keep it minimal. |
| Q1 | Instagram / social presence | Include an icon in header/footer? Default: omit unless Clemens wants it. |
| Q2 | Hero: single image or slideshow? | Default to a single strong hero image for M1 simplicity; slideshow later if desired. |

---

---

## Annex A — Design system pass (`ui-ux-pro-max` + `design-system` skills)

> Generated by running the `ui-ux-pro-max` skill against the project profile (*portfolio · photography · monochrome · editorial · image-first*) and structuring the output with `design-system` three-layer token methodology. The skill **validated** the brief's direction and contributed a systematic spacing/type scale, interaction states, and a motion/performance spec. Where the tool's generic recommendation conflicted with the brief, the **brief wins** — those overrides are recorded below.

### A.1 What the skill confirmed (brief direction is sound)
- **Style match:** "Exaggerated / Bold Minimalism" — oversized type, high contrast, generous negative space — rated *Performance: Excellent, Accessibility: WCAG AA*. Exactly the brief's editorial monochrome.
- **Pattern:** "Portfolio Grid" — visuals first, fast loading essential, contact in footer. Matches our IA.
- **Validated practices:** reduced-motion, lazy-loading below the fold, `srcset`/WebP/AVIF, fluid hero type via `clamp()`, visible focus states, 4.5:1 contrast, type-as-hero hierarchy.

### A.2 Deliberate overrides (tool suggestion → our decision)

| Tool suggested | Our decision | Why |
|---|---|---|
| Blue accent `#2563EB` | **No accent — strictly monochrome** | Brief: colour enters *only* through the photographs. An accent would compete with the work. |
| `#FAFAFA` off-white background | **Pure `#FFFFFF`** | Brief's strict black/white palette. |
| Playfair Display + Source Serif 4 (all-serif stack) | **Fraunces (display) + system-ui sans** | Brief direction. Fraunces is a flared *old-style* serif — warmer and sturdier at all sizes than Playfair's high-contrast Didone, which gets fragile and "fashion-mag" at body sizes. System-ui sans ships **zero font weight** (faster LCP) and gives the type-contrast signature the brief wants. |
| Masonry project grid | **Uniform-ratio 2-column grid** | Brief: keep consistent crop ratios within a gallery; quiet, not busy. Masonry stays a future option, not v1. |

### A.3 Token architecture (three layers)

**Layer 1 — Primitive** (raw values, never used directly in components):
```css
:root {
  --ink: #000000;
  --paper: #FFFFFF;
  /* translucent inks for hairlines / overlays (the only "greys" allowed) */
  --ink-12: rgba(0,0,0,0.12);   /* hairlines, dividers */
  --ink-60: rgba(0,0,0,0.60);   /* muted/meta text on paper */
  --paper-70: rgba(255,255,255,0.70); /* secondary text on photos */
}
```

**Layer 2 — Semantic** (what components reference):
```css
:root {
  --color-text:         var(--ink);
  --color-text-muted:   var(--ink-60);   /* captions, meta — still ≥4.5:1 */
  --color-bg:           var(--paper);
  --color-text-on-dark: var(--paper);
  --color-on-dark-muted:var(--paper-70);
  --color-footer-bg:    var(--ink);
  --color-hairline:     var(--ink-12);
  --color-focus:        var(--ink);       /* focus ring colour */
}
```

**Layer 3 — Component** (per-element, derived from semantic):
```css
:root {
  --nav-link:        var(--color-text);
  --caption-color:   var(--color-text-muted);
  --footer-text:     var(--color-text-on-dark);
  --cover-ratio:     4 / 5;     /* galleries-index cover aspect */
  --focus-ring:      2px solid var(--color-focus);
  --focus-offset:    2px;
}
```

> Rule: components only ever read **semantic/component** tokens — never raw hex. Keeps the monochrome contract enforceable and a future dark variant trivial (though none is planned).

### A.4 Type scale (system-ui sans for body/UI; Fraunces for display)

| Token | px (desktop) | Use | LH | Notes |
|---|---|---|---|---|
| `--text-meta` | 13 | labels, dates, gear meta | 20 | uppercase, tracked +0.04em |
| `--text-sm` | 15 | body, nav, captions | 24 | brief body value |
| `--text-base` | 16 | base / long-form reading | 26 | min 16px on mobile (no iOS auto-zoom) |
| `--text-lead` | 18 | intro / hero caption | 28 | |
| `--text-lg` | 24 | small section headers | 30 | |
| `--text-xl` | 32 | sub-headlines | 38 | |
| `--text-display` | **clamp(40px, 8vw, 64px)** | H1/H2 (Fraunces) | 1.05 | fluid; brief's 64px is the desktop ceiling; `opsz` high on large sizes |

H1 normal, H2 italic (brief). Body line-length capped at **65–75ch** for text pages (`--measure: 68ch`).

### A.5 Spacing scale (8px rhythm)

`4 · 8 · 12 · 16 · 24 · 32 · 40 · 56 · 80 · 112 · 140` (px), exposed as `--space-*`.

Brief values mapped onto the rhythm (two were off-grid — recommend rounding):
- Section padding **140** ✓ · Header height **80** ✓ · Caption margin **16** ✓
- Container side padding **56.6 → 56** (on-grid)
- Grid gap **60 → 64** (on-grid; or keep 60 if you prefer the brief's exact value — minor)

### A.6 Interaction states (monochrome-safe, no layout shift)

| Element | Default | Hover | Focus-visible | Active |
|---|---|---|---|---|
| Nav link | text, no underline | underline grows in (transform/opacity, not reflow) | `--focus-ring`, offset 2px | opacity 0.7 |
| Current nav item | underlined / weight up | — | — | — |
| Text link | underlined | underline thickens / opacity 0.7 | `--focus-ring` | — |
| Gallery cover | image at opacity 1 | image opacity → 0.85 **+** italic title shifts to full ink (no scale that reflows) | `--focus-ring` around card | — |

All clickable elements get `cursor: pointer`; all interactive elements keep a **visible focus ring** (never `outline:none` without a replacement). Touch targets ≥ 44×44px.

### A.7 Motion spec (sparing — brief mandate)

```css
:root {
  --motion-fast: 150ms;   /* hovers */
  --motion-base: 240ms;   /* image fade-up enter */
  --motion-exit: 170ms;   /* ~70% of enter */
  --ease-out: cubic-bezier(0.16, 1, 0.30, 1);  /* entering */
  --ease-in:  cubic-bezier(0.40, 0, 1, 1);     /* exiting */
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```
- Image **fade-up** on viewport entry (opacity 0→1, translateY 16px→0) via IntersectionObserver. Animate **only `transform`/`opacity`**.
- Max **1–2 animated elements per view**; no scroll-jacking, no decorative parallax (causes motion sickness — skill §Accessibility).
- `scroll-behavior: smooth` on `html` for in-page anchors.
- Exit shorter than enter; ease-out in, ease-in out.

### A.8 Image performance (the #1 technical priority)

- Generator emits responsive `srcset` + `sizes`; serve **AVIF → WebP → JPEG** fallback.
- Every `<img>` carries intrinsic `width`/`height` (or `aspect-ratio`) → **CLS < 0.1**.
- Hero/LCP image: `loading="eager"` + `fetchpriority="high"`; everything below the fold `loading="lazy" decoding="async"`.
- Never ship a 4000px file into a 400px slot — size variants per breakpoint.

### A.9 Responsive

Breakpoints: **375 / 768 / 1024 / 1440**. Mobile-first. Galleries grid 2-col → 1-col below 768. No horizontal scroll (`overflow-x` guarded). Header stays fixed; each page reserves ~140px top clearance. `min-height: 100dvh` over `100vh` for any full-height hero.

### A.10 Pre-build acceptance checklist (from skill, monochrome-adapted)

- [ ] No emoji as icons — inline **SVG** only (Lucide/Heroicons or custom), consistent stroke width.
- [ ] `cursor: pointer` on all clickable elements.
- [ ] Hover transitions 150–300ms; respect `prefers-reduced-motion`.
- [ ] Text contrast ≥ 4.5:1 (trivial: pure black on white; verify muted `--ink-60` on white = ~7:1 ✓).
- [ ] Visible focus ring on every interactive element; tab order = visual order.
- [ ] Sequential headings (one `h1` per page, no skipped levels).
- [ ] Meaningful `alt` per photo (Ort + Motiv); decorative images `alt=""`.
- [ ] Responsive verified at 375 / 768 / 1024 / 1440; no horizontal scroll.
- [ ] Semantic landmarks: `header` / `nav` / `main` / `footer`; skip-link to `main`.

---

*End of PRD v1.1 (+ Annex A design pass). Alignment questions welcome — flag anything in §16 or the A.2 overrides you want to settle before M1 build.*
