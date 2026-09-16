// fig. 3 — the range.
//
// Skills hold fixed columns across the page; time climbs upward. Each role is
// founded at the year it began, and its ridge peaks show how long each skill
// stayed a touch point — in real years, on the same vertical scale as every
// other ridge. Personal projects settle to the right as plateaus, each keyed
// back to its column by a dotted thread.
//
// The geometry is ported from the design prototype unchanged; only the output
// changed, from React elements to markup strings, so the Worker can render it
// and the browser can re-render it after an accordion click.

import { esc, fmt, yr } from "../esc.js";
import { fams, skills, ridges as allRidges, events } from "../data/range.js";

const PPY = 46; // px per peak-year
const COL_W = 26; // px per skill column
const TOP = 2027.0;
const BOT = 2002.9;
const PAD_T = 150;
const PAD_L = 238;
const PAD_R = 44;
const LANE_W = 176;

const F1 = "url(#wc1)";
const F2 = "url(#wc2)";

const skillById = Object.fromEntries(skills.map((s) => [s.id, s]));
const ridgeById = Object.fromEntries(allRidges.map((r) => [r.id, r]));
const byStart = [...allRidges].sort((a, b) => a.start - b.start);
const roleRidges = byStart.filter((r) => r.kind === "role");
const projRidges = byStart.filter((r) => r.kind === "project");

const Y = (t) => PAD_T + (TOP - t) * PPY;

/**
 * Column layout for a given accordion state.
 *
 * A folded family is one wide column standing in for all its skills; an
 * expanded one spreads into a column per skill. Everything downstream — ridge
 * paths, plateaus, threads — reads positions from here, so the whole figure
 * follows from this one function.
 *
 * @param {string|null} openFam  id of the expanded family, or null for all folded
 */
export function rangeGeometry(openFam) {
  const cols = [];
  for (const fam of fams) {
    const ss = skills.filter((s) => s.fam === fam.id);
    if (openFam === fam.id) {
      for (const s of ss) {
        cols.push({ type: "skill", sid: s.id, name: s.name, fam: fam.id, skillIds: [s.id], w: COL_W });
      }
    } else {
      cols.push({
        type: "fam",
        sid: null,
        name: `${fam.name} · ${ss.length}`,
        fam: fam.id,
        skillIds: ss.map((s) => s.id),
        w: COL_W * 3,
      });
    }
  }

  let accX = PAD_L;
  for (const c of cols) {
    c.x = accX + c.w / 2;
    accX += c.w;
  }

  const colOf = {};
  cols.forEach((c, i) => c.skillIds.forEach((sid) => { colOf[sid] = i; }));

  const mainRight = accX;
  const zx0 = mainRight + 60;
  const width = zx0 + projRidges.length * LANE_W + PAD_R + 76;
  const height = Math.round(Y(BOT)) + 46;

  return { cols, colOf, mainRight, zx0, width, height };
}

/** Which columns a ridge touches — the unit of "is this ridge in focus?". */
function ridgeColumns(ridge, colOf) {
  const set = new Set();
  for (const sid of Object.keys(ridge.use)) {
    const i = colOf[sid];
    if (i != null) set.add(i);
  }
  return [...set];
}

/**
 * Ridge opacity. Focus (a hovered or selected column) wins over selection,
 * because focus is the transient gesture and should read instantly.
 */
export function ridgeOpacity(ridge, cols, sel, focusCol) {
  if (focusCol != null && cols[focusCol]) {
    return cols[focusCol].skillIds.some((sid) => ridge.use[sid]) ? 0.98 : (ridge.kind === "project" ? 0.15 : 0.12);
  }
  if (sel && sel.type === "role") return sel.id === ridge.id ? 1 : (ridge.kind === "project" ? 0.3 : 0.22);
  if (sel && sel.type === "plateau" && ridge.kind === "project") return sel.rid === ridge.id ? 1 : 0.3;
  if (sel && sel.type === "event" && ridge.kind === "role") return sel.ridge === ridge.id ? 1 : 0.3;
  return ridge.kind === "project" ? 0.9 : 0.92;
}

/** The focused column: a hover if there is one, else the selected skill's column. */
export function focusColumn(state, geom) {
  if (state.hov != null) return state.hov;
  if (state.sel && state.sel.type === "skill") {
    const i = geom.colOf[state.sel.id];
    return i == null ? null : i;
  }
  return null;
}

// --- path helpers ------------------------------------------------------------

/** Ridge outline: quadratic curves through the midpoints between peaks. */
function ridgePath(pts) {
  let d = `M ${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  for (let k = 1; k < pts.length - 1; k++) {
    const mx = (pts[k].x + pts[k + 1].x) / 2;
    const my = (pts[k].y + pts[k + 1].y) / 2;
    d += ` Q ${fmt(pts[k].x)} ${fmt(pts[k].y)} ${fmt(mx)} ${fmt(my)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${fmt(last.x)} ${fmt(last.y)} Z`;
}

function text(x, y, body, opts = {}) {
  const attrs = [
    `x="${fmt(x)}"`,
    `y="${fmt(y)}"`,
    `font-size="${opts.size ?? 10}"`,
    opts.anchor ? `text-anchor="${opts.anchor}"` : "",
    opts.fill ? `fill="${esc(opts.fill)}"` : "",
    opts.weight ? `font-weight="${opts.weight}"` : "",
    opts.spacing ? `letter-spacing="${opts.spacing}"` : "",
    opts.style ? `font-style="${opts.style}"` : "",
    opts.transform ? `transform="${esc(opts.transform)}"` : "",
    opts.attrs ?? "",
  ].filter(Boolean);
  return `<text class="mono ${opts.cls ?? ""}" ${attrs.join(" ")}>${esc(body)}</text>`;
}

// --- the figure --------------------------------------------------------------

/** Ridges, plateaus, events, labels and hit targets — the whole plate. */
export function rangeFigure(state) {
  const geom = rangeGeometry(state.openFam);
  const { cols, colOf, mainRight, zx0, width, height } = geom;
  const sel = state.sel;
  const focusCol = focusColumn(state, geom);
  const focusIds = focusCol != null ? cols[focusCol].skillIds : null;

  const gridLines = cols
    .map((c) => `<line x1="${fmt(c.x)}" y1="${PAD_T - 8}" x2="${fmt(c.x)}" y2="${height - 40}" stroke="#2a241b" stroke-opacity="0.05"/>`)
    .join("");

  const guideCol = cols[focusCol ?? 0];
  const guide = `<rect data-range-guide x="${fmt(guideCol.x - guideCol.w / 2)}" y="${PAD_T - 8}" width="${fmt(guideCol.w)}" height="${fmt(height - 40 - (PAD_T - 8))}" fill="#b03b1e" opacity="${focusCol == null ? 0 : 0.07}"/>`;

  const yearTicks = [];
  for (let y = 2004; y <= 2026; y += 2) yearTicks.push(y);
  const tickLines = yearTicks
    .map((y) => `<line x1="${PAD_L}" y1="${fmt(Y(y))}" x2="${width - PAD_R}" y2="${fmt(Y(y))}" stroke="#2a241b" stroke-opacity="0.06"/>`)
    .join("");

  const ridgeShapes = roleRidges
    .map((r) => {
      const span = r.end - r.start;
      const baseY = Y(r.start);
      const h = new Array(cols.length).fill(0);
      const inten = new Array(cols.length).fill(0);
      for (const [sid, [frac, it]] of Object.entries(r.use)) {
        const i = colOf[sid];
        if (i == null) continue;
        h[i] = Math.max(h[i], frac * span * PPY);
        inten[i] = Math.max(inten[i], it);
      }
      let first = -1;
      let last = -1;
      h.forEach((v, i) => { if (v > 0) { if (first < 0) first = i; last = i; } });

      const pts = [{ x: cols[first].x - cols[first].w * 0.85, y: baseY }];
      for (let i = first; i <= last; i++) pts.push({ x: cols[i].x, y: baseY - h[i] });
      pts.push({ x: cols[last].x + cols[last].w * 0.85, y: baseY });
      const d = ridgePath(pts);

      // A second, darker wash over the columns worked deeply — pigment laid twice.
      const washes = h
        .map((v, i) => (v > 0 && inten[i] > 1
          ? `<rect x="${fmt(cols[i].x - cols[i].w / 2)}" y="${fmt(baseY - v)}" width="${fmt(cols[i].w)}" height="${fmt(v)}" fill="${esc(r.color)}" opacity="${((inten[i] - 1) * 0.13).toFixed(2)}" filter="${F2}"/>`
          : ""))
        .join("");

      const clip = `rc-${r.id}`;
      return `<g class="wash pick" data-range-ridge="${esc(r.id)}" data-range-cols="${ridgeColumns(r, colOf).join(" ")}" data-range-act="role:${esc(r.id)}" opacity="${ridgeOpacity(r, cols, sel, focusCol)}">
<clipPath id="${clip}"><path d="${d}"/></clipPath>
<path d="${d}" fill="${esc(r.color)}" fill-opacity="0.3" filter="${F1}"/>
<path d="${d}" fill="${esc(r.color)}" fill-opacity="0.16" filter="${F2}"/>
<path d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="0.8" stroke-width="1.1" filter="${F1}"/>
<g clip-path="url(#${clip})">${washes}</g>
</g>`;
    })
    .join("");

  // The unbidden lane: personal projects as colony casts, plateaus keyed back
  // to their columns by a dotted thread.
  const jit = [0, -18, 14, -10, 22, -16, 8, -22, 16, -6];
  const projShapes = projRidges
    .map((r, j) => {
      const baseX = zx0 + LANE_W / 2 + j * LANE_W;
      const baseY = Y(r.start);
      const plats = (r.plateaus || []).map((p, i) => ({
        x: baseX + jit[i % 10] * 1.5,
        y: Y(p.year),
        rx: 12 + p.w * 7,
        ry: 3.5 + p.w * 1.4,
        col: colOf[p.skill],
        skill: p.skill,
        label: p.label,
        i,
      }));
      const hot = sel && ((sel.type === "role" && sel.id === r.id) || (sel.type === "plateau" && sel.rid === r.id));
      const links = plats
        .map((pl) => {
          const cx = cols[pl.col].x;
          const d = `M ${fmt(pl.x - pl.rx)} ${fmt(pl.y)} C ${fmt(pl.x - pl.rx - 100)} ${fmt(pl.y + 9)} ${fmt(cx + 110)} ${fmt(pl.y + 9)} ${fmt(cx)} ${fmt(pl.y)}`;
          const lit = (focusIds && focusIds.includes(pl.skill)) || hot;
          return `<path class="range-thread" data-range-link-col="${pl.col}" d="${d}" fill="none" stroke="${esc(r.color)}" stroke-opacity="${lit ? 0.55 : 0.12}" stroke-dasharray="3 4" stroke-width="1"/>`;
        })
        .join("");
      const ellipses = plats
        .map((pl) => `<ellipse class="range-plat" data-range-act="plateau:${esc(r.id)}:${pl.i}" data-range-hov="${pl.col}" cx="${fmt(pl.x)}" cy="${fmt(pl.y)}" rx="${fmt(pl.rx)}" ry="${fmt(pl.ry)}" fill="${esc(r.color)}" fill-opacity="0.4" stroke="${esc(r.color)}" stroke-opacity="0.8" stroke-width="1" filter="${F1}"/>`)
        .join("");
      return {
        markup: `<g class="wash" data-range-proj="${esc(r.id)}" data-range-cols="${ridgeColumns(r, colOf).join(" ")}" opacity="${ridgeOpacity(r, cols, sel, focusCol)}">
${links}
<ellipse cx="${fmt(baseX)}" cy="${fmt(baseY)}" rx="26" ry="5" fill="#7b5f3f" fill-opacity="0.3" filter="${F1}"/>
${ellipses}
</g>`,
        baseX,
        baseY,
        plats,
        ridge: r,
      };
    });

  // Role founding lines, nudged apart so no two labels collide.
  const roleLines = roleRidges
    .map((r) => `<line x1="${PAD_L}" y1="${fmt(Y(r.start))}" x2="${width - PAD_R}" y2="${fmt(Y(r.start))}" stroke="${esc(r.color)}" stroke-opacity="0.28" stroke-dasharray="2 5"/>`)
    .join("");
  const roleLabels = roleRidges
    .map((r) => ({ ty: Y(r.start) + 3, label: `${r.company} · ${r.title}`.toLowerCase(), color: r.color, id: r.id }))
    .sort((a, b) => a.ty - b.ty);
  for (let i = 1; i < roleLabels.length; i++) {
    if (roleLabels[i].ty < roleLabels[i - 1].ty + 13) roleLabels[i].ty = roleLabels[i - 1].ty + 13;
  }

  const eventShapes = events
    .map((ev, k) => {
      const x = cols[colOf[ev.skill]].x;
      const y = Y(ev.year);
      const tint = ridgeById[ev.ridge] ? ridgeById[ev.ridge].color : "#2a241b";
      const rings = Array.from({ length: ev.impact - 1 }, (_, q) =>
        `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(6 + q * 4.5)}" fill="none" stroke="${esc(tint)}" stroke-opacity="${(0.5 - q * 0.16).toFixed(2)}" stroke-width="0.9" pointer-events="none"/>`).join("");
      return `<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(6 + ev.impact * 6)}" fill="${esc(tint)}" fill-opacity="0.14" filter="${F2}" pointer-events="none"/>
${rings}
<circle class="range-ev" data-range-act="event:${k}" cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(2.6 + ev.impact * 0.8)}" fill="#f1ead9" stroke="${esc(tint)}" stroke-width="1.4"/>`;
    })
    .join("");

  // Family bracket above an expanded family's columns.
  const openIdx = cols.map((c, i) => (c.fam === state.openFam ? i : -1)).filter((v) => v >= 0);
  const famBracket = openIdx.length
    ? (() => {
        const x1 = cols[openIdx[0]].x - COL_W * 0.4;
        const x2 = cols[openIdx[openIdx.length - 1]].x + COL_W * 0.4;
        const name = fams.find((f) => f.id === state.openFam).name;
        return `<line x1="${fmt(x1)}" y1="23" x2="${fmt(x2)}" y2="23" stroke="#7b5f3f" stroke-opacity="0.4"/>`
          + text((x1 + x2) / 2, 16, `${name} ▾`, { anchor: "middle", fill: "#7b5f3f", spacing: 2, size: 10, cls: "pick", attrs: `data-range-act="fam:${esc(state.openFam)}"` });
      })()
    : "";

  const labels = [
    ...yearTicks.map((y) => text(width - PAD_R + 6, Y(y) + 3, String(y), { fill: "#8a7a5f", size: 10 })),
    ...roleLabels.map((rl) => text(PAD_L - 8, rl.ty, rl.label, { anchor: "end", fill: rl.color, size: 10, cls: "pick", attrs: `data-range-act="role:${esc(rl.id)}"` })),
    famBracket,
    ...cols.map((c, i) => {
      const lit = focusCol === i;
      const tx = c.x + 3;
      const ty = PAD_T - 16;
      return text(tx, ty, c.type === "fam" ? `${c.name} ▸` : c.name, {
        size: 9.5,
        fill: lit ? "#b03b1e" : (c.type === "fam" ? "#4a4133" : "#6a5c44"),
        weight: c.type === "fam" ? "600" : (lit ? "600" : "400"),
        transform: `rotate(-56 ${fmt(tx)} ${fmt(ty)})`,
        cls: "pick",
        attrs: `data-range-collab="${i}" data-range-act="${c.type === "fam" ? `fam:${esc(c.fam)}` : `skill:${esc(c.sid)}`}"`,
      });
    }),
    text(zx0 + (projRidges.length * LANE_W) / 2, 16, "the unbidden · personal projects", { anchor: "middle", fill: "#b03b1e", spacing: 2, size: 10 }),
    `<line x1="${fmt(zx0 + 10)}" y1="23" x2="${fmt(zx0 + projRidges.length * LANE_W - 10)}" y2="23" stroke="#b03b1e" stroke-opacity="0.4"/>`,
    `<line x1="${fmt(mainRight + 30)}" y1="${PAD_T - 8}" x2="${fmt(mainRight + 30)}" y2="${height - 40}" stroke="#2a241b" stroke-opacity="0.14" stroke-dasharray="2 6"/>`,
    ...projShapes.map((p) => text(p.baseX, p.baseY + 26, p.ridge.title.toLowerCase(), { anchor: "middle", fill: p.ridge.color, size: 10, cls: "pick", attrs: `data-range-act="role:${esc(p.ridge.id)}"` })),
    ...projShapes.flatMap((p) => p.plats.filter((pl) => pl.label).map((pl) => text(pl.x + pl.rx + 7, pl.y + 3, pl.label, { size: 9, style: "italic", fill: "#6a5c44" }))),
  ].join("");

  const hits = cols
    .map((c, i) => `<rect data-range-hov="${i}" data-range-act="${c.type === "fam" ? `fam:${esc(c.fam)}` : `skill:${esc(c.sid)}`}" x="${fmt(c.x - c.w / 2)}" y="0" width="${fmt(c.w)}" height="${PAD_T - 6}" fill="transparent" class="pick"/>`)
    .join("");

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Skill ridgeline: fixed skill columns across, time upward; each role is a watercolor ridge whose peaks show how long each skill stayed in use">
<defs>
<filter id="wc1" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>
<filter id="wc2" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="23" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="13"/></filter>
</defs>
${gridLines}
${guide}
${tickLines}
${ridgeShapes}
${projShapes.map((p) => p.markup).join("")}
${roleLines}
${eventShapes}
${labels}
${hits}
</svg>`;
}

/** "46 columns … · 1 peak-year = 46px" — the scale note beside the figure title. */
export function rangeScaleNote(openFam) {
  const { cols } = rangeGeometry(openFam);
  return `${cols.length} columns (${skills.length} skills in ${fams.length} families) · ${allRidges.length} ridges · 1 peak-year = ${PPY}px`;
}

// --- the card ----------------------------------------------------------------

const KEY_CARD = {
  kicker: "FIG. 3 · KEY",
  title: "How to read this figure",
  tint: "#2a241b",
  isSel: false,
  flag: false,
  story:
    "Skills hold fixed columns across the page; time climbs upward. Each role is founded at the year it began — its ridge peaks show how long each skill stayed a touch point, in real years on the same vertical scale. To the right, personal projects settle as plateaus, each keyed back to its skill column with a dotted thread. Tap a ridge, a column, a plateau, or an event dot. The skill families start folded into single columns — tap a family header to spread its skills out.",
  facts: [
    "6 families · 46 skills · 11 role ridges · 2 projects",
    "peak height = years of touch, not strength",
    "families start folded — expand for their columns",
  ],
};

/** What the sticky card says, for whatever is selected. */
function cardFor(sel) {
  if (!sel) return KEY_CARD;

  if (sel.type === "role") {
    const r = ridgeById[sel.id];
    const span = r.end - r.start;
    const tops = Object.entries(r.use)
      .map(([sid, [frac, it]]) => ({ sid, dur: frac * span, it }))
      .sort((a, b) => b.dur - a.dur)
      .slice(0, 5);
    return {
      kicker: `${r.kind === "project" ? "PERSONAL PROJECT" : "ROLE"} · ${yr(r.start)}–${yr(r.end)}`,
      title: r.kind === "project" ? r.title : `${r.company} — ${r.title}`,
      tint: r.color,
      isSel: true,
      story: r.story,
      facts: [
        `${Object.keys(r.use).length} skills in footprint · ${span.toFixed(1)}y span`,
        ...tops.map((t) => `${skillById[t.sid].name} · ${t.dur.toFixed(1)}y touch${t.it > 2 ? " · deep" : ""}`),
      ],
      flag: r.kind === "project" ? "begun with nobody asking" : false,
    };
  }

  if (sel.type === "skill") {
    const s = skillById[sel.id];
    const touches = allRidges
      .filter((r) => r.use[sel.id])
      .map((r) => {
        const dur = r.use[sel.id][0] * (r.end - r.start);
        return { name: r.kind === "project" ? r.title : r.company, from: r.start, to: r.start + dur, dur };
      })
      .sort((a, b) => a.from - b.from);
    const facts = touches.map((t) => `${t.name.toLowerCase()} · ${yr(t.from)}–${yr(t.to)} · ${t.dur.toFixed(1)}y`);

    // The gap is the point of the figure: show the silence rather than smooth it.
    let gap = null;
    for (let i = 1; i < touches.length; i++) {
      const g = touches[i].from - touches[i - 1].to;
      if (g > 1.5 && (!gap || g > gap.g)) gap = { g, a: touches[i - 1].to, b: touches[i].from };
    }
    const lastTo = touches.length ? Math.max(...touches.map((t) => t.to)) : 0;
    const flag = lastTo < 2024.5 ? `dormant since ${yr(lastTo)} — still on the map` : false;
    if (gap) facts.push(`longest silence: ${gap.g.toFixed(1)}y (${yr(gap.a)}–${yr(gap.b)})`);

    return {
      kicker: `SKILL COLUMN · ${fams.find((f) => f.id === s.fam).name.toUpperCase()}`,
      title: s.name,
      tint: "#2a241b",
      isSel: true,
      story: touches.length
        ? `One column, traced through every era. ${touches.length > 2
            ? `This skill recurs across ${touches.length} ridges — a through-line, not an episode.`
            : `This skill belongs to ${touches.length} era${touches.length > 1 ? "s" : ""} of the range.`}`
        : "No recorded touch points in this column yet.",
      facts,
      flag,
    };
  }

  if (sel.type === "plateau") {
    const r = ridgeById[sel.rid];
    const p = r.plateaus[sel.i];
    const s = skillById[p.skill];
    return {
      kicker: `PLATEAU · ${yr(p.year)}`,
      title: p.label || s.name,
      tint: r.color,
      isSel: true,
      story: `A settled period in ${r.title.toLowerCase()}, on the ${s.name} column. Plateaus are periods of rest and accumulation; the dotted thread ties this one back to its column in the main range.`,
      facts: [
        `column: ${s.name}`,
        `project: ${r.title.toLowerCase()} · ${yr(r.start)}–${yr(r.end)}`,
        `settled ~${yr(p.year)}`,
      ],
      flag: "begun with nobody asking",
    };
  }

  const ev = events[sel.k];
  const r = ridgeById[ev.ridge];
  return {
    kicker: `EVENT · ${ev.year.toFixed(0)} · IMPACT ${"●".repeat(ev.impact)}`,
    title: ev.label,
    tint: r.color,
    isSel: true,
    story: ev.note
      || `A touch point on the ${skillById[ev.skill].name} column, during ${(r.kind === "project" ? r.title : `${r.company} — ${r.title}`).toLowerCase()}. Glow radius scales with impact.`,
    facts: [
      `column: ${skillById[ev.skill].name}`,
      `ridge: ${r.kind === "project" ? r.title.toLowerCase() : `${r.company} · ${r.title}`.toLowerCase()}`,
    ],
    flag: false,
  };
}

/** The sticky panel: the detail card, and — with nothing selected — the key. */
export function rangeAside(state) {
  const geom = rangeGeometry(state.openFam);
  const focusCol = focusColumn(state, geom);
  const focusIds = focusCol != null ? geom.cols[focusCol].skillIds : null;
  const card = cardFor(state.sel);
  const isKey = !state.sel;
  const showBody = !!state.sel || state.keyOpen;

  const facts = card.facts.map((f) => `<div class="fact">${esc(f)}</div>`).join("");
  const body = showBody
    ? `<div>
<div class="card-rule"></div>
<p class="card-story">${esc(card.story)}</p>
<div class="card-facts">${facts}</div>
${card.flag ? `<div class="card-flag">${esc(card.flag)}</div>` : ""}
</div>`
    : "";

  const famList = isKey
    ? `<div class="card-key">
<div class="kicker">THE SKILLS · BY FAMILY</div>
<div class="famrows">${fams.map((fam) => famRow(fam, state.openFam === fam.id, focusIds)).join("")}</div>
</div>`
    : "";

  return `<div class="card-head">
<div class="kicker">${esc(card.kicker)}</div>
${card.isSel ? `<a href="#figures" class="card-close" data-range-act="clear">× close</a>` : ""}
</div>
<div class="card-title" style="color: ${esc(card.tint)}">${esc(card.title)}</div>
${isKey ? `<div class="card-keytoggle"><a href="#figures" data-range-act="key">${state.keyOpen ? "− close the key" : "+ how to read this figure"}</a></div>` : ""}
${body}
${famList}`;
}

function famRow(fam, open, focusIds) {
  const ss = skills.filter((s) => s.fam === fam.id);
  const chips = open
    ? `<div class="chips">${ss
        .map((s) => {
          const lit = focusIds && focusIds.includes(s.id);
          return `<a href="#figures" class="chip${lit ? " is-lit" : ""}" data-range-act="skill:${esc(s.id)}" data-range-chip="${esc(s.id)}">${esc(s.name)}</a>`;
        })
        .join("")}</div>`
    : "";
  return `<div class="famrow">
<a href="#figures" class="famrow-head" data-range-act="fam:${esc(fam.id)}">
<span class="famrow-name">${open ? "▾" : "▸"} ${esc(fam.name)}</span>
<span class="famrow-count mono">${ss.length}</span>
</a>
${chips}
</div>`;
}

// --- focus, applied in place -------------------------------------------------

/**
 * Hover is the one gesture frequent enough that re-rendering would be felt:
 * re-parsing the SVG restarts two feTurbulence filters over the whole plate.
 * So focus is written straight onto the existing nodes instead.
 */
export function applyRangeFocus(root, state) {
  const geom = rangeGeometry(state.openFam);
  const { cols } = geom;
  const focusCol = focusColumn(state, geom);
  const focusIds = focusCol != null ? cols[focusCol].skillIds : null;

  const guide = root.querySelector("[data-range-guide]");
  if (guide) {
    const c = cols[focusCol ?? 0];
    guide.setAttribute("x", fmt(c.x - c.w / 2));
    guide.setAttribute("width", fmt(c.w));
    guide.setAttribute("opacity", focusCol == null ? 0 : 0.07);
  }

  for (const g of root.querySelectorAll("[data-range-ridge], [data-range-proj]")) {
    const id = g.dataset.rangeRidge || g.dataset.rangeProj;
    g.setAttribute("opacity", ridgeOpacity(ridgeById[id], cols, state.sel, focusCol));
  }

  for (const path of root.querySelectorAll("[data-range-link-col]")) {
    const proj = path.closest("[data-range-proj]");
    const sel = state.sel;
    const hot = sel && ((sel.type === "role" && sel.id === proj.dataset.rangeProj)
      || (sel.type === "plateau" && sel.rid === proj.dataset.rangeProj));
    const lit = (focusCol != null && Number(path.dataset.rangeLinkCol) === focusCol) || hot;
    path.setAttribute("stroke-opacity", lit ? 0.55 : 0.12);
  }

  for (const label of root.querySelectorAll("[data-range-collab]")) {
    const i = Number(label.dataset.rangeCollab);
    const c = cols[i];
    const lit = focusCol === i;
    label.setAttribute("fill", lit ? "#b03b1e" : (c.type === "fam" ? "#4a4133" : "#6a5c44"));
    label.setAttribute("font-weight", c.type === "fam" ? "600" : (lit ? "600" : "400"));
  }

  for (const chip of root.querySelectorAll("[data-range-chip]")) {
    chip.classList.toggle("is-lit", !!(focusIds && focusIds.includes(chip.dataset.rangeChip)));
  }
}
