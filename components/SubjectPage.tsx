'use client'

import { RelatedLane } from '@/components/Swimlanes'
import { ExpandingBanner } from '@/components/ExpandingBanner'
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
 * One movement, not four sections:
 *
 *   what we do   the lede as the heading, the processes and practices
 *                under it, and the figures folded in at the end of it
 *
 * There used to be a fourth block headed "what we can't prove yet". It
 * was doing three jobs and only one of them belonged on the page. Some of
 * it was a genuine qualification, which now travels beside the thing it
 * qualifies. Some was a link to a fuller account, which now sits inline
 * in the body. And a third of it was project status — "whether it is
 * running is being verified" — which is an entry in a register, not
 * something to publish. A reader got "we have not finished checking our
 * own homework" at the foot of every page.
 *
 * Publishing the edge of the evidence still matters. It happens in the
 * sentence that carries the claim now, which is stronger than a block at
 * the bottom under a heading that reads as an apology. The gaps live in
 * docs/editorial/open-questions.md.
 */

/** One beat of the page: a heading, a couple of paragraphs, and the
 *  visual that follows. `after` is a drafting brief until a photograph
 *  exists — a grey card carrying what the picture is meant to be. */
export type Movement = {
  heading: string
  lines: string[]
  after?: { kind: 'banner' | 'plate' | 'portrait'; type: string; caption: string; alt?: string }
}

export type Subject = {
  id: string
  label: string
  slug: string
  lede: string
  /** Legacy flat run of paragraphs. Subjects still on this render as one
   *  block; see `movements` for the shape that replaces it. */
  practice?: string[]
  /** The page as a sequence of short movements, each with its own
   *  heading and its own visual after it. Two or three paragraphs at a
   *  time, the way /shade and /mudigere are built — a ten-paragraph run
   *  in one column is a wall, whatever the words are doing. */
  movements?: Movement[]
  record?: { value: string; label: string; note?: string }[]
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

  /* A list, not a grid of cards. These are readings with units, and a
     reading is a row — the thing on the left, the figure on the right,
     with any qualification travelling beside the figure rather than
     being left to a footnote.

     standalone={false} because it is folded into the body of what we do
     rather than standing as a section of its own. The figures are part
     of the work, not a separate topic that happens to follow it. */
  const measured = s.record?.length ? (
    <SpecTable
      key="measured"
      title="What we measure"
      standalone={false}
      rows={s.record.map((r) => ({
        label: r.label,
        /* A bare figure stays on one line — .spec__value is nowrap, and a
           reading should not break across two. A figure carrying its
           qualification is a sentence, and has to be allowed to wrap:
           left as nowrap it became an 800px unbreakable string and
           pushed the page sideways. */
        value: r.note ? (
          <span style={{ whiteSpace: 'normal' }}>{r.value} · {r.note}</span>
        ) : r.value,
      }))}
    />
  ) : null

  /* The visual after a movement. All three are in their drafting state
     until there is a photograph: a banner and a plate render a grey card
     carrying what the picture is meant to be, so the page reads as
     'image to come' rather than as a hole. */
  function visual(after: NonNullable<Movement['after']>, key: string) {
    if (after.kind === 'plate') {
      return <Placeholder key={key} type={after.type} caption={after.caption} />
    }
    if (after.kind === 'portrait') {
      return (
        <Portrait
          key={key}
          src="/aura-placeholder.svg"
          alt={after.alt ?? after.caption}
          caption={after.caption}
        />
      )
    }
    return (
      <ExpandingBanner
        key={key}
        type={after.type}
        alt={after.alt ?? after.caption}
        caption={after.caption}
      />
    )
  }

  /* The page as movements. Each is two or three paragraphs under its own
     heading, and the visual it carries follows it. The column alternates
     so consecutive blocks do not sit in the same shape, and the figures
     fold into the second movement — far enough in that a reader has the
     context to read them, early enough that they are not an appendix. */
  const movements: React.ReactNode[] = []
  if (s.movements?.length) {
    const specAt = Math.min(1, s.movements.length - 1)
    s.movements.forEach((m, i) => {
      const Col = i % 2 === 1 ? OneCol : TwoCol
      movements.push(
        <Col key={`mv${i}`} id={i === 0 ? 'practice' : undefined} heading={m.heading}>
          {m.lines.map((line) => (
            <p className="p1" key={line}>{withLinks(line)}</p>
          ))}
          {i === specAt && measured && (
            <div style={{ marginTop: 'var(--space-6)' }}>{measured}</div>
          )}
        </Col>,
      )
      if (m.after) movements.push(visual(m.after, `mv${i}-after`))
    })
  }

  /* Subjects not yet migrated keep the single block. */
  const practice = s.movements?.length ? null : (
    <Practice key="practice" id="practice" heading={s.lede}>
      {(s.practice ?? []).map((line) => (
        <p className="p1" key={line}>{withLinks(line)}</p>
      ))}
      {measured && <div style={{ marginTop: 'var(--space-6)' }}>{measured}</div>}
    </Practice>
  )

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

  /* The figures used to sit in this rotation, which is why it had three
     slots. With them folded into the body above, what is left is the
     visual beat — a quote, a plate, a portrait — and the rotation exists
     so twelve pages do not read as one form filled in twelve times. */
  const middle =
    v === 0 ? [quote, plate]
    : v === 1 ? [breaker, quote]
    : [breaker, quote]

  /* A migrated subject gets its visuals from its own movements, so the
     rotation below would double them up. The quote still earns its place
     as the one beat that is neither prose nor picture. */
  const tail = s.movements?.length ? [quote] : [...(v === 2 ? [plate] : []), practice, ...middle]

  return (
    <>
      {opener}
      {movements}
      {tail}
      {!!s.siblings?.length && (
        <RelatedLane label={s.siblingsLabel ?? 'Read on'} items={s.siblings} />
      )}
    </>
  )
}
