// /work: the case studies as their own pages.
//
// The load-bearing claim is that a case study is one design, not three. The
// homepage's section IV, the /work index and /work/<slug> all render the same
// markup from the same module, so these tests compare them rather than pinning
// each separately.

import test from "node:test";
import assert from "node:assert/strict";

import { caseStudyArticle } from "../src/render/case-study.js";
import { renderWorkIndex, renderWorkPage } from "../src/render/work.js";
import { caseStudies } from "../public/journal/data/site.js";

const FIXTURE = {
  slug: "a-study",
  num: "01",
  kicker: "SOMEWHERE · 2024 · PLATFORM",
  title: "A study",
  tint: "#16484c",
  story: "The first paragraph.",
  story2: "The second paragraph.",
  statBig: "3 months",
  statNote: "before → after",
  figCaption: "fig. a — the shape of it",
  diagram: "consolidate",
  facts: ["one fact", "another fact"],
};

test("every case study in the data has a slug, and no two share one", () => {
  const slugs = caseStudies.map((c) => c.slug);
  assert.ok(slugs.every(Boolean), "a case study with no slug has no address");
  assert.equal(new Set(slugs).size, slugs.length, "two studies cannot share a URL");
});

test("the article carries the whole study: both paragraphs, the stat, the facts, the figure", () => {
  const html = caseStudyArticle(FIXTURE);
  assert.match(html, /The first paragraph\./);
  assert.match(html, /The second paragraph\./);
  assert.match(html, /<span class="cs-stat-big" style="color: #16484c">3 months<\/span>/);
  assert.match(html, /<div class="fact">another fact<\/div>/);
  assert.match(html, /fig\. a — the shape of it/);
  assert.match(html, /<svg/, "the diagram is rendered, not linked");
});

test("only the title varies between where a study is shown", () => {
  const plain = caseStudyArticle(FIXTURE);
  const linked = caseStudyArticle(FIXTURE, { titleTag: "h2", href: "/work/a-study" });
  // Strip the one line that is allowed to differ and the rest must be identical.
  const strip = (s) => s.replace(/<(div|h1|h2) class="cs-title"[\s\S]*?<\/\1>/, "");
  assert.equal(strip(plain), strip(linked));
  assert.match(linked, /<h2 class="cs-title" style="color: #16484c"><a class="cs-title-link" href="\/work\/a-study">A study<\/a><\/h2>/);
  assert.match(plain, /<div class="cs-title" style="color: #16484c">A study<\/div>/);
});

test("the index links every study to its own page", () => {
  const html = renderWorkIndex(caseStudies);
  for (const cs of caseStudies) {
    assert.ok(
      html.includes(`href="/work/${cs.slug}"`),
      `${cs.slug} is listed but not linked`,
    );
  }
  assert.match(html, /<a href="\/work" aria-current="page">Case studies<\/a>/);
});

test("a study's own page is an h1 with no link back to itself", () => {
  const html = renderWorkPage(FIXTURE);
  assert.match(html, /<h1 class="cs-title"[^>]*>A study<\/h1>/);
  assert.ok(!html.includes('href="/work/a-study"'), "the page does not link to itself");
  assert.match(html, /<a href="\/work">← all case studies<\/a>/);
  assert.match(html, /<title>A study — Ryan Schumacher<\/title>/);
});

test("the index has an honest empty state", () => {
  const html = renderWorkIndex([]);
  assert.match(html, /No case studies published yet\./);
  assert.ok(!html.includes('class="cs-list"'));
});

test("the page carries the rules its markup needs", () => {
  const html = renderWorkPage(FIXTURE);
  for (const rule of [".cs-stat-big", ".cs-fig-frame", ".kicker", ".card-facts", "--frame"]) {
    assert.ok(html.includes(rule), `${rule} is used by the markup but not in the sheet`);
  }
});
