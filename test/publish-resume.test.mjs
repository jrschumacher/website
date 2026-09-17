// bin/publish-resume decides what leaves the private database. Its exclusions
// are the whole point of the script, so they are asserted here rather than
// trusted to a code comment.
//
// The script shells out to wrangler and needs a live account, so it cannot be
// executed under `node --test`. It is read as source instead — the same
// approach registry-covers-decks.test.mjs takes, and for the same reason.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SRC = readFileSync(new URL("../bin/publish-resume", import.meta.url), "utf8");

/** The job-pipeline tables the resume-public split exists to keep out. */
const PRIVATE_TABLES = [
  "jobs",
  "job_events",
  "job_interviews",
  "job_notes",
  "job_emails",
  "target_companies",
  "agent_contract",
];

test("the script never names a job-pipeline table", () => {
  for (const t of PRIVATE_TABLES) {
    assert.ok(
      !new RegExp(`\\b${t}\\b`).test(SRC.replace(/^\s*\/\/.*$/gm, "")),
      `${t} is a private table and must not appear outside comments — the split exists to keep it out`,
    );
  }
});

test("it publishes exactly the five public tables", () => {
  const m = SRC.match(/const TABLES = \[([^\]]*)\]/);
  assert.ok(m, "TABLES is the list of what gets written");
  const tables = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  assert.deepEqual(tables.sort(), [
    "accomplishments",
    "companies",
    "profile",
    "roles",
    "targets",
  ]);
});

test("neither notes column is ever selected", () => {
  // The column lists passed to statementsFor() are what gets copied.
  const columnLists = [...SRC.matchAll(/statementsFor\(\s*"(\w+)",\s*\[([^\]]*)\]/g)].map(
    ([, table, cols]) => ({ table, cols: [...cols.matchAll(/"([^"]+)"/g)].map((x) => x[1]) }),
  );
  const byTable = Object.fromEntries(columnLists.map((c) => [c.table, c.cols]));

  assert.ok(byTable.accomplishments, "accomplishments is published");
  assert.ok(
    !byTable.accomplishments.includes("notes"),
    "accomplishments.notes is working commentary and must never reach the public database",
  );
  assert.ok(
    !byTable.roles.includes("note"),
    "roles.note renders on the résumé; the backlog's version is a working note, so it is curated on the public side instead",
  );
  // And the things that must be published, are.
  assert.ok(byTable.accomplishments.includes("bullet"));
  assert.ok(byTable.roles.includes("title") && byTable.roles.includes("start"));
});

test("bullets tagged private are filtered out, by tag not by guesswork", () => {
  assert.match(SRC, /const PRIVATE_TAG = "private"/);
  assert.match(
    SRC,
    /NOT LIKE '%, \$\{PRIVATE_TAG\}, %'/,
    "the filter matches a whole tag, so a bullet tagged 'privately-held' is not caught by accident",
  );
});

test("targets are an allowlist, so a company-specific one cannot leak", () => {
  const m = SRC.match(/const PUBLIC_TARGETS = \[([^\]]*)\]/);
  assert.ok(m, "PUBLIC_TARGETS is the allowlist");
  const targets = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  assert.ok(targets.length > 0);
  assert.ok(
    !targets.includes("tremendous"),
    "'tremendous' names a company being applied to — publishing it discloses the job search",
  );
  assert.match(SRC, /WHERE name IN \(\$\{targetList\}\)/, "the allowlist is applied in SQL");
});

test("it does nothing unless asked", () => {
  assert.match(SRC, /const apply = args\.includes\("--apply"\)/);
  assert.match(SRC, /if \(apply\)/, "writes happen only under --apply");
});

test("quoting is delegated to the database", () => {
  assert.match(
    SRC,
    /quote\("\$\{c\}"\)/,
    "every bullet is prose and prose has apostrophes; SQLite's quote() escapes them correctly",
  );
});
