// GET /llms.txt — the site map for machines.
//
// Every source is consulted independently and every one of them is allowed to
// fail. A file whose job is to describe the site is worth serving with three
// sections when the fourth's database is unreachable; returning a 500 because
// the blog is down would tell a crawler the site does not exist.

import { DEFAULT_TARGET } from "../config.js";
import { getTarget, loadBacklog } from "../resume/db.js";
import { assemble } from "../scope.js";
import { listPosts } from "../blog/db.js";
import { listDecks } from "../talks/registry.js";
import { caseStudies } from "../../public/journal/data/site.js";
import { renderLlmsTxt } from "../render/llms.js";

async function attempt(what, fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.error(`llms.txt: ${what}: ${err?.message ?? err}`);
    return fallback;
  }
}

export async function handleLlmsTxt(request, env) {
  const [resume, posts, talks] = await Promise.all([
    attempt(
      "resume",
      async () => {
        const target = await getTarget(env.RESUME, DEFAULT_TARGET);
        if (!target) return null;
        return assemble(target, await loadBacklog(env.RESUME));
      },
      null,
    ),
    attempt("posts", () => listPosts(env.BLOG), []),
    attempt("talks", async () => listDecks(), []),
  ]);

  const body = renderLlmsTxt({
    headline: resume?.headline,
    summary: resume?.summary,
    studies: caseStudies,
    talks,
    posts,
  });

  return new Response(body, {
    headers: {
      // text/plain, per llmstxt.org: the file is meant to be fetched and read,
      // not downloaded.
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
