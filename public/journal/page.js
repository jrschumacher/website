// The only client script on the site.
//
// Everything here is an addition to a page that already renders: the index is a
// list of anchors before this runs, The Range is drawn with its families folded,
// The Growth shows its finished silhouette, and the talk stack shuffles on
// `:checked` alone. What this adds is the scroll-spy, the accordion, and the
// chapter-by-chapter reveal.

import { rangeFigure, rangeAside, rangeScaleNote, applyRangeFocus } from "./figures/range.js";
import { applyGrowth, chapterStepOf, eventRidgeId, GROWTH_LAST } from "./figures/growth.js";

/** rAF-coalesced scroll/resize listener: one callback per frame, at most. */
function onScroll(fn) {
  let frame = null;
  const run = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = null; fn(); });
  };
  addEventListener("scroll", run, { passive: true });
  addEventListener("resize", run, { passive: true });
  fn();
}

function scrollToEl(el, offset = 12) {
  const top = el.getBoundingClientRect().top + scrollY - offset;
  scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

// --- the index ---------------------------------------------------------------

function wireIndex() {
  const index = document.querySelector("[data-site-index]");
  if (!index) return;
  const links = new Map([...index.querySelectorAll("[data-index]")].map((a) => [a.dataset.index, a]));
  const sections = [...document.querySelectorAll("[data-site-section]")];
  let active = null;
  let collapsed = null;

  onScroll(() => {
    const mid = innerHeight * 0.45;
    let now = sections[0].id;
    for (const el of sections) if (el.getBoundingClientRect().top < mid) now = el.id;
    if (now !== active) {
      if (links.has(active)) links.get(active).classList.remove("is-active");
      links.get(now)?.classList.add("is-active");
      active = now;
    }
    // Once the masthead is well out of view the labels stop earning their width.
    const want = scrollY > 560;
    if (want !== collapsed) {
      index.classList.toggle("is-collapsed", want);
      collapsed = want;
    }
  });

  index.addEventListener("click", (ev) => {
    const link = ev.target.closest("[data-index]");
    if (!link) return;
    const el = document.getElementById(link.dataset.index);
    if (!el) return;
    ev.preventDefault();
    scrollToEl(el);
  });
}

/** The two in-prose jumps in section I want the same easing as the index. */
function wireProseJumps() {
  for (const a of document.querySelectorAll('.about-prose a[href^="#"]')) {
    a.addEventListener("click", (ev) => {
      const el = document.getElementById(a.getAttribute("href").slice(1));
      if (!el) return;
      ev.preventDefault();
      scrollToEl(el);
    });
  }
}

// --- III · the range ---------------------------------------------------------

function wireRange() {
  const root = document.querySelector("[data-range-root]");
  if (!root) return;
  const figure = root.querySelector("[data-range-figure]");
  const card = root.querySelector("[data-range-card]");
  const scale = root.querySelector("[data-range-scale]");
  const state = { sel: null, hov: null, keyOpen: false, openFam: null };

  const drawCard = () => { card.innerHTML = rangeAside(state); };
  // Only an accordion click changes the geometry, and only then is the plate
  // rebuilt — hover and selection are written onto the nodes already there.
  const drawAll = () => {
    figure.innerHTML = rangeFigure(state);
    scale.textContent = rangeScaleNote(state.openFam);
    drawCard();
    applyRangeFocus(root, state);
  };

  const parse = (act) => {
    const [kind, a] = act.split(":");
    if (kind === "role") return { type: "role", id: a };
    if (kind === "skill") return { type: "skill", id: a };
    if (kind === "event") return { type: "event", k: Number(a) };
    return null;
  };

  root.addEventListener("click", (ev) => {
    const target = ev.target.closest("[data-range-act]");
    if (!target) return;
    ev.preventDefault();
    const act = target.dataset.rangeAct;

    if (act.startsWith("fam:")) {
      const id = act.slice(4);
      state.openFam = state.openFam === id ? null : id;
      state.hov = null;
      drawAll();
      return;
    }
    if (act === "clear") { state.sel = null; drawCard(); applyRangeFocus(root, state); return; }
    if (act === "key") { state.keyOpen = !state.keyOpen; drawCard(); applyRangeFocus(root, state); return; }
    state.sel = parse(act);
    drawCard();
    applyRangeFocus(root, state);
  });

  const hover = (ev, value) => {
    const target = ev.target.closest("[data-range-hov]");
    if (!target) return;
    const next = value === null ? null : Number(target.dataset.rangeHov);
    if (next === state.hov) return;
    state.hov = next;
    applyRangeFocus(root, state);
  };
  root.addEventListener("mouseover", (ev) => hover(ev, 1));
  root.addEventListener("mouseout", (ev) => hover(ev, null));
  root.addEventListener("focusin", (ev) => hover(ev, 1));
  root.addEventListener("focusout", (ev) => hover(ev, null));
}

// --- II · the growth ---------------------------------------------------------

function wireGrowth() {
  const root = document.querySelector("[data-growth-root]");
  if (!root) return;
  const steps = [...root.querySelectorAll("[data-growth-step]")];
  const state = { act: 0, sel: null, openRec: null };

  // Anchors for the "did the reader scroll away from this card?" test.
  let recAnchor = 0;
  let selAnchor = 0;
  let selAuto = false;
  let selAutoTimer = null;

  const paint = () => applyGrowth(root, state);

  /** Cards fade out on their own paper animation before they leave the DOM. */
  const dismiss = (selector, clear) => {
    const el = root.querySelector(selector);
    if (!el || el.classList.contains("is-closing")) { clear(); paint(); return; }
    el.classList.add("is-closing");
    setTimeout(() => { el.classList.remove("is-closing"); clear(); paint(); }, 380);
  };
  const closeSel = () => {
    if (state.sel === null) return;
    dismiss(`[data-grow-evcard="${state.sel.k}"]`, () => { state.sel = null; });
  };
  const closeRec = () => {
    if (state.openRec === null) return;
    dismiss(`[data-grow-reccard="${state.openRec}"]`, () => { state.openRec = null; });
  };

  state.act = 0;
  paint();

  onScroll(() => {
    const mid = innerHeight * 0.55;
    let act = 0;
    steps.forEach((el, i) => { if (el.getBoundingClientRect().top < mid) act = i; });

    if (state.openRec !== null && Math.abs(scrollY - recAnchor) > 40) closeRec();
    if (state.sel !== null) {
      if (selAuto) {
        // A smooth scroll is in flight; wait for it to settle, then re-anchor.
        clearTimeout(selAutoTimer);
        selAutoTimer = setTimeout(() => { selAnchor = scrollY; selAuto = false; }, 180);
      } else if (Math.abs(scrollY - selAnchor) > 40) {
        closeSel();
      }
    }
    if (act !== state.act) { state.act = Math.min(act, GROWTH_LAST); paint(); }
  });

  root.addEventListener("click", (ev) => {
    const dot = ev.target.closest("[data-grow-ev]");
    if (dot) {
      const k = Number(dot.dataset.growEv);
      if (state.sel && state.sel.k === k) { closeSel(); return; }
      state.sel = { k, ridge: eventRidgeId(k) };
      // The card reads against its chapter, so bring the chapter along with it.
      const step = steps[chapterStepOf(k)];
      if (step) {
        const max = document.documentElement.scrollHeight - innerHeight;
        selAnchor = Math.max(0, Math.min(step.getBoundingClientRect().top + scrollY - 24, max));
        selAuto = true;
        scrollTo({ top: selAnchor, behavior: "smooth" });
      } else {
        selAnchor = scrollY;
        selAuto = false;
      }
      paint();
      return;
    }

    const target = ev.target.closest("[data-grow-act]");
    if (!target) return;
    ev.preventDefault();
    const act = target.dataset.growAct;
    if (act === "clear") { closeSel(); return; }
    if (act === "clear-rec") { closeRec(); return; }
    if (act.startsWith("rec:")) {
      const id = act.slice(4);
      recAnchor = scrollY;
      if (state.openRec === id) { closeRec(); return; }
      state.openRec = id;
      paint();
    }
  });
}

wireIndex();
wireProseJumps();
wireRange();
wireGrowth();
