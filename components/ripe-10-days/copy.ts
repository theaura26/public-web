/* ═══════════════════════════════════════════════════════════════════
   10 Days of RIPE — the page's words and pictures.

   The story is the supplied document, verbatim:
   public/RIPE/10 Days of RIPE/RIPE Story.pages. It runs in eight
   chapters, each a title and the line under it, carried here exactly as
   written there.

   Each chapter's pictures are finished in Figma (AURA — Coffee Festival,
   Page 1: one row per chapter, its background first) and brought onto
   the site in /RIPE/10-days/NN by scripts/ripe/figma-export.mjs, which
   also records every copy's pixel size in media.json — read below, so
   sizes are never typed by hand. The order below follows the Figma rows;
   the films, which Figma doesn't hold, keep their places among them.
   A picture whose file has gone simply drops out.

   Captions are taken from the caption ideas in
   public/RIPE/10 Days of RIPE/RIPE 10 Days photo captions.docx where one
   fits the picture; the rest are drafted here in the same short form.
   Chapters 1 and 2 keep the sentence captions approved before the
   document existed.
═══════════════════════════════════════════════════════════════════ */

import type { Run } from '@/components/ripe/copy'
import media from './media.json'

const D = '/RIPE/10-days'

/* The sister page's accent, where /ripe's is green: a neon pink, as bright as that green.
   Also in /RIPE/10-days/aura-ripe-coral.svg, whose colour is in the file. */
export const CORAL = '#FF2D87'

/* The header's line, beside the RIPE mark, in place of /ripe's "Right
   Time / made visible." — two lines, as that is. */
export const TAGLINE = ['A season', 'to remember.'] as const

/* The opening, after the header, in two paragraphs (broken with \n).
   The lifted line ({ g }) takes the page's accent — in colour only here,
   not bold (RipeStoryIntro) — and starts a line of its own (\u2028, a
   new line within the paragraph). */
export const INTRO: Run[] = [
  'Some places you visit.\u2028', { g: 'Some stay with you.' },
  /* One sentence to a line (\u2028), the four together as a paragraph. */
  '\nThe soil under your nails.\u2028The sound of cowbells.\u2028The quiet between the trees.\u2028The warmth of the fire after a long day.',
]

/* A picture floating past a chapter. w/h are the exported pixels. */
export type Shot = {
  /** Its file name, as in the pick list below. */
  name: string
  src: string; w: number; h: number; alt: string; caption: string
  /** A film in place of the picture. src is then its poster frame, and
      w/h the film's own shape. */
  video?: string
  /** The film's own sound can be turned on, with a button over it. */
  sound?: boolean
  /** Its size against the other pictures (1). */
  size?: number
  /** Its own grade, as a CSS filter: for a film, in place of the one
      all films share (FILM_GRADE in RipeStoryDays); for a still, on top
      of its Figma retouch. */
  grade?: string
  /** Extra room before it, in steps between pictures — for one that
      comes too close behind another on its side. */
  gap?: number
  /** The side of the screen it floats up on, where the usual left/right
      alternation won't do. */
  side?: 'left' | 'right'
  /** Whether it passes behind the chapter's words or in front of them.
      Unset, behind. */
  layer?: 'behind' | 'front'
}

export type Day = {
  /** The chapter's name, set as the site's h2. */
  title: string
  /** Its place in the story, "Part 1". Not shown; used for keys,
      anchors and what a screen reader hears in the chapter bar. */
  day: string
  /** The line under it, in Bricolage. Several lines become several paragraphs. */
  line: string[]
  shots: Shot[]
  /** A wide picture of the place, laid faintly behind the chapter's
      words for as long as it lasts. */
  bg?: string
  /** A second background, crossing in over the first as the picture
      named in `from` comes up the screen, and staying to the chapter's end.
      hold: a clear beat before that picture, in steps between pictures, in
      which the new background comes up sharp under the title; title and
      line: a new title and subheading, taking over from the chapter's own
      as it does. */
  bgThen?: { src: string; from: string; hold?: number; title?: string; line?: string }
  /** How far apart its pictures come, against the usual step (1). */
  spacing?: number
  /** How much further out from the middle its pictures sit, in vw, on
      wide screens: a short title ("Arriving") otherwise draws them in
      close, since they sit at its edges. */
  spread?: number
  /** false: no dark tint on its background — it keeps its own light,
      and only blurs as the pictures pass. */
  tint?: boolean
  /** The shape of its pictures: 'oval', or 'rounded' corners. Unset,
      square-cornered as cut. */
  shape?: 'oval' | 'rounded'
}

/* v / vf: the file's fingerprint (poster, film), added to its address so a
   replaced file is fetched fresh rather than shown from a browser's cache. */
type Size = { w: number; h: number; video?: boolean; v?: string; vf?: string }
const q = (v?: string) => (v ? `?v=${v}` : '')
const sizes = media as unknown as Record<string, Record<string, Size>>

/* One chapter's pictures, in order: [file name as graded, caption, alt],
   and after them, options: { sound: true } for a film whose sound can be
   heard, { size: 0.7 } for one shown smaller than the rest, { grade } for
   a picture or film retouched on its own, { gap: 0.8 } for extra room
   before it, { side: 'left' } to set the side it floats on, { layer:
   'behind' } or { layer: 'front' } to pass behind or over the words.
   A picture from another chapter's folder is named with it, "04/name".
   A name with no graded copy is left out rather than shown broken. */
type Pick = [name: string, caption: string, alt: string, options?: { sound?: boolean; size?: number; grade?: string; gap?: number; side?: 'left' | 'right'; layer?: 'behind' | 'front' }]
function pictures(chapter: string, picks: Pick[]): Shot[] {
  return picks.flatMap(([pick, caption, alt, options]) => {
    const [folder, name] = pick.includes('/') ? pick.split('/') : [chapter, pick]
    const m = sizes[folder]?.[name]
    if (!m) return []
    const at = `${D}/${folder}/${name}`
    return [{
      name, src: `${at}.jpg${q(m.v)}`, w: m.w, h: m.h, caption, alt,
      ...(m.video ? { video: `${at}.mp4${q(m.vf)}`, ...(options?.sound ? { sound: true } : {}) } : {}),
      ...(options?.size ? { size: options.size } : {}),
      ...(options?.grade ? { grade: options.grade } : {}),
      ...(options?.gap ? { gap: options.gap } : {}),
      ...(options?.side ? { side: options.side } : {}),
      ...(options?.layer ? { layer: options.layer } : {}),
    }]
  })
}

/* The header film: the folder's banner video, re-encoded by the grading
   script into a wide cut and a phone cut. The phone cut is the same film,
   smaller — the header crops it to the tall screen itself. One frame of it
   is the poster on both. Absent until the script has made it. */
const banner = (media as unknown as { banner?: { v: string; vp: string; vposter?: string } }).banner
export const BANNER = banner && {
  src: `${D}/banner/ripe-banner.mp4${q(banner.v)}`,
  srcPhone: `${D}/banner/ripe-banner-phone.mp4${q(banner.vp)}`,
  poster: `${D}/banner/ripe-banner.jpg${q(banner.vposter)}`,
  posterPhone: `${D}/banner/ripe-banner.jpg${q(banner.vposter)}`,
}

/* The chapter backgrounds, graded with the photographs. */
const bg = (chapter: string) => {
  const m = sizes.backgrounds?.[chapter]
  return m ? `${D}/backgrounds/ripe-${chapter}-bg.jpg${q(m.v)}` : undefined
}

/* A chapter's second background ("06-2" → ripe-06-2-bg.jpg), from the
   named picture on. Absent if the file is. */
const bgThen = (key: string, from: string, more: { hold?: number; title?: string; line?: string } = {}) => {
  const m = sizes.backgrounds?.[key]
  return m ? { src: `${D}/backgrounds/ripe-${key}-bg.jpg${q(m.v)}`, from, ...more } : undefined
}

export const DAYS: Day[] = [
  {
    title: 'Arriving',
    day: 'Part 1', bg: bg('01'),
    /* The opening chapter, unhurried: its pictures further apart, and
       its background in its own light, untinted. */
    spacing: 1.6, spread: 10, tint: false,
    line: ['The first glimpse of a place that would slowly become familiar.'],
    shots: pictures('01', [
      ['ripe-entrance', 'Road to Aura', 'The red earth track up to the estate house, under a rain tree'],
      ['img-7450-2', 'The view from the temple', 'The valley and the hills beyond under a sky of moving cloud'],
      ['ripe-dogs', 'First to say hello', 'Three dogs resting on the red steps of the bungalow'],
      ['ripe-estate', 'A painted box on a silver oak', 'A painted tin box on the trunk of a silver oak among the coffee'],
      ['ripe-familiar-new', 'Waving hi from the field', 'People at work in the clearing among the pines, looking up to say hello', { size: 0.7 }],
      ['ripe-sky', 'Cloud watching', 'Cumulus cloud over the palms and the hills'],
    ]),
  },
  {
    title: 'Looking closer',
    day: 'Part 2', bg: bg('02'),
    line: ['The estate began to open up and became a world to discover.'],
    shots: pictures('02', [
      ['ripe-food', 'Breakfast, shared', 'A table laid with oranges, pomegranate curd and a dish of roasted vegetables'],
      ['aura-cow', 'Some moo time', 'A black cow looking through the wire of its shed'],
      ['aura-temple', 'Prayer flags in the green', 'Prayer flags strung between the trees, moving in the breeze'],
      ['aura-pillar', 'Attention, unhurried, rooted, awake', 'A rusted steel pillar engraved with the Aura mark and the words Attention, Unhurried, Rooted, Awake'],
      ['aura-coffee', 'Patience in berry form', 'Clusters of green coffee cherries on the branch'],
      ['bug-video', 'Biodiversity in disguise', 'A pill millipede making its way through the grass on the red earth'],
      ['ripe-fungus', 'Wood with company', 'Bracket fungus growing along a fallen log'],
      ['aura-goodbyes-02', 'Aura celebrity spotted', 'A macaque peering into a trail camera in the forest'],
    ]),
  },
  {
    title: 'Finding a way in',
    day: 'Part 3', bg: bg('03'),
    line: ['The paths and people became more familiar.'],
    shots: pictures('03', [
      ['aura-path', 'Estate walks', 'A grassy track running between tall shade trees through the coffee'],
      ['aura-pepper-path', 'Pepper, our guide', 'Pepper the dog leading the way up laterite steps through the coffee'],
      ['ripe-bug', 'Wild encounters', 'A pill millipede on the red earth among dry leaves'],
      ['ripe-natural-tattoo', 'Natural ink', 'A fern frond laid across two forearms, beside the white fern print it has left on the skin'],
      ['img-8217', 'Deepak, in demand', 'Deepak on the phone beside the Aura stone marker, deep in the trees'],
      ['ripe-kids', 'The next generation', 'Children and young people standing together outside the workers’ quarters'],
      ['ripe-quote', 'Never easy, always possible', 'A young man in gumboots leaning on a hoe, his T-shirt reading Change is never easy but always possible'],
      ['aura-cook', 'Dannes in action', 'Dannes in a striped shirt and green apron at work in the kitchen'],
      ['aura-ganpati', 'Sacred spaces', 'People gathered at night around a lit tent set up for Ganpati'],
      ['aura-kids-ganpati', 'Ganpati blessings', 'Children cheering in front of the Ganpati shrine, under marigold garlands'],
      /* Shot flat and bright: brought down, deeper in the blacks, and
         richer — with little extra warmth, so skin stays true. */
      ['nayana-tree-tagging', 'Nayana on tree tagging', 'Nayana in an Aura T-shirt, talking about tagging the estate’s trees', {
        sound: true, grade: 'brightness(0.86) contrast(1.1) saturate(1.45) sepia(0.03)',
      }],
      ['aura-chefs', 'Making dinner in the wild', 'Two chefs in Aura aprons cooking over a laterite brick grill in the open'],
      ['ripe-small-wonders', 'Small wonders', 'A small insect held in an open palm, an Aura T-shirt behind'],
      ['aura-coffee-sip', 'A slow, contemplative sip', 'A man in an Aura sweatshirt sipping coffee from a small glass among the trees'],
      ['ripe-smiles', 'Warm smiles', 'Two women smiling together on the estate'],
    ]),
  },
  {
    title: 'Making a mark',
    /* Chapters 4 and 5 show each other's backgrounds (the hills here,
       the courtyard under Becoming familiar); the files keep Figma's names. */
    day: 'Part 4', bg: bg('05'),
    /* Mostly tall pictures and two upright films: further apart, so
       they don't bunch up. */
    spacing: 1.6,
    line: ['The estate became the canvas.'],
    shots: pictures('04', [
      ['aura-painting', 'Painted moments', 'A watercolour of yellow and purple flowers beside a paint box'],
      ['aura-painting-ripe', 'RIPE takes shape', 'RIPE26 being painted in white on a slice of wood, brushes and paint beside it'],
      ['aura-chicken-coop-painting', 'Freshly painted coop', 'Painting hens onto the doors of the chicken coop'],
      ['aura-chicken-coop', 'Feathered friends', 'The finished coop doors, painted with a hen and a rooster'],
      ['aura-painting-artist', 'Brush in hand', 'Painting yellow flowers in watercolour at an outdoor table'],
      /* Mostly white paper, and over-bright: brought down. A little
         smaller, to match the coop film on the other side. */
      ['img-7819-3', 'Petal by petal', 'A hand painting yellow petals in watercolour, the paint box beside it', { grade: 'brightness(0.84) contrast(1.06) saturate(1.15) sepia(0.04)', size: 0.82 }],
      ['aura-studio', 'Studio days', 'The studio wall hung with small framed and pinned works'],
    ]),
  },
  {
    title: 'Becoming familiar',
    day: 'Part 5', bg: bg('04'),
    line: ['Each person carried a piece of Aura. Together, it felt alive.'],
    shots: pictures('05', [
      ['aura-kids', 'Young minds', 'Children playing in the courtyard of the workers’ quarters'],
      ['aura-nayana-kids', 'Shared stories', 'Nayana sitting with children on a doorstep at the estate'],
      /* Brighter than the pictures around it: brought down. */
      ['img-8218', 'Work, interrupted', 'A man at a laptop on an outdoor table, a small girl leaning in beside him', { grade: 'brightness(0.84) contrast(1.05) saturate(1.2) sepia(0.04)' }],
      ['ripe-people-02', 'Working hands', 'Women of the estate standing in a line, ready for the day'],
      ['ripe-people-colours', 'Colours of Aura', 'Women in bright headscarves and shawls gathered together'],
      ['aura-sadanand', 'With Sadanand', 'Sadanand at work by the compost beds under a shade net'],
      ['ripe-wheelbarrow', 'On the way', 'Three young men walking up a forest path, one pushing a wheelbarrow'],
      ['ripe-buddha-03', 'Finding his place', 'Hands easing the stone Buddha into place at the foot of a tree'],
      ['ripe-buddha-02', 'A shared moment', 'Setting the garlanded Buddha down among the ferns'],
      ['ripe-buddha', 'Peace in position', 'People garlanding the Buddha beneath the tree'],
      ['ripe-more-people', 'All together', 'A group photograph of guests and the people of the estate'],
      ['aura-team', 'Aura family', 'Five men of the Aura team in caps and Aura tops, arms folded'],
      ['aura-raghu-tea-estate', 'With Raghu on the tea estate', 'Two men in Aura tops standing among the silver oaks, the tea estate and hills behind them'],
      ['aura-top', 'The Aura life', 'The back of an Aura top printed Attention. Unhurried. Rooted. Awake.'],
    ]),
  },
  {
    title: 'A world revealed',
    day: 'Part 6', bg: bg('06'),
    /* The evening: the candlelit table takes over as the lights come on,
       and the chapter's words turn with it. */
    bgThen: bgThen('06-2', 'aura-ripe-dinner-02', { title: 'Finding a shared rhythm', line: 'A long table. The forest around us. Conversations that carried into the night. And nowhere else to be.' }),
    line: ['The unfamiliar became a world of new discoveries.'],
    shots: pictures('06', [
      ['img-7952', 'Breakfast with a view', 'Breakfast laid on checked cloths in the open, the misty hills behind'],
      ['aura-breakfast', 'A drizzly breakfast', 'Four friends sharing breakfast plates under a big umbrella in the drizzle'],
      ['aura-tea-estate', 'Tea estate walks', 'Walking single file through the rows of tea'],
      ['aura-biodiversity', 'Biodiversity walk with Pulkit', 'Pulkit on the biodiversity walk, down the red earth track between the trees', { sound: true }],
      ['ripe-bracelet', 'Flower bracelet', 'Tying a bracelet of flowers around a wrist'],
      /* Further behind the biodiversity walk, which drifts slowly on the
         same side and was caught up. */
      ['aura-dinner-setup', 'Dinner kept a secret', 'A long table set with leaf plates, petals and candles among the trees', { gap: 0.8 }],
      ['aura-ripe-dinner-02', 'Forest all around', 'String lights and an Aura banner over the dinner table at night'],
      ['aura-ripe-dinner-04', 'RIPE nights', 'A candle on a stone painted RIPE26, among the leaves'],
      ['aura-ripe-dinner-03', 'Shared tables on the estate', 'Guests at the long table under the string lights'],
      ['aura-ripe-dinner-05', 'Candlelit smiles', 'A guest smiling in the candlelight at the dinner table'],
    ]),
  },
  {
    title: 'See, feel & understand',
    day: 'Part 7', bg: bg('07'),
    /* After the tasting table: the track through the coffee. */
    bgThen: bgThen('07-2', 'aura-tasting'),
    line: ['Things first encountered as separate parts of Aura began to connect, as one living system.'],
    shots: pictures('07', [
      ['img-8104', 'Cow pat pit by Rao sir and Arun sir', 'Rao sir and Arun sir, in Aura tops, explaining the cow pat pit under a shelter', { sound: true }],
      ['aura-cow-to-compost', 'From cow to compost', 'Cows walking across the yard, on their way to becoming compost'],
      ['aura-cpp-hands-dirty', 'Getting our hands dirty', 'Adults and a child mixing the compost by hand'],
      ['aura-cpp-03', 'Little hands in rhythm', 'A child reaching into the compost'],
      ['aura-bd-magic', 'Biodynamic magic', 'A wooden box of biodynamic preparations'],
      ['aura-bd-magic-02', 'BD 502 in the palm', 'A preparation held in a cupped hand'],
      ['aura-cpp-06', 'Cow pat pit balls', 'Balls of compost drying on a mesh'],
      ['aura-cpp-07', 'New perspectives', 'Laughing during the compost session'],
      ['ripe-jeevamrit', 'Jeevamrit drums', 'Labelled drums of jeevamrit under a shelter'],
      ['aura-human', 'Barefoot', 'A man standing barefoot under the eaves, the forest behind'],
      /* Paler than the pictures around it: its colour brought up. */
      ['aura-compost-hands', 'Into the earth', 'A man crouched barefoot, working the compost with his hands', { grade: 'saturate(1.45)' }],
      ['aura-tasting-estate', 'Coffee tasting', 'A tasting table set out under the trees'],
      ['aura-tasting', 'Slow pours', 'Two people pouring from kettles at the tasting'],
      ['img-8141', 'The coffee ritual', 'Pouring hot water over a pour-over dripper at the checked tasting table'],
      ['ripe-tasting', 'Brewed on stone', 'A pour-over dripper set on a standing stone'],
    ]),
  },
  {
    title: 'Leaving something behind',
    day: 'Part 8', bg: bg('08'),
    line: ['Some things we leave behind are meant to grow.'],
    shots: pictures('08', [
      /* A film now; the picture of the saplings on the table is its poster. */
      ['ripe-planting', 'Ready to take root', 'Planting a young coffee sapling into the red earth', { grade: 'brightness(0.84) contrast(1.05) saturate(1.15) sepia(0.04)' }],
      ['ripe-energy', 'Carrying Aura', 'A guest holding up a young coffee plant'],
      /* Further behind the planting film, on the same side. */
      ['ripe-planting-02', 'Planting together', 'An adult and a child planting a sapling, a basket beside them', { gap: 0.8 }],
      ['ripe-energy-02', 'Rooting in', 'Pressing a sapling into the soil'],
      ['ripe-energy-03', 'Hand in hand', 'Two people planting a coffee sapling together'],
      ['ripe-planting-03', 'Something left', 'A hand settling a coffee sapling into the red earth'],
      ['ripe-energy-04', 'Shared memories', 'A smiling guest crouched beside a newly planted sapling'],
      ['aura-goodbyes', 'Until next time', 'Everyone together in the studio for a last photograph'],
    ]),
  },
]

/* The closing, after the last chapter's pictures, over its background:
   plain white throughout, no word lifted. Paragraphs are broken with \n. */
export const CODA: Run[] = [
  'At first, Aura was unfamiliar.\nTen days later, we knew the paths by heart.\nThere were stories behind the faces. Places to sit beneath the trees. Dogs to look for. Cows, insects and plants to notice. Time had been shared. Something had been made.\nRIPE has come to an end, but something has just begun.\nAura had slowly become more than a place to visit. It had become a place to belong.',
]

/* The earlier version of the story's closing passage, kept for reference;
   CODA above is what the page shows. */
export const CLOSING = [
  'The bungalows were the starting point. The estate was still largely unexplored. The people were new faces. The paths were unknown.',
  'Ten days later, the paths had become familiar.',
  'There were stories behind the faces. Places to sit beneath the trees. Dogs to look for. Cows, insects and plants to notice.',
  'Paint had found its way into the spaces around Aura. Time had been shared. Something had been made.',
  'Something had been left behind.',
  'And something had been taken along.',
  'Aura had slowly moved from being a place to visit',
  'to a place to belong.',
]
