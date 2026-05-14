import {
  ArticleHero,
  Section,
  TwoCol,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  PullStat,
  SideBySide,
  Continue,
} from '@/components/article/Article'

export default function CoffeePage() {
  return (
    <>
      <ArticleHero
        title="Six Lots, One Appellation."
        subline="One hundred acres of specialty Arabica at 3,600 ft, shade-grown under areca and native canopy in the Western Ghats. Six separated lots in the wine tradition, one flagship at 83.5. Coffee is not the commodity we grow; it is the language we speak."
        toc={[
          { q: 'What is the terroir?', href: '#terroir' },
          { q: 'Which varieties grow here?', href: '#varieties' },
          { q: 'What are the six lots?', href: '#lots' },
          { q: 'What is the flagship?', href: '#lot-002' },
          { q: 'How can buyers work with us?', href: '#buyers' },
        ]}
      />

      <Placeholder
        label="Hero — coffee cherries at harvest"
        note="Tight macro of a fully ripe Sln.9 cherry on the branch, dew still on it. Red laterite soil blurred in background. Vertical or 4:5 preferred for the flagship hero."
        aspect="4 / 5"
      />

      {/* TERROIR */}
      {/* eyebrow was: "Terroir" */}
      <TwoCol id="terroir" heading="Red laterite, ancient mountains.">
        <P>
          Our estate sits on the western slopes of the Chikkamagaluru range at an elevation of
          {' '}<strong>3,600 ft</strong>. The soil is deep red laterite over gneiss — iron-rich,
          acidic, free-draining. The Western Ghats carry a UNESCO World Heritage designation not
          because they are scenic but because they are genetically old: over 7,000 plant species,
          one of the eight hottest biodiversity hotspots on earth.
        </P>
        <P>
          Rainfall on the estate ranges between <strong>40" and 100"</strong> a year, delivered
          almost entirely between June and September. The monsoon arrives as a wall, not a
          drizzle. Coffee cherries ripen in the cool, misted second half of the year, and are
          harvested in <strong>Nov – Feb</strong>.
        </P>
        <P>
          Nothing on this estate grows in direct sun. Every coffee plant is shaded by an areca, a
          jackfruit, a silver oak, or a native honne. Shade slows the cherry, raises the sugars,
          and deepens the cup. It is the single most important decision we have made.
        </P>
      </TwoCol>

      <DataGrid cols={4}>
        <DataCard label="Elevation" value="3,600 ft">Western slopes, Chikkamagaluru range.</DataCard>
        <DataCard label="Soil" value="Red laterite">Deep, acidic, iron-rich, free-draining.</DataCard>
        <DataCard label="Rainfall" value={`40 – 100"`}>South-west monsoon, June – September.</DataCard>
        <DataCard label="Canopy" value="5 layers">Areca, honne, jackfruit, silver oak, native shrub.</DataCard>
      </DataGrid>

      <PullStat value="100" label="Acres of specialty Arabica" sub="Shade-grown under five-layer canopy" />

      {/* VARIETIES */}
      {/* eyebrow was: "Varieties" */}
      <TwoCol id="varieties" heading="Sln.9 · Sln.795.">
        <P>
          We grow two Arabica cultivars, both bred at the Central Coffee Research Institute in
          Balehonnur, forty kilometres from our gate.
        </P>
        <P>
          <strong>Selection 795 (Sln.795)</strong> was released in 1946 — a cross
          of Kents and S.288, widely planted across South India for its vigour and classic mild
          cup. It is the grandfather variety of the estate. Under shade, it develops a cocoa-malt
          body and a round acidity.
        </P>
        <P>
          <strong>Selection 9 (Sln.9)</strong> is the Ethiopian hybrid — Tafarikela × Sln.795,
          carrying heirloom Rume Sudan genetics. Released in the late 1980s, it is the specialty
          cultivar of choice in the Ghats. Floral, citric, and capable of 84+ scores when the
          ferment is handled with care. It is what we built the six lots around.
        </P>
      </TwoCol>

      <Placeholder
        label="Variety comparison — Sln.9 and Sln.795 side by side"
        note="Parchment coffee from both varieties on a raised bed, labelled in hand-painted wood tags. Morning light."
      />

      {/* SIX LOTS INTRO */}
      {/* eyebrow was: "The Six Lots" */}
      <Section
        id="lots"
        heading="One harvest, six trajectories."
      >
        <P>
          Once the cherry leaves the branch, it meets a fork in the road six times. The same
          Sln.9, picked on the same morning from the same block, can become six profoundly
          different coffees depending on the ferment. We treat the wet mill the way a winemaker
          treats the cellar: separated lots, controlled oxygen, temperature logs, Brix and pH
          measured by hand every four hours.
        </P>
        <P>
          Each lot below is numbered, named for its process, and published with its data. Five of
          the six are exclusive to Boojee. The sixth stays on the estate.
        </P>
      </Section>

      <PullQuote>Where precision meets patience.</PullQuote>

      {/* LOT 001 */}
      <Placeholder
        label="Lot 001 — sealed anaerobic tanks"
        note="Stainless tanks in the wet mill with airlock bungs bubbling. Dimly lit, slightly clinical. Monitor in foreground showing Brix / pH."
      />
      <Section id="lot-001" heading="Anaerobic Natural">
        <P>
          Whole cherries sealed in stainless tanks under positive CO₂ pressure for{' '}
          <strong>72 hours</strong>, then dried slowly on the cherry for three
          weeks on raised African beds. The process suppresses oxygen-loving yeasts and lets
          wild-fermentation strains push the flavour into tropical-fruit territory.
        </P>
        <P>
          Cup: ripe mango, papaya skin, jasmine, a long winey finish. The cleanest of our
          experimental lots — a gateway for drinkers new to anaerobic coffee.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9" />
          <DataCard label="Process" value="Anaerobic Natural">Sealed, whole cherry, CO₂ positive.</DataCard>
          <DataCard label="Ferment" value="72 hr">22 – 24 °C, starting Brix 22°.</DataCard>
          <DataCard label="Drying" value="21 days">Raised beds, canopy-covered.</DataCard>
          <DataCard label="Final pH" value="4.2" />
          <DataCard label="Score" value="86.0">Cupped at Boojee Bengaluru, Jan 2026.</DataCard>
        </DataGrid>
      </Section>

      {/* LOT 002 — FLAGSHIP */}
      <Placeholder
        label="Lot 002 — Appassimento drying"
        note="Cherries laid out on bamboo mats in a ventilated shade-house, slightly raisined. Single raking rake in frame. The flagship shot."
        aspect="3 / 2"
      />
      <Section id="lot-002" heading="Appassimento — Dry Osmosis">
        <P>
          Our flagship. Named for the Veneto winemaking tradition in which grapes destined for
          Amarone are dried to concentrate sugars before fermentation, Appassimento at Aura applies
          the same principle to the coffee cherry. After harvest, cherries are laid in a single
          layer in a dedicated shade-house for <strong>14 – 18 days</strong> of slow
          dehydration — losing water but not pulp, concentrating sugars from{' '}
          <strong>22° Brix to 32° Brix</strong> — before a short,
          cool anaerobic ferment and a long cherry dry.
        </P>
        <P>
          Cup: rum-soaked fig, dried rose petal, cacao nib, a syrupy body that coats the palate
          for minutes. This lot scored <strong>83.5</strong> at its first formal cupping and has
          climbed since. It is the clearest statement we make about what this land is capable of.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9" />
          <DataCard label="Process" value="Appassimento">Raisining before ferment. Adapted from Amarone.</DataCard>
          <DataCard label="Raisining" value="14 – 18 days">Shade-house, forced airflow, 18 – 22 °C.</DataCard>
          <DataCard label="Brix shift" value={`22° → 32°`}>Sugars concentrated by 45 %.</DataCard>
          <DataCard label="Ferment" value="36 hr">Cool anaerobic, 18 °C.</DataCard>
          <DataCard label="Score" value="83.5">SCA protocol, rising cupping batch-over-batch.</DataCard>
        </DataGrid>
      </Section>

      {/* LOT 003 */}
      <Placeholder
        label="Lot 003 — Red Honey parchment"
        note="Close-up of sticky, rust-coloured parchment drying on raised beds, hand turning it. Warm afternoon light."
      />
      <Section id="lot-003" heading="Red Honey">
        <P>
          A honey process in the Costa Rican tradition, adapted to Ghats humidity. Cherries are
          pulped and the parchment is dried with{' '}
          <strong>80 – 90 % of mucilage retained</strong>. Called "red honey" for
          the colour the mucilage takes on over a fourteen-day dry. The sugars caramelise on the
          bean itself.
        </P>
        <P>
          Cup: panela, red apple, toffee, clean stonefruit finish. A balanced, traditional lot —
          our answer to drinkers who find anaerobic and Appassimento too loud.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9 / Sln.795 blend" />
          <DataCard label="Process" value="Red Honey">80 – 90 % mucilage retained.</DataCard>
          <DataCard label="Drying" value="14 days">Raised beds, hand-turned every 2 hr.</DataCard>
          <DataCard label="Score" value="85.0" />
        </DataGrid>
      </Section>

      {/* LOT 004 */}
      <Placeholder
        label="Lot 004 — Banana Wash fermentation"
        note="Open fermentation tank layered with banana leaves and whole green bananas among the coffee cherries. Playful, intuitive, experimental."
      />
      <Section id="lot-004" heading="Banana Wash">
        <P>
          Our most experimental lot, and the most distinctly Indian. Whole cherries are
          co-fermented for{' '}
          <strong>48 hours</strong> with green bananas and banana leaves,
          introducing wild yeasts and pectinases from a crop that grows forty feet from the wet
          mill. Then washed clean on parchment and dried slow.
        </P>
        <P>
          Cup: ripe banana, brown sugar, nutmeg, a faint lactic tang. A coffee that tastes like
          the Western Ghats smells in September.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9" />
          <DataCard label="Process" value="Banana Wash">Co-ferment with banana leaf and fruit.</DataCard>
          <DataCard label="Ferment" value="48 hr" />
          <DataCard label="Score" value="84.5" />
        </DataGrid>
      </Section>

      {/* LOT 005 */}
      <Placeholder
        label="Lot 005 — Solera carry-forward tanks"
        note="Row of numbered ferment tanks, each older than the last, a portion transferred forward season over season. A library rather than a line."
      />
      <Section id="lot-005" heading="Solera Maceration">
        <P>
          Borrowed from Jerez, the Solera system is a carry-forward fermentation: a portion of the
          previous year's ferment is retained and inoculates the next. What you taste in the 2026
          harvest contains microbial memory of 2025, 2024, and every vintage before it. The cup
          gets deeper and more consistent with each season.
        </P>
        <P>
          Maceration is extended, slow, and cool — whole cherries steeped in the mother-culture
          liquor for <strong>60 hours</strong> before a gentle pulping and dry.
        </P>
        <P>
          Cup: dark cherry, tamarind, sherry cask, a long savoury finish. Crown of the six lots.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9" />
          <DataCard label="Process" value="Solera Maceration">Carry-forward culture from prior vintages.</DataCard>
          <DataCard label="Maceration" value="60 hr" />
          <DataCard label="Score" value="87.0">Highest of the six, cupped Jan 2026.</DataCard>
        </DataGrid>
      </Section>

      {/* LOT 006 */}
      <Placeholder
        label="Lot 006 — washed parchment on raised beds"
        note="Clean white-grey parchment drying evenly on African beds. The quiet lot. Simple composition."
      />
      <Section id="lot-006" heading="Solera Wash">
        <P>
          The cleanest expression of the Solera culture. Same mother-culture inoculation as Lot
          005, but pulped first and fully washed — no mucilage, no cherry dry, no theatre. What
          remains is the terroir itself: the altitude, the soil, the variety, the carry-forward
          memory.
        </P>
        <P>
          Cup: bergamot, white grape, honey, bright clean acidity. Our reference coffee — the one
          we cup every morning to check what the estate is actually tasting like.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Variety" value="Sln.9" />
          <DataCard label="Process" value="Solera Wash">Fully washed, Solera-inoculated.</DataCard>
          <DataCard label="Ferment" value="36 hr" />
          <DataCard label="Score" value="85.5" />
        </DataGrid>
      </Section>

      {/* ROBUSTA */}
      {/* eyebrow was: "Robusta" */}
      <TwoCol heading="Volcanic Wash, experimental anaerobic.">
        <P>
          Robusta is the workhorse of Indian coffee, and the lower, warmer slopes of our estate
          grow some of the best of it. We ferment our robusta the same way we ferment our
          arabica — with intention. Two experimental lots: <strong>Volcanic Wash</strong>{' '}
          (traditional wet-process pushed to its limit) and an{' '}
          <strong>Extended Anaerobic</strong> that runs the cherry at{' '}
          <strong>96 hours</strong> sealed. Both are at{' '}
          <strong>81.5+</strong> on the Robusta scale.
        </P>
        <P>
          Robusta is not an afterthought here. It is the second half of the estate, and it is
          beginning to out-cup some single-origin arabicas.
        </P>
      </TwoCol>

      {/* BOOJEE PARTNERSHIP */}
      <SideBySide
        leftTitle="Boojee"
        rightTitle="Aura"
        leftChildren={
          <>
            Bengaluru roaster and café group. Our exclusive Arabica partner for five of the six
            specialty lots. They roast, they cup, they teach — and they hold our green coffee to
            a standard we set together.
          </>
        }
        rightChildren={
          <>
            Grower of record. Lots 001 – 005 on the Boojee menu from Q1 2026; Lot 006 reserved
            for the estate kitchen and the journal. The sixth is where we experiment without an
            audience.
          </>
        }
      />

      {/* CERTIFICATION */}
      {/* eyebrow was: "Certification" */}
      <TwoCol heading="Coffee Board, specialty register.">
        <P>
          As of <strong>January 2026</strong>, Aura is registered on the Coffee Board of India's
          specialty register. Our lots are batch-traceable to block, row, and ferment tank,
          published on the Aura provenance stack — cherry to cup, with every data point on chain.
        </P>
        <P>
          Certification is a floor, not a ceiling. The register says what we are not doing
          (chemistry, fraud, contamination). It does not say what we are doing. That is what the
          cupping sheet and the soil probe are for.
        </P>
      </TwoCol>

      <PullStat value="83.5" label="Appassimento cupping score" sub="SCA protocol, Boojee Bengaluru — Jan 2026" />

      {/* BUYERS */}
      {/* eyebrow was: "Buyers" */}
      <Section
        id="buyers"
        heading="Working with us."
        align="center"
      >
        <P>
          Green coffee enquiries, single-lot reserve, and roaster partnership:{' '}
          <a href="mailto:coffee@theaura.life">coffee@theaura.life</a>
        </P>
        <P>
          Harvest windows, lot availability, and cupping samples are published on the provenance
          ledger at the start of each season. We work with a small roster of roasters — quality
          over volume. If the answer is yes, it is a multi-year relationship.
        </P>
      </Section>

      <PullQuote attribution="Cupping notes, morning of the first Appassimento, 2025">
        The cup arrived, and no one spoke for a minute. That was the day we knew the land was back.
      </PullQuote>

      <DataGrid cols={4}>
        <PullStat value="6" label="Specialty lots" />
        <PullStat value="100" label="Acres Arabica" />
        <PullStat value="3,600" label="Feet elevation" />
        <PullStat value="83.5" label="Flagship score" />
      </DataGrid>

      <Continue
        items={[
          {
            href: '/fermentation',
            label: 'Fermentation',
            description: 'Anaerobic, Appassimento, Solera — the wet mill.',
          },
          {
            href: '/biodynamic',
            label: 'Biodynamic',
            description: 'BD 500 – 508 on the coffee calendar.',
          },
          {
            href: '/sanctuary',
            label: 'Sanctuary',
            description: 'The land the coffee grows on.',
          },
        ]}
      />
    </>
  )
}
