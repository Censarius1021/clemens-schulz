/* galleries.js — galleries index + the shared trip card (reused on the home page). */

import { url, esc, renderImage } from "./util.js";

/** A single trip cover card. */
export function tripCard(base, trip) {
  const meta = trip.location
    ? `<p class="gallery-card__meta">${esc(trip.location)}</p>`
    : "";
  // Optimized <picture> when the cover is a real photo; plain <img> for an
  // absolute placeholder. Cropped to the cover ratio via CSS (object-fit).
  const cover = renderImage(base, trip.coverEntry, {
    src: trip.cover,
    alt: `${trip.title} — Titelbild der Galerie`,
    sizes: "(min-width: 768px) 45vw, 100vw",
    width: 800,
    height: 1000,
  });
  return `<a class="gallery-card reveal" href="${url(
    base,
    "galerien/" + trip.slug
  )}">
            <div class="gallery-card__media">
              ${cover}
            </div>
            <p class="gallery-card__label">${esc(trip.title)}</p>
            ${meta}
          </a>`;
}

/** /galerien — index of all trips. */
export function renderGalleries({ base, trips }) {
  const cards = trips.map((t) => tripCard(base, t)).join("\n          ");
  const grid = trips.length
    ? `<div class="gallery-grid">
          ${cards}
        </div>`
    : `<p class="text-lead">Noch keine Galerien — bald mehr.</p>`;

  return `      <div class="page container">
        <h1>Galerien</h1>
        ${grid}
      </div>`;
}
