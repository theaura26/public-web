import {
  JournalHero,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
  ScrollHighlight,
  Term,
} from '@/components/article/Article'

export default function CoffeePage() {
  return (
    <>
      <JournalHero
        currentHref="/coffee"
        title="Our Bean Story"
        caption="Coffee flowers — the beginning of every lot"
      />

      <OneCol heading="Small is the strategy.">
        <p className="p1">
          One estate. 150 acres. One harvest a year. The scale is deliberate
          — so is the patience.
        </p>
        <p className="p1">
          We are not pursuing volume, category leadership, or distribution
          at scale. We are building a coffee that answers for itself —
          traceable to the morning it was picked, the canopy it grew under,
          the ferment that shaped it. Small enough that every decision is
          made by someone who walks the land.
        </p>
        <p className="p1" style={{ marginTop: 'var(--space-7)' }}>
          Six lots. One harvest. No two cups the same.
        </p>
        <p className="p1">
          Arabica grown at 3,600 feet in the <Term tip="Mountain range along India’s west coast. UNESCO biodiversity hotspot; over 7,000 plant species.">Western Ghats</Term>, beneath a four-story
          canopy. Two cultivars — <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka. Floral, citric.">Sln.9</Term> and <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>. Every lot is a document
          of place and method.
        </p>
        <p className="p1">
          Coffee is the primary crop, but the estate is the system. The cup
          that reaches you carries the character of canopy shade, laterite soil,
          monsoon rhythm, and the specific decisions made during fermentation —
          down to the hour.
        </p>
      </OneCol>

      <OneCol heading="The cup is evidence.">
        <p className="p1">
          Coffee is usually discussed through flavour notes alone. But flavour
          is accumulated consequence.
        </p>
        <p className="p1">
          Every cup contains decisions made months earlier: canopy management,
          microbial health, rainfall timing, fermentation discipline, drying
          rhythm, and restraint.
        </p>
        <p className="p1">
          What ends up in the cup is what the land did, what the weather did,
          and what the team chose not to do.
        </p>
      </OneCol>

      <PullQuote>
        We are building a COFFEE that will still be RECOGNISABLE in a
        HUNDRED YEARS.
      </PullQuote>

      <TwoCol id="rules" heading="The discipline.">
        <p className="p1">
          Only fully ripe cherries are plucked. Minimum ripeness 95%. All floats
          — the under-dense beans that rise in water — are removed from every
          lot. Fermentation ends at pH 4.2. The temperature pattern through the
          process is the climate of the estate, printed into the bean: 21 °C
          morning, 32 °C afternoon, 18 °C night.
        </p>
        <DataGrid cols={3}>
          <DataCard value="95%+">Minimum ripeness at pick.</DataCard>
          <DataCard value="Every lot">Floats removed.</DataCard>
          <DataCard value="4.2">Fermentation end pH.</DataCard>
          <DataCard value="3,600 ft">Altitude.</DataCard>
          <DataCard value="6.0–6.5">Soil pH, laterite.</DataCard>
          <DataCard value="Sln.9 + Sln.795">Arabica cultivars.</DataCard>
          <DataCard value="80+ SCA">Cupping target.</DataCard>
          <DataCard value="4–5×">Estimated carbon vs monoculture.</DataCard>
          <DataCard value="Western Ghats">A UNESCO World Heritage region.</DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        The CUP is PROOF of the year that made it.
      </PullQuote>

      <TwoCol id="lots" heading="The lots.">
        <p className="p1">
          Six distinct micro lots each harvest. The same cherries, the same
          land — six different decisions in the wet mill.
        </p>
        <p className="p1">
          Terroir alone does not explain the spread between them. Terroir
          expressed through technique does.
        </p>
        <p className="p1">
          We will be honest about our own romance. A chosen yeast or a sealed
          ferment moves a cup by a point or three on the specialty scale — real,
          measurable, and worth chasing. But altitude and variety set the ceiling,
          and the ferment only decides how much of that ceiling the cup reaches.
          Anyone who tells you the process alone makes the coffee is skipping the
          harder half of the story.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard
          img="/journals/coffee/aura-anaerobic-natural.jpg"
          alt="Sealed stainless-steel ferment tanks — Anaerobic Natural lot at Aura Estate"
          value="Lot 001 — Anaerobic Natural."
        >
          11,984 kg harvest, 1,151 kg immature removed, 878 kg floats. 48 hr
          sealed ferment. Water <Term tip="Total dissolved solids. Mineral load in the ferment water, in parts per million.">TDS</Term> 29.28 ppm. 22 days drying on raised beds.
          The simplest method — where the cherry&rsquo;s own microbial
          environment does the work.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-dry-osmosis.jpg"
          alt="Cherries dried to 45% moisture before fermentation — Dry Osmosis lot"
          value="Lot 002 — Dry Osmosis."
        >
          8,726 kg harvest, 229 kg immature (lowest ratio, exceptional
          selection), 720 kg floats. <Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term> 19.55%. Dried to 45% moisture, then
          48 hr anaerobic. 25 days drying. Notes: blueberry, fig, raisin.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-liquid-gold.jpg"
          alt="Red Honey lot — sticky mucilage on parchment, named Liquid Gold"
          value={<>Lot 003 — Red Honey &middot; &ldquo;Liquid Gold&rdquo;.</>}
        >
          6,715 kg harvest, 880 kg immature, 511 kg floats. Brix 19.25%. 48 hr
          anaerobic, pulped with mucilage on. 5 days thick drying, then 25
          days thin. Notes: honey, caramel, nutty. Named &ldquo;Liquid Gold&rdquo;
          at its first public tasting.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-banana-wash.jpg"
          alt="Banana leaves layered over fermenting cherries — Banana Wash lot"
          value="Lot 004 — Banana Wash."
        >
          8,086 kg harvest, 1,241 kg immature, 673 kg floats. Brix 19.25%. 24 hr
          anaerobic, then pulped and layered with banana leaves for 48 hr more.
          The leaves contribute wild yeasts and a micro-environment. The most
          distinctly Indian lot.
        </DataCard>
        <DataCard
          video="/journals/coffee/aura-solera-macaceration.mp4"
          poster="/journals/coffee/aura-solera-macaceration.jpg"
          alt="Solera Maceration tanks carrying microbial culture forward across batches"
          value="Lot 005 — Solera Maceration · Flagship."
        >
          770 kg harvest, 179 kg immature, 80 kg floats. Brix 18%. Water TDS
          42 ppm. Three-day initial ferment, 50% carry-forward into freshly
          harvested cherries — the <Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera</Term> carry-forward. Alternating two-day ferment and rest. Day-night
          drying to 12% moisture. The flagship.
        </DataCard>
        <DataCard
          img="/journals/coffee/aura-solera-wash.jpg"
          alt="Hand-washed beans on raised beds — Solera Wash, the rarest lot"
          value="Lot 006 — Solera Wash · Rarest."
        >
          620 kg harvest, 146 kg immature, 75 kg floats. Brix 23% — the highest
          of any lot. 24 hr ferment, three-day soak, hand-washed, raised-bed
          dry. Highest sugar, then everything non-essential stripped away.
          Ascetic focus applied to coffee.
        </DataCard>
      </DataGrid>

      <TwoCol id="microbes" heading="What is actually fermenting.">
        <p className="p1">
          Strip the romance and a coffee ferment is a microbial event with a known
          cast. Wild yeasts — <Term tip="Common wild yeasts on coffee cherry. They ferment the sugars in the mucilage into the alcohols and acids that later become fruity esters in the cup.">Pichia, Hanseniaspora</Term> — and
          lactic-acid bacteria colonise the sweet mucilage on the bean, secreting
          enzymes that dissolve it while the pH drops. The alcohols and acids they
          leave behind are the raw material of the esters a taster later calls
          &ldquo;fruity.&rdquo; We track it hour by hour.
        </p>
        <p className="p1">
          It is also double-edged. The same microbes that build fruit build faults
          when they run too long or too warm — the vinegar sharpness of excess
          acetic acid, the onion note of butyric. Control here is the whole game:
          the line between a flavour and a defect, and the reason every lot is held
          to a clock and a pH rather than left to chance.
        </p>
      </TwoCol>

      <PullQuote>
        The CHOICES made by one BATCH shape every batch that FOLLOWS.
      </PullQuote>

      <Placeholder
        src="/journals/coffee/aura-coffee-grading.jpg"
        alt="Hands sorting green coffee for screen size and defect — SCA grading protocol on the estate"
        caption="Screen grading — defect analysis per SCA protocol"
      />

      <TwoCol id="solera" heading="Solera carry-forward.">
        <p className="p1">
          The Solera Maceration borrows a method from sherry, where it is real and
          well understood: a living yeast film — the <Term tip="A living biofilm of Saccharomyces yeast kept alive across sherry casks for decades, each young addition feeding the established culture. A documented case of microbial continuity.">flor</Term> — is
          kept alive across casks for decades, each young barrel feeding the old
          culture. Aura carries a fraction of an actively fermenting batch forward
          into freshly harvested cherries, hoping to seed the same continuity.
        </p>
        <p className="p1">
          Can a coffee ferment actually hold a &ldquo;house culture&rdquo; across
          seasons, the way a sherry cask does? We do not know yet, and we will not
          pretend otherwise — coffee ferments are short, and no one has shown a
          strain that lasts from one season into the next. We are testing it, year
          by year. We would rather tell you that than sell you the metaphor.
        </p>
      </TwoCol>

      <TwoCol id="lab" heading="What we are building.">
        <p className="p1">
          The on-estate lab tests every lot. Brix per zone on harvest day,
          moisture tracking through drying, screen grading and defect analysis
          per SCA protocol. Every lot is cupped at the estate against a target of 80+ specialty. The scores are our own table; a third-party grading is not in yet, and until it is we publish ours as ours.
        </p>
        <p className="p1">
          The next build adds caffeine and polyphenol profiling, on-site <Term tip="SCA-certified coffee grader.">Q-grader</Term>{' '}
          certification, and a 1,200 sq ft lab with a cupping room for buyers
          who want to taste the harvest where it grew.
        </p>
        <p className="p1">
          We are not chasing trends. We are documenting what the land produces
          when you pay attention.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/coffee/aura-coffee-grading-2.jpg"
        alt="Green coffee laid out on a sorting table — second pass of screen grading at the estate lab"
        caption="Second pass — every defect logged, every screen size recorded"
      />

      <TwoCol heading="By invitation.">
        <p className="p1">
          Aura coffee is allocated — by lot, by harvest, by hand — to roasters,
          sanctuaries, and cellars that care about provenance.
        </p>
        <p className="p1">
          Promise less, deliver more. We do not roadshow. If the cup
          interests you, the estate is open.
        </p>
      </TwoCol>

      <ScrollHighlight align="left">
        {`The cup is evidence.
         The cup carries decisions inside it.
         Coffee is agricultural memory made drinkable.
         Six lots. One harvest.
         No two cups the same.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="One harvest. Six trajectories.">
        <p className="p1">
          The same Sln.9, picked on the same morning from the same block,
          becomes six different coffees depending on the ferment. We treat
          the wet mill the way a winemaker treats the cellar: separated lots,
          controlled oxygen, temperature logs, Brix and pH measured by hand
          every four hours.
        </p>
      </OneCol>

      <Continue currentHref="/coffee" />
    </>
  )
}
