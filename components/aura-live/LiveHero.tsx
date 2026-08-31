'use client'

import { estateParts, clockLabel } from '@/lib/aura-live/time'
import type { FeedFreshness } from '@/lib/aura-live/feed'

/* The opener.
 *
 * A black field with the place on it, and one fact: when the estate
 * record was last read. That phrasing holds in every state — the source
 * synced eleven minutes ago or eleven hours ago, and the sentence is true
 * either way — so the page never has to choose between claiming to be
 * live and admitting it is not. The mark beside it hollows out when the
 * source is behind.
 *
 * The dot is the only colour on the page. It earns it by being the one
 * element whose whole job is to say "this is current".
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function LiveHero({ freshness }: { freshness: FeedFreshness }) {
  const { state, lastCheckedAt } = freshness

  let stamp = 'estate record unavailable'
  if (lastCheckedAt) {
    const p = estateParts(lastCheckedAt)
    stamp = `${clockLabel(p.minuteOfDay)}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`
  }

  return (
    <header className="hero">
      <h1 className="title">Mudigere Live</h1>

      <p className={`fresh label state-${state}`}>
        <span className="dot" aria-hidden="true" />
        Last updated{' '}
        {lastCheckedAt ? <time dateTime={lastCheckedAt}>{stamp}</time> : stamp}
      </p>

      <style jsx>{`
        .hero {
          /* Full bleed out of the page rail. The black has to reach both
             edges or it reads as a card rather than as ground. */
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          width: 100vw;

          background: #000;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(var(--space-9), 9vh, 128px);
          padding: calc(var(--nav-h) + var(--space-11, 120px)) var(--gutter) var(--space-11, 120px);
          min-height: 62vh;
          text-align: center;
        }

        .title {
          margin: 0;
          /* globals.css sets h1 to var(--text), which on a black field in
             day theme is near-black on black. The hero owns its own
             ground, so it owns its own ink. */
          color: #fff;
          /* The place, at the largest size the page has. Bricolage at
             weight 600 uppercase is the site’s display setting; the only
             change here is that it runs on black. */
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          text-transform: uppercase;
          font-size: clamp(44px, 8.6vw, 128px);
          line-height: 0.92;
          letter-spacing: -0.035em;
          text-wrap: balance;
        }

        .fresh {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--brand-accent);
          flex: none;
        }
        /* Behind, or unknown: the mark hollows out. Nothing about a
           filled dot should survive the source going quiet. */
        .state-stale .dot, .state-unknown .dot {
          background: transparent;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 640px) {
          .hero { min-height: 54vh; gap: var(--space-7); }
        }
      `}</style>
    </header>
  )
}
