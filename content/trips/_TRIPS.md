# trips/ — Reisen / Galerien

Eine Reise = ein Ordner = eine Galerie unter `/galerien/<slug>`.

```
trips/
└── <slug>/
    ├── index.md      Frontmatter (title, location, date, intro, cover, photos[])
    └── photos/       die Bilddateien dieser Reise
```

Schema & Anleitung: [`../_CONTENT.md`](../_CONTENT.md).
Aktuelle Platzhalter-Reisen: `fulda/`, `stuttgart/` (aus dem Brief).

> `fulda/photos/01.jpg` ist ein **Beispielfoto**, das die responsive Bild-Pipeline
> demonstriert (`<picture>` mit AVIF/WebP/srcset). `stuttgart/photos/` ist noch leer
> (Cover = SVG-Platzhalter). Echte Fotos kommen in M4 — gleiches Vorgehen: Dateien in
> `photos/` ablegen, unter `photos:` in `index.md` eintragen, `npm run optimize`.
