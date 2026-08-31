'use client'

import type { ReactNode } from 'react'

/* The page's frame: a full-bleed hero, then the timeline in the rail.
 *
 * Split out from page.tsx only because styled-jsx needs a client
 * component and the page itself is async and server-rendered. It holds
 * layout and nothing else — no data, no logic.
 */
export default function LiveShell({
  hero, today, children,
}: { hero: ReactNode; today: ReactNode; children: ReactNode }) {
  return (
    <div className="page">
      {hero}
      {today && <div className="section-w today-w">{today}</div>}
      <div className="section-w body">{children}</div>

      <style jsx>{`
        /* The hero breaks the rail, so the rail cannot wrap it. */
        .page { overflow-x: clip; }

        /* The cards break out of this rail themselves, so it must not
           clip them — and they no longer straddle the hero, so nothing
           is pulled upward here either. */
        .today-w { position: relative; }

        .body {
          padding-top: var(--space-10, 96px);
          padding-bottom: var(--space-11, 120px);
        }

        .body :global(.state) {
          margin: 0;
          max-width: 52ch;
          color: var(--text-body);
        }
      `}</style>
    </div>
  )
}
