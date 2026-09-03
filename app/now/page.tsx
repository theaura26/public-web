import { readFeed } from '@/lib/aura-live/feed'
import { readToday } from '@/lib/aura-live/today'
import Timeline from '@/components/aura-live/Timeline'
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
export const revalidate = 900

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
        {failed ? (
          <p className="state">
            The feed could not be read just now. Nothing has been lost — this page is served from a
            stored record, and it will return as soon as that record is reachable again.
          </p>
        ) : entries.length === 0 ? (
          <p className="state">
            Nothing has met the bar yet. Entries appear here when the estate record contains a
            confirmed event with a date, a place and enough evidence to stand behind — which is not
            every day, and this page would rather be empty than filled.
          </p>
        ) : (
          <Timeline entries={entries} />
        )}
      </LiveShell>
    </main>
  )
}