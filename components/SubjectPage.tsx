'use client'

import { RelatedLane } from '@/components/Swimlanes'
import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  SpecTable,
  Placeholder,
  Portrait,
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
 *   what we have not proved   where the record runs out
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
  /** The rest of the set, offered at the foot. */
  siblings?: { href: string; title: string; description: string; status: 'live' | 'soon' }[]
  siblingsLabel?: string
  /** Which of the three arrangements this page takes. */
  variant?: number
}

/* A practice line may point at a field note, written as [label](/href).
   Those open in a new tab: a reader is midway through an argument here,
   and taking the page away from them to show a supporting note loses
   the thread they were following. */
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

function withLinks(line: string) {
  const out: React.ReactNode[] = []
  let last = 0
  for (const m of line.matchAll(LINK)) {
    if (m.index! > last) out.push(line.slice(last, m.index))
    out.push(
      <a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>,
    )
    last = m.index! + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

export default function SubjectPage({
  subject: s,
  basePath,
}: {
  subject: Subject
  basePath: string
}) {
  const v = (s.variant ?? 0) % 3

  const opener = (
    <HeroBanner
      key="hero"
      title={s.label}
      type={s.hero?.type ?? 'Landscape · Mudigere'}
      caption={s.hero?.caption ?? s.lede}
      alt={`${s.label} — Aura, Sampigekhan Estate, Mudigere`}
    />
  )

  /* Two columns on most pages, one reading column on the third. Same
     words, different rhythm. */
  const Practice = v === 2 ? OneCol : TwoCol
  const practice = (
    <Practice key="practice" id="practice" heading={s.lede}>
      {s.practice.map((line) => (
        <p className="p1" key={line}>{withLinks(line)}</p>
      ))}
    </Practice>
  )

  /* A list, not a grid of cards. These are readings with units, and a
     reading is a row — the thing on the left, the figure on the right,
     with any qualification travelling beside the figure rather than
     being left to a footnote. */
  const measured = s.record?.length ? (
    <SpecTable
      key="measured"
      title="What is measured"
      rows={s.record.map((r) => ({
        label: r.label,
        value: r.note ? `${r.value} · ${r.note}` : r.value,
      }))}
    />
  ) : null

  const quote = s.quote ? <PullQuote key="quote">{s.quote}</PullQuote> : null
  const plate = s.plate
    ? <Placeholder key="plate" type={s.plate.type} caption={s.plate.caption} />
    : null
  const breaker = s.breaker ? (
    <Portrait
      key="breaker"
      src="/aura-placeholder.svg"
      ratio="4 / 5"
      alt={s.breaker.alt}
      caption={s.breaker.caption}
    />
  ) : null

  /* Only when there is a genuine evidence gap to declare. A page with
     nothing outstanding should not manufacture a caveat to fill the
     block — that was how a note about terminology ended up filed under
     things the estate cannot prove. */
  const open = s.open.length === 0 ? null : (
    <TwoCol key="open" id="open" heading="What we can't prove yet">
      {s.open.map((line) => (
        <p className="p1" key={line}>{withLinks(line)}</p>
      ))}
    </TwoCol>
  )

  const middle =
    v === 0 ? [quote, measured, plate]
    : v === 1 ? [breaker, measured, quote]
    : [measured, breaker, quote]

  return (
    <>
      {opener}
      {v === 2 && plate}
      {practice}
      {middle}
      {open}
      {!!s.siblings?.length && (
        <RelatedLane label={s.siblingsLabel ?? 'Read on'} items={s.siblings} />
      )}
    </>
  )
}
