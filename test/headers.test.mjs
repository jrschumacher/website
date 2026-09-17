// The headers every response carries.
//
// The load-bearing claim is that the policy actually admits the things this
// site does — the inlined stylesheets, the Google Fonts files, the two module
// scripts, the résumé's one inline handler — and admits nothing else. A policy
// that is too strict breaks the page; one that is too loose is decoration. The
// test pins both edges.

import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import { SECURITY_HEADERS, harden } from "../src/headers.js";
import { renderHtml } from "../src/render/html.js";

/** The policy as a map of directive -> sources. */
const POLICY = Object.fromEntries(
  SECURITY_HEADERS["content-security-policy"].split("; ").map((directive) => {
    const [name, ...sources] = directive.split(" ");
    return [name, sources];
  }),
);

test("the page's own inline styles and fonts are allowed, and nothing else is", () => {
  assert.deepEqual(POLICY["default-src"], ["'self'"]);
  // Every stylesheet on this site is inlined in a <style>, and elements carry
  // style="…"; without 'unsafe-inline' the site renders as unstyled markup.
  assert.ok(POLICY["style-src"].includes("'unsafe-inline'"));
  assert.ok(POLICY["style-src"].includes("https://fonts.googleapis.com"));
  assert.ok(POLICY["font-src"].includes("https://fonts.gstatic.com"));
  // The figures' filters and the case-study plates are inline SVG with data: URIs.
  assert.ok(POLICY["img-src"].includes("data:"));
});

test("scripts are this origin's, plus the one handler the résumé has", () => {
  assert.ok(POLICY["script-src"].includes("'self'"));
  assert.ok(
    !POLICY["script-src"].includes("'unsafe-inline'"),
    "'unsafe-inline' in script-src would make the whole policy decoration",
  );

  // The hash has to be of the handler the résumé actually renders. Read it out
  // of the page rather than trusting the constant: they drift silently, and the
  // only symptom is a print button that stops working.
  const html = renderHtml({
    name: "Ryan Schumacher",
    contact: {},
    highlights: [],
    experience: [],
    skills: [],
    community: [],
    education: [],
  });
  const handler = /onclick="([^"]+)"/.exec(html);
  assert.ok(handler, "the résumé no longer has an inline handler — drop the hash");
  const digest = createHash("sha256").update(handler[1]).digest("base64");
  assert.ok(
    POLICY["script-src"].includes(`'sha256-${digest}'`),
    `the policy does not allow ${handler[1]} — recompute the hash in src/headers.js`,
  );
  assert.ok(POLICY["script-src"].includes("'unsafe-hashes'"), "a hash alone does not cover a handler");
});

test("the directives that close the doors are absolute", () => {
  assert.deepEqual(POLICY["base-uri"], ["'none'"]);
  assert.deepEqual(POLICY["form-action"], ["'none'"]);
  assert.deepEqual(POLICY["object-src"], ["'none'"]);
  assert.deepEqual(POLICY["frame-ancestors"], ["'self'"]);
});

test("responses carry the rest of the floor", () => {
  const hardened = harden(new Response("hi", { headers: { "content-type": "text/plain" } }));
  assert.equal(hardened.headers.get("x-content-type-options"), "nosniff");
  assert.equal(hardened.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  assert.equal(hardened.headers.get("content-type"), "text/plain");
});

test("a redirect is hardened too, immutable headers and all", () => {
  // Response.redirect() returns headers that cannot be set on, which is why
  // harden() builds a new Response rather than mutating one.
  const hardened = harden(Response.redirect("https://aboldnewlook.com/", 301));
  assert.equal(hardened.status, 301);
  assert.equal(hardened.headers.get("location"), "https://aboldnewlook.com/");
  assert.match(hardened.headers.get("content-security-policy"), /default-src 'self'/);
});

test("a handler that sets its own header keeps it", () => {
  const hardened = harden(
    new Response("", { headers: { "referrer-policy": "no-referrer" } }),
  );
  assert.equal(hardened.headers.get("referrer-policy"), "no-referrer");
});

test("the status and the body survive hardening", async () => {
  const hardened = harden(new Response("Not found\n", { status: 404 }));
  assert.equal(hardened.status, 404);
  assert.equal(await hardened.text(), "Not found\n");
});
