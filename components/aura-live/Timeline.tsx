'use client'

import Image from 'next/image'
import FeedEntry from './FeedEntry'
import CategoryGlyph from './CategoryGlyph'
import { categoryThumbnail } from '@/lib/aura-live/gallery'
import { CATEGORY_LABEL } from '@/lib/aura-live/taxonomy'
import type { PublicEntry } from '@/lib/aura-live/feed'

/* The timeline.
 *
 * A dashed line down the page, months named to the left of it, and the
 * feed hanging to the right. Each entry sits on a circular mark carrying
 * its subject's picture — the same picture on every entry in that
 * subject, which is what keeps it reading as an icon rather than as a
 * photograph of the event. It is decorative and hidden from screen
 * readers; the subject is written out beside it either way.
 *
 * The empty days between two entries are drawn as ticks at the same scale
 * as the entries themselves. That is the argument for building it this
 * way: a feed that only draws the days it published makes a quiet
 * fortnight look exactly like a busy one, and this page's whole claim is
 * that it shows what actually happened. A three-week stretch where
 * nothing met the bar is visibly three weeks long.
 */

const MS_DAY = 86_400_000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

/* Long enough to read as a real interval, short enough that a gap does
   not become the page. Beyond it the true count is written out, so a
   capped run of ticks never quietly shortens a season. */
const MAX_TICKS = 16

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
          const shown = Math.min(row.days, MAX_TICKS)
          return (
            <li key={row.key} className="row r-gap" aria-hidden="true">
              <span className="month" />
              <span className="mark">
                <span className="ticks">
                  {Array.from({ length: shown }, (_, i) => <span key={i} className="tick" />)}
                </span>
              </span>
              <span className="slot">
                {row.days > MAX_TICKS && <span className="elapsed label">{row.days} days</span>}
              </span>
            </li>
          )
        }

        const entry = row.entry
        const thumb = categoryThumbnail(entry.category)

        return (
          <li key={row.key} className="row r-entry">
            <h2 className="month">{row.monthLabel}</h2>

            <span className="mark">
              <span className="node">
                {thumb ? (
                  <Image className="thumb" src={thumb} alt="" fill sizes="88px" aria-hidden="true" />
                ) : (
                  <CategoryGlyph category={entry.category} size={22} />
                )}
                <span className="sr-only">{CATEGORY_LABEL[entry.category]}</span>
              </span>
            </span>

            <div className="slot">
              <FeedEntry entry={entry} index={position.get(entry.id) ?? 0} />
            </div>
          </li>
        )
      })}

      <style jsx>{`
        .tl {
          --tl-month: 200px;
          --tl-node: 78px;
          --tl-gap-a: var(--space-6);
          --tl-gap-b: var(--space-8);

          position: relative;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        /* One dashed line for the whole feed, drawn once behind the marks
           rather than per row, so it never restarts at an entry. */
        .tl::before {
          content: '';
          position: absolute;
          left: calc(var(--tl-month) + var(--tl-gap-a) + var(--tl-node) / 2);
          top: 0;
          bottom: 0;
          border-left: 1px dashed var(--border-strong);
        }

        .row {
          display: grid;
          grid-template-columns: var(--tl-month) var(--tl-node) minmax(0, 1fr);
          column-gap: var(--tl-gap-a);
          /* Baseline, not top: the month and the entry's stamp are two
             pieces of the same line and should read off one another.
             Guessed padding got them close and drifted every time the
             type changed. */
          align-items: baseline;
        }
        /* The mark has no text, so it has no baseline worth aligning —
           it stays pinned to the top of its row. */
        .mark { align-self: start; }
        .r-entry { padding-bottom: var(--space-11, 120px); }
        .r-entry:last-child { padding-bottom: var(--space-9); }

        /* The month names the moment the feed arrives in it, set beside
           its first mark rather than floating above the column. */
        /* An h2, because it heads a month of the feed in the document
           outline. Set at the h3 size, the same call the store’s lane
           headings make: a 60px month would out-shout the entries it
           labels, and the design system’s rule is that the element is
           chosen for the outline and the size for the context. */
        .month {
          margin: 0;
          text-align: right;
          font-weight: 600;
          text-transform: uppercase;
          font-size: clamp(20px, 2vw, 28px);
          letter-spacing: -0.02em;
          line-height: 1.15;
          color: var(--text);
        }

        .mark { position: relative; display: block; }


        .node {
          position: relative;
          display: grid;
          place-items: center;
          width: var(--tl-node);
          height: var(--tl-node);
          border-radius: 50%;
          overflow: hidden;
          background: color-mix(in srgb, var(--text) 6%, var(--bg));
          color: var(--text-muted);
          /* Sits on the dashes, and the line runs behind it. */
          z-index: 1;
        }
        .node :global(.thumb) { object-fit: cover; }

        .slot { min-width: 0; padding-top: 18px; padding-left: var(--space-5); }

        /* ── gaps ──────────────────────────────────────────────────── */

        .r-gap { padding-bottom: var(--space-8); }
        .r-gap .ticks {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          padding: var(--space-4) 0;
          background: var(--bg);
        }
        .r-gap .tick {
          display: block;
          width: 13px;
          height: 1px;
          background: var(--border-strong);
        }
        .elapsed { display: block; padding: var(--space-6) 0 0 var(--space-5); color: var(--text-dim); }

        /* ── narrow ────────────────────────────────────────────────── */

        @media (max-width: 900px) {
          /* Below this there is no room for a month column beside an
             axis. The rail keeps its marks; the month moves above the
             entry it names. */
          .tl { --tl-month: 0px; --tl-node: 50px; --tl-gap-a: var(--space-4); }
          .row { grid-template-columns: var(--tl-node) minmax(0, 1fr); }
          .tl::before { left: calc(var(--tl-node) / 2); }
          .month {
            grid-column: 1 / -1;
            text-align: left;
            padding: 0 0 var(--space-5);
          }
          .month:empty { display: none; }
          .slot { padding-left: var(--space-4); padding-top: 12px; }
          .r-entry { padding-bottom: var(--space-9); }
        }
      `}</style>
    </ol>
  )
}
