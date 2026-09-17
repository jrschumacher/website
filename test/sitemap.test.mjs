// /sitemap.xml.
//
// The load-bearing claims are that the file lists the pages the site actually
// has, that it never invents a date, and that a database being down costs it
// rows rather than the whole document.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { renderSitemap, sitemapUrls, SECTIONS } from "../src/render/sitemap.js";
import { SITE_ORIGIN } from "../src/config.js";
import { caseStudies } from "../public/journal/data/site.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const POSTS = [
  {
    id: 1,
    slug: "a-post",
    title: "A post",
    went_live_at: "2026-02-03 10:00:00",
    finalized_at: null,
    updated_at: "2026-03-01 09:00:00",
    tags: [],
  },
];

const TALKS = [{ slug: "a-deck" }, { slug: "another-deck" }];

/** The document as the route builds it, minus the route's D1 and registry reads. */
function sitemap({ posts = POSTS, talks = TALKS } = {}) {
  return renderSitemap(sitemapUrls({ studies: caseStudies, posts, talks }));
}

test("the sitemap is a sitemaps.org document", () => {
  const body = sitemap();
  assert.match(body, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(body, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
});

test("every section and every case study is in it, once, absolute", () => {
  const body = sitemap();
  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  for (const page of SECTIONS) {
    assert.ok(locs.includes(`https://aboldnewlook.com${page}`), `${page} is not listed`);
  }
  for (const study of caseStudies) {
    assert.ok(
      locs.includes(`https://aboldnewlook.com/work/${study.slug}`),
      `/work/${study.slug} is not listed`,
    );
  }
  assert.ok(locs.includes("https://aboldnewlook.com/blog/a-post"));
  assert.ok(locs.includes("https://aboldnewlook.com/talks/a-deck"));
  assert.equal(new Set(locs).size, locs.length, "a page is listed twice");
  assert.ok(
    locs.every((loc) => loc.startsWith("https://aboldnewlook.com/")),
    "a sitemap's locations have to be absolute",
  );
});

test("the other renderings of a page are not pages", () => {
  const body = sitemap();
  for (const path of ["/resume.txt", "/resume.md", "/llms.txt", "/sitemap.xml", "?presenter"]) {
    assert.doesNotMatch(body, new RegExp(path.replace(/[.?]/g, "\\$&")), `${path} does not belong`);
  }
});

test("a post's lastmod is the post's own timestamp, and nothing is invented", () => {
  const body = sitemap();
  assert.match(body, /<loc>https:\/\/aboldnewlook\.com\/blog\/a-post<\/loc>\s*<lastmod>2026-03-01<\/lastmod>/);
  // The sections, the case studies and the decks have no honest date, so they
  // carry none: one <lastmod> per post is the whole count.
  assert.equal([...body.matchAll(/<lastmod>/g)].length, 1);
});

test("a post that has never been revised still dates itself", () => {
  const xml = renderSitemap([{ path: "/blog/x", lastmod: "2026-02-03 10:00:00" }]);
  assert.match(xml, /<lastmod>2026-02-03<\/lastmod>/);
  // A timestamp D1 cannot parse is left out rather than emitted as "Invalid Date".
  assert.doesNotMatch(renderSitemap([{ path: "/blog/x", lastmod: "soon" }]), /<lastmod>/);
});

test("a slug cannot break the document", () => {
  const xml = renderSitemap([{ path: "/blog/" + encodeURIComponent("a&b<c>"), lastmod: null }]);
  assert.match(xml, /<loc>https:\/\/aboldnewlook\.com\/blog\/a%26b%3Cc%3E<\/loc>/);
  assert.doesNotMatch(xml, /<c>/);
});

test("a source that is down costs the sitemap its rows, not its existence", () => {
  // What the route hands over when D1 throws and it falls back to []. The
  // case studies are a module in the repo and survive any database.
  const body = sitemap({ posts: [], talks: [] });
  assert.match(body, /<loc>https:\/\/aboldnewlook\.com\/<\/loc>/);
  assert.match(body, /\/work\//, "the case studies do not come from D1 and should survive it");
  assert.doesNotMatch(body, /\/blog\/[a-z]/);
  assert.doesNotMatch(body, /\/talks\/[a-z]/);
});

test("robots.txt points at it, at the address the rest of the site uses", () => {
  // robots.txt is a static file and cannot import the constant, so the test is
  // what keeps the two from drifting apart.
  const robots = readFileSync(path.join(ROOT, "public", "robots.txt"), "utf8");
  const line = /^Sitemap: (\S+)$/m.exec(robots);
  assert.ok(line, "robots.txt does not name a sitemap");
  assert.equal(line[1], `${SITE_ORIGIN}/sitemap.xml`);
});
