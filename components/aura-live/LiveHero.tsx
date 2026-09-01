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

export default function LiveHero({ freshness, children }: { freshness: FeedFreshness; children?: React.ReactNode }) {
  const { state, lastCheckedAt } = freshness

  let stamp = 'estate record unavailable'
  if (lastCheckedAt) {
    const p = estateParts(lastCheckedAt)
    stamp = `${clockLabel(p.minuteOfDay)}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`
  }

  return (
    <header className="hero">
      {/* The estate, moving, behind the readings. Muted, looped and
          inline so it behaves as a ground rather than as media; the
          poster carries it on reduced motion and before it buffers. */}
      <video
        className="film"
        src="/aura-mudigere.mp4"
        poster="/aura-mudigere.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* The film is a ground, not a picture: it is dimmed hard so the
          title, the stamp and the dark cards all hold against it. */}
      <span className="veil" aria-hidden="true" />

      <h1 className={`title state-${state}`}>
        Now<span className="dot" aria-hidden="true" />
      </h1>

      <p className={`fresh label state-${state}`}>
        Last updated{' '}
        {lastCheckedAt ? <time dateTime={lastCheckedAt}>{stamp}</time> : stamp}
      </p>

      {/* The land today, on the same black. The readings and the stamp
          above them are one statement — what the estate is like right
          now — and splitting them across two grounds made the cards read
          as a separate module that happened to follow. */}
      {children && <div className="band-slot">{children}</div>}

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
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          /* No shared gap: the stamp belongs to the title and the card
             band does not, so the two distances are set separately below
             rather than by one number that governs both. */
          gap: 0;
          /* No horizontal padding: the band inside sets its own rail so
             the cards can run off the right edge. The title and stamp
             carry the gutter themselves. */
          /* No top padding. The title and stamp centre themselves in the
             space above the card band with a pair of auto margins, and
             any padding here lands on one side of that pair only — it was
             pushing them 152px below the middle. The auto space is far
             larger than the nav at every height this hero can be, so the
             bar is cleared without reserving for it. */
          padding: 0 0 var(--space-9);
          /* The site's hero measure — the field notes index, the
             articles and the Remarkable Circle are all 100svh. The
             microsite's min(92svh, 900px) is the outlier and this used to
             follow it. svh rather than vh, so a mobile browser collapsing
             its chrome does not change the height under the reader. */
          min-height: 100svh;
          text-align: center;
        }

        .film {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }
        .veil {
          position: absolute;
          inset: 0;
          z-index: 1;
          /* The veil is only doing one job: keeping the title and the
             stamp legible. The film is bright — its highlights sit at
             242/255 — so white type needs about half of it held back
             where the words are, and nothing at all anywhere else. It
             used to run 0.78 at the foot, under cards that carry their
             own dark ground, which darkened the film for no reason.
             It holds through the text band and then lets go to 5%. */
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.54) 0%,
            rgba(0, 0, 0, 0.52) 30%,
            rgba(0, 0, 0, 0.30) 46%,
            rgba(0, 0, 0, 0.12) 62%,
            rgba(0, 0, 0, 0.05) 78%,
            rgba(0, 0, 0, 0.05) 100%
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .film { display: none; }
          .hero { background: #000 url('/aura-mudigere.jpg') center / cover; }
        }

        /* Title and stamp keep the page gutter, and sit above the film. */
        .title, .fresh { padding: 0 var(--gutter); position: relative; z-index: 2; }
        .band-slot { position: relative; z-index: 2; }

        /* The band is the full width of the hero and starts on the page
           rail, so the first card sits on the same x as every heading on
           the page. It still runs off the right, which is the cue that
           the row scrolls. */
        .band-slot {
          width: 100%;
        }

        .title {
          /* This margin and the one under the stamp are both auto, which
             centres the pair in whatever is left above the card band —
             the clear part of the frame, rather than the whole hero. */
          margin: auto 0 0;
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
          /* Close under the title — it is the title's timestamp, and it
             used to sit 88px away, reading as its own thing. */
          margin: var(--space-6) 0 auto;
          /* Solid, not 72%. At 11px over this film it was reading 3.34:1
             even under the heavier veil it used to have — under AA, and
             the reason the veil had to be as dark as it was. */
          color: #fff;
        }
        /* On the title rather than beside the timestamp. Six pixels next
           to a line of 11px mono was a detail nobody found; at the top of
           a 128px word it is the first thing on the page, which is right
           for the one element whose whole job is to say "this is
           current". It is sized in em, so it tracks the title down to
           mobile. */
        .dot {
          display: inline-block;
          width: 0.16em;
          height: 0.16em;
          margin-left: 0.1em;
          /* Centred on the word, not perched above it: the dot's bottom
             sits 0.28em over the baseline, which puts its middle on the
             middle of the cap height. */
          vertical-align: 0.28em;
          border-radius: 50%;
          background: var(--brand-accent);
          box-shadow:
            0 0 0.06em var(--brand-accent),
            0 0 0.3em rgba(227, 113, 40, 0.85),
            0 0 0.7em rgba(227, 113, 40, 0.45);
          animation: live-pulse 2.6s var(--ease, ease-in-out) infinite;
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        /* Behind, or unknown: the mark hollows out and stops glowing.
           Nothing about a lit dot should survive the source going quiet. */
        .state-stale .dot, .state-unknown .dot {
          background: transparent;
          box-shadow: inset 0 0 0 0.02em rgba(255, 255, 255, 0.5);
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .dot { animation: none; }
        }

        @media (max-width: 640px) {
          .hero { min-height: 100svh; gap: var(--space-7); }
        }
      `}</style>
    </header>
  )
}
