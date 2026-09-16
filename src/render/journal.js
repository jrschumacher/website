// The homepage: a field record, not a résumé.
//
// One long page with a sticky index — prose first, then the two figures, then
// the work up close, field notes, talks and contact. Everything below the fold
// is server-rendered, figures included; `public/journal/page.js` only adds the
// gestures (scroll-spy, the accordion, the chapter reveal) on top of a page that
// already reads without it.

import { escapeHtml } from "../format.js";
import { caseDiagram } from "./diagrams.js";
import { JOURNAL_STYLESHEET, talkStackRules } from "./journal-css.js";
import { sections, caseStudies, notes, talks, contact } from "../../public/journal/data/site.js";
import { rangeFigure, rangeAside, rangeScaleNote } from "../../public/journal/figures/range.js";
import {
  growthFigure,
  growthSteps,
  growthEventCards,
  growthRecordCards,
  growthScaleNote,
  GROWTH_LAST,
} from "../../public/journal/figures/growth.js";

const e = escapeHtml;

/**
 * The Range opens with every family folded — the state the figure is designed
 * to be met in. The Growth opens finished: a reader with no JavaScript should
 * see the whole silhouette rather than the blank page of 2003, and one with
 * JavaScript never sees it, because the scroll handler runs before the section
 * is anywhere near the viewport.
 */
const RANGE_INITIAL = { sel: null, hov: null, keyOpen: false, openFam: null };
const GROWTH_INITIAL = { act: GROWTH_LAST, sel: null, openRec: null };

function sectionHead(num, label, slug) {
  return `<div class="sec-head">
<div class="sec-title">${e(num)} — ${e(label)}</div>
<div class="sec-slug mono">${e(slug)}</div>
</div>`;
}

function index() {
  const items = sections
    .map((s) => `<a href="#${e(s.id)}" data-index="${e(s.id)}">
<span class="idx-num mono">${e(s.num)}</span><span class="idx-label">${e(s.label)}</span>
</a>`)
    .join("");
  return `<aside class="site-index" data-site-index>
<nav aria-label="Sections">
<div class="idx-head">index</div>
${items}
</nav>
</aside>`;
}

/** @param {string|null} src  resolved by src/portrait.js, null while the frame is empty */
function portrait(src) {
  const slot = src
    ? `<img src="${e(src)}" alt="Ryan Schumacher" class="portrait-img" width="232" height="280">`
    : `<div class="portrait-slot" role="img" aria-label="Portrait not yet supplied"><span>drop a portrait</span></div>`;
  return `<figure class="portrait">
<div class="portrait-frame"><div class="tape"></div>${slot}</div>
<figcaption class="mono">THE PRACTITIONER · IN THE FIELD</figcaption>
</figure>`;
}

function about(portraitSrc) {
  return `<section id="about" data-site-section class="sec-about">
${sectionHead("I", "the practitioner", "the record, in prose first")}
<div class="about-body">
${portrait(portraitSrc)}
<div class="about-prose">
<h2>Ryan Schumacher — principal engineer in data-centric security &amp; identity.</h2>
<p>I build the platforms underneath data security: identity federation (OIDC, DPoP, token exchange), enterprise key management (HSM, KMS, KAS), and policy-driven access control on open-source foundations. Currently Director of Platform at Virtru, leading the engineering organization behind the Data Security Platform and OpenTDF — software that runs air-gapped and as distributed SaaS. Before that: engineering manager, staff engineer, bank lead, and co-founder of three ventures over nine years.</p>
<p>Twenty-three years of work resist a bulleted list, so this site keeps the record as figures — the same experience in different presentations. Read <a href="#growth">the growth</a> to watch it accumulate era by era, or <a href="#figures">the figures</a> for the ranges and streams it settles into. The boring version is <a href="/resume.txt">/resume.txt</a>.</p>
<div class="about-facts">
<div class="fact">now — director of platform, virtru · remote</div>
<div class="fact">field — identity · keys · policy · platforms · open source</div>
<div class="fact">since 2003 · auburn cs · the homelab never sleeps</div>
</div>
</div>
</div>
</section>`;
}

/** Section II: the plate embeds its own header, legend and footnote, as designed. */
function growth() {
  return `<section id="growth" data-site-section class="sec-growth">
${sectionHead("II", "the growth", "grows as you scroll — 2003 at the center, today at the rim")}
<div class="bleed">
<div class="plate plate-growth" data-growth-root>
<header class="plate-head">
<div class="kicker">THE GROWTH · 2003–2026</div>
<h2>One figure, grown a chapter at a time.</h2>
<p>A list of jobs hides how the work actually arrived — nothing came all at once. So the record grows the way it happened: every skill I’ve carried holds a fixed compass bearing, radius is time from 2003 at the center, and each strand is something that was actually under my hands that year, side projects included. The chapter at hand names the role I held; the strands tell you what was really being done.</p>
</header>
<div class="plate-rule">
<div class="plate-fig">Fig. 7 — the growth, 2003–2026</div>
<div class="mono plate-scale">${e(growthScaleNote())}</div>
</div>
<div class="grow-legend mono">
<span><svg width="26" height="8" viewBox="0 0 26 8"><line x1="1" y1="4" x2="25" y2="4" stroke="#46628c" stroke-width="3" stroke-opacity="0.55"/></svg>one skill, held for those years — thicker = worked deeper</span>
<span><svg width="26" height="8" viewBox="0 0 26 8"><line x1="1" y1="4" x2="25" y2="4" stroke="#b03b1e" stroke-width="2" stroke-dasharray="5 3" stroke-opacity="0.7"/></svg>side project</span>
<span><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="5.5" fill="none" stroke="#16484c" stroke-opacity="0.5" stroke-width="0.9"/><circle cx="7" cy="7" r="3" fill="#f1ead9" stroke="#16484c" stroke-width="1.3"/></svg>event — tap chapter for the story</span>
<span><svg width="26" height="10" viewBox="0 0 26 10"><path d="M 1 7 Q 8 2 14 5 Q 20 8 25 3" fill="none" stroke="#2a241b" stroke-width="1.3" stroke-opacity="0.7"/></svg>ink line = furthest reach so far</span>
<span><svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="#2a241b" stroke-opacity="0.25" stroke-width="0.8"/><circle cx="7" cy="7" r="3" fill="none" stroke="#2a241b" stroke-opacity="0.25" stroke-width="0.8"/></svg>faint circles = year rings</span>
</div>
<div class="grow-grid">
<div class="grow-stick">
${growthFigure(GROWTH_INITIAL)}
${growthEventCards(GROWTH_INITIAL)}
${growthRecordCards(GROWTH_INITIAL)}
</div>
<div class="grow-steps">
${growthSteps(GROWTH_INITIAL)}
</div>
</div>
<footer class="plate-foot">
<p class="mono">Strands run from the year a touch began to the year it ended; the ink silhouette is the furthest every bearing has reached so far. Dashed strands are the side projects, begun with nobody asking.</p>
</footer>
</div>
</div>
</section>`;
}

/** Section III: the range. */
function figures() {
  return `<section id="figures" data-site-section class="sec-figures">
${sectionHead("III", "the figures", "working plates")}
<div class="bleed">
<div class="plate plate-range" data-range-root>
<header class="plate-head">
<div class="kicker">THE RANGE · 2003–2026</div>
<h2>The work, drawn as terrain.</h2>
<p>A résumé flattens twenty-three years into bullets; terrain keeps the shape. Everything I’ve worked with holds a fixed column across the page, and every role I’ve held raises a ridge at the year it began — a peak’s height is how long that skill stayed under my hands, in real years. Where a column peaks era after era, that’s a through-line; where it falls silent, I’d rather show the gap than smooth it over.</p>
</header>
<div class="plate-rule">
<div class="plate-fig">Fig. 3 — the range, 2003–2026</div>
<div class="mono plate-scale" data-range-scale>${e(rangeScaleNote(RANGE_INITIAL.openFam))}</div>
</div>
<div class="range-grid">
<div class="range-plate" data-range-figure>
${rangeFigure(RANGE_INITIAL)}
</div>
<aside class="range-card paper" data-range-card>
${rangeAside(RANGE_INITIAL)}
</aside>
</div>
<footer class="plate-foot">
<p class="mono">Peak heights are drawn in real years — a skill used through a whole three-year role makes a three-year peak. Watercolor darkness is depth of use; ringed dots are events, ring count by impact, tinted to their ridge. Hover a column to light it across every era; tap one for the eras that touched it, the personal projects among them.</p>
</footer>
</div>
</div>
</section>`;
}

function work() {
  const entries = caseStudies
    .map((cs) => `<article class="cs">
<div class="kicker">CASE STUDY № ${e(cs.num)} · ${e(cs.kicker)}</div>
<div class="cs-title" style="color: ${e(cs.tint)}">${e(cs.title)}</div>
<div class="rule-short"></div>
<div class="cs-grid">
<div>
<p class="cs-story">${e(cs.story)}</p>
<p class="cs-story">${e(cs.story2)}</p>
<div class="cs-stat">
<span class="cs-stat-big" style="color: ${e(cs.tint)}">${e(cs.statBig)}</span>
<span class="cs-stat-note mono">${e(cs.statNote)}</span>
</div>
<div class="card-facts">${cs.facts.map((f) => `<div class="fact">${e(f)}</div>`).join("")}</div>
</div>
<figure class="cs-fig">
<div class="cs-fig-frame">${caseDiagram(cs.diagram, cs.tint)}</div>
<figcaption>${e(cs.figCaption)}</figcaption>
</figure>
</div>
</article>`)
    .join("");
  return `<section id="work" data-site-section class="sec-work">
${sectionHead("IV", "case studies", "the work, up close")}
<div class="cs-list">${entries}</div>
</section>`;
}

function fieldNotes() {
  const entries = notes
    .map((n) => `<article class="note">
<div class="note-head"><span class="mono note-date">${e(n.date)}</span><span class="note-title">${e(n.title)}</span></div>
<p class="note-excerpt">${e(n.excerpt)}</p>
</article>`)
    .join("");
  return `<section id="notes" data-site-section class="sec-notes">
${sectionHead("V", "field notes", "short entries from the field")}
<div class="note-list">${entries}</div>
</section>`;
}

/**
 * Section VI: the talk stack, shuffled by `:checked` alone.
 *
 * Every arrangement of the stack is a CSS rule (see `talkStackRules`), so the
 * transparencies come forward, the year list tracks them and prev/next cycle
 * without a line of script — and with keyboard focus for free.
 */
function talkSection() {
  const n = talks.length;
  const radios = talks
    .map((t, i) => `<input type="radio" name="talk" id="talk-${i}" class="talk-radio"${i === 0 ? " checked" : ""}>`)
    .join("");

  const cards = talks
    .map((t, i) => {
      const num = `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      const face = `<div class="talk-face">
<div class="tape"></div>
<div class="talk-meta mono"><span>TALK · ${e(t.year)}</span><span>TRANSPARENCY ${e(num)}</span></div>
<div class="talk-body">
<div class="talk-title">${e(t.title)}</div>
<div class="rule-short"></div>
<div class="talk-venue mono">${e(t.venue)}</div>
</div>
<div class="talk-foot mono"><span>aboldnewlook · title slide</span><span class="talk-open">${t.href ? "open the full talk →" : ""}</span><span class="talk-bring">bring forward</span></div>
</div>`;
      const wrapped = t.href ? `<a class="talk-link" href="${e(t.href)}">${face}</a>` : face;
      return `<div class="talk-card talk-card-${i}">${wrapped}<label class="talk-grab" for="talk-${i}"><span class="sr-only">Bring “${e(t.title)}” forward</span></label></div>`;
    })
    .join("");

  const navRows = talks
    .map((t, i) => `<label class="talk-nav-row talk-nav-${i}" for="talk-${i}">
<span class="mono talk-nav-year">${e(t.year)}</span>
<span class="talk-nav-title">${e(t.title)}</span>
</label>`)
    .join("");

  const positions = talks.map((t, i) => `<span class="talk-pos talk-pos-${i}">${i + 1} / ${n}</span>`).join("");
  const cycles = talks
    .map((t, i) => `<div class="talk-cycle talk-cycle-${i}">
<label for="talk-${(i - 1 + n) % n}">← prev</label>
<label for="talk-${(i + 1) % n}">next →</label>
</div>`)
    .join("");

  return `<section id="talks" data-site-section class="sec-talks">
${sectionHead("VI", "talks", "transparencies from the projector")}
<div class="talks-grid">
${radios}
<div class="talk-stack">${cards}</div>
<div class="talk-side">
<div class="mono talk-stack-head">THE STACK · ${positions}</div>
${navRows}
<div class="talk-cycles mono">${cycles}</div>
</div>
</div>
</section>`;
}

function contactSection() {
  const rows = contact
    .map((c) => `<a href="${e(c.href)}" class="contact-row">
<span class="mono contact-label">${e(c.label)}</span>
<span class="contact-value">${e(c.value)}</span>
</a>`)
    .join("");
  return `<section id="contact" data-site-section class="sec-contact">
${sectionHead("VII", "contact", "get in touch")}
<div class="contact-list">${rows}</div>
</section>`;
}

function colophon() {
  return `<footer class="colophon mono">
<p>colophon — set in eb garamond &amp; ibm plex mono · figures drawn from the record</p>
<p><a href="mailto:j.r.schumacher@gmail.com">email</a> · <a href="https://github.com/jrschumacher">github</a> · <a href="https://linkedin.com/in/jrschumacher">linkedin</a> · <a href="/resume.txt">/resume.txt</a> · <a href="/blog">blog</a></p>
<p>© 2026 ryan schumacher · field notes from the record</p>
</footer>`;
}

/**
 * The whole homepage, as one document.
 *
 * @param {object} [opts]
 * @param {string|null} [opts.portrait] image URL for section I, or null for the
 *   empty frame. Resolved by the route, so this stays a pure function of data.
 */
export function renderJournal({ portrait: portraitSrc = null } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>aboldnewlook — the field record of Ryan Schumacher</title>
<meta name="description" content="The field record of Ryan Schumacher — identity, keys, and the platforms underneath. Twenty-three years of work, drawn as terrain.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<style>${JOURNAL_STYLESHEET}${talkStackRules(talks.length)}</style>
</head>
<body class="journal">
<div class="sheet">
<header class="masthead">
<div>
<h1>aboldnewlook</h1>
<p class="masthead-sub">the field record of Ryan Schumacher — identity, keys, and the platforms underneath</p>
</div>
<div class="masthead-slug mono">FIELD NOTES · 2003–2026</div>
</header>
<div class="site-grid" data-site-grid>
${index()}
<main class="site-main">
${about(portraitSrc)}
${growth()}
${figures()}
${work()}
${fieldNotes()}
${talkSection()}
${contactSection()}
${colophon()}
</main>
</div>
</div>
<script type="module" src="/journal/page.js"></script>
</body>
</html>`;
}
