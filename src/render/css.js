// The stylesheets for everything that is not the homepage.
//
// Two of them, because the two things want different paper:
//
//   RESUME_STYLESHEET — the canonical résumé stylesheet ported from
//     jrschumacher/resume (src/render/css.js), still unchanged in its résumé
//     rules, plus the nav and footer. It is a document meant to print on Letter,
//     and it stays one.
//   SITE_STYLESHEET — the blog and the 404, in the field-journal palette the
//     homepage introduced: parchment, EB Garamond, IBM Plex Mono for the marks
//     in the margin, a 2px ink rule over a hairline under every section head.
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
.role { margin-top: 9px; }
.role:first-child { margin-top: 4px; }
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

@media (max-width: 720px) {
  .page { padding: 4px 20px 48px; }
  .sitenav { padding: 20px 20px 10px; }
  .sitefoot { padding: 14px 20px 40px; }
}
`;

/** The blog and the 404. */
export const SITE_STYLESHEET = SITE_CSS;

/** /resume — the document, plus its nav and footer. */
export const RESUME_STYLESHEET = RESUME_CSS + RESUME_CHROME;
