// The share card, the canonical link and the icons.
//
// The load-bearing claim is that every page advertises itself correctly and
// that everything it advertises is actually on disk. A broken og:image is
// invisible from the site itself — the page renders perfectly and the link
// unfurls as a grey box somewhere else — so the test is the only place it can
// be caught before someone pastes a link into a chat.

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { shareHead, absoluteUrl, personJsonLd, postJsonLd } from "../src/render/meta.js";
import { renderBlogIndex, renderPost } from "../src/render/blog.js";
import { renderWorkIndex, renderWorkPage } from "../src/render/work.js";
import { renderTalksIndex, renderPresenterPage } from "../src/render/talks.js";
import { renderHtml } from "../src/render/html.js";
import { renderJournal } from "../src/render/journal.js";
import { caseStudies } from "../public/journal/data/site.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const ORIGIN = "https://aboldnewlook.com";

/** Enough résumé for the shell to render; the document itself is tested elsewhere. */
const RESUME = {
  name: "Ryan Schumacher",
  headline: "Platform",
  contact: {},
  highlights: [],
  experience: [],
  skills: [],
  community: [],
  education: [],
};

const POST = {
  slug: "a-post",
  title: "A post",
  summary: "What it is about.",
  body: "Hello.",
  went_live_at: "2026-02-03 10:00:00",
  finalized_at: null,
  tags: [],
  revisions: [{ note: "Fixed a claim.", created_at: "2026-03-01 09:00:00" }],
};

/**
 * Paths that look like files but are rendered by the Worker, not served from
 * public/ — the machine-readable renderings of pages the site already has.
 */
const ROUTED = new Set(["/llms.txt", "/resume.md", "/resume.txt", "/deck/pattern.svg"]);

/** Everything in a document's <head> that points at a file this repo serves. */
function localAssets(html) {
  const head = html.slice(0, html.indexOf("</head>"));
  const urls = [...head.matchAll(/(?:href|content)="([^"]+)"/g)].map((m) => m[1]);
  return urls
    .filter((u) => u.startsWith("/") || u.startsWith(`${ORIGIN}/`))
    .map((u) => u.replace(ORIGIN, ""))
    .filter((u) => /\.\w+$/.test(u) && !ROUTED.has(u)); // a file, not a page like /blog
}

test("the head carries a canonical URL, a card and the icons", () => {
  const head = shareHead({
    title: "Blog — Ryan Schumacher",
    description: "Writing.",
    path: "/blog",
  });

  assert.match(head, /<link rel="canonical" href="https:\/\/aboldnewlook\.com\/blog">/);
  assert.match(head, /<meta property="og:title" content="Blog — Ryan Schumacher">/);
  assert.match(head, /<meta property="og:url" content="https:\/\/aboldnewlook\.com\/blog">/);
  assert.match(head, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(head, /<link rel="icon" href="\/favicon\.svg"/);
  assert.match(head, /<link rel="manifest" href="\/site\.webmanifest">/);
});

test("og:image is absolute, and declares the size it actually is", () => {
  const head = shareHead({ title: "x", path: "/" });
  assert.match(head, /<meta property="og:image" content="https:\/\/aboldnewlook\.com\/og\/default\.png">/);
  assert.match(head, /<meta property="og:image:width" content="1200">/);
  assert.match(head, /<meta property="og:image:height" content="630">/);
});

test("a path cannot move the canonical URL to another host", () => {
  // The 404 canonicalises whatever path was asked for, and "//evil.example" is
  // a valid path that resolves to a different origin if it is resolved.
  assert.equal(absoluteUrl("//evil.example/x"), "https://aboldnewlook.com//evil.example/x");
  assert.equal(absoluteUrl("/blog"), "https://aboldnewlook.com/blog");
});

test("a title with markup in it cannot escape its attribute", () => {
  const head = shareHead({ title: `A "post" <script>`, path: "/blog/x" });
  assert.match(head, /content="A &quot;post&quot; &lt;script&gt;"/);
  assert.doesNotMatch(head, /<script>/);
});

test("JSON-LD cannot be closed early by a post title", () => {
  const head = shareHead({
    title: "x",
    path: "/blog/x",
    jsonLd: postJsonLd({ ...POST, title: "</script><script>alert(1)</script>" }),
  });
  assert.doesNotMatch(head, /<\/script><script>/);
  assert.match(head, /\\u003c\/script>/);
});

test("an article says when it was published and when it last changed", () => {
  const html = renderPost(POST);
  assert.match(html, /<meta property="og:type" content="article">/);
  assert.match(html, /<meta property="article:published_time" content="2026-02-03">/);
  // The newest revision, not finalized_at, which a living post does not have.
  assert.match(html, /<meta property="article:modified_time" content="2026-03-01">/);
});

test("the homepage's card says what the homepage says", () => {
  const html = renderJournal({ talks: [] });
  const title = /<title>([^<]+)<\/title>/.exec(html)[1];
  const ogTitle = /<meta property="og:title" content="([^"]+)">/.exec(html)[1];
  const description = /<meta name="description" content="([^"]+)">/.exec(html)[1];
  const ogDescription = /<meta property="og:description" content="([^"]+)">/.exec(html)[1];
  assert.equal(ogTitle, title);
  assert.equal(ogDescription, description);
  assert.match(html, /<link rel="canonical" href="https:\/\/aboldnewlook\.com\/">/);
});

test("the homepage's JSON-LD carries the links the contact section does", () => {
  const person = personJsonLd({
    contact: [
      { label: "email", href: "mailto:someone@example.com" },
      { label: "github", href: "https://github.com/jrschumacher" },
    ],
    now: "now — director of platform, virtru · remote",
  });
  assert.equal(person.jobTitle, "director of platform");
  // mailto: is not a profile; sameAs is for the other places he is.
  assert.deepEqual(person.sameAs, ["https://github.com/jrschumacher"]);
});

test("every page canonicalises to its own address", () => {
  const study = caseStudies[0];
  const pages = [
    ["/blog", renderBlogIndex([])],
    [`/blog/${POST.slug}`, renderPost(POST)],
    ["/work", renderWorkIndex(caseStudies)],
    [`/work/${study.slug}`, renderWorkPage(study)],
    ["/talks", renderTalksIndex([])],
    ["/resume", renderHtml(RESUME)],
    ["/", renderJournal({ talks: [] })],
  ];
  for (const [route, html] of pages) {
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https://aboldnewlook\\.com${route}">`),
      `${route} does not canonicalise to itself`,
    );
  }
});

test("every image and icon a page links to exists in public/", () => {
  const pages = [
    renderJournal({ talks: [] }),
    renderBlogIndex([]),
    renderPost(POST),
    renderWorkIndex(caseStudies),
    renderTalksIndex([]),
    renderHtml(RESUME),
  ];
  const referenced = new Set(pages.flatMap(localAssets));
  assert.ok(referenced.size >= 6, "a page that links to no assets is a page with no icons");
  for (const asset of referenced) {
    assert.ok(existsSync(path.join(PUBLIC, asset)), `${asset} is linked but not in public/`);
  }
});

test("the presenter view is the speaker's screen, not a page to index", () => {
  const html = renderPresenterPage({ slug: "a-deck", meta: { title: "A deck" }, theme: null, slides: [] });
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /<link rel="icon" href="\/favicon\.svg"/);
});

test("the manifest's icons exist too", () => {
  const manifest = JSON.parse(readFileSync(path.join(PUBLIC, "site.webmanifest"), "utf8"));
  assert.ok(manifest.icons.length, "a manifest with no icons installs a blank square");
  for (const icon of manifest.icons) {
    assert.ok(
      existsSync(path.join(PUBLIC, icon.src.replace(/^\//, ""))),
      `${icon.src} is in the manifest but not in public/`,
    );
  }
  assert.ok(
    manifest.icons.some((i) => i.purpose === "maskable"),
    "without a maskable icon the Android launcher crops the frame off",
  );
});

test("the share cards are the size the markup claims they are", () => {
  // PNG: 8-byte signature, then IHDR, whose first eight bytes are the size.
  for (const card of ["default", "work", "blog", "talks", "resume"]) {
    const png = readFileSync(path.join(PUBLIC, "og", `${card}.png`));
    assert.equal(png.readUInt32BE(16), 1200, `og/${card}.png is not 1200 wide`);
    assert.equal(png.readUInt32BE(20), 630, `og/${card}.png is not 630 tall`);
  }
});
