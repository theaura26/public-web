'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { absoluteLabel, datetimeAttr, relativeLabel, windowIsElided, type FeedTime } from '@/lib/aura-live/time'
import { CATEGORY_LABEL } from '@/lib/aura-live/taxonomy'
import type { PublicEntry } from '@/lib/aura-live/feed'

/* One event, hanging off the timeline.
 *
 * Four things on the surface: when and what kind, the headline, one line
 * of what was recorded, and the picture. Everything else is behind
 * "Show more".
 *
 * What goes behind it is the rule worth keeping: only what the surface
 * does not already say. A panel that repeats the date, the place and the
 * species back to a reader who has just read them is not evidence, it is
 * padding — so the time, the location and the subject are absent from it
 * by design, and what remains is the part of the record the card had no
 * room for.
 */

export type EntryVariant = 'evidence' | 'record'

export function variantFor(entry: PublicEntry): EntryVariant {
  return entry.evidence.hasEventMedia ? 'evidence' : 'record'
}

export default function FeedEntry({ entry, index }: { entry: PublicEntry; index: number }) {
  const time: FeedTime = {
    precision: entry.timePrecision,
    occurredAt: entry.occurredAt,
    occurredOn: entry.occurredOn,
    timeWindow: entry.timeWindow,
  }

  const media = entry.media[0]
  const isArchive = media?.isEditorialImagery ?? false
  const ratio = media?.ratio && media.ratio > 0 ? media.ratio : 16 / 9

  /* A looping clip with no controls is motion nobody asked for. Readers
     who have asked for less of it get the poster and a control instead. */
  const [stillness, setStillness] = useState(false)
  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setStillness(q.matches)
    sync()
    q.addEventListener('change', sync)
    return () => q.removeEventListener('change', sync)
  }, [])

  /* Only what the card has not already said, and only what a reader
     could act on knowing.

     Two rows were tried here and taken out. "Source: the estate’s daily
     application log" appeared on every entry, because every entry comes
     out of the estate log — a constant is not information. "Visual: a
     photograph taken of this event" described a photograph the reader
     was already looking at, and its opposite, "no photograph is held for
     this record", described an absence they had also already noticed.

     What is left is who did the work, how, on what, in which hours, and
     what the estate wrote down about it. Where an entry has none of
     that — a sighting, which is all on the card already — there is no
     panel at all, and no control offering one. */
  const rows = [
    ...(windowIsElided(time) && entry.timeWindow
      ? [{ label: 'Hours', value: `${entry.timeWindow} IST` }]
      : []),
    ...entry.details.filter((d) => !['Quantity', 'Area', 'Observed'].includes(d.label)),
    ...(entry.significance ? [{ label: 'Note', value: entry.significance }] : []),
    ...(entry.updatedAt
      ? [{ label: 'Corrected', value: 'The estate record changed after this was published, and the entry was updated.' }]
      : []),
  ]

  return (
    <article className={`entry v-${variantFor(entry)}`} id={entry.id} aria-labelledby={`${entry.id}-h`}>
      <header className="top">
        <p className="eyebrow label">
        {/* Absolute, and never more precise than the record. A row that
            carries only a date is stamped with a date. */}
          <time dateTime={datetimeAttr(time)} title={relativeLabel(time)}>{absoluteLabel(time)}</time>
          <span className="sep" aria-hidden="true">·</span>
          {CATEGORY_LABEL[entry.category]}
        </p>
        <h3 id={`${entry.id}-h`} className="headline">{entry.headline}</h3>
      </header>
      {entry.body && <p className="prose">{entry.body}</p>}

      {rows.length > 0 && (
        <details className="ev">
          <summary className="more label">Show more</summary>
          <dl className="ev-body">
            {rows.map((r) => (
              <div key={r.label} className="row">
                <dt className="label">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}

      {media && (
        <figure className="media" style={{ aspectRatio: String(ratio) }}>
          {media.type === 'video' ? (
            <video
              className="asset"
              src={media.url}
              poster={media.posterUrl}
              autoPlay={!stillness}
              muted
              loop
              controls={stillness}
              preload="metadata"
              playsInline
              aria-label={media.alt}
            />
          ) : (
            <Image
              className="asset"
              src={media.url}
              alt={media.alt}
              fill
              sizes="(max-width: 900px) 100vw, 720px"
              priority={index === 0}
              unoptimized={media.url.startsWith('http')}
            />
          )}
        </figure>
      )}

      <style jsx>{`
        .entry { display: flex; flex-direction: column; gap: var(--space-4); }

        /* The stamp labels the headline — they are one thing, and the
           entry’s own gap held them apart as if they were two. Nesting
           gives the pair its own tighter measure without a negative
           margin to drift later. */
        .top { display: flex; flex-direction: column; gap: 6px; }

        .eyebrow {
          display: flex;
          align-items: baseline;
          margin: 0;
          color: var(--text-muted);
        }
        .sep { padding: 0 8px; opacity: 0.55; }

        /* Four sizes on this page and no more, after Substack's feed:
           12 for the eyebrow, 17 for what happened, 15 for the detail,
           13 for the month. An entry here is one fact — "Buttermilk
           applied in Blocks 1, 2 and 3" — and 26px was setting a log
           line like a headline. Weight carries it now instead of size,
           which is the trick that makes a long feed readable rather than
           loud.
           One rhythm underneath: 22px for both, so a row with a body and
           a row without still sit on the same grid. */
        .headline {
          margin: 0;
          font-size: 17px;
          line-height: 22px;
          font-weight: 600;
          letter-spacing: -0.01em;
          text-wrap: balance;
        }

        .prose {
          margin: 0;
          font-size: 15px;
          line-height: 22px;
          color: var(--text-muted);
          max-width: 62ch;
        }

        .media {
          position: relative;
          margin: var(--space-2) 0 0;
          /* The same 2px the rest of the site puts on a picture. */
          border-radius: var(--radius-1);
          width: 100%;
          max-width: 720px;
          /* The frame follows the photograph rather than a house ratio —
             cropping a portrait to 16:9 throws away the half of the frame
             the photographer kept. Capped so one entry is not a screen. */
          max-height: 68vh;
          overflow: hidden;
          background: color-mix(in srgb, var(--text) 4%, transparent);
        }
        .media :global(.asset) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Above the picture, not under it: the reader decides whether
           they want the record before the photograph takes the screen. */
        .ev { margin-top: var(--space-1, 4px); }
        .more {
          cursor: pointer;
          list-style: none;
          width: fit-content;
          color: var(--text-muted);
          padding: 4px 0;
          transition: color var(--dur-base) var(--ease);
        }
        .more::-webkit-details-marker { display: none; }
        .more:hover { color: var(--text); }
        .more:focus-visible {
          outline: 2px solid var(--text);
          outline-offset: 4px;
          border-radius: 2px;
        }
        .ev[open] .more { color: var(--text); }

        .ev-body {
          margin: var(--space-4) 0 var(--space-2);
          display: grid;
          gap: var(--space-3);
          max-width: 720px;
        }
        .row {
          display: grid;
          grid-template-columns: 128px minmax(0, 1fr);
          gap: var(--space-4);
          align-items: baseline;
        }
        .row dt { color: var(--text-muted); }
        .row dd { margin: 0; color: var(--text-body); }

        @media (max-width: 640px) {
          .row { grid-template-columns: 1fr; gap: 2px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .more { transition: none; }
        }
      `}</style>
    </article>
  )
}
