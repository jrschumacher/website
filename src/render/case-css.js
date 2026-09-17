// The case-study block, in one place because two stylesheets need it.
//
// Section IV of the homepage and /work render the same <article class="cs">
// markup, and they have to look the same — a case study that changed shape
// depending on which page you found it on would be two designs, not one. The
// rules therefore live here and are interpolated into both sheets rather than
// written twice and drifting.
//
// CASE_STUDY_CSS is the block itself. CASE_MARKS is the handful of journal
// primitives it leans on — the mono class, the kicker, the fact line, the short
// rule, the double-inset frame variable. The journal's own stylesheet already
// defines all of them for its other sections and takes only CASE_STUDY_CSS;
// a sheet that is not the journal's needs both.

/** The journal marks a case study uses, for sheets that are not the journal's. */
export const CASE_MARKS = `
:root { --frame: inset 0 0 0 3px var(--paper), inset 0 0 0 4px var(--ink); }
.mono { font-family: var(--mono); }
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
.card-facts { margin-top: 14px; display: flex; flex-direction: column; gap: 5px; }
.rule-short {
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--ink);
  height: 2px;
  width: 64px;
  margin: 12px 0;
}
.sr-only {
  position: absolute; width: 1px; height: 1px;
  margin: -1px; padding: 0; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}
`;

/** Section IV of the homepage, and every case study on /work. */
export const CASE_STUDY_CSS = `
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
`;
