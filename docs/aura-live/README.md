# Aura Live

The public feed at [`/live`](https://theaura.life/live): what has happened
on the land at Mudigere, taken from the estate record, with the day, the
place and the evidence attached to every entry.

- [`architecture.md`](./architecture.md) — how it works, and why
- [`editorial-policy.md`](./editorial-policy.md) — what may and may not be published, in English
- [`refresh-intervals.md`](./refresh-intervals.md) — what the data says the cadence should be

## Running it

```bash
npm run aura-live:test
```

```bash
npm run aura-live:run -- --force
```

`--force` ignores the publishing windows and the source-revision check, so
it always does a full pass. Without it, the script behaves exactly as the
scheduled job does.

Locally the ledger is a JSON file at `.aura-live/feed.json` (gitignored).
The page reads it at build time and every 15 minutes after that, so
generate a feed before running `npm run dev` or the page will correctly
tell you it is empty.

## Setting it up on Vercel

1. Add the **Blob** integration to the project. It sets
   `BLOB_READ_WRITE_TOKEN`, which is what switches the ledger from a local
   file to durable storage. Nothing else needs configuring.
2. Set `CRON_SECRET` to any long random string. Vercel sends it to the job
   as a bearer token; without it the job refuses every request in
   production.
3. Deploy. `vercel.json` registers the half-hourly cron.
4. Seed the feed once, from a machine with the same environment:
   `npm run aura-live:run -- --force`.

Everything else in [`.env.example`](../../.env.example) has a working
default. Nothing reaches the browser: no key here is prefixed
`NEXT_PUBLIC_`.

## The one thing worth knowing

The gateway and the estate's Drive are **read-only**, always. Nothing in
this feature writes upstream. The only thing it writes is its own ledger.
