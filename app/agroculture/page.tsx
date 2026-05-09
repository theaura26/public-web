'use client'

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
  Couplet,
  Continue,
  Chapter,
} from '@/components/article/Article'

export default function AgroculturePage() {
  return (
    <>
      <ArticleHero
        title={<>The land is the lab.</>}
        subline="Agroculture is not agriculture plus brand. It is what the land produces when treated as an organism — coffee, pepper, areca, cattle, fermentation, medicine. Earth up. Always."
        toc={[
          { q: 'What is agroculture?', href: '#premise' },
          { q: 'What does the land grow?', href: '#crops' },
          { q: 'What keeps the soil alive?', href: '#practices' },
          { q: 'What are the living systems?', href: '#living' },
          { q: 'What is a working week?', href: '#rhythm' },
          { q: 'How is provenance kept?', href: '#provenance' },
        ]}
      />

      <Placeholder
        label="Hero plate · canopy & understory, Mudigere"
        note="Wide establishing frame of coffee under areca shade, dappled morning light, Western Ghats ridge in the distance. No signage, no people."
      />

      {/* eyebrow was: "The Premise" */}
      <Section id="premise" heading="Not yield. Living signal.">
        <P>
          Aura does not farm to harvest. Aura farms to keep the land alive, and accepts the harvest as
          the thank-you note the land sends back. What the plantation produces — coffee, pepper,
          areca, dairy, ferment — is a signal of how well the soil is eating. When the signal is
          strong, the crop is specialty; when the signal is weak, the crop is a warning.
        </P>
        <P>
          <strong>Agroculture</strong> is the word we use for this. Culture, not industry. The
          deliberate tending of a living organism over generations, using the oldest known methods
          and the newest observable data in the same hand. Biodynamic preparations and soil sensors.
          Vedic seed treatments and blockchain provenance. Ancient grammar, modern punctuation.
        </P>
        <P>
          The spectrum of modern farming runs from high chemical to organic to biodynamic. Aura sits
          at the far end. No NPK rulebook. No chemical shortcuts. A bank of cultures, cattle, and
          ferments that works because the microbiome on the land is allowed to run the farm.
        </P>
      </Section>

      <Section heading="What the land grows.">
        <P>
          One hundred acres of specialty Arabica at 3,600 feet, rewilded under native canopy. Malabar
          black pepper twined up areca. The areca palm itself — the sentinel of the Malnad — holding
          the forest vertical. Three crops, one canopy, one appellation.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 — Coffee" value="Six Lots · One Appellation">
            One hundred acres of shade-grown specialty Arabica. Six separated lots in the wine
            tradition. A flagship at 83.5 cup score. Appassimento, Solera, anaerobic — processes
            borrowed from wine and read back through coffee.
          </DataCard>
          <DataCard label="02 — Pepper" value="Malabar Black">
            The old trade pepper of the Ghats, twining up areca trunks. Sorted, sun-dried, and
            stored whole. The spice the world renamed India for, grown slowly, back on its own hill.
          </DataCard>
          <DataCard label="03 — Areca" value="The Sentinel Palm">
            The vertical architecture of the Malnad plantation. Pepper climbs it. Coffee shelters
            under it. Birds nest in it. Without areca, the Malnad coffee story does not exist.
          </DataCard>
        </DataGrid>
      </Section>

      <TwoCol id="crops" heading="Three crops, one canopy.">
        <P>
          A plantation that grows one thing is a field. A plantation that grows three things in
          stacked conversation with a forest is an ecosystem. Aura is the latter. Every crop earns
          its place by what it contributes to the others.
        </P>
        <Placeholder
          label="Image · hands folding cow dung into BD 500 horn"
          note="Close, warm, tungsten light on hands packing dung into a cow horn. Earthy palette, shallow depth of field."
          aspect="4 / 3"
        />
        <P>
          Two lineages of practice run through the soil at Mudigere, in parallel and in dialogue.
          One is Vedic — three thousand years of Indian agroecology, kept in <em>Vrikshayurveda</em>
          {' '}and in the hands of farmers who never read it but have always practiced it. The other is
          biodynamic — Rudolf Steiner&apos;s early twentieth-century formalisation of what European
          peasants already knew. Both teach the same thing: the soil is alive, and it wants to be
          fed.
        </P>
      </TwoCol>

      <PullQuote attribution="Arvind">
        We start from the earth and work up.
      </PullQuote>

      <Placeholder
        label="Image · sensor at root zone of coffee plant"
        note="Macro shot of a small soil probe nestled in leaf litter beneath a coffee plant. Wet soil, early light."
      />

      <Section id="practices" heading="What keeps the soil alive.">
        <P>
          Neither tradition is ornamental. Both are measured — soil-carbon climbing year on year,
          microbial diversity in the root zone, pest pressure dropping, yields holding or rising
          without a gram of synthetic input. The proof is in the dirt, not the brochure.
        </P>
        <DataGrid cols={2}>
          <DataCard label="Vedic Practice" value="Vrikshayurveda">
            Jeevamrit — a microbial soil drench of cow dung, cow urine, jaggery, pulse flour, and a
            fistful of forest soil, fermented for a week. Panchgavya — the five-cow tonic. Beejamrit
            — seed-treatment slurry. Matka Khad — pot compost in a clay matka. Kunapjal — fish and
            sesame ferment from Vrikshayurveda.
          </DataCard>
          <DataCard label="Biodynamic Practice" value="BD 500–508">
            BD 500 — cow-horn manure, stirred for one hour at dusk. BD 501 — horn silica. BD
            502–507 — the six compost preparations (yarrow, chamomile, nettle, oak bark, dandelion,
            valerian). BD 508 — horsetail tea. CPP — Cow Pat Pit, the microbial accelerator.
            Preparations, not products. Timing matters more than quantity.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="The biodynamic agronomist">
        I only want to heal the land.
      </PullQuote>

      <Placeholder
        label="BD 500 — stirring at dusk"
        note="Hands at the wooden paddle, vortex catching the last light. Copper pot, steam lifting."
        aspect="3 / 2"
      />

      <Chapter number="" title="The Living Systems" id="living">
        <P>
          A farm is an organism. The plantation is the body; the herd is the heart; the canopy is
          the lungs; the bees are the bloodstream. Remove any of these and the body fails. Keep them
          all in conversation and the body deepens year on year.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Herd" value="43–52 · Malnad Gidda">
            Indigenous Karnataka cattle. Small, dark, heat-tolerant, drought-hardy. The dung that
            powers BD 500 and Jeevamrit. The milk that feeds Panchgavya. The centre of the system.
          </DataCard>
          <DataCard label="Canopy" value="Areca · Silver Oak · Native">
            The shade that makes the coffee specialty. The architecture that holds the forest.
            Carbon stock. Soil protection. Bird habitat. A three-layer understorey.
          </DataCard>
          <DataCard label="Bees" value="Apis cerana · Apis dorsata">
            The Indian hive bee and the giant rock bee, both wild, both thriving. Pollination for
            the coffee flush. A small honey yield. A major indicator species.
          </DataCard>
          <DataCard label="Water" value="40–100 inches · monsoon">
            The southwest monsoon is the farm&apos;s calendar. Rain-fed coffee. Check-dams, swales,
            ponds. Water is banked in soil structure, not tanks.
          </DataCard>
        </DataGrid>
        <P>
          The farm is an organism. The cow is its heart.
        </P>
      </Chapter>

      <PullStat value="150" label="acres under care" sub="Mudigere, Karnataka · 3,600 ft" />
      <PullStat value="43" label="Malnad Gidda" sub="Indigenous Karnataka cattle. The centre of the system." />
      <PullStat value="100" label="acres Arabica" sub="Shade-grown, six specialty lots, one appellation." />

      <PullQuote>
        The farm is an organism. The cow is its heart.
      </PullQuote>

      <TwoCol id="rhythm" heading="Monday to Sunday on the farm.">
        <P>
          The schedule is set by the valley, not by us. The farmer reads sky, soil, and moon before
          he reads a calendar. Right time, right action — is the operating principle. A
          good decision at the wrong hour is still a wrong decision.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Dawn" value="Milking · Walk the land">
            The cow dictates the morning. If the herd is not ready, the kitchen waits.
          </DataCard>
          <DataCard label="Late afternoon" value="Stir BD 500 at dusk">
            The preparation is alive only when the light softens. Stirred at noon it is inert.
          </DataCard>
          <DataCard label="Full moon" value="Sow leaf crops">
            Ascending moon, above-ground growth. Descending, root crops. The panchanga in the shed.
          </DataCard>
          <DataCard label="Monsoon break" value="Harvest pepper">
            Timed to the humidity, not the week. The spice comes off when the berry blushes red.
          </DataCard>
          <DataCard label="36 hours" value="Anaerobic ferment">
            Coffee Lot 002. Dry Osmosis. An hour early, flat. An hour late, vinegar.
          </DataCard>
          <DataCard label="Tea at four" value="The only appointment">
            Everything else negotiates with the valley. Four o&apos;clock tea does not.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Section id="provenance" heading="Every input, named.">
        <P>
          Organic, biodynamic, fair-trade — these are the badges the industry sells. Together they
          cost forty to fifty thousand dollars and four years to secure. Aura replaces them with
          something stronger: full blockchain provenance. Every cherry, every stir, every hour,
          every hand. The record begins in the root zone and ends in the cup.
        </P>
        <P>
          If it cannot be traced, it cannot be trusted. The blockchain is the scribe; the soil is
          the source. The technology is invisible; the integrity is not.
        </P>
      </Section>

      <Section id="phasing" heading="The year on the farm.">
        <Couplet en="Dawn · the cow decides" local="Milking begins when the herd is ready. Kitchen follows." />
        <Couplet en="Dusk · the earth inhales" local="BD 500 sprayed only when light softens. Stomata open." />
        <Couplet en="Monsoon · the calendar arrives" local="June to September. The farm runs on rain banked in soil." />
        <Couplet en="A rich and mindful life" local="豊かな暮らし" localLang="ja" />
      </Section>

      <Continue
        items={[
          { href: '/plantation', label: 'The Plantation', description: 'Six lots, three crops, one appellation.' },
          { href: '/biodynamic', label: 'Biodynamic', description: 'BD 500–508. The preparations that live by Ṛta.' },
          { href: '/living-systems', label: 'Living Systems', description: 'Herd, bees, canopy, water — the body of the farm.' },
        ]}
      />
    </>
  )
}
