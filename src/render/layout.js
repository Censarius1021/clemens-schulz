/* layout.js — the single source of the global document shell: <head>, header,
   footer. Page renderers return the inner <main> HTML; renderDocument wraps it. */

import { url, esc } from "./util.js";

const SITE_NAME = "Clemens Schulz";
const SITE_TAGLINE = "Clemens Schulz — Fotografie";

const NAV = [
  { key: "galerien", path: "galerien", label: "Galerien" },
  { key: "ueber", path: "ueber", label: "Über mich" },
  { key: "journal", path: "journal", label: "Journal" },
  { key: "ausruestung", path: "ausruestung", label: "Ausrüstung" },
  { key: "kontakt", path: "kontakt", label: "Kontakt" },
];

function header(base, { active, hasHero }) {
  const links = NAV.map((item) => {
    const current = item.key === active ? ' aria-current="page"' : "";
    return `<a class="nav__link" href="${url(base, item.path)}"${current}>${esc(
      item.label
    )}</a>`;
  }).join("\n          ");

  return `<header class="site-header${hasHero ? " is-top" : ""}">
      <div class="container site-header__inner">
        <a class="wordmark" href="${url(base)}" aria-label="${esc(
          SITE_NAME
        )} — Startseite">${esc(SITE_NAME)}</a>
        <nav class="nav" aria-label="Hauptnavigation">
          ${links}
        </nav>
      </div>
    </header>`;
}

function footer(base) {
  return `<footer class="site-footer">
      <div class="container site-footer__inner">
        <p class="site-footer__name">${esc(SITE_TAGLINE)}</p>
        <nav class="footer-nav" aria-label="Rechtliches">
          <a href="${url(base, "impressum")}">Impressum</a>
          <a href="${url(base, "datenschutz")}">Datenschutz</a>
        </nav>
        <p class="site-footer__copy">
          © <span data-year>2026</span> ${esc(
            SITE_NAME
          )}. Alle Fotografien sind meine eigenen.
        </p>
      </div>
    </footer>`;
}

/**
 * Build a complete HTML document.
 * @param {object} o
 * @param {string} [o.title]       Page title (without site suffix). Omit on home.
 * @param {string} o.description   Meta description.
 * @param {string} o.base          Deploy base path.
 * @param {string} [o.active]      Active nav key.
 * @param {boolean} [o.hasHero]    True → header transparent over hero.
 * @param {string} o.main          Inner HTML for <main> (page renderer output).
 * @param {string} [o.ogImage]     OG image path.
 */
export function renderDocument({
  title,
  description,
  base,
  active,
  hasHero = false,
  main,
  ogImage = "/placeholders/hero.svg",
  canonical = "",
  ogUrl = "",
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_TAGLINE;
  const canonicalTag = canonical
    ? `\n    <link rel="canonical" href="${canonical}" />`
    : "";
  const ogUrlTag = ogUrl
    ? `\n    <meta property="og:url" content="${ogUrl}" />`
    : "";
  return `<!doctype html>
<html lang="de" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(fullTitle)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="color-scheme" content="light" />${canonicalTag}

    <meta property="og:type" content="website" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:title" content="${esc(fullTitle)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:image" content="${ogImage}" />${ogUrlTag}

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta name="theme-color" content="#000000" />

    <!-- Fraunces is self-hosted (see src/styles/fonts.css); no external font CDN.
         Preload the latin normal weight used by the above-the-fold H1. -->
    <link
      rel="preload"
      href="/fonts/fraunces-5.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />

    <script type="module" src="/src/main.js"></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Zum Inhalt springen</a>

    ${header(base, { active, hasHero })}

    <main id="main">
${main}
    </main>

    ${footer(base)}
  </body>
</html>
`;
}
