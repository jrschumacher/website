// Site-wide knobs. Deliberately one file, deliberately tiny.

/**
 * Which résumé target `/resume` and `/resume.txt` render.
 *
 * `targets` has no "default" column and this Worker does not get to change that
 * schema, so the choice lives here as a constant. Change this one string to
 * re-point the résumé; everything else follows.
 *
 * `website` is the one this site serves, and the only one written for a public
 * page rather than for a job application. It sets no include filter, so every
 * bullet is eligible: the others are tailored to a kind of role and silently
 * drop whole jobs that do not match them. `principal-security` excludes
 * `frontend` and `microfrontends` and omits `leadership` and `founder`, which
 * is why BBVA and the three ventures rendered as headings with nothing under
 * them — one bullet each, both filtered out.
 *
 * It caps at 6 bullets per role. Not a privacy control: ranking decides which 6
 * and the ranking moves when the data does. Anything that must not be published
 * is tagged `private` in resume-backlog and never leaves it (bin/publish-resume).
 *
 * Current public targets: "website", "principal-security", "staff-architect".
 */
export const DEFAULT_TARGET = "website";

export const SITE_NAME = "aboldnewlook";

/**
 * An override for the portrait in section I of the homepage.
 *
 * Normally you do not touch this. Drop `portrait.jpg` (or .jpeg/.png/.webp)
 * into `public/` and the slot becomes the image on the next deploy — same
 * frame, same tape, same tilt — because `src/portrait.js` looks for it.
 *
 * Set this only to name a file those four candidates would miss, or to point
 * the frame at an image hosted somewhere else. Until a real photograph exists
 * the page renders the empty frame rather than a stand-in face.
 */
export const PORTRAIT = null;

/**
 * The one address this site lives at.
 *
 * Needed because a share card cannot be relative: Open Graph, Twitter and
 * JSON-LD all demand absolute URLs, and so does `<link rel="canonical">`. The
 * Worker could read the request's own origin instead, but then a page fetched
 * through a preview URL would advertise that preview URL as canonical and
 * invite crawlers to index it. One constant, one canonical home.
 */
export const SITE_ORIGIN = "https://aboldnewlook.com";

/** The person the site is about. Used in the share cards and the JSON-LD. */
export const SITE_AUTHOR = "Ryan Schumacher";
