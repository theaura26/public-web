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
export const revalidate = 900

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
      entries: view.entries,
    },
    {
      headers: {
        /* Matched to the gateway's hourly sync: a client that re-reads
           more often than the source changes is polling for nothing. */
        'cache-control': 'public, s-maxage=900, stale-while-revalidate=3600',
      },
    },
  )
}
