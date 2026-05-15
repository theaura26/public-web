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
} from '@/components/article/Article'

export default function BiodynamicPage() {
  return (
    <>
      <HeroBanner
        currentHref="/biodynamic"
        title="Biodynamic"
        type="Detail · cattle in pen"
        caption="The BD engine — 52 Malnad Gidda"
      />

      <TwoCol heading="This is not a technique. It is a worldview.">
        <p className="p1">
          At Aura, biodynamic farming is not a certification to pursue or a
          label to put on packaging. It is a closed-loop operating system — a
          way of understanding the estate as a single organism where soil,
          plant, animal, and cosmos are connected.
        </p>
        <p className="p2">
          We practise two systems simultaneously: European biodynamic (Rudolf
          Steiner, 1924) and Vedic agricultural science (millennia older,
          orally transmitted, regionally adapted).
        </p>
        <p className="p2">
          They are not in conflict. They are two languages describing the same
          intelligence.
        </p>
      </TwoCol>

      <TwoCol id="steiner" heading="The Steiner preparations.">
        <p className="p1">
          BD 500 — horn manure. Cow dung packed into a cow horn, buried over
          winter, exhumed in spring. The microbial transformation that occurs
          underground produces a concentrate of soil-building biology. Stirred
          dynamically for one hour — creating a vortex, breaking it, reversing
          — then applied to soil in the evening, when the earth is inhaling.
        </p>
        <DataGrid cols={2}>
          <DataCard value="BD 500 — Horn manure.">Soil biology.</DataCard>
          <DataCard value="BD 501 — Horn silica.">
            Light metabolism. Foliar mist, early morning.
          </DataCard>
          <DataCard value="BD 502–507 — Compost preparations.">
            Yarrow, chamomile, nettle, oak bark, dandelion, valerian.
          </DataCard>
          <DataCard value="BD 508 — Horsetail.">
            Silica-rich spray. Fungal preventative for the monsoon.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="vedic" heading="The Vedic system.">
        <p className="p1">
          Alongside the Steiner preparations, the estate prepares and applies a
          parallel set of inputs rooted in Indian agricultural science.
        </p>
        <p className="p2">
          Aura does not abandon CPP for newer methods. We scale wisdom. We do
          not replace it.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Jeevamrit.">
            Cow dung, cow urine, jaggery, gram flour, water. Fermented 5–7
            days. Soil drench.
          </DataCard>
          <DataCard value="Panchgavya.">
            Five cow products fermented together. Foliar spray and soil
            amendment.
          </DataCard>
          <DataCard value="Beejamrit.">
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
            Ancient Vrikshayurveda preparation.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Aura · Biodynamic">
        We do not abandon CPP for newer methods. We scale wisdom. We do not
        replace it.
      </PullQuote>

      <TwoCol id="herd" heading="The herd as engine.">
        <p className="p1">
          Everything begins with the cattle. The 52 Malnad Gidda are an
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
          results — pH, EC, microbial colony counts, Trichoderma viability,
          Pseudomonas counts.
        </p>
        <p className="p2">
          The cattle rotate through blocks timed to coffee cherry development
          stages. At the right time, their presence enriches soil biology for
          the next season. At the wrong time, it compacts the ground. Timing
          is everything.
        </p>
      </TwoCol>

      <Placeholder
        type="Portrait · young Gidda calves"
        caption="Young Gidda calves — the next generation"
      />

      <TwoCol id="testing" heading="No untested material touches the soil.">
        <p className="p1">
          Every batch is tested before application. The BD application data
          stream records every variable. Every entry is cross-referenced with
          soil health outcomes over the following months.
        </p>
        <DataGrid cols={3}>
          <DataCard value="pH and EC.">Every batch.</DataCard>
          <DataCard value="Microbial colony counts.">Every batch.</DataCard>
          <DataCard value="Compost maturity.">
            Temperature, C:N ratio, moisture.
          </DataCard>
          <DataCard value="Heavy metals and pathogens.">External lab.</DataCard>
          <DataCard value="AAT chromatography.">
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
        {`This is not a technique.
         This is a worldview.
         The herd is biological infrastructure.
         We do not farm for yield.
         We farm for the next hundred years.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="The herd is biological infrastructure.">
        <p className="p1">
          Biodynamic inputs, ecological pest balance, and soil microbiome
          restoration are not features. They are not selling points. They are
          evidence of intelligence aligned with nature, not imposed upon it.
        </p>
        <p className="p2">
          The estate&rsquo;s four-story polyculture, fed by biodynamic
          preparations from indigenous cattle, sequestering four to five times
          the carbon of monoculture coffee, producing six distinct micro lots
          of specialty-grade Arabica — this is what a closed-loop operating
          system looks like when it runs for decades.
        </p>
      </OneCol>

      <Continue currentHref="/biodynamic" />
    </>
  )
}
