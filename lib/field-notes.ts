/* Field Notes — the taxonomy behind the menu and the category pages.
 *
 * Field Notes keeps its own eight headings. They are deliberately not
 * the Regenerative Life chapters: a chapter is an argument the estate
 * makes, and a category here is a shelf a note sits on. A reader looking
 * for what the estate wrote about worms is looking for a shelf.
 *
 * Categories are tags, not folders. A note sits in every category it
 * belongs to, and repeating it is cheaper than hiding it — /herd is both
 * biodynamic and animals, /ecology is both biodiversity and land.
 *
 * `lib/journals.ts` stays the source of truth for what is published;
 * this file adds the classification. Every journal must appear in
 * ASSIGNMENT and every assigned href must be a journal — both are
 * asserted at the foot of this file, because each direction has silently
 * dropped a note out of the menu before.
 */

import { ACTIVE_JOURNALS, type Journal } from './journals'

export type CategoryId =
  | 'biodynamic'
  | 'biodiversity'
  | 'labs'
  | 'art-culture'
  | 'land-ecology'
  | 'coffee-fermentation'
  | 'animals'

export type Category = {
  id: CategoryId
  label: string
  /** Shown under the heading on the category page. */
  lede: string
}

/* Seven, in this order, which is the order the menu has always shown
   them in. Activities is not one of them: the residency and the studios
   are Art & Culture, and the festival is where a reader would look for
   it anyway. */
export const CATEGORIES: Category[] = [
  {
    id: 'biodynamic',
    label: 'Biodynamic',
    lede: 'Preparations buried and exhumed on a calendar, fourteen numbered pits, and a herd that makes the fertility the ground is fed with.',
  },
  {
    id: 'biodiversity',
    label: 'Biodiversity',
    lede: 'Four storeys of canopy across 150 acres, and the count of what lives in them — earthworms quarterly, light in lux, dead wood by decay class.',
  },
  {
    id: 'labs',
    label: 'Labs',
    lede: 'Where a claim gets tested. Ferment logs at fifteen-minute intervals, colony counts before and after, and the number that decides when a tank comes off.',
  },
  {
    id: 'art-culture',
    label: 'Art & Culture',
    lede: 'Six studios, an invited residency, and the lamp lit at the Gau Angan every morning before anyone starts work.',
  },
  {
    id: 'land-ecology',
    label: 'Land & Ecology',
    lede: 'Red laterite at 3,600 ft, forest islands built inside the planting, and six introduced plants being taken back out of the understorey.',
  },
  {
    id: 'coffee-fermentation',
    label: 'Coffee & Fermentation',
    lede: 'One harvest split into many lots, and the hours of controlled decay — stopped at pH 4.2 — that decide what reaches the cup.',
  },
  {
    id: 'animals',
    label: 'Animals',
    lede: 'About fifty Malnad Gidda carrying a number each, the insects a plantation forgets to house, and the pollinators nobody has counted yet.',
  },
]

/** Where each published journal sits. A journal may appear in several.
 *  All twenty-three are filed. */
const ASSIGNMENT: Record<string, CategoryId[]> = {
  /* Ways to be here, and the thinking behind them. */
  '/residency': ['art-culture'],
  '/artistry': ['art-culture'],
  '/wisdom': ['art-culture'],
  '/land-spirit-soul': ['art-culture', 'biodynamic'],

  /* The preparations, and the calendar they run on. */
  '/biodynamic': ['biodynamic'],
  '/circular': ['biodynamic', 'labs'],
  '/regenerative-life/rta': ['biodynamic'],
  '/vedic': ['biodynamic'],

  /* The herd, and everything else with a heartbeat. */
  '/herd': ['biodynamic', 'animals'],
  '/cows-of-aura': ['animals', 'biodynamic'],
  '/bug-hotels': ['animals', 'biodiversity'],
  '/pollinators': ['animals', 'biodiversity'],

  /* The ground itself. */
  '/land': ['land-ecology'],
  '/ohara': ['land-ecology'],
  '/forest-islands': ['land-ecology', 'biodiversity'],

  /* What lives in the four storeys. */
  '/ecology': ['biodiversity', 'land-ecology'],
  '/living-systems': ['biodiversity'],
  '/shade': ['biodiversity'],
  '/areca': ['biodiversity'],

  /* Where a claim gets tested. */
  '/provenance': ['labs'],

  /* One harvest, many lots. */
  '/coffee': ['coffee-fermentation', 'labs'],
  '/regenerative-life/food-and-fermentation': ['coffee-fermentation', 'labs'],
  '/pepper': ['coffee-fermentation', 'biodiversity'],
}

/* Notes announced but not yet published.
 *
 * The old version of this list was stale in a way worth remembering: it
 * held six entries and every one had a written page behind it, so the
 * menu advertised pages as unwritten while they sat there rendering.
 *
 * The distinction this list carries is not-yet-PUBLISHED, not
 * not-yet-written. A page can exist and still not be ready to stand
 * behind. Check any addition against the routes first. */
type PendingNote = {
  href: string
  title: string
  description: string
  categories: CategoryId[]
}

const PENDING_NOTES: PendingNote[] = [
  {
    /* The page is written and renders; it is held back rather than
       missing. Publishing is a two-line move: file it in ASSIGNMENT and
       register it in lib/journals.ts. */
    href: '/idea',
    title: 'The 1000 Year Idea',
    description: 'The standard every decision at Aura is measured against, and the seven filters it runs through.',
    categories: ['art-culture'],
  },
]

/**
 * Pages that live elsewhere on the site but belong in a Field Notes
 * category. Cross-listed, not moved — the canonical home stays where
 * it is, which is why each carries the section it came from.
 */
type CrossListed = {
  href: string
  title: string
  description: string
  categories: CategoryId[]
  /** The section that owns this page, shown as a small note. */
  from: string
}

const CROSS_LISTED: CrossListed[] = [
  {
    href: '/mudigere',
    title: 'Mudigere',
    description: 'The Indian valley — scale, monsoon, and cosmological time.',
    categories: ['land-ecology'],
    from: 'Sanctuary',
  },
  {
    href: '/regenerative-life/sanctuary-and-stay',
    title: 'Sanctuary & Stay',
    description: 'Four valleys in two hemispheres, and what it is like to stay in one.',
    categories: ['land-ecology'],
    from: 'Regenerative Life',
  },
  {
    href: '/regenerative-coffee/experience',
    title: 'Aura Festival',
    description: 'Three days on the estate, and a coffee that exists nowhere else.',
    categories: ['art-culture'],
    from: 'Regenerative Coffee',
  },
  {
    href: '/regenerative-coffee/transparency',
    title: 'Transparency',
    description: 'Nine streams of data, signed from the field, and re-read ninety days later.',
    categories: ['labs'],
    from: 'Regenerative Coffee',
  },
  {
    href: '/now',
    title: 'Aura Live',
    description: 'What has happened on the land, taken from the estate’s own record.',
    categories: ['labs'],
    from: 'Now',
  },
]

/** One entry as the category pages render it. */
export type NoteEntry = {
  href: string
  title: string
  description: string
  img?: string
  /** Published, or written but not yet released. */
  status: 'live' | 'soon'
  /** Set when the page's canonical home is another section. */
  from?: string
}

const bySlug = new Map<string, Journal>(ACTIVE_JOURNALS.map((j) => [j.href, j]))

/** Every entry in a category, published first, then the pending ones. */
export function notesIn(id: CategoryId): NoteEntry[] {
  const live: NoteEntry[] = Object.entries(ASSIGNMENT)
    .filter(([, cats]) => cats.includes(id))
    .map(([href]) => bySlug.get(href))
    .filter((j): j is Journal => Boolean(j))
    .map((j) => ({ href: j.href, title: j.title, description: j.description, img: j.img, status: 'live' as const }))

  const borrowed: NoteEntry[] = CROSS_LISTED
    .filter((c) => c.categories.includes(id))
    .map((c) => ({ href: c.href, title: c.title, description: c.description, status: 'live' as const, from: c.from }))

  const soon: NoteEntry[] = PENDING_NOTES
    .filter((n) => n.categories.includes(id))
    .map((n) => ({ href: n.href, title: n.title, description: n.description, status: 'soon' as const }))

  return [...live, ...borrowed, ...soon]
}

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

/* Nothing published may go unfiled. This runs at module load, so an
   unfiled journal fails the build rather than quietly disappearing from
   the menu — which is exactly how notes went missing before. */
const unfiled = ACTIVE_JOURNALS.filter((j) => !ASSIGNMENT[j.href])
if (unfiled.length) {
  throw new Error(
    `lib/field-notes.ts: unfiled journal(s): ${unfiled.map((j) => j.href).join(', ')}`,
  )
}

/* And the other direction, which is the one that actually bit: notesIn
   looks each assigned href up in the journal index and drops the misses,
   so an href assigned here but never registered in lib/journals.ts
   disappears from the menu and the sitemap without a word. */
const unknown = Object.keys(ASSIGNMENT).filter((href) => !bySlug.has(href))
if (unknown.length) {
  throw new Error(
    `lib/field-notes.ts: assigned but not in lib/journals.ts: ${unknown.join(', ')}`,
  )
}
