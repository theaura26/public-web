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
  /** The tier beneath this one, revealed on hover. A parent with
      children is a subject; its children are variants of it — the
      seasons of a crop, the parts of a place. */
  children?: NavLeaf[]
}

export type NavSection = {
  id: string
  label: string
  /** Hidden from the section row. Still routed, still in the sitemap —
      Now is reached through the Live indicator instead of a tab. */
  offTabs?: boolean
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
    /* The sitemap indents Agroculture, Hospitality and Atelier under
       Natural Intelligence, and the places under Sanctuaries. They are
       tiers, not siblings. */
    items: [
      /* The existing Reason page answers "why", so it keeps that
         question as its name. Natural Intelligence is the idea the page
         argues for, and gets its own place above its three parts. */
      { label: 'Why Aura?', href: '/reason' },
      {
        label: 'Natural Intelligence',
        href: '/reason/natural-intelligence',
        soon: true,
        children: [
          { label: 'Agroculture', href: '/reason/agroculture', soon: true },
          { label: 'Hospitality', href: '/reason/hospitality', soon: true },
          { label: 'Atelier', href: '/atelier' },
        ],
      },
      {
        label: 'Sanctuaries',
        href: '/sanctuary',
        children: [
          { label: 'Mudigere', href: '/mudigere' },
          { label: 'Ohara', href: '/ohara' },
          { label: 'Munduk', href: '/sanctuary/munduk', soon: true },
          { label: 'Punakha', href: '/sanctuary/punakha', soon: true },
        ],
      },
      { label: 'Moral Spine', href: '/wisdom' },
    ],
  },
  {
    id: 'life',
    label: 'Regenerative Life',
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
    /* The journals are Field Notes now, filed under the category they
       belong to. A note may sit in more than one — the taxonomy in
       lib/field-notes.ts already treats categories as tags rather than
       folders, and repeating a note is cheaper than hiding it. */
    items: [
      {
        label: 'Biodynamic',
        href: '/field-notes/biodynamic',
        children: [
          { label: 'A living organism', href: '/biodynamic' },
          { label: 'Circular Intelligence', href: '/circular' },
          { label: 'Rta', href: '/rta' },
          { label: 'Vedic Farming', href: '/vedic' },
        ],
      },
      {
        label: 'Biodiversity',
        href: '/field-notes/biodiversity',
        children: [
          { label: 'The Living System', href: '/ecology' },
          { label: 'The Light Instrument', href: '/shade' },
          { label: 'Living Systems', href: '/living-systems' },
          { label: 'The Sentinel Palm', href: '/areca' },
        ],
      },
      {
        label: 'Labs',
        href: '/field-notes/labs',
        children: [
          { label: 'Fermentation', href: '/fermentation' },
          { label: 'Provenance', href: '/provenance' },
        ],
      },
      {
        label: 'Art & Culture',
        href: '/field-notes/art-culture',
        soon: true,
        children: [
          { label: 'Artistry', href: '/artistry' },
          { label: 'Monastic Polymaths', href: '/residency' },
          { label: 'Moral Spine', href: '/wisdom' },
        ],
      },
      {
        label: 'Land & Ecology',
        href: '/field-notes/land-ecology',
        soon: true,
        children: [
          { label: 'The Land', href: '/land' },
          { label: 'Mudigere', href: '/mudigere' },
          { label: 'Asa. Niwa.', href: '/ohara' },
        ],
      },
      {
        label: 'Coffee & Fermentation',
        href: '/field-notes/coffee-fermentation',
        soon: true,
        children: [
          { label: 'Our bean story', href: '/coffee' },
          { label: 'Fermentation', href: '/fermentation' },
          { label: 'Malabar Pepper', href: '/pepper' },
        ],
      },
      {
        label: 'Animals',
        href: '/field-notes/animals',
        soon: true,
        children: [
          { label: 'Ecosystem Engineers', href: '/herd' },
          { label: 'Cows of Aura', href: '/field-notes/cows-of-aura', soon: true },
          { label: 'Pollinators', href: '/field-notes/pollinators', soon: true },
          { label: 'Bug Hotels', href: '/field-notes/bug-hotels', soon: true },
        ],
      },
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
      {
        label: 'Coffee',
        href: '/from-aura/coffee',
        soon: true,
        children: [
          { label: '25/26 — nine lots', href: '/from-aura/coffee-25-26', soon: true },
          { label: '26/27 — blocks and zones', href: '/from-aura/coffee-26-27', soon: true },
          { label: '27/28 — pre-book', href: '/from-aura/coffee-27-28', soon: true },
        ],
      },
      {
        label: 'Tea',
        href: '/from-aura/tea',
        soon: true,
        children: [
          { label: '27/28 — pre-book', href: '/from-aura/tea-27-28', soon: true },
        ],
      },
      {
        label: 'Pepper',
        href: '/from-aura/pepper',
        soon: true,
        children: [
          { label: '25/26 — black and white', href: '/from-aura/pepper-25-26', soon: true },
          { label: '26/27 — blocks and zones', href: '/from-aura/pepper-26-27', soon: true },
        ],
      },
      {
        label: 'Areca nut',
        href: '/from-aura/areca',
        soon: true,
        children: [
          { label: '27/28 — pre-book', href: '/from-aura/areca-27-28', soon: true },
        ],
      },
      {
        label: 'Farm Goods',
        href: '/from-aura/farm-goods',
        soon: true,
        children: [
          { label: 'Avocado', href: '/from-aura/avocado', soon: true },
          { label: 'Cardamom', href: '/from-aura/cardamom', soon: true },
          { label: 'Soapnut', href: '/from-aura/soapnut', soon: true },
          { label: 'Honey', href: '/from-aura/honey', soon: true },
        ],
      },
      {
        label: 'Objects & Editions',
        href: '/from-aura/objects',
        soon: true,
        children: [
          { label: 'Art', href: '/from-aura/art', soon: true },
          { label: 'Fashion', href: '/from-aura/fashion', soon: true },
          { label: 'Stationery', href: '/from-aura/stationery', soon: true },
        ],
      },
      {
        label: 'Experiences',
        href: '/from-aura/experiences',
        soon: true,
        children: [
          { label: 'Artist residencies', href: '/residency' },
          { label: 'Farm tours', href: '/from-aura/farm-tours', soon: true },
          { label: 'Harvest tours', href: '/from-aura/harvest-tours', soon: true },
        ],
      },
      { label: 'View all', href: '/from-aura' },
    ],
  },
  {
    id: 'now',
    label: 'Now',
    offTabs: true,
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
function flatten(items: NavLeaf[]): NavLeaf[] {
  return items.flatMap((i) => (i.children ? [i, ...i.children] : [i]))
}

/** Every item in the site, parents and children alike. */
export const ALL_LEAVES: NavLeaf[] = SECTIONS.flatMap((s) => flatten(s.items))

export function stubSlugs(prefix: string): string[] {
  return ALL_LEAVES
    .filter((i) => i.soon && i.href.startsWith(`${prefix}/`))
    .map((i) => i.href.slice(prefix.length + 1))
}

/** The label a stub URL should announce. */
export function labelFor(href: string): string | null {
  for (const s of SECTIONS) {
    for (const i of s.items) {
      if (i.href === href) return i.label
      for (const c of i.children ?? []) if (c.href === href) return `${i.label} — ${c.label}`
    }
  }
  return null
}

/** Which section a path belongs to, for marking the menu. */
export function sectionFor(pathname: string): string | null {
  let best: { id: string; len: number } | null = null
  for (const s of SECTIONS) {
    for (const i of flatten(s.items)) {
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

/** The sections that appear as tabs. */
export const TABS = SECTIONS.filter((s) => !s.offTabs)
