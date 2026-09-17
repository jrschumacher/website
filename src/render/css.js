import { CASE_MARKS, CASE_STUDY_CSS } from "./case-css.js";

// The stylesheets for everything that is not the homepage.
//
// Four of them, because the pages want different paper:
//
//   RESUME_STYLESHEET — the canonical résumé stylesheet ported from
//     jrschumacher/resume (src/render/css.js), still unchanged in its résumé
//     rules, plus the nav and footer. It is a document meant to print on Letter,
//     and it stays one.
//   SITE_STYLESHEET — the blog and the 404, in the field-journal palette the
//     homepage introduced: parchment, EB Garamond, IBM Plex Mono for the marks
//     in the margin, a 2px ink rule over a hairline under every section head.
//   WORK_STYLESHEET — /work and /work/<slug>, the site sheet plus the very
//     rules section IV of the homepage renders case studies with, imported
//     from case-css.js rather than written a second time.
//   TALKS_STYLESHEET — the same site sheet plus the light table: /talks lays
//     every deck out as a transparency, and /talks/<slug> uses the same rules
//     for the frame it mounts a deck in. A deck's own theme is not here — it
//     ships inside the deck and is made for a projector, not for this paper.
//
// The design pass the old note here promised is the one that produced them.

const RESUME_CSS = `
:root {
  --ink: #1a1a1a;
  --muted: #555;
  --rule: #d9d9d9;
  --accent: #14507a;
  --max: 8.5in;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  color: var(--ink);
  background: #f4f4f5;
  font: 11pt/1.42 "Georgia", "Times New Roman", serif;
}
.page {
  max-width: var(--max);
  margin: 0.4in auto;
  padding: 0.55in 0.6in;
  background: #fff;
  box-shadow: 0 1px 6px rgba(0,0,0,.12);
}
header.masthead { text-align: center; margin-bottom: 14px; }
h1.name {
  margin: 0;
  font-size: 23pt;
  letter-spacing: .5px;
  font-weight: 700;
}
.headline {
  margin: 3px 0 6px;
  font-size: 11.5pt;
  font-style: italic;
  color: var(--accent);
}
.contact {
  font-size: 9.5pt;
  color: var(--muted);
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.contact a { color: inherit; text-decoration: none; }
.summary {
  margin: 10px 0 4px;
  text-align: justify;
  hyphens: auto;
}
section { margin-top: 14px; }
h2.section-title {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 10.5pt;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: var(--accent);
  border-bottom: 1.5px solid var(--accent);
  padding-bottom: 2px;
  margin: 0 0 7px;
}
ul { margin: 4px 0 0; padding-left: 18px; }
li { margin: 3px 0; }
/* Companies were separated only by the trailing margin of the last role's
   <ul>, so a role with no bullets let the next company name collide with it.
   The gap between two employers is structural and should not depend on whether
   the last one happened to have bullets selected for this target. */
.company + .company { margin-top: 13px; }
.role { margin-top: 9px; }
.role:first-child { margin-top: 4px; }
/* And a bulletless role needs its own floor, or the next role's title sits on
   top of it at the same 9px used between a bullet list and the next title. */
.role:not(:has(ul)) { padding-bottom: 3px; }
.company-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
.company-name { font-weight: 700; font-size: 11.5pt; }
.company-loc { color: var(--muted); font-size: 9.5pt; white-space: nowrap; }
.role-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 10.5pt;
}
.role-title { font-weight: 600; }
.role-note { font-weight: 400; font-style: italic; color: var(--muted); }
.role-dates { color: var(--muted); font-size: 9.5pt; white-space: nowrap; }
.skills-row { margin: 3px 0; }
.skills-row .cat {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
}
.education-row { display: flex; justify-content: space-between; gap: 12px; }
.education-row .degree { color: var(--muted); }

@media print {
  body { background: #fff; }
  /* Let @page own the margins so they repeat on every page; no padding here
     or it would double up on page 1 and leave page 2+ hugging the edge. */
  .page { margin: 0; box-shadow: none; max-width: none; padding: 0; }
  /* Keep a single role together, but DON'T avoid breaks inside whole sections
     (Experience is taller than a page — avoiding a break there strands it to
     the next page and leaves the first page half empty). */
  .role { break-inside: avoid; }
  .company-line { break-after: avoid; }   /* no company name orphaned at a page foot */
  h2.section-title { break-after: avoid; } /* keep a section header with its first content */
  a { color: inherit; }
}
@page { size: Letter; margin: 0.5in 0.6in; }
`;

// --- The résumé page's own chrome --------------------------------------------

// Nav and footer for /resume, in the résumé's variables so the document keeps
// one voice. The blog does not share these; it has the journal's below.
const RESUME_CHROME = `
a { color: var(--accent); }
a:focus-visible,
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.sitenav {
  max-width: var(--max);
  margin: 0.4in auto -0.25in;
  padding: 0 0.6in;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 10pt;
  display: flex;
  gap: 18px;
  align-items: baseline;
}
.sitenav a { color: var(--muted); text-decoration: none; }
.sitenav a:hover { color: var(--accent); text-decoration: underline; }
.sitenav a[aria-current="page"] { color: var(--ink); font-weight: 600; }

.sitefoot {
  max-width: var(--max);
  margin: 0 auto 0.5in;
  padding: 0 0.6in;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 9.5pt;
  color: var(--muted);
}
.sitefoot a { color: var(--muted); }

@media (max-width: 40em) {
  body { font-size: 12px; }
  .page { margin: 0; padding: 22px 18px; box-shadow: none; }
  .sitenav { margin: 0; padding: 14px 18px 0; }
  .sitefoot { margin: 0 0 24px; padding: 0 18px; }
  h1.name { font-size: 21pt; }
  .company-line, .role-line, .education-row { display: block; }
  .company-loc, .role-dates, .education-row .degree { display: block; }
  .summary { text-align: left; }
}

@media print {
  .sitenav, .sitefoot { display: none; }
}
`;

// --- The blog and the 404, in the field journal's palette --------------------

const SITE_CSS = `
:root {
  --paper: #f1ead9;
  --panel: #ede4cf;
  --ink: #2a241b;
  --body: #3a3226;
  --body-soft: #4a4133;
  --muted: #7b5f3f;
  --faded: #8a7a5f;
  --rule: #cfc3a8;
  --rule-light: #ddd2b6;
  --accent: #b03b1e;
  --serif: "EB Garamond", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--serif);
  font-size: 17px;
  line-height: 1.6;
}
a { color: var(--muted); }
a:hover { color: var(--accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.page { max-width: 760px; margin: 0 auto; padding: 8px 40px 72px; }

/* Set on <body> by layout({ wide: true }). The nav rule and the footer rule are
   separate elements with their own max-width, so all three have to grow
   together or the masthead stops being the same line as the content. */
.wide .page, .wide .sitenav, .wide .sitefoot { max-width: 1040px; }

/* The masthead rule, the same 2px-ink-over-hairline as the homepage sections. */
.sitenav {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 40px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: baseline;
  border-bottom: 2px solid var(--ink);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  text-transform: lowercase;
}
.sitenav a { color: var(--muted); text-decoration: none; }
.sitenav a:hover { color: var(--accent); }
.sitenav a[aria-current="page"] { color: var(--accent); }

.sitefoot {
  max-width: 760px;
  margin: 0 auto;
  padding: 14px 40px 56px;
  border-top: 2px solid var(--ink);
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.8;
  color: var(--faded);
}
.sitefoot p { margin: 0; }
.sitefoot a { color: var(--faded); }

/* Blog index */
.page-title {
  margin: 28px 0 4px;
  font-size: clamp(30px, 3.4vw, 40px);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.005em;
  text-wrap: pretty;
}
.page-lede { margin: 0 0 22px; font-size: 18px; color: var(--body-soft); text-wrap: pretty; }

.postlist { list-style: none; margin: 0; padding: 0; }
.postlist > li { margin: 0; padding: 20px 0 18px; border-bottom: 1px solid var(--rule-light); }
.postlist > li:first-child { border-top: 1px solid var(--rule); }
.post-title {
  margin: 0 0 2px;
  font-variant: small-caps;
  letter-spacing: .06em;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.25;
}
.post-title a { color: var(--ink); text-decoration: none; }
.post-title a:hover { color: var(--accent); }
.post-meta {
  margin: 4px 0 0;
  font-family: var(--mono);
  font-size: 10.5px;
  letter-spacing: .06em;
  color: var(--faded);
}
.post-meta > * + *::before { content: " · "; }
.post-summary { margin: 8px 0 0; font-size: 16px; line-height: 1.55; color: var(--body); text-wrap: pretty; }

.badge {
  font-family: var(--mono);
  font-size: 9px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 1px 5px;
}

.empty {
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 40px 0;
  color: var(--faded);
  text-align: center;
  font-style: italic;
}
.empty p { margin: 0; }
.empty p + p { margin-top: 6px; }

/* Blog post */
.post-header { margin-bottom: 22px; padding-bottom: 14px; border-bottom: 1px solid var(--rule); }
.post-header .page-title { margin-bottom: 8px; font-variant: normal; }
.post-deck { margin: 8px 0; font-size: 18px; font-style: italic; color: var(--body-soft); text-wrap: pretty; }
.living-note {
  margin: 10px 0 0;
  font-family: var(--mono);
  font-size: 10.5px;
  font-style: italic;
  color: var(--accent);
}

.prose { max-width: 34em; }
.prose h2, .prose h3, .prose h4 {
  font-variant: small-caps;
  letter-spacing: .08em;
  font-weight: 600;
  line-height: 1.25;
  margin: 28px 0 8px;
}
.prose h2 { font-size: 24px; }
.prose h3 { font-size: 20px; }
.prose h4 { font-size: 17px; color: var(--body-soft); }
.prose p { margin: 0 0 14px; color: var(--body); text-wrap: pretty; }
.prose ul, .prose ol { margin: 0 0 14px; padding-left: 22px; color: var(--body); }
.prose li { margin: 5px 0; }
.prose blockquote {
  margin: 0 0 14px;
  padding-left: 16px;
  border-left: 2px solid var(--rule);
  color: var(--body-soft);
  font-style: italic;
}
.prose hr { border: 0; border-top: 1px solid var(--rule); margin: 28px 0; }
.prose img { max-width: 100%; height: auto; }
.prose a { text-decoration-thickness: 1px; text-underline-offset: 2px; }
.prose code {
  font-family: var(--mono);
  font-size: .82em;
  background: var(--panel);
  border: 1px solid var(--rule-light);
  padding: .08em .3em;
}
.prose pre {
  background: var(--panel);
  border: 1px solid var(--ink);
  box-shadow: inset 0 0 0 3px var(--paper), inset 0 0 0 4px var(--ink);
  padding: 16px 18px;
  overflow-x: auto;
  margin: 0 0 14px;
}
.prose pre code { background: none; border: 0; padding: 0; font-size: .8em; }
.prose table { border-collapse: collapse; margin: 0 0 14px; font-size: 15px; }
.prose th, .prose td { border: 1px solid var(--rule); padding: 5px 10px; text-align: left; }
.prose th { font-variant: small-caps; letter-spacing: .06em; }

.revisions { margin-top: 36px; border-top: 2px solid var(--ink); padding-top: 12px; }
.revisions .section-title {
  margin: 0 0 8px;
  font-variant: small-caps;
  letter-spacing: .18em;
  font-size: 15px;
  font-weight: 600;
}
.revisions ol { list-style: none; margin: 0; padding: 0; }
.revisions li { margin: 0; padding: 10px 0; border-bottom: 1px solid var(--rule-light); font-size: 16px; color: var(--body); }
.revisions .when {
  display: block;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .06em;
  color: var(--faded);
}

.backlink { margin-top: 32px; font-family: var(--mono); font-size: 11px; letter-spacing: .14em; }

/*
 * The blog's own offer of itself, under the lede: the same shape as the
 * résumé's masthead actions — this page's business, and no other page's.
 */
.page-actions {
  margin: -8px 0 26px;
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: .14em;
  color: var(--faded);
}

@media (max-width: 720px) {
  .page { padding: 4px 20px 48px; }
  .sitenav { padding: 20px 20px 10px; }
  .sitefoot { padding: 14px 20px 40px; }
}
`;

/* --- /talks ------------------------------------------------------------------
 *
 * The index is a light table — .shelf — with every deck laid out flat as a
 * transparency, taped at the top, in the order the registry gives them. (The
 * journal's own sheet uses .sheet for its page frame; these never meet, but
 * the names should not read as if they might.)
 *
 * Section VI of the homepage shows three of these same transparencies in a
 * stack you shuffle. The ornament is deliberately identical — the same wash,
 * the same hairline, the same tape — but the geometry is not shared and should
 * not be: there the cards are absolutely positioned on top of one another and
 * their order is the point; here they sit in the flow and the whole shelf is
 * visible at once. Copying eight declarations is cheaper than an abstraction
 * that has to serve both.
 */
const TALKS_CSS = `
.shelf {
  list-style: none;
  margin: 26px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px 26px;
}
.shelf > li { margin: 0; }

.shelf-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 28px 30px 22px;
  text-decoration: none;
  color: inherit;
  background:
    linear-gradient(135deg, rgba(86, 112, 125, 0.15), rgba(86, 112, 125, 0.06) 55%, rgba(241, 234, 217, 0.25)),
    var(--paper);
  border: 1px solid rgba(42, 36, 27, 0.45);
  box-shadow: 2px 3px 0 rgba(42, 36, 27, 0.08), inset 0 0 0 1px rgba(241, 234, 217, 0.5);
  transition: transform .25s cubic-bezier(.22, 1, .36, 1), box-shadow .25s ease;
}
.shelf-card:hover, .shelf-card:focus-visible {
  transform: translate(-1px, -2px);
  box-shadow: 4px 6px 0 rgba(42, 36, 27, 0.1), inset 0 0 0 1px rgba(241, 234, 217, 0.6);
}
.shelf-card .tape {
  position: absolute;
  top: -8px; left: 50%;
  transform: translateX(-50%) rotate(-1.2deg);
  width: 104px; height: 17px;
  background: rgba(241, 234, 217, 0.85);
  border: 1px solid rgba(42, 36, 27, 0.18);
}
/* Every other card leans the other way, so the shelf does not read as a grid
   of identical stickers. */
.shelf > li:nth-child(even) .shelf-card .tape { transform: translateX(-50%) rotate(1.4deg); }

.shelf-meta {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .2em;
  color: #56707d;
}
.shelf-title {
  margin: 16px 0 0;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--ink);
  text-wrap: pretty;
}
.shelf-card:hover .shelf-title { color: var(--accent); }
.shelf-rule {
  display: block;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  height: 2px;
  width: 64px;
  margin: 14px 0 12px;
}
.shelf-venue { font-family: var(--mono); font-size: 11px; letter-spacing: .1em; color: var(--accent); }
.shelf-summary {
  margin: 10px 0 0;
  font-size: 15.5px;
  line-height: 1.5;
  color: var(--body-soft);
  text-wrap: pretty;
}
.shelf-foot {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 18px;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .1em;
  color: var(--muted);
}
.shelf-foot > span:last-child { white-space: nowrap; }
.shelf-card:hover .shelf-foot { color: var(--accent); }

/* --- /talks/<slug> -----------------------------------------------------------
 *
 * The frame around a deck, not the deck. A deck brings its own theme because it
 * is made for a projector; the page it is mounted on stays in the journal.
 */
.deck-intro { margin: 26px 0 30px; }
.deck-intro .page-title { margin-top: 10px; }
.deck-kicker {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--ink);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .18em;
  color: var(--faded);
}
.deck-kicker a { color: var(--muted); text-decoration: none; }
.deck-kicker a:hover { color: var(--accent); }
.deck-intro .rule-short {
  display: block;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  height: 2px;
  width: 64px;
  margin: 14px 0 12px;
}

@media (max-width: 720px) {
  .shelf { gap: 26px 0; margin-top: 22px; }
  .shelf-card { padding: 24px 22px 18px; }
  /* A long slug and "read the deck" do not fit on one line at this width, and
     a wrapped slug should not push the arrow onto a line of its own. */
  .shelf-foot { flex-direction: column; align-items: flex-start; gap: 4px; }
}
@media (prefers-reduced-motion: reduce) {
  .shelf-card { transition: none; }
}
`;

/** The blog and the 404. */
export const SITE_STYLESHEET = SITE_CSS;

/** /talks and /talks/<slug>: the site sheet plus the light table. */
export const TALKS_STYLESHEET = SITE_CSS + TALKS_CSS;

/* --- /work -------------------------------------------------------------------
 *
 * The case studies themselves come from case-css.js, the same rules section IV
 * of the homepage is built from. Only what is particular to standing alone on
 * a page of its own is here.
 */
const WORK_CSS = `
.cs-list > .cs:first-child { padding-top: 22px; border-top: 1px solid var(--rule); }
.cs-title { margin: 10px 0 0; }
h1.cs-title, h2.cs-title { font-size: 30px; }
/* The title is already the study's colour; hovering it underlines rather than
   recolouring, so the tint stays the tint. */
.cs-title-link { color: inherit; text-decoration: none; }
.cs-title-link:hover {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 5px;
}
/* One study on its own page: no rule above it, since the nav rule is already
   there, and none below it, since nothing follows. */
.cs-solo > .cs { border-bottom: 0; padding-bottom: 8px; }
.cs-solo > .cs:first-child { border-top: 0; padding-top: 4px; }

@media (max-width: 860px) {
  .cs-grid { grid-template-columns: 1fr; gap: 26px; }
}
`;

/** /work and /work/<slug>: the site sheet plus the case-study block. */
export const WORK_STYLESHEET = SITE_CSS + CASE_MARKS + CASE_STUDY_CSS + WORK_CSS;

// --- /resume on screen -------------------------------------------------------
//
// Screen gets the journal; paper does not. A résumé PDF goes to recruiters and
// ATS parsers, where parchment, small-caps and a coloured rule are all working
// against it — so every rule here is inside `@media screen` and the printed
// artefact stays byte-for-byte the document it has always been. `@page`, the
// break rules and the Letter geometry in RESUME_CSS are untouched.
const RESUME_SCREEN = `
@media screen {
  /* The nav and footer come from RESUME_CHROME in the résumé's own sans; on
     screen they belong to the site, so they match the blog's masthead rule. */
  .sitenav {
    max-width: 800px;
    margin: 0 auto;
    padding: 28px 40px 10px;
    border-bottom: 2px solid #2a241b;
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: .14em;
    text-transform: lowercase;
    gap: 18px;
  }
  .sitenav a { color: #7b5f3f; text-decoration: none; }
  .sitenav a:hover { color: #b03b1e; }
  .sitenav a[aria-current="page"] { color: #b03b1e; font-weight: 400; }

  .sitefoot {
    max-width: 800px;
    margin: 0 auto;
    padding: 14px 40px 56px;
    border-top: 2px solid #2a241b;
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 11px;
    line-height: 1.8;
    color: #8a7a5f;
  }
  .sitefoot a { color: #8a7a5f; }

  body {
    background: #f1ead9;
    color: #2a241b;
    font-family: "EB Garamond", Georgia, serif;
    font-size: 17px;
    line-height: 1.5;
  }
  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 8px 40px 72px;
    background: none;
    box-shadow: none;
  }

  header.masthead { text-align: left; margin-bottom: 20px; }
  h1.name { font-size: clamp(30px, 3.4vw, 42px); font-weight: 500; letter-spacing: .01em; }
  .headline { margin: 6px 0 8px; font-size: 18px; font-style: italic; color: #4a4133; }
  .contact {
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: .1em;
    color: #7b5f3f;
  }
  .contact a { color: #7b5f3f; }
  .summary { text-align: left; hyphens: none; font-size: 17px; color: #3a3226; text-wrap: pretty; }

  /* The section rule the rest of the site uses: 2px ink over a hairline. */
  h2.section-title {
    font-family: inherit;
    font-variant: small-caps;
    text-transform: none;
    letter-spacing: .18em;
    font-size: 15px;
    font-weight: 600;
    color: #2a241b;
    border-top: 2px solid #2a241b;
    border-bottom: 1px solid #cfc3a8;
    padding: 12px 0 8px;
    margin: 28px 0 10px;
  }
  section { margin-top: 0; }

  .company-line, .role-line { font-family: inherit; }
  .company-name { font-variant: small-caps; letter-spacing: .06em; font-size: 20px; font-weight: 600; }
  .role-title { font-weight: 600; font-size: 17px; }
  .role-note { color: #7b5f3f; }
  .company-loc, .role-dates {
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 10.5px;
    letter-spacing: .06em;
    color: #8a7a5f;
  }
  li { margin: 5px 0; color: #3a3226; }
  .skills-row .cat { font-family: inherit; font-variant: small-caps; letter-spacing: .06em; font-weight: 600; }
  .education-row .degree { color: #7b5f3f; }

  /* Print / save as PDF, and the way onward to the machine-readable copies. */
  /* The actions sit top-right, level with the name. They share a row with the
     name only: the headline and the contact line span the full measure, or the
     contact wraps mid-list to make room for a 150px column. */
  header.masthead {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 28px;
    align-items: start;
  }
  h1.name { grid-column: 1; grid-row: 1; }
  .headline, .contact { grid-column: 1 / -1; }
  .resume-actions {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 9px;
    margin: 0;
    padding-top: 10px;
    white-space: nowrap;
    font-family: "IBM Plex Mono", ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: .12em;
  }
  .resume-actions a, .resume-actions button {
    color: #7b5f3f;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .resume-actions a:hover, .resume-actions button:hover { color: #b03b1e; }

  @media (max-width: 720px) {
    header.masthead { display: block; }
    h1.name, .headline, .contact, .resume-actions { grid-column: auto; grid-row: auto; }
    .resume-actions {
      flex-direction: row;
      align-items: baseline;
      gap: 18px;
      margin-top: 18px;
      padding-top: 12px;
      border-top: 1px solid #cfc3a8;
    }
  }
}

@media print {
  .resume-actions { display: none; }
}
`;

/** /resume — the document, plus its nav, footer, and the screen-only brand. */
export const RESUME_STYLESHEET = RESUME_CSS + RESUME_CHROME + RESUME_SCREEN;
