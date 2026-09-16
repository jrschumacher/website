// The field-journal stylesheet.
//
// The design arrived as inline styles on a prototype; the values here are those
// values, moved into classes so the markup stays readable and the two figures
// can share one set of paper rules. Tokens first, then the page top to bottom.

export const JOURNAL_STYLESHEET = `
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
  --frame: inset 0 0 0 3px var(--paper), inset 0 0 0 4px var(--ink);
  --gutter: 40px;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body.journal {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--serif);
}
a { color: var(--muted); }
a:hover { color: var(--accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.mono, text.mono { font-family: var(--mono); }
.is-off { display: none; }
.sr-only {
  position: absolute; width: 1px; height: 1px;
  margin: -1px; padding: 0; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

/* Paper: the double-inset frame that every panel on this site is built from. */
.paper {
  background: var(--panel);
  border: 1px solid var(--ink);
  box-shadow: var(--frame);
}
.tape {
  position: absolute;
  top: -8px; left: 50%;
  transform: translateX(-50%) rotate(1.4deg);
  width: 74px; height: 16px;
  background: rgba(241, 234, 217, 0.82);
  border: 1px solid rgba(42, 36, 27, 0.18);
  z-index: 2;
}
.kicker {
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .18em;
  color: var(--faded);
}
.fact {
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
}
.rule-short {
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  height: 2px;
  width: 64px;
  margin: 12px 0;
}

/* --- page frame ---------------------------------------------------------- */

.sheet { max-width: 1680px; margin: 0 auto; padding: var(--gutter) var(--gutter) 72px; }
.masthead {
  border-bottom: 2px solid var(--ink);
  padding-bottom: 16px;
  display: flex; flex-wrap: wrap;
  justify-content: space-between; align-items: baseline;
  gap: 12px 32px;
}
.masthead h1 {
  margin: 0;
  font-size: clamp(34px, 3.6vw, 50px);
  font-weight: 500;
  letter-spacing: .01em;
  line-height: 1.1;
}
.masthead-sub { margin: 8px 0 0; font-size: 18px; font-style: italic; color: var(--body-soft); }
.masthead-slug { font-size: 11px; letter-spacing: .14em; color: var(--muted); text-align: right; }

.site-grid {
  display: grid;
  grid-template-columns: 176px minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  margin-top: 28px;
}
.site-main { min-width: 0; }

.site-index { position: sticky; top: 16px; }
.site-index nav {
  width: fit-content;
  background: var(--panel);
  border: 1px solid var(--ink);
  box-shadow: var(--frame);
  padding: 14px 4px 8px;
}
.idx-head {
  font-variant: small-caps;
  letter-spacing: .2em;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  padding: 0 14px 8px;
}
.site-index a {
  display: flex; gap: 10px; align-items: baseline;
  padding: 7px 14px;
  text-decoration: none;
  border-top: 1px solid var(--rule-light);
}
.idx-num { font-size: 10px; width: 16px; color: var(--faded); }
.idx-label {
  font-variant: small-caps;
  letter-spacing: .06em;
  font-size: 15px;
  white-space: nowrap;
  color: var(--ink);
}
.site-index a.is-active .idx-num,
.site-index a.is-active .idx-label,
.site-index a:hover .idx-label { color: var(--accent); }
.site-index.is-collapsed .idx-label { display: none; }

/* --- section chrome ------------------------------------------------------ */

.sec-head {
  padding: 12px 0 10px;
  border-top: 2px solid var(--ink);
  border-bottom: 1px solid var(--rule);
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 24px;
}
.sec-title {
  font-variant: small-caps;
  letter-spacing: .18em;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
}
.sec-slug { font-size: 11px; color: var(--faded); }

.sec-about { margin: 0 0 56px; }
.sec-growth { margin: 0 0 24px; }
.sec-figures { margin-top: 56px; }
.sec-work { margin-top: 64px; }
.sec-notes, .sec-talks, .sec-contact { margin-top: 64px; max-width: 880px; }

/* Figures break the gutter and run the full width of the sheet. */
.bleed { margin: 0 calc(-1 * var(--gutter)); }

/* --- I · the practitioner ------------------------------------------------ */

.about-body { display: flex; flex-wrap: wrap; gap: 36px; align-items: flex-start; margin-top: 26px; }
.portrait { margin: 0; flex: 0 0 auto; }
.portrait-frame {
  position: relative;
  background: var(--panel);
  border: 1px solid var(--ink);
  box-shadow: var(--frame);
  padding: 12px;
  transform: rotate(-0.6deg);
}
.portrait-slot, .portrait-img { width: 232px; height: 280px; display: block; }
.portrait-img { object-fit: cover; }
.portrait-slot {
  display: flex; align-items: center; justify-content: center;
  background: repeating-linear-gradient(-45deg, rgba(42,36,27,.03) 0 8px, transparent 8px 16px), var(--paper);
  border: 1px dashed var(--rule);
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .16em;
  color: var(--faded);
}
.portrait figcaption {
  margin-top: 10px;
  text-align: center;
  font-family: var(--mono);
  font-size: 10px;
  letter-spacing: .16em;
  color: var(--faded);
}
.about-prose { flex: 1 1 420px; min-width: 0; max-width: 760px; }
.about-prose h2 {
  margin: 0;
  font-size: clamp(26px, 2.6vw, 36px);
  font-weight: 500;
  line-height: 1.2;
  text-wrap: pretty;
}
.about-prose p { margin: 16px 0 0; font-size: 17.5px; line-height: 1.6; color: var(--body); text-wrap: pretty; }
.about-prose p + p { margin-top: 14px; }
.about-facts {
  margin-top: 20px;
  display: flex; flex-direction: column; gap: 6px;
  border-top: 1px solid var(--ink);
  padding-top: 12px;
}

/* --- plates (shared by both figures) ------------------------------------- */

.plate { margin: 0 auto; padding: 56px var(--gutter) 80px; }
.plate-growth { max-width: 1560px; }
.plate-range { max-width: 1720px; }
.plate-head { max-width: 880px; }
.plate-head .kicker { font-size: 11px; letter-spacing: .22em; color: var(--muted); }
.plate-head h2 {
  margin: 18px 0 0;
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: -0.005em;
  text-wrap: pretty;
}
.plate-head p { margin: 16px 0 0; font-size: 18px; line-height: 1.55; color: var(--body-soft); text-wrap: pretty; }
.plate-rule {
  margin-top: 44px;
  padding: 14px 0 12px;
  border-top: 2px solid var(--ink);
  border-bottom: 1px solid var(--rule);
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 24px;
}
.plate-fig { font-variant: small-caps; letter-spacing: .18em; font-size: 15px; font-weight: 600; }
.plate-scale { font-size: 11px; color: var(--faded); }
.plate-foot { margin-top: 36px; border-top: 1px solid var(--rule); padding-top: 14px; max-width: 880px; }
.plate-foot p { margin: 0; font-size: 11px; line-height: 1.7; color: var(--faded); }

/* Pigment: overlapping fills deepen instead of covering. */
.wash { mix-blend-mode: multiply; }
.pick { cursor: pointer; }

/* --- II · the growth ----------------------------------------------------- */

.grow-legend {
  display: flex; flex-wrap: wrap; gap: 22px; align-items: center;
  padding: 10px 0 0;
  font-size: 10.5px;
  color: var(--muted);
}
.grow-legend span { display: inline-flex; align-items: center; gap: 7px; }
.grow-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 40px;
  align-items: start;
  margin-top: 8px;
}
.grow-stick { position: sticky; top: 12px; height: 96vh; display: flex; align-items: center; }
.grow-stick > svg { width: 100%; max-height: 100%; display: block; }
.grow-fade { transition: opacity .6s ease; }
.grow-ev { cursor: pointer; }
.grow-ev:hover [data-grow-ev-dot] { stroke-width: 2.6; }
.grow-ink { animation: inkdraw .9s ease-out both; }

.grow-step {
  min-height: 82vh;
  display: flex; flex-direction: column; justify-content: center;
  transition: opacity .4s ease;
}
.grow-step.is-pinned { justify-content: flex-start; padding-top: 56px; }
.grow-step-title {
  margin-top: 10px;
  font-variant: small-caps;
  letter-spacing: .08em;
  font-size: 21px;
  font-weight: 600;
  line-height: 1.25;
}
.grow-step-story { margin: 0; font-size: 16px; line-height: 1.55; color: var(--body); text-wrap: pretty; }
.grow-step .card-facts { margin-top: 14px; gap: 6px; }
.grow-recline { margin-top: 14px; }
.grow-recline a { font-family: var(--mono); font-size: 10.5px; letter-spacing: .14em; }

.grow-evcard {
  position: fixed; bottom: 24px; right: 40px;
  width: 320px; z-index: 30;
  transform: rotate(0.5deg);
  padding: 20px 20px 18px;
  box-shadow: var(--frame), 2px 3px 0 rgba(42, 36, 27, 0.12);
  animation: paperlayR .5s cubic-bezier(.22, 1, .36, 1) both;
}
.grow-evcard .tape { transform: translateX(-50%) rotate(-1.2deg); }
.grow-evcard .card-title { font-size: 17px; margin-top: 8px; }
.grow-evcard .rule-short { width: 52px; margin: 10px 0; }
.grow-evcard .card-story { font-size: 14.5px; line-height: 1.5; }
.grow-evcard .card-facts { margin-top: 10px; gap: 4px; }
.grow-evcard .fact { font-size: 10.5px; }

.grow-reccard {
  position: absolute; top: 26px; left: 14px;
  width: 480px; z-index: 25;
  transform: rotate(-0.6deg);
  padding: 24px 26px 20px;
  box-shadow: var(--frame), 3px 4px 0 rgba(42, 36, 27, 0.12);
  animation: paperlayL .5s cubic-bezier(.22, 1, .36, 1) both;
}
.grow-reccard .card-title { font-size: 20px; }
.grow-reccard .rule-short { width: 52px; margin: 12px 0 14px; }
.rec-lines { display: flex; flex-direction: column; gap: 11px; }
.rec-line { display: flex; gap: 11px; font-size: 16px; line-height: 1.55; color: var(--body); }
.rec-line span:last-child { text-wrap: pretty; }
.rec-dash { flex: none; }
.rec-foot {
  margin-top: 12px;
  border-top: 1px dashed var(--rule);
  padding-top: 8px;
  font-size: 10px;
  color: var(--faded);
}
.rec-foot a { color: var(--faded); }

/* --- III · the range ----------------------------------------------------- */

.range-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
  align-items: start;
  margin-top: 8px;
}
/*
 * The plate scales to its column rather than scrolling. "min-width" is the
 * legibility floor — below it the rotated column labels stop being readable and
 * a sideways scroll is the better trade. Above it the SVG just resizes, so on
 * any desktop width there is no scrollbar at all.
 */
.range-plate { animation: rangeReveal 1.6s cubic-bezier(.25, .55, .25, 1) both; overflow-x: auto; }
.range-plate > svg { width: 100%; min-width: 900px; height: auto; display: block; }

/* And when it does scroll, it scrolls in the journal's own ink. */
.range-plate { scrollbar-width: thin; scrollbar-color: var(--rule) transparent; }
.range-plate::-webkit-scrollbar { height: 9px; }
.range-plate::-webkit-scrollbar-track {
  background: transparent;
  border-top: 1px solid var(--rule-light);
}
.range-plate::-webkit-scrollbar-thumb { background: var(--rule); border: 2px solid var(--paper); }
.range-plate::-webkit-scrollbar-thumb:hover { background: var(--muted); }
[data-range-ridge] { mix-blend-mode: multiply; cursor: pointer; transition: opacity .25s; }
.range-ev { cursor: pointer; }
.range-ev:hover { stroke-width: 2.6; }

.range-card { position: sticky; top: 24px; padding: 26px 24px 24px; }
.card-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.card-close { font-family: var(--mono); font-size: 10px; color: var(--faded); text-decoration: none; }
.card-title {
  margin-top: 10px;
  font-variant: small-caps;
  letter-spacing: .08em;
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;
}
.card-keytoggle { margin-top: 10px; }
.card-keytoggle a { font-family: var(--mono); font-size: 10.5px; letter-spacing: .14em; }
.card-rule { margin: 12px 0; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); height: 2px; }
.card-story { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--body); text-wrap: pretty; }
.card-facts { margin-top: 14px; display: flex; flex-direction: column; gap: 5px; }
.card-flag {
  margin-top: 12px;
  font-family: var(--mono);
  font-size: 10.5px;
  font-style: italic;
  color: var(--accent);
}
.card-key { margin-top: 16px; border-top: 1px solid var(--ink); padding-top: 12px; }
.famrows { margin-top: 6px; }
.famrow { border-bottom: 1px solid var(--rule-light); }
.famrow-head {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 10px; padding: 8px 0; text-decoration: none;
}
.famrow-name { font-variant: small-caps; letter-spacing: .08em; font-size: 15px; color: var(--ink); }
.famrow-count { font-size: 10px; color: var(--faded); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 0 12px; }
.chip {
  font-family: var(--mono);
  font-size: 10px;
  padding: 3px 8px;
  border: 1px solid var(--rule);
  color: #6a5c44;
  background: var(--paper);
  text-decoration: none;
}
.chip.is-lit { border-color: var(--accent); color: var(--accent); }

/* --- IV · case studies --------------------------------------------------- */

.cs-list { display: flex; flex-direction: column; }
.cs { padding: 34px 0 24px; border-bottom: 1px solid var(--rule-light); }
.cs-title {
  margin-top: 10px;
  font-variant: small-caps;
  letter-spacing: .08em;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
}
.cs .rule-short { margin: 14px 0 6px; }
.cs-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 1fr);
  gap: 40px;
  align-items: start;
  margin-top: 10px;
}
.cs-story { margin: 0; font-size: 17px; line-height: 1.6; color: var(--body); text-wrap: pretty; }
.cs-story + .cs-story { margin-top: 12px; }
.cs-stat {
  margin-top: 20px;
  display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--rule);
  padding: 12px 0;
}
.cs-stat-big { font-size: 42px; font-weight: 500; line-height: 1; }
.cs-stat-note { font-size: 10.5px; letter-spacing: .08em; color: var(--muted); }
.cs .card-facts { margin-top: 14px; gap: 6px; }
.cs-fig { margin: 0; }
.cs-fig-frame {
  background: var(--panel);
  border: 1px solid var(--ink);
  box-shadow: var(--frame);
  padding: 18px 14px 8px;
}
.cs-diagram { width: 100%; height: auto; display: block; }
.cs-fig figcaption {
  margin-top: 9px;
  font-variant: small-caps;
  letter-spacing: .1em;
  font-size: 13.5px;
  color: var(--body-soft);
}

/* --- V · field notes ----------------------------------------------------- */

.note-list { display: flex; flex-direction: column; }
.note { padding: 20px 0 18px; border-bottom: 1px solid var(--rule-light); }
.note-head { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
.note-date { font-size: 10.5px; color: var(--faded); }
.note-title { font-variant: small-caps; letter-spacing: .06em; font-size: 19px; font-weight: 600; }
.note-excerpt { margin: 8px 0 0; font-size: 16px; line-height: 1.55; color: var(--body); text-wrap: pretty; }

/* --- VI · talks ---------------------------------------------------------- */

.talks-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(240px, 1fr);
  gap: 44px;
  align-items: start;
  margin-top: 30px;
}
.talk-radio { position: absolute; width: 1px; height: 1px; opacity: 0; margin: 0; }
.talk-stack { position: relative; height: 440px; margin-top: 26px; }
.talk-card {
  position: absolute; inset: 0;
  transition: transform .45s cubic-bezier(.22, 1, .36, 1), opacity .45s ease;
}
.talk-link { position: absolute; inset: 0; display: block; text-decoration: none; }
.talk-face {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(86, 112, 125, 0.15), rgba(86, 112, 125, 0.06) 55%, rgba(241, 234, 217, 0.25)), var(--paper);
  border: 1px solid rgba(42, 36, 27, 0.45);
  box-shadow: 2px 3px 0 rgba(42, 36, 27, 0.08), inset 0 0 0 1px rgba(241, 234, 217, 0.5);
  padding: 30px 34px 24px;
  display: flex; flex-direction: column;
}
.talk-face .tape {
  top: -9px; width: 76px;
  transform: translateX(-50%) rotate(-1.2deg);
  background: rgba(241, 234, 217, 0.85);
}
.talk-meta { display: flex; justify-content: space-between; gap: 12px; font-size: 10px; letter-spacing: .2em; color: #56707d; }
.talk-body { margin: auto 0; padding: 18px 0; }
.talk-title { font-size: clamp(24px, 2.3vw, 34px); font-weight: 500; line-height: 1.2; color: var(--ink); text-wrap: pretty; }
.talk-body .rule-short { margin: 16px 0 12px; }
.talk-venue { font-size: 11px; letter-spacing: .1em; color: var(--accent); }
.talk-foot { display: flex; justify-content: space-between; gap: 12px; font-size: 10px; color: var(--muted); margin-top: auto; }
.talk-open, .talk-bring { display: none; }
.talk-grab { position: absolute; inset: 0; z-index: 2; cursor: pointer; }

.talk-stack-head {
  font-size: 10px; letter-spacing: .18em; color: var(--faded);
  padding-bottom: 8px; border-bottom: 1px solid var(--ink);
}
.talk-pos { display: none; }
.talk-nav-row {
  display: flex; gap: 12px; align-items: baseline;
  padding: 11px 2px;
  border-bottom: 1px solid var(--rule-light);
  cursor: pointer;
}
.talk-nav-year { font-size: 10px; color: var(--faded); }
.talk-nav-title { font-size: 16px; font-style: italic; line-height: 1.3; color: var(--ink); }
.talk-nav-row:hover .talk-nav-title { color: var(--accent); }
.talk-cycles { margin-top: 14px; }
.talk-cycle { display: none; gap: 18px; font-size: 10.5px; letter-spacing: .1em; }
.talk-cycle label { cursor: pointer; color: var(--muted); }
.talk-cycle label:hover { color: var(--accent); }

/* --- VII · contact, colophon --------------------------------------------- */

.contact-list { display: flex; flex-wrap: wrap; gap: 12px 40px; margin-top: 20px; }
.contact-row { display: flex; align-items: baseline; gap: 10px; text-decoration: none; }
.contact-label { font-size: 10px; letter-spacing: .16em; color: var(--faded); }
.contact-value { font-size: 17px; color: var(--ink); border-bottom: 1px dashed var(--muted); }
.contact-row:hover .contact-value { color: var(--accent); border-bottom-color: var(--accent); }

.colophon { margin-top: 72px; border-top: 2px solid var(--ink); padding-top: 14px; }
.colophon p { margin: 0; font-size: 11px; line-height: 1.8; color: var(--faded); }
.colophon p + p { margin-top: 6px; }
.colophon a { color: var(--faded); }

/* --- motion -------------------------------------------------------------- */

@keyframes rangeReveal { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
@keyframes inkdraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes paperlayL {
  from { opacity: 0; transform: rotate(-2.4deg) translateY(9px); }
  to { opacity: 1; transform: rotate(-0.6deg) translateY(0); }
}
@keyframes paperlayR {
  from { opacity: 0; transform: rotate(2.3deg) translateY(9px); }
  to { opacity: 1; transform: rotate(0.5deg) translateY(0); }
}
@keyframes paperoutL {
  from { opacity: 1; transform: rotate(-0.6deg) translateY(0); }
  to { opacity: 0; transform: rotate(-2.4deg) translateY(9px); }
}
@keyframes paperoutR {
  from { opacity: 1; transform: rotate(0.5deg) translateY(0); }
  to { opacity: 0; transform: rotate(2.3deg) translateY(9px); }
}
.grow-reccard.is-closing { animation: paperoutL .38s cubic-bezier(.4, 0, .7, .4) both; }
.grow-evcard.is-closing { animation: paperoutR .38s cubic-bezier(.4, 0, .7, .4) both; }

@media (prefers-reduced-motion: reduce) {
  .range-plate, .grow-evcard, .grow-reccard, .grow-ink { animation: none !important; }
  .grow-fade, .talk-card, .grow-step, [data-range-ridge] { transition: none !important; }
  html { scroll-behavior: auto !important; }
}

/* --- narrower ------------------------------------------------------------ */

@media (max-width: 1250px) {
  .cs-grid, .talks-grid { grid-template-columns: 1fr; }
}

/*
 * The range stacks earlier than anything else on the page, and the number is
 * derived rather than picked: the plate needs 900px to stay legible, and the
 * sheet spends 640px of viewport before the plate gets any — 80 sheet padding,
 * 176 index, 32 index gap, 80 plate padding less the 80 the figure bleeds back,
 * 320 card, 32 card gap. Below 1540 the card goes under the plate instead of
 * beside it, and the plate takes the full column.
 */
@media (max-width: 1540px) {
  .range-grid { grid-template-columns: 1fr; }
  .range-card { position: static; }
}
@media (max-width: 1100px) {
  .site-grid, .grow-grid { grid-template-columns: 1fr; }
  .site-index { position: static; }
  .site-index.is-collapsed .idx-label { display: inline; }
  .grow-stick { position: static; height: auto; }
  .grow-reccard {
    position: fixed; top: auto; left: 14px; bottom: 24px;
    max-width: calc(100vw - 28px);
  }
}

/*
 * Phones were not part of the handoff — the prototype stops at 1100px — so this
 * block only shrinks the gutter and lets the tall sticky figures stand down.
 * Nothing above it changes.
 */
@media (max-width: 720px) {
  :root { --gutter: 20px; }
  .plate { padding: 32px var(--gutter) 48px; }
  .sheet { padding: var(--gutter) var(--gutter) 48px; }
  .masthead-slug { text-align: left; }
  .about-body { gap: 24px; }
  .portrait-frame { transform: none; }
  .portrait-slot, .portrait-img { width: 100%; max-width: 232px; }
  .grow-step { min-height: 0; padding: 32px 0; }
  .grow-evcard { right: 14px; left: 14px; width: auto; }
  .grow-reccard { width: auto; }
  .talk-stack { height: 380px; }
  .talk-face { padding: 22px 20px 18px; }
  .cs-stat-big { font-size: 34px; }
}
`;

/**
 * Every arrangement of the talk stack, as CSS.
 *
 * With `n` transparencies there are `n` states and `n` cards, so `n²` rules —
 * nine, for three talks. In exchange the stack shuffles, the year list tracks
 * it and prev/next cycle with no script at all, and the radios make it
 * keyboard-operable for free.
 */
export function talkStackRules(n) {
  const offsets = [
    { tf: "rotate(-0.8deg)", o: 1, z: 30 },
    { tf: "translate(22px, -18px) rotate(1.8deg)", o: 0.7, z: 20 },
    { tf: "translate(-20px, -32px) rotate(-2.6deg)", o: 0.5, z: 10 },
    { tf: "translate(2px, -44px) rotate(3.2deg)", o: 0.38, z: 5 },
  ];
  const out = [];
  for (let t = 0; t < n; t++) {
    const on = `#talk-${t}:checked ~`;
    for (let i = 0; i < n; i++) {
      const pos = (i - t + n) % n;
      const o = offsets[Math.min(pos, offsets.length - 1)];
      out.push(`${on} .talk-stack .talk-card-${i} { transform: ${o.tf}; opacity: ${o.o}; z-index: ${o.z}; }`);
      // The front transparency is the link; the ones behind it are a target to
      // bring forward, so the grab layer only exists while a card is behind.
      out.push(pos === 0
        ? `${on} .talk-stack .talk-card-${i} .talk-grab { display: none; }
${on} .talk-stack .talk-card-${i} .talk-open { display: inline; }`
        : `${on} .talk-stack .talk-card-${i} .talk-bring { display: inline; }`);
    }
    out.push(`${on} .talk-side .talk-nav-${t} .talk-nav-year,
${on} .talk-side .talk-nav-${t} .talk-nav-title { color: var(--accent); }`);
    out.push(`${on} .talk-side .talk-pos-${t} { display: inline; }`);
    // The radios are the only focusable thing in the stack, so the row they
    // belong to has to show the focus ring on their behalf.
    out.push(`#talk-${t}:focus-visible ~ .talk-side .talk-nav-${t} { outline: 2px solid var(--accent); outline-offset: 2px; }`);
    out.push(`${on} .talk-side .talk-cycle-${t} { display: flex; }`);
  }
  return out.join("\n");
}
