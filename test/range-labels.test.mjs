// The Range's role captions have a hard width budget, and nothing enforces it
// at runtime.
//
// Each caption is right-anchored at PAD_L - 8 with nothing to its left, so a
// caption wider than that gutter is silently clipped by the viewBox — no error,
// no warning, just a label with its first few words missing. That is exactly
// what happened when a role title grew: "virtru · director → vp of engineering,
// platform" rendered as "director → vp of engineering, platform".
//
// The budget is the gutter; the measure is IBM Plex Mono at the caption's font
// size, whose advance width is a flat 0.6em because it is monospaced.

import test from "node:test";
import assert from "node:assert/strict";

import { ridges } from "../public/journal/data/range.js";

const PAD_L = 238;          // figures/range.js
const ANCHOR_INSET = 8;     // text(PAD_L - 8, …)
const FONT_SIZE = 10;       // { size: 10 }
const ADVANCE = 0.6;        // IBM Plex Mono, per character

const GUTTER = PAD_L - ANCHOR_INSET;

/** The caption as figures/range.js builds it. */
function caption(r) {
  return (r.label ?? `${r.company} · ${r.title}`).toLowerCase();
}

function widthPx(text) {
  return text.length * FONT_SIZE * ADVANCE;
}

test("every role caption fits the gutter it is anchored in", () => {
  const over = ridges
    .filter((r) => r.kind === "role")
    .map((r) => ({ id: r.id, text: caption(r), px: widthPx(caption(r)) }))
    .filter((c) => c.px > GUTTER);

  assert.deepEqual(
    over,
    [],
    over
      .map(
        (c) =>
          `${c.id}: "${c.text}" is ~${Math.round(c.px)}px, ${GUTTER}px available. ` +
          `Give the ridge a shorter \`label\` — the card still shows the full title.`,
      )
      .join("\n"),
  );
});

test("a `label`, where present, is what the caption uses", () => {
  const labelled = ridges.filter((r) => r.kind === "role" && r.label);
  assert.ok(labelled.length > 0, "the override exists because two ridges need it");
  for (const r of labelled) {
    assert.equal(caption(r), r.label.toLowerCase());
    assert.notEqual(
      caption(r),
      `${r.company} · ${r.title}`.toLowerCase(),
      `${r.id} carries a label identical to the default — drop it instead`,
    );
  }
});

test("the full title survives on the ridge for the detail card", () => {
  const auburn = ridges.find((r) => r.id === "auburn");
  assert.equal(auburn.title, "Information Technology Specialist III");
  assert.equal(auburn.label, "auburn · it specialist iii");
});
