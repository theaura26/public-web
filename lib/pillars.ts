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
    lede: 'The land has been computing longer than any machine. Aura’s work is to read the output.',
    breaker: { caption: 'Three point eight billion years of field trials', alt: 'Old growth above the planting at Mudigere' },
    hero: { type: 'Landscape · old growth above the planting', caption: 'The land has been computing longer than any machine' },
    plate: { type: 'Detail · sensor and leaf in one frame', caption: 'Three intelligences: machine, human, and the oldest one' },
    quote: 'The land has been computing longer than any machine. We just stopped reading the output.',
    practice: [
      'It is not a mystical claim. A forest that has held a slope for a thousand years has solved a problem, and the solution is legible if somebody bothers to measure it. Aura\u2019s position is that measuring is the respectful thing to do, not the reductive one.',
      'There are three intelligences at Aura: machine, human, and the oldest one. Natural Intelligence is the third — the accumulated problem-solving of a system that has been running field trials for 3.8 billion years without a break.',
      'It is practised in three places. Agroculture works it into 150 acres. Hospitality builds the rooms a person can meet it in. The Atelier is the taste layer — what is worth making at all, and what is good enough to leave here carrying the name.',
      'Reading the output means measurement. A canopy is read in lux before it is cut. A preparation is plated before it is spread. A ferment is stopped by its pH and not by the clock.',
      'The record is kept in plain formats and signed by the person who made it, so a reading can be checked by someone who was not there.',
    ],
    record: [
      { value: 'Three', label: 'intelligences: machine, human, and the oldest' },
      { value: '3.8bn', label: 'years of field trials, without a break' },
      { value: 'Nine', label: 'disciplines it is practised as' },
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
    lede: 'A hundred and fifty acres run on the assumption that the land should be worth more in a century than it is now.',
    hero: { type: 'Aerial · 150 acres at first light', caption: 'Sampigekhan Estate, Mudigere, at 3,600 ft in the Western Ghats' },
    plate: { type: 'Portrait · animal · the herd going out', caption: 'Fifty-two Malnad Gidda on the ground the coffee grows in' },
    breaker: { caption: 'A hundred and fifty acres, tended in decades', alt: 'The estate at Mudigere from the ridge' },
    quote: 'We do not buy fertility. We keep the animals that make it.',
    practice: [
      'Four hours up from Bengaluru the canopy closes over the road and the temperature drops six degrees. That is where the estate starts: 3,600 ft, red laterite, a hundred inches of rain a year, and a working farm underneath it.',
      'A hundred acres of shade-grown coffee and thirty-two of tea sit under four storeys of canopy — emergent, canopy, understorey, ground. The canopy is read in lux before any of it is cut, so pruning answers to a number.',
      'Fifty-two Malnad Gidda graze the same ground the coffee grows in. They are an indigenous breed of these hills, and every animal carries a record: health, milk and urine daily, dung logged each morning.',
      'Fertility is made here, from them. BD 500 through 508 and the Vedic set — Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal — are brewed on the estate and tested before and after. A batch that fails is corrected or held, and the block waits.',
      'None of that is unusual on its own. Doing all of it, on the same ground, and writing down what happened is the part that is hard to copy.',
    ],
    record: [
      { value: '150', label: 'Acres at Mudigere' },
      { value: '100 / 32', label: 'Acres of coffee / tea' },
      { value: '52', label: 'Malnad Gidda cattle' },
      { value: '3,600 ft', label: 'Altitude, in the Western Ghats' },
    ],
    open: [
      'Aura is not certified organic or biodynamic. It practises both and publishes the record instead, which is the harder of the two and the more useful.',
      'The 32-acre tea block is in organic transition targeting 2027 — an ambition with a date on it, stated as one.',
      'Fertility is not bought in. The estate as a whole is not closed: fuel, tools, packaging and labour all arrive from outside, and the closed-loop claim is made about fertility alone.',
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
    plate: { type: 'Landscape · Asa. Niwa. at Ohara', caption: 'The second sanctuary, north of Kyoto' },
    breaker: { caption: 'Nobody owns a mountain. You arrive as its guest', alt: 'Mist over the ridge at Mudigere' },
    quote: 'Morning mist. Nothing on the calendar. A cup of coffee that grew within sight of where you slept.',
    practice: [
      'Two places, and they are sanctuaries rather than hotels. Mudigere sits in the Western Ghats; Asa. Niwa. sits at Ohara, an hour north of Kyoto. Different countries, different buildings, and one thing in common: neither was built to be looked at.',
      'What a guest gets is the working day. The barrels being stirred at dawn, the herd going out, the lamp lit at the Gau Angan before anyone starts. Nothing is staged for the room, because the room is in the middle of it.',
      'The offer is a rhythm — morning mist, an empty calendar, a hike through four canopy layers before the light, a long table outside where almost everything grew within sight of where you are sitting.',
      'Three times a year the estate opens properly, for the festival: three days, twenty places, and you leave having set the protocol for a lot of coffee that is then built and shipped under your own name.',
      'Two more sanctuaries are named. Munduk in Bali and Punakha in Bhutan are on the map and not yet open.',
    ],
    record: [
      { value: 'Two', label: 'Sanctuaries open: Mudigere and Ohara' },
      { value: 'Two', label: 'Announced and not yet open: Munduk, Punakha' },
      { value: 'Twenty', label: 'Places at the festival, three times a year' },
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
