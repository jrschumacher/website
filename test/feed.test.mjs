// /feed.xml — the blog as Atom.
//
// The load-bearing claims: a living post keeps its identity when it is revised
// and moves its <updated>, every date is RFC 3339, the post's HTML rides inside
// the XML without breaking it, and a post the feed cannot place in time is left
// out rather than dated with a guess.

import test from "node:test";
import assert from "node:assert/strict";

import { renderFeed } from "../src/render/feed.js";
import { renderBlogIndex, renderPost } from "../src/render/blog.js";
import { isoDateTime } from "../src/format.js";

const FINISHED = {
  id: 1,
  slug: "a-finished-post",
  title: "A finished post",
  summary: "What it is about.",
  body: "Hello.\n",
  went_live_at: "2026-02-03 10:00:00",
  finalized_at: "2026-02-10 08:00:00",
  updated_at: "2026-02-10 08:00:00",
  tags: [{ key: "platform", label: "Platform" }],
};

const LIVING = {
  id: 2,
  slug: "a-living-post",
  title: "A living post",
  summary: "Still being revised.",
  body: "The first draft.\n",
  went_live_at: "2026-01-04 09:00:00",
  finalized_at: null,
  updated_at: "2026-03-01 09:00:00",
  tags: [],
};

/** RFC 3339, which is what Atom requires and what a reader sorts by. */
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/;

function entries(xml) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((m) => m[1]);
}

test("the feed is an Atom document that points back at itself", () => {
  const xml = renderFeed({ posts: [FINISHED] });
  assert.match(xml, /^<\?xml version="1\.0" encoding="utf-8"\?>/);
  assert.match(xml, /<feed xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/);
  assert.match(
    xml,
    /<link rel="self" type="application\/atom\+xml" href="https:\/\/aboldnewlook\.com\/feed\.xml"\/>/,
  );
  assert.match(
    xml,
    /<link rel="alternate" type="text\/html" href="https:\/\/aboldnewlook\.com\/blog"\/>/,
  );
  assert.match(xml, /<name>Ryan Schumacher<\/name>/);
});

test("every date in the document is RFC 3339", () => {
  const xml = renderFeed({ posts: [FINISHED, LIVING] });
  const dates = [...xml.matchAll(/<(?:updated|published)>([^<]+)<\/(?:updated|published)>/g)].map(
    (m) => m[1],
  );
  assert.ok(dates.length >= 5, "a feed and two entries should carry five dates");
  for (const date of dates) assert.match(date, RFC3339, `${date} is not RFC 3339`);
});

test("the feed's own updated is the newest thing in it", () => {
  const xml = renderFeed({ posts: [FINISHED, LIVING] });
  const feedUpdated = /<updated>([^<]+)<\/updated>/.exec(xml)[1];
  // The living post was revised in March; the finished one stopped in February.
  assert.equal(feedUpdated, isoDateTime(LIVING.updated_at));
});

test("a revised post keeps its identity and moves its updated", () => {
  const xml = renderFeed({ posts: [LIVING] });
  const [entry] = entries(xml);
  assert.match(entry, /<id>https:\/\/aboldnewlook\.com\/blog\/a-living-post<\/id>/);
  assert.match(entry, /<published>2026-01-04T09:00:00Z<\/published>/);
  assert.match(entry, /<updated>2026-03-01T09:00:00Z<\/updated>/);
  // Which is the whole reason this is Atom: published and updated, one id.
  assert.notEqual(
    /<published>([^<]+)</.exec(entry)[1],
    /<updated>([^<]+)</.exec(entry)[1],
  );
});

test("a living post says so, and a finished one does not", () => {
  assert.match(renderFeed({ posts: [LIVING] }), /<category term="living"/);
  assert.doesNotMatch(renderFeed({ posts: [FINISHED] }), /<category term="living"/);
});

test("tags come through as categories", () => {
  const xml = renderFeed({ posts: [FINISHED] });
  assert.match(xml, /<category term="platform" label="Platform"\/>/);
});

test("the entry carries the whole post, escaped so it cannot break the XML", () => {
  const xml = renderFeed({
    posts: [{ ...FINISHED, body: "A paragraph with <b>markup</b> & an ampersand.\n" }],
  });
  assert.match(xml, /<content type="html">/);
  // The post's HTML is text inside the element, not markup of the feed's own.
  assert.match(xml, /&lt;p&gt;/);
  assert.match(xml, /&amp;amp;|&amp;/);
  assert.doesNotMatch(xml, /<content type="html"><p>/);
});

test("a post the feed cannot place in time is left out, not dated with a guess", () => {
  const broken = { ...FINISHED, slug: "undateable", went_live_at: "soon", finalized_at: null, updated_at: null };
  const xml = renderFeed({ posts: [FINISHED, broken] });
  assert.doesNotMatch(xml, /undateable/);
  assert.equal(entries(xml).length, 1);
});

test("an empty feed is still a valid document", () => {
  const xml = renderFeed({ posts: [], now: "2026-09-17T11:00:00Z" });
  assert.equal(entries(xml).length, 0);
  assert.match(xml, /<updated>2026-09-17T11:00:00Z<\/updated>/);
  assert.match(xml, /<\/feed>/);
});

test("the blog offers the feed to a reader and to a browser", () => {
  for (const html of [renderBlogIndex([]), renderPost({ ...FINISHED, revisions: [] })]) {
    assert.match(
      html,
      /<link rel="alternate" type="application\/atom\+xml" href="\/feed\.xml"/,
      "no <link> means no subscribe button in any browser or reader",
    );
  }
  // And once in the page itself, where a person can see it.
  assert.match(renderBlogIndex([]), /<a href="\/feed\.xml">subscribe by feed<\/a>/);
});
