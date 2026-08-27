import Link from 'next/link'
import { DISCIPLINES, type Discipline } from '@/lib/disciplines'

/* One of the nine, as a page.
 *
 * Nine pages sharing one shape rather than nine designs: they are the
 * nine glyphs on the Remarkable Circle, and the circle's whole argument
 * is that they are one system read nine ways. Giving each its own layout
 * would say the opposite.
 *
 * The page has four parts and always the same four: what the discipline
 * is, what is done, what is measured, and what is not yet known. The
 * fourth is not a disclaimer — it is load-bearing. A farm that publishes
 * where its record runs out is telling you the rest of the numbers are
 * real, and that is the only reason to believe any of them.
 */

export default function DisciplinePage({ d }: { d: Discipline }) {
  const i = DISCIPLINES.findIndex((x) => x.id === d.id)
  const next = DISCIPLINES[(i + 1) % DISCIPLINES.length]
  const prev = DISCIPLINES[(i - 1 + DISCIPLINES.length) % DISCIPLINES.length]

  return (
    <main className="dp">
      <div className="section-w dp-in">
        <header className="dp-head">
          {/* The glyph as it sits on the ring. Masked rather than drawn,
              because the source files are single-colour silhouettes and
              the mask is how the circle itself paints them. */}
          <span
            className="dp-glyph"
            aria-hidden
            style={{
              WebkitMaskImage: `url(/glyphs/coffee/${d.glyph})`,
              maskImage: `url(/glyphs/coffee/${d.glyph})`,
            }}
          />
          <p className="label dp-eyebrow">
            The Regenerative Life · {String(i + 1).padStart(2, '0')} of {DISCIPLINES.length}
          </p>
          <h1 className="dp-title">{d.label}</h1>
          <p className="p1 dp-lede">{d.lede}</p>
        </header>

        <section className="dp-sec" aria-labelledby="dp-practice">
          <h2 className="dp-h2" id="dp-practice">What is done</h2>
          <ul className="dp-list">
            {d.practice.map((line) => (
              <li key={line} className="p2 dp-item">{line}</li>
            ))}
          </ul>
        </section>

        {!!d.record?.length && (
          <section className="dp-sec" aria-labelledby="dp-record">
            <h2 className="dp-h2" id="dp-record">What is measured</h2>
            <ul className="dp-figs">
              {d.record.map((r) => (
                <li key={r.label} className="dp-fig">
                  <span className="dp-fig-v">{r.value}</span>
                  <span className="label dp-fig-l">{r.label}</span>
                  {r.note && <span className="dp-fig-n">{r.note}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="dp-sec dp-open" aria-labelledby="dp-open-h">
          <h2 className="dp-h2" id="dp-open-h">What is not settled</h2>
          <ul className="dp-list">
            {d.open.map((line) => (
              <li key={line} className="p2 dp-item">{line}</li>
            ))}
          </ul>
        </section>

        {!!d.related?.length && (
          <section className="dp-sec" aria-labelledby="dp-read">
            <h2 className="dp-h2" id="dp-read">Read further</h2>
            <ul className="dp-rel">
              {d.related.map((r) => (
                <li key={r.href}>
                  <Link className="dp-rel-link" href={r.href}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Around the ring rather than back to an index: the nine are a
            cycle, and the next one along is the next one along. */}
        <nav className="dp-ring" aria-label="The other disciplines">
          <Link className="label dp-step" href={`/regenerative-life/${prev.slug}`}>
            ← {prev.label}
          </Link>
          <Link className="label dp-step dp-all" href="/regenerative-life">
            All nine
          </Link>
          <Link className="label dp-step dp-next" href={`/regenerative-life/${next.slug}`}>
            {next.label} →
          </Link>
        </nav>
      </div>

      <style>{`
        .dp { padding: calc(var(--nav-h) + var(--space-9)) 0 var(--space-9); background: var(--bg); }
        .dp-in { display: flex; flex-direction: column; gap: var(--space-8); }

        .dp-head { display: flex; flex-direction: column; gap: var(--space-3); max-width: 60ch; }
        .dp-glyph {
          width: 46px; height: 46px;
          display: block;
          margin-bottom: var(--space-2);
          background: var(--text);
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          -webkit-mask-size: contain; mask-size: contain;
        }
        .dp-eyebrow { margin: 0; color: var(--text-muted); }
        .dp-title {
          margin: 0;
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(2.2rem, 7vw, 4rem);
          line-height: 1.02; letter-spacing: -0.02em;
          color: var(--text);
          text-wrap: balance;
        }
        .dp-lede { margin: 0; color: var(--text-body); max-width: 46ch; }

        .dp-sec { display: flex; flex-direction: column; gap: var(--space-4); }
        /* .p2 in mono, the design system's label role — these name the
           parts of the page rather than titling sections of an essay. */
        .dp-h2 {
          margin: 0;
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--border);
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          font-weight: 400;
          color: var(--text-muted);
        }

        .dp-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-3); max-width: 62ch; }
        .dp-item { margin: 0; color: var(--text-body); }

        .dp-figs {
          list-style: none; margin: 0; padding: 0;
          display: grid; gap: var(--space-5);
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
        }
        .dp-fig { display: flex; flex-direction: column; gap: 6px; padding-top: var(--space-3); border-top: 1px solid var(--border); }
        .dp-fig-v {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          line-height: 1.1; letter-spacing: -0.02em;
          color: var(--text);
          font-variant-numeric: tabular-nums;
        }
        .dp-fig-l { color: var(--text-muted); }
        /* Where the record qualifies itself, the qualification travels
           with the number instead of being left to a footnote nobody
           reaches. */
        .dp-fig-n {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: 13px; line-height: 1.5;
          color: var(--text-muted);
          max-width: 34ch;
        }

        .dp-rel { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--space-5); }
        .dp-rel-link {
          font-family: var(--font-sans), system-ui, sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.4rem);
          color: var(--text); text-decoration: none;
        }

        .dp-ring {
          display: flex; flex-wrap: wrap; gap: var(--space-5);
          justify-content: space-between; align-items: baseline;
          padding-top: var(--space-5);
          border-top: 1px solid var(--border);
        }
        .dp-step { color: var(--text-muted); text-decoration: none; }
        .dp-step:hover { color: var(--text); }
        .dp-all { flex: 1; text-align: center; }
        .dp-next { text-align: right; }
        @media (max-width: 640px) {
          .dp-all { flex: none; text-align: left; }
          .dp-next { text-align: left; }
        }
      `}</style>
    </main>
  )
}
