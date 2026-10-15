/* ═══════════════════════════════════════════════════════════════════
   A Season of RIPE — the page's words and its ten days of pictures.

   Transcribed from the prepared export (RIPE pages, 8 October 2026) and
   revised since with Rhea: the parts' words, the handwritten notes and
   the drawings under the names. The shot dimensions are the file's own,
   kept so each frame reserves its space before the picture loads.
═══════════════════════════════════════════════════════════════════ */


/* ── The page's own words ──────────────────────────────────────────── */

/** The opener: coral mark, the season's line, and the way back to RIPE. */
export const SEASON_HERO = {
  mark: '/RIPE/10-days/aura-ripe-coral.svg',
  tagline: ['A season', 'to remember.'],
  /** Hovering the mark or the line brings RIPE's own green through. */
  link: {
    href: '/ripe',
    hover: '#23FF88',
    markHover: '/RIPE/aura-ripe.svg',
    taglineHover: ['Right Time', 'made visible.'],
    label: 'A season to remember — back to RIPE',
    from: 'right' as const,
  },
  /* The season's banner: seven stills from the ten days, opening on the
     stone sign, each fading in over the last. From the 3840 × 2160 frames
     in ~/Desktop/Rhea/Aura/Aura RIPE/RIPE AFTER/New video banner/, as
     WebP at 1600 and 2560 wide, and a 9:16 crop for phones (the feet
     cut a little left of centre, on the feet). */
  slides: {
    label: 'Seven moments from the season at Aura: the stone sign, an old tree, the studio wall, the compost beds, feet treading the compost, the moon through the palms and everyone together at the end',
    images: [
      { src: '/RIPE/10-days/banner/slides/01-sign-1600.webp', srcSet: '/RIPE/10-days/banner/slides/01-sign-1600.webp 1600w, /RIPE/10-days/banner/slides/01-sign-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/01-sign-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/02-tree-1600.webp', srcSet: '/RIPE/10-days/banner/slides/02-tree-1600.webp 1600w, /RIPE/10-days/banner/slides/02-tree-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/02-tree-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/03-studio-1600.webp', srcSet: '/RIPE/10-days/banner/slides/03-studio-1600.webp 1600w, /RIPE/10-days/banner/slides/03-studio-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/03-studio-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/04-beds-1600.webp', srcSet: '/RIPE/10-days/banner/slides/04-beds-1600.webp 1600w, /RIPE/10-days/banner/slides/04-beds-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/04-beds-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/05-feet-1600.webp', srcSet: '/RIPE/10-days/banner/slides/05-feet-1600.webp 1600w, /RIPE/10-days/banner/slides/05-feet-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/05-feet-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/06-moon-1600.webp', srcSet: '/RIPE/10-days/banner/slides/06-moon-1600.webp 1600w, /RIPE/10-days/banner/slides/06-moon-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/06-moon-phone.webp' },
      { src: '/RIPE/10-days/banner/slides/07-together-1600.webp', srcSet: '/RIPE/10-days/banner/slides/07-together-1600.webp 1600w, /RIPE/10-days/banner/slides/07-together-2560.webp 2560w', phone: '/RIPE/10-days/banner/slides/07-together-phone.webp' },
    ],
    every: 2000,
    fade: 800,
  },
} as const

/** The statement under the opener. */
export const SEASON_INTRO = [
  'Some places you visit.',
  'Some stay with you.',
  'The soil under your nails.',
  'The sound of cowbells.',
  'The quiet between the trees.',
]

/** Under the statement: who came, as RIPE's own intro names them. */
export const SEASON_INTRO_NOTE = [
  'Good company, shared curiosity, and a few days at Aura.\n',
  'Friends of Aura, Boojee, Besttt and Studio 6158 came together for RIPE 26.',
]

/** The page's picture wherever it is shared or listed: the roots of the
    old tree with the pink RIPE wordmark, 1200 × 630. The menu card, the
    link preview and the sitemap all use it. */
export const SEASON_SHARE_IMAGE = '/RIPE/10-days/ripe-10-days-og.jpg'

/** The photograph the closing lines sit over. 1064 wide is the largest
    copy there is. */
export const SEASON_CODA_PHOTO = {
  src: '/RIPE/10-days/sections/coda-goodbyes.webp',
  w: 1064,
  h: 705,
  alt: 'Everyone together in the studio for a last photograph, beneath the Aura sign',
} as const

/** After the last day. */
export const SEASON_CODA = [
  'At first, Aura was unfamiliar.',
  'Before we knew it, the paths felt like our own.',
  'There were stories behind the faces. Places to sit beneath the trees. Cows, insects and plants to notice. Time had been shared. Something had been made.',
  'RIPE has come to an end, but something has just begun.',
  'Aura had slowly become more than a place to visit.',
  'It had become a place to belong.',
]

/** The banner that closes this page, pointing back at RIPE. */
export const SEASON_BANNER = {
  href: '/ripe',
  name: 'RIPE',
  mark: '/RIPE/aura-ripe.svg',
  line: 'Right time made visible.',
  action: 'Discover RIPE',
  accent: '#23FF88',
  image: '/RIPE/aura-ripe-banner.jpg',
} as const

/** The banner that closes /ripe, pointing here. */
export const SEASON_BANNER_ON_RIPE = {
  href: '/ripe/after',
  name: 'A Season of RIPE',
  mark: '/RIPE/10-days/aura-ripe-coral.svg',
  line: 'A season to remember.',
  action: 'Discover A Season of RIPE',
  accent: '#FF60A5',
  image: '/RIPE/10-days/banner/ripe-tree-roots.webp',
} as const

/** RIPE's own hero gains the way through to this page. */
export const RIPE_HERO_LINK = {
  href: '/ripe/after',
  hover: '#FF60A5',
  markHover: '/RIPE/10-days/aura-ripe-coral.svg',
  taglineHover: ['A season', 'to remember.'],
  label: 'Right time made visible — open A Season of RIPE',
} as const

export type Shot = {
  name: string
  src: string
  w: number
  h: number
  alt: string
  /** A narrower copy for phones (1290 wide, enough for a 3× phone screen), served through srcset. */
  small?: string
  /** A film plays in place of the still once it can. */
  video?: string
  /** A closer crop than the frame's own: the picture enlarged by `scale`
      about the point `at` (a transform-origin), to cut away an edge. */
  zoom?: { scale: number; at: string }
  /** For a part's first picture: where across it (0 to 1) its subject
      stands, to centre on while it fills the screen. The middle if not
      given. */
  openAt?: number
  /** A handwritten line set on the picture itself. A '\n' starts a new
      line, written once the one before it is done; a '|' marks where a
      line too long for a phone breaks there (on a wide screen it stays
      one line). */
  note?: string
}

/** A drawing's own small movement, slight enough to be felt more than
    seen. Places are in per cent of the drawing, across then down. */
export type SketchMotion =
  /** Rain falling onto the drawing, landing at these points. */
  | { kind: 'rain'; drops: readonly (readonly [number, number])[] }
  /** The two halves either side of this line, across, tilting like wings. */
  | { kind: 'flap'; axis: number }
  /** One part moving about `origin`: cut from the drawing by the clip
      `part` (the rest by `rest`), or drawn on its own in `partSrc`. */
  | { kind: 'nod' | 'flicker' | 'wave'; origin: string; part?: string; rest?: string; partSrc?: string }

export type Day = {
  title: string
  day: string
  /** The part's name as drawn lettering, one image per line, every line
      traced at one height so the names share a size and a baseline. */
  art: { src: string; w: number; h: number }[]
  /** A small drawing that goes with the name: pink halftone, set under
      it on a wide screen and beside it on a phone. Decorative. `scale`
      sizes it against the umbrella's width (1); `phoneScale`, if given,
      does so on a phone instead. */
  sketch?: { src: string; w: number; h: number; tilt?: number; scale?: number; phoneScale?: number; motion?: SketchMotion }
  /** The line under the name, then the paragraph under that. */
  line: string
  text: string
  /** The part's pictures, in the order they come up: the Figma file's
      section frames (1920 × 1300), and two films. The first opens the
      part on the whole screen; the one with a note comes third. */
  shots: Shot[]
}

const T = '/RIPE/10-days/titles/'
/* The section frames, WebP at quality 80: 1920 wide, and 1290 for phones. */
const S = '/RIPE/10-days/sections/'
const H = 326

export const DAYS: Day[] = [
  {
    title: 'Stepping into Aura',
    day: 'Part 1',
    art: [
      { src: `${T}stepping.svg`, w: 846, h: H },
      { src: `${T}into-aura.svg`, w: 827, h: H },
    ],
    /* An umbrella, for the rain at breakfast: the Figma AI base in
       RIPE source/…/Figma export/sections/umbrella-base.jpg, stippled
       in the page's pink with RIPE source/stipple.mjs. */
    sketch: {
      src: `${S}umbrella-halftone.webp`, w: 680, h: 546, tilt: -14,
      /* Rain landing on the canopy, where it falls. */
      motion: { kind: 'rain', drops: [[20, 20], [31, 14], [43, 9], [56, 8], [68, 11], [80, 17]] },
    },
    line: 'The first glimpse of a place that would slowly become familiar.',
    text: 'Friends of Aura, alongside Boojee, Besttt and Studio 6158, came together in good company. For a few days, we stepped away from the familiar to slow down and discover what goes into making extraordinary coffee.',
    shots: [
      { name: 'stepping-into-aura-1', src: `${S}stepping-into-aura-1.webp`, small: `${S}stepping-into-aura-1-1290.webp`, w: 1920, h: 1300, alt: 'A rusted steel marker with the Aura mark and the words Attention, Unhurried, Rooted, Awake, on a ridge above the hills', openAt: 0.68 },
      { name: 'stepping-into-aura-2', src: `${S}stepping-into-aura-2.webp`, small: `${S}stepping-into-aura-2-1290.webp`, w: 1920, h: 1300, alt: 'Hands easing a stone Buddha into place at the foot of a tree' },
      { name: 'stepping-into-aura-4', src: `${S}stepping-into-aura-4.webp`, small: `${S}stepping-into-aura-4-1290.webp`, w: 1920, h: 1300, alt: 'Four friends with plates of breakfast, sheltering under an umbrella in the forest', note: 'The rain joined us for breakfast.' },
      { name: 'stepping-into-aura-3', src: `${S}stepping-into-aura-3.webp`, small: `${S}stepping-into-aura-3-1290.webp`, w: 1920, h: 1300, alt: 'Three grown-ups and two young children around the carved Aura stone among the trees' },
    ],
  },
  {
    title: 'A world revealed',
    day: 'Part 2',
    art: [
      { src: `${T}a-world.svg`, w: 726, h: H },
      { src: `${T}revealed.svg`, w: 714, h: H },
    ],
    /* A moth from the estate, wings open as photographed: lifted from
       RIPE source/…/Figma export/sections/moth-source.jpg with RIPE
       source/lift.swift (macOS Vision), then stippled in the page's pink
       with RIPE source/stipple.mjs (light, gamma 2, floor 0.1, top 0.75,
       2px dot). */
    sketch: { src: `${S}moth-open-halftone.webp`, w: 580, h: 294, scale: 0.85, motion: { kind: 'flap', axis: 55 } },
    line: 'The unfamiliar became a world of discovery.',
    text: 'Walking through the estate, we discovered how coffee grows alongside a web of life. From soil and shade to insects, bees and pollination, each species plays a part in the health of the plantation. Picking cherries, learning about ripeness and exploring biodiversity revealed how much more there is to coffee than the bean itself.',
    shots: [
      { name: 'a-world-revealed-1', src: `${S}a-world-revealed-1.webp`, small: `${S}a-world-revealed-1-1290.webp`, w: 1920, h: 1300, alt: 'A small green insect resting on an outstretched hand, an Aura T-shirt behind' },
      { name: 'a-world-revealed-2', src: `${S}a-world-revealed-2.webp`, small: `${S}a-world-revealed-2-1290.webp`, w: 1920, h: 1300, alt: 'A coffee branch hung with ripening cherries, most of them red' },
      /* The film from RIPE source/…/Figma export/sections/hammerhead-source.mov, re-encoded
         with scripts/ripe/encode-film.swift (1280 long edge, 1.2Mbps, no
         sound). */
      { name: 'hammerhead-flatworm', src: `${S}hammerhead-flatworm.jpg`, w: 1280, h: 720, alt: 'A bright orange hammerhead flatworm with a dark, half-moon head, gliding over bare brown earth', video: `${S}hammerhead-flatworm.mp4`, note: 'And the winner of Aura’s biodiversity hunt\nis the hammerhead flatworm' },
      { name: 'aura-pour-over', src: '/RIPE/10-days/sections/aura-pour-over.jpg', w: 1102, h: 720, alt: 'Hot water poured from a kettle into a paper dripper over a glass server', video: '/RIPE/10-days/sections/aura-pour-over.mp4', zoom: { scale: 1.14, at: '50% 15%' } },
    ],
  },
  {
    title: 'Making a mark',
    day: 'Part 3',
    art: [
      { src: `${T}making.svg`, w: 711, h: H },
      { src: `${T}a-mark.svg`, w: 586, h: H },
    ],
    /* The calf from the RIPE page (public/RIPE/aura-cow.png), its green
       dots turned the page's pink. */
    sketch: {
      src: `${S}calf-halftone.webp`, w: 421, h: 302, scale: 0.92,
      /* The head, from the neck — cut a little into the neck as well,
         over the body's own dots there, so no gap opens as it nods. */
      motion: {
        kind: 'nod', origin: '68% 30%',
        part: 'polygon(56% 0, 100% 0, 100% 50%, 84% 50%, 73% 46%, 66% 38%, 61% 27%, 57% 14%)',
        rest: 'polygon(0 0, 61% 0, 62% 12%, 66% 22%, 70% 32%, 76% 40%, 86% 44%, 100% 44%, 100% 100%, 0 100%)',
      },
    },
    line: 'Understanding began with getting our hands dirty.',
    text: 'From cow dung to compost, from compost to soil, and from soil to coffee, the connections became tangible. Through biodynamic preparations, we discovered how the smallest decisions could shape both the living estate and the coffee it produced.',
    shots: [
      { name: 'making-a-mark-1', src: `${S}making-a-mark-1.webp`, small: `${S}making-a-mark-1-1290.webp`, w: 1920, h: 1300, alt: 'A child scooping up compost with both hands' },
      { name: 'making-a-mark-3', src: `${S}making-a-mark-3.webp`, small: `${S}making-a-mark-3-1290.webp`, w: 1920, h: 1300, alt: 'Clay pots of biodynamic preparations, each one labelled, in the compartments of a wooden box' },
      { name: 'making-a-mark-2', src: `${S}making-a-mark-2.webp`, small: `${S}making-a-mark-2-1290.webp`, w: 1920, h: 1300, alt: 'Bare feet treading cow dung into the compost', note: 'Finding our footing | in the world of biodynamics.' },
      { name: 'making-a-mark-4', src: `${S}making-a-mark-4.webp`, small: `${S}making-a-mark-4-1290.webp`, w: 1920, h: 1300, alt: 'A man laughing out loud among the group' },
    ],
  },
  {
    title: 'Finding our rhythm',
    day: 'Part 4',
    art: [
      { src: `${T}finding.svg`, w: 714, h: H },
      { src: `${T}our-rhythm.svg`, w: 932, h: H },
    ],
    /* A lit pillar candle, for the long dinners: from RIPE source/…/
       Figma export/sections/candle-source-2.avif, lifted with RIPE
       source/lift.swift (macOS Vision) so the glow stays behind, then
       stippled in the page's pink with RIPE source/stipple.mjs (light,
       gamma 3.2, floor 0.04, top 0.8, 2px dot). Tall and narrow, so it
       sits at a little under half the umbrella's width. */
    sketch: {
      src: `${S}candle-pillar-halftone.webp`, w: 420, h: 1044, scale: 0.42,
      /* The flame, from just above the wick. */
      motion: {
        kind: 'flicker', origin: '50% 25%',
        part: 'polygon(34% 0, 66% 0, 66% 26%, 34% 26%)',
        rest: 'polygon(0 0, 34% 0, 34% 26%, 66% 26%, 66% 0, 100% 0, 100% 100%, 0 100%)',
      },
    },
    line: 'Conversations turned discoveries into understanding.',
    text: 'Time spent with the people who grow and work with coffee brought new perspectives, questions and stories to the surface. As the days unfolded, shared meals beneath the forest canopy brought everyone together, and the unfamiliar began to feel a little more like home.',
    shots: [
      { name: 'finding-our-rhythm-1', src: `${S}finding-our-rhythm-1.webp`, small: `${S}finding-our-rhythm-1-1290.webp`, w: 1920, h: 1300, alt: 'An Aura banner hung among strings of lights over the dinner' },
      { name: 'finding-our-rhythm-4', src: `${S}finding-our-rhythm-4.webp`, small: `${S}finding-our-rhythm-4-1290.webp`, w: 1920, h: 1300, alt: 'Guests smiling at the dinner table under string lights' },
      { name: 'finding-our-rhythm-2', src: `${S}finding-our-rhythm-2.webp`, small: `${S}finding-our-rhythm-2-1290.webp`, w: 1920, h: 1300, alt: 'Guests at the long candlelit table beneath the trees', note: 'There was a long dinner table | in the middle of the estate.' },
      { name: 'finding-our-rhythm-3', src: `${S}finding-our-rhythm-3.webp`, small: `${S}finding-our-rhythm-3-1290.webp`, w: 1920, h: 1300, alt: 'A candle on a stone painted RIPE26 among the leaves' },
    ],
  },
  {
    title: 'Leaving something behind',
    day: 'Part 5',
    art: [
      { src: `${T}leaving.svg`, w: 756, h: H },
      { src: `${T}something.svg`, w: 900, h: H },
      { src: `${T}behind.svg`, w: 575, h: H },
    ],
    /* A coffee sapling from the planting, with its name tag: lifted from
       RIPE source/…/08/ripe-planting-03.jpg with RIPE source/lift.swift
       (macOS Vision), the hand and sleeve cut away and the stem the tag
       hid drawn back in; then a ribbon tag like the planting's own,
       tied at the stem and drawn large so the name reads, with RIPE
       source/tag.swift (ARYAN, 27/09/26, in Marker Felt). Stippled in
       the page's pink with RIPE source/stipple.mjs (light, gamma 1, floor
       0.15, top 0.85, 2px dot), the label solid and its lettering cut
       out crisp, and split into two layers that fit together — the plant
       and the tag — so the tag can sway. Larger on a phone, for the
       lettering. */
    sketch: {
      src: `${S}sapling-tag-4-plant.webp`, w: 680, h: 564, scale: 1.15, phoneScale: 1.4,
      /* The tag, drawn on its own layer, from its knot at the stem. */
      motion: { kind: 'wave', origin: '65% 63%', partSrc: `${S}sapling-tag-4-tag.webp` },
    },
    line: 'Some things left behind are meant to grow.',
    text: 'Each of us planted an Arabica sapling into the soil, leaving behind a small part of ourselves to become part of Aura’s landscape. What began as a shared experience became a living connection, one that would continue long after the visit ended.',
    shots: [
      { name: 'leaving-something-behind-1', src: `${S}leaving-something-behind-1.webp`, small: `${S}leaving-something-behind-1-1290.webp`, w: 1920, h: 1300, alt: 'Coffee saplings and a basket on a table with an Aura cloth' },
      { name: 'leaving-something-behind-3', src: `${S}leaving-something-behind-3.webp`, small: `${S}leaving-something-behind-3-1290.webp`, w: 1920, h: 1300, alt: 'A man holding a tagged coffee sapling ready to plant, a young child crouched beside him' },
      { name: 'leaving-something-behind-2', src: `${S}leaving-something-behind-2.webp`, small: `${S}leaving-something-behind-2-1290.webp`, w: 1920, h: 1300, alt: 'A smiling guest holding up a young coffee plant with her name tag', note: 'We gave each tree our energy.' },
    ],
  },
]
