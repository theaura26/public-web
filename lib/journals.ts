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
  img?: string
}

/* The published journal set — the reworked editorials/places plus the
   journals live on theaura.life. These drive the "Continue" footer and
   sitemap.xml, each on its own banner (hero) image.

   /areca, /pepper, /provenance and /vedic were registered here for a
   while. The pages render in full, but the menu had them badged
   coming-soon the whole time, so the site linked them from every footer
   and listed them in the sitemap while telling readers they were not out
   yet. They are parked below until they are due. */
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
    href: '/rta',
    title: 'The Land Decides the Hour',
    description: 'Waiting for the window rather than the calendar — and the buffer days a plan carries because of it.',
    img: '/journals/rta/aura-rta.jpg',
  },
  {
    href: '/fermentation',
    title: 'Controlled Decay',
    description: 'Desired microbial activity, held to a number. Coffee, pepper and cow dung, stopped when the reading says so.',
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
    img: '/forest-islands/images/aura-forest-islands-01.webp',
  },
  {
    href: '/bug-hotels',
    title: 'Bug Hotels',
    description: 'A plantation can be full of plants and short of homes. Drilled logs, nothing introduced, and a way to see who turns up.',
    img: '/bug-hotels/images/aura-bug-hotels-01.webp',
  },
  {
    href: '/pollinators',
    title: 'The Flowering Understory',
    description: 'Coffee flowers for about three days a year. What feeds everything else for the other fifty-one weeks is the flowering ground layer, and six invasive plants are taking it.',
    img: '/pollinators/images/aura-the-flowering-understory-01.webp',
  },
  {
    href: '/land-spirit-soul',
    title: 'Land, Spirit, Soul',
    description: 'The lamp at the Gau Angan is lit with ghee from the herd it is lit for — the closed loop, said in one gesture.',
    img: '/land-spirit-soul/images/aura-land-spirit-soul-01.webp',
  },




]

/* Held back deliberately, page and all.
 *
 * Nothing here is unfinished — every one of these renders in full. They
 * are out of the menu, the field-note categories and the sitemap while
 * they wait,
 * and its layout carries robots: noindex so nothing indexes it in the
 * meantime. Moving an entry back into ACTIVE_JOURNALS above, restoring
 * its line in lib/field-notes.ts and its Navbar card, and dropping the
 * robots block puts it back exactly as it was.
 *
 * `categories` is the assignment lib/field-notes.ts had for it, kept here
 * so restoring does not mean guessing.
 */
export const PARKED_JOURNALS: (Journal & { categories: string[] })[] = [
  {
    href: '/areca',
    title: 'The Sentinel Palm',
    description: 'The tallest storey of the canopy, and what it does for everything beneath it.',
    img: '/aura-areca.jpg',
    categories: ['biodiversity'],
  },
  {
    href: '/pepper',
    title: 'Malabar Pepper',
    description: 'The vine that climbs the shade trees, and earns its place doing it.',
    img: '/aura-pepper.jpg',
    categories: ['coffee-fermentation', 'biodiversity'],
  },
  {
    href: '/provenance',
    title: 'Provenance',
    description: 'Where a thing came from, with the record to prove it.',
    img: '/aura-provenance.jpg',
    categories: ['labs'],
  },
  {
    href: '/vedic',
    title: 'Vedic Farming',
    description: 'Knowledge older than the written word, kept alive by staying in use.',
    img: '/aura-vedic.jpg',
    categories: ['biodynamic'],
  },
  {
    href: '/cows-of-aura',
    title: 'Cows of Aura',
    description: 'An ear tag can fall out and a name is not a record. Every animal carries a number issued once, and a job written down.',
    categories: ['animals', 'biodynamic'],
  },
]
/* Pages that appear as an onward link but are not journals, so they have
   no entry above to take a thumbnail from. A card with no picture renders
   as an empty plate, so every href that can reach a card needs one. */
const LINK_IMAGES: Record<string, string> = {
  '/atelier': '/aura-studios/aura-studios.jpg',
  '/mudigere': '/aura-mudigere.jpg',
  '/from-aura/objects': '/from-aura/objects/objects.webp',
  '/regenerative-life/the-reason': '/aura-mudigere-03.jpg',
  '/regenerative-life/aura-intelligence': '/regenerative-life/aura-intelligence/images/aura-intelligence-03.webp',
}

/** True while a page is out of circulation. An onward link to one of
 *  these points a reader at something the site has withdrawn. */
export function isParked(href: string): boolean {
  return PARKED_JOURNALS.some((j) => j.href === href)
}

/** The thumbnail for any onward link — journal, chapter or company page. */
export function linkImage(href: string): string | undefined {
  return journalImage(href) ?? LINK_IMAGES[href]
}

/** The photograph a page opens on, whether the journal is in circulation
 *  or parked. A parked page still renders in full for anyone with the
 *  URL, and it should still open on its own picture. */
export function journalImage(href: string | undefined): string | undefined {
  if (!href) return undefined
  const j = ACTIVE_JOURNALS.find((x) => x.href === href)
    ?? PARKED_JOURNALS.find((x) => x.href === href)
  return j?.img
}

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
