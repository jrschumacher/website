// /work — the case studies, and one page each.
//
// The homepage shows three (section IV). This is where they all are, and where
// a case study gets an address someone can send to someone else.
//
// The articles are caseStudyArticle() and nothing else: the same markup the
// homepage renders, under the site's nav rather than the journal's masthead.

import { escapeHtml } from "../format.js";
import { layout } from "./layout.js";
import { WORK_STYLESHEET } from "./css.js";
import { caseStudyArticle } from "./case-study.js";

const e = escapeHtml;

const LEDE =
  "Work I can describe in public: what the problem was, what was built, and what it changed. Each one has a page of its own.";

/**
 * @param {object[]} studies  caseStudies, in the order they should be read
 */
export function renderWorkIndex(studies) {
  const body = studies.length
    ? `<div class="cs-list">${studies
        .map((cs) => caseStudyArticle(cs, { titleTag: "h2", href: `/work/${encodeURIComponent(cs.slug)}` }))
        .join("")}</div>`
    : `<div class="empty">
    <p>No case studies published yet.</p>
    <p>They will appear here as the work does.</p>
  </div>`;

  return layout({
    title: "Case studies — Ryan Schumacher",
    description: "Case studies: platform, growth and the work behind them.",
    current: "work",
    stylesheet: WORK_STYLESHEET,
    wide: true,
    body: `<h1 class="page-title">Case studies</h1>
<p class="page-lede">${e(LEDE)}</p>
${body}`,
  });
}

/**
 * One case study at its own address.
 *
 * The title is the page's <h1> and carries no link — it is already here.
 */
export function renderWorkPage(cs) {
  return layout({
    title: `${cs.title} — Ryan Schumacher`,
    description: cs.story,
    current: "work",
    stylesheet: WORK_STYLESHEET,
    wide: true,
    body: `<div class="cs-list cs-solo">${caseStudyArticle(cs, { titleTag: "h1" })}</div>
<p class="backlink"><a href="/work">← all case studies</a></p>`,
  });
}
