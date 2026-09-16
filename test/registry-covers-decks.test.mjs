// The registry and decks/ have to agree, in both directions.
//
// src/talks/registry.js writes its imports out one per deck, because the
// Workers bundler resolves them statically. That hand-kept list can drift from
// the directory two ways, and both have bitten this repo:
//
//   an import with no file   the bundle does not build at all
//   a file with no import    the deck exists but the site cannot serve it
//
// The registry cannot be imported here — it pulls decks/*.md through the
// wrangler Text rule, which only resolves inside the Worker bundle — so this
// reads it as source and pulls the slugs out.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const registrySrc = readFileSync(new URL("../src/talks/registry.js", import.meta.url), "utf8");

/** Slugs in the SOURCES map: ["slug", ident]. */
const registered = [...registrySrc.matchAll(/\[\s*"([a-z0-9-]+)",\s*[A-Za-z]/g)].map((m) => m[1]);

/** Deck files on disk, ledgers excluded — they are notes about a deck, not one. */
const onDisk = readdirSync(new URL("../decks/", import.meta.url))
  .filter((f) => f.endsWith(".md") && !f.endsWith(".ledger.md"))
  .map((f) => f.replace(/\.md$/, ""))
  .sort();

/** Paths the registry imports. */
const imported = [...registrySrc.matchAll(/from "\.\.\/\.\.\/decks\/([a-z0-9-]+)\.md"/g)]
  .map((m) => m[1])
  .sort();

test("every deck file is in the registry", () => {
  const missing = onDisk.filter((s) => !registered.includes(s));
  assert.deepEqual(
    missing,
    [],
    missing.length
      ? `decks/ has ${missing.join(", ")} with no registry entry — add the import and the SOURCES line in src/talks/registry.js, or the site cannot serve them`
      : "",
  );
});

test("every registry entry has a deck file", () => {
  const absent = registered.filter((s) => !onDisk.includes(s));
  assert.deepEqual(
    absent,
    [],
    absent.length
      ? `src/talks/registry.js references ${absent.join(", ")} with no file in decks/ — the bundle will not build`
      : "",
  );
});

test("the imports and the SOURCES map name the same decks", () => {
  assert.deepEqual([...registered].sort(), imported);
});

test("there is at least one deck", () => {
  assert.ok(onDisk.length > 0, "decks/ is empty");
});
