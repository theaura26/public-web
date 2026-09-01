'use client'

import { ExpandingBanner } from '@/components/ExpandingBanner'
import {
  DataGrid,
  DataCard,
  ScrollHighlight,
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  SpecTable,
  Placeholder,
  Portrait,
  Continue,
} from '@/components/article/Article'

/* One page shape for every subject the site explains.
 *
 * The Regenerative Life chapters are rendered with it. The nine
 * disciplines and the Natural Intelligence pillars feed those chapters.
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
  after?: {
    kind: 'banner' | 'plate' | 'portrait'
    /** The drafting brief, shown only while `src` is empty. Optional: a
     *  slot with its photograph has no brief left to carry. */
    type?: string
    caption: string
    alt?: string
    ratio?: string
    src?: string
    mediaType?: 'image' | 'video'
    poster?: string
  }
  /** Revealing text: a stanza that fades up line by line as it is
   *  scrolled through. Newline-separated. Used where a page wants to
   *  land an idea rather than explain another one — not on every page,
   *  and never more than once on any of them. */
  reveal?: string
  /** A grid of short cards. Nine on Biodiversity, which is the one page
   *  whose subject is a list of living things. */
  tiles?: { value: string; note: string }[]
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
  /** The banner. `type` is the drafting hint, dropped once `src` is set. */
  hero?: { type?: string; caption: string; src?: string; mediaType?: 'image' | 'video'; poster?: string; alt?: string }
  /** One line worth setting on its own. Used at most once per page. */
  quote?: string
  /** Mid-page image slot, in its drafting state. */
  plate?: { type?: string; caption: string; src?: string; mediaType?: 'image' | 'video'; poster?: string; alt?: string }
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

  /* `type` only while there is no photograph. It is the brief for the
     shot — "Detail · red laterite in the hand" — and once the shot
     exists it is a note to the photographer sitting in the reader's
     caption, and in the text every crawler and agent view reads. */
  const opener = (
    <HeroBanner
      key="hero"
      title={s.label}
      src={s.hero?.src}
      mediaType={s.hero?.mediaType}
      poster={s.hero?.poster}
      type={s.hero?.src ? undefined : (s.hero?.type ?? 'Landscape · Mudigere')}
      caption={s.hero?.caption ?? s.lede}
      alt={s.hero?.alt ?? `${s.label} — Aura, Aura Estate, Mudigere`}
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

  /* Does this page have any photography at all? Once it does, a slot
     that is still empty is dropped rather than drawn.

     The grey drafting card was right while nothing was shot: a page of
     them reads as a page waiting for pictures, which is what it was. One
     of them among eight photographs reads as a picture that failed to
     load. So the card survives only on a page that has no photographs
     yet, and the rule needs no maintenance — a chapter stops showing
     them the moment its first real image lands. */
  const hasPhotography = Boolean(
    s.hero?.src || s.plate?.src || s.movements?.some((mv) => mv.after?.src),
  )

  /* The visual after a movement. Where there is no photograph and no
     photography anywhere on the page, a banner and a plate render a grey
     card carrying what the picture is meant to be. */
  function visual(after: NonNullable<Movement['after']>, key: string) {
    /* Nothing at all for an empty slot on a page that is already
       illustrated. */
    if (!after.src && hasPhotography) return null
    /* Same rule as the banner: the brief is shown only while the picture
       it describes does not exist. */
    const brief = after.src ? undefined : after.type
    if (after.kind === 'plate') {
      return (
        <Placeholder
          key={key}
          src={after.src}
          mediaType={after.mediaType}
          poster={after.poster}
          type={brief}
          alt={after.alt ?? after.caption}
          caption={after.caption}
        />
      )
    }
    if (after.kind === 'portrait') {
      return (
        <Portrait
          key={key}
          src={after.src ?? '/aura-placeholder.svg'}
          /* The ratio the shot is to be delivered at. The box is set to
             it, so a matched picture is never cropped. */
          ratio={after.ratio ?? '4 / 5'}
          alt={after.alt ?? after.caption}
          caption={after.caption}
        />
      )
    }
    return (
      <ExpandingBanner
        key={key}
        src={after.src}
        mediaType={after.mediaType}
        poster={after.poster}
        type={brief}
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
            <div style={{ marginTop: 'var(--space-7)' }}>{measured}</div>
          )}
        </Col>,
      )
      if (m.tiles?.length) {
        movements.push(
          <DataGrid key={`mv${i}-tiles`} cols={3} standalone tightTop>
            {m.tiles.map((t) => (
              <DataCard key={t.value} value={t.value}>{t.note}</DataCard>
            ))}
          </DataGrid>,
        )
      }
      if (m.after) movements.push(visual(m.after, `mv${i}-after`))
      if (m.reveal) movements.push(<ScrollHighlight key={`mv${i}-reveal`}>{m.reveal}</ScrollHighlight>)
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
      {/* The three-up grid the journals close with, not a scrolling lane.
          A lane is for a set a reader browses; this is a short list of
          named siblings, and putting the first three in view beats
          hiding six behind a horizontal scroll. */}
      {/* The chapter's own onward links.
          These were authored per chapter — RTA to /rta and /fermentation,
          Artistry to /atelier and the residency — under a design where a
          chapter is the doorway and the fuller page is the room. The prop
          was declared and never rendered, so every one of those pointers
          was dead: a reader finished a deliberately short chapter with no
          route to the long one. They sit above the siblings because going
          deeper on this subject comes before going sideways to the next. */}
      {!!s.related?.length && (
        <OneCol heading="Go deeper">
          <p className="p1">
            {s.related.map((r, i) => (
              <span key={r.href}>
                {i > 0 && ' · '}
                <a href={r.href}>{r.label}</a>
              </span>
            ))}
          </p>
        </OneCol>
      )}
      {!!s.siblings?.length && (
        <Continue
          heading={s.siblingsLabel ?? 'Read on'}
          items={s.siblings.slice(0, 3).map((x) => ({
            href: x.href,
            label: x.title,
            description: x.description,
          }))}
        />
      )}
    </>
  )
}
