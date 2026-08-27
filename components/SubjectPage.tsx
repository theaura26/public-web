import Link from 'next/link'

/* One page shape for every subject the site explains.
 *
 * The nine disciplines use it, and so do the three pillars of The Reason.
 * A reader moving from Agroculture to Biodynamic should not feel they
 * have changed websites, and nine or twelve bespoke layouts would say
 * these are unrelated subjects when the whole argument is that they are
 * one system read from different angles.
 *
 * Four parts, always the same four, always in this order:
 *
 *   what it is        the lede
 *   what is done      practice — facts, with records behind them
 *   what is measured  the figures, each carrying its own qualification
 *   what is not settled   where the record runs out
 *
 * The fourth is load-bearing rather than defensive. A farm that publishes
 * the edge of its own evidence is telling you the rest of the numbers are
 * real, and that is the only reason anyone should believe the first three
 * parts. It is never omitted, and it is never softened.
 */

export type Subject = {
  id: string
  label: string
  slug: string
  lede: string
  practice: string[]
  record?: { value: string; label: string; note?: string }[]
  open: string[]
  related?: { label: string; href: string }[]
  /** Optional mark, from /public/glyphs/coffee. */
  glyph?: string
}

export default function SubjectPage({
  subject: s,
  eyebrow,
  prev,
  next,
  basePath,
  allLabel,
  allHref,
}: {
  subject: Subject
  eyebrow: string
  prev: { label: string; slug: string }
  next: { label: string; slug: string }
  basePath: string
  allLabel: string
  allHref: string
}) {
  return (
    <main className="sp">
      <div className="section-w sp-in">
        <header className="sp-head">
          {/* Masked rather than drawn: the glyph files are single-colour
              silhouettes, and masking is how the Remarkable Circle paints
              them too. */}
          {s.glyph && (
            <span
              className="sp-glyph"
              aria-hidden
              style={{
                WebkitMaskImage: `url(/glyphs/coffee/${s.glyph})`,
                maskImage: `url(/glyphs/coffee/${s.glyph})`,
              }}
            />
          )}
          <p className="label sp-eyebrow">{eyebrow}</p>
          <h1 className="sp-title">{s.label}</h1>
          <p className="p1 sp-lede">{s.lede}</p>
        </header>

        <section className="sp-sec" aria-labelledby="sp-practice">
          <h2 className="sp-h2" id="sp-practice">What is done</h2>
          <ul className="sp-list">
            {s.practice.map((line) => (
              <li key={line} className="p2 sp-item">{line}</li>
            ))}
          </ul>
        </section>

        {!!s.record?.length && (
          <section className="sp-sec" aria-labelledby="sp-record">
            <h2 className="sp-h2" id="sp-record">What is measured</h2>
            <ul className="sp-figs">
              {s.record.map((r) => (
                <li key={r.label} className="sp-fig">
                  <span className="sp-fig-v">{r.value}</span>
                  <span className="label sp-fig-l">{r.label}</span>
                  {r.note && <span className="sp-fig-n">{r.note}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="sp-sec" aria-labelledby="sp-open-h">
          <h2 className="sp-h2" id="sp-open-h">What is not settled</h2>
          <ul className="sp-list">
            {s.open.map((line) => (
              <li key={line} className="p2 sp-item">{line}</li>
            ))}
          </ul>
        </section>

        {!!s.related?.length && (
          <section className="sp-sec" aria-labelledby="sp-read">
            <h2 className="sp-h2" id="sp-read">Read further</h2>
            <ul className="sp-rel">
              {s.related.map((r) => (
                <li key={r.href}>
                  <Link className="sp-rel-link" href={r.href}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav className="sp-ring" aria-label={allLabel}>
          <Link className="label sp-step" href={`${basePath}/${prev.slug}`}>← {prev.label}</Link>
          <Link className="label sp-step sp-all" href={allHref}>{allLabel}</Link>
          <Link className="label sp-step sp-next" href={`${basePath}/${next.slug}`}>{next.label} →</Link>
        </nav>
      </div>

      <style>{`
        .sp { padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9); background: var(--bg); }
        .sp-in { display: flex; flex-direction: column; gap: var(--space-8); }

        .sp-head { display: flex; flex-direction: column; gap: var(--space-3); max-width: 60ch; }
        .sp-glyph {
          width: 46px; height: 46px; display: block;
          margin-bottom: var(--space-2);
          background: var(--text);
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          -webkit-mask-size: contain; mask-size: contain;
        }
        .sp-eyebrow { margin: 0; color: var(--text-muted); }
        .sp-title {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(2.2rem, 7vw, 4rem);
          line-height: 1.02; letter-spacing: -0.02em;
          color: var(--text); text-wrap: balance;
        }
        .sp-lede { margin: 0; color: var(--text-body); max-width: 46ch; }

        .sp-sec { display: flex; flex-direction: column; gap: var(--space-4); }
        /* Mono, small, muted — the design system's label role. These name
           the parts of the page; they do not title chapters of an essay. */
        .sp-h2 {
          margin: 0;
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border);
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          font-weight: 400; color: var(--text-muted);
        }

        .sp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-3); max-width: 62ch; }
        .sp-item { margin: 0; color: var(--text-body); }

        .sp-figs {
          list-style: none; margin: 0; padding: 0;
          display: grid; gap: var(--space-5);
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        }
        .sp-fig { display: flex; flex-direction: column; gap: 6px; padding-top: var(--space-3); border-top: 1px solid var(--border); }
        .sp-fig-v {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          line-height: 1.1; letter-spacing: -0.02em;
          color: var(--text); font-variant-numeric: tabular-nums;
        }
        .sp-fig-l { color: var(--text-muted); }
        /* A qualification travels with its number rather than being left
           to a footnote nobody reaches. */
        .sp-fig-n {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 13px; line-height: 1.5;
          color: var(--text-muted); max-width: 34ch;
        }

        .sp-rel { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-5); }
        .sp-rel-link {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: var(--text); text-decoration: none;
        }

        .sp-ring {
          display: flex; flex-wrap: wrap; gap: var(--space-5);
          justify-content: space-between; align-items: baseline;
          padding-top: var(--space-5); border-top: 1px solid var(--border);
        }
        .sp-step { color: var(--text-muted); text-decoration: none; }
        .sp-step:hover { color: var(--text); }
        .sp-all { flex: 1; text-align: center; }
        .sp-next { text-align: right; }
        @media (max-width: 640px) {
          .sp-all { flex: none; text-align: left; }
          .sp-next { text-align: left; }
        }
      `}</style>
    </main>
  )
}
