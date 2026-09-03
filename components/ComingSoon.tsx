import Link from 'next/link'

/* The page for something that is in the structure but not yet written.
 *
 * It says what it is, says plainly that it is not here yet, and offers
 * the nearest thing that is. That is the whole job — a placeholder that
 * pretends to be a page is worse than one that admits what it is. */

export default function ComingSoon({
  title,
  section,
  sectionHref,
}: {
  title: string
  section: string
  sectionHref: string
}) {
  return (
    <main className="cs">
      <div className="section-w cs-in">
        <h1 className="cs-title">{title}</h1>
        <p className="p1 cs-note">
          This one is still to be written. It is part of how the estate works and
          will have its own page; until then the nearest account of it is
          wherever the practice shows up on the land.
        </p>
        <nav className="cs-out" aria-label="Elsewhere">
          <Link className="label cs-link" href={sectionHref}>
            All of {section}
          </Link>
          <Link className="label cs-link" href="/field-notes">
            Field Notes
          </Link>
          <Link className="label cs-link" href="/contact">
            Ask a person
          </Link>
        </nav>
      </div>

      <style>{`
        .cs {
          min-height: 72svh;
          display: flex; align-items: center;
          padding: calc(var(--nav-h) + var(--head-top)) 0 var(--space-9);
          background: var(--bg);
        }
        .cs-in { display: flex; flex-direction: column; gap: var(--space-4); max-width: 62ch; }
        .cs-title {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600; text-transform: uppercase; font-size: clamp(48px, 7.2vw, 106px); line-height: 1; letter-spacing: -0.03em;
          margin: 0; text-wrap: balance;
          color: var(--text);
        }
        .cs-note { margin: 0; color: var(--text-body); max-width: 54ch; }
        .cs-out { display: flex; flex-wrap: wrap; gap: var(--space-5); margin-top: var(--space-3); }
        .cs-link { color: var(--text-muted); text-decoration: none; }
        .cs-link:hover { color: var(--brand-accent); }
      `}</style>
    </main>
  )
}
