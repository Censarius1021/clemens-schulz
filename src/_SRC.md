# src/ — Quellcode der Seite

Design-System und Verhalten. Inhalte liegen getrennt davon in [`../content/`](../content/).

- `main.js` — einziger Entry. Importiert die CSS-Dateien **in Reihenfolge**
  (tokens → base → layout → components), lädt `scripts/motion.js` und setzt das
  Footer-Jahr. Wird in `../index.html` als `<script type="module">` eingebunden.
- `styles/` — das CSS-Design-System (Details: [`styles/_STYLES.md`](styles/_STYLES.md)).
- `scripts/motion.js` — sanftes Fade-up beim Scrollen (Progressive Enhancement,
  respektiert `prefers-reduced-motion`).
- `render/` — **(M2)** Renderer-Funktionen für den Markdown→HTML-Generator
  (siehe [`render/_RENDER.md`](render/_RENDER.md)).

**Designänderungen** beginnen fast immer in `styles/tokens.css` — von dort
kaskadieren Farben, Typo, Abstände und Motion in den Rest.
