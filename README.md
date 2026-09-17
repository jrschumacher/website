# aboldnewlook.com

The public site: Ryan Schumacher's field record on the homepage, a blog, and the
résumé the record is drawn from.

One Cloudflare Worker. Server-rendered HTML, no framework, no build step.
`wrangler deploy` is the whole pipeline.

## Routes

| Route          | What it is                                                  |
| -------------- | ----------------------------------------------------------- |
| `/`            | The field record — prose, two figures, case studies, talks   |
| `/work`        | Every case study                                            |
| `/work/:slug`  | One case study, at an address that can be sent to someone    |
| `/blog`        | Index of live posts, newest first                           |
| `/blog/:slug`  | One post, markdown rendered to HTML                         |
| `/talks`       | The deck shelf                                              |
| `/talks/:slug` | One deck — a page to read, a deck to fly, `?presenter` for the speaker |
| `/resume`      | The résumé, assembled from D1 for `DEFAULT_TARGET`          |
| `/resume.md`   | The same résumé as Markdown (the one to parse)              |
| `/resume.txt`  | The same résumé as plain text (the LinkedIn-paste copy)     |
| `/llms.txt`    | The site as a map for machines (llmstxt.org)                |
| `/sitemap.xml` | The same map for crawlers; `robots.txt` points at it        |
| `/feed.xml`    | The blog as Atom — full posts, and a living one says so     |

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
export const DEFAULT_TARGET = "website";
```

Change that string to re-point the page. `website` is the one written for a
public page rather than for an application: it sets no include filter, so every
bullet is eligible. The others are tailored to a kind of role and drop whole
jobs that do not match them.

## Stylesheets

Three, because the three things want different paper:

- `src/render/journal-css.js` — the homepage.
- `SITE_STYLESHEET` in `src/render/css.js` — the blog and the 404, in the same
  palette the homepage introduced.
- `RESUME_STYLESHEET` in `src/render/css.js` — `/resume`, still the résumé
  stylesheet ported verbatim from `jrschumacher/resume`, unchanged in its résumé
  rules. It is a document meant to print on Letter, and it stays one.

## Icons, and the picture a link unfurls into

Every page carries a canonical URL, an Open Graph / Twitter card, the icons and
a small piece of JSON-LD. They are built in one place — `src/render/meta.js`,
called by `layout()` and by the homepage's own document — so a new page cannot
ship without them, and the card is built from the same title and description
the page already has rather than from a second set of strings that can drift.

`/feed.xml` is the blog as Atom, assembled in `src/render/feed.js`. Atom rather
than RSS because of the living posts: an Atom entry carries `<published>` and
`<updated>` over one stable `<id>`, so a post that is revised shows up in a
reader as changed rather than as a duplicate, which is the whole model this blog
runs on. Entries carry the full post, not a teaser — the revision notes at the
end of a living post are the part a returning reader came for. The blog pages
offer it in their `<head>` and in the page itself; no other page does, since a
subscription to the résumé would be a subscription to a document that does not
change.

`/sitemap.xml` is the same idea for crawlers: assembled in
`src/render/sitemap.js` from the case-study data, the deck registry and the live
posts in D1, with a `<lastmod>` only where a record actually carries one.
`robots.txt` points at it.

The image files themselves live in `public/` and are generated, not drawn:

```
public/favicon.svg            the mark; the source every raster icon comes from
public/favicon.ico            16/32/48, for the browsers that cannot read an SVG
public/apple-touch-icon.png   180, iOS home screen
public/icon-192.png           Android
public/icon-512.png           Android
public/icon-maskable-512.png  Android's launcher, which crops to its own shape
public/site.webmanifest       name, colours, and the three icons above
public/og/*.png               1200×630 share cards, one per section
```

```sh
npm run images          # all of it, into public/
node bin/make-images --icons
node bin/make-images --cards
node bin/make-images --check   # renders nothing; reports what is missing
```

The generator is `bin/make-images`: it rasterises `public/favicon.svg` at each
size with headless Chrome, packs the small ones into the `.ico`, and lays the
share cards out in HTML in the journal's own palette and type, so a card cannot
quietly stop looking like the site. EB Garamond and IBM Plex Mono are fetched
from Google Fonts on first run and cached in the system temp directory.

Edit the mark in `public/favicon.svg` and re-run the script; do not edit the
PNGs. The output is committed, so a deploy needs neither Chrome nor the network,
and nothing at request time reads any of this — the Worker serves them as static
assets like any other file in `public/`.

## Headers

Every response from the Worker leaves through `harden()` in `src/headers.js`,
which adds a Content Security Policy, `X-Content-Type-Options: nosniff` and
`Referrer-Policy: strict-origin-when-cross-origin`. A route that sets one of
those itself keeps its own: it is a floor, not a ceiling.

The policy is strict because this site can afford it — server-rendered HTML, no
forms, no third-party scripts, no analytics. `style-src` carries
`'unsafe-inline'` and that is load-bearing rather than lazy: every stylesheet
here is inlined in a `<style>` and generated per page, so a hash would break on
any edit. `script-src` does **not**: the two module scripts are served from this
origin, and the résumé's one inline `onclick="window.print()"` is allowed by
hash, with `'unsafe-hashes'`, which is what makes a hash cover an event handler.
Change that handler and the print button stops working until the hash in
`src/headers.js` is recomputed — `test/headers.test.mjs` reads the handler out of
the rendered page and fails if the two have drifted.

Static assets are served by the assets layer ahead of the Worker and do not
carry these headers. That is the right shape: a CSP governs documents, and every
document comes from the Worker.

## Develop

```sh
npm ci            # package-lock.json is committed; `ci` installs exactly it
npm run dev
npm test          # renderers, parsers, the share cards and the sitemap
npm run deploy
```

### The lockfile

`package-lock.json` is committed, so `npm ci` is the install. Regenerate it with:

```sh
npm install --package-lock-only
```

Not a plain `npm install`: that records only the optional binaries for the
machine that ran it, so a lockfile written on linux-x64 installs wrangler with
no workerd binary anywhere else — silently, with the failure arriving later as a
missing module. `--package-lock-only` resolves from the registry's metadata
instead and writes every platform's entry. `test/lockfile.test.mjs` fails if the
file loses them again.

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

## CI

`.github/workflows/test.yml` runs `npm ci`, then `npm test`, then `npx wrangler
deploy --dry-run` — on pull requests, and on pushes to `main`. `ci` rather than
`install` because the lockfile is committed: it installs exactly what the lock
says and fails if the lock and `package.json` disagree, so a green run is a
statement about this commit rather than about whatever npm resolved that
morning. Cloudflare Workers
Builds still runs the deploy itself, and a build is not a test: a registry
importing three decks that were never committed looked healthy for two weeks
because nothing ran the suite on push. The dry run is the other half, because
`npm test` cannot see an import that only the Workers bundler resolves, which
is exactly how those decks hid.
