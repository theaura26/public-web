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
    description: 'The sentence we return to when the spreadsheet disagrees with the soil.',
    img: '/aura-wisdom.jpg',
  },
  {
    href: '/living-systems',
    title: 'Living Systems',
    description: 'Herd, hive, canopy — the farm as one organism.',
    img: '/aura-living-systems.jpg',
  },
  {
    href: '/coffee',
    title: 'Our Coffee Story',
    description: 'Six lots, one appellation. Specialty Arabica at 3,600 ft in the Western Ghats.',
    img: '/aura-coffee.jpg',
  },
  {
    href: '/rta',
    title: 'Rta',
    description: 'Right time, right action. The oldest Sanskrit word for the order of things.',
    img: '/aura-rta.jpg',
  },
  {
    href: '/fermentation',
    title: 'Fermentation',
    description: 'Three disciplines, one precision. Anaerobic, Appassimento, Solera.',
    img: '/aura-fermentation.jpg',
  },
  {
    href: '/land',
    title: 'The Land',
    description: 'One hundred and fifty acres in Mudigere — the lab we live on.',
    img: '/aura-land.jpg',
  },
  {
    href: '/biodynamic',
    title: 'Biodynamic',
    description: 'BD 500 to 508. The farm as organism, on its own calendar.',
    img: '/aura-biodynamic.jpg',
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
