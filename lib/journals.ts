/* Active journal index — single source of truth for the slide-out menu
   feed AND the in-article "Continue" footer cards. Order is the order
   readers see them in the menu; the same order drives the "next read"
   sequence at the bottom of any journal. */

export type Journal = {
  href: string
  title: string
  /** One-line teaser shown on the Continue card. Usually echoes the
   *  page's hero subline. */
  description: string
  /** Thumbnail used by Continue cards and the slide-out journal feed. */
  img: string
}

/* The published journal set — the reworked editorials/places plus the
   journals live on theaura.life. These drive the "Continue" footer and
   sitemap.xml, each on its own banner (hero) image.

   The note about idea and vedic being unpublished was years out of date:
   both render full pages, as do /areca, /pepper and /provenance. They
   were listed as coming-soon in the menu while the pages sat written,
   and were absent from Continue and the sitemap entirely. Registered
   below, which is what makes them reachable. */
export const ACTIVE_JOURNALS: Journal[] = [
  {
    href: '/herd',
    title: 'Ecosystem Engineers',
    description: 'About fifty Malnad Gidda as the estate’s biological engine — each passported, grazing the ground it feeds.',
    img: '/herd/images/aura-relationship2.jpg',
  },
  {
    href: '/circular',
    title: 'Circular Intelligence',
    description: 'The herd’s dung, remade into measured fertility — hand-turned CPP pits and 154,000 litres of Jeevamrit, tested before the soil.',
    img: '/circular/images/aura-shed.jpg',
  },
  {
    href: '/shade',
    title: 'The Light Instrument',
    description: 'Shade whiskering, measured in lux. An old canopy craft, cut to prescription and validated against its own numbers.',
    img: '/aura-land.jpg',
  },
  {
    href: '/ecology',
    title: 'The Health Index',
    description: 'The whole farm, read and measured — dead wood, fungi, worms, and one Ecological Health Index per block.',
    img: '/aura-mudigere-landscape.jpg',
  },
  {
    href: '/artistry',
    title: 'Artistry',
    description: 'A space to make. Six studios cut from the estate, and what leaves them.',
    img: '/aura-artistry.jpg',
  },
  {
    href: '/ohara',
    title: 'Ohara',
    description: 'Asa and Niwa. A valley north of Kyoto that keeps its own time.',
    img: '/aura-ohara.jpg',
  },
  {
    href: '/wisdom',
    title: 'Moral Spine',
    description: 'The things we will not do. Attention as a moral choice, restraint as intelligence.',
    img: '/journals/wisdom/aura-moral-spine.jpg',
  },
  {
    href: '/living-systems',
    title: 'Living Systems',
    description: 'A forest that produces crops. Four canopy stories read as one organism.',
    img: '/journals/living-systems/aura-living-systems.jpg',
  },
  {
    href: '/coffee',
    title: 'Our Bean Story',
    description: 'Six lots, one harvest. The same Arabica, six fermentation methods, six cups.',
    img: '/journals/coffee/aura-our-coffee-story.jpg',
  },
  {
    href: '/regenerative-life/rta',
    title: 'Rta',
    description: 'Right time, right action. The Vedic order that governs every decision on the estate.',
    img: '/journals/rta/aura-rta.jpg',
  },
  {
    href: '/regenerative-life/food-and-fermentation',
    title: 'Fermentation',
    description: 'Three fermentation disciplines, one estate. Coffee, pepper, and cow dung.',
    img: '/journals/fermentation/aura-fermentation.jpg',
  },
  {
    href: '/land',
    title: 'The Land',
    description: 'Land carries ancestry as well as acreage. Mudigere and Ohara, in dialogue.',
    img: '/journals/land/aura-the-land.jpg',
  },
  {
    href: '/biodynamic',
    title: 'A Living Organism',
    description: 'A worldview, worked as method. BD 500–508, Jeevamrit, Panchgavya — the herd as engine.',
    img: '/journals/biodynamic/aura-biodynamic.jpg',
  },
  {
    href: '/residency',
    title: 'Monastic Polymaths',
    description: 'An artist residency for natural intelligence. Embedded, invitation-based.',
    img: '/journals/residency/aura-monastic-polymath.jpg',
  },
  {
    href: '/forest-islands',
    title: 'Forest Islands',
    description: 'Small ecological nuclei built inside the planting — four metres of dung and green cuttings, then left alone.',
    img: '/aura-placeholder.svg',
  },
  {
    href: '/bug-hotels',
    title: 'Bug Hotels',
    description: 'A plantation can be full of plants and short of homes. Drilled logs, nothing introduced, and a way to see who turns up.',
    img: '/aura-placeholder.svg',
  },
  {
    href: '/pollinators',
    title: 'Pollinators',
    description: 'Six invasive plants are taking the flowering understorey. What is being done about it, and what nobody has counted yet.',
    img: '/aura-placeholder.svg',
  },
  {
    href: '/cows-of-aura',
    title: 'Cows of Aura',
    description: 'An ear tag can fall out and a name is not a record. Every animal carries a number issued once, and a job written down.',
    img: '/aura-placeholder.svg',
  },
  {
    href: '/land-spirit-soul',
    title: 'Land, Spirit, Soul',
    description: 'The lamp at the Gau Angan is lit with ghee from the herd it is lit for — the closed loop, said in one gesture.',
    img: '/aura-placeholder.svg',
  },
  {
    href: '/vedic',
    title: 'Vedic Farming',
    description: 'Knowledge older than the written word, kept alive by staying in use.',
    img: '/aura-vedic.jpg',
  },
  {
    href: '/areca',
    title: 'The Sentinel Palm',
    description: 'The tallest storey of the canopy, and what it does for everything beneath it.',
    img: '/aura-areca.jpg',
  },
  {
    href: '/pepper',
    title: 'Malabar Pepper',
    description: 'The vine that climbs the shade trees, and earns its place doing it.',
    img: '/aura-pepper.jpg',
  },
  {
    href: '/provenance',
    title: 'Provenance',
    description: 'Where a thing came from, with the record to prove it.',
    img: '/aura-provenance.jpg',
  },
]
/** The next N journals after `currentHref`, wrapping around. Excludes
 *  the current page itself. Used by the `<Continue>` footer. */
export function nextActiveJournals(currentHref: string | undefined, count = 3): Journal[] {
  const filtered = ACTIVE_JOURNALS.filter(j => j.href !== currentHref)
  if (!currentHref) return filtered.slice(0, count)
  const currentIndex = ACTIVE_JOURNALS.findIndex(j => j.href === currentHref)
  if (currentIndex < 0) return filtered.slice(0, count)
  // Start with the journal AFTER current, wrap around.
  const ordered: Journal[] = []
  for (let i = 1; i <= ACTIVE_JOURNALS.length && ordered.length < count; i++) {
    const j = ACTIVE_JOURNALS[(currentIndex + i) % ACTIVE_JOURNALS.length]
    if (j.href !== currentHref) ordered.push(j)
  }
  return ordered
}
