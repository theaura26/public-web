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

      <OneCol heading="Three fermentation disciplines. One estate.">
        <p className="p1">
          Coffee, pepper, and cow dung. Each one transforms raw material into
          something the land could not produce alone.
        </p>
        <p className="p1">
          Fermentation at Aura is the moment the estate&rsquo;s character
          becomes audible in flavour — or invisible in soil biology. Every crop
          the estate values passes through it.
        </p>
        <p className="p1">
          Stripped to its definition, fermentation is only this: desired microbial
          growth and the enzyme work that comes with it — the oldest technology we
          have for turning a raw material into something more stable, more
          digestible, or more delicious. Humans have used it to keep food through
          winters, to unlock nutrients a body could not otherwise reach, and to
          make flavours that do not exist in the plant. The estate runs three of
          these conversations at once. They are not the same conversation, and it
          is worth being precise about how they differ.
        </p>
      </OneCol>

      <Placeholder
        src="/journals/fermentation/aura-coffee-flowers.jpg"
        alt="White coffee blossom on a Sln.9 branch — the start of every cherry, every lot"
        caption="Coffee flowers — the beginning of every lot"
      />

      <TwoCol id="coffee" heading="Coffee fermentation.">
        <p className="p1">
          Six distinct methods applied to the same Arabica cherry. The
          differences you taste are decisions, not accidents.
        </p>
        <p className="p1">
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
        <p className="p1">
          Six methods, one cherry. The full lot-by-lot file — yields, immature
          counts, drying timelines, cupping notes — lives on the{' '}
          <a href="/coffee">Our Coffee Story</a> page.
        </p>
      </TwoCol>

      <TwoCol id="pepper" heading="Pepper fermentation.">
        <p className="p1">
          Black pepper climbs the areca palms in the mid-canopy. It has its own
          fermentation tradition — water retting and controlled fermentation
          tracked separately from coffee.
        </p>
        <p className="p1">
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

      <TwoCol id="dung" heading="Cow dung fermentation.">
        <p className="p1">
          This is the one most people never picture as fermentation, and strictly
          it is a close cousin: a microbial decomposition, a composting in
          miniature. It earns the name honestly. Metabarcoding of horn manure shows
          a real succession underground, one microbial community handing off to the
          next as the months pass.
        </p>
        <p className="p1">
          <Term tip="Horn manure. Cow dung packed in a cow horn, buried over the cool months, then stirred into water and applied to soil.">BD 500</Term> begins as fresh dung from the estate&rsquo;s
          52 <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries.">Malnad Gidda</Term>, packed into a horn and buried. What we
          claim for it is the microbiology: a decomposition shaped by the breed, the
          season, and the soil it lies in. The cosmology around it — the lunar
          timing, the talk of the earth breathing — is poetry a century old, and
          poetry has never survived a trial. We keep these preparations for the
          biology in them, which is real, and we measure it.
        </p>
      </TwoCol>

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
        Flavour is CULTURED — grown, in the dark, by things too small to see.
      </PullQuote>

      <ScrollHighlight>
        {`Fermentation is transformation.
         It asks only for patience.
         One batch shapes the next.
         The dung carries the biology.
         The cup carries the flavour.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="Patience made visible.">
        <p className="p1">
          Three disciplines, three timers, one attention. Fermentation at Aura
          is how the estate thinks — slowly, microbially, in the dark — and it
          is how the estate will eventually train a model that remembers what a
          good ferment smells like, hour by hour, season by season.
        </p>
      </OneCol>

      <Continue currentHref="/fermentation" />
    </>
  )
}
