export type Frame = {
  /** Still, or the poster when `video` is set. */
  src: string
  /** Optional MP4. `src` is its fallback — shown before it can play, on
   *  reduced motion, and if it never loads at all. */
  video?: string
  /** Describes the frame for somebody who cannot see it. */
  alt?: string
  /** How much black to lay over this frame, 0–0.75.
   *
   *  Solved per picture rather than set once for all of them. A single
   *  scrim cannot serve this set: the photographs run from a mean
   *  luminance of 31 to 162, and one multiplier preserves that ratio, so
   *  whatever value suits the cupping table turns the soil profile into a
   *  black screen with words on it.
   *
   *  Each number brings that frame's brightest 5% down to the grey where
   *  white type reads at contrast 5.0 — AA is 4.5, so there is margin —
   *  and no further. Frames already darker than that get nothing. */
  dim?: number
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
  { src: `${B}/overview/aura-regenerative-coffee.webp`, alt: 'A hundred and fifty acres at 3,600 ft, read as one system', dim: 0.43 },
  { src: `${B}/overview/aura-estate-dawn.webp`, alt: 'The estate before the work starts', dim: 0.42 },
  { src: `${B}/overview/aura-canopy-lookup.webp`, video: `${B}/overview/aura-canopy-lookup.mp4`, alt: 'Four storeys of shade, from the ground looking up', dim: 0.0 },
  { src: `${B}/overview/aura-soil.webp`, alt: 'Red laterite — where the coffee actually begins', dim: 0.45 },
  { src: `${B}/overview/aura-microbe.webp`, alt: 'The part of the farm nobody can see, counted anyway', dim: 0.45 },
  { src: `${B}/overview/aura-hydrology.webp`, video: `${B}/overview/aura-hydrology.mp4`, alt: 'Not how much rain falls, but how much of it the ground keeps', dim: 0.16 },
  { src: `${B}/overview/aura-biodiversity.webp`, alt: 'A bee working a flower — what lives in the four storeys', dim: 0.51 },
  { src: `${B}/overview/aura-horn-manure.webp`, alt: 'BD 500, packed into a horn and buried', dim: 0.26 },
  { src: `${B}/overview/aura-vedic-farming.webp`, alt: 'The Indian preparations, kept for the same reason as the European ones', dim: 0.54 },
  { src: `${B}/overview/aura-sensor-field.webp`, alt: 'A sensor left in a block through a monsoon', dim: 0.47 },
]

export const BETTER_GROUND: Frame[] = [
  { src: `${B}/better-ground/aura-closed-loop-01.webp`, alt: 'Nothing comes in, nothing leaves', dim: 0.45 },
  { src: `${B}/better-ground/aura-closed-loop-02.webp`, video: `${B}/better-ground/aura-closed-loop-02.mp4`, alt: 'The loop, running', dim: 0.09 },
  { src: `${B}/better-ground/aura-four-legged-farmers.webp`, alt: 'The estate’s best farmers have four legs', dim: 0.48 },
  { src: `${B}/better-ground/aura-herd-leaving.webp`, alt: 'The herd going out at dawn', dim: 0.49 },
  { src: `${B}/better-ground/aura-dung-dawn.webp`, alt: 'The morning’s dung — the estate’s most valuable raw material', dim: 0.37 },
  { src: `${B}/better-ground/aura-pits-numbered.webp`, alt: 'Fourteen numbered pits, hand-turned, ninety days to mature', dim: 0.51 },
  { src: `${B}/better-ground/aura-jeevamrit-stir.webp`, alt: 'Stirred forty-five minutes a day, vortex and reverse', dim: 0.55 },
  { src: `${B}/better-ground/aura-soil-profile.webp`, alt: 'A metre down, where the argument is settled', dim: 0.0 },
  { src: `${B}/better-ground/aura-canopy-noon.webp`, alt: 'The canopy at noon, which is when the light is read', dim: 0.44 },
  { src: `${B}/better-ground/aura-lux-meter.webp`, alt: 'Fifty light readings an acre, in lux, before anybody cuts', dim: 0.0 },
  { src: `${B}/better-ground/aura-cut.webp`, alt: 'Every cut sealed with cow pat preparation and turmeric', dim: 0.56 },
]

export const FLAVOURS: Frame[] = [
  { src: `${B}/flavours/aura-cherry-morning.webp`, alt: 'Picked ripe, and only ripe', dim: 0.43 },
  { src: `${B}/flavours/aura-robusta-cherry.webp`, alt: 'Robusta, off the same ground', dim: 0.39 },
  { src: `${B}/flavours/aura-tagged-tree.webp`, alt: 'Tagged at the tree, so the lot knows where it came from', dim: 0.5 },
  { src: `${B}/flavours/aura-fermentation-flow.webp`, video: `${B}/flavours/aura-fermentation-flow.mp4`, alt: 'Foam lifting and collapsing on a cherry ferment', dim: 0.06 },
  { src: `${B}/flavours/aura-testing.webp`, alt: 'pH every fifteen minutes — the number that ends the tank', dim: 0.45 },
  { src: `${B}/flavours/aura-night.webp`, alt: 'Somebody is awake for it', dim: 0.16 },
  { src: `${B}/flavours/aura-arabica-trays.webp`, alt: 'Twenty-five days minimum on the beds', dim: 0.41 },
  { src: `${B}/flavours/aura-grader-table.webp`, alt: 'Graded by hand, before anyone tastes it', dim: 0.12 },
  { src: `${B}/flavours/aura-award-cup.webp`, alt: 'Scored by people with no stake in the result', dim: 0.32 },
]

export const TRANSPARENCY: Frame[] = [
  { src: `${B}/transparency/aura-signing-field.webp`, alt: 'Every event signed by the person who was standing there', dim: 0.46 },
  { src: `${B}/transparency/aura-hands-sensor.webp`, alt: 'Sensors and hands, one record', dim: 0.52 },
  { src: `${B}/transparency/aura-clocks.webp`, alt: 'Nine streams, each on its own clock', dim: 0.0 },
  { src: `${B}/transparency/aura-batch-bench.webp`, alt: 'Every batch counted before it goes anywhere near the soil', dim: 0.34 },
  { src: `${B}/transparency/aura-untested-soil-coffee.webp`, alt: 'No untested material touches the ground', dim: 0.29 },
  { src: `${B}/transparency/aura-soil-chemistry.webp`, alt: 'The estate lab, mid-assay', dim: 0.44 },
  { src: `${B}/transparency/aura-block-retest.webp`, alt: 'The same block, re-read ninety days later', dim: 0.47 },
  { src: `${B}/transparency/aura-cupping.webp`, alt: 'Where the record ends: a cup', dim: 0.54 },
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
     for them. Ten beats against ten photographs, one each — the loop's
     own opening line moved into the manifesto lede so that nothing has
     to appear twice. */
  hub: [0, 7, 9, 2, 4, 5, 6, 1, 8, 3],

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
