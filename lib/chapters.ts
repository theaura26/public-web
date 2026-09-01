import { DISCIPLINES, type Discipline } from '@/lib/disciplines'
import { PILLARS } from '@/lib/pillars'

/* The Regenerative Life, in eight chapters.
 *
 * ── Why this file exists beside lib/disciplines.ts ──────────────────
 * The nine disciplines are still the nine disciplines: they are what the
 * Remarkable Circle draws, and their prose has been through the claims
 * audit in AURA_COFFEE/01_STRATEGY/claims-and-proof.md. What changed is
 * how the site groups them for a reader. Nine scientific headings asked
 * somebody to already know why soil and hydrology are different subjects.
 * Eight chapters walk them through the estate instead — why it exists,
 * how it keeps time, where you stay, what is grown, and the layer that
 * reads all of it.
 *
 * So the audited prose is not copied here. Chapters that descend from a
 * discipline pull its movements and its figures straight off DISCIPLINES,
 * which keeps one source of truth for every published claim: correct the
 * number there and it corrects here. Chapters with no discipline behind
 * them are written here, to the same three rules:
 *
 *   1. A fact has a record behind it. It is stated plainly.
 *   2. A reading of facts is published as a reading — "our own readings",
 *      "we believe" — never as a demonstrated result.
 *   3. Something not yet true is future tense, or it is not here at all.
 *
 * ── No subpages, on purpose ─────────────────────────────────────────
 * Each chapter is one page. Where a chapter has a fuller treatment
 * already published elsewhere on the site — /reason, /rta, /sanctuary,
 * /atelier, /fermentation — the chapter links to it rather than
 * duplicating it. The chapter is the doorway, not the whole room.
 */

/** A chapter renders through the same component as a discipline did, so
 *  it takes the same shape. `glyph` is dropped: it addressed a file in
 *  /public/glyphs/coffee, and only the nine have one. */
export type Chapter = Omit<Discipline, 'glyph'> & {
  /** The still that stands for this chapter in a row of cards. Defaults
   *  to the hero photograph; set it where the hero is a video or where
   *  the chapter's page is hand-built and has no hero in this file. */
  card?: string
  /** Set beside the name where the name alone is not enough — a
   *  translation, or the thing the word actually means. */
  subtitle?: string
  /** The page this chapter IS, when the site already has one.
   *
   *  Five of the eleven were already written as full pages years before
   *  the chapters existed — /reason, /rta, /sanctuary, /atelier,
   *  /fermentation. Giving those a page under /regenerative-life meant
   *  writing a shorter version of a longer page and then pointing the
   *  menu at the short one, which is how a site ends up arguing with
   *  itself. Where this is set the chapter has no route of its own and
   *  every link goes to the real page.
   *
   *  The six without it are composed from the audited disciplines in
   *  lib/disciplines.ts and exist nowhere else on the site. */
  href?: string
}

/** The chapters that own a page under /regenerative-life. */
export const CHAPTER_PAGES = () => CHAPTERS.filter((c) => !c.href)

/** Where a chapter is read, wherever it actually lives. */
export function chapterHref(c: Chapter): string {
  return c.href ?? `/regenerative-life/${c.slug}`
}

/** The audited entry behind a chapter. Throws rather than silently
 *  rendering an empty page if an id is ever renamed. */
function d(id: string): Discipline {
  const found = DISCIPLINES.find((x) => x.id === id)
  if (!found) throw new Error(`chapters.ts: no discipline with id "${id}"`)
  return found
}

/** Everything a chapter inherits from a discipline except its identity. */
function body(id: string) {
  const { id: _id, label: _label, slug: _slug, glyph: _glyph, lede: _lede, ...rest } = d(id)
  return rest
}

/** The three Natural Intelligence pillars had pages of their own under
 *  /reason. They were three ways of saying what the idea does on a
 *  Tuesday, which is what the chapters do — so the pages are gone and
 *  their movements are read off lib/pillars.ts here. Same rule as the
 *  disciplines: composed, never copied. */
function pillar(slug: string) {
  const p = PILLARS.find((x) => x.slug === slug)
  if (!p) throw new Error(`chapters.ts: no pillar "${slug}"`)
  return { movements: p.movements ?? [], record: p.record ?? [], related: p.related ?? [] }
}

/** Thin the visuals when disciplines are merged.
 *
 *  Each discipline was written as its own page, where a picture after
 *  every movement is the right rhythm — three or four movements, three
 *  or four visuals. Merge six of them and that rhythm becomes twenty
 *  movements demanding fourteen full-bleed banners, each of which owns a
 *  160vh scroll stage. The Plantation was 2,240vh of banner before this.
 *
 *  So a merged chapter keeps the FIRST visual of each discipline it
 *  absorbs and drops the rest. The reader still gets a picture at every
 *  turn of the argument; they no longer get one every two paragraphs. */
function thinVisuals(parts: { movements?: Movement[] }[]): Movement[] {
  return parts.flatMap((part) => {
    let kept = false
    return (part.movements ?? []).map((mv) => {
      if (!mv.after) return mv
      /* A real photograph is never thinned. The thinning exists because a
         drafting card is a grey rectangle owning 160vh of scroll, and
         fourteen of those is 2,240vh of nothing. A picture is the reason
         the reader is here. */
      if (mv.after.src) return mv
      if (kept) {
        const { after: _drop, ...rest } = mv
        return rest
      }
      kept = true
      return mv
    })
  })
}

type Movement = NonNullable<Discipline['movements']>[number]

/** Drop a link a earlier one already offered.
 *
 *  A merged chapter inherits the onward links of every discipline it
 *  absorbs, and those overlap: The Plantation offered The Health Index,
 *  Circular Intelligence and The Land twice each. Keyed on href, so the
 *  same destination under two labels collapses too. */
function dedupeByHref(links: { label: string; href: string }[]) {
  const seen = new Set<string>()
  return links.filter((l) => (seen.has(l.href) ? false : (seen.add(l.href), true)))
}

/** Drop a movement whose heading a earlier one already used.
 *
 *  Merging writes that were composed separately will sometimes bring two
 *  passes at the same subject under the same title. Aura Intelligence had
 *  exactly that: the Natural Intelligence pillar and the intelligence
 *  discipline both opened a section "Why this is possible now." and both
 *  named the same three technologies, so the chapter made the argument
 *  twice under one heading twice. The first wins, because a merge lists
 *  its parts in the order it wants them read. */
function dedupeByHeading(movements: Movement[]): Movement[] {
  const kept = new Map<string, Movement>()
  const out: Movement[] = []
  for (const mv of movements) {
    const key = (mv.heading ?? '').trim().toLowerCase()
    if (!key) { out.push(mv); continue }
    const first = kept.get(key)
    if (!first) { kept.set(key, mv); out.push(mv); continue }
    /* The heading is a duplicate, but the photograph under it might not
       be. A pillar and a discipline both said "Why this is possible now",
       the pillar came first with a shot brief, and dropping the
       discipline's copy silently took a real photograph off the page
       with it. The first wording wins; a picture the winner does not
       have is carried across. */
    if (mv.after?.src && !first.after?.src) {
      const i = out.indexOf(first)
      const merged = { ...first, after: mv.after }
      kept.set(key, merged)
      if (i !== -1) out[i] = merged
    }
  }
  return out
}

/** Two disciplines read as one chapter. Movements run in the order given;
 *  figures are concatenated, and the first quote wins — a page carries at
 *  most one. */
function merge(...ids: string[]) {
  const parts = ids.map(body)
  return {
    movements: dedupeByHeading(thinVisuals(parts)),
    record: parts.flatMap((p) => p.record ?? []),
    quote: parts.find((p) => p.quote)?.quote,
    hero: parts[0].hero,
    plate: parts[0].plate,
    breaker: parts[0].breaker,
    related: dedupeByHref(parts.flatMap((p) => p.related ?? [])),
  }
}

export const CHAPTERS: Chapter[] = [
  /* 00 ─────────────────────────────────────────────────────────────── */
  {
    id: 'reason',
    label: 'The Reason',
    slug: 'the-reason',
    href: '/regenerative-life/the-reason',
    card: '/aura-mudigere-03.jpg',
    lede: 'Why any of this exists — and why it is being built on a timescale nobody gets to see the end of.',
    hero: {
      type: 'Landscape · the valley at first light',
      caption: 'A hundred and fifty acres in the Western Ghats, bought by somebody who knew nothing about farming',
    },
    quote: 'Attention was the original technology. We just stopped using it.',
    movements: [
      {
        heading: 'It started as a way of unwinding.',
        lines: [
          'Aura began with somebody who spent his working life in other industries and unwound the same way every time: making places where people could sit together. Building gardens. Setting flowers. Cooking for friends and losing the evening to it.',
          'Then two boys, very different from each other. Watching them grow ended the habit of thinking in quarters and started the habit of thinking in generations, and a generation is the horizon a piece of land can be run on.',
        ],
        after: {
          kind: 'portrait',
          type: 'Portrait · the founder on the estate',
          caption: 'Two boys, and the end of thinking in quarters',
          ratio: '4 / 5',
        },
      },
      {
        heading: 'Knowing nothing turned out to be the advantage.',
        lines: [
          'A hundred and fifty acres in the Western Ghats, arrived at without a farming background. Every practice on the estate had to be asked about rather than inherited, which is slower and produces a different kind of answer.',
          'Then Ohara — a quiet valley north of Kyoto. Cedar, rivers, silence, and a set of crafts held by people who have done one thing for thirty years. India gave the ground. Japan gave the stillness.',
        ],
      },
      {
        heading: 'There are three intelligences.',
        lines: [
          'Machine intelligence, which is new and very loud. Human intelligence, which is old and getting scarcer in the places that need it. And the oldest one, which is the land itself.',
          'The land has been computing longer than any machine. What stopped was not the computation but the reading of it — and that is the gap this whole estate is an argument about. [Natural Intelligence](/regenerative-life/aura-intelligence) is the fuller version of the argument.',
        ],
        after: {
          kind: 'banner',
          type: 'Wide · canopy from beneath',
          caption: 'Machine, human, and the oldest one',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'What it is for.',
        lines: [
          'Not a destination and not a brand exercise. A working estate that publishes what it does, a sanctuary you can stay in, and a set of crafts kept alive by being practised rather than exhibited.',
          'The reason is to restore what sustains us. Everything in the ten chapters after this one is a way of doing that, and a way of showing the working.',
        ],
      },
    ],
    related: [
      { label: 'Aura Intelligence', href: '/regenerative-life/aura-intelligence' },
      { label: 'Moral Spine', href: '/wisdom' },
    ],
  },

  /* 01 ─────────────────────────────────────────────────────────────── */
  {
    id: 'rta',
    /* Plain text. The Sanskrit is set with its diacritic where the
     * word appears in a sentence — /land and /residency both do — but
     * the chapter's own name is the handle a reader clicks and types,
     * and it is written without one. */
    label: 'RTA',
    subtitle: 'Right Time, Right Action',
    slug: 'rta',
    lede: 'The old word for the order that keeps time. On this estate it is a working rule: do the thing when the land is ready for it, not when the calendar is free.',
    hero: {
      type: 'Detail · incense burning down on a stone step',
      caption: 'The land decides the hour',
      src: '/regenerative-life/rta/images/rta-hero-banner.webp',
      alt: 'Incense sticks burning on a mossy stone step, smoke rising',
    },
    quote: 'Right time. Right action. Everything else is noise.',
    movements: [
      {
        heading: 'An order that keeps its own time.',
        lines: [
          'Ṛta is the Vedic word for the ordered course of things — the reason a season arrives in sequence rather than at random. It is an observation: a living system runs on a clock, and the clock belongs to the system.',
          'Held as a working rule it produces one instruction, which is the hardest one to follow on a farm with a labour schedule: wait until the land is ready.',
        ],
        after: {
            src: '/regenerative-life/rta/images/rta-3.webp',
            alt: 'The night sky over the estate, framed by the canopy',
          kind: 'banner',
          type: 'Wide · the valley keeping its own timing',
          caption: 'Patience — waiting for the hour the land is ready',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'Too early, and the soil is compacted before the roots move.',
        lines: [
          'Every operation on the estate has a window rather than a date. Too early and the soil is worked while it is still holding water, and it closes. Too late and the flush has already come and gone.',
          'The windows are why the plan carries buffer days in it. The buffer is the acknowledgement that the land keeps its own calendar and the plan has to bend to it.',
        ],
      },
      {
        heading: 'A number ends the work.',
        lines: [
          'The clearest place this shows is the ferment. A lot is sealed when it reaches its number, not when the shift ends — Lot 001 closed at 48 hours because the pH had come to 4.2, and the reading is what closed it.',
          'Drying follows the same logic on a longer beat: raised beds through the day, covered at night, following the day-night rhythm rather than a fixed count of hours.',
        ],
        after: {
            src: '/regenerative-life/rta/images/rta-1.webp',
            alt: 'Someone crossing open ground in heavy rain under a sheet',
          kind: 'plate',
          type: 'Detail · a pH meter in a ferment tank',
          caption: 'The reading closes the lot',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'Timestamped, so the timing can be argued with.',
        lines: [
          'Every biodynamic application is timestamped to the minute and tagged with the conditions it was made in. That is what makes right time a claim rather than a feeling: the record says what hour the work was done at and what the land was doing at that hour.',
          'A season later the two can be read against each other, which is the only way a rule about timing ever gets better.',
        ],
        after: {
          kind: 'portrait', ratio: '16 / 9',
          src: '/regenerative-life/rta/images/rta-2.webp',
          alt: 'A stockman reaching out to a cow in the mist at dawn',
          caption: 'The hour the animal keeps',
        },
      },
    ],
    record: [
      { value: 'To the minute', label: 'every biodynamic application is timestamped' },
      { value: 'pH 4.2', label: 'where a ferment is stopped, whatever the clock says' },
      { value: 'Buffer days', label: 'built into every plan, because the land keeps its own calendar' },
    ],
    related: [
      { label: 'Rta, in full', href: '/rta' },
      { label: 'Fermentation', href: '/fermentation' },
    ],
  },

  /* 02 ─────────────────────────────────────────────────────────────── */
  {
    id: 'sanctuary',
    label: 'Sanctuary & Stay',
    slug: 'sanctuary-and-stay',
    href: '/regenerative-life/sanctuary-and-stay',
    card: '/regenerative-life/sanctuary-and-stay/images/santuary-hero-banner.webp',
    lede: 'What happens when a piece of land is tended long enough that it begins to tend the people standing on it.',
    hero: {
      type: 'Landscape · two hemispheres',
      caption: 'A network of valleys — two in practice, two more in listening',
    },
    quote: 'Humans are not owners here — only guests of the mountain.',
    movements: [
      {
        heading: 'A sanctuary is a posture a place takes.',
        lines: [
          'You do not visit it so much as fall into step with it. There is no programme to complete and no view to have seen by Thursday.',
          'Morning mist, nothing on the calendar, and a cup of coffee that grew within sight of where you slept. A rhythm you enter, and leave differently than you arrived.',
        ],
        after: {
          kind: 'banner',
          type: 'Wide · morning mist over the blocks',
          caption: 'A rhythm you enter rather than a place you arrive at',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'Four valleys, two hemispheres, one rhythm.',
        lines: [
          'Mudigere is the Indian valley: scale, monsoon, cosmological time, and the place where the herd, the canopy and the record all sit together.',
          'Ohara is the Japanese valley, north of Kyoto: restraint, millimetric care, and lineage carried by craftsmen. Munduk in north Bali and Punakha in western Bhutan are the two being read rather than run — neither is open, and neither has a date.',
        ],
        after: {
          kind: 'plate',
          type: 'Detail · four soils side by side',
          caption: 'Laterite, moss, volcanic basalt, granite — one from each valley',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'What actually travels between them.',
        lines: [
          'Not an aesthetic. What moves is the posture: the same insistence on observing before acting, the same habit of writing down what was done, the same refusal to treat a valley as a backdrop.',
          'Four different soils, four different climates, one operating rhythm. That is the claim being tested, and two of the four valleys are still only being listened to.',
        ],
      },
    ],
    record: [
      { value: 'Two', label: 'valleys in practice — Mudigere and Ohara' },
      { value: 'Two', label: 'valleys in listening — Munduk and Punakha', note: 'Neither is open, and no opening date is set.' },
      { value: '13.17°N', label: 'Mudigere, Karnataka, India' },
      { value: '35.13°N', label: 'Ohara, Kyoto Prefecture, Japan' },
    ],
    related: [
      { label: 'Mudigere', href: '/mudigere' },
      { label: 'Ohara', href: '/ohara' },
    ],
  },

  /* 03 ─────────────────────────────────────────────────────────────── */
  {
    id: 'craft',
    label: 'Artistry',
    slug: 'artistry',
    lede: 'The making side of the estate: what gets built here, and the people who hold the knowledge of how.',
    hero: {
      type: 'Interior · a made room at Ohara',
      caption: 'Built to outlast its builders',
      src: '/regenerative-life/artistry/images/aura-artistry-hero-banner.webp',
      alt: 'A woven bamboo lampshade hanging beside an open doorway at Ohara',
    },
    movements: [
      {
        heading: 'A working atelier.',
        lines: [
          'The atelier is where the estate makes things rather than exhibits them. What comes out of it is the product of the same ground the coffee comes from, and it is made by people who are on the estate because they are working.',
          'The measure of a piece is whether it survives being used. Built to outlast its builders is the standard, and it is a hard one to meet.',
        ],
        after: {
          kind: 'portrait', ratio: '4 / 5',
          src: '/regenerative-life/artistry/images/aura-artistry-3.webp',
          alt: 'A cast-iron kettle on the hearth in the Ohara house',
          caption: 'Where the estate makes rather than exhibits',
        },
      },
      {
        heading: 'The teachers are people who have done one thing for thirty years.',
        lines: [
          'At Ohara the residency sits beside craftsmen whose practice is a lineage — a Shigaraki potter, among others. Sitting close to somebody who has listened to one craft for that long is the transfer method; there is no curriculum.',
          'That knowledge has a clock on it. It leaves when the person does, and writing it down is the part of this work that cannot wait.',
        ],
        after: {
          kind: 'plate',
          src: '/regenerative-life/artistry/images/aura-artistry-2.webp',
          alt: 'A maker being shown how, at the window',
          caption: 'Sit close to someone who has been listening to one craft for thirty years',
        },
      },
      {
        heading: 'Where science and art cross.',
        lines: [
          'The estate seats a coffee fermenter next to a ceramicist and a soil biologist next to a maker. The friction between disciplines is the point — it is where the work nobody else can make gets made.',
          'That is a conviction rather than a finding, and it is why the residency is built the way it is — what comes out of it is the evidence.',
        ],
        after: {
          kind: 'banner',
          src: '/regenerative-life/artistry/images/aura-artistry-1.webp',
          alt: 'A carved stone water basin set into a garden',
          type: '',
          caption: 'Where a discipline shows in an object',
        },
      },
    ],
    related: [
      { label: 'The Atelier', href: '/atelier' },
      { label: 'The residency', href: '/residency' },
      { label: 'Objects & Editions', href: '/from-aura/objects' },
    ],
  },

  /* 04 ─────────────────────────────────────────────────────────────── */
  {
    id: 'plantation',
    label: 'The Plantation',
    slug: 'the-plantation',
    lede: 'A hundred and fifty acres of four-storey canopy, read from a metre underground to the top of the shade trees.',
    /* Six disciplines, because Proof and Climate Resilience were dropped
       as chapters and their audited figures exist nowhere else on the
       site: what is alive in the ground, keeping a plant well, and where
       the rain goes are all the same act of reading this plantation. */
    ...(() => {
      const base = merge('soil', 'biodiversity', 'observation', 'microbiome', 'pathology', 'hydrology')
      const ag = pillar('agroculture')
      /* Agroculture opens the chapter: it is the argument for farming
         this way, and the six disciplines under it are how. */
      return {
        ...base,
        /* Its own banner, not the soil discipline's. A merged chapter
           inherits hero from its first part, which was right while every
           one of them was a grey drafting card and wrong the moment a
           photograph existed for the chapter itself. */
        hero: {
          type: 'Detail · finished compost in the hand',
          caption: 'What the estate makes before it grows anything — Aura Estate, Mudigere',
          src: '/regenerative-life/the-plantation/images/aura-plantation-hero-banner.webp',
          alt: 'Two hands cupping dark finished compost',
        },
        movements: dedupeByHeading([...thinVisuals([ag]), ...(base.movements ?? [])]),
        record: [...ag.record, ...(base.record ?? [])],
        related: dedupeByHref([...ag.related, ...(base.related ?? [])]),
      }
    })(),
  },

  /* 05 ─────────────────────────────────────────────────────────────── */
  {
    id: 'preparations',
    label: 'Vedic & Biodynamic',
    slug: 'vedic-and-biodynamic',
    lede: 'Two preparation traditions, kept for the same reason: the biology. Made on the estate, from this herd, and tested before anything touches the soil.',
    ...merge('biodynamic', 'vedic'),
    /* Its own banner, on the Plantation's precedent. A merged chapter
       inherits its first part's hero, and the biodynamic discipline's was
       a brief for a picture nobody had taken — so the chapter opened on a
       grey field with four photographs below it. The stirring shot was
       the brief, almost word for word, so it is promoted out of the body
       and the movement it sat under runs on its prose. */
    hero: {
      caption: 'Forty-five minutes a day, vortex and reverse — Aura Estate',
      src: '/regenerative-life/vedic-and-biodynamic/images/aura-vedic-biodynamic-04.webp',
      alt: 'Stirring a row of barrels by hand with a wooden pole',
    },
  },

  /* 06 ─────────────────────────────────────────────────────────────── */
  {
    id: 'fermentation',
    label: 'Food & Fermentation',
    slug: 'food-and-fermentation',
    lede: 'Three fermentation disciplines on one estate — coffee, pepper and cow dung. The same process, doing three different jobs.',
    hero: {
      type: 'Process · raking cherry on the drying beds',
      caption: 'Desired microbial activity, held to a number',
      src: '/regenerative-life/food-and-fermentation/images/aura-farm-fermentation-01.webp',
      alt: 'An estate worker turning drying cherry with a wooden rake',
    },
    quote: 'A number ends the ferment. It stops at pH 4.2, whatever the clock says.',
    movements: [
      {
        heading: 'Three disciplines, one process.',
        lines: [
          'Coffee, pepper and cow dung. Each takes a raw material and lets microbial activity turn it into something the estate could not have made directly.',
          'Stripped to its definition, fermentation is only this: desired microbial activity, held long enough and stopped at the right point. What changes between the three is what "desired" means.',
        ],
        after: {
            src: '/regenerative-life/food-and-fermentation/videos/aura-farm-fermentation-01.mp4',
            mediaType: 'video',
            poster: '/regenerative-life/food-and-fermentation/images/aura-farm-fermentation-01.webp',
            alt: 'Cherry turned by hand across the drying beds',
          kind: 'banner',
          type: 'Wide · the fermentation yard',
          caption: 'Coffee, pepper and cow dung — the same process, three jobs',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'Six methods, one Arabica.',
        lines: [
          'Six distinct methods are applied to the same cherry, which is what makes the differences between the lots legible: the variety is held constant and the process is the variable.',
          'Red Honey is dried to 45% moisture first, then fermented 48 hours. The 25-day natural runs mucilage-on, five days thick drying then twenty-five thin, and the oxidation is what turns it. The Solera Maceration is multi-cycle carry-forward — the microbial culture of one batch seeds the next.',
        ],
        after: {
            src: '/regenerative-life/food-and-fermentation/images/aura-farm-fermentation-02.webp',
            alt: 'Drying beds side by side, each labelled with its date and method',
          kind: 'plate',
          type: 'Detail · six lots side by side, drying',
          caption: 'The variety held constant, the process the variable',
          ratio: '16 / 9',
        },
      },
      {
        heading: 'Every lot is tracked.',
        lines: [
          'pH every fifteen minutes, temperature three times a day, and a minimum of twenty-five days of drying. Each lot finds its own clock inside those rules.',
          'The third discipline is the one nobody drinks: the preparations. Cow pat pits are a controlled ferment too, and the same principle governs them — nothing untested goes out.',
        ],
        after: {
          kind: 'portrait', ratio: '16 / 9',
          src: '/regenerative-life/food-and-fermentation/images/aura-farm-fermentation-03.webp',
          alt: 'Cherry drying in raised beds under shade',
          caption: 'Every lot, its own bed and its own file',
        },
      },
    ],
    record: [
      { value: '15 min', label: 'between pH readings through a ferment' },
      { value: 'pH 4.2', label: 'where a ferment is stopped' },
      { value: '3× daily', label: 'temperature readings through a ferment' },
      { value: '25 days', label: 'minimum drying' },
      { value: 'Six', label: 'methods applied to the same Arabica' },
    ],
    related: [
      { label: 'Fermentation, in full', href: '/fermentation' },
      { label: 'Our bean story', href: '/coffee' },
    ],
  },

  /* 07 ─────────────────────────────────────────────────────────────── */
  {
    id: 'intelligence',
    label: 'Aura Intelligence',
    slug: 'aura-intelligence',
    lede: d('intelligence').lede,
    ...(() => {
      const base = body('intelligence')
      const ni = pillar('natural-intelligence')
      /* Natural Intelligence argued the idea on a page of its own. It
         opens this chapter instead — the idea first, then the layer
         built to act on it. */
      return {
        ...base,
        /* After the spread, not before it: `base` carries the
           intelligence discipline's own hero, and a key declared ahead of
           a spread is simply overwritten by it. */
        hero: {
          type: 'Diagram · the estate canopy, mapped',
          caption: 'Every crown on a hundred and fifty acres, plotted — Aura Estate, Mudigere',
          src: '/regenerative-life/aura-intelligence/videos/aura-intelligence-03.mp4',
          mediaType: 'video',
          poster: '/regenerative-life/aura-intelligence/images/aura-intelligence-03.webp',
          alt: 'A canopy map of the estate: tree crowns plotted as green shapes on a plan',
        },
        movements: dedupeByHeading([...thinVisuals([ni]), ...(base.movements ?? [])]),
        record: [...ni.record, ...(base.record ?? [])],
        related: dedupeByHref([...ni.related, ...(base.related ?? [])]),
      }
    })(),
  },
]

export function chapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug)
}
