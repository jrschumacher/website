// GET / — the homepage: the field record.
//
// Static: the page is assembled from the modules in public/journal/, not from
// D1. The résumé data still drives /resume and /resume.txt; this page is the
// record as figures, and the figures have their own data file.

import { renderJournal } from "../render/journal.js";
import { resolvePortrait } from "../portrait.js";

export async function handleHome(request, env) {
  const portrait = await resolvePortrait(request, env);
  return new Response(renderJournal({ portrait }), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
