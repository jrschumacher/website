// Simulated skill-terrain data — the range. Skills are ordered columns (x-axis);
// each ridge is a role or personal project. use: { skillId: [fractionOfRoleTouched, intensity 1-3] }.
// Peak height = fraction × role span, drawn in real years. All simulated, shaped by resume.txt.
//
// This file is NOT fed from the resume-public database, and cannot be as it
// stands. Two things it needs are not there: ridges are finer-grained than the
// résumé's roles (one D1 row, "Co-founder / Engineering Lead 2009–2018", is
// three ridges here, and the 2003–2009 student roles are not in D1 at all), and
// nothing in D1 records which skills a role touched or how deeply — the `use`
// maps below, which are what actually draws the peaks. Wiring the figures to
// real data means a skills-per-role table first.
//
// Divergence from the handoff bundle: every role ridge from 2003 to 2019 has
// been rebuilt from the record — three résumés (2007, ~2015, current), the
// LinkedIn history and Ryan directly — and the vr-dir ridge relabelled for the
// Jan 2026 and Aug 2026 promotions. The handoff's invented ridges are gone: a
// university job at Temple that never happened, and a web-agency-then-startup-
// then-consultancy decade that was really one company with two spin-offs. The
// skill columns, the geometry and the Virtru-era numbers are still the
// handoff's.
export const fams = [
  { id: 'sys',  name: 'systems & ops' },
  { id: 'lang', name: 'languages' },
  { id: 'web',  name: 'web & frontend' },
  { id: 'plat', name: 'platform' },
  { id: 'sec',  name: 'security & identity' },
  { id: 'lead', name: 'leadership & product' }
];
export const skills = [
  { id: 'linux', name: 'linux', fam: 'sys' },
  { id: 'bash', name: 'bash', fam: 'sys' },
  { id: 'perl', name: 'perl', fam: 'sys' },
  { id: 'networking', name: 'networking', fam: 'sys' },
  { id: 'onprem', name: 'on-prem deploy', fam: 'sys' },
  { id: 'virtualization', name: 'virtualization', fam: 'sys' },
  { id: 'mysql', name: 'mysql', fam: 'sys' },
  { id: 'postgres', name: 'postgres', fam: 'sys' },
  { id: 'docker', name: 'docker', fam: 'sys' },
  { id: 'kubernetes', name: 'kubernetes', fam: 'sys' },
  { id: 'terraform', name: 'terraform', fam: 'sys' },
  { id: 'cicd', name: 'ci/cd', fam: 'sys' },
  { id: 'observability', name: 'observability', fam: 'sys' },
  { id: 'c', name: 'c', fam: 'lang' },
  { id: 'php', name: 'php', fam: 'lang' },
  { id: 'python', name: 'python', fam: 'lang' },
  { id: 'ruby', name: 'ruby', fam: 'lang' },
  { id: 'nodejs', name: 'node.js', fam: 'lang' },
  { id: 'go', name: 'go', fam: 'lang' },
  { id: 'typescript', name: 'typescript', fam: 'lang' },
  { id: 'htmlcss', name: 'html/css', fam: 'web' },
  { id: 'jquery', name: 'jquery', fam: 'web' },
  { id: 'angular', name: 'angular', fam: 'web' },
  { id: 'react', name: 'react', fam: 'web' },
  { id: 'microfrontends', name: 'microfrontends', fam: 'web' },
  { id: 'designsys', name: 'design systems', fam: 'web' },
  { id: 'rest', name: 'rest apis', fam: 'plat' },
  { id: 'graphql', name: 'graphql', fam: 'plat' },
  { id: 'sdk', name: 'sdk design', fam: 'plat' },
  { id: 'cli', name: 'cli tooling', fam: 'plat' },
  { id: 'eventdriven', name: 'event-driven', fam: 'plat' },
  { id: 'monorepo', name: 'monorepo', fam: 'plat' },
  { id: 'saas', name: 'saas multi-tenant', fam: 'plat' },
  { id: 'tlspki', name: 'tls / pki', fam: 'sec' },
  { id: 'oidc', name: 'oidc / oauth', fam: 'sec' },
  { id: 'crypto', name: 'crypto & keys', fam: 'sec' },
  { id: 'fedramp', name: 'fedramp', fam: 'sec' },
  { id: 'abac', name: 'abac policy', fam: 'sec' },
  { id: 'dataprivacy', name: 'data privacy', fam: 'sec' },
  { id: 'mentorship', name: 'mentorship', fam: 'lead' },
  { id: 'hiring', name: 'hiring', fam: 'lead' },
  { id: 'strategy', name: 'strategy', fam: 'lead' },
  { id: 'productcollab', name: 'product collab', fam: 'lead' },
  { id: 'orgdesign', name: 'org design', fam: 'lead' },
  { id: 'oss', name: 'oss stewardship', fam: 'lead' },
  { id: 'aigov', name: 'ai governance', fam: 'lead' }
];
export const ridges = [
  // Perfect Worldwide Network Host, Nov 2003 – Dec 2004. From the Jun 2007
  // résumé; it is on no other record, LinkedIn included.
  { id: 'pwnh', kind: 'role', company: 'Perfect Worldwide Network Host', title: 'Co-Owner', label: 'perfect worldwide · co-owner', start: 2003.85, end: 2004.95, color: '#6b7f6a',
    record: ['Co-owned a web host as an undergraduate — sales plans, finances, and the meetings.',
      'Ran the server and the customer and staff accounts; troubleshot whatever broke.',
      'Built the sites too: PHP, MySQL, and the graphics.'],
    story: 'A web host, co-owned at nineteen. The first time the whole stack and the whole business were the same job — sales in the morning, PHP and a MySQL schema in the afternoon.',
    use: { php: [0.9, 2], mysql: [0.8, 2], htmlcss: [0.9, 2], linux: [0.7, 2], onprem: [0.6, 2], strategy: [0.5, 1] } },
  // Freelance. Started Aug 2000 per the 2015-era résumé, which is earlier than
  // this chart begins — the ridge is clipped to the 2003 floor, and the record
  // says so rather than pretending the work started with the axis.
  { id: 'freelance', kind: 'role', company: 'Freelance', title: 'Freelancer', label: 'freelance', start: 2003.0, end: 2009.1, color: '#7d6b4f',
    record: ['Freelance from Aug 2000 — consulting, site and logo design, small applications — run alongside the university job and the degree.',
      'Joined existing projects, refactored others outright, across languages and time zones.',
      'Published a handful of open-source projects and contributed to close to a hundred more.'],
    story: 'Freelance, from before this chart starts. Consulting and small builds alongside the university job and the degree, and the beginning of a long open-source habit — the ridge is clipped at 2003 because the axis is, not because the work was.',
    use: { htmlcss: [0.5, 2], php: [0.45, 2], oss: [0.4, 2], mysql: [0.3, 1], linux: [0.25, 1] } },
  // Real, from the résumé: Information Technology Specialist III, Auburn
  // University, Feb 2005 – Feb 2009. The handoff had this as 'Student sysadmin'
  // 2003.6–2007.5, which was neither the title nor the span.
  { id: 'auburn', kind: 'role', company: 'Auburn University', title: 'Information Technology Specialist III', label: 'auburn · it specialist iii', start: 2005.1, end: 2009.1, color: '#6f7d4a',
    record: ['Head system administrator for the Linux-based servers at Auburn University.',
      'Operating systems, Oracle servers, and enterprise hardware — maintained and tuned.',
      'Wrote the monitoring and security-compliance scripts, and kept the patch cadence that closed the vulnerabilities.'],
    story: 'Head Linux sysadmin at Auburn, run alongside the CS degree. Everything was on the machine in front of you: the servers, the Oracle boxes, the scripts that watched them.',
    use: { linux: [1, 3], bash: [1, 2], perl: [0.92, 3], networking: [0.7, 2], onprem: [1, 3], mysql: [0.6, 2], php: [0.5, 2], htmlcss: [0.4, 1], c: [0.3, 1] } },
  // The ventures, as they actually were. The handoff had this decade as three
  // sequential ridges — a web agency, then a product startup, then a
  // consultancy — which is not what happened. 38pages / tep.io ran the whole
  // ten years and Outfit Outdoors and Hatch Safety were spun out of it, so
  // these overlap rather than follow one another. Skill maps are read off the
  // résumé bullets and the skill chips on each role, not invented.
  { id: 'tepio', kind: 'role', company: '38pages / tep.io', title: 'Co-Founder / Partner / CTO', label: 'tep.io · co-founder / cto', start: 2009.1, end: 2019.5, color: '#b3703a',
    record: ['Co-founded tep.io; drove technical vision and product development as CTO for a decade.',
      'Built a comprehensive ERM solution for a major fitness franchise — CRM, POS and scheduling in one.',
      'Turnkey migrations for educational institutions, and the agile practice that made them repeatable.',
      'Spun off Outfit Outdoors and Hatch Safety, staying partner and CTO of the parent through both.'],
    story: 'The long one. Ten years of client and product work under one roof, PHP and MySQL at the start, Node by the end — and the parent company that Outfit Outdoors and Hatch Safety were spun out of.',
    // Fractions are deliberately conservative. Peak height is fraction x span,
    // so on a ten-year ridge every tenth of a point is a year of drawn height —
    // the same 0.8 that reads as "most of it" on a two-year role would tower
    // over the whole chart here. Nothing was used continuously for a decade.
    use: { php: [0.4, 3], mysql: [0.45, 2], htmlcss: [0.4, 2], nodejs: [0.4, 2], rest: [0.35, 2], jquery: [0.25, 2], linux: [0.3, 1], angular: [0.2, 1], strategy: [0.55, 2], productcollab: [0.45, 2], hiring: [0.3, 1], mentorship: [0.3, 1] } },
  { id: 'bhamvoice', kind: 'role', company: 'The Birmingham Voice', title: 'Co-founder / Director of Operations', label: 'the birmingham voice · ops', start: 2011.1, end: 2013.9, color: '#8a5a33',
    record: ['Co-founded a street paper — NASNA member — to give the voiceless a byline and the unemployed a job.',
      'Built the in-house software that managed vendors and contributors.',
      'Trained and ran a workforce of more than twenty vendors.'],
    story: 'The one that was not a software job. Running a street paper taught operations and people at a scale no engineering role had yet — and still needed software, so it got built.',
    use: { nodejs: [0.7, 2], htmlcss: [0.5, 1], mysql: [0.4, 1], orgdesign: [0.6, 2], hiring: [0.5, 2], strategy: [0.5, 1], productcollab: [0.4, 1] } },
  { id: 'outfit', kind: 'role', company: 'Outfit Outdoors', title: 'Co-Founder / CTO', label: 'outfit outdoors · cto', start: 2014.9, end: 2016.5, color: '#a04b28',
    record: ['Co-founded a real-time social network and led its design and architecture as CTO.',
      'Shipped a monolith first, then refactored to microservices once the shape was known.',
      'Grew it to 1,000 daily and 15,000 total users with a team of three.'],
    story: 'Spun out of tep.io. A real-time social network: monolith first, microservices once it was earned — the same instinct that later refolded a service fleet back into one binary.',
    use: { nodejs: [0.95, 3], rest: [0.8, 2], htmlcss: [0.5, 1], angular: [0.4, 1], mysql: [0.4, 1], eventdriven: [0.35, 1], strategy: [0.6, 2], hiring: [0.4, 1], productcollab: [0.5, 1], mentorship: [0.4, 1] } },
  { id: 'hatch', kind: 'role', company: 'Hatch Safety Inc', title: 'Co-Founder / CTO', label: 'hatch safety · cto', start: 2016.0, end: 2019.5, color: '#9c6b2f',
    record: ['Co-founded an enterprise safety platform built around OSHA and MSHA compliance.',
      'Led product development with business analysts, turning client need into workable use cases.',
      'Shipped predictive features that measurably cut organisational safety costs.'],
    story: 'Also spun out of tep.io, and the first time compliance was the product rather than a constraint on it — a decade before FedRAMP and air-gapped deployment became the day job.',
    use: { nodejs: [0.85, 2], angular: [0.8, 2], rest: [0.6, 2], mysql: [0.5, 1], htmlcss: [0.4, 1], productcollab: [0.8, 2], strategy: [0.6, 2] } },
  { id: 'bbva', kind: 'role', company: 'BBVA USA', title: 'Lead engineer', start: 2017.2, end: 2019.45, color: '#46628c',
    record: ['Led a team supporting 5,000+ daily active users.',
      'Migrated a legacy application to microfrontends, increasing team velocity by 75%.'],
    story: 'Lead engineer. Microfrontends at bank scale — the first ridge where the people-skills carry real width of their own.',
    use: { microfrontends: [0.85, 3], react: [0.6, 2], designsys: [0.65, 2], cicd: [0.5, 1], mentorship: [0.75, 2], hiring: [0.5, 1], strategy: [0.5, 1], monorepo: [0.4, 1], typescript: [0.55, 1], nodejs: [0.4, 1] } },
  { id: 'vr-senior', kind: 'role', company: 'Virtru', title: 'Senior full stack', start: 2019.45, end: 2020.7, color: '#56957e',
    record: ['Solution architect for a prospective customer — the work that led to the company’s first net-new ARR.'],
    story: 'Back to the keyboard at a data-security company: TypeScript, React, and first contact with applied crypto and privacy engineering.',
    use: { nodejs: [0.8, 2], typescript: [0.9, 2], react: [0.7, 2], rest: [0.8, 1], crypto: [0.5, 2], dataprivacy: [0.6, 2], oss: [0.5, 1], graphql: [0.35, 1] } },
  { id: 'vr-staff', kind: 'role', company: 'Virtru', title: 'Staff engineer', start: 2020.7, end: 2021.0, color: '#3f8070',
    record: ['Implemented the binary-spec SDK in TypeScript.',
      'The policy-management web app contributed to a $250k customer upsell.'],
    story: 'A short, sharp ridge — SDK surface work compressed into a few months before the management years.',
    use: { typescript: [1, 2], sdk: [0.85, 2], rest: [0.7, 1], react: [0.6, 2], crypto: [0.4, 1] } },
  { id: 'vr-em', kind: 'role', company: 'Virtru', title: 'Engineering manager', start: 2021.0, end: 2024.0, color: '#2f6b63',
    record: ['Led and mentored 12 engineers; institutionalized cross-team release planning, cutting cycle times from weeks to days.',
      'Delivered a FedRAMP- and GovRAMP-authorized greenfield project to market in 6 months, with 200% YTD growth.',
      'Championed self-service custom branding: +650% sales, +5% ARR.'],
    story: 'Three years of engineering management. The ridge widens rightward — FedRAMP, hiring, org design — while the code peaks thin but never vanish.',
    use: { mentorship: [1, 3], hiring: [0.8, 2], strategy: [0.8, 2], orgdesign: [0.6, 2], productcollab: [0.7, 2], fedramp: [0.55, 3], kubernetes: [0.5, 2], monorepo: [0.5, 2], microfrontends: [0.3, 1], typescript: [0.6, 1], go: [0.3, 1], cicd: [0.4, 1], oss: [0.4, 1], designsys: [0.25, 1] } },
  { id: 'vr-arch', kind: 'role', company: 'Virtru', title: 'Staff architect 2', start: 2024.0, end: 2025.0, color: '#245a58',
    record: ['Refactored OpenTDF from polyglot microservices into a Go modular monolith in 3 months, unlocking air-gapped deployments beyond Kubernetes.',
      'Pushed an admin CLI over a web interface — shipped in weeks instead of months.',
      'Developed the DSP premium platform on OpenTDF, opening 37% net-new growth in company ARR.'],
    story: 'Staff architect. Go, the CLI, the monorepo — a deliberately narrow footprint with tall peaks. Focus over width.',
    use: { go: [0.9, 3], monorepo: [0.8, 2], cli: [0.85, 3], sdk: [0.7, 2], rest: [0.5, 1], kubernetes: [0.4, 1], strategy: [0.5, 1], observability: [0.35, 1] } },
  { id: 'vr-dir', kind: 'role', company: 'Virtru', title: 'Director → VP of Engineering, Platform', label: 'virtru · director → vp of eng', start: 2025.0, end: 2026.65, color: '#16484c',
    record: ['Lead the 12-engineer platform organization behind the Data Security Platform and OpenTDF — airgapped and as distributed SaaS.',
      'Led platform readiness for the first major customer release, anchoring delivery for a $17M client against a ~$42M ARR base.',
      'Established OIDC as the platform’s universal identity layer; DPoP and token-exchange flows for cross-platform handoffs.',
      'Delivered the full key-management modality matrix: Vault-style managed keys, AWS KMS, GCP KMS, and HSM root-key custody.',
      'Drove the strategic case for SaaS dogfooding, securing a dedicated business unit; authored the org’s AI development policy.'],
    story: 'Director of Platform, then Senior Director of Engineering (Jan 2026), then VP of Engineering, Platform (Aug 2026) — one ridge, because the work did not change shape at the title. The widest ridge on the chart: identity, crypto, SaaS, strategy — with honest gaps between peaks where frontend used to be.',
    use: { oidc: [1, 3], crypto: [0.9, 3], abac: [0.75, 2], tlspki: [0.6, 2], sdk: [0.7, 2], saas: [0.9, 3], strategy: [0.9, 2], orgdesign: [0.7, 2], productcollab: [0.6, 2], mentorship: [0.6, 1], hiring: [0.4, 1], aigov: [0.55, 2], cli: [0.45, 1], oss: [0.8, 2], eventdriven: [0.4, 1], observability: [0.3, 1], go: [0.45, 1], kubernetes: [0.3, 1] } },
  { id: 'homelab', kind: 'project', company: '', title: 'Homelab', start: 2008.4, end: 2026.65, color: '#b08b3f',
    story: 'The homelab runs under everything — the connective tissue between roles. Plateaus are settled periods; the shafts between them are the moves. Its on-prem plateau is the last one anywhere: 2014.',
    use: { linux: [0.85, 1], bash: [0.6, 1], networking: [0.7, 1], virtualization: [0.55, 1], onprem: [0.31, 1], docker: [0.5, 1], kubernetes: [0.34, 1], terraform: [0.2, 1], observability: [0.24, 1], postgres: [0.18, 1] },
    plateaus: [
      { skill: 'linux', year: 2008.6, w: 3, label: 'first rack' },
      { skill: 'networking', year: 2009.6, w: 2 },
      { skill: 'virtualization', year: 2011.3, w: 2.5, label: 'esxi cluster' },
      { skill: 'onprem', year: 2013.9, w: 2, label: 'last on-prem touch' },
      { skill: 'docker', year: 2015.6, w: 2.5 },
      { skill: 'postgres', year: 2016.9, w: 1.5 },
      { skill: 'kubernetes', year: 2018.5, w: 3, label: 'k8s at home' },
      { skill: 'terraform', year: 2021.2, w: 1.5 },
      { skill: 'observability', year: 2023.6, w: 2 },
      { skill: 'linux', year: 2025.8, w: 2.5, label: 'still running' }
    ] },
  { id: 'oss-p', kind: 'project', company: '', title: 'OpenTDF & open source', start: 2019.6, end: 2026.65, color: '#b03b1e',
    record: ['Steward of OpenTDF through every Virtru role — the open format under the Data Security Platform.',
      'Begun with nobody asking; still shows up in the day job’s biggest wins.'],
    story: 'OpenTDF and open-source stewardship, running alongside every Virtru role and bleeding into all of them — the red thread.',
    use: { oss: [0.9, 3], go: [0.55, 2], typescript: [0.6, 2], sdk: [0.6, 2], crypto: [0.5, 2], cli: [0.45, 2], oidc: [0.3, 1] },
    plateaus: [
      { skill: 'oss', year: 2019.9, w: 2, label: 'first contribution' },
      { skill: 'typescript', year: 2020.8, w: 2 },
      { skill: 'oss', year: 2021.5, w: 3, label: 'stewardship begins' },
      { skill: 'go', year: 2022.9, w: 2.5 },
      { skill: 'sdk', year: 2024.2, w: 2.5 },
      { skill: 'cli', year: 2024.7, w: 2 },
      { skill: 'crypto', year: 2025.4, w: 2 },
      { skill: 'oidc', year: 2026.1, w: 2.5, label: 'universal identity' }
    ] }
];
export const events = [
  { skill: 'perl', year: 2005.5, ridge: 'auburn', label: 'Campus job scheduler in Perl', impact: 1, note: 'Heavily used at Auburn — untouched since 2009.' },
  { skill: 'onprem', year: 2008.8, ridge: 'auburn', label: 'University rack build-out', impact: 2 },
  { skill: 'microfrontends', year: 2018.3, ridge: 'bbva', label: 'Microfrontends at BBVA', impact: 3 },
  { skill: 'react', year: 2020.85, ridge: 'vr-senior', label: 'Policy web app · $250k', impact: 2 },
  { skill: 'fedramp', year: 2022.4, ridge: 'vr-em', label: 'FedRAMP greenfield', impact: 3 },
  { skill: 'monorepo', year: 2023.3, ridge: 'vr-em', label: 'TS monorepo', impact: 2 },
  { skill: 'go', year: 2024.4, ridge: 'vr-arch', label: 'Monolith refactor', impact: 3 },
  { skill: 'cli', year: 2024.6, ridge: 'vr-arch', label: 'CLI over web UI', impact: 2 },
  { skill: 'oidc', year: 2025.6, ridge: 'vr-dir', label: 'OIDC universal layer', impact: 3 },
  { skill: 'crypto', year: 2025.8, ridge: 'vr-dir', label: 'DPoP', impact: 2 },
  { skill: 'saas', year: 2026.3, ridge: 'vr-dir', label: '$17M client release', impact: 3 },
  { skill: 'cli', year: 2026.4, ridge: 'vr-dir', label: 'MCP on the CLI', impact: 2 }
];
