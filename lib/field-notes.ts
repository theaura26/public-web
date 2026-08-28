/* Field Notes — the taxonomy behind the menu and the category pages.
 *
 * Categories are tags, not folders. One journal can sit in more than
 * one category, and the coffee microsite's lab pages are cross-listed
 * here without moving: they live under Shop and appear in Labs too.
 *
 * `lib/journals.ts` stays the source of truth for what is published.
 * This file adds the classification and the not-yet-written entries.
 */

import { ACTIVE_JOURNALS, type Journal } from './journals'

export type CategoryId =
  | 'activities'
  | 'biodynamic'
  | 'biodiversity'
  | 'labs'
  | 'animals'
  | 'land-ecology'
  | 'art-culture'
  | 'coffee-fermentation'

export type Category = {
  id: CategoryId
  label: string
  /** Shown under the heading on the category page. */
  lede: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'activities',
    label: 'Activities',
    lede: 'Three ways to be here — an invited residency, the studios, and the days the estate opens to people from outside it.',
  },
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
  /* The menu named these five long before this file did, so they
     resolved to stubs and had to be marked coming-soon in the nav while
     the notes filed under them were already written. They are real
     categories with real notes in them now. */
  {
    id: 'animals',
    label: 'Animals',
    lede: 'Fifty-two Malnad Gidda carrying a number each, the insects a plantation forgets to house, and the pollinators nobody has counted yet.',
  },
  {
    id: 'land-ecology',
    label: 'Land & Ecology',
    lede: 'Red laterite at 3,600 ft, forest islands built inside the planting, and six introduced plants being taken back out of the understorey.',
  },
  {
    id: 'art-culture',
    label: 'Art & Culture',
    lede: 'Six studios, an invited residency, and the lamp lit at the Gau Angan every morning before anyone starts work.',
  },
  {
    id: 'coffee-fermentation',
    label: 'Coffee & Fermentation',
    lede: 'One harvest split into many lots, and the hours of controlled decay — stopped at pH 4.2 — that decide what reaches the cup.',
  },
]

/** Where each published journal sits. A journal may appear in several. */
const ASSIGNMENT: Record<string, CategoryId[]> = {
  '/residency': ['activities', 'art-culture'],
  '/artistry': ['activities', 'art-culture'],
  '/wisdom': ['art-culture'],

  '/biodynamic': ['biodynamic'],
  '/circular': ['biodynamic'],
  '/rta': ['biodynamic'],
  '/vedic': ['biodynamic'],

  '/herd': ['biodynamic', 'animals'],

  '/land': ['land-ecology'],
  '/mudigere': ['land-ecology'],
  '/ohara': ['land-ecology'],

  '/ecology': ['biodiversity', 'land-ecology'],
  '/living-systems': ['biodiversity'],
  '/shade': ['biodiversity'],
  '/areca': ['biodiversity'],

  '/forest-islands': ['biodiversity', 'land-ecology'],
  '/bug-hotels': ['biodiversity', 'animals'],
  '/pollinators': ['biodiversity', 'animals'],
  '/cows-of-aura': ['animals', 'biodynamic'],
  '/land-spirit-soul': ['art-culture'],

  '/fermentation': ['labs', 'coffee-fermentation'],
  '/coffee': ['labs', 'coffee-fermentation'],
  '/pepper': ['coffee-fermentation'],
  '/provenance': ['labs'],
}

/** A Field Note that has a category but no page yet. */
type PendingNote = {
  href: string
  title: string
  description: string
  categories: CategoryId[]
}

const PENDING_NOTES: PendingNote[] = [
  /* Written but not yet published — these show as coming-soon tiles in
     the menu feed too, so the two surfaces agree. */
  {
    href: '/sanctuary',
    title: 'Sanctuary',
    description: 'What the estate protects when nobody is watching it.',
    categories: ['activities'],
  },
  {
    href: '/vedic',
    title: 'Vedic Farming',
    description: 'Knowledge older than the written word, kept alive by staying in use.',
    categories: ['biodynamic'],
  },
  {
    href: '/areca',
    title: 'The Sentinel Palm',
    description: 'The tallest storey of the canopy, and what it does for everything beneath it.',
    categories: ['biodiversity'],
  },
  {
    href: '/pepper',
    title: 'Malabar Pepper',
    description: 'The vine that climbs the shade trees, and earns its place doing it.',
    categories: ['biodiversity'],
  },
  {
    href: '/provenance',
    title: 'Provenance',
    description: 'Where a thing came from, with the record to prove it.',
    categories: ['labs'],
  },
  {
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
]

/** One entry as the category pages render it. */
export type NoteEntry = {
  href: string
  title: string
  description: string
  img?: string
  /** Published, or commissioned and not yet written. */
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
    .map((j) => ({ href: j.href, title: j.title, description: j.description, img: j.img, status: 'live' }))

  const borrowed: NoteEntry[] = CROSS_LISTED
    .filter((c) => c.categories.includes(id))
    .map((c) => ({ href: c.href, title: c.title, description: c.description, status: 'live', from: c.from }))

  const soon: NoteEntry[] = PENDING_NOTES
    .filter((n) => n.categories.includes(id))
    .map((n) => ({ href: n.href, title: n.title, description: n.description, status: 'soon' }))

  return [...live, ...borrowed, ...soon]
}

export function categoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}
