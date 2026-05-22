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

export const ACTIVE_JOURNALS: Journal[] = [
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
    description: 'Land is not an asset. It is ancestry. Mudigere and Ohara, in dialogue.',
    img: '/journals/land/aura-the-land.jpg',
  },
  {
    href: '/biodynamic',
    title: 'Biodynamic',
    description: 'Not a technique. A worldview. BD 500–508, Jeevamrit, Panchgavya — the herd as engine.',
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
