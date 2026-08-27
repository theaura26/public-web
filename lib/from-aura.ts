/* From Aura — what leaves the estate, in three directions.
 *
 * Not a catalogue of crops. The land, the atelier and the trade desk are
 * three different relationships with three different people on the other
 * end: someone buying a kilo, someone buying a made object, and someone
 * buying a container or funding a block. Sorting by crop hid that; these
 * three groups are the story.
 *
 * Nothing here is for sale yet. Every line is carried as coming soon,
 * and the estate publishes what it grows before it publishes a price.
 */

import type { NoteEntry } from './field-notes'

export type Lane = {
  id: string
  label: string
  lede: string
  items: NoteEntry[]
}

const soon = (href: string, title: string, description: string): NoteEntry => ({
  href,
  title,
  description,
  status: 'soon',
})

export const FROM_AURA: Lane[] = [
  {
    id: 'land',
    label: 'From the Land',
    lede: 'Coffee, tea, pepper, areca and seasonal produce — and the fertility the estate makes to grow them.',
    items: [
      soon('/from-aura/coffee', 'Coffee', 'Arabica at 3,600 ft under native shade. One harvest, many lots, every lot with its file.'),
      soon('/from-aura/tea', 'Tea', 'Thirty-two acres, in organic transition targeting 2027.'),
      soon('/from-aura/pepper', 'Pepper', 'Malabar vines climbing the shade trees, black and white.'),
      soon('/from-aura/areca', 'Areca Nut', 'The tallest storey of the canopy, and what it earns.'),
      soon('/from-aura/farm-goods', 'Farm Goods', 'Avocado, cardamom, soapnut and honey, as the season gives them.'),
      soon('/from-aura/fertiliser', 'Fertiliser', 'Jeevamrit and cow pat pit, brewed from the herd and tested before and after.'),
    ],
  },
  {
    id: 'atelier',
    label: 'From the Atelier',
    lede: 'Objects, art, craft and limited editions — what the estate makes when it is not farming.',
    items: [
      soon('/from-aura/art', 'Art', 'Work made on the estate, and work made about it.'),
      soon('/from-aura/objects', 'Objects', 'Things for the hand, cut from what the land already grows.'),
      soon('/from-aura/craft', 'Craft', 'Six studios, and the disciplines they keep alive.'),
      soon('/from-aura/editions', 'Limited Editions', 'Made once, numbered, and not made again.'),
    ],
  },
  {
    id: 'partners',
    label: 'For Our Partners',
    lede: 'Green coffee, trade, institutional collaborations and funding partnerships.',
    items: [
      soon('/from-aura/green-coffee', 'Green Coffee', 'Lot-level, at volume, with the wet mill record attached.'),
      soon('/from-aura/trade', 'Trade', 'For roasters and buyers who want the block as well as the bag.'),
      soon('/from-aura/collaborations', 'Institutional Collaborations', 'Research on a working estate — monitoring, trials, and access to the record.'),
      soon('/from-aura/funding', 'Funding Partnerships', 'Capital for land that is meant to be worth more in a hundred years.'),
    ],
  },
]

/** Every href From Aura owns, for the stub routes. */
export const FROM_AURA_SLUGS = FROM_AURA.flatMap((l) =>
  l.items.map((i) => i.href.replace('/from-aura/', '')),
)
