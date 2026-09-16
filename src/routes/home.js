// GET / — the homepage: the field record.
//
// Static: the page is assembled from the modules in public/journal/, not from
// D1. The résumé data still drives /resume and /resume.txt; this page is the
// record as figures, and the figures have their own data file.

import { renderJournal } from "../render/journal.js";

export async function handleHome() {
  return new Response(renderJournal(), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
