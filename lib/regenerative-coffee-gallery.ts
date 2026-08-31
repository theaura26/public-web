export type Frame = {
  /** Still, or the poster when `video` is set. */
  src: string
  /** Optional MP4. `src` is its fallback — shown before it can play, on
   *  reduced motion, and if it never loads at all. */
  video?: string
  /** Describes the frame for somebody who cannot see it. */
  alt?: string
}

/* The pictures for the four Regenerative Coffee chapters.
 *
 * One band per chapter, in the order the pictures were delivered. Where
 * a frame has an MP4, the still of the same name is its poster — shown
 * before the video can play, on reduced motion, and if it never loads.
 *
 * No visible captions: the pictures carry the chapter and the prose
 * under them says the rest. The text below is `alt`, which is not the
 * same job — it describes the frame for somebody who cannot see it, and
 * it is the only reason these lines still exist.
 */

const B = '/regenerative-coffee'

export const OVERVIEW: Frame[] = [
  { src: `${B}/overview/aura-regenerative-coffee.webp`, alt: 'A hundred and fifty acres at 3,600 ft, read as one system' },
  { src: `${B}/overview/aura-estate-dawn.webp`, alt: 'The estate before the work starts' },
  { src: `${B}/overview/aura-canopy-lookup.webp`, video: `${B}/overview/aura-canopy-lookup.mp4`, alt: 'Four storeys of shade, from the ground looking up' },
  { src: `${B}/overview/aura-soil.webp`, alt: 'Red laterite — where the coffee actually begins' },
  { src: `${B}/overview/aura-microbe.webp`, alt: 'The part of the farm nobody can see, counted anyway' },
  { src: `${B}/overview/aura-hydrology.webp`, video: `${B}/overview/aura-hydrology.mp4`, alt: 'Not how much rain falls, but how much of it the ground keeps' },
  { src: `${B}/overview/aura-biodiversity.webp`, alt: 'What lives in the four storeys' },
  { src: `${B}/overview/aura-horn-manure.webp`, alt: 'BD 500, packed into a horn and buried' },
  { src: `${B}/overview/aura-vedic-farming.webp`, alt: 'The Indian preparations, kept for the same reason as the European ones' },
  { src: `${B}/overview/aura-sensor-field.webp`, alt: 'A sensor left in a block through a monsoon' },
]

export const BETTER_GROUND: Frame[] = [
  { src: `${B}/better-ground/aura-closed-loop-01.webp`, alt: 'Nothing comes in, nothing leaves' },
  { src: `${B}/better-ground/aura-closed-loop-02.webp`, video: `${B}/better-ground/aura-closed-loop-02.mp4`, alt: 'The loop, running' },
  { src: `${B}/better-ground/aura-four-legged-farmers.webp`, alt: 'The estate’s best farmers have four legs' },
  { src: `${B}/better-ground/aura-herd-leaving.webp`, alt: 'The herd going out at dawn' },
  { src: `${B}/better-ground/aura-dung-dawn.webp`, alt: 'The morning’s dung — the estate’s most valuable raw material' },
  { src: `${B}/better-ground/aura-pits-numbered.webp`, alt: 'Fourteen numbered pits, hand-turned, ninety days to mature' },
  { src: `${B}/better-ground/aura-jeevamrit-stir.webp`, alt: 'Stirred forty-five minutes a day, vortex and reverse' },
  { src: `${B}/better-ground/aura-soil-profile.webp`, alt: 'A metre down, where the argument is settled' },
  { src: `${B}/better-ground/aura-canopy-noon.webp`, alt: 'The canopy at noon, which is when the light is read' },
  { src: `${B}/better-ground/aura-lux-meter.webp`, alt: 'Fifty light readings an acre, in lux, before anybody cuts' },
  { src: `${B}/better-ground/aura-cut.webp`, alt: 'Every cut sealed with cow pat preparation and turmeric' },
]

export const FLAVOURS: Frame[] = [
  { src: `${B}/flavours/aura-cherry-morning.webp`, alt: 'Picked ripe, and only ripe' },
  { src: `${B}/flavours/aura-robusta-cherry.webp`, alt: 'Robusta, off the same ground' },
  { src: `${B}/flavours/aura-tagged-tree.webp`, alt: 'Tagged at the tree, so the lot knows where it came from' },
  { src: `${B}/flavours/aura-fermentation-flow.webp`, video: `${B}/flavours/aura-fermentation-flow.mp4`, alt: 'Foam lifting and collapsing on a cherry ferment' },
  { src: `${B}/flavours/aura-testing.webp`, alt: 'pH every fifteen minutes — the number that ends the tank' },
  { src: `${B}/flavours/aura-night.webp`, alt: 'Somebody is awake for it' },
  { src: `${B}/flavours/aura-arabica-trays.webp`, alt: 'Twenty-five days minimum on the beds' },
  { src: `${B}/flavours/aura-grader-table.webp`, alt: 'Graded by hand, before anyone tastes it' },
  { src: `${B}/flavours/aura-award-cup.webp`, alt: 'Scored by people with no stake in the result' },
]

export const TRANSPARENCY: Frame[] = [
  { src: `${B}/transparency/aura-signing-field.webp`, alt: 'Every event signed by the person who was standing there' },
  { src: `${B}/transparency/aura-hands-sensor.webp`, alt: 'Sensors and hands, one record' },
  { src: `${B}/transparency/aura-clocks.webp`, alt: 'Nine streams, each on its own clock' },
  { src: `${B}/transparency/aura-batch-bench.webp`, alt: 'Every batch counted before it goes anywhere near the soil' },
  { src: `${B}/transparency/aura-untested-soil-coffee.webp`, alt: 'No untested material touches the ground' },
  { src: `${B}/transparency/aura-soil-chemistry.webp`, alt: 'The estate lab, mid-assay' },
  { src: `${B}/transparency/aura-block-retest.webp`, alt: 'The same block, re-read ninety days later' },
  { src: `${B}/transparency/aura-cupping.webp`, alt: 'Where the record ends: a cup' },
]

/* Which frame stands behind which scene.
 *
 * One entry per scene, in document order, holding the index of the frame
 * that belongs to it. Spreading the pictures evenly got the order right
 * and the meaning wrong — "Someone is awake for it" was given a tagged
 * tree, and the cupping table got a fermenting tank. These are paired by
 * hand against what each scene actually says.
 *
 * A repeated index is deliberate: consecutive scenes on one subject hold
 * the same picture rather than cutting to another and back. */
export const STEPS: Record<string, number[]> = {
  /* the hub: the scenes are the disciplines, and the frames are named
     for them */
  hub: [0, 1, 7, 9, 2, 4, 5, 6, 2, 8, 3],

  /* better ground: the canopy, the herd, the dung, the brews, the pits,
     the light meter, the cut, and the loop closing. One frame per beat —
     the chapters used to run to fourteen scenes, most of them a sentence
     long, and the pairing repeated frames to cover them. */
  biodynamic: [0, 8, 2, 4, 6, 5, 9, 10, 1],

  /* flavours: the cherry, the tagged tree, the ferment, the night, the
     grading table, the award, Robusta, the drying beds, the lab */
  flavour: [0, 2, 3, 5, 7, 8, 1, 6, 4],

  /* transparency: hands on a sensor, the signature, the clocks, the
     bench, the block re-read, the assay, the cup */
  transparency: [1, 0, 2, 3, 6, 4, 7],
}
