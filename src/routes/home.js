// GET / — the homepage: the field record.
//
// Static: the page is assembled from the modules in public/journal/, not from
// D1. The résumé data still drives /resume and /resume.txt; this page is the
// record as figures, and the figures have their own data file.

import { renderJournal } from "../render/journal.js";
import { resolvePortrait } from "../portrait.js";
import { listDecks } from "../talks/registry.js";
import { loadJournalFacts } from "../journal/facts.js";

/**
 * Section VI, from the deck registry rather than a hand-kept list.
 *
 * The registry is imported here and not in the renderer on purpose: it pulls
 * decks/*.md through the wrangler Text rule, which only resolves inside the
 * Worker bundle, so importing it from render/journal.js would put a module
 * `node --test` cannot load into the renderer's graph.
 *
 * A deck carries a title and a summary. Date and venue are optional and the
 * decks in the repo have neither, so the card shows what exists and omits the
 * rest rather than inventing a year or a venue.
 */
function talkRows() {
  try {
    return listDecks().map(({ slug, meta }) => ({
      href: `/talks/${slug}`,
      title: meta.title,
      year: meta.date ? String(meta.date).slice(0, 4) : "",
      venue: meta.venue || "",
      summary: meta.summary || "",
    }));
  } catch (err) {
    // A broken registry costs the homepage its talks section, never the page.
    console.error(`talks: ${err?.message ?? err}`);
    return [];
  }
}

/** The résumé-backed facts, or nulls if D1 is unreachable — never a 500. */
async function facts(env) {
  try {
    return await loadJournalFacts(env.RESUME);
  } catch (err) {
    console.error(`journal facts: ${err?.message ?? err}`);
    return { contact: [], now: null };
  }
}

export async function handleHome(request, env) {
  const [portrait, resume] = await Promise.all([resolvePortrait(request, env), facts(env)]);
  return new Response(renderJournal({ portrait, talks: talkRows(), ...resume }), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
