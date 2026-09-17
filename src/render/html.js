// Résumé HTML renderer — server-rendered from the assembled structure.
// Ported from jrschumacher/resume (src/render/html.js). Two edits to the ported
// markup: the document shell now comes from layout.js so the résumé and the
// blog share one <head> and one nav, and the masthead carries the actions block
// (screen puts it top-right by grid placement). Print is untouched: the actions
// are display:none there and the masthead is the centred stack it always was.

import { escapeHtml } from "../format.js";
import { layout } from "./layout.js";
import { RESUME_STYLESHEET } from "./css.js";

const e = escapeHtml;

function contactLine(contact) {
  const parts = [];
  if (contact.email)
    parts.push(`<a href="mailto:${e(contact.email)}">${e(contact.email)}</a>`);
  if (contact.github)
    parts.push(`<a href="https://${e(contact.github)}">${e(contact.github)}</a>`);
  if (contact.linkedin)
    parts.push(`<a href="https://${e(contact.linkedin)}">${e(contact.linkedin)}</a>`);
  return parts.join(" &middot; ");
}

function bulletList(items) {
  // A role can have no bullets yet — a promotion lands before the writing does.
  // An empty <ul> would still take its margin and read as a missing paragraph.
  if (!items.length) return "";
  return `<ul>${items.map((b) => `<li>${e(b)}</li>`).join("")}</ul>`;
}

function highlightsSection(highlights) {
  if (!highlights.length) return "";
  return `<section class="highlights">
      <h2 class="section-title">Key Impact Highlights</h2>
      ${bulletList(highlights)}
    </section>`;
}

function experienceSection(experience) {
  if (!experience.length) return "";
  const companies = experience
    .map((company) => {
      const roles = company.roles
        .map((role) => {
          const note = role.note ? ` <span class="role-note">(${e(role.note)})</span>` : "";
          return `<div class="role">
            <div class="role-line">
              <span><span class="role-title">${e(role.title)}</span>${note}</span>
              <span class="role-dates">${e(role.dateRange)}</span>
            </div>
            ${bulletList(role.bullets)}
          </div>`;
        })
        .join("");
      const loc = company.location
        ? `<span class="company-loc">${e(company.location)}</span>`
        : "";
      return `<div class="company">
          <div class="company-line">
            <span class="company-name">${e(company.display)}</span>
            ${loc}
          </div>
          ${roles}
        </div>`;
    })
    .join("");
  return `<section class="experience">
      <h2 class="section-title">Experience</h2>
      ${companies}
    </section>`;
}

function skillsSection(skills) {
  if (!skills.length) return "";
  const rows = skills
    .map(
      (s) =>
        `<div class="skills-row"><span class="cat">${e(s.category)}:</span> ${e(s.value)}</div>`,
    )
    .join("");
  return `<section class="skills">
      <h2 class="section-title">Skills</h2>
      ${rows}
    </section>`;
}

function communitySection(community) {
  if (!community.length) return "";
  return `<section class="community">
      <h2 class="section-title">Community</h2>
      ${bulletList(community)}
    </section>`;
}

function educationSection(education) {
  if (!education.length) return "";
  const rows = education
    .map(
      (ed) =>
        `<div class="education-row"><span class="school">${e(ed.school)}</span><span class="degree">${e(ed.degree)}</span></div>`,
    )
    .join("");
  return `<section class="education">
      <h2 class="section-title">Education</h2>
      ${rows}
    </section>`;
}

/**
 * Print, and the machine-readable copies.
 *
 * No PDF generator: the stylesheet already carries `@page`, Letter geometry and
 * the break rules, so the browser's own print path produces the artefact. It is
 * also the only way to get a PDF that is not styled like the rest of the site,
 * which is the point — this one is read by recruiters and parsers.
 */
/**
 * The other renderings of this document: the printed one, and the plain-text
 * one. They sit in the masthead rather than in the site nav, because they are
 * this page's business and no other page's.
 */
function actions() {
  return `<div class="resume-actions">
    <button type="button" onclick="window.print()">print / save as pdf</button>
    <a href="/resume.txt">plain text</a>
  </div>`;
}

/** The résumé's inner markup, without the document shell. */
export function resumeBody(resume) {
  return `<header class="masthead">
    <h1 class="name">${e(resume.name)}</h1>
    ${actions()}
    ${resume.headline ? `<div class="headline">${e(resume.headline)}</div>` : ""}
    <div class="contact">${contactLine(resume.contact)}</div>
  </header>
  ${resume.summary ? `<p class="summary">${e(resume.summary)}</p>` : ""}
  ${highlightsSection(resume.highlights)}
  ${experienceSection(resume.experience)}
  ${skillsSection(resume.skills)}
  ${communitySection(resume.community)}
  ${educationSection(resume.education)}`;
}

/** Render the assembled résumé to a full HTML document. */
export function renderHtml(resume) {
  return layout({
    title: resume.name || "Résumé",
    description: resume.headline || undefined,
    current: "resume",
    stylesheet: RESUME_STYLESHEET,
    // The same résumé, for anything that would rather parse than render.
    head: `<link rel="alternate" type="text/markdown" href="/resume.md" title="Résumé (Markdown)">`,
    body: resumeBody(resume),
  });
}
