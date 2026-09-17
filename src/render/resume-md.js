// Markdown renderer for the résumé — /resume.md.
//
// The same assembled structure /resume and /resume.txt are built from, in the
// format a machine reading this site is most likely to want. /resume.txt is
// still there and still plain: it is the LinkedIn-paste artifact, and its
// shape is load-bearing for that. This one is for anything that parses.
//
// Nothing here is invented. Every line comes from the assembled résumé, and a
// section with no rows is omitted rather than printed empty.

/** Render the assembled résumé to Markdown. */
export function renderResumeMarkdown(resume) {
  const out = [];

  if (resume.name) out.push(`# ${resume.name}`);
  if (resume.headline) out.push("", `> ${resume.headline}`);

  const contact = [
    resume.contact.email ? `<${resume.contact.email}>` : "",
    resume.contact.github,
    resume.contact.linkedin,
  ].filter(Boolean);
  if (contact.length) out.push("", contact.join(" · "));

  if (resume.summary) out.push("", resume.summary);

  if (resume.highlights.length) {
    out.push("", "## Key impact highlights", "");
    for (const h of resume.highlights) out.push(`- ${h}`);
  }

  if (resume.experience.length) {
    out.push("", "## Experience");
    for (const company of resume.experience) {
      const loc = company.location ? ` — ${company.location}` : "";
      out.push("", `### ${company.display}${loc}`);
      for (const role of company.roles) {
        const note = role.note ? ` (${role.note})` : "";
        const dates = role.dateRange ? ` · ${role.dateRange}` : "";
        out.push("", `**${role.title}**${dates}${note}`, "");
        for (const b of role.bullets) out.push(`- ${b}`);
      }
    }
  }

  if (resume.skills.length) {
    out.push("", "## Skills", "");
    for (const s of resume.skills) out.push(`- **${s.category}:** ${s.value}`);
  }

  if (resume.community.length) {
    out.push("", "## Community", "");
    for (const c of resume.community) out.push(`- ${c}`);
  }

  if (resume.education.length) {
    out.push("", "## Education", "");
    for (const ed of resume.education) out.push(`- ${ed.school} — ${ed.degree}`);
  }

  return out.join("\n") + "\n";
}
