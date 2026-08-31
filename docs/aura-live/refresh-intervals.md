# What the data says the refresh intervals should be

Measured against the live gateway on 2026-08-29, over the full 589-row
activity corpus (11 weeks, 4 May – 26 Aug 2026) and the 14 approved media
assets.

## The five numbers that decide everything

| | Measured |
|---|---|
| Gateway sync schedule | `0 * * * *` — hourly, on the hour, ~24s per run |
| Distinct edit days per source sheet, across 11 weeks | **1** each |
| Lag from event happening to the sheet being edited | min **2.3 days**, median **31.3 days** |
| Publishable events, by the day they happened | ~**2.1 / day**, median 14 / week |
| Approved media | 14 visible, **56 still pending review** |

Two of those matter more than the rest.

**New data can only appear on the hour.** The gateway is a scheduled
Google Drive sync, not a stream. Polling faster than hourly cannot
surface anything, ever.

**The sheets are edited in batches, not continuously.** Across eleven
weeks, `field_activities` was last modified on 27 June,
`input_applications` on 28 August and `fertilizer_production` on 29
August — one edit day each. The estate does the work, and the record
catches up in bursts. Nothing reaches the gateway in under 2.3 days, and
the median event waits a month.

So the feed is not fed by a stream of events at 2.1 a day. It is fed by
occasional deliveries of several dozen at once, weeks after the fact.

## What that means for polling

Polling every 30 minutes inside two windows is **18 runs a day** against a
source that changes on the order of once a fortnight. Better than 99% of
runs will have nothing to find.

That is fine — provided a run that finds nothing is genuinely cheap, and
it was not. A full sweep is roughly **110 requests** (four date windows,
six category passes, the media index, and one record fetch per linked
observation), and running that 18 times a day to discover nothing is the
sort of thing that gets a read-only integration rate-limited.

**So the recommendation is not to slow the schedule down. It is to make
the empty run free.** The gateway's `/status` publishes
`source_revision` — a sha256 of everything it read. When that has not
moved since the last completed discovery, there is provably nothing new.
The job now compares it first and returns after **two requests instead of
about a hundred**, and only claims a revision when every sweep succeeded,
so a partial failure still forces a full sweep next time.

With that in place, thirty minutes costs almost nothing and buys a feed
that is never more than half an hour behind a delivery.

## Recommended intervals

| What | Interval | Why this number |
|---|---|---|
| **Cron** | **every 30 min**, `0,30 * * * *` | The brief's cadence, and now nearly free. New data can only land on the hour, so this is 2× the fastest possible arrival — enough to catch a delivery promptly without ever being the reason it is late. |
| **Publishing windows** | **06:00–10:00, 15:00–19:30 IST** | As briefed. 18 in-window runs a day, of which ~17 exit on the revision check. |
| **Page regeneration** | **15 min** (`revalidate = 900`) | The safety net, not the main path: the job calls `revalidatePath('/live')` when it actually publishes, so a new card appears immediately. 15 minutes bounds how stale the freshness mark can get. |
| **Freshness check** | **15 min** (cached `/status`) | A quarter of the gateway's own sync interval. Checking more often than the source can change is pure load. |
| **JSON feed cache** | `s-maxage=900, stale-while-revalidate=3600` | Same reasoning, for machine readers. |
| **Relative timestamps in the browser** | **60 s** | Arithmetic on a date the page already holds. No network, so the cost is zero and a page left open overnight still reads correctly in the morning. |
| **Staleness threshold** | **180 min** | Three consecutive missed hourly syncs. One missed sync is noise; three is a fault worth telling the reader about. |

## What would change these numbers

- **If the estate starts logging daily.** The median lag drops from a
  month towards a day, arrivals stop being batched, and 30 minutes starts
  earning its keep on every run rather than one in seventeen. No change
  needed — the schedule is already right for that world.
- **If the gateway starts syncing more often than hourly.** Match the
  cron to it. Half its sync interval is the right rule.
- **If media review is cleared.** 56 of 70 assets are pending. Clearing
  them would put real photographs on cards that currently carry archive
  imagery — the single biggest available improvement to the feed, and it
  needs no code at all.
- **If a second estate is added.** Discovery becomes per-estate and the
  revision check becomes per-estate with it; the intervals themselves do
  not change.

## What is deliberately *not* faster

Nothing polls the gateway from the browser. The page is server-rendered
and has no refresh control, which is a design position rather than an
omission: events arrive a few times a week, and a refresh button would
invite a reader to hunt for news that is not there and read its absence as
a fault in the page rather than a quiet week on the estate.
