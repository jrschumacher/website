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
 * The portrait in section I of the homepage.
 *
 * The design leaves this a drop-slot: until a real photograph exists the page
 * renders the empty frame rather than a stand-in face. Put the file in
 * `public/` and point this at it — `"/portrait.jpg"` — and the slot becomes the
 * image, same frame, same tape, same tilt.
 */
export const PORTRAIT = null;
