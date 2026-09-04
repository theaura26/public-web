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
            /* One tick a day. The run is the argument — a quiet fortnight
               should look like a fortnight — and a tick counts where a
               blank stretch of line only measures. What stays gone is the
               sentence underneath it: the length says how long the estate
               was quiet without announcing it in words. */
            <li key={row.key} className="row r-gap" aria-hidden="true">
              <span className="ticks">
                {Array.from({ length: shown }, (_, i) => <span key={i} className="tick" />)}
              </span>
            </li>
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
                  <CategoryGlyph category={entry.category} size={20} />
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
          /* Narrower and lighter, after Substack's explore column.
             A feed row is a fact, and 660px of card around a fact is a
             frame around a sentence. */
          --tl-card: 600px;
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
          /* On the marks, not down the middle of the page.
             It ran at 50% because the entries were cards wide enough to
             hide it, and it only ever showed in the gaps between them.
             Without the card there is nothing to hide behind, and a
             dotted line through the middle of a paragraph is just a line
             through a paragraph. It runs through the centre of the
             subject marks now — which is what a reader reads it as
             anyway, one thread with the estate's work strung along it.
             max() keeps it on the marks once the column stops being
             600px and starts being the screen. */
          left: max(
            calc(var(--tl-node) / 2),
            calc(50% - var(--tl-card) / 2 + var(--tl-node) / 2)
          );
          top: var(--space-9);
          bottom: var(--space-6);
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
        /* The gap is its own grid and must not be stretched by the row. */
        .row.r-gap {
          align-items: stretch;
          margin: 0 auto;
        }
        .r-entry { padding-bottom: var(--space-6); }

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

        /* The reveal wrapper is a pass-through: the row centres its
           children and the card sizes itself, so the wrapper has to do
           neither and get out of the way of both. */
        .row :global(.reveal) {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        /* Not a card any more.
           An entry used to sit in a bordered, padded box with its own
           ground, floating on the rail. Every one of them announced
           itself as an object before a reader got to what it said, and a
           column of objects reads slower than a column of facts.
           A hairline underneath is all the separation a row needs — the
           thing Substack's feed gets right, and it is the absence of the
           box rather than the size of the type.
           It still masks the rail, which is why the ground is painted
           rather than left transparent: the dotted line runs the height
           of the list and a row has to stand in front of it. */
        .card {
          position: relative;
          width: min(100%, var(--tl-card));
          display: grid;
          grid-template-columns: var(--tl-node) minmax(0, 1fr);
          gap: var(--space-4);
          align-items: start;
          padding: 0 0 var(--space-6);
          /* The page's own ground, not --bg. --bg is white inside this
             page's scope and the ground is the estate's paper colour, so
             painting --bg gave every row a white block to sit in — a card
             again, just without the border. The row has to disappear into
             the page and leave only the hairline. */
          background: var(--feed-ground, transparent);
          border-bottom: 1px solid var(--border);
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
        /* The gap takes the entries' own grid, so its run of days lands
           in the subject column and reads as marks on the same thread
           rather than as a second column of dashes beside it. */
        .r-gap {
          width: min(100%, var(--tl-card));
          display: grid;
          grid-template-columns: var(--tl-node) minmax(0, 1fr);
          gap: var(--space-4);
          padding-bottom: var(--space-6);
        }
        .ticks {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: var(--space-2) 0;
          /* The ground behind the run, so the ticks are marks on the rail
             rather than dashes sitting on top of a dotted line that
             carries straight through them. */
          background: var(--feed-ground, transparent);
        }
        .tick {
          width: 1px;
          height: 10px;
          background: var(--border-strong);
        }

        @media (max-width: 760px) {
          .tl { --tl-node: 32px; }
          .card { gap: var(--space-3); }
        }
      `}</style>
    </ol>
  )
}
