// GET /sitemap.xml — every page, listed once.
//
// The same shape as /llms.txt, and for the same reason: each source is asked
// independently and each one is allowed to fail. A sitemap missing its posts
// because D1 blinked is worth serving; a 500 tells a crawler the site is
// broken, and it will believe that for longer than the outage lasts.
//
// The list itself is assembled in src/render/sitemap.js. This file is the part
// that talks to the world — the registry import is why it cannot be reached
// from a test, and the reason the assembly lives next door.
//
// What is NOT in it: /resume.txt, /resume.md and /llms.txt, which are other
// renderings of pages already listed, and /talks/<slug>?presenter, which is the
// speaker's screen and says so with a noindex. A sitemap is a list of pages, not
// of URLs that happen to respond.

import { listPosts } from "../blog/db.js";
import { listDecks } from "../talks/registry.js";
import { caseStudies } from "../../public/journal/data/site.js";
import { renderSitemap, sitemapUrls } from "../render/sitemap.js";

async function attempt(what, fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.error(`sitemap: ${what}: ${err?.message ?? err}`);
    return fallback;
  }
}

export async function handleSitemap(request, env) {
  const [posts, talks] = await Promise.all([
    attempt("posts", () => listPosts(env.BLOG), []),
    attempt("talks", () => listDecks(), []),
  ]);

  const body = renderSitemap(sitemapUrls({ studies: caseStudies, posts, talks }));

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
