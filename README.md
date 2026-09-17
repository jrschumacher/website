# aboldnewlook.com

The public site: Ryan Schumacher's field record on the homepage, a blog, and the
résumé the record is drawn from.

One Cloudflare Worker. Server-rendered HTML, no framework, no build step.
`wrangler deploy` is the whole pipeline.

## Routes

| Route         | What it is                                                   |
| ------------- | ------------------------------------------------------------ |
| `/`           | The field record — prose, two figures, case studies, talks    |
| `/blog`       | Index of live posts, newest first                             |
| `/blog/:slug` | One post, markdown rendered to HTML                           |
| `/resume`     | The résumé, assembled from D1 for `DEFAULT_TARGET`            |
| `/resume.txt` | The same résumé as plain text (the LinkedIn-paste copy)       |

Anything else is a 404. Anything that is not `GET`/`HEAD` is a 405.

The homepage used to be the résumé; it moved to `/resume` when the field record
took the root. Both still render from the same D1 tables and the same assembler.

## The homepage

A watercolour field journal: a sticky roman-numeral index beside one long page
of seven sections. Section II is **The Growth**, a radial figure that grows
chapter by chapter as you scroll — fixed compass bearings, radius as time from
2003 at the centre. Section III is **The Range**, the same twenty-three years as
terrain: skills hold fixed columns, each role raises a ridge at the year it
began, and peak height is how long that skill stayed under his hands.

Both figures are inline SVG generated in code, with `feTurbulence` +
`feDisplacementMap` giving the fills a pigment edge. Content comes from two data
files; adding a talk, a note or a case study needs no markup change.

### Where the code lives

```
src/render/journal.js        the page: sections, index, talk stack, colophon
src/render/journal-css.js    the field-journal stylesheet
src/render/diagrams.js       the two case-study plates (static SVG)
public/journal/              the figure modules — see the README in there
```

`public/journal/` is the one unusual thing in this repo, and it is deliberate:
those modules are imported **both** by the Worker (so the homepage is fully
server-rendered, figures included) and by the browser from `/journal/…`, since
`[assets]` serves that directory verbatim. One copy of the geometry, two
consumers, still no build step.

### JavaScript

`public/journal/page.js` is the only script on the site, and everything it does
is an addition to a page that already renders. With it off: the index is a list
of anchors, The Range draws with its skill families folded, The Growth shows its
finished silhouette, and the talk stack still shuffles — that last one runs on
`:checked` and a generated block of CSS, no script at all. What the script adds
is the scroll-spy, the accordion, and the chapter-by-chapter reveal.

Scrolling never rebuilds a node. The Growth is drawn once in every state and the
scroll handler only changes attributes; The Range rebuilds its plate only when a
family is expanded, because that is the one gesture that moves a column. Both
rules exist for the same reason: re-parsing the SVG restarts two `feTurbulence`
filters over the whole figure, and that is felt.

### Still open, by design

The portrait is in: `public/portrait.jpg`, 900×900, sized so it stays sharp at
3× in a 232×280 frame. To replace it, overwrite that file — `src/portrait.js`
asks the assets binding for `portrait.jpg`, `.jpeg`, `.png` or `.webp` in turn,
once per isolate, so a different extension works too and no code changes.
`PORTRAIT` in `src/config.js` is only an override, for a filename those four
candidates miss or an image hosted elsewhere.

Two things the design handoff marked unfinished, left unfinished here:

- **The talks** in `public/journal/data/site.js` are placeholders with no decks
  to link to. A talk with an empty `href` renders as a dead front card on
  purpose — give it an `href` and the card becomes a link.
- **The field notes** are placeholder prose, and the section is hand-written
  rather than fed from the blog. Wiring section V to the `personal-blog` D1
  shelf is the obvious next move, but it is a content decision, not a code one.

Two details from the prototype are deliberately *not* carried over: the empty
"fig. 5 — the streams" caption, which framed a plate that does not exist, and
the per-case-study "read the full entry →" link, which pointed nowhere. Both
read as broken on a live site rather than as unfinished.

## Data

Two D1 bindings, both read-only from this Worker:

- **`RESUME` → `resume-public`** (`e82ee3ed-53a8-4273-b98b-479ac30896fd`)
  The public résumé tables — `profile`, `companies`, `roles`,
  `accomplishments`, `targets` — split out of the `resume-backlog` database
  that the private [resume Worker](https://github.com/jrschumacher/resume)
  uses. That database also holds job-hunt data; the split exists so this Worker
  has no binding that could reach it.
  `db/0001_seed_public_resume.sql` is the one-time copy that seeded it. It is
  refreshed hourly by a cron in the private [resume
  Worker](https://github.com/jrschumacher/resume) (`src/publish.js`), which is
  the only thing that writes here. For months nothing did: that Worker had no
  binding to this database, so the two diverged in silence and every bullet
  written after the split went somewhere this site could not read.

  The direction is deliberate and one-way. The private Worker reaches in here;
  this Worker has no binding that could reach the backlog, which is the whole
  point of the split. Do not add one.

  A bullet appears here only if it is tagged `public` in the backlog — untagged
  means unpublished, so a missed tag leaves the page stale rather than leaking.
  Neither notes column is ever copied, and `roles.note` on this side is curated
  by hand and survives a publish.

- **`BLOG` → `personal-blog`** (`2aec93a1-cc30-4480-b3e7-31611f15f2bf`)
  The published shelf, written by a Cairn publish step. A post is visible here
  only when `went_live_at IS NOT NULL AND archived = 0`.

A post with `finalized_at` still NULL is a *living* post: it is marked as such,
and its `revisions` notes are listed at the end of the page so a returning
reader can see what changed.

The figures do **not** read from D1. `public/journal/data/range.js` is a
separate, hand-shaped record — 6 skill families, 46 skills, 11 role ridges, 2
personal projects — and its schema is documented in the file.

## Résumé assembly

`src/scope.js`, `src/format.js`, `src/render/{html,text,css}.js` are ported from
`jrschumacher/resume` — same scoring algorithm, same markup, same stylesheet.
A *target* (a role archetype such as `principal-security`) supplies the
headline, summary, and the include/boost/exclude tag rules that decide which
accomplishments appear and in what order. `/resume` renders one target, named
in `src/config.js`:

```js
export const DEFAULT_TARGET = "principal-security";
```

Change that string to re-point the page.

## Stylesheets

Three, because the three things want different paper:

- `src/render/journal-css.js` — the homepage.
- `SITE_STYLESHEET` in `src/render/css.js` — the blog and the 404, in the same
  palette the homepage introduced.
- `RESUME_STYLESHEET` in `src/render/css.js` — `/resume`, still the résumé
  stylesheet ported verbatim from `jrschumacher/resume`, unchanged in its résumé
  rules. It is a document meant to print on Letter, and it stays one.

## Develop

```sh
npm install
npm run dev
npm test          # markdown renderer unit tests
npm run deploy
```

## The domain

`aboldnewlook.com` is live and served by this Worker. It is attached with
**routes**, not a custom domain, and that is deliberate:

```toml
[[routes]]
pattern = "aboldnewlook.com/*"
zone_name = "aboldnewlook.com"
```

The apex already has proxied A/AAAA records pointing at an nginx origin that
redirects to ruster.me. A Worker custom domain would require deleting those
records; a route intercepts the request ahead of the origin and leaves DNS
untouched — so removing those two stanzas restores the previous behaviour
exactly. `www` redirects to the apex in the Worker.

(An earlier version of this file said the domain was on Google Domains
nameservers and could not be attached at all. That stopped being true when the
zone moved to Cloudflare and the routes went in.)

## `npm test` is not in CI

Cloudflare Workers Builds runs the deploy, and nothing runs `npm test` on push.
That is worth fixing: a branch can be green in the dashboard while its tests
fail, which is exactly how three decks referenced by `src/talks/registry.js`
came to be missing from git without anyone noticing.
