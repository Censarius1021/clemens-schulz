# clemensschulz.com

Persönliches Fotografie-Portfolio für **Clemens Schulz**. Schlicht, monochrom, bildzentriert. Statische Seite (Vite), deploybar auf GitHub Pages.

> Routing & Architektur für die Weiterarbeit: siehe [CLAUDE.md](CLAUDE.md).
> Vollständige Spezifikation: [docs/PRD.md](docs/PRD.md).

## Schnellstart

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build & Vorschau

```bash
npm run build      # → dist/
npm run preview
```

### Deploy auf GitHub Pages

- **Projektseite** (`username.github.io/<repo>`): Der CI-Workflow unter
  `.github/workflows/deploy.yml` baut bei jedem Push auf `main` und setzt den
  Base-Pfad automatisch auf `/<repo>/`.
- **Eigene Domain** (clemensschulz.com): Base-Pfad ist `/` — `SITE_BASE` weglassen.

Manuell mit Projekt-Base bauen:

```bash
SITE_BASE="/<repo>/" npm run build
```

## Aktueller Stand

**Milestone 1–3** sind umgesetzt: Design-System, Homepage, alle Routen aus Markdown,
**selbst-gehostete Schriften**, **responsive Bild-Pipeline** (AVIF/WebP/JPEG),
sitemap/robots, Canonical/OG, Favicon. Als Nächstes M4: echte Fotos & Texte, finale
Rechtstexte, Domain — Fahrplan in [docs/PRD.md](docs/PRD.md) §14.

## Inhalte pflegen

Alles in [`content/`](content/) als Markdown — Anleitung in
[content/_CONTENT.md](content/_CONTENT.md). Neue Reise = Ordner unter
`content/trips/<slug>/` mit `index.md` + Fotos in `photos/`, dann unter `photos:`
eintragen. Neuer Journal-Beitrag = `content/journal/<slug>.md`. `npm run dev`
optimiert Bilder, regeneriert HTML und lädt neu. Neue Fotos brauchen einmal
`npm run optimize` (oder Dev-Neustart).

## Tech

- Vanilla HTML/CSS/JS + [Vite](https://vitejs.dev/) — kein Framework.
- Inhalte als **Markdown** in `content/`, gerendert von `scripts/generate.mjs`.
- Bilder: `scripts/optimize-images.mjs` (sharp) → responsive `<picture>`.
- Design-Tokens in `src/styles/tokens.css` (eine Quelle der Wahrheit).
- Display-Schrift **Fraunces** (OFL, **selbst gehostet**); Fließtext via `system-ui`.
