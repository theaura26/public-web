import { NextResponse } from 'next/server'
import { readFeed } from '@/lib/aura-live/feed'

/* AURA Live — the feed as JSON.
 *
 * The page renders on the server and does not need this. It exists for
 * the agent view of the site, which reads machine-readable structure, and
 * because a public feed that cannot be read by a machine is a strange
 * thing for an estate that publishes its data.
 *
 * It serves the same projection the page does: no scores, no confidence
 * figures, no source paths.
 */

export const runtime = 'nodejs'
/* An hour, matched to the gateway. It syncs on the hour — pg_cron,
   `0 * * * *` — so an hour is the shortest interval at which a re-read
   can find anything new. Faster than the source can change is polling
   for nothing, and this replaces both the 900 that predated it and the
   60 that was left in for a recording. */
export const revalidate = 3600

export async function GET() {
  const view = await readFeed()
  return NextResponse.json(
    {
      estate: 'mudigere',
      freshness: view.freshness,
      /* Whether the ledger could be read at all. Without it an empty
         feed has two meanings that look identical from here — a store
         that could not be opened, and a store with nothing published in
         it — and the caller has no way to tell a fault from a quiet day.
         The page distinguishes them; a machine reading this could not. */
      readable: !view.failed,
      /* The reason, when there is one. `readable: false` on its own is
         the same shape of silence the flag was added to remove: it says
         the ledger is unreachable and not what stopped it. Truncated,
         because this is a public endpoint and the message is a
         diagnostic, not a stack trace. */
      ...(view.failure ? { unreadableBecause: view.failure.slice(0, 200) } : {}),
      entries: view.entries,
    },
    {
      headers: {
        /* Matched to the gateway's hourly sync: a client that re-reads
           more often than the source changes is polling for nothing. */
        'cache-control': 'public, s-maxage=3600, stale-while-revalidate=300',
      },
    },
  )
}
