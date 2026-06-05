# styles/ — CSS-Design-System

Geladen in dieser Reihenfolge (über `../main.js`):

0. **fonts.css** — `@font-face` für selbst-gehostetes **Fraunces** (generiert von
   `../../scripts/fetch-fonts.mjs`; nicht von Hand bearbeiten). Dateien in `public/fonts/`.
1. **tokens.css** — Design-Tokens in drei Schichten: *primitive → semantic →
   component*. **Die eine Quelle der Wahrheit.** Hier Farben/Typo/Abstände/Motion
   ändern. Komponenten lesen nur semantische/Komponenten-Tokens, nie rohe Hex-Werte.
2. **base.css** — Reset, Dokument-Defaults, Typo-Primitive (H1/H2 Fraunces, Body),
   Fokus-Ringe, Skip-Link, globaler `prefers-reduced-motion`-Schalter.
3. **layout.css** — globale Chrome: fixierter transparenter Header, schwarzer
   Footer, `.container`, `.section`, `.measure`.
4. **components.css** — Seiten-Komponenten: Hero, Intro, Galerie-Raster
   (`.gallery-grid`/`.gallery-card`), Scroll-Reveal (`.reveal`).

## Monochrom-Vertrag

Nur Schwarz/Weiß. Die einzigen „Grautöne" sind transluzentes Schwarz/Weiß
(`--ink-12` Haarlinien, `--ink-60` gedämpfter Text, `--paper-70` Text auf Fotos).
**Kein Akzentton** — Farbe kommt nur durch die Fotografien.

## Erweitern

Neue Komponenten (Reise-Detail, Journal, Formulare) kommen mit ihren Templates in
**M2** hinzu — als zusätzliche Regeln in `components.css` oder, bei Bedarf, eigene
Dateien, die in `../main.js` nach `components.css` importiert werden.
