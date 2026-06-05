/* home.js — the homepage: hero + intro + featured galleries. */

import { url, esc, renderImage } from "./util.js";
import { tripCard } from "./galleries.js";

export function renderHome({ base, frontmatter, bodyHtml, featuredTrips, heroEntry, heroFallback }) {
  const heroCaption = frontmatter.hero_caption || "";
  const title = frontmatter.title || "Clemens Schulz";

  // The hero is the LCP image → eager + high priority. Responsive <picture>
  // when optimized; plain placeholder otherwise.
  const heroImg = renderImage(base, heroEntry, {
    src: heroFallback || "/placeholders/hero.svg",
    alt: "Titelbild — eine Aufnahme von Clemens Schulz",
    sizes: "100vw",
    loading: "eager",
    fetchpriority: "high",
    width: 1600,
    height: 1000,
  });

  const featured = featuredTrips.length
    ? `<section class="section container">
        <div class="section-head reveal">
          <h2>Galerien</h2>
          <a class="link-inline" href="${url(base, "galerien")}">Alle ansehen</a>
        </div>

        <div class="gallery-grid">
          ${featuredTrips.map((t) => tripCard(base, t)).join("\n          ")}
        </div>
      </section>`
    : "";

  return `      <section class="hero" aria-label="Titelbild">
        <div class="hero__media">
          ${heroImg}
        </div>
        <div class="hero__scrim"></div>
        <div class="container">
          <p class="hero__caption">${esc(heroCaption)}</p>
        </div>
      </section>

      <section class="section container">
        <div class="intro reveal">
          <h1 class="intro__title">${esc(title)}</h1>
          <div class="intro__text">${bodyHtml}</div>
        </div>
      </section>

      ${featured}`;
}
