// GET /feed.xml — the blog, for a reader rather than a browser.
//
// A feed reader keeps what it has already fetched, so an empty document is not
// destructive the way it would be for a page: nothing is un-published by a feed
// that comes back short. That is why this follows /llms.txt and /sitemap.xml in
// serving what it has rather than failing — and why the log line matters, since
// a feed that quietly empties is otherwise invisible from the outside.

import { listFeedPosts } from "../blog/db.js";
import { renderFeed } from "../render/feed.js";

/** How many entries. A feed is a window; /blog is the archive. */
const WINDOW = 20;

export async function handleFeed(request, env) {
  let posts = [];
  try {
    posts = await listFeedPosts(env.BLOG, WINDOW);
  } catch (err) {
    console.error(`feed: posts: ${err?.message ?? err}`);
  }

  const body = renderFeed({ posts, now: new Date().toISOString().replace(/\.\d+Z$/, "Z") });

  return new Response(body, {
    headers: {
      // The registered type for Atom. Browsers download rather than render it,
      // which is correct: this document is for the reader that subscribed.
      "content-type": "application/atom+xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
