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
    lede: 'Coffee, tea, pepper, areca and seasonal produce — and the fertility the estate brews to grow them.',
    items: [
      soon('/from-aura/coffee-25-26', 'Coffee 25/26', 'Nine lots from one harvest, each with its own wet mill file.'),
      soon('/from-aura/coffee-26-27', 'Coffee 26/27', 'By block and by zone, sold against the canopy reading that shaped it.'),
      soon('/from-aura/coffee-27-28', 'Coffee 27/28', 'Pre-book, before the cherry is on the tree.'),
      soon('/from-aura/tea-27-28', 'Tea 27/28', 'Thirty-two acres, in organic transition targeting 2027. Pre-book.'),
      soon('/from-aura/pepper-25-26', 'Pepper 25/26', 'Malabar, black and white, off the vines that climb the shade trees.'),
      soon('/from-aura/pepper-26-27', 'Pepper 26/27', 'By block and by zone.'),
      soon('/from-aura/areca-27-28', 'Areca 27/28', 'From the tallest storey of the canopy. Pre-book.'),
      soon('/from-aura/avocado', 'Avocado', 'Seasonal, and only when the season gives it.'),
      soon('/from-aura/cardamom', 'Cardamom', 'Grown in the understorey, under everything else.'),
      soon('/from-aura/soapnut', 'Soapnut', 'What the estate washes with, and what it can spare.'),
      soon('/from-aura/honey', 'Honey', 'From colonies recovering on ground that carries no pesticide.'),
      soon('/from-aura/jeevamrit', 'Jeevamrit', 'Brewed from the herd, tested before and after, to volume against the calendar.'),
      soon('/from-aura/cow-pat-pit', 'Cow Pat Pit', 'Ninety days in a numbered pit, hand-turned, and lab-tested before it leaves.'),
    ],
  },
  {
    id: 'atelier',
    label: 'From the Atelier',
    lede: 'Objects, art, craft and limited editions — what the estate makes when it is not farming.',
    items: [
      soon('/from-aura/art', 'Art', 'Work made on the estate, and work made about it.'),
      soon('/from-aura/objects', 'Objects', 'Things for the hand, cut from what the land already grows.'),
      soon('/from-aura/craft', 'Craft', 'Six studios, and the disciplines they keep in use.'),
      soon('/from-aura/fashion', 'Fashion', 'Cloth and wear, made slowly and in small numbers.'),
      soon('/from-aura/stationery', 'Stationery', 'Paper, ink and the things a residency runs on.'),
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
      soon('/from-aura/funding', 'Funding Partnerships', 'Capital for land meant to be worth more in a hundred years than it is now.'),
    ],
  },
]

