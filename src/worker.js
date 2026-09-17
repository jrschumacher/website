// aboldnewlook.com — one Worker, two D1 bindings, no build step.
//
//   RESUME -> resume-public   (profile, companies, roles, accomplishments, targets)
//   BLOG   -> personal-blog   (posts, revisions, tags, post_tags, source_ideas)
//
// Everything here is a public GET. There is no write path and no auth, by
// design: the private job-pipeline data lives in a different database that this
// Worker has no binding to and therefore cannot reach.

import { handleHome } from "./routes/home.js";
import { handleResumeHtml, handleResumeText, handleResumeMarkdown } from "./routes/resume.js";
import { handleBlogIndex, handleBlogPost } from "./routes/blog.js";
import { handleTalksIndex, handleTalk, handlePatternSvg } from "./routes/talks.js";
import { handleWorkIndex, handleWork } from "./routes/work.js";
import { handleLlmsTxt } from "./routes/llms.js";
import { handleSitemap } from "./routes/sitemap.js";
import { layout } from "./render/layout.js";
import { SITE_ORIGIN } from "./config.js";

/** The one host this site answers on; www redirects to it. */
const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname;

function plain(body, status) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

/**
 * The 404, at whatever address was asked for.
 *
 * The path is passed in so the page's canonical link names the URL that was
 * actually requested rather than the homepage; `noindex` is what keeps a
 * crawler from filing it, since a 404 that canonicalises to "/" is an
 * invitation to treat every typo as a copy of the front page.
 */
function notFound(path = "/") {
  return new Response(
    layout({
      title: "Not found — Ryan Schumacher",
      path,
      noindex: true,
      body: `<h1 class="page-title">Not found</h1>
<p class="page-lede">There is nothing at this address.</p>
<div class="empty"><p><a href="/">The record</a> · <a href="/work">Case studies</a> · <a href="/blog">Blog</a> · <a href="/talks">Talks</a> · <a href="/resume">Résumé</a></p></div>`,
    }),
    { status: 404, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

/** Strip a trailing slash so /blog/ and /blog are the same page. */
function normalize(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export default {
  async fetch(request, env) {
    const method = request.method;
    if (method !== "GET" && method !== "HEAD") {
      return new Response("Method not allowed\n", {
        status: 405,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          allow: "GET, HEAD",
        },
      });
    }

    const url = new URL(request.url);

    // One canonical address. www is served only so it does not fail, and it
    // redirects rather than duplicating every page at a second URL. The host
    // comes from SITE_ORIGIN, which is also what every canonical link and share
    // card is built from: two copies of the site's own address is one too many.
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    const path = normalize(url.pathname);

    try {
      let response;
      if (path === "/") {
        response = await handleHome(request, env);
      } else if (path === "/resume") {
        response = await handleResumeHtml(request, env);
      } else if (path === "/resume.md") {
        response = await handleResumeMarkdown(request, env);
      } else if (path === "/resume.txt") {
        response = await handleResumeText(request, env);
      } else if (path === "/llms.txt") {
        response = await handleLlmsTxt(request, env);
      } else if (path === "/sitemap.xml") {
        response = await handleSitemap(request, env);
      } else if (path === "/work") {
        response = await handleWorkIndex(request, env);
      } else if (path.startsWith("/work/")) {
        const slug = decodeURIComponent(path.slice("/work/".length));
        response = slug ? await handleWork(request, env, slug) : null;
      } else if (path === "/blog") {
        response = await handleBlogIndex(request, env);
      } else if (path.startsWith("/blog/")) {
        const slug = decodeURIComponent(path.slice("/blog/".length));
        response = slug ? await handleBlogPost(request, env, slug) : null;
      } else if (path === "/talks") {
        response = await handleTalksIndex(request, env);
      } else if (path.startsWith("/talks/")) {
        const slug = decodeURIComponent(path.slice("/talks/".length));
        response = slug ? await handleTalk(request, env, slug) : null;
      } else if (path === "/deck/pattern.svg") {
        response = await handlePatternSvg(request, env);
      }

      if (!response) response = notFound(path);

      // HEAD is GET without the body; let the router stay body-shaped.
      if (method === "HEAD") {
        return new Response(null, {
          status: response.status,
          headers: response.headers,
        });
      }
      return response;
    } catch (err) {
      console.error(err);
      return plain(`Internal error: ${err?.message ?? err}\n`, 500);
    }
  },
};
