# Gestaltungsprinzipien (Kurzfassung)

Verdichtete visuelle Regeln. Werte & Tokens: [`../src/styles/tokens.css`](../src/styles/tokens.css).
Begründungen & Details: [`../docs/PRD.md`](../docs/PRD.md) Annex A.

## Die sieben Leitsätze

1. **Strikt monochrom.** Nur Schwarz `#000` und Weiß `#fff`. **Kein Akzentton.**
   Farbe kommt ausschließlich durch die Fotografien.
2. **Bild zuerst.** Großformatige Bilder dominieren; UI tritt zurück und
   konkurriert nie mit der Arbeit.
3. **Editorial, nicht korporativ.** Viel Weißraum, selbstbewusste Typografie.
   Keine Cards, keine Schatten, keine „App"-Rundungen.
4. **Typokontrast als Signatur.** Display-Serif **Fraunces** für Überschriften
   gegen klare **system-ui**-Sans für Fließtext/Navigation.
5. **Kursiv als bewusstes Mittel.** Für Bildunterschriften, Labels und die
   sekundäre Überschrift (H2) — sparsam, nie für die H1.
6. **Leise Chrome.** Header/Footer treten zurück; die Bilder besitzen den Viewport.
7. **Persönlich, nicht effekthascherisch.** Bewegung und Effekte zurückhaltend.

## Konkrete Regeln

- **Farbe:** kein Akzent. Einzige „Grautöne" sind transluzentes Schwarz/Weiß
  (Haarlinien, Bild-Overlays).
- **Typo:** H1 64px uppercase (fluid via `clamp`), H2 64px kursiv. Body 15px/300.
  Nav 15px uppercase. Lesebreite 65–75 Zeichen.
- **Raster:** Container max 1440px, 56px Seitenrand. 2-spaltiges Galerieraster,
  Gap 64px, bricht unter 768px auf 1 Spalte. Gleichmäßige Crop-Ratios je Galerie.
- **Motion:** 150–300ms, ease-out rein / ease-in raus. Sanftes Fade-up beim
  Scrollen. `prefers-reduced-motion` respektieren. Max. 1–2 Elemente pro Ansicht.
- **Icons:** nur Inline-SVG, einheitliche Strichstärke. **Keine Emojis.**

## Was zu vermeiden ist

Schatten · schwere Rahmen · runde Cards · Verläufe · SaaS-/Dashboard-Optik ·
dekorative Akzentfarben · mehrere konkurrierende Display-Schriften · alles, was
von den Fotos ablenkt.
