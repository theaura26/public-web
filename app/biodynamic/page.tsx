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

export default function BiodynamicPage() {
  return (
    <>
      <HeroBanner
        currentHref="/biodynamic"
        src="/journals/biodynamic/aura-biodynamic.mp4"
        mediaType="video"
        poster="/journals/biodynamic/aura-biodynamic.jpg"
        title="Biodynamic"
        type="Detail · cattle in pen"
        caption="The estate as one living organism"
        alt="The estate working as one organism — biodynamic practice across canopy, herd, and soil"
      />

      <TwoCol heading="Biodynamic is a worldview.">
        <p className="p1">
          BD 500 through 508. Jeevamrit. Panchgavya. Two ancient farming
          intelligences working together on one estate.
        </p>
        <p className="p2">
          At Aura, biodynamic farming is a closed-loop operating system — a
          way of understanding the estate as a single organism where soil,
          plant, animal, and cosmos are connected.
        </p>
        <p className="p2">
          We practise two systems simultaneously: European biodynamic (Rudolf
          Steiner, 1924) and Vedic agricultural science (millennia older,
          orally transmitted, regionally adapted).
        </p>
        <p className="p2">
          Two languages describing the same intelligence.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/biodynamic/aura-young-calves-1.jpg"
        alt="A Malnad Gidda calf standing in the morning shade — the next generation of the herd"
        caption="The next generation — the herd that will run the next hundred years"
      />

      <TwoCol id="steiner" heading="The Steiner preparations.">
        <p className="p1">
          <Term tip="Horn manure. Cow dung packed in a cow horn, buried over winter, applied to soil at dusk.">BD 500</Term> — horn manure. Cow dung packed into a cow horn, buried over
          winter, exhumed in spring. The microbial transformation that occurs
          underground produces a concentrate of soil-building biology. Stirred
          dynamically for one hour — creating a vortex, breaking it, reversing
          — then applied to soil in the evening, when the earth is inhaling.
        </p>
        <DataGrid cols={2}>
          <DataCard value="BD 500 — Horn manure.">
            Cow dung buried in a horn over winter. Soil biology, applied at
            dusk.
          </DataCard>
          <DataCard value={<><Term tip="Horn silica. Ground quartz buried over summer, sprayed as fine mist for light metabolism.">BD 501</Term> — Horn silica.</>}>
            Ground quartz buried over summer. Foliar mist at first light.
            Light metabolism in the leaf.
          </DataCard>
          <DataCard value={<><Term tip="Compost preparations: yarrow, chamomile, nettle, oak bark, dandelion, valerian.">BD 502–507</Term> — Compost preparations.</>}>
            Yarrow, chamomile, nettle, oak bark, dandelion, valerian. Tiny
            doses, added to the heap to regulate decomposition.
          </DataCard>
          <DataCard value={<><Term tip="Horsetail spray. Silica-rich, used as a fungal preventative through the monsoon.">BD 508</Term> — Horsetail.</>}>
            Silica-rich foliar spray. The fungal preventative for the
            monsoon-heavy Ghats.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="vedic" heading="The Vedic system.">
        <p className="p1">
          Alongside the Steiner preparations, the estate prepares and applies a
          parallel set of inputs rooted in Indian agricultural science —
          <Term tip="Cow pat pit. Composted dung layered with BD preparations, fermented ninety days.">CPP</Term>,
          Jeevamrit, Panchgavya, Beejamrit, and older preparations from the
          Vrikshayurveda lineage.
        </p>
        <p className="p2">
          The two systems are not in competition. Each carries a piece of the
          same underlying observation: feed the soil, not the plant; close the
          loop; let the cow do most of the work.
        </p>
        <DataGrid cols={3}>
          <DataCard value={<><Term tip="Cow dung, cow urine, jaggery, gram flour, water. Fermented 5–7 days. Soil drench.">Jeevamrit</Term>.</>}>
            Cow dung, cow urine, jaggery, gram flour, water. Fermented 5–7
            days. Soil drench.
          </DataCard>
          <DataCard value={<><Term tip="Five cow products (dung, urine, milk, curd, ghee) fermented together. Foliar and soil.">Panchgavya</Term>.</>}>
            Five cow products fermented together. Foliar spray and soil
            amendment.
          </DataCard>
          <DataCard value={<><Term tip="Seed treatment of cow dung, cow urine, and lime.">Beejamrit</Term>.</>}>
            Cow dung, cow urine, lime. Seed treatment.
          </DataCard>
          <DataCard value="CPP.">
            Cow pat pit. Composted dung with BD compost preparations. Field
            spray.
          </DataCard>
          <DataCard value="Buttermilk + coconut.">Foliar.</DataCard>
          <DataCard value="Matka khad.">Pot compost, slow-fermented.</DataCard>
          <DataCard value="Vermicompost tea.">Soil drench.</DataCard>
          <DataCard value="Vermiwash.">Liquid extract from worm castings.</DataCard>
          <DataCard value="Kunapjal.">
            Ancient <Term tip="Ancient Indian plant science. Older than written agriculture.">Vrikshayurveda</Term> preparation.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        src="/journals/biodynamic/aura-bee-video.mp4"
        mediaType="video"
        poster="/journals/biodynamic/aura-bee-video.jpg"
        alt="A honeybee working a flower — pollinators in the closed-loop biology of the estate"
        caption="Pollinators — the closed loop runs through them too"
      />

      <PullQuote>
        We do not abandon CPP for newer methods. We SCALE WISDOM. We do not
        REPLACE it.
      </PullQuote>

      <TwoCol id="herd" heading="The herd as engine.">
        <p className="p1">
          Everything begins with the cattle. The 52 <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries.">Malnad Gidda</Term> are an
          indigenous Karnataka breed — not Holsteins, not Jersey crosses. They
          have grazed at this altitude for centuries. Their gut microbiome is
          adapted to the estate&rsquo;s grasses and soil. Their dung carries
          microbial characteristics specific to this breed, this land, this
          climate.
        </p>
        <p className="p2">
          The dung drives BD 500, CPP, Jeevamrit, Panchgavya, and compost
          activation. The system tracks which animals contributed to which
          preparation batch. Ninety days after application, soil biology
          outcomes are cross-referenced with the preparation&rsquo;s lab
          results — pH, EC, microbial colony counts, <Term tip="Soil-borne fungus that suppresses plant pathogens.">Trichoderma</Term> viability,
          <Term tip="Soil bacteria that fix nitrogen and dissolve phosphate.">Pseudomonas</Term> counts.
        </p>
        <p className="p2">
          The cattle rotate through blocks timed to coffee cherry development
          stages. At the right time, their presence enriches soil biology for
          the next season. At the wrong time, it compacts the ground. Timing
          is everything. Right time, right action.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/biodynamic/aura-young-calves.jpg"
        alt="Two young Malnad Gidda calves in the pen — indigenous Karnataka breed adapted to the Western Ghats"
        caption="Young Gidda calves — the next generation"
      />

      <TwoCol id="testing" heading="No untested material touches the soil.">
        <p className="p1">
          Every batch is tested before application. The BD application data
          stream records which crop layer was targeted, which blocks received
          the application, the lunar calendar day, the weather at the moment
          of spraying, the field worker, and the dung source batch. Every
          entry is cross-referenced with soil health outcomes over the
          following months.
        </p>
        <DataGrid cols={3}>
          <DataCard value="pH and EC.">Every batch.</DataCard>
          <DataCard value="Microbial colony counts.">Every batch.</DataCard>
          <DataCard value="Compost maturity.">
            Temperature, C:N ratio, moisture.
          </DataCard>
          <DataCard value="Heavy metals and pathogens.">External lab.</DataCard>
          <DataCard value={<><Term tip="Soil vitality imaging: a chromatogram pattern read from filter paper.">AAT chromatography</Term>.</>}>
            BD soil vitality imaging.
          </DataCard>
          <DataCard value="Spray teams.">Three in-house BD teams.</DataCard>
          <DataCard value="Buffer days.">Three per monthly schedule.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="onchain" heading="On chain.">
        <p className="p1">
          The BD seasonal cycle — a full year of preparations applied, tested,
          and recorded — is sealed on the blockchain as a permanent, verifiable
          event.
        </p>
        <p className="p2">
          Organic and biodynamic certification evidence becomes unfakeable: it
          is cross-referenced against weather data, lunar records, and soil
          outcomes that cannot be retroactively altered.
        </p>
        <p className="p2">
          This is not certification theatre. This is the practice, recorded
          with integrity, made permanent.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Biodynamic is a worldview.
         The herd is biological infrastructure.
         We farm for the next hundred years.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="The herd is biological infrastructure.">
        <p className="p1">
          Biodynamic inputs, ecological pest balance, soil microbiome
          restoration — these are not features and not selling points. They
          are evidence of intelligence aligned with nature, not imposed on
          it.
        </p>
        <p className="p2">
          A four-story polyculture, fed by preparations from indigenous
          cattle, building soil carbon decade over decade. This is what a
          closed-loop operating system looks like when it has been running
          long enough to forget where it started.
        </p>
      </OneCol>

      <Continue currentHref="/biodynamic" />
    </>
  )
}
