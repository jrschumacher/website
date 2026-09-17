// /feed.xml — the blog as Atom.
//
// Atom rather than RSS because this blog has living posts, and Atom is the
// format that has an answer for them: every entry carries both <published> and
// <updated>, and its <id> is stable across both. A post that is revised keeps
// its identity and moves its <updated>, which is exactly what a reader needs to
// show it as changed rather than as new. RSS has one date per item and no
// identity beyond the link, so the same post revised is either invisible or a
// duplicate.
//
// The entries carry the whole post, not a teaser. A feed that withholds the
// text to make you click is a feed that gets unsubscribed from, and the revision
// notes at the end of a living post are the part a returning reader came for.

import { SITE_ORIGIN, SITE_NAME, SITE_AUTHOR } from "../config.js";
import { isoDateTime } from "../format.js";
import { renderMarkdown } from "../blog/markdown.js";

/** XML's five. The post's own HTML is escaped whole and carried as text. */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const FEED_PATH = "/feed.xml";
const BLOG_PATH = "/blog";

const TITLE = `${SITE_NAME} — blog`;
const SUBTITLE =
  "Notes on building things, and on working with the machines that help build them.";

/**
 * When a post last changed, as honestly as the row can say it — the same order
 * the sitemap uses, for the same reason.
 */
function lastChanged(post) {
  return post.updated_at || post.finalized_at || post.went_live_at || null;
}

function entry(post) {
  const url = `${SITE_ORIGIN}/blog/${encodeURIComponent(post.slug)}`;
  const published = isoDateTime(post.went_live_at);
  const updated = isoDateTime(lastChanged(post)) || published;

  const categories = (post.tags ?? [])
    .map((t) => `  <category term="${escapeXml(t.key)}" label="${escapeXml(t.label)}"/>`)
    .join("\n");

  return [
    "<entry>",
    `  <title>${escapeXml(post.title)}</title>`,
    // The address is the identity: this site's post URLs are permanent, which
    // is the whole claim a slug makes. A tag: URI would be more fashionable and
    // no more stable.
    `  <id>${escapeXml(url)}</id>`,
    `  <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>`,
    published ? `  <published>${escapeXml(published)}</published>` : "",
    `  <updated>${escapeXml(updated)}</updated>`,
    post.summary ? `  <summary>${escapeXml(post.summary)}</summary>` : "",
    categories,
    // A living post is still being revised, and a reader who subscribed should
    // see that in the reader rather than have to visit to find out.
    post.finalized_at ? "" : `  <category term="living" label="Living"/>`,
    `  <content type="html">${escapeXml(renderMarkdown(post.body))}</content>`,
    "</entry>",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * @param {object} data
 * @param {object[]} [data.posts]  live posts with bodies, newest first
 * @param {string} [data.now]      RFC 3339; used only when there is nothing to
 *   date the feed by. Passed in rather than read from the clock so the document
 *   stays a pure function of its inputs.
 * @returns {string} an Atom 1.0 document
 */
export function renderFeed({ posts = [], now = "" } = {}) {
  // A post the feed cannot place in time is left out, with a line in the log.
  // went_live_at is the site's own visibility predicate, so every live post has
  // one; a row that has one and cannot be parsed is a publish-step bug, and a
  // reader sorted by a date nobody can read is worse than a reader short a post.
  const usable = posts.filter((post) => {
    if (isoDateTime(post.went_live_at) || isoDateTime(lastChanged(post))) return true;
    console.error(`feed: ${post.slug}: no usable timestamp, left out`);
    return false;
  });

  const updated =
    usable
      .map((post) => isoDateTime(lastChanged(post)) || isoDateTime(post.went_live_at))
      .sort()
      .pop() || now;

  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:base="${escapeXml(`${SITE_ORIGIN}/`)}">
<title>${escapeXml(TITLE)}</title>
<subtitle>${escapeXml(SUBTITLE)}</subtitle>
<id>${escapeXml(`${SITE_ORIGIN}${BLOG_PATH}`)}</id>
<link rel="alternate" type="text/html" href="${escapeXml(`${SITE_ORIGIN}${BLOG_PATH}`)}"/>
<link rel="self" type="application/atom+xml" href="${escapeXml(`${SITE_ORIGIN}${FEED_PATH}`)}"/>
${updated ? `<updated>${escapeXml(updated)}</updated>` : ""}
<author>
  <name>${escapeXml(SITE_AUTHOR)}</name>
  <uri>${escapeXml(`${SITE_ORIGIN}/`)}</uri>
</author>
${usable.map(entry).join("\n")}
</feed>
`;
}
