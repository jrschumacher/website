// The headers every response from this Worker carries, set in one place.
//
// The site is server-rendered HTML with no forms, no third-party scripts, no
// analytics and no user input — which is exactly the site that can afford a
// strict policy, and exactly the site where one costs nothing to keep. The
// value is in what it forecloses: if anything ever does inject a <script> into
// a page here, the browser refuses it rather than running it.
//
// Static assets (the icons, the share cards, public/journal/*.js) are served by
// the assets layer ahead of this Worker and do not get these headers. That is
// fine — a Content Security Policy governs documents, and the documents all
// come from here.

/**
 * What each source in the policy is actually for:
 *
 *   default-src 'self'      everything not named below: this origin only
 *   script-src              the two module scripts the site serves itself
 *                           (public/journal/page.js, public/talks/deck.js) and
 *                           nothing else. See PRINT_HANDLER_HASH below for the
 *                           one inline handler on the site
 *   style-src               every stylesheet here is inlined in a <style> and
 *                           several elements carry style="…", so 'unsafe-inline'
 *                           is load-bearing rather than lazy: hashing a sheet
 *                           that is generated per-page would break on any edit
 *   font-src                Google Fonts serves the font files from gstatic
 *   img-src data:           the figures' SVG filters and the case-study plates
 *   base-uri 'none'         a <base> tag is how an injection re-points every
 *                           relative URL on a page; nothing here needs one
 *   form-action 'none'      there is not a single <form> on this site
 *   frame-ancestors 'self'  the decks are meant to be opened, not embedded
 *   object-src 'none'       no plugins, ever
 */
/*
 * The one inline handler on the site: `onclick="window.print()"` on the
 * résumé's print button (src/render/html.js). An inline handler cannot be
 * moved to a file without giving /resume a script, which it has never had and
 * does not need, so it is allowed by hash instead — 'unsafe-hashes' is what
 * lets a hash cover an event handler rather than a <script> block.
 *
 * This is the sha256 of the handler's text, exactly:
 *
 *   node -e "console.log(require('node:crypto').createHash('sha256').update('window.print()').digest('base64'))"
 *
 * Change the handler and the button stops working until this is recomputed —
 * which is the trade: one string that has to be kept in step, in exchange for a
 * policy that refuses every other inline script on the site.
 */
const PRINT_HANDLER_HASH = "'sha256-MguIPR6qNR8D3B+eAlK+bIRTZe8t3wkOY4B/56Me9FU='";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-hashes' ${PRINT_HANDLER_HASH}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'self'",
  "object-src 'none'",
].join("; ");

export const SECURITY_HEADERS = {
  "content-security-policy": CSP,
  // Every response here declares its own content type and means it. Without
  // this, a browser is free to sniff /resume.txt into something executable.
  "x-content-type-options": "nosniff",
  // Other sites learn that someone came from aboldnewlook.com, and not which
  // page they were reading — which for /resume is the difference between a
  // referrer and a disclosure.
  "referrer-policy": "strict-origin-when-cross-origin",
};

/**
 * Return the response with those headers added.
 *
 * A new Response is constructed rather than mutating headers in place because
 * `Response.redirect()` returns an immutable set, and the www redirect is
 * exactly a response that should not be exempt.
 *
 * Anything the handler set for itself wins: a route that has a reason to send
 * its own policy is making a decision, and this is a floor, not a ceiling.
 */
export function harden(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
