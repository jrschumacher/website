// /llms.txt — the site, for something that is reading it rather than looking
// at it. The format is llmstxt.org's: an H1, a blockquote summary, then H2
// sections of links with a short description each.
//
// Everything in it is generated from the same sources the pages are: the deck
// registry, the case-study data, the live posts in D1. A hand-written map
// would start lying the first time something was published, and the whole
// point of the file is that it is true.
//
// The links are absolute. A crawler that has this file has usually lost the
// base it fetched it from.

const BASE = "https://aboldnewlook.com";

/** Collapse to one line: a description here is metadata, not prose. */
function oneLine(text, limit = 220) {
  if (!text) return "";
  const flat = String(text).replace(/\s+/g, " ").trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1).trimEnd()}…` : flat;
}

function link(title, path, description) {
  const desc = oneLine(description);
  return `- [${title}](${BASE}${path})${desc ? `: ${desc}` : ""}`;
}

function section(heading, lines) {
  return lines.length ? ["", `## ${heading}`, "", ...lines] : [];
}

/**
 * @param {object} data
 * @param {string} [data.headline]   the résumé headline, if it loaded
 * @param {string} [data.summary]    the résumé summary, if it loaded
 * @param {object[]} [data.studies]  caseStudies
 * @param {object[]} [data.talks]    registry.listDecks() rows
 * @param {object[]} [data.posts]    live posts, newest first
 */
export function renderLlmsTxt({ headline, summary, studies = [], talks = [], posts = [] } = {}) {
  const out = [
    "# Ryan Schumacher",
    "",
    `> ${oneLine(headline) || "Principal engineer in data-centric security and identity."}`,
  ];

  if (summary) out.push("", oneLine(summary, 600));

  out.push(
    "",
    "This site is a field record: prose, two figures drawn from the work, case",
    "studies, field notes, talks, and a résumé. Every page below is server-rendered",
    "HTML with no client-side routing, so fetching a URL gets you the whole page.",
  );

  out.push(
    ...section("Start here", [
      link("The record", "/", "The homepage: who I am, the figures, and the work in one page."),
      link("Résumé (Markdown)", "/resume.md", "The résumé as Markdown — the version to parse."),
      link("Résumé", "/resume", "The same résumé as a page, and as something to print."),
      link("Résumé (plain text)", "/resume.txt", "The same résumé with no markup at all."),
    ]),
  );

  out.push(
    ...section(
      "Case studies",
      [
        link("All case studies", "/work", "Work I can describe in public, one page each."),
        ...studies.map((cs) =>
          link(cs.title, `/work/${encodeURIComponent(cs.slug)}`, `${cs.kicker} — ${cs.story}`),
        ),
      ],
    ),
  );

  out.push(
    ...section("Talks", [
      link("All talks", "/talks", "Decks, written as pages first; each one reads top to bottom."),
      ...talks.map(({ slug, meta }) =>
        link(meta.title, `/talks/${encodeURIComponent(slug)}`, meta.summary),
      ),
    ]),
  );

  out.push(
    ...section("Writing", [
      link("Blog", "/blog", "Posts, newest first."),
      ...posts.map((p) => link(p.title, `/blog/${encodeURIComponent(p.slug)}`, p.summary)),
    ]),
  );

  return out.join("\n") + "\n";
}
