'use client'

import {
  HeroBanner,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Portrait,
  Continue,
} from '@/components/article/Article'

/* One page shape for every subject the site explains.
 *
 * The nine disciplines use it, and so do the three pillars of The Reason.
 * It is assembled entirely out of the journal kit — the same openers and
 * blocks the field notes and Mudigere are built from — so a reader moving
 * from a note about Bug Hotels to the Biodiversity discipline stays in
 * one publication. Nothing here draws its own furniture.
 *
 * Four parts, always the same four, always in this order:
 *
 *   what it is        the lede, carried as the first heading
 *   what is done      practice — facts, with records behind them
 *   what is measured  the figures, each carrying its own qualification
 *   what is not settled   where the record runs out
 *
 * The fourth is load-bearing rather than defensive. A farm that publishes
 * the edge of its own evidence is telling you the rest of the numbers are
 * real, and that is the only reason to believe the first three parts. It
 * is never omitted and never softened.
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
  /** Drafting hints for the banner, until there is a photograph. */
  hero?: { type: string; caption: string }
  /** One line worth setting on its own. Used at most once per page. */
  quote?: string
  /** Mid-page image slot, in its drafting state. */
  plate?: { type: string; caption: string }
  /** A tall breaker between the figures and the gaps — the beat where a
      reader looks up from a list of numbers before being told what the
      numbers do not cover. */
  breaker?: { caption: string; alt: string }
}

export default function SubjectPage({
  subject: s,
  basePath,
}: {
  subject: Subject
  basePath: string
}) {
  const [lead, ...rest] = s.practice

  return (
    <>
      <HeroBanner
        title={s.label}
        type={s.hero?.type ?? 'Landscape · Mudigere'}
        caption={s.hero?.caption ?? s.lede}
        alt={`${s.label} — Aura, Sampigekhan Estate, Mudigere`}
      />

      <TwoCol id="practice" heading={s.lede}>
        <p className="p1">{lead}</p>
        {rest.map((line) => (
          <p className="p2" key={line}>{line}</p>
        ))}
      </TwoCol>

      {s.quote && <PullQuote>{s.quote}</PullQuote>}

      {!!s.record?.length && (
        <TwoCol id="record" heading="What is measured">
          <p className="p1">
            The figures the estate keeps for {s.label.toLowerCase()}, with the qualification
            attached to each rather than left to a footnote.
          </p>
          <DataGrid>
            {s.record.map((r) => (
              <DataCard key={r.label} value={r.value}>
                {r.label}
                {r.note ? ` — ${r.note}` : '.'}
              </DataCard>
            ))}
          </DataGrid>
        </TwoCol>
      )}

      {s.plate && <Placeholder type={s.plate.type} caption={s.plate.caption} />}

      {s.breaker && (
        <Portrait
          src="/aura-placeholder.svg"
          ratio="5 / 7"
          alt={s.breaker.alt}
          caption={s.breaker.caption}
        />
      )}

      <TwoCol id="open" heading="What is not settled">
        <p className="p1">{s.open[0]}</p>
        {s.open.slice(1).map((line) => (
          <p className="p2" key={line}>{line}</p>
        ))}
      </TwoCol>

      {/* No 'read further' list and no prev/next: Continue already
          offers the next reads, and a second set of links under it was
          two footers arguing about where to go. */}
      <Continue currentHref={`${basePath}/${s.slug}`} />
    </>
  )
}
