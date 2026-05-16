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

      <TwoCol heading="Six lots. One harvest. No two cups the same.">
        <p className="p1">
          Arabica grown at 3,600 feet beneath a four-story canopy. Every lot
          is a document of place and method.
        </p>
        <p className="p2">
          Aura is not a coffee company. Coffee is the primary crop, but the
          estate is the system. The cup that reaches you carries the character
          of canopy shade, laterite soil, monsoon rhythm, and the specific
          decisions made during fermentation — down to the hour.
        </p>
      </TwoCol>

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
          canopy in the <Term tip="Mountain range along India's west coast. UNESCO biodiversity hotspot; over 7,000 plant species.">Western Ghats</Term>. Two cultivars — <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka. Floral, citric.">Sln.9</Term> and <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>.
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

      <TwoCol id="lots" heading="The lots.">
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

      <DataGrid cols={3} standalone>
        <DataCard type="Process · sealed tanks" value="Lot 001 — Anaerobic Natural.">
          11,984 kg harvest, 1,151 kg immature removed, 878 kg floats. 48 hr
          sealed ferment. Water <Term tip="Total dissolved solids. Mineral load in the ferment water, in parts per million.">TDS</Term> 29.28 ppm. 22 days drying on raised beds.
          The simplest method — where the cherry&rsquo;s own microbial
          environment does the work.
        </DataCard>
        <DataCard type="Process · partial dry, then ferment" value="Lot 002 — Dry Osmosis.">
          8,726 kg harvest, 229 kg immature (lowest ratio, exceptional
          selection), 720 kg floats. <Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term> 19.55%. Dried to 45% moisture, then
          48 hr anaerobic. 25 days drying. Notes: blueberry, fig, raisin.
        </DataCard>
        <DataCard type="Detail · sticky mucilage on parchment" value="Lot 003 — Red Honey · &ldquo;Liquid Gold&rdquo;.">
          6,715 kg harvest, 880 kg immature, 511 kg floats. Brix 19.25%. 48 hr
          anaerobic, pulped with mucilage on. 5 days thick drying, then 25
          days thin. Named &ldquo;Liquid Gold&rdquo; by Boojee Mumbai. Notes:
          honey, caramel, nutty.
        </DataCard>
        <DataCard type="Detail · banana leaves layering" value="Lot 004 — Banana Wash.">
          8,086 kg harvest, 1,241 kg immature, 673 kg floats. Brix 19.25%. 24 hr
          anaerobic, then pulped and layered with banana leaves for 48 hr more.
          The leaves contribute wild yeasts and a micro-environment. The most
          distinctly Indian lot.
        </DataCard>
        <DataCard type="Process · solera tanks, transfer lines" value="Lot 005 — Solera Maceration · Flagship.">
          770 kg harvest, 179 kg immature, 80 kg floats. Brix 18%. Water TDS
          42 ppm. Three-day initial ferment, 50% carry-forward into freshly
          harvested cherries — the <Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera</Term> carry-forward. Alternating two-day ferment and rest. Day-night
          drying to 12% moisture. The flagship.
        </DataCard>
        <DataCard type="Detail · hand-washed beans" value="Lot 006 — Solera Wash · Rarest.">
          620 kg harvest, 146 kg immature, 75 kg floats. Brix 23% — the highest
          of any lot. 24 hr ferment, three-day soak, hand-washed, raised-bed
          dry. Highest sugar, then everything non-essential stripped away.
          Ascetic focus applied to coffee.
        </DataCard>
      </DataGrid>

      <PullQuote>
        The choices made by one batch shape every batch that follows. This is
        not metaphor. It is microbiology.
      </PullQuote>

      <Placeholder
        type="Process · screen grading"
        caption="Screen grading — defect analysis per SCA protocol"
      />

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
          By Year 3: caffeine and polyphenol profiling via colorimeter, <Term tip="SCA-certified coffee grader.">Q-grader</Term>{' '}
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
