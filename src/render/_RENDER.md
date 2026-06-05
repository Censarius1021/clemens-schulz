# render/ — Renderer-Funktionen ✅ (M2)

Reine Funktionen `(Daten) → HTML-String`, aufgerufen vom Generator
[`../../scripts/generate.mjs`](../../scripts/_SCRIPTS.md). Kein DOM, keine
Seiteneffekte — gut testbar. Das gemeinsame Layout (Header/Footer/Shell) lebt an
**einer** Stelle (`layout.js`), damit es keine Duplikate gibt.

| Modul | Zweck |
|---|---|
| `util.js` | `url(base, path)` (base-path-bewusste, trailing-slash-Links), `esc()`, `formatDate()` |
| `layout.js` | `renderDocument({…})` — komplettes HTML-Dokument inkl. `<head>`, Header (Nav + `is-top`), Footer. Einzige Quelle der Chrome. |
| `home.js` | Startseite: Hero + Intro + ausgewählte Galerien |
| `galleries.js` | `renderGalleries()` (Übersicht) + `tripCard()` (auch auf der Startseite genutzt) |
| `trip.js` | Reise-Detail `/galerien/<slug>`: Titel, Meta, Intro, gestapelte Fotos |
| `journal.js` | `renderJournalIndex()` + `renderJournalPost()` |
| `page.js` | generische Textseite (Über, Ausrüstung, Kontakt, Impressum, Datenschutz) |

**Konvention:** Renderer geben den **inneren** `<main>`-Inhalt zurück;
`renderDocument()` umschließt ihn mit `<main id="main">` und der globalen Chrome.
Markdown→HTML passiert im Generator; die Renderer bekommen fertige HTML-Strings.
