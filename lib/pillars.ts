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
}

export const PILLARS: Pillar[] = [
  {
    id: 'natural-intelligence',
    label: 'Natural Intelligence',
    slug: 'natural-intelligence',
    lede: 'The land has been computing longer than any machine. Aura’s work is to read the output.',
    hero: { type: 'Landscape · old growth above the planting', caption: 'The land has been computing longer than any machine' },
    plate: { type: 'Detail · sensor and leaf in one frame', caption: 'Three intelligences: machine, human, and the oldest one' },
    quote: 'The land has been computing longer than any machine. We just stopped reading the output.',
    practice: [
      'There are three intelligences at Aura: machine, human, and the oldest one. Natural Intelligence is the third — the accumulated problem-solving of a system that has been running field trials for 3.8 billion years without a break.',
      'It is practised in three places. Agroculture works it into 150 acres. Hospitality builds the rooms a person can meet it in. The Atelier turns what is learned into things that leave the estate.',
      'Reading the output means measurement. A canopy is read in lux before it is cut. A preparation is plated before it is spread. A ferment is stopped by its pH and not by the clock.',
      'The record is kept in plain formats and signed by the person who made it, so a reading can be checked by someone who was not there.',
    ],
    open: [
      'Natural Intelligence is Aura’s own term. It is defined once, here, and then left alone — the estate would rather it stayed a working idea than became a slogan.',
    ],
    related: [
      { label: 'Why Aura?', href: '/reason' },
      { label: 'The Moral Spine', href: '/wisdom' },
    ],
  },
  {
    id: 'agroculture',
    label: 'Agroculture',
    slug: 'agroculture',
    lede: 'One hundred and fifty acres that are meant to be worth more in a hundred years than they are now.',
    hero: { type: 'Aerial · 150 acres at sunrise', caption: 'Sampigekhan Estate, Mudigere, at 3,600 ft in the Western Ghats' },
    plate: { type: 'Portrait · animal · the herd going out', caption: 'Fifty-two Malnad Gidda on the ground the coffee grows in' },
    quote: 'Aura is not certified organic or biodynamic. It practises both, and publishes the record instead.',
    practice: [
      'Sampigekhan Estate sits at 3,600 ft at Mudigere, in Chikmagalur district, Karnataka — 100 acres under shade-grown coffee, 32 under tea, on red laterite held between pH 6.0 and 6.5.',
      'A four-storey canopy — emergent, canopy, understorey, ground — is maintained across it, and read in lux before any of it is cut.',
      'Fifty-two Malnad Gidda cattle, an indigenous breed of these hills, graze the same ground the coffee grows in. Every animal carries a passport: health, milk and urine daily, dung logged per herd each morning.',
      'Fertility is made here. BD 500 through 508 and the Vedic set — Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal — are brewed from the herd and tested before and after.',
      'A batch that fails a test is corrected or held. No untested material touches the soil.',
    ],
    record: [
      { value: '150', label: 'acres at Mudigere' },
      { value: '100 / 32', label: 'acres of coffee / tea' },
      { value: '52', label: 'Malnad Gidda cattle' },
      { value: '3,600 ft', label: 'altitude, Western Ghats' },
    ],
    open: [
      'Aura is not certified organic or biodynamic. It practises both and publishes the record instead — which is the harder of the two things to do.',
      'The 32-acre tea block is in organic transition, targeting 2027. That is an ambition with a date on it, and is stated as one.',
      'Fertility is not bought in. The estate as a whole is not closed: fuel, tools, packaging and labour all come from outside, and the closed loop claim is made about fertility only.',
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
    lede: 'A working farm you can sleep on, where the coffee grew within sight of the bed.',
    hero: { type: 'Architecture · a room open to the mist', caption: 'Morning at Mudigere, with nothing on the calendar' },
    plate: { type: 'Landscape · Asa. Niwa. at Ohara', caption: 'The second sanctuary, in Kyoto' },
    practice: [
      'Hospitality at Aura is a sanctuary rather than a hotel: Mudigere in the Western Ghats, and Asa. Niwa. at Ohara in Kyoto.',
      'The offer is a rhythm rather than an itinerary — morning mist, nothing on the calendar, and a cup of coffee that grew within sight of where you slept.',
      'The estate is not staged for visitors. What a guest sees is the working day: the preparations being stirred, the herd going out, the lamp lit at the Gau Angan before anyone starts.',
      'Two more sanctuaries are named and not yet open — Munduk in Bali and Punakha in Bhutan.',
    ],
    open: [
      'Munduk and Punakha are announced, not bookable. No dates, rooms or rates are published for either, because none are settled.',
      'Aura publishes no occupancy, rates or guest numbers. When the sanctuaries open properly, those belong here.',
    ],
    related: [
      { label: 'Mudigere', href: '/mudigere' },
      { label: 'Asa. Niwa.', href: '/ohara' },
      { label: 'Monastic Polymaths', href: '/residency' },
    ],
  },
]

export const PILLAR_SLUGS = PILLARS.map((p) => p.slug)

export function pillarBySlug(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug)
}
