# scripts/ — Build-Skripte

## generate.mjs — Markdown → statisches HTML ✅ (M2)

Liest die Inhalte aus [`../content/`](../content/), rendert sie über die Funktionen
in [`../src/render/`](../src/render/_RENDER.md) und schreibt statische HTML-Seiten
ins Projektwurzelverzeichnis. Vite bündelt sie anschließend als Multi-Page-App.

**Ablauf:**
1. Alte generierte Ausgaben löschen (`cleanup()`), damit nichts Veraltetes bleibt.
2. `content/pages/*.md`, `content/trips/*/index.md`, `content/journal/*.md` einlesen
   (Frontmatter via `gray-matter`, Body via `marked`).
3. Pro Route die passende Renderer-Funktion aufrufen (gemeinsames Layout aus
   `layout.js`); interne Links via `url(base, …)` **base-path-bewusst**.
4. HTML schreiben — inkl. verschachtelter Routen (`galerien/<slug>/index.html`).
5. `.vite-entries.json` schreiben (Name → Pfad), das `vite.config.js` als
   Multi-Page-`input` liest.

**Aufruf:** `node scripts/generate.mjs` (oder automatisch via `npm run dev`/`build`,
die `generate` vorschalten). Im Dev-Modus regeneriert ein Vite-Plugin
(`vite.config.js`) bei Änderungen unter `content/` oder `src/render/` automatisch
und lädt die Seite neu.

**Export:** `generate({ base })` — wird auch von `vite.config.js` importiert.

**Abhängigkeiten:** `gray-matter`, `marked` (in `../package.json`).

> Die generierten HTML-Dateien (Wurzel `index.html`, `galerien/`, `journal/`, …),
> `public/sitemap.xml`, `public/robots.txt` und `.vite-entries.json` sind
> **Build-Artefakte** und in `.gitignore` ausgenommen.

## optimize-images.mjs — responsive Bilder ✅ (M3)

Scannt `content/trips/<slug>/photos/*.{jpg,jpeg,png}`, erzeugt mit **sharp** je Foto
mehrere Breiten (480–2000px) als **AVIF/WebP/JPEG** in `public/media/...` und schreibt
`.image-manifest.json`. Der Generator baut daraus `<picture>`-Elemente mit `srcset`.
Inkrementell; läuft ohne sharp einfach durch (Fallback auf Platzhalter). Aufruf:
`npm run optimize` (automatisch vor `dev`/`build`).

## fetch-fonts.mjs — Fraunces selbst hosten ✅ (M3)

Lädt die woff2-Dateien von Google Fonts herunter nach `public/fonts/` und schreibt
`src/styles/fonts.css` mit lokalen `@font-face`-Regeln (inkl. `unicode-range`,
`font-display: swap`). Einmalig/zum Aktualisieren: `npm run fetch-fonts`. Die
woff2-Dateien und `fonts.css` werden **committet** (keine externe Schrift-Verbindung).
