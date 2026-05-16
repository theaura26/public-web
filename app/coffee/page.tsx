import {
  HeroBanner,
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
      <HeroBanner
        currentHref="/coffee"
        title="Our Coffee Story"
        type="Detail · coffee flower buds"
        caption="Coffee flowers — the beginning of every lot"
      />

      <TwoCol heading="The cup is evidence.">
        <p className="p1">
          Coffee is often discussed through flavour notes alone. But flavour is
          accumulated consequence.
        </p>
        <p className="p2">
          Every cup contains decisions made months earlier: canopy management,
          microbial health, rainfall timing, fermentation discipline, drying
          rhythm, and restraint.
        </p>
        <p className="p2">
          Aura grows shade-grown Arabica at 3,600 feet beneath a four-story
          canopy in the <Term tip="Mountain range along India's west coast. UNESCO biodiversity hotspot; over 7,000 plant species.">Western Ghats</Term>. Two cultivars — <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka. Floral, citric.">Sln.9</Term> and <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>. Every
          lot is a document of place and method.
        </p>
      </TwoCol>

      <TwoCol id="rules" heading="The rules.">
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
          <DataCard value="3–5×">Carbon vs monoculture.</DataCard>
          <DataCard value="UNESCO">Biodiversity zone.</DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Aura · Coffee">
        The cup is not the product. The cup is proof.
      </PullQuote>

      <TwoCol id="lots" heading="Six lots. One harvest. No two cups the same.">
        <p className="p1">
          Six distinct micro lots each harvest. Each is a different processing
          method applied to the same Arabica cherries from the same land.
        </p>
        <p className="p2">
          The differences in the cup are the result of fermentation decisions —
          not terroir alone, but terroir expressed through technique.
        </p>
        <p className="p2">
          These are not targets. They are the climate of the estate, printed
          into the bean.
        </p>
      </TwoCol>

      <TwoCol id="lot-001" heading="Lot 001 — Anaerobic Natural.">
        <p className="p1">
          Cherries washed, floats removed, transferred to sealed containers,
          fermented 48 hours under controlled conditions. Moved to raised beds
          for 22 days of slow drying. The simplest method — and the one where
          the cherry&rsquo;s own microbial environment does the work.
        </p>
        <DataGrid>
          <DataCard value="11,984 kg">Harvest.</DataCard>
          <DataCard value="1,151 kg">Immature removed.</DataCard>
          <DataCard value="878 kg">Floats.</DataCard>
          <DataCard value="48 hr">Fermentation.</DataCard>
          <DataCard value="29.28 ppm">Water <Term tip="Total dissolved solids. Mineral load in the ferment water, in parts per million.">TDS</Term>.</DataCard>
          <DataCard value="22 days">Drying.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="lot-002" heading="Lot 002 — Dry Osmosis.">
        <p className="p1">
          The innovation: cherries are dried to 45% moisture first, then
          fermented anaerobically for 48 hours. Partial drying before
          fermentation concentrates sugars and shifts the microbial
          environment. Only 229 kg immature removed — the lowest ratio,
          indicating exceptional selection at harvest. Notes: blueberry · fig
          · raisin.
        </p>
        <DataGrid>
          <DataCard value="8,726 kg">Harvest.</DataCard>
          <DataCard value="229 kg">Immature removed.</DataCard>
          <DataCard value="720 kg">Floats.</DataCard>
          <DataCard value="19.55%"><Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term>.</DataCard>
          <DataCard value="48 hr">Anaerobic ferment.</DataCard>
          <DataCard value="25 days">Drying.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="lot-003" heading="Lot 003 — Red Honey · &ldquo;Liquid Gold&rdquo;.">
        <p className="p1">
          Fermented 48 hours anaerobically, then pulped — but the mucilage is
          kept on. The sticky fruit layer slowly absorbs into the bean during
          5 days of thick drying, then 25 days thin on raised beds. The red
          colour comes from oxidation. Named &ldquo;Liquid Gold&rdquo; by
          Boojee Mumbai — the first lot from Aura to carry a name. Notes:
          honey · caramel · nutty.
        </p>
        <DataGrid>
          <DataCard value="6,715 kg">Harvest.</DataCard>
          <DataCard value="880 kg">Immature removed.</DataCard>
          <DataCard value="511 kg">Floats.</DataCard>
          <DataCard value="19.25%">Brix.</DataCard>
          <DataCard value="48 hr">Anaerobic ferment.</DataCard>
          <DataCard value="5 + 25 days">Drying.</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Process · screen grading"
        caption="Screen grading — defect analysis per SCA protocol"
      />

      <TwoCol id="lot-004" heading="Lot 004 — Banana Wash.">
        <p className="p1">
          24 hours anaerobic natural, then pulped and layered with banana
          leaves for 48 more. The leaves contribute natural yeasts and
          enzymes, create a micro-environment, and impart tropical notes. pH,
          temperature, and humidity controlled throughout. The most distinctly
          Indian lot. Indigenous technique meets precision.
        </p>
        <DataGrid>
          <DataCard value="8,086 kg">Harvest.</DataCard>
          <DataCard value="1,241 kg">Immature removed.</DataCard>
          <DataCard value="673 kg">Floats.</DataCard>
          <DataCard value="19.25%">Brix.</DataCard>
          <DataCard value="24 + 48 hr">Fermentation.</DataCard>
          <DataCard value="30.37 ppm">Water TDS.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="lot-005" heading="Lot 005 — Solera Maceration · Flagship.">
        <p className="p1">
          The smallest, most precious lot. Borrowed from sherry-making: 100%
          ripe cherries, floatation-sorted, sealed in stainless-steel tanks.
          Three-day initial fermentation. During the first phase only, 50% of
          actively fermenting cherries are mixed with freshly harvested
          cherries — the <Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera</Term> carry-forward. After the initial cycle:
          alternating two-day fermentation and raised-bed resting phases.
          Final drying follows a day-night rhythm — raised beds by day,
          breathable bags by night — down to 12% moisture.
        </p>
        <DataGrid>
          <DataCard value="770 kg">Harvest.</DataCard>
          <DataCard value="179 kg">Immature removed.</DataCard>
          <DataCard value="80 kg">Floats.</DataCard>
          <DataCard value="18%">Brix.</DataCard>
          <DataCard value="42 ppm">Water TDS.</DataCard>
          <DataCard value="Multi-cycle">Process.</DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        The choices made by one batch shape every batch that follows. This is
        not metaphor. It is microbiology.
      </PullQuote>

      <TwoCol id="lot-006" heading="Lot 006 — Solera Wash · Rarest.">
        <p className="p1">
          The rarest lot. Highest sugar content of any lot at 23% Brix.
          24-hour controlled fermentation, pulped, soaked in water for three
          days, hand-washed, dried on raised beds. The cleanest, most
          restrained process. Highest sugar, then everything non-essential
          stripped away. Ascetic focus applied to coffee.
        </p>
        <DataGrid>
          <DataCard value="620 kg">Harvest.</DataCard>
          <DataCard value="146 kg">Immature removed.</DataCard>
          <DataCard value="75 kg">Floats.</DataCard>
          <DataCard value="23%">Brix.</DataCard>
          <DataCard value="24 hr">Fermentation.</DataCard>
          <DataCard value="3 days">Soak.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="solera" heading="Solera carry-forward.">
        <p className="p1">
          The Solera Maceration borrows from sherry production. During the
          first fermentation phase, actively fermenting cherries are mixed with
          freshly harvested ones. The microbial culture of one batch shapes
          every batch that follows.
        </p>
        <p className="p2">
          Over seasons, the microbial community on this estate becomes a
          character of its own — a signature that belongs to this land and no
          other. Appellation, in microbial form.
        </p>
      </TwoCol>

      <TwoCol id="lab" heading="What we are building.">
        <p className="p1">
          The on-estate lab tests every lot. Brix per zone on harvest day,
          moisture tracking through drying, screen grading and defect analysis
          per SCA protocol. Every lot is cupped — target 80+ specialty.
        </p>
        <p className="p2">
          By Year 3: caffeine and polyphenol profiling via colorimeter, <Term tip="SCA-certified coffee grader.">Q-grader</Term>
          certification on-site, and a purpose-built 1,200 sq ft lab with a
          professional cupping room for buyer visits.
        </p>
        <p className="p2">
          We are not chasing trends. We are documenting what the land produces
          when you pay attention.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`The cup is evidence.
         The cup carries decisions inside it.
         Coffee is agricultural memory made drinkable.
         Six lots. One harvest.
         No two cups the same.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="One harvest. Six trajectories.">
        <p className="p1">
          The same Sln.9, picked on the same morning from the same block, can
          become six profoundly different coffees depending on the ferment. We
          treat the wet mill the way a winemaker treats the cellar: separated
          lots, controlled oxygen, temperature logs, Brix and pH measured by
          hand every four hours.
        </p>
      </OneCol>

      <Continue currentHref="/coffee" />
    </>
  )
}
