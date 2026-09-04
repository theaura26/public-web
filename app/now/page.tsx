import { readFeed } from '@/lib/aura-live/feed'
import { readToday } from '@/lib/aura-live/today'
import Timeline from '@/components/aura-live/Timeline'
import FeedState from '@/components/aura-live/FeedState'
import LiveHero from '@/components/aura-live/LiveHero'
import TodayCard from '@/components/aura-live/TodayCard'
import LiveShell from './LiveShell'

/* Aura Live.
 *
 * Proof of the land, to the world: what happened at Mudigere, taken from
 * the estate's own record, with the date, the place and the evidence
 * attached to each entry.
 *
 * There is no refresh control, and that is a design position rather than
 * an omission. The page regenerates on the server every fifteen minutes;
 * a button would invite a reader to hunt for news that arrives a few
 * times a week, and finding nothing would read as a fault in the page
 * rather than a quiet week on the estate.
 *
 * Rendering is server-side. The only client work is the reduced-motion
 * check on video, which refetches nothing.
 */

/* Four times the gateway's own hourly sync — often enough that a new card
   surfaces within the quarter hour, rarely enough that the page is not
   rebuilding for data that cannot have changed. See
   docs/aura-live/architecture.md for the arithmetic behind the number. */
/* TEMPORARY — 60s for a recording, put back to 900 afterwards.
   The gateway syncs hourly and the publish job runs on the half hour, so
   900 is the honest interval: re-reading faster than the source can
   change is polling for nothing. */
export const revalidate = 60

export default async function LivePage() {
  const [{ entries, freshness, failed }, today] = await Promise.all([readFeed(), readToday()])

  return (
    <main>
      <LiveShell
        hero={
          <LiveHero freshness={freshness}>
            <TodayCard today={today} />
          </LiveHero>
        }
      >
        {entries.length === 0 ? (
          /* Offline covers both a store that could not be read and a feed
             whose source has gone quiet — from where a reader sits those
             are the same thing, and both end. A live feed with nothing in
             it is the other case: a quiet day, which ends differently. */
          <FeedState offline={failed || freshness.state !== 'live'} />
        ) : (
          <Timeline entries={entries} />
        )}
      </LiveShell>
    </main>
  )
}