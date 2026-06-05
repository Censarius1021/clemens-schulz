/* trip.js — /galerien/{slug} detail: heading, meta, intro, stacked photos. */

import { url, esc, formatDate, renderImage } from "./util.js";

function photoFigure(base, images, photo) {
  const entry = photo.key ? images[photo.key] : null;
  const img = renderImage(base, entry, {
    src: photo.src,
    alt: photo.alt || "",
    width: photo.width,
    height: photo.height,
    sizes: "(min-width: 1024px) 1024px, 100vw",
  });
  // Show an explicit caption if set; otherwise fall back to the alt text.
  const captionText = photo.caption || photo.alt;
  const caption = captionText
    ? `<figcaption class="caption">${esc(captionText)}</figcaption>`
    : "";
  return `<figure class="trip-photo reveal">
            ${img}
            ${caption}
          </figure>`;
}

export function renderTrip({ base, trip, images = {} }) {
  const metaBits = [trip.location, formatDate(trip.date)].filter(Boolean);
  const meta = metaBits.length
    ? `<p class="trip__meta text-meta">${esc(metaBits.join(" · "))}</p>`
    : "";

  const intro = trip.introHtml
    ? `<p class="trip__intro text-lead">${trip.introHtml}</p>`
    : "";

  // Photos if present; otherwise show the cover once so the page isn't empty.
  let photos;
  if (trip.photos && trip.photos.length) {
    photos = trip.photos
      .map((p) => photoFigure(base, images, p))
      .join("\n          ");
  } else {
    photos = photoFigure(base, images, {
      src: trip.cover,
      alt: `${trip.title} — Platzhalterbild`,
      caption: "Fotos folgen.",
      width: 800,
      height: 1000,
    });
  }

  return `      <div class="page container">
        <header class="trip__header">
          <h1>${esc(trip.title)}</h1>
          ${meta}
          ${intro}
        </header>

        <div class="trip__photos">
          ${photos}
        </div>

        <p class="trip__back">
          <a class="link-inline" href="${url(base, "galerien")}">← Alle Galerien</a>
        </p>
      </div>`;
}
