'use client'

import Image from 'next/image'
import Reveal from '@/components/RevealOnScroll'
import FeedEntry from './FeedEntry'
import CategoryGlyph from './CategoryGlyph'
import { categoryThumbnail } from '@/lib/aura-live/gallery'
import { CATEGORY_LABEL } from '@/lib/aura-live/taxonomy'
import type { PublicEntry } from '@/lib/aura-live/feed'

/* The timeline.
 *
 * A dashed line down the middle of the page, cards centred on it, and
 * the month set as a pill that sits on the line and breaks the run.
 * Each card carries a circular mark with
 * its subject's picture — the same picture on every entry in that
 * subject, which is what keeps it reading as an icon rather than as a
 * photograph of the event. It is decorative and hidden from screen
 * readers; the subject is written out beside it either way.
 *
 * The empty days between two entries are held open at the same scale as
 * the entries themselves. That is the argument for building it this way:
 * a feed that only draws the days it published makes a quiet fortnight
 * look exactly like a busy one, and this page's whole claim is that it
 * shows what actually happened. A three-week stretch where nothing met
 * the bar is visibly three weeks long — shown by the length of the line,
 * never written out as a number.
 */

const MS_DAY = 86_400_000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

/* Long enough to read as a real interval, short enough that a gap does
   not become the page. A season quieter than this is drawn at the cap;
   the line is a measure of the page, not a report card. */
const MAX_GAP_DAYS = 16

/* What one empty day is worth in height. It was a 10px mark on a 6px gap
   when the days were drawn as ticks; the marks are gone and the measure
   they set is the part worth keeping. */
const DAY_HEIGHT = 16

type Row =
  | { kind: 'month'; key: string; label: string }
  | { kind: 'gap'; key: string; days: number }
  | { kind: 'entry'; key: string; entry: PublicEntry; monthLabel?: string }

function buildRows(entries: PublicEntry[], thisYear: number): Row[] {
  const rows: Row[] = []
  let previousDay: string | null = null
  let previousMonth: string | null = null

  for (const entry of entries) {
    const day = entry.occurredOn
    const month = day.slice(0, 7)

    if (previousDay && previousDay !== day) {
      const elapsed = Math.round(
        (Date.parse(`${previousDay}T00:00:00Z`) - Date.parse(`${day}T00:00:00Z`)) / MS_DAY,
      ) - 1
      if (elapsed > 0) rows.push({ kind: 'gap', key: `gap-${previousDay}-${day}`, days: elapsed })
    }

    /* The month rides on its first entry rather than sitting in a row of
       its own, so it lands beside the mark it names. */
    let monthLabel: string | undefined
    if (month !== previousMonth) {
      const year = Number(day.slice(0, 4))
      const name = MONTHS[Number(day.slice(5, 7)) - 1]
      monthLabel = year === thisYear ? name : `${name} ${year}`
      previousMonth = month
    }

    rows.push({ kind: 'entry', key: entry.id, entry, monthLabel })
    previousDay = day
  }
  return rows
}

export default function Timeline({ entries }: { entries: PublicEntry[] }) {
  const thisYear = new Date().getUTCFullYear()
  const rows = buildRows(entries, thisYear)
  const position = new Map(entries.map((e, i) => [e.id, i]))

  return (
    <ol className="tl">
      {rows.map((row) => {
        if (row.kind === 'month') return null

        if (row.kind === 'gap') {
          const shown = Math.min(row.days, MAX_GAP_DAYS)
          return (
            /* Empty on purpose. The gap used to draw its own run of tick
               marks and, past sixteen days, write the count out — which
               put a second texture on a line that already had one, and
               announced the estate's quietest stretches in words. Neither
               is the page's job. It holds the space open at the same
               scale as before and lets the one line run through it, so a
               quiet fortnight still looks like a fortnight without being
               labelled as one. */
            <li
              key={row.key}
              className="row r-gap"
              aria-hidden="true"
              style={{ height: `${shown * DAY_HEIGHT}px` }}
            />
          )
        }

        const entry = row.entry
        const thumb = categoryThumbnail(entry.category)

        return (
          <li key={row.key} className="row r-entry">
            {row.monthLabel && <h2 className="month">{row.monthLabel}</h2>}

            {/* Each entry arrives as it comes into view, the same reveal
                every other card set on the site uses.
                The card stays its own element inside the wrapper: passing
                "card" to Reveal as a className puts the class on a div
                this component did not render, so styled-jsx never scoped
                it and the card lost its ground, its border and its grid
                all at once. */}
            <Reveal>
            <div className="card">
              <span className="node">
                {thumb ? (
                  <Image className="thumb" src={thumb} alt="" fill sizes="64px" aria-hidden="true" />
                ) : (
                  <CategoryGlyph category={entry.category} size={16} />
                )}
                <span className="sr-only">{CATEGORY_LABEL[entry.category]}</span>
              </span>

              <div className="slot">
                <FeedEntry entry={entry} index={position.get(entry.id) ?? 0} />
              </div>
            </div>
            </Reveal>
          </li>
        )
      })}

      <style jsx>{`
        .tl {
          /* Narrower, with the type. Substack's explore column is 512
             and a 660px measure around a 17px line is mostly margin. */
          --tl-card: 600px;
          /* The subject mark at Substack's scale: an avatar beside a
             line of text, not a plate the text sits next to. */
          --tl-node: 40px;

          position: relative;
          list-style: none;
          margin: 0;
          padding: var(--space-9) 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* One dotted line down the centre of the page, drawn once behind
           everything rather than per row, so it never restarts.

           It starts where the first row starts, not at the top of the
           list. The list carries top padding to clear the banner, and a
           rail drawn from 0 spent that padding on a stub hanging off the
           first month pill with nothing above it to join to. A line
           between two things needs the first thing.

           It stops at the last one too. Every row carries space-8 of
           padding beneath it for the next card, and the last row has no
           next card — so the rail spent that 64px running out of the
           bottom of the list into nothing. Ending it there costs the same
           64px back. */
        .tl::before {
          content: '';
          position: absolute;
          left: 50%;
          top: var(--space-9);
          bottom: var(--space-8);
          border-left: 1px dotted var(--border-strong);
          transform: translateX(-0.5px);
        }

        .row {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .r-entry { padding-bottom: var(--space-8); }

        /* The month rides on the line and breaks it. The page background
           is what does the breaking — the pill is opaque, so the dash
           stops at its edge and starts again below. */
        .month {
          margin: 0 0 var(--space-7);
          padding: 10px 22px;
          border-radius: 999px;
          /* Inverted: the pill is the one solid mark in the column, so
             it reads as a break in the line rather than as a label
             floating near it. --contrast-* is always the opposite of the
             page theme, so it holds in day and night alike. */
          background: var(--contrast-bg);
          border: 1px solid var(--contrast-bg);
          color: var(--contrast-text);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.08em;
          line-height: 1;
        }

        /* The card sits on the line and hides it. */
        /* The reveal wrapper is a pass-through: the row centres its
           children and the card sizes itself, so the wrapper has to do
           neither and get out of the way of both. */
        .row :global(.reveal) {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .card {
          width: min(100%, var(--tl-card));
          display: grid;
          grid-template-columns: var(--tl-node) minmax(0, 1fr);
          gap: var(--space-4);
          align-items: start;
          /* The inset follows the type. 32/48 was cut for a 26px headline
             and a 19px body; against 17 and 15 it left the words adrift
             in a wide white field. Still more room under than over —
             the last thing in the card is a "Show more" at label size,
             and an even inset leaves it sitting on the edge. */
          padding: var(--space-5) var(--space-5) var(--space-6);
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-1);
        }

        .node {
          position: relative;
          display: grid;
          place-items: center;
          width: var(--tl-node);
          height: var(--tl-node);
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg);
          border: 1px solid var(--border);
        }
        .node :global(.thumb) { object-fit: cover; }

        .slot { min-width: 0; }

        /* A run of empty days, drawn at the same scale as the entries so
           a quiet fortnight looks like a fortnight. Centred on the line
           like everything else. */
        .r-gap {
          /* content-box, so the inline height is the run of empty days
             and the padding for the next card adds beneath it. Under
             border-box the padding eats the height, and every gap of four
             days or fewer comes out the same 64px tall — which is the one
             thing the run is here to avoid. */
          box-sizing: content-box;
          padding-bottom: var(--space-8);
        }

        /* Phones. 24px of inset each side of a 350px card spends 14% of
           the screen on margin the page already has — the gutter is
           outside it. 16px gives the words back about 16 characters a
           line, which is the difference between two lines and three. */
        @media (max-width: 760px) {
          .tl { --tl-node: 32px; }
          .card {
            padding: var(--space-4) var(--space-4) var(--space-5);
            gap: var(--space-3);
          }
        }

        /* Large screens. The column is a reading measure and does not
           grow with the window — 600px of 17px type is right at any width
           — but the run of them can breathe further apart once there is
           room, and the month has further to carry. */
        @media (min-width: 1600px) {
          .r-entry { padding-bottom: var(--space-7); }
          .month { font-size: 14px; }
        }
      `}</style>
    </ol>
  )
}
