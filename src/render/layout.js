// The shell for every page that is not the homepage: /resume, /blog, /blog/:slug
// and the 404. The nav, the stylesheet and the <head> exist in exactly one place.
//
// The homepage has its own document (src/render/journal.js): it carries the
// field journal's own index and colophon instead of this nav and footer, and it
// is the only page on the site that loads a script.

import { escapeHtml } from "../format.js";
import { SITE_STYLESHEET } from "./css.js";

const e = escapeHtml;

export const NAV = [
  { href: "/", label: "The record", key: "home" },
  { href: "/work", label: "Case studies", key: "work" },
  { href: "/blog", label: "Blog", key: "blog" },
  { href: "/talks", label: "Talks", key: "talks" },
  { href: "/resume", label: "Résumé", key: "resume" },
];
// /resume.txt is deliberately not here. It is one of several renderings of the
// résumé (.txt, .md, print), and they belong with the document rather than in a
// nav that every page carries — /resume offers them in its masthead.

// The machine-readable map of the site (llmstxt.org). It is the same file on
// every page, which is the point: whichever page a crawler lands on, the way
// to the rest of the site in one fetch is one link away.
const LLMS = `<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt">`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet">`;

function nav(current) {
  const items = NAV.map((item) => {
    const here = item.key === current ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${here}>${e(item.label)}</a>`;
  }).join("");
  return `<nav class="sitenav" aria-label="Site">${items}</nav>`;
}

/**
 * @param {object} opts
 * @param {string} opts.title        <title> text (already plain, escaped here)
 * @param {string} [opts.description] meta description
 * @param {string} [opts.current]    nav key to mark as current
 * @param {string} [opts.stylesheet] CSS to inline; the blog/404 sheet by default
 * @param {boolean} [opts.fonts]     link Google Fonts (false for /resume, which
 *                                   is set in the résumé's own print families)
 * @param {string} [opts.head]       extra markup for <head>; the deck pages use
 *                                   it to add their own stylesheet
 * @param {boolean} [opts.wide]      widen the shell past the 760px reading
 *                                   column, for pages that lay cards out side
 *                                   by side rather than set prose (/talks).
 *                                   The class goes on <body> because the nav
 *                                   rule and the footer rule have to grow with
 *                                   the content or they stop lining up.
 * @param {string} opts.body         markup for the <main class="page"> element
 * @param {string} [opts.head]       extra markup for <head> (stylesheets, font links)
 */
export function layout({ title, description, current, stylesheet, fonts = true, head, wide = false, body }) {
  const desc = description
    ? `<meta name="description" content="${e(description)}">`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
${desc}
${fonts ? FONTS : ""}
${LLMS}
<style>${stylesheet ?? SITE_STYLESHEET}</style>
${head ?? ""}
</head>
<body${wide ? ' class="wide"' : ""}>
${nav(current)}
<main class="page">
${body}
</main>
<footer class="sitefoot">
  <p>Ryan Schumacher · <a href="https://github.com/jrschumacher">github.com/jrschumacher</a></p>
</footer>
</body>
</html>`;
}
