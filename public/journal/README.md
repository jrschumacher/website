# `public/journal/` — the field-journal modules

These files are imported two ways, and that is deliberate.

- **The Worker imports them** (`src/render/journal.js` → `../../public/journal/…`)
  so the homepage is server-rendered: full markup, full figures, no blank frame
  while a script boots.
- **The browser imports them** from `/journal/…`, because `[assets]` in
  `wrangler.toml` serves this directory verbatim. `page.js` re-runs the same
  builders to redraw The Range when a skill family is expanded.

One copy of the geometry, two consumers, and still no build step. Nothing in
here may touch `window` or `env` at module scope — the Worker evaluates it too.

| file | what it is |
| ---- | ---------- |
| `data/site.js`      | site content: sections, case studies, notes, talks, contact |
| `data/range.js`     | figure data: 6 families, 46 skills, 11 role ridges, 2 projects |
| `esc.js`            | HTML escaping, the one thing every builder needs |
| `figures/range.js`  | fig. 3 — the range (skill terrain) |
| `figures/growth.js` | fig. 7 — the growth (radial, scroll-revealed) |
| `page.js`           | the only client script: scroll-spy, accordion, reveal |

Everything client-side is an enhancement. With JavaScript off the page still
renders: the index is a list of anchors, The Range draws with its families
folded, The Growth shows its finished silhouette, and the talk stack shuffles on
`:checked` alone.
