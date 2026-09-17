---
title: Why your SDK needs a changelog
summary: A version number tells your callers that something changed. A changelog tells them what it means for their code, and whether they have to do anything about it.
---

```css theme
.deck {
  --card:  #f4f1ea;
  --ink:   #17181c;
  --accent:#2f6f5e;
  --serif: Georgia, "Iowan Old Style", serif;
  --mono:  ui-monospace, "SF Mono", Menlo, monospace;
}
.deck-backdrop {
  background: radial-gradient(120% 90% at 50% 8%, #1b2420 0%, #131a17 55%, #0d100f 100%);
}
.deck-backdrop::before {
  background-image: url("/deck/pattern.svg?g=%F0%9F%A7%BE&size=52&opacity=0.05");
  --wallpaper-angle: -12deg;
  --wallpaper-drift: 140s;
}
```

<!-- pos: 0,0 -->
<!-- kicker: 01 — The premise -->

# Why your SDK needs a changelog

You already ship one artifact your callers cannot read the source of, cannot
step through in their debugger, and cannot ask questions of at 2am.

The changelog is the part of the SDK that talks back.

---

<!-- pos: 1,0 -->
<!-- kicker: 02 — The failure mode -->

# A version number is a rumour

`2.3.0` says *something changed and it was probably safe*. That is the entire
message. It does not say which call, which field, or which of your callers is
about to find out the hard way.

So they do the rational thing and pin the old version. Then they stop
upgrading. Then your security patch sits unadopted for eight months, and the
support ticket you get is for a bug you fixed last spring.

---

<!-- pos: 1,1 -->
<!-- kicker: 03 — What it is not -->

# A changelog is not a git log

A git log is written for the person who wrote the code. A changelog is written
for the person integrating it, who does not know your module boundaries and
should not have to.

> `refactor(client): unify retry paths`

is true, and useless. The caller needs to know that idempotent requests are now
retried twice by default, and that their own retry wrapper is now doing eight.

Auto-generating the file from commit subjects produces a document nobody reads,
which is worse than none, because it looks like the job is done.

---

<!-- pos: 2,0 -->
<!-- kicker: 04 — What an entry owes -->

# Three things, per change

Each entry should answer *what moved*, *who it hits*, and *what to type*:

```
### Changed
- `Client.list()` is now paginated and returns a Page, not an array.
  Callers iterating the result directly will get no items and no error.
  Migration: `for await (const x of client.list())`.
```

Group by kind — Added, Changed, Deprecated, Removed, Fixed, Security — so a
reader scanning for breakage can skip four fifths of the file. Say **Security**
out loud when it is one; that word is what gets an upgrade scheduled.

Write the entry in the pull request that makes the change, while the blast
radius is still known. Nobody reconstructs it accurately at tag time.

---

<!-- pos: 2,1 -->
<!-- kicker: 05 — The point -->

# It is part of the API surface

The signatures tell a caller how to use the SDK today. The changelog is the
only place you tell them how it behaved yesterday and what you intend to do to
them next — and deprecations announced nowhere are just outages with a longer
fuse.

Treat it like the interface it is: reviewed in the same pull request, released
in the same commit, and written in the second person, for someone whose code is
already in production.
