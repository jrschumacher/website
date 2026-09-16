// The parts of the homepage that are records rather than voice.
//
// Section I's prose and its "field —" line are the design's copy and stay in
// the page. What the résumé database actually knows — who to write to, and what
// the current role is — is read from D1 here so it cannot drift from /resume.
//
// The homepage renders without this: if the read fails, the caller falls back
// to the data file. A D1 hiccup should cost the page its freshest facts, not
// its existence.

import { loadBacklog } from "../resume/db.js";

/** `github.com/x` and `linkedin.com/in/x` are stored bare; email needs a scheme. */
function href(key, value) {
  if (key === "email") return `mailto:${value}`;
  return `https://${value}`;
}

const ORDER = ["email", "github", "linkedin"];

/**
 * @returns {Promise<{contact: {label:string,value:string,href:string}[], now: string|null}>}
 */
export async function loadJournalFacts(DB) {
  const { profile, roles, companies } = await loadBacklog(DB);

  const values = new Map(
    profile.filter((r) => r.section === "contact").map((r) => [r.key, r.value]),
  );
  const contact = ORDER.filter((k) => values.get(k)).map((k) => ({
    label: k,
    value: values.get(k),
    href: href(k, values.get(k)),
  }));

  // "present" is the résumé's own marker for the role still being held.
  const current = roles.find((r) => r.end === "present");
  const company = current && companies.find((c) => c.key === current.company_key);
  const now = current
    ? `now — ${[current.title, company?.display].filter(Boolean).join(", ").toLowerCase()}`
      + (company?.location ? ` · ${company.location.toLowerCase()}` : "")
    : null;

  return { contact, now };
}
