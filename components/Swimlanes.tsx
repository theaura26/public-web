'use client'

import Link from 'next/link'
import { CATEGORIES, notesIn, type NoteEntry } from '@/lib/field-notes'
import { FROM_AURA } from '@/lib/from-aura'

/* ── Lanes ────────────────────────────────────────────────────────
   A section's whole contents, one lane per group, each scrolling
   sideways off the right edge. Everything is visible in a handful of
   gestures rather than one long column, and a reader who only wants one
   group never scrolls past the others.

   Two sections are built this way — Field Notes and From Aura — so the
   layout lives here once and each supplies its own lanes. An item can
   legitimately appear in more than one lane; in Field Notes a
   cross-listed note does exactly that.
*/

export type Lane = {
  id: string
  label: string
  lede: string
  items: NoteEntry[]
}

function Card({ note }: { note: NoteEntry }) {
  const inner = (
    <>
      <span className="lane-plate" data-noimg={note.img ? undefined : 'true'} aria-hidden>
        {note.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={note.img} alt="" loading="lazy" decoding="async" />
        ) : null}
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

export function Swimlanes({
  title, lede, lanes,
}: { title: string; lede: string; lanes: Lane[] }) {
  return (
    <main className="sw">
      <div className="section-w sw-head">
        <h1 className="sw-h">{title}</h1>
        <p className="sw-lede">{lede}</p>
      </div>

      {lanes.map((cat) => {
        const notes = cat.items
        if (!notes.length) return null
        return (
          <section className="lane" key={cat.id} aria-labelledby={`lane-${cat.id}`}>
            <div className="section-w lane-bar">
              <h2 className="lane-h" id={`lane-${cat.id}`}>{cat.label}</h2>
            </div>
            {/* The rail belongs to the wrapper. A narrow max-width on
                the same element that carries section-w's padding fights
                it, and the lede lands 40px left of every other line. */}
            <div className="section-w">
              <p className="lane-lede">{cat.lede}</p>
            </div>

            {/* Full-bleed, so the row runs off the right edge instead of
                stopping at the rail. The track's own padding reproduces
                the rail on the left so the first card still starts on
                the heading's line. */}
            <div className="lane-bleed">
              <div className="lane-scroll">
                <div className="lane-track">
                  {notes.map((n) => <Card key={`${cat.id}-${n.href}`} note={n} />)}
                </div>
              </div>
              {/* backdrop-filter inline: styled-jsx drops it from emitted
                  rules on this build, the same way it does for the menu
                  vignette and the homepage slider. */}
              <div
                className="lane-fade"
                aria-hidden
                style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
              />
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
          padding: calc(var(--nav-h) + var(--head-top)) 0 var(--section-gap);
          min-height: 100svh;
          display: flex; flex-direction: column;
          gap: var(--head-bottom);
        }
        .sw .sw-head { align-items: center; text-align: center; display: flex; flex-direction: column; gap: var(--space-5); }
        /* The banner title spec, unchanged — same size, weight, tracking
           and measure as every journal hero. This page had drifted to a
           smaller size and much tighter tracking, which read as a
           different family of page. */
        .sw .sw-h {
          margin: 0 auto;
          font-family: var(--font-grotesque), sans-serif;
          font-weight: 600;
          font-size: clamp(48px, 7.2vw, 106px);
          line-height: 1;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          color: var(--text);
          max-width: min(90vw, 7.5em);
          text-wrap: balance;
          text-align: center;
        }
        /* Centred under a centred title, and set in mono: the lede here
           states what the page is rather than beginning an argument, so
           it takes the label role rather than the body one. */
        .sw .sw-lede {
          font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; line-height: normal;
          margin: 0; max-width: 56ch;
          color: var(--text-muted);
        }

        /* ── one lane ── */
        .sw .lane { display: flex; flex-direction: column; gap: var(--space-4); }
        /* The heading and the rule beneath it. It was a two-item flex
           row until the 'all N' link came out; with one child the
           space-between and the gap had nothing left to do. */
        .sw .lane-bar {
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--border);
        }
        .sw .lane-h {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400; font-size: clamp(24px, 3vw, 32px); line-height: 1.15; letter-spacing: -0.03em;
          margin: 0;
        }
        .sw .lane-lede {
          font-family: var(--font-sans); font-size: 14px; line-height: 1.6; letter-spacing: normal; color: var(--text-body);
          margin: 0; max-width: 60ch;
        }

        /* The rail bleeds past the gutter so it reads as continuing
           beyond the viewport rather than stopping at the margin. */
        .sw .lane-bleed {
          position: relative;
          width: 100vw;
          margin-left: calc(50% - 50vw);
        }
        /* The row dissolves off the right rather than hard-cropping —
           the same gesture as the homepage slider and the menu's
           bottom vignette. */
        .sw .lane-fade {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: clamp(64px, 12vw, 200px);
          pointer-events: none;
          z-index: 2;
          background: linear-gradient(to right, transparent, var(--bg) 82%);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 55%);
          mask-image: linear-gradient(to right, transparent, #000 55%);
        }
        .sw .lane-scroll {
          overflow-x: auto;
          /* No scroll-snap. Snapping pulls the first card flush to the
             container edge, which scrolls straight past the track's rail
             padding and lands it at x=0 instead of on the heading. */
          padding: var(--space-4) 0 var(--space-5);
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .sw .lane-scroll::-webkit-scrollbar { display: none; height: 0; }
        .sw .lane-track {
          display: flex; gap: clamp(16px, 2.2vw, 32px);
          width: max-content;
          /* Reproduces the rail so the first card lines up with the lane
             heading above it, and the last runs past the right edge. */
          padding-left: max(var(--gutter), calc(50vw - var(--max-w) / 2 + var(--gutter)));
          padding-right: var(--gutter);
        }

        .sw .lane-card {
          flex: none; width: clamp(280px, 36vw, 520px);
          display: flex; flex-direction: column; gap: var(--space-3);
          text-decoration: none; color: inherit;
        }
        /* Announced, not open. Dimmed and inert, and unlabelled — the
           same treatment the menu gives Munduk and Punakha. The stamp
           said in words what the grey already says. */
        .sw .lane-card.is-soon { cursor: default; opacity: 0.55; }

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

        .sw .lane-t {
          font-family: var(--font-grotesque), sans-serif; font-weight: 400; font-size: clamp(24px, 3vw, 32px); line-height: 1.15; letter-spacing: -0.03em;
          transition: color var(--dur-base) var(--ease);
          color: var(--text);
        }
        .sw .lane-card:hover .lane-t { color: var(--brand-accent); }
        .sw .lane-card.is-soon .lane-t { color: var(--text-muted); }
        .sw .lane-from {
          font-family: var(--font-mono), monospace; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; line-height: normal;
          color: var(--text-muted);
        }

        @media (prefers-reduced-motion: reduce) {
          .sw .lane-plate img { transition: none; }
        }
      `}</style>
    </main>
  )
}

/** Field Notes: one lane per category, in taxonomy order. */
export function NoteSwimlanes() {
  const lanes: Lane[] = CATEGORIES
    .map((c) => ({ id: c.id, label: c.label, lede: c.lede, items: notesIn(c.id) }))
    .filter((l) => l.items.length)
  return (
    <Swimlanes
      title="Field Notes"
      lede="What the estate has learned, sorted by the discipline that learned it. Some notes sit in more than one lane, which is usually a sign they matter."
      lanes={lanes}
    />
  )
}

/** From Aura: the land, the atelier, and the trade desk. */
export function FromAuraSwimlanes() {
  return (
    <Swimlanes
      title="From Aura"
      lede="Three directions out of one estate — what the land grows, what the atelier makes, and what is offered to the people who buy at volume. Nothing here is for sale yet."
      lanes={FROM_AURA}
    />
  )
}
