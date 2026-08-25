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

export type CategoryId = 'activities' | 'biodynamic' | 'biodiversity' | 'labs'

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
    lede: 'The parts of the estate you can stand inside — residencies, stays, and the work that happens with visitors in the room.',
  },
  {
    id: 'biodynamic',
    label: 'Biodynamic',
    lede: 'The practice: preparations buried and exhumed, a herd that feeds the ground, and a calendar older than the written word.',
  },
  {
    id: 'biodiversity',
    label: 'Biodiversity',
    lede: 'Four storeys of canopy and everything living in them. What the estate shelters, and what shelters the estate.',
  },
  {
    id: 'labs',
    label: 'Labs',
    lede: 'Where the claims get tested — ferment logs, colony counts, cupping scores, and the numbers that decide when a tank comes off.',
  },
]

/** Where each published journal sits. A journal may appear in several. */
const ASSIGNMENT: Record<string, CategoryId[]> = {
  '/residency': ['activities'],
  '/artistry': ['activities'],

  '/biodynamic': ['biodynamic'],
  '/herd': ['biodynamic'],
  '/circular': ['biodynamic'],
  '/rta': ['biodynamic'],
  '/land': ['biodynamic'],

  '/ecology': ['biodiversity'],
  '/living-systems': ['biodiversity'],
  '/shade': ['biodiversity'],

  '/fermentation': ['labs'],
  '/coffee': ['labs'],
}

/** A Field Note that has a category but no page yet. */
export type PendingNote = {
  href: string
  title: string
  description: string
  categories: CategoryId[]
}

export const PENDING_NOTES: PendingNote[] = [
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
    description: 'Where a thing came from, proved rather than asserted.',
    categories: ['labs'],
  },
  {
    href: '/cows-of-aura',
    title: 'Cows of Aura',
    description: 'Every animal in the herd carries a record — lineage, grazing block, and what its dung went into.',
    categories: ['biodynamic'],
  },
  {
    href: '/spirit-prayer',
    title: 'Spirit & Prayer',
    description: 'The part of the practice that predates the measurements, and why it is still kept.',
    categories: ['biodynamic'],
  },
  {
    href: '/bug-hotels',
    title: 'Bug Hotels',
    description: 'Deliberate housing for the predators that keep a monoculture from happening.',
    categories: ['biodiversity'],
  },
  {
    href: '/pollinators',
    title: 'Pollinators',
    description: 'Bees through all four canopy layers, and what a flower here sets three trees over.',
    categories: ['biodiversity'],
  },
  {
    href: '/forest-islands',
    title: 'Forest Islands',
    description: 'Untouched stands left inside the planting, and what they seed back into it.',
    categories: ['biodiversity'],
  },
]

/**
 * Pages that live elsewhere on the site but belong in a Field Notes
 * category. Cross-listed, not moved — the canonical home stays where
 * it is, which is why each carries the section it came from.
 */
export type CrossListed = {
  href: string
  title: string
  description: string
  categories: CategoryId[]
  /** The section that owns this page, shown as a small note. */
  from: string
}

export const CROSS_LISTED: CrossListed[] = [
  {
    href: '/regenerative-coffee/transparency',
    title: 'Transparency',
    description: 'Nine streams of data, every batch read before and after, and an honest account of the one thing we cannot yet prove.',
    categories: ['labs'],
    from: 'Regenerative Coffee',
  },
  {
    href: '/regenerative-coffee/flavour',
    title: 'Flavours',
    description: 'Nine lots from one harvest — the ferment, the lab that ends it, and the full file behind every lot.',
    categories: ['labs'],
    from: 'Regenerative Coffee',
  },
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

/** Count shown beside a category in the menu and on the index. */
export function countIn(id: CategoryId): number {
  return notesIn(id).length
}
