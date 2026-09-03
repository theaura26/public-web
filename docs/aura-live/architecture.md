# Aura Live — how it works

A public feed at `/live` of what has happened on the land at Mudigere,
built from the AURA gateway and published on a schedule. This note is the
map: what runs, in what order, and which decisions are load-bearing.

The companion document is [`editorial-policy.md`](./editorial-policy.md),
which says the same thing in English for people who do not read code. If
one changes, both change.

---

## 1. The path a fact takes

```
gateway (read-only)
   │
   ├─ /status ................ is the source healthy, and how fresh?
   ├─ /activities ............ completed operational records
   ├─ /media → /records/{key}  approved photographs and the sightings they belong to
   └─ /records/rainfall:DATE   weather, addressable only by key
   │
   ▼
normalise ..... one row → one evidence object with named fields
   ▼
safety ........ sensitive locations withheld
   ▼
policy ........ hard gate: is this publishable at all?      ← may reject
   ▼
dedupe ........ already published? already merged into a card?
   ▼
merge ......... several rows describing one event become one card
   ▼
score ......... deterministic editorial value               ← may defer
   ▼
copy .......... templates, then an optional model stage
   ▼
verify ........ every number, name and place traced to evidence  ← may reject
   ▼
names ......... no uncleared worker in published prose      ← may reject
   ▼
store ......... one JSON ledger, upserted atomically
   ▼
render ........ /live, server-rendered, revalidated every 15 minutes
```

Each arrow that can reject writes a reason into the audit trail. Nothing
is dropped silently.

## 2. Three clocks, never conflated

| Field | Means | Where it comes from |
|---|---|---|
| `occurredAt` / `occurredOn` | when it happened on the land | `occurred_at`, or the source's own Date and Time columns |
| `publishedAt` | when Aura Live first showed it | set once, on acceptance, and never rewritten |
| `evidence.syncedAt` | when the gateway last read the source | gateway provenance |

`first_seen_at`, `updated_at` and `source_modified_time` are **never** used
as event times. They describe the pipeline, not the estate.

A correction rewrites the copy and sets `updatedAt`. It leaves `id`,
`publishedAt` and the event time alone, so a card never becomes new
because a spreadsheet cell was fixed.

### Precision is carried, not assumed

The source is a set of Google Sheets kept by hand. Most rows carry a date
and no time, and the gateway renders that as **midnight UTC**. Printing
`12:00 AM` off one of those is the single most likely way this feature
tells a reader something untrue, so every entry declares its precision:

- `exact` — the source had a real clock reading (`facts.Time`, or a
  non-midnight `occurred_at`). Shown to the minute, in IST.
- `window` — the source gave a work period (`3 PM– 7 PM, 6 AM– 9 AM`).
  Shown as that period, never as a moment.
- `date` — the source gave a day. Shown as a day. Relative labels skip
  hours entirely and fall through to `Today` / `Yesterday` / `26 Aug`.

`Asia/Kolkata` decides every calendar boundary. The offset is derived
through `Intl`, not hard-coded.

## 3. How hallucination is prevented

Three layers, and the third does not trust the first two.

**Normalisation is the only reader of `facts`.** Nothing downstream sees
the raw gateway blob. Everything a card can say has to arrive as a named
field traced to a named column.

**Templates place values; they never compute them.** A missing value
shortens the sentence rather than making it vaguer. Merging three
identical 200 L batches produces "three batches, 200 L each" — never
"600 L", because nobody wrote 600 down.

**Every sentence is checked against the evidence before it is stored.**
`verify.ts` extracts each number and each proper noun from the copy and
requires it to appear in the candidate's evidence. It also rejects hype,
unsupported ecological and certification claims, and any clock time on a
date-only record. This runs on template output too — a template is a
program, and programs get edited.

The optional model stage sits inside this. It receives a normalised
evidence object and nothing else: no gateway response, no site copy, no
earlier cards, and no ability to fetch. Whatever it returns goes through
the same check, and anything that fails falls back to the template. So the
model decides phrasing, never truth and never whether something publishes.

## 4. How duplicates are prevented

Identity is the gateway's `canonical_key`.

- A key already in the ledger is skipped, or updated if the source
  changed. It is never re-published.
- A card built by merging several rows records every contributing key, and
  all of them are treated as claimed — so the merged siblings do not
  resurface as their own cards on the next run.
- The entry `id` is a stable hash of the canonical key, so it survives
  restarts, redeploys and rebuilds. Archive-image selection keys off it,
  which is why a card keeps the same picture forever.
- Scoring re-runs against the feed as it grows during a run, and there is a
  per-category cap per run, so one busy week of spraying cannot take the
  whole page.

Reruns are idempotent: the second run of an unchanged interval publishes
nothing and rewrites nothing.

## 5. Replacing archive imagery with real event media

Cards without a linked approved photograph draw one from
`data/aura-live/gallery.json`, labelled on the card and in the evidence
panel as archive imagery. Selection is deterministic — same card, same
picture, always.

Nothing needs to change when real media arrives. `buildEntry` prefers
event media unconditionally; the gallery is only reached when the gateway
returns none. To make a record's photograph appear, get it approved and
linked upstream, and the next run swaps it in.

To add an archive asset: drop the file in `/public`, add an entry with
honest alt text, the categories it may illustrate and its real aspect
ratio. To retire one: delete the entry. Cards already published keep the
media recorded on them.

## 6. Storage

No database existed in this project, so the smallest production-appropriate
addition was chosen: **one JSON document**, behind a two-driver interface.

- `blob` — Vercel Blob, used whenever `BLOB_READ_WRITE_TOKEN` is present.
  First-party on the deployment platform, no server to run.
- `file` — a JSON file under `.aura-live/`, used locally and in tests.
  Not durable on serverless and never selected there.

The scheduled job is the only writer. If the feed outgrows one document —
tens of thousands of entries, or more than one estate writing at once —
`FeedStore` is the seam to put Postgres behind; nothing above it knows
which driver it is talking to.

## 7. Scheduling

`vercel.json` runs `/api/cron/aura-live` every thirty minutes. The cron is
deliberately dumber than the policy: it fires on a fixed clock, and the
job decides whether the estate is inside a publishing window, in
`Asia/Kolkata`, from `AURA_LIVE_WINDOWS`. That way the windows are an
environment variable rather than a redeploy, and a run outside them costs
one early return.

The endpoint is a writer, so it is authenticated with `CRON_SECRET`.
Without a secret configured it refuses every request in production.

See [`refresh-intervals.md`](./refresh-intervals.md) for what the data
says the intervals should actually be.

## 8. What the browser gets

`readFeed()` is a projection, not a pass-through. Scores, rejection
reasons, gateway confidence, review status, source paths and row numbers
stay in the ledger. The page and `/api/aura-live/feed` receive the event,
its time and precision, its media with an explicit
`isEditorialImagery` flag, and one reader-facing `syncedAt`.

The page has no refresh control. It regenerates on the server every
fifteen minutes; relative timestamps recompute on the client every minute
without refetching anything.

## 9. When the gateway is down

- The page keeps serving every card it has already published.
- The freshness mark stops saying "live" and says how far behind the
  source is, or that its status is unavailable.
- The job stops publishing new cards past
  `AURA_LIVE_STALE_AFTER_MINUTES`, and leaves the ledger and the watermark
  untouched.

Nothing is deleted, and the page never claims to be live when it is not.

## 10. Files

| Path | What it is |
|---|---|
| `lib/aura-live/config.ts` | every configurable number |
| `lib/aura-live/gateway.ts` | typed read-only client: retries, timeout, validation |
| `lib/aura-live/taxonomy.ts` | the site's thirteen Now subjects, and nothing else |
| `lib/aura-live/schema.ts` | zod contracts for the gateway and the feed entry |
| `lib/aura-live/time.ts` | IST, precision, relative labels, publishing windows |
| `lib/aura-live/normalize.ts` | gateway row → evidence object |
| `lib/aura-live/policy.ts` | the hard gate |
| `lib/aura-live/roster.ts` | keeping uncleared worker names out of prose |
| `lib/aura-live/merge.ts` | several rows → one event |
| `lib/aura-live/score.ts` | deterministic editorial value |
| `lib/aura-live/copy.ts` | the templates |
| `lib/aura-live/verify.ts` | the claim check |
| `lib/aura-live/llm.ts` | the optional model stage |
| `lib/aura-live/gallery.ts` | archive imagery and its allocator |
| `lib/aura-live/store.ts` | the ledger, blob or file |
| `lib/aura-live/pipeline.ts` | the run |
| `lib/aura-live/feed.ts` | what the browser is allowed to see |
| `components/aura-live/Timeline.tsx` | the spine, the months, the gap ticks |
| `components/aura-live/FeedEntry.tsx` | one event, two lines, and the evidence behind it |
| `app/live/` | the page |
| `app/api/cron/aura-live/` | the scheduled job |
| `app/api/aura-live/feed/` | the feed as JSON |
| `data/aura-live/gallery.json` | the archive manifest |
| `tests/aura-live/` | 108 tests, with fixtures captured from the live gateway |

```bash
npm run aura-live:test
```

```bash
npm run aura-live:run -- --force
```
