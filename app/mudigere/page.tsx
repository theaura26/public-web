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

export default function MudigerePage() {
  return (
    <>
      <ArticleHero
        title={<>Mudigere — Bhoomi · Aaranya</>}
        subline="ಭೂಮಿ · ಆರಣ್ಯ — the body of patience and the soul of renewal. A 150-acre biodynamic sanctuary in the Western Ghats."
        toc={[
          { q: 'What is Bhoomi?', href: '#bhoomi' },
          { q: 'What is Aaranya?', href: '#aaranya' },
          { q: 'What is Jeevanta Shaanti?', href: '#living-peace' },
          { q: 'What are the five pillars?', href: '#pillars' },
          { q: 'What are the twelve worlds?', href: '#twelve' },
          { q: 'What is the biodynamic dialogue?', href: '#biodynamic' },
          { q: 'How is the work phased?', href: '#phasing' },
        ]}
      />

      <Placeholder
        label="Mudigere — aerial of estate"
        note="Drone plate at first light: coffee under silver oak, laterite roads cutting through canopy, a distant herd on pasture. Monsoon mist still lifting off the valley."
      />

      <Section heading="Where cultivation becomes culture.">
        <Couplet
          en="The body of patience."
          local="ಭೂಮಿ — ಸಹನೆಯ ದೇಹ."
          localLang="kn"
        />
        <Couplet
          en="The soul of renewal."
          local="ಆರಣ್ಯ — ಪುನರುಜ್ಜೀವನದ ಆತ್ಮ."
          localLang="kn"
        />
        <P>
          Aura Mudigere is not a plantation the way a plantation is usually meant. It is 150 acres of
          forest, field, herd, and house held as a single organism. We restore the rhythm of the land
          through soil, seed, and silence. Every mist carries memory. Every morning begins with
          gratitude. The path was not designed; it was walked.
        </P>
      </Section>

      <Section heading="The Western Ghats.">
        <P>
          Mudigere sits at 13.1365° North, 3,600 feet above the sea, on the eastern slope of the
          Western Ghats — one of the eight hottest biodiversity hotspots on earth and a UNESCO
          biosphere. The soil is red laterite. The rainfall runs between 40 and 100 inches a year,
          depending on the monsoon&apos;s mood. Coffee hums beneath fig and jackfruit. Rain writes
          poetry on red earth.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Elevation" value="3,600 ft">
            Eastern Ghats slope. Cool nights, long shade, slow cherry ripening.
          </DataCard>
          <DataCard label="Rainfall" value="40–100 in">
            Southwest monsoon, June to September. Laterite holds water like a lung.
          </DataCard>
          <DataCard label="Biosphere" value="UNESCO">
            Western Ghats — one of the world&apos;s eight hottest biodiversity hotspots.
          </DataCard>
        </DataGrid>
        <P>
          Humans are not owners here — only guests of the mountain. The estate has been in the family
          for three generations. Every decision we make is filtered against the generation that will
          inherit it. Most of them are not born yet.
        </P>
      </Section>

      <TwoCol id="bhoomi" heading="Bhoomi — the grounded heart.">
        <P>
          Bhoomi is soil, nursery, and herd. It is where every morning starts. The soil school runs
          on compost, cow dung, and hands. The nursery carries the saplings that will outlive the
          planters. The herd — forty-three head of indigenous Malnad Gidda cattle, small-bodied and
          heat-tolerant — is the farm&apos;s heart, not its product. Their dung feeds the soil. Their
          urine feeds the foliar sprays. Their presence sets the pace of the day.
        </P>
        <Placeholder
          label="Malnad Gidda portrait"
          note="Close-up, golden-hour: the characteristic small frame and dark eyes of a Malnad Gidda cow on pasture. Tight on face and dewlap; the herd soft-focus behind."
          aspect="4 / 3"
        />
        <P>
          Architecture on Bhoomi is stone, laterite, and reclaimed timber. The buildings grow{' '}
          <em>from</em> the earth, not on it. A cow shelter that becomes a classroom. A compost shed
          that smells of straw and rain. A kitchen that runs on what walked in that morning.
        </P>
      </TwoCol>

      <TwoCol id="aaranya" heading="Aaranya — the living canopy.">
        <P>
          Aaranya is the forest we are growing back. Native trees — fig, honge, jackfruit, neem, wild
          cinnamon — are reclaiming the canopy. Understory plants are restoring microclimates for
          birds, bees, and ferns. The forest pavilion is a thin wooden structure that disappears into
          the trees at dusk. Moon gatherings happen here. Forest dinners happen here. Nothing happens
          here that the forest has not agreed to.
        </P>
        <Placeholder
          label="Forest understory"
          note="Mid-shot looking up into a restored canopy — fig and jackfruit, shafts of filtered green light, a single bee in motion blur. Quiet, no human presence."
          aspect="4 / 3"
        />
        <P>
          This is Natural Intelligence in practice — a 100-year forest that feeds, shelters, and
          teaches. Bhoomi and Aaranya are not two projects. They are two organs of the same body.
          Where they meet, we call it <em>Jeevanta Shaanti</em> — Living Peace.
        </P>
      </TwoCol>

      <Section id="living-peace" heading="Jeevanta Shaanti — Living Peace.">
        <Couplet
          en="Living Peace."
          local="ಜೀವಂತ ಶಾಂತಿ"
          localLang="kn"
        />
        <P>
          Where Bhoomi meets Aaranya, we call it Jeevanta Shaanti — Living Peace. Not the
          stillness of absence, but the calm of coexistence. It is the rhythm in which all
          things grow — not rushed, not delayed, simply aligned.
        </P>
        <P>
          Jeevanta Shaanti is not a room. It is a condition. It is what the valley feels like
          when the herd is fed, the soil is drenched, the coffee is cupping, the nursery is
          watered, and the dusk wind is carrying the scent of pepper down the slope. It is the
          working state of the farm when nothing is being forced.
        </P>
      </Section>

      <PullQuote>
        Jeevanta Shaanti — the calm of coexistence.
      </PullQuote>

      <Placeholder
        label="Valley morning — mist over the plantation"
        note="Wide landscape plate: canopy ridge, mist in the hollow, the first light striking silver oak."
      />

      <Section id="pillars" heading="Aura India. The five pillars.">
        <P>
          The work of Mudigere is organised around five pillars. Each is both a place and a practice.
          Each depends on the other four to be whole.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 · Bhoomi" value="Ground">
            Soil, herd, nursery, biodynamic plantation. The farm as organism.
          </DataCard>
          <DataCard label="02 · Gurukul" value="Learning">
            One teacher, one student. Soil, language, and craft taught by presence, not syllabus.
          </DataCard>
          <DataCard label="03 · Studio" value="Making">
            Workshops for ceramics, textile, wood, sound, code. The forest as brief.
          </DataCard>
          <DataCard label="04 · Savour" value="Table">
            Kitchen-from-soil. Fermentation. Forest dining. The harvest as menu.
          </DataCard>
          <DataCard label="05 · Seva" value="Service">
            The estate as neighbour. Employment, schooling, craft income for the valley that hosts us.
          </DataCard>
        </DataGrid>
      </Section>

      <Section heading="The four gardens — a living classroom.">
        <P>
          Around the houses, four gardens teach what the plantation cannot say in words.
        </P>
        <DataGrid cols={2}>
          <DataCard label="Garden of Soil · ಮಣ್ಣಿನ ತೋಟ">
            Compost, worm castings, hands in earth. Where learning begins.
          </DataCard>
          <DataCard label="Garden of Pollinators · ಜೇನು ತೋಟ">
            Native bees and wildflowers weaving the field back into the forest.
          </DataCard>
          <DataCard label="Garden of Senses · ಇಂದ್ರಿಯ ತೋಟ">
            Herbs, fragrance, and sound — awareness taught through scent and footfall.
          </DataCard>
          <DataCard label="Garden of Reflection · ನಿರೀಕ್ಷಣ ತೋಟ">
            Ponds and shade. Stillness as curriculum.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="The four gardens — overhead plan"
        note="Laterite paths tracing between soil, pollinator, sense, and reflection. Morning shadows long."
        aspect="3 / 2"
      />

      <PullStat value="150" label="acres" sub="Plantation, forest, and pasture held as one organism." />
      <PullStat value="43" label="Malnad Gidda" sub="Indigenous Karnataka cattle. The heart of the soil system." />
      <PullStat value="3,600" label="ft · elevation" sub="Eastern Ghats. Long shade, slow ripening, cold nights." />

      <Placeholder
        label="Herd at dusk"
        note="Malnad Gidda returning to the shed through silver-oak shade. Dust in the light."
        aspect="3 / 2"
      />

      <Section id="twelve" heading="The twelve worlds — residency cabins.">
        <P>
          Twelve cabins are threaded through the forest — not a resort, not a row of rooms, but a
          circle of feelings. Artists, scientists, farmers, and founders come for weeks and months at
          a time. Each cabin is a feeling. Each feeling is a teacher.
        </P>
        <P>
          Hive is the hum of collective work. Root, the long silent hold on ground. Flow, water
          finding its own path. Flame, heat and fermentation and transformation. Bloom — open,
          generous, short-lived. Canopy is shelter made by others before us. Echo, sound returned
          by the valley. Seed, potential folded small. Mist, the morning unmade and remade. Stone,
          patience measured in millennia. Pulse, rhythm beneath stillness. And Ethereal — what
          cannot be held, only felt.
        </P>
        <Placeholder
          label="Cabin interior"
          note="Low-angle interior of a residency cabin at dawn — laterite wall, linen curtain lifting in the breeze, a single clay cup on a reclaimed timber ledge. No decorative styling."
          aspect="4 / 3"
        />
      </Section>

      <Placeholder
        label="BD 500 — stirring at dusk"
        note="Hands at the wooden paddle, vortex catching the last light. Copper pot, steam lifting."
        aspect="3 / 2"
      />

      <Chapter number="" title="The Biodynamic Dialogue" id="biodynamic">
        <P>
          Aura Mudigere follows the biodynamic principle that the farm is not a machine but a
          microcosm of the universe. Roots respond to constellations. Water responds to
          moonlight. Growth responds to gravity. Every preparation — BD 500 in the cow horn, BD
          501 silica, CPP, Jeevamrit, Panchgavya, Beejamrit — is timed to planetary motion. The
          panchanga hangs beside the weather radar.
        </P>
        <DataGrid cols={3}>
          <DataCard label="BD 500–508" value="Biodynamic">
            Cow-horn manure, silica, yarrow, chamomile, nettle, oak bark, dandelion, valerian.
            The eight preparations that train soil vitality.
          </DataCard>
          <DataCard label="Jeevamrit" value="Vedic">
            Cow dung, cow urine, jaggery, flour, soil, water — a fermented microbial inoculant.
            Soil drench and foliar.
          </DataCard>
          <DataCard label="Panchgavya" value="Five-cow">
            The five-cow tonic — dung, urine, milk, curd, ghee. Plant immunity in a bucket.
          </DataCard>
          <DataCard label="Beejamrit" value="Seed">
            A Vedic seed-treatment slurry. Every seed is blessed before it touches soil.
          </DataCard>
          <DataCard label="Matka Khad" value="Pot compost">
            Clay-matka fermentation. Small, local, humble. Buttermilk, coconut, magnesium wire.
          </DataCard>
          <DataCard label="Kunapjal" value="Vrikshayurveda">
            Fermented fish and sesame — the Vedic liquid fertiliser older than most scriptures.
          </DataCard>
        </DataGrid>
        <P>
          This is not plantation, in the narrow sense. It is alignment. The PhD agronomist who
          leads the work does not know coffee. He has said, plainly, &ldquo;I only want to heal
          the land.&rdquo; That is the job description. The coffee follows.
        </P>
      </Chapter>

      <PullQuote attribution="The biodynamic agronomist">
        I only want to heal the land.
      </PullQuote>

      <Section heading="The six rules — a field-shed manifesto.">
        <P>
          Pinned in every work shed, English and Kannada. These are the rules before the rules.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01" value="Soil Comes First">
            Before yield, before harvest, before price. Soil is the first and last customer.
          </DataCard>
          <DataCard label="02" value="Do Small Work Properly">
            A badly dug hole teaches the tree to grow badly. Start small. Start right.
          </DataCard>
          <DataCard label="03" value="No Shortcuts">
            Every shortcut is a debt to the next generation. We do not issue those debts.
          </DataCard>
          <DataCard label="04" value="Quality Before Quantity">
            One tree tended is worth ten trees planted.
          </DataCard>
          <DataCard label="05" value="Think 10 Years Ahead">
            Every decision is a letter to a grandchild.
          </DataCard>
          <DataCard label="06" value="Leaders Must Be on the Field">
            The office is not the farm. The farm is the farm.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Field shed — the six rules, pinned"
        note="Weathered paper on laterite wall. Hand lettering, English and Kannada side by side."
        aspect="3 / 2"
      />

      <Section heading="A community collective of the Western Ghats.">
        <P>
          Coffee growers, beekeepers, stone carvers, weavers, ceramicists, woodcarvers — Mudigere is
          surrounded by families who have shaped this land for longer than we have. Aura does not
          replace them. It hires them, learns from them, and carries forward what they do.
        </P>
      </Section>

      <Placeholder
        label="Horizon — the plan beyond the plan"
        note="Long ridge of the Ghats receding into haze. Single walker on the path. No scale."
      />

      <Section id="phasing" heading="Shu · Ha · Ri — phasing, 2025–2029.">
        <Couplet
          en="2025–26 · Shu · Preserve"
          local="Restore soil and biodiversity corridors. Herd expansion. Nursery to full cycle."
        />
        <Couplet
          en="2026–27 · Ha · Adapt"
          local="Open Bhoomi and Aaranya. Launch residencies. First Gathering."
        />
        <Couplet
          en="2028–29 · Ri · Integrate"
          local="Education integrated. Annual Bhoomi Festival. Ecosystem self-teaching."
        />
        <Couplet
          en="Here, the body is sanctuary, the mind is natural intelligence,"
          local="and the soul is the feeling that connects them."
        />
      </Section>

      <Continue
        items={[
          { href: '/plantation', label: 'Plantation', description: 'Coffee, pepper, areca — biodynamic and Vedic practice at 3,600 ft.' },
          { href: '/living-systems', label: 'Living Systems', description: 'Soil, herd, water, canopy — the farm as organism.' },
          { href: '/spaces', label: 'Spaces & Studios', description: 'The Twelve Worlds, the Aangana, and the forest pavilion.' },
        ]}
      />
    </>
  )
}
