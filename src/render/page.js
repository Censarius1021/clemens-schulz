/* page.js — generic single-column text page (Über mich, Ausrüstung, Kontakt,
   Impressum, Datenschutz). */

import { esc } from "./util.js";

export function renderPage({ title, bodyHtml, extraHtml = "" }) {
  return `      <div class="page container measure">
        <h1>${esc(title)}</h1>
        <div class="prose">${bodyHtml}</div>
        ${extraHtml}
      </div>`;
}
