// aboldnewlook — site content. Add talks/notes/case studies here; the page renders whatever is listed.
export const sections = [
  { id: 'about', num: 'I', label: 'the practitioner' },
  { id: 'growth', num: 'II', label: 'the growth' },
  { id: 'figures', num: 'III', label: 'the figures' },
  { id: 'work', num: 'IV', label: 'case studies' },
  { id: 'notes', num: 'V', label: 'field notes' },
  { id: 'talks', num: 'VI', label: 'talks' },
  { id: 'contact', num: 'VII', label: 'contact' },
];

export const caseStudies = [
  { num: '01', kicker: 'VIRTRU \u00b7 2024 \u00b7 PLATFORM', title: 'The monolith, reconsidered', tint: '#16484c',
    story: 'OpenTDF ran as polyglot microservices \u2014 fine on Kubernetes, impossible in an air gap. Over three months the services were refolded into a Go modular monolith: one binary, module seams kept honest, deployable anywhere a process can run.',
    story2: 'The air gap was the forcing function: no Kubernetes, no sidecar mesh, no shared cloud services \u2014 just a process on a machine someone else controls. An admin CLI shipped in weeks where a web console would have taken months.',
    statBig: '3 months', statNote: 'polyglot fleet \u2192 one Go binary',
    figCaption: 'fig. a \u2014 twelve services, folded to one', diagram: 'consolidate',
    facts: ['3 months \u00b7 polyglot \u2192 one Go binary', 'unlocked air-gapped deployments beyond k8s', 'admin CLI over web UI \u2014 shipped in weeks, not months'], },
  { num: '02', kicker: 'VIRTRU \u00b7 2021\u20132024 \u00b7 GROWTH', title: 'Branding, self-served', tint: '#b3703a',
    story: 'Custom branding was a services engagement: slow, manual, gated on engineers. Making it self-service turned a bottleneck into a product surface \u2014 customers themed their own deployments the day they asked.',
    story2: 'The full entry will cover the theming pipeline, the guardrails that kept brand assets safe, and why the sales curve bent the quarter it launched.',
    statBig: '+650%', statNote: 'sales on the branded tier \u00b7 +5% ARR',
    figCaption: 'fig. b \u2014 custom branding: four hops and weeks of waiting, folded to one hop, same day', diagram: 'selfserve',
    facts: ['+650% sales on the branded tier', '+5% company ARR', 'zero engineer-hours per customer after launch'], },
];

export const notes = [
  { date: '2026-08', title: 'On tearing down twelve services', excerpt: 'The argument for the monolith was never elegance \u2014 it was custody: of keys, of deploys, of the air gap. Elegance arrived later, uninvited\u2026' },
  { date: '2026-06', title: 'What the homelab taught the platform', excerpt: 'Everything the rack does badly at 2 a.m., the platform will do badly at scale. Field conditions first, architecture second\u2026' },
];

// point a talk's href at its deck page when one exists
export const talks = [
  { year: '2026', title: 'Keys, custody, and the air gap', venue: 'venue tbd', href: '' },
  { year: '2025', title: 'OIDC as the universal identity layer', venue: 'venue tbd', href: '' },
  { year: '2024', title: 'The modular monolith, revisited', venue: 'venue tbd', href: '' },
];

export const contact = [
  { label: 'email', value: 'j.r.schumacher@gmail.com', href: 'mailto:j.r.schumacher@gmail.com' },
  { label: 'github', value: 'github.com/jrschumacher', href: 'https://github.com/jrschumacher' },
  { label: 'linkedin', value: 'linkedin.com/in/jrschumacher', href: 'https://linkedin.com/in/jrschumacher' },
];
