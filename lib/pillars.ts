/* Natural Intelligence, and the three things it is practised as.
 *
 * The Reason argues the idea; these pages say what the idea does on a
 * Tuesday. Same shape as lib/disciplines.ts and rendered by the same
 * component, because a reader moving from Agroculture to Biodynamic
 * should not feel they have changed websites.
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
  practice: string[]
  record?: { value: string; label: string; note?: string }[]
  open: string[]
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
    practice: [
      'Natural Intelligence is Aura’s way of working. A forest that has held a slope for a thousand years has solved a problem; the work is to read that solution before proposing one of our own.',
      'In practice it means measuring first. A canopy is read in lux before anyone cuts it. A preparation is plated before it is spread. A ferment is stopped by its pH. The instinct comes second, and it is a better instinct for having numbers under it.',
      'It runs through three studios and three places. Agroculture works it into 150 acres. Hospitality builds the rooms where a person can meet it. The Atelier is the taste layer — what is worth making at all, and what is good enough to leave here carrying the name.',
      'And it sets the horizon. Every decision is weighed against the year 3026, which changes what counts as a good one: the machine that listens beats the machine that acts, and the slow answer usually wins.',
    ],
    open: [
      'Natural Intelligence is Aura’s own term. It is defined once, here, and then left alone — the estate would rather it stayed a working idea than became a slogan.',
    ],
    related: [
      { label: 'Why Aura?', href: '/reason' },
      { label: 'The Atelier', href: '/atelier' },
      { label: 'The Moral Spine', href: '/wisdom' },
    ],
  },
  {
    id: 'agroculture',
    label: 'Agroculture',
    slug: 'agroculture',
    lede: 'Farming as though the land has to be worth more in a century.',
    hero: { type: 'Aerial · 150 acres at first light', caption: 'Sampigekhan Estate, Mudigere, at 3,600 ft in the Western Ghats' },
    plate: { type: 'Portrait · animal · the herd going out at dawn', caption: 'Fifty-two Malnad Gidda on the ground the coffee grows in' },
    breaker: { caption: 'A hundred and fifty acres, tended in decades', alt: 'The estate at Mudigere seen from the ridge' },
    quote: 'We do not buy fertility. We keep the animals that make it.',
    practice: [
      'Aura grows coffee, tea, pepper, areca and what the season gives, on 150 acres at 3,600 ft in the Western Ghats. Four hours up from Bengaluru the canopy closes over the road and the temperature drops six degrees; that is where the farm starts.',
      'The work is a forest that produces crops. Four storeys of canopy — emergent, canopy, understorey, ground — are maintained rather than cleared, and the coffee grows in the shade of them. Nothing is planted in rows in an open field.',
      'Aura makes its own fertility. Fifty-two Malnad Gidda graze the ground the coffee grows in, and their dung becomes the biodynamic preparations and the Vedic brews — BD 500 through 508, Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal. All of it is brewed here, from here.',
      'Everything is measured before it is acted on and after it is done. A canopy is read in lux before a branch is cut. A batch is plated before it is spread and the block is retested ninety days later against the batch number. A batch that fails is corrected or held, and the block waits.',
      'And everything is written down. Every event is signed by the person who did it, so a claim about a cup can be walked back to the block, the batch, and the morning it went on.',
      'None of those is unusual alone. Doing all of them on the same ground, for decades, and publishing what happened is the part that is hard to copy.',
    ],
    open: [
      'Aura is not certified organic or biodynamic. It practises both and publishes the record instead.',
      'The 32-acre tea block is in organic transition, targeting 2027.',
      'The closed loop is about fertility. Fuel, tools, packaging and labour all come from outside, and calling the whole estate closed would be untrue.',
    ],
    related: [
      { label: 'Ecosystem Engineers', href: '/herd' },
      { label: 'Circular Intelligence', href: '/circular' },
      { label: 'The Land', href: '/land' },
    ],
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    slug: 'hospitality',
    lede: 'Places that hold the right kind of attention.',
    hero: { type: 'Architecture · a room open to the mist', caption: 'Morning at Mudigere, with nothing on the calendar' },
    plate: { type: 'Landscape · Asa. Niwa. at Ohara', caption: 'The second sanctuary, an hour north of Kyoto' },
    breaker: { caption: 'Nobody owns a mountain. You arrive as its guest', alt: 'Mist over the ridge at Mudigere' },
    quote: 'Morning mist. Nothing on the calendar. A cup of coffee that grew within sight of where you slept.',
    practice: [
      'Aura builds and runs sanctuaries. Two are open: Mudigere, a working coffee estate in the Western Ghats, and Asa. Niwa. at Ohara, an hour north of Kyoto. Munduk in Bali and Punakha in Bhutan are named and not yet built.',
      'The work is the room and everything under it — architecture, kitchen, the residency programme, and the operations that keep all three running for decades. The soil under the building is part of the brief.',
      'What a guest gets is the working day rather than a version staged for them. The barrels being stirred at dawn, the herd going out, the lamp lit at the Gau Angan before anyone starts. The room sits in the middle of a farm that would be doing this anyway.',
      'Three times a year the estate opens properly, for the festival: three days, twenty places, and a guest leaves having set the protocol for a lot of coffee that is then built and shipped under their own name.',
      'And the residency runs alongside it — invited, embedded, for people making work that needs a place like this to be made in.',
    ],
    open: [
      'Munduk and Punakha are announced. Dates, rooms and rates arrive when they are settled, and none of them is.',
      'Aura publishes no occupancy, rates or guest numbers. When the sanctuaries open properly, those belong here.',
    ],
    related: [
      { label: 'Mudigere', href: '/mudigere' },
      { label: 'Asa. Niwa.', href: '/ohara' },
      { label: 'Monastic Polymaths', href: '/residency' },
    ],
  },
]

export function pillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug)
}
