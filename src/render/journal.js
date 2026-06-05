/* journal.js — /journal index + /journal/{slug} post. */

import { url, esc, formatDate } from "./util.js";

/** /journal — reverse-chronological list of posts. */
export function renderJournalIndex({ base, posts }) {
  if (!posts.length) {
    return `      <div class="page container measure">
        <h1>Journal</h1>
        <p class="text-lead">Noch keine Beiträge.</p>
      </div>`;
  }

  const items = posts
    .map((p) => {
      const excerpt = p.excerpt
        ? `<p class="journal-item__excerpt">${esc(p.excerpt)}</p>`
        : "";
      return `<li class="journal-item reveal">
            <p class="journal-item__date text-meta">${esc(formatDate(p.date))}</p>
            <h2 class="journal-item__title">
              <a href="${url(base, "journal/" + p.slug)}">${esc(p.title)}</a>
            </h2>
            ${excerpt}
          </li>`;
    })
    .join("\n          ");

  return `      <div class="page container measure">
        <h1>Journal</h1>
        <ul class="journal-list">
          ${items}
        </ul>
      </div>`;
}

/** /journal/{slug} — a single post. */
export function renderJournalPost({ base, post }) {
  return `      <article class="page container measure">
        <header class="post__header">
          <p class="post__date text-meta">${esc(formatDate(post.date))}</p>
          <h1>${esc(post.title)}</h1>
        </header>
        <div class="prose">${post.bodyHtml}</div>
        <p class="post__back">
          <a class="link-inline" href="${url(base, "journal")}">← Alle Beiträge</a>
        </p>
      </article>`;
}
