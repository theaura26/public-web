/* ═══════════════════════════════════════════════════════════════════
   A Season of RIPE — the page's words and its ten days of pictures.

   Transcribed from the prepared export (RIPE pages, 8 October 2026):
   every caption, line and alt text is the one written there. The shot
   dimensions are the file's own, kept so each frame reserves its space
   before the picture loads.
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
  film: {
    src: '/RIPE/10-days/banner/ripe-banner.mp4',
    srcPhone: '/RIPE/10-days/banner/ripe-banner-phone.mp4',
    poster: '/RIPE/10-days/banner/ripe-banner.jpg',
    posterPhone: '/RIPE/10-days/banner/ripe-banner.jpg',
    first: '/RIPE/10-days/banner/ripe-banner-first.jpg',
    label: 'The canopy over the estate, filmed from below on a still morning',
  },
} as const

/** The statement under the opener. */
export const SEASON_INTRO = [
  'Some places you visit.',
  'Some stay with you.',
  'The soil under your nails.',
  'The sound of cowbells.',
  'The quiet between the trees.',
  'The warmth of the fire after a long day.',
]

/** After the last day. */
export const SEASON_CODA = [
  'At first, Aura was unfamiliar.',
  'Ten days later, we knew the paths by heart.',
  'There were stories behind the faces. Places to sit beneath the trees. Dogs to look for. Cows, insects and plants to notice. Time had been shared. Something had been made.',
  'RIPE has come to an end, but something has just begun.',
  'Aura had slowly become more than a place to visit. It had become a place to belong.',
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
  image: '/RIPE/10-days/banner/ripe-banner-first.jpg',
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
  caption: string
  alt: string
  /** A film plays in place of the still once it can. */
  video?: string
  /** Fraction of the normal frame width, where the design sets one. */
  size?: number
}

export type Day = {
  title: string
  day: string
  bg: string
  line: string[]
  shots: Shot[]
  /** The day's name as drawn lettering, with its own size. */
  art: { src: string; w: number; h: number }
  /** Scroll room per shot, in screens; the design sets these per day. */
  spacing?: number
  spacingPhone?: number
  spread?: number
  tint?: boolean
}

export const DAYS: Day[] = [
  {
    title: "Arriving",
    art: { src: "/RIPE/10-days/titles/arriving.svg", w: 734, h: 242 },
    day: "Part 1",
    bg: "/RIPE/10-days/backgrounds/ripe-01-bg.jpg",
    spacing: 1.6,
    spacingPhone: 0.9,
    spread: 10,
    tint: false,
    line: ["The first glimpse of a place that would slowly become familiar."],
    shots: [
      { name: "ripe-entrance", src: "/RIPE/10-days/01/ripe-entrance.jpg", w: 1050, h: 1400, caption: "Road to Aura", alt: "The red earth track up to the estate house, under a rain tree" },
      { name: "ripe-food", src: "/RIPE/10-days/01/ripe-food.jpg", w: 1400, h: 1050, caption: "Breakfast, shared", alt: "A table laid with oranges, pomegranate curd and a dish of roasted vegetables" },
      { name: "img-7450-2", src: "/RIPE/10-days/01/img-7450-2.jpg", w: 853, h: 480, caption: "The view from the temple", alt: "The valley and the hills beyond under a sky of moving cloud", video: "/RIPE/10-days/01/img-7450-2.mp4" },
      { name: "ripe-dogs", src: "/RIPE/10-days/01/ripe-dogs.jpg", w: 1050, h: 1346, caption: "First to say hello", alt: "Three dogs resting on the red steps of the bungalow" },
      { name: "ripe-estate", src: "/RIPE/10-days/01/ripe-estate.jpg", w: 1050, h: 1400, caption: "A painted box on a silver oak", alt: "A painted tin box on the trunk of a silver oak among the coffee" },
      { name: "ripe-familiar-new", src: "/RIPE/10-days/01/ripe-familiar-new.jpg", w: 720, h: 1280, caption: "Waving hi from the field", alt: "People at work in the clearing among the pines, looking up to say hello", video: "/RIPE/10-days/01/ripe-familiar-new.mp4", size: 0.7 },
      { name: "ripe-sky", src: "/RIPE/10-days/01/ripe-sky.jpg", w: 1350, h: 901, caption: "Cloud watching", alt: "Cumulus cloud over the palms and the hills" },
    ],
  },
  {
    title: "Looking closer",
    art: { src: "/RIPE/10-days/titles/looking-closer.svg", w: 1327, h: 242 },
    day: "Part 2",
    bg: "/RIPE/10-days/backgrounds/ripe-02-bg.jpg",
    line: ["The estate began to open up and became a world to discover."],
    shots: [
      { name: "aura-cow", src: "/RIPE/10-days/02/aura-cow.jpg", w: 1050, h: 1400, caption: "Some moo time", alt: "A black cow looking through the wire of its shed" },
      { name: "aura-temple", src: "/RIPE/10-days/02/aura-temple.jpg", w: 1024, h: 576, caption: "Prayer flags in the green", alt: "Prayer flags strung between the trees, moving in the breeze", video: "/RIPE/10-days/02/aura-temple.mp4" },
      { name: "aura-pillar", src: "/RIPE/10-days/02/aura-pillar.jpg", w: 1050, h: 1400, caption: "Attention, unhurried, rooted, awake", alt: "A rusted steel pillar engraved with the Aura mark and the words Attention, Unhurried, Rooted, Awake" },
      { name: "aura-coffee", src: "/RIPE/10-days/02/aura-coffee.jpg", w: 1050, h: 1400, caption: "Patience in berry form", alt: "Clusters of green coffee cherries on the branch" },
      { name: "bug-video", src: "/RIPE/10-days/02/bug-video.jpg", w: 853, h: 480, caption: "Biodiversity in disguise", alt: "A pill millipede making its way through the grass on the red earth", video: "/RIPE/10-days/02/bug-video.mp4" },
      { name: "ripe-fungus", src: "/RIPE/10-days/02/ripe-fungus.jpg", w: 1050, h: 1400, caption: "Wood with company", alt: "Bracket fungus growing along a fallen log" },
      { name: "ripe-tree", src: "/RIPE/10-days/02/ripe-tree.jpg", w: 1400, h: 1042, caption: "Old roots run deep", alt: "An old tree on great buttress roots, moss and ferns on its trunk, sunlight through the canopy behind" },
      { name: "aura-hydrology", src: "/RIPE/10-days/02/aura-hydrology.jpg", w: 1280, h: 720, caption: "Water finding its way", alt: "A stream tumbling over rocks under the leaves, brown with the rain", video: "/RIPE/10-days/02/aura-hydrology.mp4" },
      { name: "aura-goodbyes-02", src: "/RIPE/10-days/02/aura-goodbyes-02.jpg", w: 1064, h: 705, caption: "Aura celebrity spotted", alt: "A macaque peering into a trail camera in the forest" },
    ],
  },
  {
    title: "Finding a way in",
    art: { src: "/RIPE/10-days/titles/finding-a-way-in.svg", w: 1453, h: 242 },
    day: "Part 3",
    bg: "/RIPE/10-days/backgrounds/ripe-03-bg.jpg",
    line: ["The paths and people became more familiar."],
    shots: [
      { name: "aura-path", src: "/RIPE/10-days/03/aura-path.jpg", w: 955, h: 1400, caption: "Estate walks", alt: "A grassy track running between tall shade trees through the coffee" },
      { name: "aura-pepper-path", src: "/RIPE/10-days/03/aura-pepper-path.jpg", w: 1050, h: 1400, caption: "Pepper, our guide", alt: "Pepper the dog leading the way up laterite steps through the coffee" },
      { name: "ripe-bug", src: "/RIPE/10-days/03/ripe-bug.jpg", w: 1400, h: 1225, caption: "Wild encounters", alt: "A pill millipede on the red earth among dry leaves" },
      { name: "ripe-natural-tattoo", src: "/RIPE/10-days/03/ripe-natural-tattoo.jpg", w: 788, h: 638, caption: "Natural ink", alt: "A fern frond laid across two forearms, beside the white fern print it has left on the skin" },
      { name: "img-8217", src: "/RIPE/10-days/03/img-8217.jpg", w: 853, h: 480, caption: "Deepak, in demand", alt: "Deepak on the phone beside the Aura stone marker, deep in the trees", video: "/RIPE/10-days/03/img-8217.mp4" },
      { name: "ripe-kids", src: "/RIPE/10-days/03/ripe-kids.jpg", w: 1395, h: 1179, caption: "The next generation", alt: "Children and young people standing together outside the workers’ quarters" },
      { name: "ripe-quote", src: "/RIPE/10-days/03/ripe-quote.jpg", w: 671, h: 846, caption: "Never easy, always possible", alt: "A young man in gumboots leaning on a hoe, his T-shirt reading Change is never easy but always possible" },
      { name: "aura-kids-running", src: "/RIPE/10-days/03/aura-kids-running.jpg", w: 480, h: 854, caption: "Making room for a game", alt: "Children running across the grass towards the studio, palms behind them", video: "/RIPE/10-days/03/aura-kids-running.mp4" },
      { name: "aura-cook", src: "/RIPE/10-days/03/aura-cook.jpg", w: 1395, h: 1179, caption: "Dannes in action", alt: "Dannes in a striped shirt and green apron at work in the kitchen" },
      { name: "aura-ganpati", src: "/RIPE/10-days/03/aura-ganpati.jpg", w: 1400, h: 1050, caption: "Sacred spaces", alt: "People gathered at night around a lit tent set up for Ganpati" },
      { name: "aura-kids-ganpati", src: "/RIPE/10-days/03/aura-kids-ganpati.jpg", w: 1400, h: 1050, caption: "Ganpati blessings", alt: "Children cheering in front of the Ganpati shrine, under marigold garlands" },
      { name: "nayana-tree-tagging", src: "/RIPE/10-days/03/nayana-tree-tagging.jpg", w: 853, h: 480, caption: "Nayana on tree tagging", alt: "Nayana in an Aura T-shirt, talking about tagging the estate’s trees", video: "/RIPE/10-days/03/nayana-tree-tagging.mp4" },
      { name: "aura-chefs", src: "/RIPE/10-days/03/aura-chefs.jpg", w: 1050, h: 1400, caption: "Making dinner in the wild", alt: "Two chefs in Aura aprons cooking over a laterite brick grill in the open" },
      { name: "ripe-small-wonders", src: "/RIPE/10-days/03/ripe-small-wonders.jpg", w: 1400, h: 846, caption: "Small wonders", alt: "A small insect held in an open palm, an Aura T-shirt behind" },
      { name: "aura-coffee-sip", src: "/RIPE/10-days/03/aura-coffee-sip.jpg", w: 1400, h: 846, caption: "A slow, contemplative sip", alt: "A man in an Aura sweatshirt sipping coffee from a small glass among the trees" },
      { name: "ripe-smiles", src: "/RIPE/10-days/03/ripe-smiles.jpg", w: 671, h: 846, caption: "Warm smiles", alt: "Two women smiling together on the estate" },
    ],
  },
  {
    title: "Making a mark",
    art: { src: "/RIPE/10-days/titles/making-a-mark.svg", w: 1346, h: 242 },
    day: "Part 4",
    bg: "/RIPE/10-days/backgrounds/ripe-05-bg.jpg",
    spacing: 1.6,
    spacingPhone: 0.9,
    line: ["The estate became the canvas."],
    shots: [
      { name: "aura-painting", src: "/RIPE/10-days/04/aura-painting.jpg", w: 1050, h: 1400, caption: "Painted moments", alt: "A watercolour of yellow and purple flowers beside a paint box" },
      { name: "aura-painting-ripe", src: "/RIPE/10-days/04/aura-painting-ripe.jpg", w: 1400, h: 1050, caption: "RIPE takes shape", alt: "RIPE26 being painted in white on a slice of wood, brushes and paint beside it" },
      { name: "aura-chicken-coop-painting", src: "/RIPE/10-days/04/aura-chicken-coop-painting.jpg", w: 576, h: 1024, caption: "Freshly painted coop", alt: "Painting hens onto the doors of the chicken coop", video: "/RIPE/10-days/04/aura-chicken-coop-painting.mp4" },
      { name: "aura-chicken-coop", src: "/RIPE/10-days/04/aura-chicken-coop.jpg", w: 1325, h: 1292, caption: "Feathered friends", alt: "The finished coop doors, painted with a hen and a rooster" },
      { name: "aura-painting-artist", src: "/RIPE/10-days/04/aura-painting-artist.jpg", w: 1050, h: 1400, caption: "Brush in hand", alt: "Painting yellow flowers in watercolour at an outdoor table" },
      { name: "aura-studio", src: "/RIPE/10-days/04/aura-studio.jpg", w: 1400, h: 1050, caption: "Studio days", alt: "The studio wall hung with small framed and pinned works" },
    ],
  },
  {
    title: "Becoming familiar",
    art: { src: "/RIPE/10-days/titles/becoming-familiar.svg", w: 1616, h: 242 },
    day: "Part 5",
    bg: "/RIPE/10-days/backgrounds/ripe-04-bg.jpg",
    line: ["Each person carried a piece of Aura. Together, it felt alive."],
    shots: [
      { name: "aura-kids", src: "/RIPE/10-days/05/aura-kids.jpg", w: 1050, h: 1400, caption: "Young minds", alt: "Children playing in the courtyard of the workers’ quarters" },
      { name: "aura-nayana-kids", src: "/RIPE/10-days/05/aura-nayana-kids.jpg", w: 1400, h: 1050, caption: "Shared stories", alt: "Nayana sitting with children on a doorstep at the estate" },
      { name: "img-8218", src: "/RIPE/10-days/05/img-8218.jpg", w: 853, h: 480, caption: "Work, interrupted", alt: "A man at a laptop on an outdoor table, a small girl leaning in beside him", video: "/RIPE/10-days/05/img-8218.mp4" },
      { name: "ripe-people-02", src: "/RIPE/10-days/05/ripe-people-02.jpg", w: 1400, h: 925, caption: "Working hands", alt: "Women of the estate standing in a line, ready for the day" },
      { name: "ripe-people-colours", src: "/RIPE/10-days/05/ripe-people-colours.jpg", w: 1400, h: 929, caption: "Colours of Aura", alt: "Women in bright headscarves and shawls gathered together" },
      { name: "aura-raghu-tea-estate", src: "/RIPE/10-days/05/aura-raghu-tea-estate.jpg", w: 1400, h: 1050, caption: "With Raghu on the tea estate", alt: "Two men in Aura tops standing among the silver oaks, the tea estate and hills behind them" },
      { name: "aura-sadanand", src: "/RIPE/10-days/05/aura-sadanand.jpg", w: 1024, h: 576, caption: "With Sadanand", alt: "Sadanand at work by the compost beds under a shade net", video: "/RIPE/10-days/05/aura-sadanand.mp4" },
      { name: "aura-kitchen", src: "/RIPE/10-days/05/aura-kitchen.jpg", w: 1400, h: 1050, caption: "Smiles from the kitchen", alt: "Two cooks in green aprons smiling through an archway into the kitchen" },
      { name: "ripe-wheelbarrow", src: "/RIPE/10-days/05/ripe-wheelbarrow.jpg", w: 814, h: 1225, caption: "On the way", alt: "Three young men walking up a forest path, one pushing a wheelbarrow" },
      { name: "ripe-buddha-03", src: "/RIPE/10-days/05/ripe-buddha-03.jpg", w: 818, h: 562, caption: "Finding his place", alt: "Hands easing the stone Buddha into place at the foot of a tree" },
      { name: "ripe-buddha-02", src: "/RIPE/10-days/05/ripe-buddha-02.jpg", w: 810, h: 969, caption: "A shared moment", alt: "Setting the garlanded Buddha down among the ferns" },
      { name: "ripe-buddha", src: "/RIPE/10-days/05/ripe-buddha.jpg", w: 981, h: 961, caption: "Peace in position", alt: "People garlanding the Buddha beneath the tree" },
      { name: "ripe-more-people", src: "/RIPE/10-days/05/ripe-more-people.jpg", w: 1400, h: 927, caption: "All together", alt: "A group photograph of guests and the people of the estate" },
      { name: "aura-team", src: "/RIPE/10-days/05/aura-team.jpg", w: 1400, h: 927, caption: "Aura family", alt: "Five men of the Aura team in caps and Aura tops, arms folded" },
    ],
  },
  {
    title: "A world revealed",
    art: { src: "/RIPE/10-days/titles/a-world-revealed.svg", w: 1486, h: 242 },
    day: "Part 6",
    bg: "/RIPE/10-days/backgrounds/ripe-06-bg.jpg",
    line: ["The unfamiliar became a world of new discoveries."],
    shots: [
      { name: "ripe-temple", src: "/RIPE/10-days/06/ripe-temple.jpg", w: 1400, h: 1050, caption: "A moment at the temple", alt: "A man in a cap with his hands folded in namaste beside a small stone temple, its deity garlanded and lamps lit" },
      { name: "img-7952", src: "/RIPE/10-days/06/img-7952.jpg", w: 1024, h: 576, caption: "Breakfast with a view", alt: "Breakfast laid on checked cloths in the open, the misty hills behind", video: "/RIPE/10-days/06/img-7952.mp4" },
      { name: "aura-breakfast", src: "/RIPE/10-days/06/aura-breakfast.jpg", w: 1280, h: 960, caption: "A drizzly breakfast", alt: "Four friends sharing breakfast plates under a big umbrella in the drizzle" },
      { name: "aura-tea-estate", src: "/RIPE/10-days/06/aura-tea-estate.jpg", w: 1050, h: 1400, caption: "Tea estate walks", alt: "Walking single file through the rows of tea" },
      { name: "aura-biodiversity", src: "/RIPE/10-days/06/aura-biodiversity.jpg", w: 270, h: 480, caption: "Biodiversity walk with Pulkit", alt: "Pulkit on the biodiversity walk, down the red earth track between the trees", video: "/RIPE/10-days/06/aura-biodiversity.mp4" },
      { name: "ripe-bracelet", src: "/RIPE/10-days/06/ripe-bracelet.jpg", w: 1400, h: 1050, caption: "Flower bracelet", alt: "Tying a bracelet of flowers around a wrist" },
      { name: "aura-dinner-setup", src: "/RIPE/10-days/06/aura-dinner-setup.jpg", w: 1050, h: 1400, caption: "Dinner kept a secret", alt: "A long table set with leaf plates, petals and candles among the trees" },
      { name: "aura-ripe-dinner-02", src: "/RIPE/10-days/06/aura-ripe-dinner-02.jpg", w: 1080, h: 1350, caption: "Forest all around", alt: "String lights and an Aura banner over the dinner table at night" },
      { name: "aura-ripe-dinner-04", src: "/RIPE/10-days/06/aura-ripe-dinner-04.jpg", w: 1080, h: 1350, caption: "RIPE nights", alt: "A candle on a stone painted RIPE26, among the leaves" },
      { name: "aura-ripe-dinner-03", src: "/RIPE/10-days/06/aura-ripe-dinner-03.jpg", w: 1080, h: 1350, caption: "Shared tables on the estate", alt: "Guests at the long table under the string lights" },
      { name: "aura-ripe-dinner-05", src: "/RIPE/10-days/06/aura-ripe-dinner-05.jpg", w: 1080, h: 1350, caption: "Candlelit smiles", alt: "A guest smiling in the candlelight at the dinner table" },
    ],
  },
  {
    title: "See, feel & understand",
    art: { src: "/RIPE/10-days/titles/see-feel-understand.svg", w: 1999, h: 242 },
    day: "Part 7",
    bg: "/RIPE/10-days/backgrounds/ripe-07-bg.jpg",
    line: ["From cow to compost to soil to coffee.","Aura began to connect."],
    shots: [
      { name: "img-8104", src: "/RIPE/10-days/07/img-8104.jpg", w: 709, h: 480, caption: "Cow pat pit by Rao sir and Arun sir", alt: "Rao sir and Arun sir, in Aura tops, explaining the cow pat pit under a shelter", video: "/RIPE/10-days/07/img-8104.mp4" },
      { name: "aura-cow-to-compost", src: "/RIPE/10-days/07/aura-cow-to-compost.jpg", w: 853, h: 480, caption: "From cow to compost", alt: "Cows walking across the yard, on their way to becoming compost", video: "/RIPE/10-days/07/aura-cow-to-compost.mp4" },
      { name: "aura-cpp-hands-dirty", src: "/RIPE/10-days/07/aura-cpp-hands-dirty.jpg", w: 1080, h: 1350, caption: "Getting our hands dirty", alt: "Adults and a child mixing the compost by hand" },
      { name: "aura-cpp-03", src: "/RIPE/10-days/07/aura-cpp-03.jpg", w: 1080, h: 1350, caption: "Little hands in rhythm", alt: "A child reaching into the compost" },
      { name: "aura-cpp-feet", src: "/RIPE/10-days/07/aura-cpp-feet.gif", w: 355, h: 233, caption: "Treading the mix", alt: "Bare feet working the cow pat pit mix together on the ground" },
      { name: "aura-bd-magic", src: "/RIPE/10-days/07/aura-bd-magic.jpg", w: 1080, h: 1350, caption: "Biodynamic magic", alt: "A wooden box of biodynamic preparations" },
      { name: "aura-bd-magic-02", src: "/RIPE/10-days/07/aura-bd-magic-02.jpg", w: 1080, h: 1350, caption: "BD 502 in the palm", alt: "A preparation held in a cupped hand" },
      { name: "aura-cpp-06", src: "/RIPE/10-days/07/aura-cpp-06.jpg", w: 1080, h: 1350, caption: "Cow pat pit balls", alt: "Balls of compost drying on a mesh" },
      { name: "aura-cpp-07", src: "/RIPE/10-days/07/aura-cpp-07.jpg", w: 796, h: 750, caption: "New perspectives", alt: "Laughing during the compost session" },
      { name: "ripe-jeevamrit", src: "/RIPE/10-days/07/ripe-jeevamrit.jpg", w: 686, h: 576, caption: "Jeevamrit drums", alt: "Labelled drums of jeevamrit under a shelter" },
      { name: "aura-human", src: "/RIPE/10-days/07/aura-human.jpg", w: 646, h: 805, caption: "Barefoot", alt: "A man standing barefoot under the eaves, the forest behind" },
      { name: "aura-compost-hands", src: "/RIPE/10-days/07/aura-compost-hands.jpg", w: 646, h: 805, caption: "Into the earth", alt: "A man crouched barefoot, working the compost with his hands" },
      { name: "aura-tasting-estate", src: "/RIPE/10-days/07/aura-tasting-estate.jpg", w: 1022, h: 673, caption: "Coffee tasting", alt: "A tasting table set out under the trees" },
      { name: "aura-pour-over", src: "/RIPE/10-days/07/aura-pour-over.jpg", w: 1103, h: 720, caption: "The first pour", alt: "Hot water poured from a kettle into a paper dripper over a glass server", video: "/RIPE/10-days/07/aura-pour-over.mp4" },
      { name: "aura-tasting", src: "/RIPE/10-days/07/aura-tasting.jpg", w: 1015, h: 668, caption: "Slow pours", alt: "Two people pouring from kettles at the tasting" },
      { name: "img-8141", src: "/RIPE/10-days/07/img-8141.jpg", w: 270, h: 480, caption: "The coffee ritual", alt: "Pouring hot water over a pour-over dripper at the checked tasting table", video: "/RIPE/10-days/07/img-8141.mp4" },
      { name: "ripe-tasting", src: "/RIPE/10-days/07/ripe-tasting.jpg", w: 1050, h: 1400, caption: "Brewed on stone", alt: "A pour-over dripper set on a standing stone" },
    ],
  },
  {
    title: "Leaving something behind",
    art: { src: "/RIPE/10-days/titles/leaving-something-behind.svg", w: 2324, h: 242 },
    day: "Part 8",
    bg: "/RIPE/10-days/backgrounds/ripe-08-bg.jpg",
    line: ["Some things we leave behind are meant to grow."],
    shots: [
      { name: "ripe-planting", src: "/RIPE/10-days/08/ripe-planting.jpg", w: 270, h: 480, caption: "Ready to take root", alt: "Planting a young coffee sapling into the red earth", video: "/RIPE/10-days/08/ripe-planting.mp4" },
      { name: "ripe-energy", src: "/RIPE/10-days/08/ripe-energy.jpg", w: 1080, h: 1350, caption: "Carrying Aura", alt: "A guest holding up a young coffee plant" },
      { name: "ripe-planting-02", src: "/RIPE/10-days/08/ripe-planting-02.jpg", w: 1080, h: 1350, caption: "Planting together", alt: "An adult and a child planting a sapling, a basket beside them" },
      { name: "ripe-energy-02", src: "/RIPE/10-days/08/ripe-energy-02.jpg", w: 1080, h: 1350, caption: "Rooting in", alt: "Pressing a sapling into the soil" },
      { name: "ripe-energy-03", src: "/RIPE/10-days/08/ripe-energy-03.jpg", w: 1080, h: 1350, caption: "Hand in hand", alt: "Two people planting a coffee sapling together" },
      { name: "ripe-planting-03", src: "/RIPE/10-days/08/ripe-planting-03.jpg", w: 1080, h: 1350, caption: "Something left", alt: "A hand settling a coffee sapling into the red earth" },
      { name: "ripe-energy-04", src: "/RIPE/10-days/08/ripe-energy-04.jpg", w: 1080, h: 1350, caption: "Shared memories", alt: "A smiling guest crouched beside a newly planted sapling" },
      { name: "ripe-energy-05", src: "/RIPE/10-days/08/ripe-energy-05.jpg", w: 1080, h: 1350, caption: "Tagged and ready to grow", alt: "A smiling guest holding up a coffee sapling, its tag marked with a name and the date" },
      { name: "ripe-energy-06", src: "/RIPE/10-days/08/ripe-energy-06.jpg", w: 1080, h: 1350, caption: "A sapling, proudly held", alt: "A smiling guest in a striped waistcoat holding a coffee sapling in its paper sleeve" },
      { name: "aura-goodbyes", src: "/RIPE/10-days/08/aura-goodbyes.jpg", w: 1064, h: 705, caption: "Until next time", alt: "Everyone together in the studio for a last photograph" },
    ],
  },
]
