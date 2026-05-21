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

      <Placeholder
        src="/journals/fermentation/aura-coffee-flowers.jpg"
        alt="White coffee blossom on a Sln.9 branch — the start of every cherry, every lot"
        caption="Coffee flowers — the beginning of every lot"
      />

      <TwoCol heading="Three fermentation disciplines. One estate.">
        <p className="p1">
          Coffee, pepper, and cow dung. Each one transforms raw material into
          something the land could not produce alone.
        </p>
        <p className="p2">
          Fermentation at Aura is not a step in a process. It is the moment
          where the estate&rsquo;s character becomes audible in flavour — or
          invisible in soil biology.
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
        <p className="p2">
          <strong>Anaerobic Natural:</strong> 48 hours sealed. The simplest
          method, and the one where the cherry&rsquo;s own microbial environment
          does the work.
        </p>
        <p className="p2">
          <strong>Dry Osmosis:</strong> dried to 45% moisture first, then
          fermented. Patience before process. The partial drying concentrates
          sugars and shifts the microbial starting point. The cup carries
          blueberry, fig, raisin.
        </p>
        <p className="p2">
          <strong>Red Honey:</strong> fermented, pulped, but the mucilage stays
          on. Five days of thick drying, then 25 thin. The mucilage sugars
          absorb slowly into the bean. Oxidation turns it red. Named
          &ldquo;Liquid Gold&rdquo; at its first public tasting.
        </p>
        <p className="p2">
          <strong>Banana Wash:</strong> 24 hours anaerobic, then layered with
          banana leaves for 48 more. The leaves contribute wild yeasts,
          enzymes, and a micro-environment that imparts tropical character.
          Indigenous technique refined with precision controls — pH,
          temperature, humidity monitored throughout. The most distinctly
          Indian lot we produce.
        </p>
        <p className="p2">
          <strong>Solera Maceration:</strong> borrowed from sherry production.
          During the first fermentation phase, actively fermenting cherries
          are mixed with freshly harvested ones — the Solera carry-forward.
          The microbial culture of one batch shapes every batch that follows.
          Alternating fermentation and rest cycles. Day-night drying rhythm.
          770 kg total. The flagship.
        </p>
        <p className="p2">
          <strong>Solera Wash:</strong> the rarest lot at 620 kg. Highest Brix
          at 23%. Fermented 24 hours, pulped, soaked three days in water,
          hand-washed. Everything non-essential removed. The cleanest
          expression of the cherry.
        </p>
      </TwoCol>

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

      <Placeholder
        src="/journals/fermentation/aura-pepper.mp4"
        mediaType="video"
        poster="/journals/fermentation/aura-pepper.jpg"
        alt="Black pepper berries on the vine — Malabar pepper climbing an areca palm in the mid-canopy"
        caption="Malabar pepper on the vine — mid-canopy companion to the areca palm"
      />

      <DataGrid cols={2} standalone>
        <DataCard
          img="/journals/fermentation/aura-experimental-anaerobic.jpg"
          alt="Sealed stainless tanks for experimental anaerobic ferments — pH and temperature logged hour by hour"
          value="Sealed. Logged."
        >
          Experimental anaerobic coffee tanks. pH every fifteen minutes,
          temperature three times daily, Brix start to end. Every lot is a
          tracked individual, not an average.
        </DataCard>
        <DataCard
          img="/journals/fermentation/aura-water-pepper.jpg"
          alt="Black peppercorns retting in water — the first stage of pepper fermentation"
          value="Retted. Released."
        >
          Pepper&apos;s first stage. Water softens the pericarp, microbial
          activity loosens the skin, and the discipline that scheduled it
          waits on the BD calendar to clear.
        </DataCard>
      </DataGrid>

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
        The COFFEE carries the FLAVOUR. The PEPPER carries the SPICE. The DUNG
        carries the BIOLOGY.
      </PullQuote>

      <Placeholder
        src="/journals/fermentation/aura-horn.jpg"
        alt="A cured cow horn cracked open to reveal BD 500 — biodynamic preparation 500 made from cow dung"
        caption="A gloved hand cracking a cured horn to reveal BD 500"
      />

      <PullQuote>
        MICROBIAL SIGNATURE is the slowest MOAT. DECADES to build,
        IMPOSSIBLE to copy.
      </PullQuote>

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
