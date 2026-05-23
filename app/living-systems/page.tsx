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

export default function LivingSystemsPage() {
  return (
    <>
      <HeroBanner
        currentHref="/living-systems"
        title="Living Systems"
        type="Aerial · four-story canopy"
        caption="Read the land first — relationships over isolated variables"
      />

      <TwoCol heading="A forest that produces crops. Not a farm that plants trees.">
        <p className="p1">
          150 acres of four-story polyculture in the <Term tip="Mountain range along India's west coast. UNESCO biodiversity hotspot; over 7,000 plant species.">Western Ghats</Term>, read as a
          single living dataset.
        </p>
        <p className="p2">
          Most agricultural systems isolate variables. Aura studies
          relationships instead. The estate is not divided by crop; it is
          divided by block — because the unit of record is the land, not the
          product.
        </p>
      </TwoCol>

      <TwoCol id="estate" heading="The estate, in numbers.">
        <DataGrid cols={3}>
          <DataCard value="150">Acres under care.</DataCard>
          <DataCard value="3,600 ft">Altitude in the Western Ghats.</DataCard>
          <DataCard value="35,000">Individual trees.</DataCard>
          <DataCard value="52">Malnad Gidda cattle, indigenous.</DataCard>
          <DataCard value="3–5×">Carbon sequestration vs monoculture.</DataCard>
          <DataCard value="UNESCO">Biodiversity zone.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="layers" heading="Four stories, one canopy.">
        <p className="p1">
          The estate operates through four canopy layers. Every layer
          influences the next.
        </p>
        <p className="p2">
          From the silver oak overhead to the cardamom on the floor, each
          story holds the conditions for the one below it — and reads as a
          signal for what the next will do. The relationships matter more
          than the layers themselves.
        </p>
      </TwoCol>

      <DataGrid cols={4} standalone>
        <DataCard
          video="/journals/living-systems/aura-canopy.mp4"
          poster="/journals/living-systems/aura-canopy.jpg"
          alt="Looking up through the four-story canopy at Sampigelkhan Estate — silver oak and jackfruit moving in the wind"
          value="01 — Canopy."
        >
          Silver oak, Albizzia, jackfruit, fig, native hardwoods. Target cover
          60–80% per block. Blocks with 65–75% canopy produce measurably higher
          Brix in the coffee beneath them.
        </DataCard>
        <DataCard
          img="/journals/living-systems/aura-mid-canopy.jpg"
          alt="Arecanut palms rising through the shade with black pepper vines climbing them"
          value="02 — Mid-canopy."
        >
          Arecanut palms rise through the shade. Black pepper climbs them —
          each areca palm simultaneously a trellis and a companion. If an areca
          column stresses, the pepper vine loses vigour within six to eight
          weeks.
        </DataCard>
        <DataCard
          video="/journals/living-systems/aura-primary-crop.mp4"
          poster="/journals/living-systems/aura-primary-crop.jpg"
          alt="Arabica Sln.9 and Sln.795 cherries ripening beneath the four-story canopy"
          value="03 — Primary crop."
        >
          Arabica <Term tip="Selection 9. Ethiopian-hybrid Arabica bred at the Central Coffee Research Institute, Karnataka. Floral, citric.">Sln.9</Term> and <Term tip="Selection 795. Kents × S.288 Arabica cross, released 1946. Vigorous; cocoa-malt body under shade.">Sln.795</Term>. Thirty-five acres of tea, in organic
          transition targeting 2027. Every input logged against the transition
          clock. A single prohibited substance resets it.
        </DataCard>
        <DataCard
          img="/journals/living-systems/aura-understorey.jpg"
          alt="Cardamom, cover crops and beehives on the forest floor — the understorey layer"
          value="04 — Understorey."
        >
          Cardamom, cacao, avocado, cover crops, beehives, chickens. Hives
          connect the flowering seasons across every layer. When activity drops
          during flowering, it predicts lower cherry set four to six weeks
          ahead.
        </DataCard>
      </DataGrid>

      <Placeholder
        src="/journals/biodynamic/aura-bee-video.mp4"
        mediaType="video"
        poster="/journals/biodynamic/aura-bee-video.jpg"
        alt="A honeybee working a flower head — the hives that connect the four layers' flowering seasons"
        caption="Hives — the connective signal across every layer"
      />

      <TwoCol id="herd" heading="The herd is biological infrastructure.">
        <p className="p1">
          Fifty-two Malnad Gidda cattle — an indigenous Karnataka breed adapted
          to this altitude, soil, and climate over centuries.
        </p>
        <p className="p2">
          They rotate through blocks timed to coffee cherry development stages.
          Their dung drives every biodynamic preparation on the estate. They
          are not assets. They are participants in a biological system.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/living-systems/aura-cow.jpg"
        alt="A Malnad Gidda at pasture — indigenous Karnataka breed in the block rotation"
        caption="A Malnad Gidda at pasture — rotation timed to cherry stage"
      />

      <TwoCol id="data" heading="Nine streams of continuous data.">
        <p className="p1">
          The estate generates nine streams of continuous data. Each one is
          useful; the value is in being able to read them together.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Coffee fermentation.">
            pH every 15 min, temperature 3× daily, Brix start to end.
          </DataCard>
          <DataCard value="BD applications.">
            Crop layer, blocks, lunar day, weather, worker, dung batch.
          </DataCard>
          <DataCard value="Soil health.">
            pH and moisture at 5 cm and 20 cm, quarterly.
          </DataCard>
          <DataCard value="Carbon & biodiversity.">
            Multi-story canopy and species count, annual.
          </DataCard>
          <DataCard value="Cattle & dung cycle.">
            Pasture, health, rotation timing per block.
          </DataCard>
          <DataCard value="Canopy health.">
            <Term tip="Normalised Difference Vegetation Index. Satellite-derived canopy vitality reading.">NDVI</Term> per block, quarterly.
          </DataCard>
          <DataCard value="Pepper & areca.">
            Column health, vine density, fermentation.
          </DataCard>
          <DataCard value="Tea transition.">
            Start date, estimated certification 2027.
          </DataCard>
          <DataCard value="Understorey & bees.">
            Hive weight, honey harvest, activity windows.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        SOIL HEALTH readings thirty days after cover-crop incorporation predict
        the FLAVOUR PROFILE of the coffee lot that block will produce.
      </PullQuote>

      <TwoCol id="signals" heading="The signals between.">
        <p className="p1">
          The intelligence lives in the cross-references.
        </p>
        <p className="p2">
          Canopy density predicts coffee cherry Brix. Areca health signals
          pepper yield weeks early. Cattle rotation timing shapes soil biology
          for the next season. Beehive activity forecasts flowering quality.
          Dung batch quality determines BD preparation potency. Cover crop
          biomass after incorporation predicts fermentation character.
        </p>
        <p className="p2">
          This is what we mean by a living system. The estate has a heartbeat
          — short pulses from sensors, medium rhythms from crop lifecycles,
          long arcs from ecosystem health measured across decades.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/living-systems/aura-cow-eye.mp4"
        mediaType="video"
        poster="/journals/living-systems/aura-cow-eye.jpg"
        alt="Close-up of a Malnad Gidda's eye — the indigenous Karnataka breed reading the land"
        caption="The eye that reads the signals — Malnad Gidda"
      />

      <ScrollHighlight>
        {`Most farms track a crop.
         Aura tracks an ecosystem.
         Every layer talks to every other layer.
         The forest is the farm.`}
      </ScrollHighlight>

      <OneCol id="data-store" heading="Where the data lives.">
        <p className="p1">
          The granular data — every sensor reading, every field action, every BD
          application log — lives in the Farm OS, built on NocoDB, stored in
          open formats. Readable without any specific software, in plain text
          and timestamps that outlive any vendor.
        </p>
        <p className="p2">
          The milestones — a coffee lot lifecycle completed, a BD seasonal cycle
          finished, an annual carbon baseline, an organic certification event —
          go on-chain. Permanent, public, verifiable.
        </p>
        <p className="p2">
          The system must outlast any technology it is built on. Complexity in
          the machine. Simplicity in the field.
        </p>
      </OneCol>

      <Continue currentHref="/living-systems" />
    </>
  )
}
