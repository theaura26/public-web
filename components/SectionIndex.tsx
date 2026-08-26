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

  /* Items that carry a group heading are printed under it, once. */
  let lastGroup: string | undefined

  return (
    <main className="sx">
      <div className="section-w sx-in">
        <header className="sx-head">
          <h1 className="sx-title">{section.label}</h1>
          {section.note && <p className="p1 sx-note">{section.note}</p>}
        </header>

        <ul className="sx-list">
          {section.items.map((item) => {
            const openGroup = item.group && item.group !== lastGroup
            if (item.group) lastGroup = item.group
            return (
              <li key={item.href + item.label} className="sx-row">
                {openGroup && <p className="label sx-group">{item.group}</p>}
                <Link className="sx-link" href={item.href}>
                  <span className="sx-label">{item.label}</span>
                  {item.soon && <span className="label sx-soon">Not yet written</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <style>{`
        .sx { padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9); background: var(--bg); }
        .sx-in { display: flex; flex-direction: column; gap: var(--space-8); }
        .sx-head { display: flex; flex-direction: column; gap: var(--space-3); max-width: 46ch; }
        .sx-title {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(2.2rem, 7vw, 4rem);
          line-height: 1.02; letter-spacing: -0.02em;
          color: var(--text);
          text-wrap: balance;
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
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(1.25rem, 3vw, 1.9rem);
          line-height: 1.2; letter-spacing: -0.01em;
          color: var(--text);
        }
        .sx-soon { flex: none; color: var(--text-muted); }
      `}</style>
    </main>
  )
}
