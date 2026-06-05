# content/ — Inhalte (Markdown)

Hier pflegst **du** als Maintainer alle Inhalte. Reiner Text in Markdown, Bilder
als Dateien daneben. Alles wird mit Git versioniert. **Kein CMS.**

> Hinweis: Der Markdown→HTML-**Generator** kommt in **M2** (siehe
> [`../scripts/_SCRIPTS.md`](../scripts/_SCRIPTS.md)). Bis dahin sind diese Dateien
> die vorbereitete Quelle; gerendert wird aktuell nur die Homepage (`../index.html`).
> Das Frontmatter-Schema unten ist bereits final und stabil.

## Ordner

- `pages/` — Einzelseiten (Über mich, Ausrüstung, Kontakt, Impressum, Datenschutz, Home-Intro).
- `trips/<slug>/` — eine Reise = eine Galerie → `/galerien/<slug>`.
- `journal/<slug>.md` — ein Journal-Beitrag → `/journal/<slug>`.

## Eine neue Reise (Galerie) hinzufügen

1. Ordner anlegen: `content/trips/<slug>/` (slug = sauber, kleingeschrieben, z. B. `fulda`).
2. `index.md` darin anlegen — Frontmatter:
   ```yaml
   ---
   title: "Fulda"
   location: "Fulda, Deutschland"   # optional
   date: "2024-09"                  # für Sortierung/Label
   intro: "1–3 Sätze über die Reise."
   cover: "photos/cover.jpg"        # Bild für die Galerie-Übersicht
   photos:                          # geordnete Liste
     - src: "photos/01.jpg"
       alt: "Ort + Motiv (Pflicht)"
       caption: "kurze Notiz"       # optional
     - src: "photos/02.jpg"
       alt: "…"
   ---
   ```
3. Bilder in `content/trips/<slug>/photos/` ablegen.
4. Committen & pushen → CI baut und deployt (ab M2/M4).

## Einen Journal-Beitrag hinzufügen

`content/journal/<slug>.md`:
```yaml
---
title: "Warum ich analog fotografiere"
date: "2025-03-12"
excerpt: "Ein Satz für die Übersicht."   # optional
---

Fließtext in Markdown. Bilder per Standard-Markdown einbinden:

![Ort + Motiv](./images/foto.jpg "optionale Bildunterschrift")
```

## Das Hero-Bild (Startseite) setzen

Datei in [`home/`](home/) ablegen (z. B. `content/home/hero.jpg`) und in
`pages/home.md` `hero_image: "home/hero.jpg"` eintragen (Pfad relativ zu `content/`).
Details: [`home/_HOME.md`](home/_HOME.md). Ohne Datei wird der SVG-Platzhalter gezeigt.

## Cover einer Galerie

`cover:` in der Reise-`index.md` kann auf ein **echtes Foto** zeigen (z. B.
`cover: "photos/01.jpg"`, relativ zum Reise-Ordner) — dann wird es responsiv
optimiert. Ein absoluter Pfad wie `"/placeholders/fulda.svg"` bleibt ein
unbearbeiteter Platzhalter.

## Eine Seite ändern

Die passende Datei in `pages/` bearbeiten (z. B. `about.md` → `/ueber`).

## Regeln

- **Slugs** sind die stabile Kennung: kleingeschrieben, Bindestriche, keine Umlaute
  (`ueber`, nicht `über`; `warum-ich-analog-fotografiere`).
- **Alt-Text ist Pflicht** für jedes Foto — sachlich *Ort + Motiv* (Barrierefreiheit & SEO).
- **Gleichmäßige Crop-Ratios** je Galerie (nicht wild mischen).
- Ton & Länge: siehe [`../brand/voice-and-tone.md`](../brand/voice-and-tone.md).
- **Impressum & Datenschutz** sind rechtlich erforderlich — nicht löschen.
