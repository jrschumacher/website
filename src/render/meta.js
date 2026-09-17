// Everything a page needs in order to be linked to: the canonical address, the
// share card (Open Graph and Twitter), the icons, and the structured data.
//
// This exists because a share card is a second rendering of a page that nobody
// looks at while building it — the one a reader sees first, pasted into Slack
// or a group chat, before deciding whether to click. It is therefore the part
// most likely to rot, so it is built from the same title and description the
// page already has rather than from a second set of strings kept alongside.
//
// Absolute URLs are not a style choice here: og:image, og:url and canonical are
// all specified as absolute, and a relative one is silently dropped by most
// crawlers. `SITE_ORIGIN` is the site's own constant rather than the request's
// host so a page served from a preview URL still points at the real one.

import { escapeHtml, isoDate } from "../format.js";
import { SITE_ORIGIN, SITE_NAME, SITE_AUTHOR } from "../config.js";

const e = escapeHtml;

/** The share card every page falls back to: the record itself. */
export const DEFAULT_SHARE_IMAGE = "/og/default.png";

/** The size the cards are drawn at — bin/make-images renders exactly this. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * The icons, identical on every page.
 *
 * Four files rather than one because the four consumers genuinely differ:
 *
 *   favicon.svg        the tab, at whatever size the browser feels like, and
 *                      the only one that stays sharp on a 4K display
 *   favicon.ico        the browsers and bookmark managers that never learned
 *                      to read an SVG; 16/32/48 packed into one file
 *   apple-touch-icon   iOS home screen, which ignores everything else and
 *                      wants exactly 180×180 with no transparency
 *   site.webmanifest   Android, and the install prompt: name, colours, 192/512
 *
 * `sizes="any"` on the SVG is the documented way to tell a browser that
 * understands SVG to prefer it over the .ico, instead of picking the .ico
 * because it advertises concrete pixel sizes and the SVG does not.
 */
export const SITE_ICONS = `<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#f1ead9">`;

/**
 * Turn a site path into the absolute URL a crawler needs.
 *
 * The pathname is assigned rather than resolved, because resolution is the one
 * way this could point somewhere else: `new URL("//evil.example", origin)` is a
 * protocol-relative URL and resolves to that host, and the 404 canonicalises
 * whatever path was requested. Assigning `pathname` cannot change the host.
 */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const url = new URL(SITE_ORIGIN);
  url.pathname = path.startsWith("/") ? path : `/${path}`;
  return url.toString();
}

function tag(attr, key, value) {
  if (!value) return "";
  return `<meta ${attr}="${e(key)}" content="${e(String(value))}">`;
}

/**
 * JSON-LD, inlined.
 *
 * `<` is escaped because the one way to break out of a <script> element is a
 * literal `</script>` in its text, and a post title is user-ish content: it
 * comes from D1, and D1 is written by a publish step, not by this Worker.
 */
function jsonLdScript(data) {
  if (!data) return "";
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}

/**
 * The head of a shareable page.
 *
 * @param {object} opts
 * @param {string} opts.title          the page title, as <title> has it
 * @param {string} [opts.description]  the same sentence <meta name="description"> has
 * @param {string} [opts.path]         this page's path, for canonical and og:url
 * @param {string} [opts.image]        share image path; the site card by default
 * @param {string} [opts.imageAlt]     alt text for it — read aloud on Mastodon
 * @param {string} [opts.type]         og:type; "article" for posts and case studies
 * @param {string} [opts.published]    ISO date, articles only
 * @param {string} [opts.modified]     ISO date, articles only
 * @param {boolean} [opts.noindex]     keep this page out of search results (the 404)
 * @param {object} [opts.jsonLd]       schema.org object to inline
 * @returns {string} markup for <head>
 */
export function shareHead({
  title,
  description,
  path = "/",
  image = DEFAULT_SHARE_IMAGE,
  imageAlt,
  type = "website",
  published,
  modified,
  noindex = false,
  jsonLd,
} = {}) {
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);

  // A card with no image is a grey box with a hostname in it, so the default is
  // always something rather than nothing.
  const card = [
    tag("property", "og:type", type),
    tag("property", "og:site_name", SITE_NAME),
    tag("property", "og:locale", "en_US"),
    tag("property", "og:title", title),
    tag("property", "og:description", description),
    tag("property", "og:url", url),
    tag("property", "og:image", img),
    tag("property", "og:image:width", SHARE_IMAGE_SIZE.width),
    tag("property", "og:image:height", SHARE_IMAGE_SIZE.height),
    tag("property", "og:image:alt", imageAlt || title),
    // Twitter reads the og: tags for everything it can, so only the two it has
    // no equivalent for are repeated. summary_large_image is the difference
    // between a thumbnail beside two lines of text and the card above.
    tag("name", "twitter:card", "summary_large_image"),
    tag("name", "twitter:image:alt", imageAlt || title),
  ];

  if (type === "article") {
    card.push(
      tag("property", "article:author", SITE_AUTHOR),
      tag("property", "article:published_time", isoDate(published)),
      tag("property", "article:modified_time", isoDate(modified)),
    );
  }

  return [
    `<link rel="canonical" href="${e(url)}">`,
    noindex ? `<meta name="robots" content="noindex, follow">` : "",
    tag("name", "author", SITE_AUTHOR),
    ...card,
    SITE_ICONS,
    jsonLdScript(jsonLd),
  ]
    .filter(Boolean)
    .join("\n");
}

/** The site's own identity, for the homepage: who this is and where else he is. */
export function personJsonLd({ contact = [], now = null } = {}) {
  const sameAs = contact
    .filter((c) => c.href && c.href.startsWith("http"))
    .map((c) => c.href);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_AUTHOR,
    url: absoluteUrl("/"),
    ...(now ? { jobTitle: jobTitleFrom(now) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/**
 * The homepage's current-role line is prose — "now — director of platform,
 * virtru · remote" — and schema.org wants a job title. Take the part before the
 * first comma, drop the "now —" marker, and give up rather than guess if the
 * line does not look like that.
 */
function jobTitleFrom(now) {
  const title = String(now).replace(/^now\s*—\s*/, "").split(",")[0].trim();
  return title || undefined;
}

/** One blog post, as a search engine would like it described. */
export function postJsonLd(post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.summary ? { description: post.summary } : {}),
    ...(isoDate(post.went_live_at) ? { datePublished: isoDate(post.went_live_at) } : {}),
    ...(isoDate(post.finalized_at) ? { dateModified: isoDate(post.finalized_at) } : {}),
    author: { "@type": "Person", name: SITE_AUTHOR, url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}
