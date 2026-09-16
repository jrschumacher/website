// Where the portrait in section I comes from.
//
// The design leaves the frame a drop-slot, and the point of this module is that
// filling it should be a file, not a code change: drop `portrait.jpg` into
// `public/` and the slot becomes the image on the next deploy. Nothing else to
// edit, nothing to remember.
//
// That means asking the assets binding whether the file is there. It is one
// subrequest, memoized per isolate against `env`, so in practice it happens
// once when an isolate wakes and never again — and a deploy (which is the only
// way the answer changes) gives every isolate a fresh start anyway.

import { PORTRAIT } from "./config.js";

/** Tried in order; the first one that exists wins. */
const CANDIDATES = ["/portrait.jpg", "/portrait.jpeg", "/portrait.png", "/portrait.webp"];

// Keyed by env so the memo dies with the isolate and tests can pass a fresh one.
const probed = new WeakMap();

/**
 * @returns {Promise<string|null>} a URL for the <img>, or null for the placeholder
 */
export async function resolvePortrait(request, env) {
  // An explicit setting still wins — for a different filename, or an off-site URL.
  if (PORTRAIT) return PORTRAIT;
  if (!env || !env.ASSETS) return null;
  if (probed.has(env)) return probed.get(env);

  let found = null;
  for (const path of CANDIDATES) {
    try {
      const res = await env.ASSETS.fetch(new URL(path, request.url));
      // Read nothing: we only wanted the status.
      if (res.body) await res.body.cancel();
      if (res.ok) { found = path; break; }
    } catch {
      // A binding that throws is the same answer as a missing file: no portrait.
      break;
    }
  }
  probed.set(env, found);
  return found;
}
