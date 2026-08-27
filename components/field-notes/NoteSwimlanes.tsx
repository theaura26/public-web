'use client'

import Link from 'next/link'
import { CATEGORIES, notesIn, type NoteEntry } from '@/lib/field-notes'

/* ── Field Notes, View All ────────────────────────────────────────
   One lane per category, each scrolling sideways. The whole corpus is
   visible in four gestures rather than one long column, and a reader
   who only cares about Labs never has to scroll past Biodynamic.
   Every lane heads to its own category page for the full list.

   Cross-listed pages appear in whichever lanes claim them — the same
   card can legitimately show up twice.
*/

function Card({ note }: { note: NoteEntry }) {
  const inner = (
    <>
      <span className="lane-plate" data-noimg={note.img ? undefined : 'true'} aria-hidden>
        {note.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={note.img} alt="" loading="lazy" decoding="async" />
        ) : null}
        {note.status === 'soon' && <span className="lane-soon">Coming soon</span>}
      </span>
      <span className="lane-t">{note.title}</span>
      {note.from && <span className="lane-from">In {note.from}</span>}
    </>
  )

  return note.status === 'soon' ? (
    <span className="lane-card is-soon" aria-disabled>{inner}</span>
  ) : (
    <Link href={note.href} className="lane-card">{inner}</Link>
  )
}

export function NoteSwimlanes() {
  return (
    <main className="sw">
      <div className="section-w sw-head">
        <h1 className="sw-h">Field Notes</h1>
        <p className="sw-lede">
          What the estate has learned, sorted by the discipline that learned
          it. Some notes sit in more than one lane, which is usually a sign
          they matter.
        </p>
      </div>

      {CATEGORIES.map((cat) => {
        const notes = notesIn(cat.id)
        if (!notes.length) return null
        return (
          <section className="lane" key={cat.id} aria-labelledby={`lane-${cat.id}`}>
            <div className="section-w lane-bar">
              <h2 className="lane-h" id={`lane-${cat.id}`}>{cat.label}</h2>
              <Link href={`/field-notes/${cat.id}`} className="lane-all">
                All {notes.length}
                <span aria-hidden> →</span>
              </Link>
            </div>
            {/* The rail belongs to the wrapper. A narrow max-width on
                the same element that carries section-w's padding fights
                it, and the lede lands 40px left of every other line. */}
            <div className="section-w">
              <p className="lane-lede">{cat.lede}</p>
            </div>

            <div className="section-w">
              <div className="lane-scroll">
                <div className="lane-track">
                  {notes.map((n) => <Card key={`${cat.id}-${n.href}`} note={n} />)}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <style jsx global>{`
        /* Global, not scoped: styled-jsx cannot put its scope class on a
           <Link>, and the cards are Links. Every selector is therefore
           nested under .sw by hand so nothing escapes this page. */
        .sw {
          background: var(--bg); color: var(--text);
          padding: calc(var(--nav-h) + var(--space-9)) 0 var(--section-gap);
          min-height: 100svh;
          display: flex; flex-direction: column;
          gap: clamp(56px, 8vh, 96px);
        }
        .sw .sw-head { display: flex; flex-direction: column; gap: var(--space-5); }
        /* The banner title spec, unchanged — same size, weight, tracking
           and measure as every journal hero. This page had drifted to a
           smaller size and much tighter tracking, which read as a
           different family of page. */
        .sw .sw-h {
          margin: 0;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          font-size: clamp(48px, 7.2vw, 106px);
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: var(--text);
          max-width: min(90vw, 7.5em);
          text-wrap: balance;
        }
        .sw .sw-lede {
          font-family: var(--font-sans);
          font-size: 16px; line-height: 1.55; font-weight: 400;
          color: var(--text-body); margin: 0; max-width: 52ch;
        }

        /* ── one lane ── */
        .sw .lane { display: flex; flex-direction: column; gap: var(--space-4); }
        .sw .lane-bar {
          display: flex; align-items: baseline; justify-content: space-between;
          gap: var(--space-5);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border);
        }
        .sw .lane-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(24px, 3vw, 40px);
          line-height: 1.1; letter-spacing: -0.035em;
          margin: 0; color: var(--text);
        }
        .sw .lane-all {
          font-family: var(--font-mono), monospace;
          font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--text-muted); text-decoration: none; white-space: nowrap;
          transition: color var(--dur-base) var(--ease);
        }
        .sw .lane-all:hover { color: var(--brand-accent); }
        .sw .lane-lede {
          font-size: 15px; line-height: 1.55;
          color: var(--text-muted); margin: 0; max-width: 60ch;
        }

        /* The rail bleeds past the gutter so it reads as continuing
           beyond the viewport rather than stopping at the margin. */
        /* Scrolls inside the rail rather than across the viewport, so
           the first card starts on the same line as the lane heading.
           A full-bleed track would need its padding to reproduce the
           rail's own arithmetic, and would drift the moment either
           changed. */
        .sw .lane-scroll {
          overflow-x: auto;
          scroll-snap-type: x proximity;
          padding: var(--space-4) 0 var(--space-5);
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .sw .lane-scroll::-webkit-scrollbar { display: none; height: 0; }
        .sw .lane-track {
          display: flex; gap: clamp(16px, 2.2vw, 32px);
          width: max-content;
        }

        .sw .lane-card {
          scroll-snap-align: start;
          flex: none; width: clamp(240px, 30vw, 420px);
          display: flex; flex-direction: column; gap: var(--space-3);
          text-decoration: none; color: inherit;
        }
        .sw .lane-card.is-soon { cursor: default; }

        .sw .lane-plate {
          position: relative; display: block;
          aspect-ratio: 16 / 9; overflow: hidden;
          border-radius: var(--radius-1);
          background: var(--bg-card);
        }
        .sw .lane-plate img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform var(--dur-slow) var(--ease-out);
        }
        .sw .lane-card:hover .lane-plate img { transform: scale(1.04); }

        /* An unwritten note has no photograph — a flat plate, not an
           empty box. */
        .sw .lane-plate[data-noimg='true'] { background: var(--text-muted); opacity: 0.16; }
        .sw .lane-card.is-soon .lane-plate {
          background: var(--text-muted); opacity: 0.18;
        }
        .sw .lane-soon {
          position: absolute; inset: 0; display: grid; place-items: center;
          font-family: var(--font-mono), monospace;
          font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase;
          color: var(--bg);
        }

        .sw .lane-t {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400;
          font-size: clamp(16px, 1.5vw, 20px);
          line-height: 1.2; letter-spacing: -0.02em;
          color: var(--text);
          transition: color var(--dur-base) var(--ease);
        }
        .sw .lane-card:hover .lane-t { color: var(--brand-accent); }
        .sw .lane-card.is-soon .lane-t { color: var(--text-muted); }
        .sw .lane-from {
          font-family: var(--font-mono), monospace;
          font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
          color: var(--text-muted);
        }

        @media (prefers-reduced-motion: reduce) {
          .sw .lane-plate img { transition: none; }
        }
      `}</style>
    </main>
  )
}
