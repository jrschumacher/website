---
title: Config files are an API
summary: A config file is a published interface: every key you read, every default you pick, and every error you print is a promise to someone you will never meet.
---

<!-- pos: 0,0 -->
<!-- kicker: 01 — The claim -->

# You shipped an API the day you read a file

Nobody reviewed it. It has no version, no reference page, and no deprecation
policy. It has users anyway — they wrote the file, and it lives in their repo,
in their pull requests, in the runbook they page each other with at 2am.

The moment your program reads a key, that key is public.

---

<!-- pos: 1,0 -->
<!-- kicker: 02 — The surface -->

# What you actually published

```yaml
 ---
 # deploy.yaml — first document
 version: 2
 service:
   name: billing-api
   replicas: 3
   timeout: 30s
 ---
 # second document, same file
 version: 2
 service:
   name: billing-worker
   replicas: 1
```

The surface is not the key names. It is the nesting, the types, the unit
hiding in `30s`, the fact that two documents in one file are allowed at all,
and the value `timeout` takes in the second one, where nobody wrote it.

---

<!-- pos: 1,1 -->
<!-- kicker: 03 — The quiet promise -->

# Defaults are the loudest thing you never wrote down

The second document omits `timeout`, so it gets whatever you picked in code.
That number is part of the contract now, and it is the part of the contract
nobody can read.

Change it in a patch release and every file that left the key out behaves
differently, with no diff anywhere to point at.

---

<!-- pos: 2,0 -->
<!-- kicker: 04 — Errors are the API too -->

# The error message is a reference page

What a parser usually says when the contract is broken:

```
Error: invalid configuration
```

***

What the same failure can say instead:

```
deploy.yaml:7: service.replicas must be an integer, got "3 "
  hint: drop the trailing space, or quote the value
  docs: https://example.invalid/config#service-replicas
```

The second one is documentation delivered at the one moment somebody is
actually willing to read documentation.

---

<!-- pos: 3,0 -->
<!-- kicker: 05 — What to do about it -->

# Treat it like the interface it already is

- Version the schema in the file, not in your head.
- Write the defaults down beside the keys they belong to.
- Rename by accepting both spellings for a release, never by a hard cut.
- Print the file, the line, and the fix in every error.

None of this is new. It is the API discipline you already have, pointed at the
one interface you forgot you were shipping.
