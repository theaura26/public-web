/* Natural Intelligence, and what it is practised as.
 *
 * These had pages of their own under /reason. They no longer do:
 * Natural Intelligence opens the Aura Intelligence chapter and
 * Agroculture opens The Plantation, both composed off this file by
 * lib/chapters.ts. Hospitality is gone from here entirely — it moved
 * into app/regenerative-life/sanctuary-and-stay/page.tsx as prose,
 * because that page is written rather than generated.
 *
 * Same shape as lib/disciplines.ts and rendered by the same component,
 * because a reader moving from Agroculture to Biodynamic should not
 * feel they have changed websites.
 *
 * Held to AURA_COFFEE/01_STRATEGY/claims-and-proof.md like everything
 * else: facts stated plainly, readings published as readings, and
 * anything not yet true kept in `open` rather than dressed up.
 */

export type Pillar = {
  id: string
  label: string
  slug: string
  lede: string
  /** Legacy flat run. Superseded by `movements`. */
  practice?: string[]
  /** The page as short movements, each with a heading, the visual that
   *  follows it, and optionally a tile grid or a revealing-text stanza. */
  movements?: {
    heading: string
    lines: string[]
    after?: { kind: 'banner' | 'plate' | 'portrait'; type: string; caption: string; alt?: string; ratio?: string }
    reveal?: string
    tiles?: { value: string; note: string }[]
  }[]
  record?: { value: string; label: string; note?: string }[]
  related?: { label: string; href: string }[]
  /** Drafting brief for the banner, until there is a photograph. */
  hero?: { type: string; caption: string }
  /** Drafting brief for the mid-page plate. */
  plate?: { type: string; caption: string }
  /** One line worth setting on its own. At most one per page. */
  quote?: string
  /** A tall breaker between the figures and the gaps. */
  breaker?: { caption: string; alt: string }
}

export const PILLARS: Pillar[] = [
  {
    id: 'natural-intelligence',
    label: 'Natural Intelligence',
    slug: 'natural-intelligence',
    lede: 'Read the land first, then build.',
    hero: { type: 'Landscape · old growth above the planting', caption: 'The oldest working intelligence on the estate' },
    plate: { type: 'Detail · a sensor and a leaf in one frame', caption: 'Machine, human, and the one that came first' },
    breaker: { caption: 'Three point eight billion years of field trials', alt: 'Old growth above the planting at Mudigere' },
    quote: 'The land has been computing longer than any machine. We just stopped reading the output.',
    movements: [
      {
        heading: 'Read the land first, then build.',
        lines: [
          'Natural Intelligence is Aura’s way of working. A forest that has held a slope for a thousand years has solved a problem, and the work is to read that solution before proposing one of our own.',
          'Nature is already wise. The gap is in our ability to observe what it does, remember it, learn from it and act at the right time — and closing that gap is the whole of the term.',
          'In practice it means measuring first. A canopy is read in lux before anyone cuts it. A preparation is plated before it is spread. A ferment is stopped by its pH. The instinct comes second, and it is a better instinct for having numbers under it.',
        ],
        after: { kind: 'banner', type: 'Landscape · old growth above the planting', caption: 'The oldest working intelligence on the estate', ratio: '16 / 9' },
      },
      {
        heading: 'Three studios, one way of working.',
        lines: [
          'It runs through three studios and the places they work in. Each takes the same posture into a different material.',
        ],
        tiles: [
          { value: 'Agroculture', note: 'Works it into 150 acres — canopy read in lux, fertility made on the estate, every event signed. [Agroculture](/regenerative-life/the-reason/agroculture).' },
          { value: 'Hospitality', note: 'Builds the rooms where a person can meet it, and runs them on the same clock as the farm. [Hospitality](/regenerative-life/the-reason/hospitality).' },
          { value: 'The Atelier', note: 'The taste layer: what is worth making at all, and what is good enough to leave here carrying the name. [The Atelier](/regenerative-life/artistry).' },
        ],
      },
      {
        heading: 'Why this is possible now.',
        lines: [
          'Three technologies converged: foundation models, robotics, and sensors cheap enough to leave outdoors through a monsoon. For the first time a landscape can be made machine-readable.',
          'Machine intelligence sits inside that rather than above it. There is a living layer, a human layer, and a physical layer of sensors and machines; natural intelligence is all of them read together, which is a larger thing than any model sitting in the middle of it.',
          'Three problems make it hard, and they are worth naming plainly. A landscape is difficult to capture at scale. Fewer people each year want to work in agriculture. And listening is a skill, so the open question is how a system learns to do it well.',
        ],
        after: { kind: 'plate', type: 'Detail · a sensor and a leaf in one frame', caption: 'Machine, human, and the one that came first', ratio: '16 / 9' },
      },
      {
        heading: 'What was lost, and what it costs to hold.',
        lines: [
          'The knowledge itself is old. Growing in balance was worked out thousands of years ago, in the same traditions this estate still farms by. What never happened was industrialising it.',
          'Agriculture was made simple by hiding its complexity. Fifty years ago the farmer was handed a box and told not to ask questions, and it worked until the land began to pay for it. Regeneration hands the complexity back, and something has to be able to hold it — [Aura Intelligence](/regenerative-life/aura-intelligence) is the machinery underneath.',
          'Aura is not certified organic or biodynamic. It practises both and publishes the record instead, which is the harder standard and the one a reader can check. The 32-acre tea block is in organic transition, targeting 2027, and the loop that is closed is the fertility loop — fuel, tools, packaging and labour come from outside.',
        ],
        after: { kind: 'portrait', type: 'Detail · a preparation plated before it is spread', caption: 'Measured before it is acted on, and after it is done', ratio: '4 / 5' },
      },
      {
        heading: 'The horizon it is measured against.',
        lines: [
          'Every decision is weighed against the year 3026, which changes what counts as a good one: the machine that listens beats the machine that acts, and the slow answer usually wins.',
          'Aura runs two sanctuaries, and one place proves a practice where two test it. Aura Estate at Mudigere is 150 acres under crop; Ohara, north of Kyoto, farms nothing at all. A way of working that holds in both is worth more than one that holds in either.',
          'The term is Aura’s own. It is defined here and then left alone, because it is meant to stay a way of working.',
        ],
        reveal: 'The land has been computing\nlonger than any machine.\nWe just stopped reading the output.',
      },
    ],
    related: [
      { label: 'Why Aura?', href: '/regenerative-life/the-reason' },
      { label: 'The Atelier', href: '/regenerative-life/artistry' },
      { label: 'The Moral Spine', href: '/wisdom' },
    ],
  },
  {
    id: 'agroculture',
    label: 'Agroculture',
    slug: 'agroculture',
    lede: 'Farming as though the land has to be worth more in a century.',
    hero: { type: 'Aerial · 150 acres at first light', caption: 'Sampigekhan Estate, Mudigere, at 3,600 ft in the Western Ghats' },
    plate: { type: 'Portrait · animal · the herd going out at dawn', caption: 'About fifty Malnad Gidda on the ground the coffee grows in' },
    breaker: { caption: 'A hundred and fifty acres, tended in decades', alt: 'The estate at Mudigere seen from the ridge' },
    quote: 'We do not buy fertility. We keep the animals that make it.',
    movements: [
      {
        heading: 'A forest that produces crops.',
        lines: [
          'Aura grows coffee, tea, pepper, areca and what the season gives, on 150 acres at 3,600 ft in the Western Ghats. Four hours up from Bengaluru the canopy closes over the road and the temperature drops six degrees; that is where the farm starts.',
          'Four storeys of canopy — emergent, canopy, understorey, ground — are maintained rather than cleared, and the coffee grows in the shade of them. Nothing is planted in rows in an open field.',
        ],
        after: { kind: 'banner', type: 'Aerial · 150 acres at first light', caption: 'Sampigekhan Estate, Mudigere, at 3,600 ft in the Western Ghats', ratio: '16 / 9' },
      },
      {
        heading: 'Fertility is made here.',
        lines: [
          'About fifty Malnad Gidda graze the ground the coffee grows in, and their dung becomes the biodynamic preparations and the Vedic brews — BD 500 through 508, Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal. All of it is brewed here, from here.',
          'The loop that is closed is the fertility loop. Fuel, tools, packaging and labour come from outside, so the estate is described as closed on fertility rather than closed outright.',
        ],
        after: { kind: 'plate', type: 'Process · the herd going out at dawn', caption: 'About fifty Malnad Gidda, grazing the ground the coffee grows in', ratio: '16 / 9' },
      },
      {
        heading: 'Measured before, measured after.',
        lines: [
          'A canopy is read in lux before a branch is cut. A batch is plated before it is spread, and the block is retested ninety days later against the batch number. A batch that fails is corrected or held, and the block waits.',
          'Everything is written down, and every event is signed by the person who did it — so a claim about a cup can be walked back to the block, the batch, and the morning it went on.',
        ],
        after: { kind: 'portrait', type: 'Detail · a lux reading taken under canopy', caption: 'Read before a branch is cut', ratio: '4 / 5' },
      },
      {
        heading: 'What is claimed, and what is not.',
        lines: [
          'Aura is not certified organic or biodynamic. It practises both and publishes the record instead, which is the harder standard and the one a reader can check. The 32-acre tea block is in organic transition, targeting 2027.',
          'None of these practices is unusual on its own. Doing all of them on the same ground, for decades, and publishing what happened is the part that is hard to copy.',
        ],
        reveal: 'We do not buy fertility.\nWe keep the animals that make it.',
      },
    ],
    related: [
      { label: 'Ecosystem Engineers', href: '/herd' },
      { label: 'Circular Intelligence', href: '/circular' },
      { label: 'The Land', href: '/land' },
    ],
  },
]
