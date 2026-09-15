/* ═══════════════════════════════════════════════════════════════════
   RIPE — the page's words.

   Every string here is taken verbatim from the design file:
   AURA // Coffee Festival (the Figma file's name), page Web, node 857:42.
   See design/coffee-festival/SPEC.md and nodes.json.

   Nothing in this file is drafted or invented. Where the design is
   wrong it is reproduced and flagged rather than silently corrected —
   there is one of those, marked below.
═══════════════════════════════════════════════════════════════════ */

export const BRAND = {
  /* Two lines, because the design breaks it explicitly: the text node
     carries a U+2028 line separator after "Right Time" rather than
     letting the measure decide. */
  tagline: ['Right Time', 'made visible.'],
  meta: 'Mudigere · Harvest 2026',
} as const

/* A run of copy. A bare string is white; { g } is the brand green.
   Both sequences below are transcribed from the styled text segments of
   their nodes, so the accented words are the design's own choice of
   which words to lift rather than mine. */
export type Run = string | { g: string }

/* Node 861:331 — 60px, x179 y1239, 1453 wide. */
export const OPENING: Run[] = [
  'Some things cannot be ', { g: 'hurried' },
  '. A cherry. A ferment.  A field. An idea. A relationship. You create the conditions. You pay ',
  { g: 'attention' },
  '. And eventually there is a moment when something becomes ',
  { g: 'ready' }, '.',
]

/* Node 857:212 — 22px, x179 y1718, 635 wide. */
export const INTRO: Run[] = [
  { g: 'This September, ' },
  'we come together at Aura just as the estate moves towards harvest.\n',
  { g: 'Friends of Aura' }, ' begin arriving on the 20th.\n',
  { g: 'Boojee' }, ', ', { g: 'Besst' }, ' and ', { g: 'Studio 6158' },
  ' join us on the 24th.\n'
  + 'For a few days, we walk, taste, make, ask questions, get our hands dirty, eat ',
  { g: 'together ' },
  'and spend time in good ',
  { g: 'company.\n' },
  'Then ',
  { g: 'harvest' },
  ' begins.',
]

/* Node 861:332 — 550x378 at x1228 y1651, beside the intro. */
export const OPENING_MARK = {
  src: '/RIPE/aura-cow.png', w: 550, h: 378,
  alt: 'A line drawing of a calf',
}

export const NAV = [
  { id: 'rhythm',   label: 'THE RHYTHM' },
  { id: 'prepared', label: 'COME PREPARED' },
  { id: 'gratitude',label: 'GIVE GRATITUDE' },
  { id: 'remember', label: 'MAKE MEMORIES' },
] as const

/* ── The days ────────────────────────────────────────────────────
   Ten beats down one spine. A beat carries any of: a photograph, the
   60px title that overlaps it, a handwritten line laid over the
   picture, and the day's programme in the right-hand column.

   The pairing of photograph to beat is taken from the layer names in
   the prepared Figma file, which record which picture sits with which
   day. */
export type Beat = {
  title: string
  /** Photograph for this beat, if it carries one. */
  image?: string
  alt?: string
  /** Full-bleed rather than held in the centre column. */
  bleed?: boolean
  /** Title in the brand green. Two of the ten are, per the node fills:
      Friends of Aura, and In Good Company. */
  green?: boolean
  /** The handwritten line laid over the picture. */
  quote?: string
  /** Where that line sits, taken from the frame: qx is a percentage of
      the viewport, qy a percentage down the picture. They are scattered
      in the design rather than set on a grid, so each is its own pair. */
  qx?: number
  qy?: number
  /** Right column: the date, then the day's programme as a list. */
  date?: string
  lead?: string
  list?: string[]
  /** Right column prose with no date above it. */
  prose?: string[]
}

export const BEATS: Beat[] = [
  {
    title: 'Friends of Aura',
    green: true,
    image: '/RIPE/aura-friends-of-aura.jpg',
    alt: 'The estate seen from above, buildings held inside the canopy',
    prose: [
      'Welcome, friends.',
      'Before everyone comes together, Aura begins to fill slowly.',
      'Friends arrive from Singapore and different parts of India. There is no need to rush into a programme. These days are for finding the place.',
    ],
  },
  {
    title: 'Come in',
    quote: 'Good to be here.', qx: 45.26,
    date: '20 SEPTEMBER',
    list: [
      'Arrive.', 'Coffee.', 'Find your room.', 'Walk.',
      'Meet whoever is around.', 'Eat together.', 'Sit by the fire.',
      'Let Aura introduce itself.',
    ],
  },
  {
    title: 'Find your rhythm',
    image: '/RIPE/aura-find-your-rhythm.jpg',
    alt: 'Indigenous cattle feeding together at the estate',
    quote: 'I’m beginning to understand this place.', qx: 47.86, qy: 69.7,
    date: '21 SEPTEMBER',
    list: [
      'Wake early if you want to.', 'Follow the cows.',
      'Walk with someone from the estate.', 'Find coffee somewhere.',
      'Spend time in the field.', 'Eat.', 'Talk.',
      'Do nothing for a while.', 'There is no need to see everything.',
    ],
  },
  {
    title: 'Get closer',
    quote: 'I’m starting to become part of the place.', qx: 48.59,
    date: '22 SEPTEMBER',
    list: [
      'Spend more time with the people of Aura.', 'Help make something.',
      'Walk deeper into the estate.', 'Join what is already happening.',
      'By the time everyone else arrives, Aura should feel a little less like somewhere you are visiting.',
    ],
  },
  {
    title: 'In Good Company',
    green: true,
    image: '/RIPE/aura-company-comes-closer.jpg',
    alt: 'A group sitting together on a ridge under a tree at dusk',
    quote: '24 September 2026', qx: 51.67, qy: 45.6,
    prose: [
      'Boojee, Besst and Studio 6158 arrive.',
      'The full tribe comes together for the first time.',
      'Three days of walking, tasting, making and eating together begin here.',
    ],
  },
  {
    title: 'Arrive & Exhale',
    image: '/RIPE/aura-arrive-exhale.jpg',
    alt: 'Coffee cherries holding a bead of water against an open sky',
    quote: 'I am somewhere special.', qx: 42.29, qy: 67.4,
    date: '24 SEPTEMBER',
    lead: 'Now we slow the pace. Not to do less. To notice more.',
    list: ['Check in and settle.', 'High tea. Welcome into Aura.', 'Bonfire and dinner.', 'Season RIPE: the route for the three days ahead.', 'An icebreaker.'],
  },
  {
    title: 'See & Feel',
    image: '/RIPE/aura-see-and-feel.jpg',
    alt: 'Pale lichen and a young seedling in red laterite soil',
    quote: 'There is so much happening here.', qx: 59.9, qy: 11.2,
    date: '25 SEPTEMBER',
    lead: 'The first day belongs to noticing. Not only coffee. What grows above it. What lives beneath it. What moves through it. And the people who care for it.',
    list: [
      'A walk through the tea, if you like.', 'Breakfast on the estate.',
      'Frame walk and cherry picking.', 'Lunch outdoors.',
      'Biodiversity discovery walk.', 'Honey bees and pollination.',
      'Coffee cupping.', 'Free time.',
    ],
  },
  {
    title: 'White. Indigo. Or both.',
    /* The indigo botanical print, which is what the line is about. The
       node's source image is 2.5MB at 1672x941 — aura-indigo.jpg, not
       the cherry banner it was first built with. */
    image: '/RIPE/aura-indigo-1920.jpg',
    alt: 'An indigo botanical print on cream paper',
    bleed: true,
    date: '25 SEPTEMBER · EVENING',
    list: [
      'A simple visual thread for the one evening everyone is together. Dress for it.',
      'Bonfire and dinner in front of the bungalow.',
      'Tonight, just good company.',
    ],
  },
  {
    title: 'Understand',
    image: '/RIPE/aura-understand.jpg',
    alt: 'Hands deep in wet compost at the estate heap',
    quote: 'Now I understand how it connects.', qx: 56.46, qy: 76.4,
    date: '26 SEPTEMBER',
    lead: 'Cow to soil. Soil to tree. Tree to harvest. Observation to memory. Memory to better decisions.',
    list: [
      'Breakfast by the chef.', 'BD 500, CPP and soil biology.',
      'Stir it. Smell it. Hold it.', 'Lunch together.', 'Free time.',
      'The Hungry Soil experiment.', 'Live kitchen by the fire.',
    ],
  },
  {
    title: 'Make It Yours',
    image: '/RIPE/aura-make-it-yours.jpg',
    alt: 'Hands working together at the estate window',
    quote: 'I was part of Aura.', qx: 56.46, qy: 42.7,
    date: '27 SEPTEMBER',
    lead: 'Plant something. Make something. Leave something behind. Take something with you.',
    list: ['Plant Your Tree.', 'Coffee and breakfast.', 'Temple time.', 'Lunch and goodbyes.'],
  },
]

/* ── Two arcs ────────────────────────────────────────────────────── */
export const ARCS = {
  title: 'RIPE moves through two journeys.',
  note: [
    'The days have structure. They also have room.',
    'Weather may move things. The estate may move things. Something unexpected may become more interesting than something we planned.',
  ],
  columns: [
    { id: 'foa', label: 'Journey 01', title: 'FRIENDS OF AURA', dates: '20–27 SEPTEMBER' },
    { id: 'igc', label: 'Journey 02', title: 'IN GOOD COMPANY', dates: '24–27 SEPTEMBER', members: 'Boojee · Besst · Studio 6158' },
  ],
}

/* ── Come prepared ───────────────────────────────────────────────── */
export const PREPARED = {
  /* Five of its phrases are lifted into the green — the verbs. */
  lead: [
    'This is a working estate. ', { g: 'Walk' }, '. Explore.  ',
    { g: 'Get your hands dirty. ' }, 'Taste. ', { g: 'Create.' }, ' Pause.  ',
    { g: 'Ask.' }, ' Notice. ', { g: 'Discover.' },
  ] as Run[],
  showUp: {
    title: 'How to show up',
    cards: [
      { title: 'Come curious', body: 'Ask the obvious question.  It is often the useful one.' },
      { title: 'Participate', body: 'Touch. Taste. Make. Try. Discuss. Share.' },
      { title: 'Notice first', body: 'Look before photographing.  Observe before asking for the answer.' },
      { title: 'Let the day move', body: 'Weather and the estate may change the plan. We go with it.' },
      { title: 'Respect the working farm', body: 'The people, animals and land are not here for our visit. We are entering something already alive.' },
      { title: 'Bring what you know', body: 'Coffee. Food. Technology. Plants. Design. Storytelling. People. Everyone coming knows something somebody else does not.' },
    ],
  },
  bring: {
    title: 'What to bring',
    mark: { src: '/RIPE/aura-cap.png', w: 475, h: 379, alt: 'A line drawing of a field cap' },
    cards: [
      {
        title: 'Field',
        list: ['Comfortable outdoor clothes', 'Full-length trousers', 'Closed walking shoes',
               'Cap or hat', 'Sunscreen', 'Insect repellent', 'Water bottle', 'Small towel', 'Rain protection'],
      },
      {
        title: 'An evening to remember',
        note: 'For 25 September: white, indigo, or both.',
        list: ['It is the one evening the whole tribe is together, around the fire in front of the bungalow, so dress for it. Something smart-casual you feel good in, with a light jacket or shawl for when the air cools'],
      },
      { title: 'Useful', list: ['Phone', 'Charger', 'Power bank'] },
      /* Sits under Evening in the second column, not under Field. */
      { title: 'Be a creator', body: 'One old outfit that can get dirty or stained. And anything you would like to make with: photos, a journal, stationery, ideas.', column: 2 },
    ],
  },
}

/* ── Closing ─────────────────────────────────────────────────────── */
export const CLOSING = {
  title: 'With Boojee, Besst and Studio 6158.',
  pairs: [
    'Friends with friends.', 'Coffee with shade.', 'Roots with fungi.',
    'Cows with soil.', 'Food with season.', 'Knowledge with memory.',
    'And all of us with the land.',
  ],
  /* Was an SVG of the same words. Set as type it takes the hand role the
     rest of the page uses, at the same size as every other line in it,
     and it can be written on the way the beat quotes are. */
  hand: 'Nothing here grows alone.',
}

/* ── Gratitude ───────────────────────────────────────────────────── */
export const GRATITUDE = {
  title: 'Harvest begins with gratitude.',
  body: [
    'Prayer belongs to the beginning of harvest.',
    'It is not a performance. It is not an activity.',
    'It is a moment to acknowledge what the land has given before we begin taking from it.',
    'Guests may be invited to participate where appropriate.',
    'Mostly, we listen.',
  ],
}

/* ── Remember ────────────────────────────────────────────────────── */
export const REMEMBER = {
  title: 'What should Aura remember from today?',
  body: [
    'Every evening, one question.',
    'It may be answered with a sentence, a photograph, something learned, something funny, something small, something we should change, something we should never change.',
    'The gathering should leave more than photographs behind. It should leave memory.',
  ],
  form: {
    legend: 'Your memory',
    placeholder: 'A sentence, observation, or something that happened today...',
    name: 'Your Name (optional)',
    tree: 'Tree connection (optional)',
    photo: 'Add a photograph (optional)',
    submit: 'add memory',
    note: 'Memories added here stay with this page for now — nothing is sent anywhere yet.',
  },
  shots: [
    { src: '/RIPE/aura-remember-01.png', w: 512, h: 546,
      caption: 'Where the magic happens.',
      alt: 'A polaroid of the estate crew' },
    { src: '/RIPE/aura-remember-02.png', w: 500, h: 543,
      caption: 'Mornings with nothing on the calendar.',
      alt: 'A polaroid of two people walking a forest path' },
  ],
}

/* ── Tree registry ───────────────────────────────────────────────── */
export const REGISTRY = {
  /* The page's last line. What followed it — the planting paragraph and
     the registry table — was removed in the clean-up pass. */
  title: 'The days end. The memories we make together stay.',
  mark: { src: '/RIPE/aura-tree.png', w: 900, h: 1100, alt: 'An illustration of a flowering coffee plant' },
}

/* ── The harvest ─────────────────────────────────────────────────── */
/* Not on the page. Kept, with RipeHarvest, to switch on later. */
export const HARVEST = {
  title: 'The gathering finishes on 27 Sep 2026, but the harvest does not.',
  from: 'From here Aura moves through the entire remarkable circle.',
  body: 'RIPE continues with the harvest until February. What happened to the coffee. What became a lot. What tasted extraordinary. What failed. What changed. What we learned. What still needs another season.',
  /* The two months a visit can be booked for, each with what the estate
     is doing then. The form offers the same two. */
  windows: [
    { month: 'NOVEMBER', line: 'The harvest in full. Cherries come in block by block, and every lot begins its own record.' },
    { month: 'JANUARY', line: 'The lots are cupped and chosen. What tasted extraordinary, and what the season taught.' },
  ],
  cta: 'Book your experience',
}

/* ── Read more about Aura ────────────────────────────────────────── */
/* After RIPE ends. Six published stories that go further into what the
   days touch: living systems, ṛta, the herd, circularity, biodynamics
   and the coffee. Titles, pictures and links come from lib/journals. */
export const READ_MORE = {
  title: 'Discover Aura',
  hrefs: ['/living-systems', '/rta', '/herd', '/circular', '/biodynamic', '/coffee'],
}
