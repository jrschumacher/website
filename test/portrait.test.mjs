// The portrait slot fills by dropping a file, not by editing code — so the
// thing worth pinning is the lookup: what it asks for, in what order, how often,
// and what it does when the answer is no.

import { test } from "node:test";
import assert from "node:assert/strict";

import { resolvePortrait } from "../src/portrait.js";
import { renderJournal } from "../src/render/journal.js";

const REQUEST = { url: "https://aboldnewlook.com/" };

/** An assets binding that only has the paths you give it, and counts lookups. */
function assets(...present) {
  const asked = [];
  return {
    asked,
    env: {
      ASSETS: {
        async fetch(url) {
          const path = new URL(url).pathname;
          asked.push(path);
          const ok = present.includes(path);
          return { ok, status: ok ? 200 : 404, body: null };
        },
      },
    },
  };
}

test("finds portrait.jpg and stops looking", async () => {
  const { env, asked } = assets("/portrait.jpg");
  assert.equal(await resolvePortrait(REQUEST, env), "/portrait.jpg");
  assert.deepEqual(asked, ["/portrait.jpg"]);
});

test("falls through the other extensions in order", async () => {
  const { env, asked } = assets("/portrait.png");
  assert.equal(await resolvePortrait(REQUEST, env), "/portrait.png");
  assert.deepEqual(asked, ["/portrait.jpg", "/portrait.jpeg", "/portrait.png"]);
});

test("no file means no portrait, and the frame stays empty", async () => {
  const { env } = assets();
  assert.equal(await resolvePortrait(REQUEST, env), null);
});

test("the answer is memoized per isolate, including the negative one", async () => {
  const { env, asked } = assets();
  await resolvePortrait(REQUEST, env);
  const afterFirst = asked.length;
  await resolvePortrait(REQUEST, env);
  await resolvePortrait(REQUEST, env);
  assert.equal(asked.length, afterFirst, "should not re-probe for the same env");
});

test("a binding that throws degrades to the placeholder", async () => {
  const env = { ASSETS: { fetch() { throw new Error("binding is having a day"); } } };
  assert.equal(await resolvePortrait(REQUEST, env), null);
});

test("no binding at all degrades to the placeholder", async () => {
  assert.equal(await resolvePortrait(REQUEST, {}), null);
  assert.equal(await resolvePortrait(REQUEST, undefined), null);
});

test("the page renders the empty frame when there is no portrait", () => {
  const html = renderJournal({ portrait: null });
  assert.match(html, /class="portrait-slot"/);
  assert.match(html, /drop a portrait/);
  assert.doesNotMatch(html, /class="portrait-img"/);
});

test("the page renders the image when there is one", () => {
  const html = renderJournal({ portrait: "/portrait.jpg" });
  assert.match(html, /<img src="\/portrait\.jpg" alt="Ryan Schumacher" class="portrait-img"/);
  assert.doesNotMatch(html, /drop a portrait/);
});

test("the portrait URL is escaped into the attribute", () => {
  const html = renderJournal({ portrait: '/x".jpg' });
  assert.doesNotMatch(html, /src="\/x"\.jpg"/);
  assert.match(html, /&quot;/);
});
