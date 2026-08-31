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
import { SECTIONS } from './site-nav'

export type Lane = {
  id: string
  label: string
  lede: string
  items: NoteEntry[]
}

/* One description per product, and one picture where there is one.
   Everything under public/from-aura is 864×1080 — the 4:5 the lane cards
   are cut to — so nothing is cropped. */
const COPY: Record<string, { title: string; description: string; img?: string; imgHover?: string }> = {
  '/from-aura/areca': { title: 'Areca nut', description: 'From the tallest storey of the canopy.', img: '/from-aura/areca-nut/areca-nut.webp' },
  '/from-aura/areca-27-28': { title: 'Areca 27/28', description: 'From the tallest storey of the canopy. Pre-book.', img: '/from-aura/areca-nut/prebook.webp' },
  '/from-aura/art': { title: 'Art', description: 'Work made on the estate, and work made about it.', img: '/from-aura/objects/art.webp', imgHover: '/from-aura/objects/art-1.webp' },
  '/from-aura/avocado': { title: 'Avocado', description: 'Seasonal, and only when the season gives it.', img: '/from-aura/farm-goods/avocados.webp' },
  '/from-aura/cardamom': { title: 'Cardamom', description: 'Grown in the understorey, under everything else.', img: '/from-aura/farm-goods/cardamom.webp' },
  '/from-aura/coffee-25-26': { title: '2025–26 Lots', description: 'Nine lots from one harvest, each with its own wet mill file.', img: '/from-aura/coffee/nine-lots.webp' },
  '/from-aura/coffee-26-27': { title: 'Pre-book 2026–27', description: 'Reserved before the cherry is on the tree.', img: '/from-aura/coffee/prebook.webp' },
  '/from-aura/coffee-blocks-and-zones': { title: 'Book Block & Zone', description: 'By block and by zone, sold against the canopy reading that shaped it.', img: '/from-aura/coffee/blocks-and-zones.webp' },
  '/from-aura/coffee-experimental': { title: 'No.1 Experimental Coffee in India', description: 'The lot the estate is proudest of, and the file behind it.', img: '/from-aura/coffee/coffee.webp' },
  '/from-aura/collaborations': { title: 'Institutional Collaborations', description: 'Research on a working estate — monitoring, trials, and access to the record.' },
  '/from-aura/cow-pat-pit': { title: 'Cow Pat Pit', description: 'Ninety days in a numbered pit, hand-turned, and lab-tested before it leaves.' },
  '/from-aura/craft': { title: 'Craft', description: 'Six studios, and the disciplines they keep in use.', img: '/from-aura/objects/craft.webp', imgHover: '/from-aura/objects/craft-1.webp' },
  '/from-aura/editions': { title: 'Limited Editions', description: 'Made once, numbered, and not made again.', img: '/from-aura/objects/limited.webp', imgHover: '/from-aura/objects/limited-1.webp' },
  '/from-aura/experiences': { title: 'The Festival', description: 'Three days, twenty places, and a lot that ships under your own name.', img: '/from-aura/experiences/experiences.webp' },
  '/from-aura/farm-tours': { title: 'Farm Tours', description: 'The estate mid-morning, with whatever the day was already doing.', img: '/from-aura/experiences/farm-tour.webp' },
  '/from-aura/fashion': { title: 'Fashion', description: 'Cloth and wear, made slowly and in small numbers.', img: '/from-aura/objects/fashion.webp', imgHover: '/from-aura/objects/fashion-1.webp' },
  '/from-aura/funding': { title: 'Funding Partnerships', description: 'Capital for land meant to be worth more in a hundred years than it is now.' },
  '/from-aura/harvest-tours': { title: 'Harvest Tours', description: 'Picking, pulping and the wet mill, in the weeks it all happens at once.', img: '/from-aura/experiences/harvest-tour.webp', imgHover: '/from-aura/experiences/harvest-tour-1.webp' },
  '/from-aura/honey': { title: 'Honey', description: 'From colonies recovering on ground that carries no pesticide.', img: '/from-aura/farm-goods/honey.webp' },
  '/from-aura/jeevamrit': { title: 'Jeevamrit', description: 'Brewed from the herd, tested before and after, to volume against the calendar.' },
  '/from-aura/objects': { title: 'Objects', description: 'Things for the hand, cut from what the land already grows.', img: '/from-aura/objects/objects.webp' },
  '/from-aura/pepper': { title: 'Pepper', description: 'Malabar, black and white, off the vines that climb the shade trees.', img: '/from-aura/pepper/pepper.webp' },
  '/from-aura/pepper-25-26': { title: 'Pepper 25/26', description: 'Malabar, black and white, off the vines that climb the shade trees.', img: '/from-aura/pepper/black-and-white.webp' },
  '/from-aura/pepper-26-27': { title: 'Pepper 26/27', description: 'By block and by zone.', img: '/from-aura/pepper/blocks-and-zones.webp' },
  '/from-aura/residencies': { title: 'Artist residencies', description: 'Invited, embedded, and run on the estate’s clock.', img: '/from-aura/experiences/farm-tour-1.webp' },
  '/from-aura/soapnut': { title: 'Soapnut', description: 'What the estate washes with, and what it can spare.', img: '/from-aura/farm-goods/soapnut.webp' },
  '/from-aura/stationery': { title: 'Stationery', description: 'Paper, ink and the things a residency runs on.', img: '/from-aura/objects/stationery.webp', imgHover: '/from-aura/objects/stationery-1.webp' },
  '/from-aura/tea-27-28': { title: 'Tea 27/28', description: 'Thirty-two acres, in organic transition targeting 2027. Pre-book.', img: '/from-aura/tea/prebook.webp' },
  '/from-aura/trade': { title: 'Trade', description: 'For roasters and buyers who want the block as well as the bag.' },
}

/* The lanes are the menu.
 *
 * This page used to group by who was buying — From the Land, From the
 * Atelier, For Our Partners — while the menu grouped by product. Two
 * shapes for one shop, and a reader crossing between them had to work
 * out that they were the same things twice. The lanes are generated
 * from lib/site-nav.ts now, so the page and the menu cannot disagree.
 *
 * Only products with a photograph are listed. A lane of grey plates is
 * a list of things that do not exist yet, and the index is where a
 * reader comes to see what there is. Everything unphotographed still
 * has its page, and the menu still carries it. */
export const FROM_AURA: Lane[] = (SECTIONS.find((s) => s.id === 'shop')?.items ?? [])
  .filter((parent) => parent.children?.length)
  .map((parent): Lane => {
    const items: NoteEntry[] = []
    for (const child of parent.children ?? []) {
      const c = COPY[child.href]
      if (!c?.img) continue
      items.push({
        href: child.href,
        title: c.title || child.label,
        description: c.description,
        img: c.img,
        imgHover: c.imgHover,
        status: 'soon',
      })
    }
    return {
      id: parent.href.replace('/from-aura/', ''),
      label: parent.label,
      lede: COPY[parent.href]?.description ?? '',
      items,
    }
  })
  .filter((lane) => lane.items.length > 0)
