import Link from 'next/link'
import { SECTIONS } from '@/lib/site-nav'

/* A section's own page: what is in it, as a list you can read down.
 *
 * Items still to be written are listed and linked — they go to their own
 * stub, which says so. Nothing is hidden and nothing is dimmed; the
 * structure is the point, and a reader is allowed to see the shape of a
 * thing before all of it exists. */

export default function SectionIndex({ id }: { id: string }) {
  const section = SECTIONS.find((s) => s.id === id)
  if (!section) return null

  return (
    <main className="sx">
      <div className="section-w sx-in">
        <header className="sx-head">
          <h1 className="sx-title">{section.label}</h1>
          {section.note && <p className="p1 sx-note">{section.note}</p>}
        </header>

        <ul className="sx-list">
          {section.items.map((item) => (
            <li key={item.href + item.label} className="sx-row">
              <Link className="sx-link" href={item.href}>
                <span className="sx-label">{item.label}</span>
                {item.soon && <span className="label sx-soon">Not yet written</span>}
              </Link>
              {item.children && (
                <ul className="sx-sub">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <Link className="sx-sub-link" href={child.href}>
                        <span>{child.label}</span>
                        {child.soon && <span className="sx-soon-dot" aria-hidden />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .sx { padding: calc(var(--nav-h) + var(--head-top)) 0 var(--space-9); background: var(--bg); }
        .sx-in { display: flex; flex-direction: column; gap: var(--head-bottom); }
        .sx-head { display: flex; flex-direction: column; gap: var(--space-3); max-width: 46ch; }
        .sx-title {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600; text-transform: uppercase; font-size: clamp(44px, 9vw, 88px); line-height: 1.02; letter-spacing: -0.06em;
          margin: 0; text-wrap: balance;
          color: var(--text);
        }
        .sx-note { margin: 0; color: var(--text-body); }

        .sx-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--border); }
        .sx-group {
          margin: var(--space-6) 0 0;
          color: var(--text-muted);
        }
        .sx-link {
          display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-4);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          transition: opacity var(--dur-base) var(--ease);
        }
        .sx-link:hover { opacity: 0.6; }
        .sx-label {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400; font-size: clamp(24px, 3vw, 32px); line-height: 1.15; letter-spacing: -0.03em;
          color: var(--text);
        }
        .sx-soon { flex: none; color: var(--text-muted); }

        /* The tier beneath, always open on the section's own page —
           this is the page for reading the whole structure, so nothing
           here should need hovering to be seen. */
        .sx-sub { list-style: none; margin: 0; padding: 0 0 var(--space-4); }
        .sx-sub-link {
          font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; line-height: normal;
          display: inline-flex; gap: 8px;
          color: var(--text-muted); text-decoration: none;
        }
        .sx-sub-link:hover { color: var(--text); }
        .sx-soon-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: currentColor; opacity: 0.5;
        }
      `}</style>
    </main>
  )
}
