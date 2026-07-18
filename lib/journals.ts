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
   sitemap.xml, each on its own banner (hero) image. Two not-yet-published
   journals (idea, vedic) show as "coming soon" tiles in the slide-out menu
   (components/Navbar.tsx) but stay out of Continue and the sitemap. */
export const ACTIVE_JOURNALS: Journal[] = [
  {
    href: '/herd',
    title: 'Ecosystem Engineers',
    description: 'Fifty-two Malnad Gidda as the estate’s biological engine — each passported, grazing the ground it feeds.',
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
    title: 'The Living System',
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
    title: 'Our Coffee Story',
    description: 'Six lots, one harvest. The same Arabica, six fermentation methods, six cups.',
    img: '/journals/coffee/aura-our-coffee-story.jpg',
  },
  {
    href: '/rta',
    title: 'Rta',
    description: 'Right time, right action. The Vedic order that governs every decision on the estate.',
    img: '/journals/rta/aura-rta.jpg',
  },
  {
    href: '/fermentation',
    title: 'Fermentation',
    description: 'Three fermentation disciplines, one estate. Coffee, pepper, and cow dung.',
    img: '/journals/fermentation/aura-fermentation.jpg',
  },
  {
    href: '/land',
    title: 'The Land',
    description: 'Land carries ancestry, not just acreage. Mudigere and Ohara, in dialogue.',
    img: '/journals/land/aura-the-land.jpg',
  },
  {
    href: '/biodynamic',
    title: 'Biodynamic',
    description: 'A worldview, worked as method. BD 500–508, Jeevamrit, Panchgavya — the herd as engine.',
    img: '/journals/biodynamic/aura-biodynamic.jpg',
  },
  {
    href: '/residency',
    title: 'Monastic Polymaths',
    description: 'An artist residency for natural intelligence. Embedded, invitation-based.',
    img: '/journals/residency/aura-monastic-polymath.jpg',
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
