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

export default function FermentationPage() {
  return (
    <>
      <HeroBanner
        currentHref="/fermentation"
        title="Fermentation"
        type="Detail · fine foam on cherry ferment"
        caption="Foam lifting and collapsing on a coffee cherry ferment"
      />

      <TwoCol heading="Three disciplines. One estate.">
        <p className="p1">
          Coffee, pepper, and cow dung. Each one transforms raw material into
          something the land could not produce alone.
        </p>
        <p className="p2">
          Fermentation at Aura is not a step in a process. It is the moment
          where the estate&rsquo;s character becomes audible in flavour — or
          invisible in soil biology.
        </p>
        <p className="p2">
          We practise three fermentation disciplines, and we take each one as
          seriously as the others.
        </p>
      </TwoCol>

      <TwoCol id="coffee" heading="Coffee fermentation.">
        <p className="p1">
          Six distinct methods applied to the same Arabica cherry. The
          differences you taste are decisions, not accidents.
        </p>
        <p className="p2">
          Every lot is tracked: pH every 15 minutes, temperature three times
          daily, <Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term> at start, mid, and end. The data does not average across
          the harvest. It follows each lot as an individual.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Anaerobic Natural.">
            48 hr sealed. The cherry&rsquo;s own microbial environment does the
            work.
          </DataCard>
          <DataCard value="Dry Osmosis.">
            Dried to 45% moisture first, then 48 hr ferment. Notes: blueberry,
            fig, raisin.
          </DataCard>
          <DataCard value="Red Honey.">
            Mucilage on. 5 days thick drying, then 25 thin. Oxidation turns it
            red. &ldquo;Liquid Gold.&rdquo;
          </DataCard>
          <DataCard value="Banana Wash.">
            24 hr anaerobic, then layered with banana leaves for 48 more. The
            most distinctly Indian lot.
          </DataCard>
          <DataCard value={<><Term tip="Sherry-making technique: carry a fraction of the previous batch forward as a live mother culture.">Solera</Term> Maceration.</>}>
            Multi-cycle carry-forward. The microbial culture of one batch
            shapes every batch that follows. The flagship.
          </DataCard>
          <DataCard value="Solera Wash.">
            24 hr ferment, three-day soak, hand-washed. Highest Brix at 23%.
            The cleanest expression of the cherry.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Detail · coffee flowers in season"
        caption="Coffee flowers — the beginning of every lot"
      />

      <TwoCol id="pepper" heading="Pepper fermentation.">
        <p className="p1">
          Black pepper climbs the areca palms in the mid-canopy. It has its own
          fermentation tradition — water retting and controlled fermentation
          tracked separately from coffee.
        </p>
        <p className="p2">
          The scheduling matters: pepper and coffee fermentation share BD
          inputs, and the system must ensure their timing does not conflict.
        </p>
      </TwoCol>

      <TwoCol id="dung" heading="Cow dung fermentation.">
        <p className="p1">
          This is the discipline most people do not think of. But at Aura, the
          fermentation of cow dung into biodynamic preparations is as precise
          as the fermentation of coffee cherry.
        </p>
        <p className="p2">
          The dung batch that produced the BD preparation is tracked back to
          the individual animals that contributed to it.
        </p>
        <p className="p2">
          <Term tip="Horn manure. Cow dung packed in a cow horn, buried over winter, applied to soil at dusk.">BD 500</Term> — horn manure — begins as fresh dung from the estate&rsquo;s
          52 <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries.">Malnad Gidda</Term> cattle, packed into a cow horn, buried over winter.
          The microbial transformation that occurs underground is a
          fermentation. When it is exhumed, stirred dynamically for one hour,
          and applied to soil at dusk, it carries a specific microbial signature
          shaped by the breed, the season, the temperature, and the duration.
        </p>
      </TwoCol>

      <TwoCol id="testing" heading="No untested material touches the soil.">
        <p className="p1">
          Every batch is tested before application. The dung batch that produced
          the BD preparation is tracked back to the individual animals that
          contributed to it. Ninety days after application, soil biology
          outcomes are cross-referenced with the preparation&rsquo;s lab
          results.
        </p>
        <DataGrid cols={3}>
          <DataCard value="pH.">Every batch.</DataCard>
          <DataCard value="EC.">Every batch.</DataCard>
          <DataCard value="Microbial colony count.">Every batch.</DataCard>
          <DataCard value="Compost maturity.">
            Temperature, C:N ratio, moisture.
          </DataCard>
          <DataCard value={<><Term tip="Soil-borne fungus that suppresses plant pathogens.">Trichoderma</Term> viability.</>}>Counted.</DataCard>
          <DataCard value={<><Term tip="Soil bacteria that fix nitrogen and dissolve phosphate.">Pseudomonas</Term>.</>}>Counted.</DataCard>
          <DataCard value="Soil outcome.">
            Re-checked 90 days post-application.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        The coffee carries the flavour. The pepper carries the spice. The dung
        carries the biology.
      </PullQuote>

      <Placeholder
        type="Detail · hands cracking a cured horn"
        caption="A gloved hand cracking a cured horn to reveal BD 500"
      />

      <ScrollHighlight>
        {`Fermentation is not a process step.
         Transformation requires patience.
         One batch shapes the next.
         The dung carries the biology.
         The cup carries the flavour.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="Patience made visible.">
        <p className="p1">
          Three disciplines, three timers, one attention. Fermentation at Aura
          is not a production step. It is how the estate thinks — slowly,
          microbially, in the dark — and it is how the estate will eventually
          train a model that remembers what a good ferment smells like, hour
          by hour, season by season.
        </p>
      </OneCol>

      <Continue currentHref="/fermentation" />
    </>
  )
}
