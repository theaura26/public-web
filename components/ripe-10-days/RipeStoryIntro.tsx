'use client'

import { RipeReveal } from '@/components/ripe/RipeReveal'
import type { Run } from '@/components/ripe/copy'
import { INTRO } from './copy'

/* ── The page's statements ──────────────────────────────────────────
   The opening line after the header, and the closing after the last
   chapter, set alike and set as /ripe sets its opening statement ("Some
   things cannot be hurried…", RipeOpening): an h2 in the site's heading
   role, left-aligned on the page rail on the same 760px measure,
   brightening word by word as it rises. The lifted words take the page's
   accent and bold; only the marked words lift (exact), not the full stops
   after them.
─────────────────────────────────────────────────────────────────────── */

/** quiet: the closing's setting — centred, in /ripe's smaller
    introduction paragraph size (P1) rather than the statement's h2. */
export function RipeStatement({ runs, quiet = false }: { runs: Run[]; quiet?: boolean }) {
  return (
    <div className="section-w">
      <RipeReveal runs={runs} className={quiet ? 'statement statement--quiet' : 'statement'} as={quiet ? 'p' : 'h2'} exact />

      <style jsx>{`
        /* Size, leading and tracking come from the h2 role in globals, as
           they do for /ripe's statement. */
        div :global(.statement) {
          margin: 0; max-width: 760px; text-wrap: pretty;
          text-align: left;
          color: var(--story-ink, #fff);
        }
        div :global(.statement .is-g) { font-weight: 700; }
        /* A narrow centred column: short lines, read slowly. */
        div :global(.statement--quiet) {
          margin: 0 auto; max-width: 24em;
          text-align: center;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 400;
          font-size: var(--t-p1-size); line-height: var(--t-p1-lh);
          letter-spacing: var(--t-track);
        }
      `}</style>
    </div>
  )
}

export function RipeStoryIntro() {
  return (
    <section className="intro">
      <RipeStatement runs={INTRO} />

      <style jsx>{`
        /* Tighter than a /ripe section break, so the story gets going
           sooner; the first chapter's pictures rise into the space below. */
        .intro { padding: clamp(110px, 22vh, 300px) 0 clamp(64px, 14vh, 200px); }
        /* On a phone, /ripe's own opening spacing above (RipeBlocks .open:
           the section gap, which RipeShell brings down for phones), and
           little below: Arriving's title is held half a screen into the
           stage, which is gap enough on its own. */
        @media (max-width: 899px) {
          .intro { padding: var(--ripe-section-gap) 0 clamp(16px, 3vh, 32px); }
        }
        /* Here the lifted words take the accent but keep the line's
           weight; the closing sets its own bold. */
        .intro :global(.statement .is-g) { font-weight: inherit; }
      `}</style>
    </section>
  )
}
