/* util.js — tiny helpers shared by the renderers. No DOM, pure strings. */

/** Join the deploy base with a route path → always trailing-slash dir routes.
 *  url("/", "galerien")        → "/galerien/"
 *  url("/repo/", "galerien/x") → "/repo/galerien/x/"
 *  url("/repo/", "")           → "/repo/"   (home) */
export function url(base, path = "") {
  const b = base.endsWith("/") ? base : base + "/";
  let p = String(path).replace(/^\/+/, "");
  if (p && !p.endsWith("/")) p += "/";
  return b + p;
}

/** Escape text destined for HTML text nodes / attributes. */
export function esc(s = "") {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );
}

/** Prefix a root-absolute asset path with the deploy base. Leaves full URLs alone.
 *  withBase("/repo/", "/placeholders/x.svg") → "/repo/placeholders/x.svg" */
export function withBase(base, p) {
  if (!p) return p;
  if (/^https?:\/\//.test(p) || p.startsWith("data:")) return p;
  const b = base.endsWith("/") ? base : base + "/";
  return b + String(p).replace(/^\/+/, "");
}

/**
 * Render an image. If `entry` (from the optimizer manifest) is present, emit a
 * responsive <picture> with AVIF/WebP/JPEG; otherwise a plain <img>. All URLs
 * are base-applied here (Vite does not rewrite srcset), so the markup is final.
 */
export function renderImage(base, entry, { src, alt = "", sizes = "100vw", loading = "lazy", fetchpriority, width, height } = {}) {
  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  if (!entry) {
    const w = width ? ` width="${width}"` : "";
    const h = height ? ` height="${height}"` : "";
    return `<img src="${withBase(base, src)}" alt="${esc(
      alt
    )}"${w}${h} loading="${loading}" decoding="async"${fp} />`;
  }
  const srcset = (arr) =>
    arr.map((v) => `${withBase(base, v.url)} ${v.w}w`).join(", ");
  return `<picture>
              <source type="image/avif" srcset="${srcset(entry.avif)}" sizes="${sizes}" />
              <source type="image/webp" srcset="${srcset(entry.webp)}" sizes="${sizes}" />
              <img src="${withBase(base, entry.fallback)}" alt="${esc(
                alt
              )}" width="${entry.width}" height="${entry.height}" loading="${loading}" decoding="async"${fp} />
            </picture>`;
}

/** Format an ISO-ish date string ("2024-09" or "2025-03-12") for German display. */
export function formatDate(value) {
  if (!value) return "";
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  const [y, m, d] = String(value).split("-");
  if (y && m && d) return `${Number(d)}. ${months[Number(m) - 1]} ${y}`;
  if (y && m) return `${months[Number(m) - 1]} ${y}`;
  return String(value);
}
