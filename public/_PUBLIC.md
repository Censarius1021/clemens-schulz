# public/ — statische Assets

Alles hier wird **unverändert** in den Build (`dist/`) kopiert und unter dem
Base-Pfad ausgeliefert (Vite schreibt referenzierte Pfade korrekt um).

## Committet (Teil des Repos)

- `.nojekyll` — verhindert, dass GitHub Pages Jekyll anwendet (ignoriert sonst `_`-Ordner).
- `favicon.svg` — monochromes „CS"-Monogramm.
- `fonts/` — selbst-gehostete **Fraunces**-woff2-Dateien (von `scripts/fetch-fonts.mjs`).
  Referenziert aus `src/styles/fonts.css`. Keine Google-Fonts-Verbindung.
- `placeholders/` — monochrome **SVG-Platzhalter** (Hero, Fulda, Stuttgart), bis echte
  Fotos vorliegen (M4).

## Generiert (Build-Artefakte, in `.gitignore`)

- `media/` — responsive Bildvarianten (AVIF/WebP/JPEG) aus `scripts/optimize-images.mjs`.
- `sitemap.xml`, `robots.txt` — aus `scripts/generate.mjs`.

Echte Original-Foto-Dateien liegen bei ihren Inhalten in
[`../content/trips/<slug>/photos/`](../content/), **nicht** hier — der Optimierer
erzeugt daraus die Varianten in `media/`. Hier zusätzlich sinnvoll: `CNAME` (bei
eigener Domain).
