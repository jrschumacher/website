---
title: Reading your own logs
summary: Most teams write logs nobody reads. A short talk about treating a log line as something you will meet again at 3am, and the small habits that make it worth meeting.
fonts:
  - Newsreader:ital,wght@0,400;0,600;1,400
  - JetBrains+Mono:wght@400;500
---

```css theme
.deck {
  --card:  #0e1116;
  --ink:   #dfe7ef;
  --accent:#9cff57;
  --serif: "Newsreader", Georgia, serif;
  --mono:  "JetBrains Mono", ui-monospace, monospace;
}
.deck-backdrop {
  background: radial-gradient(120% 90% at 50% 8%, #16213b 0%, #0b0f18 55%, #05070b 100%);
}
.deck-backdrop::before {
  background-image: url("/deck/pattern.svg?g=%F0%9F%AA%B5&size=48&opacity=0.05");
  --wallpaper-angle: -12deg;
  --wallpaper-drift: 140s;
}
.deck hr {
  border: 0;
  border-top: 1px solid color-mix(in oklab, var(--accent) 45%, transparent);
  margin: 1.6em 0;
}
```

<!-- pos: 0,0 -->
<!-- kicker: 01 — Cold open -->

# Reading your own logs

You shipped a few thousand log lines last year. You have read maybe forty of
them, all of them during an outage, none of them happily.

This is a talk about the other kind of reading.

Press **space** to advance.

---

<!-- pos: 1,0 -->
<!-- kicker: 02 — The write-only log -->

# Logs get written for the moment of writing

The line made sense when you added it, because you had the whole function in
your head. Six months later all that survives is the string.

```
INFO  handler: here
DEBUG got it
WARN  retrying
```

Nobody greps for `here`. Nobody can. The information was never in the log —
it was in you, and it did not ship.

---

<!-- pos: 1,1 -->
<!-- kicker: 03 — Anatomy of a line -->

# One line, twice

A line you cannot act on, because every noun in it is missing:

```
ERROR failed to sync
```

***

The same event, written for the person who will find it at 3am:

```
ERROR sync failed  account=8812 provider=stripe
      attempt=3/3 after=4.2s err=deadline_exceeded
```

The second one is not longer because it is more verbose. It is longer
because it answers the questions you were going to ask anyway.

---

<!-- pos: 2,1 -->
<!-- kicker: 04 — Write for the search -->

# Assume the reader has a grep and no context

Three rules that survive contact with production.

- **Log the identifiers, not the adjectives.** `account=8812` beats
  "for this user". You will search for the number.
- **One event, one line.** A story told across four lines is four lines
  that interleave with everyone else's four lines.
- **Say what happens next.** "retrying in 4s" and "giving up" are different
  facts, and only one of them is a page.

Levels are for filtering, not for feelings. `ERROR` means someone must act.

---

<!-- pos: 2,0 -->
<!-- kicker: 05 — The habit -->

# Read them on a boring Tuesday

The only reliable way to find out whether your logs are readable is to read
them when nothing is wrong. Ten minutes, once a week, tailing production
with no incident attached.

You will find the line that fires nine thousand times an hour. You will find
the `WARN` that has been benign since 2024 and now trains everyone to ignore
warnings. Neither shows up in an outage, because in an outage you are not
reading — you are searching for something you already suspect.

---

<!-- pos: 3,0 -->
<!-- kicker: 06 — The close -->

# A log nobody reads is a comment with a hosting bill

It costs storage, it costs attention, and it quietly convinces the team that
the system is observable when it is only noisy.

Write the line for the stranger who will read it under pressure. Six months
from now, that stranger is you.
