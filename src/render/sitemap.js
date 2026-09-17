// /sitemap.xml — every page on the site, for the crawlers that ask for one.
//
// Same principle as llms.txt next door: generated from the sources the pages
// themselves render from, never hand-kept, because a hand-kept list starts
// lying the first time something is published.
//
// Two things this file deliberately does not emit:
//
//   <changefreq> and <priority>  Google ignores both and has said so. They are
//                                a guess dressed as a fact, and there is
//                                nothing here that would make the guess true.
//
//   an invented <lastmod>        A post carries real timestamps, so it gets
//                                one. A page assembled from a data file in the
//                                repo does not, and "today" — which is what
//                                every generator reaches for — tells a crawler
//                                the whole site changed every time it is
//                                fetched, which is how a sitemap earns itself
//                                being ignored.

import { SITE_ORIGIN } from "../config.js";
import { isoDate } from "../format.js";

/** The pages that exist whether or not any database answers. */
export const SECTIONS = ["/", "/work", "/blog", "/talks", "/resume"];

/**
 * XML's five, not HTML's.
 *
 * Paths reach this file already percent-encoded by encodeURIComponent, so in
 * practice there is nothing left to escape. It is done anyway: the one thing
 * standing between a slug and a malformed document should not be an assumption
 * about a caller two files away.
 */
function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function entry({ path, lastmod }) {
  const date = isoDate(lastmod);
  return [
    "  <url>",
    `    <loc>${escapeXml(`${SITE_ORIGIN}${path}`)}</loc>`,
    date ? `    <lastmod>${escapeXml(date)}</lastmod>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * When a post last changed, as honestly as the row can say it.
 *
 * `updated_at` moves whenever the row is written, which for a living post is
 * the revision that changed it. `finalized_at` is the last thing that will ever
 * happen to a finished one, and `went_live_at` is all a post that has had no
 * second thought has ever had.
 */
function postLastmod(post) {
  return post.updated_at || post.finalized_at || post.went_live_at || null;
}

/**
 * Every page on the site, in the order it should be read: the sections first,
 * then what is under them.
 *
 * Pure, and separate from the route, because the route imports the deck
 * registry — which pulls decks/*.md through the wrangler Text rule and only
 * resolves inside the Worker bundle, so a module that imports it cannot be
 * loaded by `node --test`. The assembly is the part worth testing, so the
 * assembly is the part that stays out of that graph.
 *
 * @param {object} data
 * @param {object[]} [data.studies]  caseStudies
 * @param {object[]} [data.posts]    live posts
 * @param {object[]} [data.talks]    registry.listDecks() rows
 */
export function sitemapUrls({ studies = [], posts = [], talks = [] } = {}) {
  return [
    ...SECTIONS.map((path) => ({ path })),
    ...studies.map((cs) => ({ path: `/work/${encodeURIComponent(cs.slug)}` })),
    ...posts.map((post) => ({
      path: `/blog/${encodeURIComponent(post.slug)}`,
      lastmod: postLastmod(post),
    })),
    // A deck's frontmatter date is when the talk was given, which is not when
    // the page last changed. Rather than dress one up as the other, the deck
    // pages are listed without a lastmod — an absent one costs nothing, and a
    // wrong one is what teaches a crawler to stop reading the file.
    ...talks.map(({ slug }) => ({ path: `/talks/${encodeURIComponent(slug)}` })),
  ];
}

/**
 * @param {{ path: string, lastmod?: string|null }[]} urls  in the order they
 *   should be read: the sections first, then what is under them.
 * @returns {string} an XML sitemap (sitemaps.org 0.9)
 */
export function renderSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(entry).join("\n")}
</urlset>
`;
}
