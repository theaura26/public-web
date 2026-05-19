'use client'

/* ── <ArticleNav> — alternate page header used in place of the global
      <Navbar> on long-form / article-style routes (e.g. /coffee). The
      app/client-layout.tsx file suppresses the global Navbar on routes
      that opt into this component so the two never both mount.

      Layout: BACK on the left, page title centred, Journals menu trigger
      on the right. ~80px tall on desktop, ~56px on mobile to match the
      existing --nav-h token where it shows up elsewhere.

      The component is intentionally lightweight — no slide-out, no theme
      toggle, no view-mode switch. Hamburger is a "back to home" cue for
      readers who want to leave the article; readers who want to keep
      exploring journals use the <Continue> cards at the bottom of the
      article body, which already exist on every journal. */

import Link from 'next/link'

export default function ArticleNav({
  title,
  backHref = '/',
  backLabel = 'Back',
}: {
  /** Page title shown in the centre of the bar (uppercase mono). */
  title: string
  /** Where the back arrow goes. Defaults to home. */
  backHref?: string
  backLabel?: string
}) {
  return (
    <nav className="article-nav" aria-label="Article navigation">
      <Link href={backHref} className="article-nav__back" aria-label={`${backLabel} to ${backHref}`}>
        <span aria-hidden className="article-nav__back-arrow">←</span>
        <span>{backLabel}</span>
      </Link>

      <div className="article-nav__title-wrap">
        <span className="article-nav__title">{title}</span>
      </div>

      <Link href="/" className="article-nav__home" aria-label="Aura home">
        <span aria-hidden>aura</span>
      </Link>

      {/* The HeroBanner ships its own fixed-position "Back to home"
          link (smart white/black colour over the photo). When an
          ArticleNav is rendered on the same page we suppress that
          one — ArticleNav already carries the back affordance and
          two stacked back arrows in the top-left is noise. */}
      <style jsx global>{`
        body:has(.article-nav) a[aria-label="Back to home"] {
          display: none !important;
        }
      `}</style>

      <style jsx>{`
        .article-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          padding: 0 var(--gutter);
          background: var(--bg);
          border-bottom: 1px solid var(--border);
          display: grid;
          /* Back + aura get content-sized cells; the title fills the
             middle so its centred text never collides with either edge. */
          grid-template-columns: auto 1fr auto;
          gap: var(--space-5);
          align-items: center;
          z-index: 50;
        }
        .article-nav__back {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
        }
        .article-nav__back-arrow {
          font-size: 14px;
          line-height: 1;
        }
        .article-nav__title-wrap {
          justify-self: center;
          text-align: center;
          /* Clip rather than wrap if the title is longer than the
             middle column can hold on a narrow viewport. */
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .article-nav__title {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          color: var(--text);
        }
        .article-nav__home {
          justify-self: end;
          font-family: var(--font-grotesque);
          font-size: 22px;
          font-weight: 400;
          color: var(--text);
          text-decoration: none;
          letter-spacing: -0.01em;
        }

        @media (max-width: 768px) {
          /* On mobile we collapse to the existing 56px nav height so
             the article header doesn't eat extra vertical real-estate.
             Title font shrinks one step. */
          .article-nav {
            height: var(--nav-h, 56px);
          }
          .article-nav__title {
            font-size: 11px;
            letter-spacing: 1.5px;
          }
          .article-nav__home {
            font-size: 18px;
          }
        }
      `}</style>
    </nav>
  )
}
