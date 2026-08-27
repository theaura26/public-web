/* The nine disciplines, in one place.
 *
 * The Remarkable Circle draws them, the menu lists them, and each one has
 * a page. All three read this file, so the ring and the site cannot come
 * to disagree about what the nine are or what order they sit in.
 *
 * ── On the content ──────────────────────────────────────────────────
 * Every line below is held to AURA_COFFEE/01_STRATEGY/claims-and-proof.md,
 * which classifies each claim the estate makes and says whether it may be
 * published. Three rules come out of that document and are followed here
 * without exception:
 *
 *   1. A fact has a record behind it. It is stated plainly.
 *   2. A reading of facts is published as a reading — "our own readings",
 *      "we believe" — never as a demonstrated result.
 *   3. Something not yet true is future tense, or it is in `open`.
 *
 * `open` is not an apology. The microsite devotes a whole act to what
 * Aura cannot prove, and it is the most persuasive part of the argument:
 * a farm that publishes its gaps is telling you the rest of the numbers
 * are real. Where a discipline has little record behind it, the page is
 * short and says so. Padding it would be the one thing that discredits
 * the eight that are well documented.
 */

export type Discipline = {
  /** Matches the glyph id on the Remarkable Circle. */
  id: string
  /** How the menu and the page title name it. */
  label: string
  /** Under /regenerative-life. */
  slug: string
  /** In /public/glyphs/coffee. */
  glyph: string
  /** One line: what this discipline is. */
  lede: string
  /** What is actually done. Facts, with records behind them. */
  practice: string[]
  /** Figures worth pulling out. `note` qualifies where the record does. */
  record?: { value: string; label: string; note?: string }[]
  /** Not yet proven, not yet running, or true only as a reading. */
  open: string[]
  /** Drafting brief for the banner, until there is a photograph. */
  hero?: { type: string; caption: string }
  /** Drafting brief for the mid-page plate. */
  plate?: { type: string; caption: string }
  /** One line worth setting on its own. At most one per page. */
  quote?: string
  /** Where to read more, on pages that already exist. */
  related?: { label: string; href: string }[]
}

/** Clockwise from the top of the ring. */
export const DISCIPLINES: Discipline[] = [
  {
    id: 'biodynamic',
    label: 'Biodynamic',
    slug: 'biodynamic',
    glyph: 'aura-biodynamic-glyph.svg',
    lede: 'The preparations are made on the estate, and tested before they are allowed to touch the soil.',
    hero: { type: 'Process · stirring the barrel at dawn', caption: 'Forty-five minutes a day, vortex and reverse — Sampigekhan Estate' },
    plate: { type: 'Detail · a numbered pit opened at ninety days', caption: 'Fourteen pits, each one numbered, each batch traceable to the block it went on' },
    quote: 'A batch that fails is corrected or held. No untested material touches the soil.',
    practice: [
      'BD 500 through 508 are prepared here and applied to the blocks on a calendar built for 150 acres.',
      'Barrels are stirred by hand for about forty-five minutes a day, vortex and reverse.',
      'Cow pat pit matures for ninety days. The other preparations run sixty- to ninety-day cycles.',
      'Every batch is tested before and after it is made — pH, electrical conductivity, microbial colony counts, Trichoderma, Pseudomonas.',
      'A batch that fails is corrected or held back. No untested material touches the soil.',
      'The block is tested again ninety days after application, and the result is cross-referenced to the batch number that went on it.',
    ],
    record: [
      { value: '14', label: 'numbered cow pat pits' },
      { value: '90 days', label: 'to mature a pit' },
      { value: '45 min', label: 'stirred daily, vortex and reverse' },
      { value: '2,420 kg', label: 'of CPP a year', note: 'Volume planned against the calendar; actual against planned is being confirmed.' },
    ],
    open: [
      'Aura is not certified biodynamic. It practises the system and publishes the record instead.',
      'The lunar calendar sets the timing. The reason for keeping these preparations is the biology, not the cosmology — the charts are a schedule, and Aura has said so in print rather than leaving the impression of a belief it does not hold.',
      'Chromatography is run as a soil-vitality image. It is a qualitative indicator and is published as a practice, never as evidence of an outcome.',
    ],
    related: [
      { label: 'A living organism', href: '/biodynamic' },
      { label: 'Circular Intelligence', href: '/circular' },
    ],
  },
  {
    id: 'soil',
    label: 'Soil',
    slug: 'soil',
    glyph: 'aura-soil-glyph.svg',
    lede: 'Coffee does not begin with coffee. It begins about a metre underground.',
    hero: { type: 'Detail · red laterite in the hand', caption: 'Held between pH 6.0 and 6.5, at 3,600 ft' },
    plate: { type: 'Process · respiration sampling at 0–15 cm', caption: 'Read monthly, by the NaOH method' },
    quote: 'Coffee does not begin with coffee. It begins about a metre underground.',
    practice: [
      'Red laterite, held between pH 6.0 and 6.5.',
      'Soil respiration is read monthly by the NaOH method, at 0–15 cm.',
      'Every block is retested ninety days after a preparation goes on it, against the batch that was applied.',
      'Woody biomass is cut to 60–90 cm and left in the block to decay rather than removed. Decay classes I to V are logged as it goes.',
    ],
    record: [
      { value: '6.0–6.5', label: 'soil pH, red laterite' },
      { value: '3,600 ft', label: 'altitude' },
      { value: '0–15 cm', label: 'respiration sampling depth, read monthly' },
    ],
    open: [
      'Fourteen monitoring programmes are designed for the estate. Which of them run on every block, and which are designed but not yet running, is being confirmed block by block — so no claim is made here about full-estate coverage.',
    ],
    related: [{ label: 'The Health Index', href: '/ecology' }],
  },
  {
    id: 'microbiome',
    label: 'Microbiome',
    slug: 'microbiome',
    glyph: 'aura-microbiome-glyph.svg',
    lede: 'The part of the farm nobody can see, counted anyway.',
    hero: { type: 'Detail · plated colonies in the estate lab', caption: 'Every batch counted before and after it is made' },
    plate: { type: 'Process · a pH reading during ferment', caption: 'Every fifteen minutes, until it reaches 4.2' },
    quote: 'The ferment is stopped by a number, not by the clock.',
    practice: [
      'Every preparation batch is plated before and after: colony counts, Trichoderma, Pseudomonas.',
      'Mycorrhizal colonisation is assessed once a year.',
      'In the wet mill the ferment is tracked hour by hour — pH every fifteen minutes, temperature three times a day, Brix at the start, the middle and the end. It ends at pH 4.2.',
    ],
    record: [
      { value: '15 min', label: 'between pH readings through a ferment' },
      { value: 'pH 4.2', label: 'where a ferment is stopped' },
      { value: 'Annual', label: 'mycorrhizal colonisation assessment' },
    ],
    open: [
      'The herd is an indigenous breed because Aura believes a gut microbiome follows the ground it grazes. No metagenomic comparison against another breed has been run, so that stays a reading rather than a result.',
      'The wild yeasts and lactic-acid bacteria that drive a coffee ferment are well described in the literature. Aura has not identified the species on this estate — what it tracks is the ferment’s behaviour, not its species list.',
    ],
    related: [
      { label: 'Fermentation', href: '/fermentation' },
      { label: 'Circular Intelligence', href: '/circular' },
    ],
  },
  {
    id: 'pathology',
    label: 'Plant Pathology',
    slug: 'plant-pathology',
    glyph: 'aura-pathology-glyph.svg',
    lede: 'Keeping a plant well, rather than treating it once it is sick.',
    hero: { type: 'Detail · a major cut sealed with CPP and turmeric', caption: 'What goes on the wound, on the day it is made' },
    plate: { type: 'Portrait · the block after pruning', caption: 'No synthetic pesticides have gone onto these 150 acres' },
    practice: [
      'No synthetic pesticides or chemicals go onto the 150 acres.',
      'Trichoderma and Pseudomonas — both antagonists of common root and leaf pathogens — are counted in every preparation batch, so what reaches a block is known before it gets there.',
      'Every major canopy cut is sealed with cow pat preparation and turmeric.',
    ],
    open: [
      'This is the thinnest record of the nine. The practice is real and the inputs are logged, but there is no published disease-incidence protocol yet — nothing that counts occurrence block by block over a season.',
      'Until that exists, Aura can say what it puts on the estate and what it keeps off it. It cannot yet publish what the effect has been, and does not claim to.',
    ],
  },
  {
    id: 'biodiversity',
    label: 'Biodiversity',
    slug: 'biodiversity',
    glyph: 'aura-biodiversity-glyph.svg',
    lede: 'The farm sits inside one of the richest biological regions on earth, and is measured as part of it.',
    hero: { type: 'Wide · four storeys of canopy from below', caption: 'Emergent, canopy, understorey, ground — across 100 acres of coffee' },
    plate: { type: 'Detail · a 50 x 50 cm quadrat, earthworms counted', caption: 'Quarterly, in the same frame, in the same places' },
    quote: 'Being in the Western Ghats is not the same as being inside a World Heritage component. Aura is in the region.',
    practice: [
      'Earthworms are counted quarterly, in a 50 × 50 cm quadrat.',
      'Forest islands are built to about 4 × 1 m and 80–120 cm high, in alternating layers of cow-dung compost and freshly cut green biomass, and then left alone.',
      'Woody biomass stays in the block it came from, and its decay is logged.',
      'A four-storey canopy — emergent, canopy, understorey, ground — is maintained across 100 acres of coffee and 32 of tea.',
    ],
    record: [
      { value: '50 × 50 cm', label: 'earthworm quadrat, counted quarterly' },
      { value: 'Four', label: 'canopy storeys' },
      { value: '100 / 32', label: 'acres of coffee / tea' },
    ],
    open: [
      'Aura is in the Western Ghats, a UNESCO World Heritage region. The World Heritage listing is a serial property of thirty-nine discrete components, and being in the region is not the same as being inside an inscribed one. Aura does not claim to be.',
      'Fourteen monitoring programmes are designed to roll into an Ecological Health Index, scored 0–100 per block. Not every block carries a scored index yet, so no estate-wide figure is published.',
      'The estate’s tree count — about 35,000 — is being confirmed as a count rather than an estimate before it is stated as one.',
    ],
    related: [
      { label: 'The Health Index', href: '/ecology' },
      { label: 'Living Systems', href: '/living-systems' },
    ],
  },
  {
    id: 'hydrology',
    label: 'Hydrology',
    slug: 'hydrology',
    glyph: 'aura-hydrology-glyph.svg',
    lede: 'Forty to a hundred inches of rain a year, and a record of where it is measured.',
    hero: { type: 'Wide · monsoon arriving over the estate', caption: 'Forty to a hundred inches a year, logged at 3,600 ft' },
    plate: { type: 'Detail · the weather station', caption: 'Rainfall, temperature and humidity — the part of the water story that is written down' },
    practice: [
      'A weather station at 3,600 ft logs rainfall, temperature and humidity.',
      'Water is measured where it meets the coffee: total dissolved solids are logged for every lot that goes through the wet mill.',
      'Canopy is managed for light, which is also what governs how much rain reaches the ground and how fast it leaves again.',
    ],
    record: [
      { value: '40–100 in', label: 'annual rainfall' },
      { value: '14–30 °C', label: 'temperature range' },
      { value: '58%', label: 'humidity' },
    ],
    open: [
      'What is written down here is weather and process water. Catchment, infiltration and runoff are not yet on a published protocol.',
      'Of the nine disciplines this one has the least record behind it. It is on the ring because it governs the others, not because it is the best documented — and saying otherwise would undo the value of the eight that are.',
    ],
    related: [{ label: 'The Land', href: '/land' }],
  },
  {
    id: 'observation',
    label: 'Tree Level Observation',
    slug: 'tree-level-observation',
    glyph: 'aura-observation-glyph.svg',
    lede: 'The unit of management is one tree, not one block.',
    hero: { type: 'Process · a lux meter held under canopy', caption: 'Fifty readings an acre, on two digital meters' },
    plate: { type: 'Detail · a tagged tree', caption: 'The unit of management is one tree, not one block' },
    quote: 'Measure first. Prune later. Validate afterwards.',
    practice: [
      'Trees are tagged across the estate, and a cow pat ball can be logged to an individual plant.',
      'The 2026 pre-monsoon illuminance survey read five clusters an acre, ten readings each — fifty observations an acre, taken on two digital lux meters.',
      'Block 3, Byton Patte, came back at roughly 33,000 lux in Zone A, 62,000 in Zone B and 82,000 in Zone C, against CCRI targets of 50,000–70,000 for Arabica.',
      'About eighty acres were whiskered in the May–June 2026 window, by eleven loppers and ten choppers.',
      'Every major cut is sealed with cow pat preparation and turmeric.',
    ],
    record: [
      { value: '50', label: 'light readings an acre' },
      { value: '~80 acres', label: 'whiskered, May–June 2026' },
      { value: '33 / 62 / 82k', label: 'lux, Block 3 zones A / B / C' },
    ],
    open: [
      'That blocks held at 65–75% canopy cup better is Aura’s own reading against its own cupping table. It is not a general agronomic law and is not offered as one.',
      'Plant-level logging exists. Whether it covers the whole estate or a pilot block is being confirmed.',
      'Quarterly canopy vitality by satellite is designed. Whether it is running is being verified before it is claimed.',
    ],
    related: [{ label: 'The Light Instrument', href: '/shade' }],
  },
  {
    id: 'vedic',
    label: 'Vedic Farming',
    slug: 'vedic-farming',
    glyph: 'aura-vedic-glyph.svg',
    lede: 'The Indian preparations, kept for the same reason as the European ones — the biology.',
    hero: { type: 'Process · Jeevamrit brewing in the shed', caption: 'Volume planned backwards from the calendar, for 150 acres' },
    plate: { type: 'Detail · the five preparations', caption: 'Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal' },
    practice: [
      'Jeevamrit, Panchgavya, Beejamrit, cow pat pit and Kunapjal are brewed on the estate from the estate’s own herd.',
      'Volume is planned backwards from the biodynamic calendar for 150 acres, and stock registers track every batch against that plan.',
      'The same gate applies as to everything else: tested before and after, held back if it fails.',
    ],
    record: [
      { value: '154,000 L', label: 'of Jeevamrit a year', note: 'Volume planned against the calendar; actual against planned is being confirmed.' },
      { value: '5', label: 'preparations in the Vedic set' },
    ],
    open: [
      'Actual volume against planned, and the year it belongs to, are being confirmed before either figure is stated as a result.',
      'Aura is not certified organic. The 32-acre tea block is in organic transition targeting 2027, which is stated as the ambition it is.',
    ],
    related: [{ label: 'Vedic Farming', href: '/vedic' }],
  },
  {
    id: 'intelligence',
    label: 'Aura Intelligence',
    slug: 'aura-intelligence',
    glyph: 'aura-intelligence-glyph.svg',
    lede: 'Nine data streams, each on its own clock, and a signature on every human event.',
    hero: { type: 'Detail · a signed field record on paper', caption: 'BD 501, Block 07, 06:14, waning moon, humidity 78%, by Raju' },
    plate: { type: 'Detail · the record in plain CSV', caption: 'Readable without any of Aura’s own software' },
    quote: 'A ledger cannot forget, and it cannot flatter.',
    practice: [
      'Nine streams, each running at the rate the thing it watches actually changes — soil does not need reading as often as a ferment does.',
      'Every human event is signed by the person who did it, from the field.',
      'A record reads: BD 501, Block 07, 06:14, waning moon, humidity 78%, by Raju, dung batch G-03. That is one row, and the estate is made of them.',
      'Records are held in plain JSON and CSV, readable without any of Aura’s own software.',
    ],
    record: [
      { value: 'Nine', label: 'data streams, each on its own clock' },
      { value: 'JSON / CSV', label: 'the record, in plain formats' },
    ],
    open: [
      'Writing milestones to a chain is an intention, not a fact. No public verification link exists yet, and until one does the claim is not made.',
      'A QR on every 30 kg bag opening its lot page waits on a published lot page. One complete lot at a public URL would turn this whole discipline from a description into evidence, and it is the next thing to do.',
    ],
    related: [{ label: 'Provenance', href: '/provenance' }],
  },
]

export const DISCIPLINE_SLUGS = DISCIPLINES.map((d) => d.slug)

export function disciplineBySlug(slug: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.slug === slug)
}
