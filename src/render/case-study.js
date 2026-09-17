// One case study, as markup, in one place.
//
// Section IV of the homepage and /work render the same <article class="cs">
// from the same data. A case study that changed shape depending on where you
// found it would be two designs rather than one, so the markup lives here and
// both callers import it, exactly as both stylesheets import its rules from
// case-css.js.
//
// The title varies and only the title: a heading with a link on the index
// pages, a plain <h1> on the study's own page. Everything below it — the
// kicker, the two paragraphs, the headline stat, the facts, the figure — is
// the same on all three.

import { escapeHtml } from "../format.js";
import { caseDiagram } from "./diagrams.js";

const e = escapeHtml;

/**
 * @param {object} cs                   one entry from data/site.js caseStudies
 * @param {object} [opts]
 * @param {string} [opts.titleTag]      element for the title line; "div" keeps
 *                                      section IV's outline, where the section
 *                                      head already owns the heading
 * @param {string|null} [opts.href]     link the title somewhere (the index pages)
 */
export function caseStudyArticle(cs, { titleTag = "div", href = null } = {}) {
  const tint = e(cs.tint);
  const title = href
    ? `<a class="cs-title-link" href="${e(href)}">${e(cs.title)}</a>`
    : e(cs.title);

  return `<article class="cs">
<div class="kicker">CASE STUDY № ${e(cs.num)} · ${e(cs.kicker)}</div>
<${titleTag} class="cs-title" style="color: ${tint}">${title}</${titleTag}>
<div class="rule-short"></div>
<div class="cs-grid">
<div>
<p class="cs-story">${e(cs.story)}</p>
<p class="cs-story">${e(cs.story2)}</p>
<div class="cs-stat">
<span class="cs-stat-big" style="color: ${tint}">${e(cs.statBig)}</span>
<span class="cs-stat-note mono">${e(cs.statNote)}</span>
</div>
<div class="card-facts">${cs.facts.map((f) => `<div class="fact">${e(f)}</div>`).join("")}</div>
</div>
<figure class="cs-fig">
<div class="cs-fig-frame">${caseDiagram(cs.diagram, cs.tint)}</div>
<figcaption>${e(cs.figCaption)}</figcaption>
</figure>
</div>
</article>`;
}
