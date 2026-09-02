'use client'

import type { ReactNode } from 'react'
import { Continue } from '@/components/article/Article'

/* The page's frame: a full-bleed hero, then the timeline in the rail.
 *
 * Split out from page.tsx only because styled-jsx needs a client
 * component and the page itself is async and server-rendered. It holds
 * layout and nothing else — no data, no logic.
 */
export default function LiveShell({
  hero, children,
}: { hero: ReactNode; children: ReactNode }) {
  return (
    <div className="page">
      {hero}
      <div className="section-w body">{children}</div>

      {/* Where the feed stops and the argument starts. Same three-up
          grid the journals close with, so the foot of this page looks
          like the foot of every other page. */}
      <Continue
        heading="Where this comes from"
        items={[
          {
            href: '/regenerative-life/the-plantation',
            label: 'The Plantation',
            img: '/regenerative-life/the-plantation/images/aura-plantation-hero-banner.webp',
          },
          {
            href: '/regenerative-life/vedic-and-biodynamic',
            label: 'Vedic & Biodynamic',
            img: '/regenerative-life/vedic-and-biodynamic/images/aura-vedic-biodynamic-04.webp',
          },
          {
            href: '/field-notes',
            label: 'Field Notes',
            img: '/journals/wisdom/aura-moral-spine.jpg',
          },
        ]}
      />

      <style jsx>{`
        /* The hero breaks the rail, so the rail cannot wrap it. */
        .page {
          overflow-x: clip;
          /* The feed's own ground. White made the cards read as paper on
             a screen; this is the estate's paper colour, and it carries
             below the last entry so the page ends on it. */
          background: #F5F3ED;
          min-height: 100vh;
        }

        .body {
          padding-top: var(--space-10, 96px);
          padding-bottom: var(--space-10, 96px);
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
