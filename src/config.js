// Site-wide knobs. Deliberately one file, deliberately tiny.

/**
 * Which résumé target `/resume` and `/resume.txt` render.
 *
 * `targets` has no "default" column and this Worker does not get to change that
 * schema, so the choice lives here as a constant. Change this one string to
 * re-point the résumé; everything else follows.
 *
 * Current targets: "principal-security", "staff-architect".
 */
export const DEFAULT_TARGET = "principal-security";

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
