# home/ — Bilder der Startseite

Hier liegt das **Hero-Bild** (das große Titelbild ganz oben auf der Startseite).

## Hero-Bild hinterlegen

1. Lege deine Datei hier ab, z. B. `content/home/hero.jpg` (oder `.png`).
2. In [`../pages/home.md`](../pages/home.md) ist bereits eingetragen:
   ```yaml
   hero_image: "home/hero.jpg"
   ```
   Wenn du einen anderen Dateinamen nutzt, hier anpassen
   (Pfad **relativ zu `content/`**).
3. `npm run optimize` ausführen (oder Dev-Server neu starten) — daraus werden
   automatisch responsive Varianten (AVIF/WebP/JPEG) erzeugt; der Hero wird als
   `<picture>` mit `srcset` ausgeliefert und vorrangig geladen (LCP).

Solange keine Datei vorhanden ist, zeigt die Startseite den monochromen
SVG-Platzhalter aus `../../public/placeholders/hero.svg`.

> Empfehlung: ein **querformatiges**, ruhiges Bild — es wird vollflächig
> (bis 100 % Höhe) angezeigt und am unteren Rand leicht abgedunkelt, damit die
> kursive Bildunterschrift lesbar bleibt.
