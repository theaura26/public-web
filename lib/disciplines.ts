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
  /** Legacy flat run. Superseded by `movements`. */
  practice?: string[]
  /** The page as short movements, each with a heading and the visual
   *  that follows it. */
  movements?: {
    heading: string
    lines: string[]
    after?: { kind: 'banner' | 'plate' | 'portrait'; type: string; caption: string; alt?: string }
  }[]
  /** Figures worth pulling out. `note` qualifies where the record does. */
  record?: { value: string; label: string; note?: string }[]
  /** Drafting brief for the banner, until there is a photograph. */
  hero?: { type: string; caption: string }
  /** Drafting brief for the mid-page plate. */
  plate?: { type: string; caption: string }
  /** One line worth setting on its own. At most one per page. */
  quote?: string
  /** A tall breaker between the figures and the gaps. */
  breaker?: { caption: string; alt: string }
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
    breaker: { caption: 'Ninety days underground, then a number against a block', alt: 'A cow pat pit opened at ninety days' },
    hero: { type: 'Process · stirring the barrel at dawn', caption: 'Forty-five minutes a day, vortex and reverse — Sampigekhan Estate' },
    plate: { type: 'Detail · a numbered pit opened at ninety days', caption: 'Fourteen pits, each one numbered, each batch traceable to the block it went on' },
    quote: 'A batch that fails is corrected or held. No untested material touches the soil.',
    movements: [
      {
        heading: 'The calendar says when. The lab says whether.',
        lines: [
          'The calendar sets when, and the lab decides whether. A preparation goes out on the day the calendar names and only if the plate agrees — which is the order of operations the whole system rests on.',
          'The lunar calendar sets the timing, and the reason for keeping the preparations is the biology they build. The charts are a schedule, and Aura says so in print.',
        ],
        after: { kind: 'banner', type: 'Wide · a preparation going out at first light', caption: 'The day the calendar names, and only if the plate agrees' },
      },
      {
        heading: 'Made here, from this herd.',
        lines: [
          'The dung comes from the estate’s own herd, fifty-two Malnad Gidda grazing the ground the preparations return to. [Circular Intelligence](/circular) follows one batch through that loop end to end.',
          'BD 500 through 508 are prepared here and applied to the blocks on a calendar built for 150 acres.',
          'Barrels are stirred by hand for about forty-five minutes a day, vortex and reverse.',
          'Cow pat pit matures for ninety days. The other preparations run sixty- to ninety-day cycles.',
        ],
        after: { kind: 'plate', type: 'Process · barrels mid-stir, vortex and reverse', caption: 'Forty-five minutes a day, by hand' },
      },
      {
        heading: 'Nothing goes out untested.',
        lines: [
          'Every batch is tested before and after it is made — pH, electrical conductivity, microbial colony counts, Trichoderma, Pseudomonas.',
          'A batch that fails is corrected or held back. No untested material touches the soil.',
          'A pit that fails is corrected and re-tested, or held back while the block waits — which occasionally means a block waits.',
          'The block is tested again ninety days after application, and the result is cross-referenced to the batch number that went on it.',
        ],
        after: { kind: 'portrait', type: 'Detail · a numbered pit, opened at ninety days', caption: 'Corrected and re-tested, or held back while the block waits' },
      },
      {
        heading: 'What the practice claims.',
        lines: [
          'Aura is not certified biodynamic. It practises the system in full and publishes the record instead, which is a harder standard to hold and an easier one to check.',
          'Chromatography is run as a soil-vitality image — a qualitative indicator, published as a practice rather than as evidence of an outcome.',
          '[A Living Organism](/biodynamic) is the longer account of why the estate keeps the preparations at all.',
        ],
      },
    ],
    record: [
      { value: '14', label: 'numbered cow pat pits' },
      { value: '90 days', label: 'to mature a pit' },
      { value: '45 min', label: 'stirred daily, vortex and reverse' },
      { value: '2,420 kg', label: 'of CPP a year', note: 'Planned against the biodynamic calendar for 150 acres.' },
    ],
    related: [
      { label: 'A Living Organism', href: '/biodynamic' },
      { label: 'Circular Intelligence', href: '/circular' },
    ],
  },
  {
    id: 'soil',
    label: 'Soil',
    slug: 'soil',
    glyph: 'aura-soil-glyph.svg',
    lede: 'Coffee does not begin with coffee. It begins about a metre underground.',
    breaker: { caption: 'Everything above ground is an argument about this', alt: 'Red laterite in the hand, at 3,600 ft' },
    hero: { type: 'Detail · red laterite in the hand', caption: 'Held between pH 6.0 and 6.5, at 3,600 ft' },
    plate: { type: 'Process · respiration sampling at 0–15 cm', caption: 'Read monthly, by the NaOH method' },
    quote: 'Coffee does not begin with coffee. It begins about a metre underground.',
    movements: [
      {
        heading: 'Red laterite, and what it does with rain.',
        lines: [
          'The ground here is old, iron-rich and free-draining. In a hundred inches of monsoon that is a gift: water moves through rather than sitting on the roots. In the dry weeks that follow it is the problem, because the same openness lets moisture go.',
          'Almost everything the estate does to the ground is an answer to that second half — holding water and biology in a soil built to shed both.',
          'It is held between pH 6.0 and 6.5. Inside that band the nutrients already in the soil stay available to a plant; outside it they lock up and the fertility is there on paper and nowhere else.',
        ],
        after: {
          kind: 'banner',
          type: 'Detail · red laterite, wet and dry in the same frame',
          caption: 'Free-draining is a gift in the monsoon and a problem in the weeks after it',
          alt: 'Red laterite soil at Sampigekhan Estate, 3,600 ft',
        },
      },
      {
        heading: 'How the soil is read.',
        lines: [
          'A respiration reading measures how much is alive down there. The more the soil breathes, the more biology is working in it. Read monthly by the NaOH method at 0\u201315 cm — always the same depth, always the same schedule, so it becomes a trend rather than a number.',
          'Retesting a block ninety days after an application, against the batch number that went onto it, is what turns a preparation from an act of faith into a result somebody else can check.',
        ],
        after: {
          kind: 'plate',
          type: 'Process · respiration sampling at 0\u201315 cm',
          caption: 'The same depth, the same month, so a reading becomes a trend',
        },
      },
      {
        heading: 'What goes back into it.',
        lines: [
          'Woody biomass is cut to 60\u201390 cm and left in the block it came from. Decay classes I to V are logged as it breaks down, so the carbon going back is recorded as a rate rather than assumed.',
          'Forest islands are built into the planting as small, permanent concentrations of decomposition. [Forest Islands](/forest-islands) covers how one is made and what is watched on it.',
        ],
        after: {
          kind: 'portrait',
          type: 'Detail · retained wood, mid-decay',
          caption: 'Decay classes I to V, logged where the wood fell',
          alt: 'Woody biomass left to decay in the block it was cut from',
        },
      },
      {
        heading: 'Where the readings end up.',
        lines: [
          'Soil is one input to a bigger picture. [The Health Index](/ecology) is where these readings are rolled up with everything else measured on a block, so a season reads as one story rather than nine unrelated logs.',
        ],
      },
    ],
    record: [
      { value: '6.0–6.5', label: 'soil pH, red laterite' },
      { value: '3,600 ft', label: 'altitude' },
      { value: '0–15 cm', label: 'respiration sampling depth, read monthly' },
    ],
    related: [{ label: 'The Health Index', href: '/ecology' }],
  },
  {
    id: 'microbiome',
    label: 'Microbiome',
    slug: 'microbiome',
    glyph: 'aura-microbiome-glyph.svg',
    lede: 'The part of the farm nobody can see, counted anyway.',
    breaker: { caption: 'Counted because it cannot be seen', alt: 'Plated colonies in the estate lab' },
    hero: { type: 'Detail · plated colonies in the estate lab', caption: 'Every batch counted before and after it is made' },
    plate: { type: 'Process · a pH reading during ferment', caption: 'Every fifteen minutes, until it reaches 4.2' },
    quote: 'A number ends the ferment. It stops at pH 4.2, whatever the clock says.',
    movements: [
      {
        heading: 'Counting what is alive.',
        lines: [
          'A colony count is a crude instrument and an honest one: it says how much is alive in a batch, before and after, on the same medium each time. Trends from a crude instrument used consistently beat one good reading.',
          'Trichoderma and Pseudomonas are the two counted by name. Both are antagonists of common root and leaf pathogens, so their presence in a batch is the nearest thing to a reading of what that preparation will do once it reaches a block.',
          'Every preparation batch is plated before and after: colony counts, Trichoderma, Pseudomonas.',
        ],
        after: { kind: 'banner', type: 'Detail · plates on the bench, before and after', caption: 'A crude instrument, and an honest one' },
      },
      {
        heading: 'Ninety days later, on the same medium.',
        lines: [
          'A block is plated again ninety days after an application and cross-referenced to the batch that went on it, which is the only way to know whether anything survived the journey from barrel to soil.',
          'Mycorrhizal colonisation is assessed once a year.',
        ],
        after: { kind: 'plate', type: 'Process · a block plated again, cross-referenced to its batch', caption: 'The only way to know whether anything held' },
      },
      {
        heading: 'The ferment is the other half.',
        lines: [
          'The wet mill is the other half of the same subject. [Fermentation](/fermentation) sets out how a tank is read and what stops it.',
          'In the wet mill the ferment is tracked hour by hour — pH every fifteen minutes, temperature three times a day, Brix at the start, the middle and the end. It ends at pH 4.2.',
        ],
        after: { kind: 'portrait', type: 'Detail · a tank at pH 4.2', caption: 'Read every fifteen minutes until it is stopped' },
      },
      {
        heading: 'Where a colony count stops.',
        lines: [
          'A plating shows that a batch changed between two counts. Which organisms did the changing is past what a colony count can tell you, and the page says so.',
          'The herd is an indigenous breed because Aura reads a gut microbiome as following the ground it grazes. No metagenomic comparison against another breed has been run, so that stays a reading the estate acts on.',
          'The wild yeasts and lactic-acid bacteria that drive a coffee ferment are well described in the literature. What Aura tracks on this estate is the ferment\'s behaviour hour by hour, and it has not identified the species here.',
        ],
      },
    ],
    record: [
      { value: '15 min', label: 'between pH readings through a ferment' },
      { value: 'pH 4.2', label: 'where a ferment is stopped' },
      { value: 'Annual', label: 'mycorrhizal colonisation assessment' },
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
    lede: 'Keeping a plant well, so there is nothing to treat.',
    breaker: { caption: 'What goes on a wound, on the day it is made', alt: 'A major cut sealed with cow pat preparation and turmeric' },
    hero: { type: 'Detail · a major cut sealed with CPP and turmeric', caption: 'What goes on the wound, on the day it is made' },
    plate: { type: 'Portrait · the block after pruning', caption: 'No synthetic pesticides have gone onto these 150 acres' },
    movements: [
      {
        heading: 'Keeping a plant well, so there is nothing to treat.',
        lines: [
          'The logic is preventive rather than curative. A plant standing on ground with an active microbial community, cut cleanly and sealed the same day, is a harder plant to infect \u2014 so the work happens before there is anything to treat.',
          'No synthetic pesticides or chemicals go onto the 150 acres.',
          'Turmeric on a cut is an antifungal dressing, applied the same day the wound is made, which is the only day a wound is worth dressing.',
        ],
        after: { kind: 'banner', type: 'Wide · a block after rain, drying', caption: 'Preventive rather than curative, and the difference shows after rain' },
      },
      {
        heading: 'Canopy work is disease work.',
        lines: [
          'Humidity is what most leaf pathogens need, and a four-storey canopy holds it. That is why the light survey and the disease question are the same question, read from two directions.',
          'Canopy work is disease work. A block held at the right light is a block that dries after rain, and [The Light Instrument](/shade) is how that light gets set.',
          'A block that dries after rain is a block under less pressure. Whiskering to a light target is therefore a disease decision as much as a ripening one, and the two are taken together.',
        ],
        after: { kind: 'plate', type: 'Detail · light through four storeys', caption: 'The light survey and the disease question, read from two directions' },
      },
      {
        heading: 'Every cut is a door.',
        lines: [
          'Every cut is a wound and every wound is a door. Sealing on the same day the cut is made, with cow pat preparation and turmeric, is the whole of the protocol — and eighty acres of whiskering is eighty acres of wounds.',
          'Every major canopy cut is sealed with cow pat preparation and turmeric.',
        ],
        after: { kind: 'portrait', type: 'Detail · a major cut sealed with cow pat and turmeric', caption: 'Sealed the same day it is made' },
      },
      {
        heading: 'The soil carries its own antagonists.',
        lines: [
          'The soil is the other half of it. A root zone with an active microbial community carries its own antagonists, which is why every preparation batch is counted for Trichoderma and Pseudomonas before it goes out — see [Microbiome](/regenerative-life/microbiome).',
          'Trichoderma and Pseudomonas — both antagonists of common root and leaf pathogens — are counted in every preparation batch, so what reaches a block is known before it gets there.',
        ],
      },
      {
        heading: 'What is logged, and what is not counted yet.',
        lines: [
          'Aura can say what goes onto the 150 acres and what is kept off it, and both are logged. What it cannot yet publish is disease incidence across a season, because no counting protocol is running — fixed plants, a fixed interval, one person who can tell one lesion from another.',
        ],
      },
    ],
    record: [
      { value: 'Zero', label: 'synthetic pesticides across 150 acres' },
      { value: 'Every batch', label: 'counted for Trichoderma and Pseudomonas' },
      { value: 'Every cut', label: 'sealed with cow pat preparation and turmeric' },
    ],
  },
  {
    id: 'biodiversity',
    label: 'Biodiversity',
    slug: 'biodiversity',
    glyph: 'aura-biodiversity-glyph.svg',
    lede: 'The farm sits inside one of the richest biological regions on earth, and is measured as part of it.',
    breaker: { caption: 'Four storeys, and everything living in them', alt: 'The canopy at Mudigere, read from below' },
    hero: { type: 'Wide · four storeys of canopy from below', caption: 'Emergent, canopy, understorey, ground — across 100 acres of coffee' },
    plate: { type: 'Detail · a 50 x 50 cm quadrat, earthworms counted', caption: 'Quarterly, in the same frame, in the same places' },
    quote: 'Being in the Western Ghats is not the same as being inside a World Heritage component. Aura is in the region.',
    movements: [
      {
        heading: 'Four storeys, and everything living in them.',
        lines: [
          'A four-storey canopy — emergent, canopy, understorey, ground — is maintained across 100 acres of coffee and 32 of tea.',
          'Aura is in the Western Ghats, a UNESCO World Heritage region. The listing is a serial property of thirty-nine discrete components, and the estate sits in the region rather than inside an inscribed component.',
        ],
        after: { kind: 'banner', type: 'Wide · the canopy read from below', caption: 'Emergent, canopy, understorey, ground — across 132 acres' },
      },
      {
        heading: 'Habitat, built back in.',
        lines: [
          'Bug hotels are put up where a working landscape has stopped producing cavities — [Bug Hotels](/bug-hotels) explains what is drilled and why nothing is introduced.',
          '[Forest Islands](/forest-islands) are the third piece: small built nuclei meant to seed biological activity outward into the block around them.',
          'Forest islands are built to about 4 × 1 m and 80–120 cm high, in alternating layers of cow-dung compost and freshly cut green biomass, and then left alone.',
        ],
        after: { kind: 'plate', type: 'Detail · a bug hotel, occupied', caption: 'Put up where a working landscape stopped producing cavities' },
      },
      {
        heading: 'Six plants, taken back out.',
        lines: [
          'Six introduced plants are being taken back out of the understorey so the native ground layer has somewhere to return to. [Pollinators](/pollinators) names them and what each one does.',
          'Woody biomass stays in the block it came from, and its decay is logged.',
        ],
        after: { kind: 'portrait', type: 'Detail · Lantana pulled from the understorey', caption: 'So the native ground layer has somewhere to return to' },
      },
      {
        heading: 'The count.',
        lines: [
          'Earthworms are counted quarterly, in a 50 × 50 cm quadrat, in the same frames each time — counted and signed by Pulkit, who runs the biodiversity monitoring.',
        ],
      },
    ],
    record: [
      { value: '50 × 50 cm', label: 'earthworm quadrat, counted quarterly' },
      { value: 'Four', label: 'canopy storeys' },
      { value: '100 / 32', label: 'acres of coffee / tea' },
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
    breaker: { caption: 'A hundred inches a year, and one instrument to meet it', alt: 'The weather station at 3,600 ft' },
    hero: { type: 'Wide · monsoon arriving over the estate', caption: 'Forty to a hundred inches a year, logged at 3,600 ft' },
    plate: { type: 'Detail · the weather station', caption: 'Rainfall, temperature and humidity — the part of the water story that is written down' },
    movements: [
      {
        heading: 'The question is never how much falls.',
        lines: [
          'The rain does not arrive evenly. Most of the year’s hundred inches comes in a few monsoon months, so the question is never how much falls but how fast it leaves.',
          'Red laterite drains fast, which is a gift in a hundred inches of rain and a problem in the weeks after it stops. Almost everything the estate does to hold moisture is answering that second half.',
        ],
        after: { kind: 'banner', type: 'Wide · monsoon coming up the valley', caption: 'A hundred inches, most of it in a few months' },
      },
      {
        heading: 'The canopy is the first instrument.',
        lines: [
          'A four-storey canopy is the estate\u2019s main water instrument. It breaks the fall of monsoon rain before it reaches bare soil, slows what runs off, and shades ground that would otherwise give its moisture back to the air by noon.',
          'A closed canopy is the first thing it meets. [The Light Instrument](/shade) covers how that canopy is measured and cut, and the same readings govern what reaches the ground.',
          'Canopy is managed for light, which is also what governs how much rain reaches the ground and how fast it leaves again.',
        ],
        after: { kind: 'plate', type: 'Detail · rain broken by four storeys before it lands', caption: 'What reaches bare soil, and how fast it leaves' },
      },
      {
        heading: 'Everything that slows water down.',
        lines: [
          'Ground cover is a water instrument too. Woody biomass left in the block, mulch over a cow pat ball, and a living understorey all slow the same water down before it reaches bare laterite.',
          'Phase one of the estate plan is hydrological: reservoirs sized to catch the monsoon and return it to the watershed below, rather than letting a year\'s rain leave in a few weeks.',
        ],
        after: { kind: 'portrait', type: 'Detail · mulch over a cow pat ball', caption: 'Ground cover doing the same work as the canopy, lower down' },
      },
      {
        heading: 'What is measured.',
        lines: [
          'A weather station at 3,600 ft logs rainfall, temperature and humidity.',
          'Water is measured at the point it enters the coffee: total dissolved solids are logged for every lot that goes through the wet mill.',
        ],
      },
      {
        heading: 'Where the record stops.',
        lines: [
          'What is written down is weather and process water. Catchment, infiltration and runoff are read in the field and are not yet on a published protocol.',
          '[The Land](/land) carries what is known about the ground this water moves through.',
        ],
      },
    ],
    record: [
      { value: '40–100 in', label: 'annual rainfall' },
      { value: '14–30 °C', label: 'temperature range' },
      { value: '58%', label: 'humidity' },
    ],
    related: [{ label: 'The Land', href: '/land' }],
  },
  {
    id: 'observation',
    label: 'Tree Level Observation',
    slug: 'tree-level-observation',
    glyph: 'aura-observation-glyph.svg',
    lede: 'The unit of management is one tree.',
    breaker: { caption: 'Fifty readings an acre, before anything is cut', alt: 'A lux meter held under the canopy' },
    hero: { type: 'Process · a lux meter held under canopy', caption: 'Fifty readings an acre, on two digital meters' },
    plate: { type: 'Detail · a tagged tree', caption: 'The unit of management is one tree, not one block' },
    quote: 'Measure first. Prune later. Validate afterwards.',
    movements: [
      {
        heading: 'The unit of decision is one tree.',
        lines: [
          'Managing at tree level means the unit of decision is one plant. Two trees in the same block can want opposite things, and a block-level instruction gives both the wrong one.',
          'Trees are tagged across the estate, and a cow pat ball can be logged to an individual plant.',
        ],
        after: { kind: 'banner', type: 'Wide · two trees in one block, wanting opposite things', caption: 'A block-level instruction gets one of them wrong' },
      },
      {
        heading: 'Reading the light before anyone cuts.',
        lines: [
          'The 2026 pre-monsoon illuminance survey read five clusters an acre, ten readings each — fifty observations an acre, taken on two digital lux meters.',
          'Block 3, Byton Patte, came back at roughly 33,000 lux in Zone A, 62,000 in Zone B and 82,000 in Zone C, against CCRI targets of 50,000–70,000 for Arabica.',
        ],
        after: { kind: 'plate', type: 'Process · a lux meter held at canopy height', caption: 'Five clusters an acre, ten readings each' },
      },
      {
        heading: 'The cut itself.',
        lines: [
          'Whiskering is the cut itself: thinning a canopy by hand, branch by branch, to a light target rather than to a shape. It is slow, and it is the only way to prune to a number.',
          'About eighty acres were whiskered in the May–June 2026 window, by eleven loppers and ten choppers.',
          'Every major cut is sealed with cow pat preparation and turmeric.',
        ],
        after: { kind: 'portrait', type: 'Detail · whiskering, branch by branch', caption: 'Eighty acres in the May–June window, by hand' },
      },
      {
        heading: 'The fuller account.',
        lines: [
          '[The Light Instrument](/shade) is the full account of the survey and what was done with it.',
        ],
      },
    ],
    record: [
      { value: '50', label: 'light readings an acre' },
      { value: '~80 acres', label: 'whiskered, May–June 2026' },
      { value: '33 / 62 / 82k', label: 'lux, Block 3 zones A / B / C' },
      { value: '65–75%', label: 'canopy where blocks cup best', note: "Aura's own reading against its own cupping table." },
    ],
    related: [{ label: 'The Light Instrument', href: '/shade' }],
  },
  {
    id: 'vedic',
    label: 'Vedic Farming',
    slug: 'vedic-farming',
    glyph: 'aura-vedic-glyph.svg',
    lede: 'The Indian preparations, kept for the same reason as the European ones — the biology.',
    breaker: { caption: 'Brewed from the herd that grazes the ground it returns to', alt: 'Jeevamrit in the shed at Sampigekhan Estate' },
    hero: { type: 'Process · Jeevamrit brewing in the shed', caption: 'Volume planned backwards from the calendar, for 150 acres' },
    plate: { type: 'Detail · the five preparations', caption: 'Jeevamrit, Panchgavya, Beejamrit, cow pat pit, Kunapjal' },
    movements: [
      {
        heading: 'Five preparations, five jobs.',
        lines: [
          'Each preparation does a different job. Jeevamrit inoculates, Beejamrit protects the seed, Panchgavya feeds the plant directly, Kunapjal supplies nitrogen, and cow pat pit carries the composted biology into the soil.',
          'Jeevamrit is a microbial culture brewed from dung, urine, jaggery, pulse flour and a handful of undisturbed soil. Beejamrit treats seed before it goes in. Panchgavya is the five cow products together. Kunapjal is the old fermented liquid manure. Cow pat pit is the composted preparation, matured ninety days.',
        ],
        after: { kind: 'banner', type: 'Wide · the five, lined up on the shed bench', caption: 'Each doing a different job in the same system' },
      },
      {
        heading: 'None of it is bought.',
        lines: [
          'None of it is bought. [Ecosystem Engineers](/herd) is the herd that makes it, and the reason it is an indigenous breed kept on the land.',
          'All five are brewed from the estate\u2019s own herd, which is the reason the herd is indigenous and stays on the land it feeds.',
          'Jeevamrit, Panchgavya, Beejamrit, cow pat pit and Kunapjal are brewed on the estate from the estate’s own herd.',
        ],
        after: { kind: 'plate', type: 'Detail · dung and urine from the estate’s own herd', caption: 'The reason the herd is indigenous and stays on the land it feeds' },
      },
      {
        heading: 'Planned backwards from the calendar.',
        lines: [
          'Volume is planned backwards from the biodynamic calendar for 150 acres, and stock registers track every batch against that plan.',
          'The same gate applies as to everything else: tested before and after, held back if it fails.',
        ],
        after: { kind: 'portrait', type: 'Detail · a stock register against the biodynamic calendar', caption: 'Volume planned for 150 acres, batch by batch' },
      },
      {
        heading: 'What is claimed.',
        lines: [
          'Aura is not certified organic. The 32-acre tea block is in organic transition targeting 2027, stated as the ambition it is.',
          '[Vedic Farming](/vedic) is the longer account of the tradition these preparations come from.',
        ],
      },
    ],
    record: [
      { value: '154,000 L', label: 'of Jeevamrit a year', note: 'Planned against the biodynamic calendar for 150 acres.' },
      { value: '5', label: 'preparations in the Vedic set' },
      { value: '150', label: 'acres the calendar is planned for' },
    ],
    related: [{ label: 'Vedic Farming', href: '/vedic' }],
  },
  {
    id: 'intelligence',
    label: 'Aura Intelligence',
    slug: 'aura-intelligence',
    glyph: 'aura-intelligence-glyph.svg',
    lede: 'Nature is already wise. The missing layer has always been the one that observes it, remembers, learns, and acts at the right time.',
    hero: { type: 'Detail · a reading entered in the field', caption: 'BD 501, Block 07, 06:14, waning moon, humidity 78%, by Rao' },
    breaker: { caption: 'One row, signed by the person who was standing there', alt: 'A field record entered at 06:14' },
    plate: { type: 'Detail · the estate database, queried', caption: 'Every event addressable, exportable, and traceable to a person' },
    quote: 'A ledger cannot forget, and it cannot flatter.',
    movements: [
      {
        heading: 'Observe, remember, learn, act.',
        lines: [
          'Four moves, in that order: observe what is happening, remember what was done, learn from what followed, act at the right time. Everything below is machinery for those four.',
        ],
        after: { kind: 'banner', type: 'Wide · the estate from above, blocks and paths', caption: 'Four moves, and everything else is machinery for them' },
      },
      {
        heading: 'Capture where the work already happens.',
        lines: [
          'Capture happens where the work already happens. Field teams log through WhatsApp workflows — field work, fertiliser work, cow work, estate walks — in formatted text, photographs and voice, so the record gets built without asking anybody to work differently.',
          'Base data is the other half. Every tree, plant and animal is labelled and identified: an ID, a photograph, and a zone on the estate map. A reading is worth very little until it is attached to the thing it was taken from.',
          'Two logs run daily. An observation log holds everything seen or measured. An intervention log holds every action taken on the estate. Planning reads from both, which is what keeps a plan answerable to the ground.',
        ],
        after: { kind: 'plate', type: 'Detail · a field log entered on a phone, mid-block', caption: 'Formatted text, photographs and voice, without changing how anybody works' },
      },
      {
        heading: 'Nine streams, seven domains.',
        lines: [
          'Nine streams run continuously: soil, canopy, weather, herd, preparation, ferment, harvest, lab, and the human record that ties them together. Each samples at its own interval, because soil moves in seasons and a ferment moves in minutes.',
          'The estate is described across seven domains — crop, weather, fauna, flora, soil, the fungal network, and the geological foundation under all of it. Every tree, every cow, every rainfall, every compost batch, every intervention, every mistake, every season.',
          'Every human event is entered in the field and signed by the person who did it. A row reads: BD 501, Block 07, 06:14, waning moon, humidity 78%, by Rao, dung batch G-03.',
        ],
        after: { kind: 'portrait', type: 'Detail · a reading entered and signed in the field', caption: 'BD 501, Block 07, 06:14, waning moon, humidity 78%, by Rao' },
      },
      {
        heading: 'The part that leaves when people do.',
        lines: [
          'The hardest thing to capture is the part that lives in people. Somebody who has read this valley for thirty years knows things no sensor reports, and that knowledge leaves when they do. Getting it written down, attached to a block and a season, is the part of this work with a clock on it.',
        ],
      },
      {
        heading: 'Joining what was captured.',
        lines: [
          'The streams are joined. A block, a batch, a lot and a date are all addressable, so “what went on this block, and what did the lab say ninety days later” is a query rather than an afternoon in the filing cabinet.',
          'A stream is only worth keeping if it can be joined to another. Nine separate logs are nine separate logs. The value is being able to ask what went on this block, and what the cup did four months later, and get one answer.',
          'Above the logs sits a memory layer, in build now: base data, observations, interventions and outside knowledge in one governed system, sliced so a question about husbandry meets what the estate already knows about husbandry.',
        ],
        after: { kind: 'banner', type: 'Detail · the estate database, queried', caption: 'A block, a batch, a lot and a date, all addressable' },
      },
      {
        heading: 'Learning from the gap.',
        lines: [
          'That memory is what a digital twin runs on. A limited pilot is being built, and the questions it exists to answer are ordinary ones — what is here and where, what is happening today, what happened last time conditions looked like this, and what is likely next.',
          'Every outcome is checked against what was predicted, and the gap between them is what trains the model. Better memory, better predictions, better decisions, season after season. The loop is the thing being built, more than any single reading inside it.',
        ],
        after: { kind: 'plate', type: 'Detail · a predicted outcome beside the measured one', caption: 'The difference between them is what trains the model' },
      },
      {
        heading: 'Who decides.',
        lines: [
          'What the design puts in front of a land manager is an interpretation: what is happening, what may be causing it, and what remains uncertain, with the evidence and the reasoning visible behind it. A wall of disconnected readings is the failure this is meant to avoid.',
          'The person stays responsible. Consequential decisions are approved by a human, and any move towards machines acting on their own is bounded by conditions written down in advance. That order is a commitment rather than a limitation of the technology.',
          'The chain worth keeping runs observation, recommendation, approval, action, measured outcome. Holding all five together is what would let somebody audit a claim instead of being asked to trust it, and it is why the record is built the way it is.',
        ],
        after: { kind: 'portrait', type: 'Detail · a recommendation, with its evidence beside it', caption: 'A person approves the consequential ones' },
      },
      {
        heading: 'Where the claim stops.',
        lines: [
          'Everything exports in open formats. Software gets replaced; a hundred-year claim needs a record that outlives the company keeping it, and portability is what lets somebody outside Aura audit the estate.',
          'The record is signed and exportable, and that is where the claim stops. Writing milestones to a public chain is an intention and is not built, so nothing here is described as verifiable by a third party.',
          'One estate is a sample of one. The second at Ohara tests whether a practice that held in the Western Ghats holds in a different climate on a different soil, and a reading confirmed in two valleys is worth more than a reading confirmed in one.',
          '[Natural Intelligence](/reason/natural-intelligence) is the fuller argument for why this is possible now. [Provenance](/provenance) is the fuller account of how a single event becomes a record.',
        ],
      },
    ],
    record: [
      { value: 'Nine', label: 'Streams, each on its own sampling rate' },
      { value: 'Seven', label: 'Domains the estate is described in, from crop to geology' },
      { value: 'Two', label: 'Daily logs: everything seen, and everything done' },
      { value: 'Signed', label: 'Every human event, at the point it happens' },
      { value: 'Open', label: 'Export formats, so the record outlives the software' },
    ],
    related: [{ label: 'Provenance', href: '/provenance' }],
  },
]


export function disciplineBySlug(slug: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.slug === slug)
}
