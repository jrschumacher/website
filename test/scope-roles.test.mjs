// A promotion is real the day it happens.
//
// The assembler used to drop any role with no accomplishments attached, which
// meant a new title stayed invisible on the résumé until somebody had written
// bullets for it. That is backwards: the title is the fact, the bullets are the
// commentary.

import test from "node:test";
import assert from "node:assert/strict";

import { assemble } from "../src/scope.js";
import { renderHtml } from "../src/render/html.js";
import { renderText } from "../src/render/text.js";
import { renderResumeMarkdown } from "../src/render/resume-md.js";

const TARGET = {
  name: "default",
  headline: "Principal engineer",
  summary: "A summary.",
  include_tags: "",
  boost_tags: "",
  exclude_tags: "",
  max_bullets_per_role: 6,
  num_highlights: 3,
};

/** One company, a freshly-held title with nothing written for it yet, and the
 *  role below it carrying all the bullets. */
const DATA = {
  profile: [],
  companies: [{ key: "virtru", display: "Virtru", location: "Remote", sort_order: 1 }],
  roles: [
    { id: 8, company_key: "virtru", title: "VP of Engineering, Platform", start: "2026-08", end: "present", note: null, sort_order: 1 },
    { id: 1, company_key: "virtru", title: "Director of Platform", start: "2025-01", end: "2025-12", note: null, sort_order: 2 },
  ],
  accomplishments: [
    { id: 1, role_id: 1, bullet: "Did the work.", tags: "", metric: null, date_added: "2025", notes: null },
  ],
};

test("a role with no bullets still reaches the assembled résumé", () => {
  const resume = assemble(TARGET, DATA);
  const titles = resume.experience[0].roles.map((r) => r.title);
  assert.deepEqual(titles, ["VP of Engineering, Platform", "Director of Platform"]);
  assert.deepEqual(resume.experience[0].roles[0].bullets, [], "no bullets, and that is fine");
  assert.equal(resume.experience[0].roles[0].dateRange, "Aug 2026 – Present");
});

test("a company with no roles at all is still skipped", () => {
  const resume = assemble(TARGET, { ...DATA, roles: [], accomplishments: [] });
  assert.deepEqual(resume.experience, []);
});

test("the bulletless role renders in all three formats, with no empty list", () => {
  const resume = assemble(TARGET, DATA);

  const html = renderHtml(resume);
  assert.match(html, /VP of Engineering, Platform/);
  assert.ok(!html.includes("<ul></ul>"), "an empty <ul> would take its margin and read as a gap");

  const text = renderText(resume);
  assert.match(text, /VP of Engineering, Platform · Aug 2026 – Present/);

  const md = renderResumeMarkdown(resume);
  assert.match(md, /\*\*VP of Engineering, Platform\*\* · Aug 2026 – Present/);
});

test("the newest role is the one the résumé leads with", () => {
  const resume = assemble(TARGET, DATA);
  const html = renderHtml(resume);
  assert.ok(
    html.indexOf("VP of Engineering, Platform") < html.indexOf("Director of Platform"),
    "sort_order decides, and 1 is the current title",
  );
});
