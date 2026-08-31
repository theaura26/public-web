'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

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

      {/* Where the feed stops and the argument starts. The entries say
          what was done; these are the pages that say why, and what the
          numbers in them mean. */}
      <nav className="section-w outbound" aria-label="Read on">
        <p className="out-label label">Where this comes from</p>
        <ul className="out-list">
          <li>
            <Link href="/regenerative-life/the-plantation">The Plantation</Link>
            <span>The hundred and fifty acres these entries are logged against.</span>
          </li>
          <li>
            <Link href="/regenerative-life/vedic-and-biodynamic">Vedic &amp; Biodynamic</Link>
            <span>The preparations most of this feed is an application of.</span>
          </li>
          <li>
            <Link href="/regenerative-life/aura-intelligence">Aura Intelligence</Link>
            <span>How the estate is read, and why every event carries a name.</span>
          </li>
          <li>
            <Link href="/field-notes">Field Notes</Link>
            <span>What the estate has learned, written down at length.</span>
          </li>
        </ul>
      </nav>

      <style jsx>{`
        /* The hero breaks the rail, so the rail cannot wrap it. */
        .page { overflow-x: clip; }

        .body {
          padding-top: var(--space-10, 96px);
          padding-bottom: var(--space-10, 96px);
        }

        .outbound {
          padding-bottom: var(--space-11, 120px);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .out-label { margin: 0; color: var(--text-muted); }
        .out-list {
          list-style: none;
          margin: 0;
          padding: 0;
          border-top: 1px solid var(--border-strong);
        }
        .out-list li {
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(0, 11fr);
          gap: clamp(16px, 3vw, 48px);
          align-items: baseline;
          padding: 18px 0;
          border-bottom: 1px solid var(--border);
        }
        .out-list :global(a) {
          font-weight: 600;
          letter-spacing: -0.01em;
          text-decoration: none;
          color: var(--text);
        }
        .out-list :global(a):hover {
          text-decoration: underline;
          text-decoration-color: var(--brand-accent);
          text-underline-offset: var(--rule-offset);
        }
        .out-list span { color: var(--text-body); }
        @media (max-width: 700px) {
          .out-list li { grid-template-columns: 1fr; gap: 6px; }
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
