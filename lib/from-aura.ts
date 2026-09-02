/* From Aura — what leaves the estate, in three directions.
 *
 * Not a catalogue of crops. The land, the atelier and the trade desk are
 * three different relationships with three different people on the other
 * end: someone buying a kilo, someone buying a made object, and someone
 * buying a container or funding a block. Sorting by crop hid that; these
 * three groups are the story.
 *
 * Nothing here goes into a basket. Every line is arranged with the
 * estate directly,
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
const COPY: Record<string, { title: string; description: string; img?: string }> = {
  '/from-aura/areca': { title: 'Areca nut', description: 'The mid-canopy palm the pepper climbs, and the nut it carries.', img: '/from-aura/areca-nut/areca-nut.webp' },
  '/from-aura/areca-27-28': { title: 'Areca 27/28', description: 'The 27/28 crop, reserved before it is off the palm.', img: '/from-aura/areca-nut/prebook.webp' },
  '/from-aura/art': { title: 'Art', description: 'Work made on the estate, and work made about it.', img: '/from-aura/objects/art-1.webp' },
  '/from-aura/avocado': { title: 'Avocado', description: 'From the trees at the margins of the areca, in the few weeks they give it.', img: '/from-aura/farm-goods/avocados.webp' },
  '/from-aura/cardamom': { title: 'Cardamom', description: 'The fourth layer, grown in the shade the coffee is already taking.', img: '/from-aura/farm-goods/cardamom.webp' },
  '/from-aura/coffee': { title: 'Coffee', description: 'One harvest, split by block and by ferment, each lot carrying the wet mill file that made it.' },
  '/from-aura/from-the-farm': { title: 'From the Farm', description: 'Tea, pepper, areca and what the seasons give besides — grown under the same canopy as the coffee.' },
  '/from-aura/coffee-25-26': { title: '2025–26 Lots', description: 'Nine lots from one harvest, each with its own wet mill file.', img: '/from-aura/coffee/nine-lots.webp' },
  '/from-aura/coffee-26-27': { title: 'Pre-book 2026–27', description: 'Reserved before the cherry is on the tree.', img: '/from-aura/coffee/prebook.webp' },
  '/from-aura/coffee-blocks-and-zones': { title: 'Book Block & Zone', description: 'By block and by zone, sold against the canopy reading that shaped it.', img: '/from-aura/coffee/blocks-and-zones.webp' },
  '/from-aura/coffee-experimental': { title: 'No.1 Experimental Coffee in India', description: 'The ferments the estate pushes furthest, and the file behind each one.', img: '/from-aura/coffee/coffee.webp' },
  '/from-aura/collaborations': { title: 'Institutional Collaborations', description: 'Research on a working estate — monitoring, trials, and access to the record.' },
  '/from-aura/cow-pat-pit': { title: 'Cow Pat Pit', description: 'Ninety days in a numbered pit, hand-turned, and lab-tested before it leaves.' },
  '/from-aura/craft': { title: 'Craft', description: 'Six studios, and the disciplines they keep in use.', img: '/from-aura/objects/craft-1.webp' },
  '/from-aura/editions': { title: 'Limited Editions', description: 'Made once, numbered, and not made again.', img: '/from-aura/objects/limited.webp' },
  '/from-aura/experiences': { title: 'Experiences', description: 'Days on the estate — the working ones, the harvest, and the festival.', img: '/from-aura/experiences/experiences.webp' },
  '/from-aura/farm-tours': { title: 'Farm Tours', description: 'The estate mid-morning, with whatever the day was already doing.', img: '/from-aura/experiences/farm-tour.webp' },
  '/from-aura/fashion': { title: 'Fashion', description: 'Cloth and wear from the studios, in runs the material sets.', img: '/from-aura/objects/fashion.webp' },
  '/from-aura/funding': { title: 'Funding Partnerships', description: 'Capital for land meant to be worth more in a hundred years than it is now.' },
  '/from-aura/harvest-tours': { title: 'Harvest Tours', description: 'Picking, pulping and the wet mill, in the weeks it all happens at once.', img: '/from-aura/experiences/harvest-tour.webp' },
  '/from-aura/honey': { title: 'Honey', description: 'From colonies recovering on ground that carries no pesticide.', img: '/from-aura/farm-goods/honey.webp' },
  '/from-aura/jeevamrit': { title: 'Jeevamrit', description: 'Brewed from the herd, tested before and after, to volume against the calendar.' },
  '/from-aura/objects': { title: 'Objects & Editions', description: 'Made in the studios on the estate, in runs as long as the material allows.', img: '/from-aura/objects/objects.webp' },
  '/from-aura/pepper': { title: 'Pepper', description: 'Malabar, black and white, off the vines that climb the shade trees.', img: '/from-aura/pepper/pepper.webp' },
  '/from-aura/pepper-25-26': { title: 'Pepper 25/26', description: 'The season just cured — black and white, sorted and weighed off the same vines.', img: '/from-aura/pepper/black-and-white.webp' },
  '/from-aura/pepper-26-27': { title: 'Pepper 26/27', description: 'Reserved by the block, off the vines that climb the areca in it.', img: '/from-aura/pepper/blocks-and-zones.webp' },
  '/from-aura/residencies': { title: 'Artist residencies', description: 'Invited, embedded, and run on the estate’s clock.', img: '/from-aura/objects/craft.webp' },
  '/from-aura/soapnut': { title: 'Soapnut', description: 'The nut the estate washes with, gathered from its own trees.', img: '/from-aura/farm-goods/soapnut.webp' },
  '/from-aura/stationery': { title: 'Stationery', description: 'Paper, ink and the things a residency runs on.', img: '/from-aura/objects/stationery.webp' },
  '/from-aura/tea': { title: 'Tea', description: 'Thirty-two acres in organic transition, targeting 2027.', img: '/from-aura/tea/tea.webp' },
  '/from-aura/tea-27-28': { title: 'Tea 27/28', description: 'The first season after transition completes. Reserved in advance.', img: '/from-aura/tea/prebook.webp' },
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
        /* Every one of these pages exists and renders. They were carried
           as 'soon', which makes the lane card a span rather than a link
           — so a reader could see the whole shop and click none of it.
           What is unreleased is the thing, not the page about it. */
        status: 'live',
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
