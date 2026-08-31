'use client'

import Link from 'next/link'
import { CATEGORIES, type CategoryId, type NoteEntry } from '@/lib/field-notes'

/* ── Field Notes listing ──────────────────────────────────────────
   Used by the index and by each category page. Rows rather than a
   card grid: these are essays, and a row gives the description room
   to do its job.

   A commissioned-but-unwritten note renders on a flat grey plate and
   is not a link — same treatment as the menu feed, so the two agree.
*/

export function NoteIndex({
  title,
  lede,
  standfirst,
  active,
  notes,
}: {
  title: string
  lede: string
  standfirst?: string
  /** Highlights the current category in the filter row. */
  active?: CategoryId | 'all'
  notes: NoteEntry[]
}) {
  return (
    <main className="fn">
      <div className="section-w">
        <header className="fn-head">
          <h1 className="fn-h">{title}</h1>
          <p className="fn-lede">{lede}</p>
          {standfirst && <p className="fn-standfirst">{standfirst}</p>}
        </header>

        <nav className="fn-filters" aria-label="Field Notes categories">
          <Link
            href="/field-notes"
            className={`fn-filter ${active === 'all' ? 'is-on' : ''}`}
            aria-current={active === 'all' ? 'page' : undefined}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={`/field-notes/${c.id}`}
              className={`fn-filter ${active === c.id ? 'is-on' : ''}`}
              aria-current={active === c.id ? 'page' : undefined}
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <ul className="fn-list">
          {notes.map((n) => {
            const inner = (
              <>
                <span className="fn-plate" data-noimg={n.img ? undefined : 'true'} aria-hidden>
                  {n.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.img} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </span>
                <span className="fn-text">
                  <span className="fn-t">{n.title}</span>
                  {n.from && <span className="fn-from">In {n.from}</span>}
                </span>
              </>
            )
            return (
              <li key={n.href} className="fn-row">
                {n.status === 'soon' ? (
                  <span className="fn-item is-soon" aria-disabled>{inner}</span>
                ) : (
                  <Link href={n.href} className="fn-item">{inner}</Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <style jsx global>{`
        /* Global, not scoped: styled-jsx cannot put its scope class on a
           <Link>, and the rows and filters are Links. Every selector is
           nested under .fn by hand so nothing escapes this page. */
        .fn {
          background: var(--bg); color: var(--text);
          padding: calc(var(--nav-h) + var(--head-top)) 0 var(--section-gap);
          min-height: 100svh;
        }
        .fn .fn-head { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-5); }
        .fn .fn-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 600; text-transform: uppercase; font-size: clamp(48px, 7.2vw, 106px); line-height: 1; letter-spacing: -0.03em;
          margin: 0; max-width: 14ch; text-wrap: balance; text-align: center;
          color: var(--text);
        }
        /* Mono and centred, matching the Field Notes index — a lede that
           says what a category is takes the label role. */
        /* Body measure, centred under the mono lede. The lede names the
           shelf; this says what is on it. */
        .fn .fn-standfirst {
          margin: var(--space-4) auto 0;
          max-width: 62ch;
          text-align: center;
          color: var(--text-body);
        }
        .fn .fn-lede {
          font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; line-height: normal;
          margin: 0; max-width: 42ch;
          color: var(--text-muted);
        }

        /* ── category filters ── */
        .fn .fn-filters {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin: var(--head-bottom) 0 clamp(38px, 6vh, 67px);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--border);
        }
        .fn .fn-filter {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--text-muted); text-decoration: none;
          padding: 7px 14px; border: 1px solid var(--border);
          border-radius: 999px;
          transition: color var(--dur-base) var(--ease),
                      border-color var(--dur-base) var(--ease);
        }
        .fn .fn-filter:hover { color: var(--text); border-color: var(--border-strong); }
        .fn .fn-filter.is-on { color: var(--brand-accent); border-color: var(--brand-accent); }

        /* ── the cards ──
           Two across, image over text. A note is chosen by the look of
           the place it is about, so the picture gets the room a row
           could never give it. */
        .fn .fn-list {
          list-style: none; margin: 0; padding: 0;
          display: grid; gap: clamp(28px, 4vw, 56px);
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .fn .fn-row { border-bottom: 0; }
        .fn .fn-item {
          display: flex; flex-direction: column;
          gap: clamp(14px, 1.6vw, 20px);
          text-decoration: none; color: inherit;
        }
        @media (max-width: 640px) {
          .fn .fn-list { grid-template-columns: minmax(0, 1fr); }
        }
        /* Matches the menu: dimmed, inert, unlabelled. */
        .fn .fn-item.is-soon { cursor: default; opacity: 0.55; }

        .fn .fn-plate {
          position: relative; display: block;
          aspect-ratio: 16 / 9; overflow: hidden;
          border-radius: var(--radius-1);
          background: var(--bg-card);
          align-self: start;
        }
        .fn .fn-plate img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease-out);
        }
        .fn .fn-item:hover .fn-plate img { transform: scale(1.04); }
        .fn .fn-plate[data-noimg='true'] { background: var(--text-muted); opacity: 0.16; }
        .fn .fn-item.is-soon .fn-plate { background: var(--text-muted); opacity: 0.18; }

        .fn .fn-text { display: flex; flex-direction: column; gap: var(--space-3); }
        .fn .fn-t {
          font-family: var(--font-sans); font-size: 16px; line-height: 1.55; letter-spacing: normal;
          transition: color var(--dur-base) var(--ease);
          color: var(--text);
        }
        .fn .fn-item:hover .fn-t { color: var(--brand-accent); }
        .fn .fn-item.is-soon .fn-t { color: var(--text-muted); }
        .fn .fn-from {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          line-height: normal;
          color: var(--text-muted);
        }

        @media (max-width: 640px) {
          .fn .fn-item { grid-template-columns: 1fr; gap: var(--space-4); }
          .fn .fn-plate { max-width: 220px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fn .fn-plate img { transition: none; }
        }
      
        @media (max-width: 768px) {
          .fn .fn-list { grid-template-columns: minmax(0, 1fr); gap: var(--space-7); }
          .fn .fn-filters { margin: var(--space-7) 0 var(--space-6); }

        }
      `}</style>
    </main>
  )
}
