/* The site's structure, in one place.
 *
 * The navigation, the coming-soon stub routes and the sitemap are all
 * generated from this, so they cannot drift apart. Adding a page here is
 * what makes it appear in the menu AND gives it a URL that resolves;
 * removing `soon` is what turns the stub into the real thing.
 *
 * `soon: true` means the item is part of the structure but has no page
 * written yet. It still gets a URL — a stub renders there — because a
 * menu item that goes nowhere is worse than one that goes somewhere
 * honest.
 */

export type NavLeaf = {
  label: string
  href: string
  /** No page written yet. Renders a stub at `href`. */
  soon?: boolean
  /** A heading inside a section, not a link — e.g. "Coffee" over its lots. */
  group?: string
}

export type NavSection = {
  id: string
  label: string
  /** The section's own landing page, when it has one. */
  href?: string
  /** One line under the section name in the menu. */
  note?: string
  items: NavLeaf[]
}

export const SECTIONS: NavSection[] = [
  {
    id: 'reason',
    label: 'The Reason',
    href: '/reason',
    note: 'Why any of this exists.',
    items: [
      { label: 'Natural Intelligence', href: '/reason' },
      { label: 'Agroculture', href: '/reason/agroculture', soon: true },
      { label: 'Hospitality', href: '/reason/hospitality', soon: true },
      { label: 'Atelier', href: '/atelier' },
      { label: 'Moral Spine', href: '/wisdom' },
      { label: 'Sanctuaries', href: '/sanctuary' },
      { label: 'Mudigere', href: '/mudigere' },
      { label: 'Ohara', href: '/ohara' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    id: 'life',
    label: 'The Regenerative Life',
    href: '/regenerative-life',
    note: 'The nine disciplines the estate is farmed by.',
    /* These are the nine glyphs on the Remarkable Circle. Same nine, same
       order, so the menu and the mark agree. */
    items: [
      { label: 'Biodynamic', href: '/biodynamic' },
      { label: 'Aura Intelligence', href: '/regenerative-life/aura-intelligence', soon: true },
      { label: 'Tree Level Observation', href: '/regenerative-life/tree-level-observation', soon: true },
      { label: 'Microbiome', href: '/regenerative-life/microbiome', soon: true },
      { label: 'Hydrology', href: '/regenerative-life/hydrology', soon: true },
      { label: 'Biodiversity', href: '/regenerative-life/biodiversity', soon: true },
      { label: 'Plant Pathology', href: '/regenerative-life/plant-pathology', soon: true },
      { label: 'Vedic Farming', href: '/vedic' },
      { label: 'Soil', href: '/regenerative-life/soil', soon: true },
    ],
  },
  {
    id: 'notes',
    label: 'Field Notes',
    href: '/field-notes',
    note: 'What the estate has learned, written down.',
    items: [
      { label: 'Biodynamic', href: '/field-notes/biodynamic' },
      { label: 'Biodiversity', href: '/field-notes/biodiversity' },
      { label: 'Labs', href: '/field-notes/labs' },
      { label: 'Art & Culture', href: '/field-notes/art-culture', soon: true },
      { label: 'Land & Ecology', href: '/field-notes/land-ecology', soon: true },
      { label: 'Coffee & Fermentation', href: '/field-notes/coffee-fermentation', soon: true },
      { label: 'From Mudigere', href: '/field-notes/from-mudigere', soon: true },
      { label: 'From Ohara', href: '/field-notes/from-ohara', soon: true },
      { label: 'Animals', href: '/field-notes/animals', soon: true },
      { label: 'Tech & Robotics', href: '/field-notes/tech-robotics', soon: true },
      { label: 'View all', href: '/field-notes' },
    ],
  },
  {
    id: 'shop',
    label: 'From Aura',
    href: '/from-aura',
    note: 'What the land produced, and what it is doing now.',
    items: [
      { group: 'Coffee', label: '25/26 — nine lots', href: '/from-aura/coffee-25-26', soon: true },
      { group: 'Coffee', label: '26/27 — blocks and zones', href: '/from-aura/coffee-26-27', soon: true },
      { group: 'Coffee', label: '27/28 — pre-book', href: '/from-aura/coffee-27-28', soon: true },
      { group: 'Tea', label: '27/28 — pre-book', href: '/from-aura/tea-27-28', soon: true },
      { group: 'Pepper', label: '25/26 — black and white', href: '/from-aura/pepper-25-26', soon: true },
      { group: 'Pepper', label: '26/27 — blocks and zones', href: '/from-aura/pepper-26-27', soon: true },
      { group: 'Areca nut', label: '27/28 — pre-book', href: '/from-aura/areca-27-28', soon: true },
      { label: 'Other farm produce', href: '/from-aura/farm-produce', soon: true },
      { label: 'Objects & Editions', href: '/from-aura/objects', soon: true },
      { group: 'Experiences', label: 'Artist residencies', href: '/residency' },
      { group: 'Experiences', label: 'Farm tours', href: '/from-aura/farm-tours', soon: true },
      { group: 'Experiences', label: 'Harvest tours', href: '/from-aura/harvest-tours', soon: true },
      { label: 'View all', href: '/from-aura', soon: true },
    ],
  },
  {
    id: 'now',
    label: 'Now',
    href: '/now',
    note: 'Mudigere, as it is today.',
    items: [
      { label: 'Seasons', href: '/now/seasons', soon: true },
      { label: 'Lunar rhythm', href: '/now/lunar-rhythm', soon: true },
      { label: 'Sprays', href: '/now/sprays', soon: true },
      { label: 'Fertiliser prep', href: '/now/fertiliser-prep', soon: true },
      { label: 'Labs', href: '/now/labs', soon: true },
      { label: 'Biodiversity', href: '/now/biodiversity', soon: true },
      { label: 'Bees', href: '/now/bees', soon: true },
      { label: 'Cows', href: '/now/cows', soon: true },
      { label: 'Field activities', href: '/now/field-activities', soon: true },
      { label: 'Harvest', href: '/now/harvest', soon: true },
      { label: 'Fermentation', href: '/now/fermentation', soon: true },
      { label: 'People & gatherings', href: '/now/people', soon: true },
      { label: 'Prayers', href: '/now/prayers', soon: true },
    ],
  },
]

/** Every stub URL under a given prefix, for generateStaticParams. */
export function stubSlugs(prefix: string): string[] {
  return SECTIONS.flatMap((s) => s.items)
    .filter((i) => i.soon && i.href.startsWith(`${prefix}/`))
    .map((i) => i.href.slice(prefix.length + 1))
}

/** The label a stub URL should announce. */
export function labelFor(href: string): string | null {
  for (const s of SECTIONS) {
    for (const i of s.items) if (i.href === href) return i.group ? `${i.group} — ${i.label}` : i.label
  }
  return null
}

/** Which section a path belongs to, for marking the menu. */
export function sectionFor(pathname: string): string | null {
  let best: { id: string; len: number } | null = null
  for (const s of SECTIONS) {
    for (const i of s.items) {
      if (pathname === i.href || pathname.startsWith(`${i.href}/`)) {
        if (!best || i.href.length > best.len) best = { id: s.id, len: i.href.length }
      }
    }
    if (s.href && (pathname === s.href || pathname.startsWith(`${s.href}/`))) {
      if (!best || s.href.length > best.len) best = { id: s.id, len: s.href.length }
    }
  }
  return best?.id ?? null
}
