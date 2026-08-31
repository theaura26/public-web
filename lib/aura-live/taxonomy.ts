/* AURA Live — the taxonomy.
 *
 * Not invented here. These are the thirteen subjects the site already
 * publishes under "Now" — Mudigere, as it is today — and the feed uses
 * exactly those, in that order, under those names.
 *
 * That matters for more than tidiness. Every one of them has a page at
 * /now/<slug> waiting to be written, and a feed that sorted the estate
 * into its own private set of buckets would have to be re-sorted the day
 * those pages arrive. tests/aura-live/taxonomy.test.mts fails if the two
 * lists drift apart.
 *
 * A candidate that maps to none of them is not published: an event
 * without a subject is an event nobody decided was worth telling.
 */

export const FEED_CATEGORIES = [
  'seasons',
  'lunar-rhythm',
  'sprays',
  'fertiliser-prep',
  'labs',
  'biodiversity',
  'bees',
  'cows',
  'field-activities',
  'harvest',
  'fermentation',
  'people',
  'prayers',
] as const

export type AuraFeedCategory = (typeof FEED_CATEGORIES)[number]

/** The label the reader sees. Identical to the Now section's own. */
export const CATEGORY_LABEL: Record<AuraFeedCategory, string> = {
  'seasons': 'Seasons',
  'lunar-rhythm': 'Lunar rhythm',
  'sprays': 'Sprays',
  'fertiliser-prep': 'Fertiliser prep',
  'labs': 'Labs',
  'biodiversity': 'Biodiversity',
  'bees': 'Bees',
  'cows': 'Cows',
  'field-activities': 'Field activities',
  'harvest': 'Harvest',
  'fermentation': 'Fermentation',
  'people': 'People & gatherings',
  'prayers': 'Prayers',
}

/** Where the subject lives on the site. */
/* Now is the feed itself rather than an index of subjects, so there is
   no per-category page to point at. Kept as the one place that would
   change if subject pages are ever written. */
export function categoryHref(_category: AuraFeedCategory): string {
  return '/now'
}

/** For the editorial policy document and the audit trail. Never the page. */
export const CATEGORY_BLURB: Record<AuraFeedCategory, string> = {
  'seasons': 'Temperature, rainfall and weather, when they tell a story rather than repeating a measurement.',
  'lunar-rhythm': 'The biodynamic calendar, and work timed against it.',
  'sprays': 'A biodynamic or Vedic preparation that was actually applied to the land.',
  'fertiliser-prep': 'Making the inputs: CPP, Jeevamrit, compost, the biodynamic preparations.',
  'labs': 'Testing, trials and what the estate learned from them.',
  'biodiversity': 'Something wild was seen and recorded — a species, a pollinator, a bird, a reptile, an insect.',
  'bees': 'The hives, and what the bees are doing.',
  'cows': 'Care, health, birth or movement in the herd. Never a headcount.',
  'field-activities': 'Work on the land: planting, shade, clearing, tagging, coffee, tea.',
  'harvest': 'Something came off the land, in a quantity or at a quality worth recording.',
  'fermentation': 'Processing the crop, and what the ferment did.',
  'people': 'A person did something externally interesting. Never attendance, never a meeting.',
  'prayers': 'The estate’s observances, when they are the estate’s to share.',
}

export function isFeedCategory(v: unknown): v is AuraFeedCategory {
  return typeof v === 'string' && (FEED_CATEGORIES as readonly string[]).includes(v)
}
