// /llms.txt and /resume.md — the two files on this site written for something
// that is reading it rather than looking at it.

import test from "node:test";
import assert from "node:assert/strict";

import { renderLlmsTxt } from "../src/render/llms.js";
import { renderResumeMarkdown } from "../src/render/resume-md.js";

const RESUME = {
  name: "Ryan Schumacher",
  headline: "Principal engineer",
  contact: { email: "r@example.com", github: "github.com/x", linkedin: "" },
  summary: "A summary.",
  highlights: ["Did a thing"],
  experience: [
    {
      display: "Virtru",
      location: "Remote",
      roles: [
        { title: "Director of Platform", dateRange: "2024–", note: "", bullets: ["Led the thing"] },
      ],
    },
  ],
  skills: [{ category: "Languages", value: "Go, TypeScript" }],
  community: ["Organised something"],
  education: [{ school: "Somewhere", degree: "BS" }],
};

// --- /llms.txt ----------------------------------------------------------------

test("llms.txt opens the way llmstxt.org says: an h1, then a blockquote", () => {
  const txt = renderLlmsTxt({ headline: "Principal engineer" });
  const lines = txt.split("\n");
  assert.equal(lines[0], "# Ryan Schumacher");
  assert.equal(lines[1], "");
  assert.equal(lines[2], "> Principal engineer");
});

test("llms.txt links are absolute", () => {
  const txt = renderLlmsTxt({});
  const relative = txt.match(/\]\((?!https:\/\/)/g);
  assert.equal(relative, null, "a crawler holding this file has lost the base URL");
});

test("llms.txt lists every study, deck and post it is given", () => {
  const txt = renderLlmsTxt({
    studies: [{ slug: "a-study", title: "A study", kicker: "K", story: "S" }],
    talks: [{ slug: "a-deck", meta: { title: "A deck", summary: "About decks." } }],
    posts: [{ slug: "a-post", title: "A post", summary: "About posts." }],
  });
  assert.match(txt, /\[A study\]\(https:\/\/aboldnewlook\.com\/work\/a-study\)/);
  assert.match(txt, /\[A deck\]\(https:\/\/aboldnewlook\.com\/talks\/a-deck\): About decks\./);
  assert.match(txt, /\[A post\]\(https:\/\/aboldnewlook\.com\/blog\/a-post\): About posts\./);
});

test("llms.txt still stands up when every source is empty", () => {
  const txt = renderLlmsTxt({});
  assert.match(txt, /^# Ryan Schumacher/);
  assert.match(txt, /## Start here/, "the résumé is on the site whether or not D1 answered");
  assert.match(txt, /\/resume\.md/);
  // The sections with nothing in them still carry their index page, because
  // those pages exist regardless of what the database said.
  assert.match(txt, /## Case studies/);
  assert.match(txt, /## Talks/);
  assert.match(txt, /## Writing/);
});

test("llms.txt descriptions are one line each", () => {
  const txt = renderLlmsTxt({
    studies: [
      { slug: "s", title: "T", kicker: "K", story: "One line.\nAnd\na second.\n\nAnd a third." },
    ],
  });
  for (const line of txt.split("\n")) {
    if (line.startsWith("- [")) {
      assert.ok(!line.includes("\n"), "a link entry spans one line");
    }
  }
  assert.match(txt, /K — One line\. And a second\. And a third\./);
});

test("llms.txt truncates a description rather than printing an essay", () => {
  const long = "word ".repeat(200);
  const txt = renderLlmsTxt({ studies: [{ slug: "s", title: "T", kicker: "K", story: long }] });
  const entry = txt.split("\n").find((l) => l.startsWith("- [T]"));
  assert.ok(entry.length < 300, `entry was ${entry.length} chars`);
  assert.ok(entry.endsWith("…"));
});

// --- /resume.md ---------------------------------------------------------------

test("the markdown résumé carries every section of the assembled one", () => {
  const md = renderResumeMarkdown(RESUME);
  assert.match(md, /^# Ryan Schumacher/);
  assert.match(md, /^> Principal engineer$/m);
  assert.match(md, /<r@example\.com> · github\.com\/x/);
  assert.match(md, /^## Key impact highlights$/m);
  assert.match(md, /^- Did a thing$/m);
  assert.match(md, /^### Virtru — Remote$/m);
  assert.match(md, /^\*\*Director of Platform\*\* · 2024–$/m);
  assert.match(md, /^- Led the thing$/m);
  assert.match(md, /^- \*\*Languages:\*\* Go, TypeScript$/m);
  assert.match(md, /^## Community$/m);
  assert.match(md, /^- Somewhere — BS$/m);
});

test("the markdown résumé omits a section rather than printing it empty", () => {
  const md = renderResumeMarkdown({
    ...RESUME,
    highlights: [],
    community: [],
    education: [],
    skills: [],
  });
  for (const heading of ["Key impact highlights", "Community", "Education", "Skills"]) {
    assert.ok(!md.includes(`## ${heading}`), `${heading} has no rows but was printed`);
  }
  assert.match(md, /^## Experience$/m, "the sections with rows are still there");
});

test("the markdown résumé ends with exactly one newline", () => {
  const md = renderResumeMarkdown(RESUME);
  assert.ok(md.endsWith("\n"));
  assert.ok(!md.endsWith("\n\n"));
});
