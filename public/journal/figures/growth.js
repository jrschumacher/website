// fig. 7 — the growth.
//
// Every skill owns a fixed compass bearing; radius is time, 2003 at the centre
// and today at the rim. A strand is one skill held for a stretch of years, laid
// along its bearing, thickness by depth of use. Scroll and the chapters arrive
// in order, the ink silhouette marking the furthest reach so far.
//
// Unlike The Range, nothing here moves: every chapter's band, silhouette, tip
// labels and event cards are drawn once, and scrolling only changes which ones
// are opaque. That keeps the two watercolour filters off the critical path — and
// it means the figure is complete, and readable, with no script running at all.

import { esc, fmt, yr } from "../esc.js";
import { fams, skills, ridges as allRidges, events } from "../data/range.js";

const CX = 360;
const CY = 366;
const CORE = 16;
const PER_YEAR = 13.2;
const RIM = 2026.65;

// Both figures sit on one page, so the filters carry their own prefix.
const F1 = "url(#gwc1)";
const F2 = "url(#gwc2)";

const N = skills.length;
const skillIdx = Object.fromEntries(skills.map((s, i) => [s.id, i]));
const skillName = Object.fromEntries(skills.map((s) => [s.id, s.name]));
const ridgeById = Object.fromEntries(allRidges.map((r) => [r.id, r]));

// The homelab is left out here: it is a background hum across the whole span,
// not a chapter, and drawn radially it would swamp every other strand.
// Roles come first as the career chain; side projects follow as context.
const chapters = allRidges
  .filter((r) => r.id !== "homelab")
  .sort((a, b) => (a.kind === "project") - (b.kind === "project") || a.start - b.start);
const roleChapters = chapters.filter((r) => r.kind === "role");
const projChapters = chapters.filter((r) => r.kind === "project");

const ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
const rr = (t) => CORE + (t - 2003) * PER_YEAR;
const px = (a, rad) => CX + Math.cos(a) * rad;
const py = (a, rad) => CY + Math.sin(a) * rad;

/** The year a role's touch on one skill ran out — start plus its fraction of the span. */
const reachYear = (r, sid) => (r.use[sid] ? r.start + r.use[sid][0] * (r.end - r.start) : null);

/**
 * The time cursor per step. Role chapters push it forward; a side project never
 * does, because it runs alongside the chapters rather than after them.
 */
const cursors = (() => {
  const out = [2003];
  let cur = 2003;
  for (const r of chapters) {
    if (r.kind === "role") cur = Math.max(cur, r.end);
    out.push(cur);
  }
  out.push(RIM);
  return out;
})();

export const GROWTH_STEPS = chapters.length + 2; // intro + a chapter each + today
export const GROWTH_LAST = GROWTH_STEPS - 1;

const chapterAt = (act) => (act >= 1 && act <= chapters.length ? chapters[act - 1] : null);
const cursorAt = (act) => cursors[Math.min(act, cursors.length - 1)];

// --- opacity rules, shared by the renderer and the scroll handler ------------

export function roleOpacity(r, act, sel) {
  if (sel) return r.id === sel.ridge ? 1 : 0.15;
  const i = chapters.indexOf(r) + 1;
  if (i > act) return 0.04;
  return i === act ? 1 : 0.38;
}

export function projStrandOpacity(r, t0, act, sel) {
  if (sel) return sel.ridge === r.id ? 1 : 0.1;
  const actRidge = chapterAt(act);
  const reached = t0 <= cursorAt(act) + 0.01;
  if (actRidge && actRidge.id === r.id) return reached || act > chapters.length ? 1 : 0.55;
  return reached ? 0.55 : 0.04;
}

export function eventVisual(ev, k, act, sel) {
  const actRidge = chapterAt(act);
  const on = sel ? true : ev.year <= cursorAt(act) + 0.01;
  const hot = sel ? sel.k === k : !!(actRidge && ev.ridge === actRidge.id);
  return {
    op: on ? (sel && sel.k !== k && ev.ridge !== sel.ridge ? 0.3 : 1) : 0,
    ring: ev.impact >= 2 ? (hot ? 0.7 : 0.4) : 0,
    glow: hot ? 0.16 : 0,
    r: sel && sel.k === k ? 4.2 : 3,
  };
}

// --- path helpers ------------------------------------------------------------

const circle = (rad) =>
  `M ${fmt(CX + rad)} ${CY} A ${fmt(rad)} ${fmt(rad)} 0 1 0 ${fmt(CX - rad)} ${CY} A ${fmt(rad)} ${fmt(rad)} 0 1 0 ${fmt(CX + rad)} ${CY}`;

/** Closed Catmull-Rom through the bearing points — the silhouette outline. */
function closedPath(pts) {
  const m = pts.length;
  let d = `M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  for (let i = 0; i < m; i++) {
    const p0 = pts[(i - 1 + m) % m];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % m];
    const p3 = pts[(i + 2) % m];
    d += ` C ${fmt(p1.x + (p2.x - p0.x) / 6)} ${fmt(p1.y + (p2.y - p0.y) / 6)} ${fmt(p2.x - (p3.x - p1.x) / 6)} ${fmt(p2.y - (p3.y - p1.y) / 6)} ${fmt(p2.x)} ${fmt(p2.y)}`;
  }
  return `${d} Z`;
}

/** Neighbour-average the radii so the outline reads as one coastline, not 46 spikes. */
function smoothRadii(radii, passes) {
  let r = radii;
  for (let p = 0; p < passes; p++) {
    r = r.map((v, i) => (r[(i - 1 + N) % N] + 2 * v + r[(i + 1) % N]) / 4);
  }
  return r;
}

function ray(a, t0, t1) {
  return `M ${fmt(px(a, rr(t0)))} ${fmt(py(a, rr(t0)))} L ${fmt(px(a, rr(t1)))} ${fmt(py(a, rr(t1)))}`;
}

function label(x, y, body, opts = {}) {
  return `<text class="mono" x="${fmt(x)}" y="${fmt(y)}" font-size="${opts.size ?? 9}"${opts.anchor ? ` text-anchor="${opts.anchor}"` : ""}${opts.spacing ? ` letter-spacing="${opts.spacing}"` : ""}${opts.style ? ` font-style="${opts.style}"` : ""} fill="${esc(opts.fill ?? "#8a7a5f")}">${esc(body)}</text>`;
}

// --- tip labels --------------------------------------------------------------

/** The active chapter's five widest strands, named at their tips. */
function tipLabels(r) {
  const tips = r.kind === "project" && r.plateaus
    ? [...r.plateaus].sort((a, b) => b.w - a.w).slice(0, 5).map((p) => {
        const a = ang(skillIdx[p.skill]);
        const q = rr(Math.min(p.year + p.w, RIM)) + 9;
        return { x: px(a, q), y: py(a, q) + 3, name: skillName[p.skill], a };
      })
    : Object.entries(r.use)
        .map(([sid, [frac]]) => ({ sid, frac }))
        .sort((a, b) => b.frac - a.frac)
        .slice(0, 5)
        .map((t) => {
          const a = ang(skillIdx[t.sid]);
          const q = rr(reachYear(r, t.sid)) + 9;
          return { x: px(a, q), y: py(a, q) + 3, name: skillName[t.sid], a };
        });

  const placed = [];
  return [...tips]
    .sort((a, b) => a.y - b.y)
    .map((t) => {
      const anchor = Math.abs(Math.cos(t.a)) < 0.3 ? "middle" : (Math.cos(t.a) > 0 ? "start" : "end");
      const w = t.name.length * 5.8;
      const x0 = anchor === "end" ? t.x - w : (anchor === "middle" ? t.x - w / 2 : t.x);
      let y = t.y;
      while (placed.some((p) => Math.abs(p.y - y) < 12 && x0 < p.x1 + 6 && x0 + w > p.x0 - 6)) y += 12;
      placed.push({ y, x0, x1: x0 + w });
      return label(t.x, y, t.name, { size: 9.5, anchor, style: "italic", fill: "#2a241b" });
    })
    .join("");
}

// --- the figure --------------------------------------------------------------

export function growthFigure(state) {
  const { act, sel } = state;

  const grid = [2005, 2010, 2015, 2020, 2025]
    .map((y) => `<path d="${circle(rr(y))}" fill="none" stroke="#2a241b" stroke-opacity="0.09" stroke-width="0.7"/>`)
    .join("");

  // One band per chapter — the ring of years that chapter occupies.
  const bands = chapters
    .map((r) => `<path data-grow-band="${esc(r.id)}" d="${circle(rr(r.end))} ${circle(rr(r.start))}" fill="${esc(r.color)}" fill-opacity="${chapterAt(act) === r ? 0.07 : 0}" fill-rule="evenodd" pointer-events="none"/>`)
    .join("");

  const roleGroups = roleChapters
    .map((r) => {
      const strands = skills
        .map((s, i) => {
          if (!r.use[s.id]) return "";
          const d = ray(ang(i), r.start, reachYear(r, s.id));
          const w = 1.6 + r.use[s.id][1] * 1.5;
          return `<path d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.42" stroke-width="${fmt(w)}" filter="${F2}"/>`
            + `<path d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.5" stroke-width="0.8" filter="${F1}"/>`;
        })
        .join("");
      return `<g class="wash grow-fade" data-grow-role="${esc(r.id)}" opacity="${roleOpacity(r, act, sel)}">${strands}</g>`;
    })
    .join("");

  // Side-project strands come from dated plateaus: dotted, and only once the
  // time cursor has reached them.
  const projStrands = projChapters
    .flatMap((r) => (r.plateaus || []).map((p) => {
      const i = skillIdx[p.skill];
      if (i == null) return "";
      const t1 = Math.min(p.year + p.w, RIM);
      const d = ray(ang(i), p.year, t1);
      return `<g class="wash grow-fade" data-grow-proj="${esc(r.id)}" data-grow-t0="${p.year}" opacity="${projStrandOpacity(r, p.year, act, sel)}">
<path d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.45" stroke-width="2.4" stroke-dasharray="5 3" filter="${F2}"/>
<path d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.55" stroke-width="0.9" stroke-dasharray="5 3" filter="${F1}"/>
</g>`;
    }))
    .join("");

  // A silhouette per step: everything reached by that step's cursor.
  const silhouettes = cursors
    .map((c, k) => {
      const cum = new Array(N).fill(CORE);
      for (const r of chapters) {
        if (r.kind === "role") {
          if (r.start > c) continue;
          skills.forEach((s, i) => {
            const t = reachYear(r, s.id);
            if (t) cum[i] = Math.max(cum[i], rr(Math.min(t, c)));
          });
        } else {
          for (const p of r.plateaus || []) {
            if (p.year <= c) cum[skillIdx[p.skill]] = Math.max(cum[skillIdx[p.skill]], rr(Math.min(p.year + p.w, c, RIM)));
          }
        }
      }
      const radii = smoothRadii([...cum], 2).map((v, i) => Math.max(v, cum[i]));
      const d = closedPath(radii.map((q, i) => ({ x: px(ang(i), q), y: py(ang(i), q) })));
      const on = k === Math.min(act, cursors.length - 1);
      return `<path class="grow-fade" data-grow-sil="${k}" d="${d}" fill="none" stroke="#2a241b" stroke-opacity="${on ? 0.6 : 0}" stroke-width="1.3" filter="${F1}"/>`;
    })
    .join("");

  const eventDots = events
    .map((ev, k) => {
      const a = ang(skillIdx[ev.skill]);
      const x = px(a, rr(ev.year));
      const y = py(a, rr(ev.year));
      const tint = ridgeById[ev.ridge].color;
      const v = eventVisual(ev, k, act, sel);
      return `<g class="grow-fade grow-ev" data-grow-ev="${k}" opacity="${v.op}">
<circle data-grow-ev-glow cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(6 + ev.impact * 5)}" fill="${esc(tint)}" fill-opacity="${v.glow}" filter="${F2}"/>
<circle data-grow-ev-ring cx="${fmt(x)}" cy="${fmt(y)}" r="6" fill="none" stroke="${esc(tint)}" stroke-opacity="${v.ring}" stroke-width="0.9"/>
<circle data-grow-ev-dot cx="${fmt(x)}" cy="${fmt(y)}" r="${v.r}" fill="#f1ead9" stroke="${esc(tint)}" stroke-width="1.3"/>
<circle cx="${fmt(x)}" cy="${fmt(y)}" r="11" fill="transparent"/>
</g>`;
    })
    .join("");

  // The drawn-in strand behind a selected event, plus its bearing guide.
  const selStrands = events
    .map((ev, k) => {
      const r = ridgeById[ev.ridge];
      const a = ang(skillIdx[ev.skill]);
      const { t0, t1 } = strandSpan(ev);
      const w = 2.6 + (r.use[ev.skill] ? r.use[ev.skill][1] : 1) * 1.5;
      const on = sel && sel.k === k;
      return `<g data-grow-selstrand="${k}" class="${on ? "" : "is-off"}">
<path d="M ${fmt(CX)} ${fmt(CY)} L ${fmt(px(a, rr(t0)))} ${fmt(py(a, rr(t0)))}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.35" stroke-width="0.9" stroke-dasharray="1 4"/>
<path class="grow-ink" d="${ray(a, t0, t1)}" pathLength="1" stroke-dasharray="1" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.85" stroke-width="${fmt(w)}" filter="${F1}"/>
</g>`;
    })
    .join("");

  const famName = { sys: "systems", lang: "languages", web: "web", plat: "platform", sec: "security", lead: "leadership" };
  const famLabels = fams
    .map((f) => {
      const is = skills.map((s, i) => (s.fam === f.id ? i : -1)).filter((v) => v >= 0);
      const mid = (ang(is[0]) + ang(is[is.length - 1])) / 2;
      const rad = rr(RIM) + 24;
      let x = px(mid, rad);
      let anchor = Math.abs(Math.cos(mid)) < 0.35 ? "middle" : (Math.cos(mid) > 0 ? "start" : "end");
      if (anchor === "end" && x < 74) { anchor = "start"; x = Math.max(4, x); }
      if (anchor === "start" && x > 646) { anchor = "end"; x = Math.min(716, x); }
      return label(x, py(mid, rad) + 3, famName[f.id], { anchor, spacing: 1.5, fill: "#7b5f3f" });
    })
    .join("");

  const tips = chapters
    .map((r) => `<g data-grow-tips="${esc(r.id)}" class="${chapterAt(act) === r ? "" : "is-off"}">${tipLabels(r)}</g>`)
    .join("");

  const rings = [2010, 2015, 2020, 2025].map((y) => label(CX + 4, CY - rr(y) - 3, String(y))).join("")
    + label(CX, CY + 3, "2003", { anchor: "middle" });

  return `<svg viewBox="0 0 720 720" role="img" aria-label="Radial growth figure: skill strands laid along fixed bearings, radius is time from 2003 at the centre outward to today">
<defs>
<filter id="gwc1" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>
<filter id="gwc2" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="23" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="13"/></filter>
</defs>
${grid}
${bands}
${roleGroups}
${silhouettes}
${projStrands}
${selStrands}
${eventDots}
${rings}
${famLabels}
${tips}
</svg>`;
}

/** Where a selected event's strand runs — a plateau's span for a project, else the role's touch. */
function strandSpan(ev) {
  const r = ridgeById[ev.ridge];
  let t0 = r.start;
  let t1 = reachYear(r, ev.skill);
  if (r.kind === "project" && r.plateaus) {
    const pl = r.plateaus
      .filter((p) => p.skill === ev.skill)
      .sort((x, y) => Math.abs(x.year - ev.year) - Math.abs(y.year - ev.year))[0];
    if (pl) {
      t0 = pl.year;
      t1 = Math.min(pl.year + pl.w, RIM);
    }
  }
  return { t0, t1 };
}

// --- the chapters ------------------------------------------------------------

/** The scroll column: one section per chapter, plus the blank page and today. */
export function growthSteps(state) {
  const { act } = state;
  const out = [];

  out.push(step(0, {
    kicker: "FIG. 7 · HOW TO READ IT",
    title: "The blank page, 2003",
    tint: "#2a241b",
    story:
      "Every skill owns a fixed bearing on the compass — systems to the north, leadership sweeping in from the west. Radius is time: the center is 2003, the rim is today. A strand is one skill held for a stretch of years; its thickness is how deeply it was worked. Scroll and watch the sediment settle.",
    facts: [
      `${N} bearings · ${chapters.length} chapters · ${events.length} events`,
      "strand length = years of touch",
      "ink silhouette = furthest reach so far",
    ],
  }, act));

  chapters.forEach((r, k) => {
    const span = r.end - r.start;
    const tops = r.kind === "project" && r.plateaus
      ? [...r.plateaus].sort((a, b) => b.w - a.w).slice(0, 4)
          .map((p) => `${yr(p.year)}–${yr(Math.min(p.year + p.w, RIM))} · ${skillName[p.skill]}${p.label ? ` — ${p.label}` : ""}`)
      : Object.entries(r.use)
          .map(([sid, [frac, it]]) => ({ sid, dur: frac * span, it }))
          .sort((a, b) => b.dur - a.dur)
          .slice(0, 4)
          .map((t) => `${skillName[t.sid]} · ${t.dur.toFixed(1)}y${t.it > 2 ? " · deep" : ""}`);
    const marks = events.filter((e) => e.ridge === r.id).map((e) => `◉ ${yr(e.year)} — ${e.label}`);

    out.push(step(k + 1, {
      kicker: `${r.kind === "project" ? "THE UNBIDDEN · SIDE PROJECT · " : `CHAPTER ${k + 1} · `}${yr(r.start)}–${yr(r.end)}`,
      title: r.kind === "project" ? r.title : `${r.company} — ${r.title}`,
      tint: r.color,
      story: r.story + (r.kind === "project"
        ? " Its dotted strands have been surfacing alongside the chapters all along — here is the whole thread at once."
        : ""),
      facts: [...tops, ...marks],
      flag: r.kind === "project" ? "begun with nobody asking" : false,
      ridge: r,
      hasRecord: !!r.record,
    }, act));
  });

  out.push(step(GROWTH_LAST, {
    kicker: "TODAY · 2026",
    title: "The whole silhouette",
    tint: "#2a241b",
    story:
      "Twenty-three years of sediment. The reach is widest along security, platform and leadership — but the early bearings never disappear: perl still holds its line from 2009, on-prem from 2014. Nothing is erased; it just stops growing. That is the honest shape of the work.",
    facts: [
      "widest reach: security · platform · leadership",
      "oldest still-growing strand: linux, 2003 →",
      "dormant but on the map: perl, on-prem",
    ],
  }, act));

  return out.join("");
}

function step(k, s, act) {
  const facts = s.facts.map((f) => `<div class="fact">${esc(f)}</div>`).join("");
  const record = s.hasRecord
    ? `<div class="grow-recline"><a href="#growth" class="mono" data-grow-act="rec:${esc(s.ridge.id)}">+ read the full entry</a></div>`
    : "";
  return `<section data-growth-step data-grow-step="${k}"${s.ridge ? ` data-grow-chapter="${esc(s.ridge.id)}"` : ""} class="grow-step" style="opacity: ${act === k ? 1 : 0.35}">
<div class="kicker">${esc(s.kicker)}</div>
<div class="grow-step-title" style="color: ${esc(s.tint)}">${esc(s.title)}</div>
<div class="rule-short"></div>
<p class="grow-step-story">${esc(s.story)}</p>
<div class="card-facts">${facts}</div>
${s.flag ? `<div class="card-flag">${esc(s.flag)}</div>` : ""}
${record}
</section>`;
}

/** Event cards, one per dot, all drawn and all hidden but the selected one. */
export function growthEventCards(state) {
  return events
    .map((ev, k) => {
      const r = ridgeById[ev.ridge];
      const { t0, t1 } = strandSpan(ev);
      const before = ev.year - t0;
      const after = t1 - ev.year;
      const reading = before < 0.4
        ? "This event opens the strand — the touch begins here and grows outward from it."
        : after < 0.4
          ? "This event caps the strand — the last touch before the line went quiet."
          : `The strand was already ${before.toFixed(1)} years old when this landed, and it kept growing ${after.toFixed(1)} more after. Events are moments on the line; the line itself is the growth.`;
      const facts = [
        `strand: ${skillName[ev.skill]} · runs ${yr(t0)}–${yr(t1)}`,
        `chapter: ${r.kind === "project" ? r.title.toLowerCase() : `${r.company} · ${r.title}`.toLowerCase()}`,
        "reading: center → outward = past → present",
      ];
      const on = state.sel && state.sel.k === k;
      return `<aside class="paper grow-evcard" data-grow-evcard="${k}"${on ? "" : ' hidden=""'}>
<div class="tape"></div>
<div class="card-head">
<div class="kicker">EVENT · ${yr(ev.year)} · IMPACT ${"●".repeat(ev.impact)}</div>
<a href="#growth" class="card-close" data-grow-act="clear">× close</a>
</div>
<div class="card-title" style="color: ${esc(r.color)}">${esc(ev.label)}</div>
<div class="rule-short"></div>
<p class="card-story">${esc(ev.note ? `${ev.note} ${reading}` : reading)}</p>
<div class="card-facts">${facts.map((f) => `<div class="fact">${esc(f)}</div>`).join("")}</div>
</aside>`;
    })
    .join("");
}

/** The field-note cards behind "read the full entry", transcribed from the record. */
export function growthRecordCards(state) {
  return chapters
    .filter((r) => r.record)
    .map((r) => {
      const lines = r.record
        .map((line) => `<div class="rec-line"><span class="rec-dash" style="color: ${esc(r.color)}">—</span><span>${esc(line)}</span></div>`)
        .join("");
      const on = state.openRec === r.id;
      return `<aside class="paper grow-reccard" data-grow-reccard="${esc(r.id)}"${on ? "" : ' hidden=""'}>
<div class="tape"></div>
<div class="card-head">
<div class="kicker">FIELD NOTE · FROM THE RECORD</div>
<a href="#growth" class="card-close" data-grow-act="clear-rec">× close</a>
</div>
<div class="card-title" style="color: ${esc(r.color)}">${esc(r.kind === "project" ? r.title : `${r.company} · ${r.title}`)}</div>
<div class="rule-short"></div>
<div class="rec-lines">${lines}</div>
<div class="rec-foot mono">transcribed · <a href="/resume.txt">/resume.txt</a></div>
</aside>`;
    })
    .join("");
}

export function growthScaleNote() {
  return `${N} bearings · ${chapters.length} chapters · scroll to grow · 1 year = 13px of radius`;
}

// --- state, applied in place -------------------------------------------------

/** Scrolling changes ~200 attributes; it never rebuilds a node. */
export function applyGrowth(root, state) {
  const { act, sel, openRec } = state;
  const actRidge = chapterAt(act);

  for (const el of root.querySelectorAll("[data-grow-band]")) {
    el.setAttribute("fill-opacity", actRidge && actRidge.id === el.dataset.growBand ? 0.07 : 0);
  }
  for (const el of root.querySelectorAll("[data-grow-role]")) {
    el.setAttribute("opacity", roleOpacity(ridgeById[el.dataset.growRole], act, sel));
  }
  for (const el of root.querySelectorAll("[data-grow-proj]")) {
    el.setAttribute("opacity", projStrandOpacity(ridgeById[el.dataset.growProj], Number(el.dataset.growT0), act, sel));
  }
  const live = Math.min(act, cursors.length - 1);
  for (const el of root.querySelectorAll("[data-grow-sil]")) {
    el.setAttribute("stroke-opacity", Number(el.dataset.growSil) === live ? 0.6 : 0);
  }
  for (const el of root.querySelectorAll("[data-grow-ev]")) {
    const k = Number(el.dataset.growEv);
    const v = eventVisual(events[k], k, act, sel);
    el.setAttribute("opacity", v.op);
    el.querySelector("[data-grow-ev-glow]").setAttribute("fill-opacity", v.glow);
    el.querySelector("[data-grow-ev-ring]").setAttribute("stroke-opacity", v.ring);
    el.querySelector("[data-grow-ev-dot]").setAttribute("r", v.r);
  }
  for (const el of root.querySelectorAll("[data-grow-selstrand]")) {
    const on = !!sel && sel.k === Number(el.dataset.growSelstrand);
    el.classList.toggle("is-off", !on);
    // Restart the ink-draw animation each time the strand is shown.
    if (on) { const p = el.querySelector(".grow-ink"); p.classList.remove("grow-ink"); void p.getBoundingClientRect(); p.classList.add("grow-ink"); }
  }
  for (const el of root.querySelectorAll("[data-grow-tips]")) {
    el.classList.toggle("is-off", !(actRidge && actRidge.id === el.dataset.growTips));
  }
  for (const el of root.querySelectorAll("[data-grow-evcard]")) {
    el.hidden = !(sel && sel.k === Number(el.dataset.growEvcard));
  }
  for (const el of root.querySelectorAll("[data-grow-reccard]")) {
    el.hidden = openRec !== el.dataset.growReccard;
  }
  for (const el of root.querySelectorAll("[data-growth-step]")) {
    const k = Number(el.dataset.growStep);
    el.style.opacity = act === k ? 1 : 0.35;
    // With a card open, pin the live chapter to the top so the card can't cover it.
    el.classList.toggle("is-pinned", !!sel && k === act);
  }
  for (const el of root.querySelectorAll("[data-grow-act^='rec:']")) {
    el.textContent = openRec === el.dataset.growAct.slice(4) ? "− close the entry" : "+ read the full entry";
  }
}

/** Which chapter a given event belongs to — the scroll target when its dot is tapped. */
export function chapterStepOf(eventIndex) {
  return chapters.findIndex((r) => r.id === events[eventIndex].ridge) + 1;
}

/** The chapter id an event sits in; the dimming rules key off it. */
export function eventRidgeId(eventIndex) {
  return events[eventIndex].ridge;
}
