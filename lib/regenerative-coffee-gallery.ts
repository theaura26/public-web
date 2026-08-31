import type { Frame } from '@/components/article/Gallery'

/* The pictures for the four Regenerative Coffee chapters.
 *
 * One band per chapter, in the order the pictures were delivered. Where
 * a frame has an MP4, the still of the same name is its poster — shown
 * before the video can play, on reduced motion, and if it never loads.
 *
 * Captions are the caption, not an art-direction brief: they say what is
 * in the frame, because a reader sees this one and not the shot list.
 */

const B = '/regenerative-coffee'

export const OVERVIEW: Frame[] = [
  { src: `${B}/overview/aura-regenerative-coffee.webp`, caption: 'A hundred and fifty acres at 3,600 ft, read as one system' },
  { src: `${B}/overview/aura-estate-dawn.webp`, caption: 'The estate before the work starts' },
  { src: `${B}/overview/aura-canopy-lookup.webp`, video: `${B}/overview/aura-canopy-lookup.mp4`, caption: 'Four storeys of shade, from the ground looking up' },
  { src: `${B}/overview/aura-soil.webp`, caption: 'Red laterite — where the coffee actually begins' },
  { src: `${B}/overview/aura-microbe.webp`, caption: 'The part of the farm nobody can see, counted anyway' },
  { src: `${B}/overview/aura-hydrology.webp`, video: `${B}/overview/aura-hydrology.mp4`, caption: 'Not how much rain falls, but how much of it the ground keeps' },
  { src: `${B}/overview/aura-biodiversity.webp`, caption: 'What lives in the four storeys' },
  { src: `${B}/overview/aura-horn-manure.webp`, caption: 'BD 500, packed into a horn and buried' },
  { src: `${B}/overview/aura-vedic-farming.webp`, caption: 'The Indian preparations, kept for the same reason as the European ones' },
  { src: `${B}/overview/aura-sensor-field.webp`, caption: 'A sensor left in a block through a monsoon' },
]

export const BETTER_GROUND: Frame[] = [
  { src: `${B}/better-ground/aura-closed-loop-01.webp`, caption: 'Nothing comes in, nothing leaves' },
  { src: `${B}/better-ground/aura-closed-loop-02.webp`, video: `${B}/better-ground/aura-closed-loop-02.mp4`, caption: 'The loop, running' },
  { src: `${B}/better-ground/aura-four-legged-farmers.webp`, caption: 'The estate’s best farmers have four legs' },
  { src: `${B}/better-ground/aura-herd-leaving.webp`, caption: 'The herd going out at dawn' },
  { src: `${B}/better-ground/aura-dung-dawn.webp`, caption: 'The morning’s dung — the estate’s most valuable raw material' },
  { src: `${B}/better-ground/aura-pits-numbered.webp`, caption: 'Fourteen numbered pits, hand-turned, ninety days to mature' },
  { src: `${B}/better-ground/aura-jeevamrit-stir.webp`, caption: 'Stirred forty-five minutes a day, vortex and reverse' },
  { src: `${B}/better-ground/aura-soil-profile.webp`, caption: 'A metre down, where the argument is settled' },
  { src: `${B}/better-ground/aura-canopy-noon.webp`, caption: 'The canopy at noon, which is when the light is read' },
  { src: `${B}/better-ground/aura-lux-meter.webp`, caption: 'Fifty light readings an acre, in lux, before anybody cuts' },
  { src: `${B}/better-ground/aura-cut.webp`, caption: 'Every cut sealed with cow pat preparation and turmeric' },
]

export const FLAVOURS: Frame[] = [
  { src: `${B}/flavours/aura-cherry-morning.webp`, caption: 'Picked ripe, and only ripe' },
  { src: `${B}/flavours/aura-robusta-cherry.webp`, caption: 'Robusta, off the same ground' },
  { src: `${B}/flavours/aura-tagged-tree.webp`, caption: 'Tagged at the tree, so the lot knows where it came from' },
  { src: `${B}/flavours/aura-fermentation-flow.webp`, video: `${B}/flavours/aura-fermentation-flow.mp4`, caption: 'Foam lifting and collapsing on a cherry ferment' },
  { src: `${B}/flavours/aura-testing.webp`, caption: 'pH every fifteen minutes — the number that ends the tank' },
  { src: `${B}/flavours/aura-night.webp`, caption: 'Somebody is awake for it' },
  { src: `${B}/flavours/aura-arabica-trays.webp`, caption: 'Twenty-five days minimum on the beds' },
  { src: `${B}/flavours/aura-grader-table.webp`, caption: 'Graded by hand, before anyone tastes it' },
  { src: `${B}/flavours/aura-award-cup.webp`, caption: 'Scored by people with no stake in the result' },
]

export const TRANSPARENCY: Frame[] = [
  { src: `${B}/transparency/aura-signing-field.webp`, caption: 'Every event signed by the person who was standing there' },
  { src: `${B}/transparency/aura-hands-sensor.webp`, caption: 'Sensors and hands, one record' },
  { src: `${B}/transparency/aura-clocks.webp`, caption: 'Nine streams, each on its own clock' },
  { src: `${B}/transparency/aura-batch-bench.webp`, caption: 'Every batch counted before it goes anywhere near the soil' },
  { src: `${B}/transparency/aura-untested-soil-coffee.webp`, caption: 'No untested material touches the ground' },
  { src: `${B}/transparency/aura-soil-chemistry.webp`, caption: 'The estate lab, mid-assay' },
  { src: `${B}/transparency/aura-block-retest.webp`, caption: 'The same block, re-read ninety days later' },
  { src: `${B}/transparency/aura-cupping.webp`, caption: 'Where the record ends: a cup' },
]
