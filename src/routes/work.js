// GET /work        — every case study.
// GET /work/:slug  — one of them.
//
// The data is the same module the homepage and the browser both import
// (public/journal/data/site.js), so there is one list of case studies on the
// site and it is the one section IV renders.

import { caseStudies } from "../../public/journal/data/site.js";
import { renderWorkIndex, renderWorkPage } from "../render/work.js";

const HTML = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=300",
};

export function handleWorkIndex() {
  return new Response(renderWorkIndex(caseStudies), { headers: HTML });
}

/** Returns null for an unknown slug; the router turns that into a 404. */
export function handleWork(request, env, slug) {
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return null;
  return new Response(renderWorkPage(cs), { headers: HTML });
}
