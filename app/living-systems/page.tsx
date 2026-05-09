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
  Continue,
} from '@/components/article/Article'

export default function LivingSystemsPage() {
  return (
    <>
      <ArticleHero
        title="Herd, hive, canopy."
        subline="A farm is not a field. It is an organism — cattle, bees, birds, dogs, trees, and the human caretakers who know each by name. At Aura, the living systems are the farm. Everything else is scaffolding."
        toc={[
          { q: 'What is the herd?', href: '#herd' },
          { q: 'Which bees work the land?', href: '#bees' },
          { q: 'Who is the shepherd?', href: '#shepherd' },
          { q: 'What grows in the nursery?', href: '#nursery' },
          { q: 'How is the canopy stacked?', href: '#canopy' },
        ]}
      />

      <Placeholder
        label="Hero — Malnad Gidda herd at dawn, low mist in the canopy"
        note="Indigenous Karnataka cattle emerging from the areca rows at first light. Shot slow, close to the ground. 16:9."
      />

      {/* PHILOSOPHY */}
      {/* eyebrow was: "Philosophy" */}
      <TwoCol heading="The farm is organism.">
        <P>
          Before there were inputs, there were relationships. A cow that feeds on the grass that
          grows where her dung fell last season. A bee that works the coffee blossom and returns
          to a hive in the shade of a jackfruit tree. A chicken that turns the leaf litter before
          a farmhand rakes it. These are not practices. They are the oldest kind of agriculture —
          the kind where nothing is a line item because everything is a limb.
        </P>
        <P>
          We talk about biodynamic preparations and Vedic inoculants on other pages. Here we talk
          about the bodies that make them possible. Without the herd there is no dung, no horn, no
          milk, no CPP. Without the bees there is no cherry set. Without the canopy there is no
          shade, and without shade there is no microclimate we can call our own.
        </P>
      </TwoCol>

      {/* THE HERD */}
      {/* eyebrow was: "001" */}
      <Section id="herd" heading="The Malnad Gidda Herd">
        <P>
          Forty-three head of Malnad Gidda — the small-bodied indigenous cattle of the Western
          Ghats. They are the biodynamic engine of the estate. Their dung builds the preparations.
          Their horns hold the silica and manure that overwinter in the soil. Their milk feeds the
          Panchgavya. Their hooves do the work a tractor never could, pressing seed into the
          terrace and breaking the crust after rain.
        </P>
        <P>
          Malnad Gidda are a heritage breed, short in stature, long in memory. They tolerate the
          monsoon, forage the understory, and calve without intervention. Most of the herd has
          never met an antibiotic. All of them know the shepherd&apos;s voice before they see him.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Head Count" value="43">
            Indigenous Malnad Gidda. Target 52 within three seasons.
          </DataCard>
          <DataCard label="Breed Origin" value="Western Ghats">
            Karnataka heritage stock, ≈900&ndash;1,100 years of continuous lineage.
          </DataCard>
          <DataCard label="Average Lifespan" value="18–22 yrs">
            Roughly twice the commercial-dairy average.
          </DataCard>
          <DataCard label="Daily Milk" value="1.5–3 L">
            Low yield, high butterfat. Drunk, cultured, or reserved for Panchgavya.
          </DataCard>
          <DataCard label="Dung Volume" value="≈10 kg / head / day">
            The raw material of BD 500, CPP, and Matka Khad.
          </DataCard>
          <DataCard label="Horn Quality" value="Upward, hollow">
            Required geometry for horn-silica and horn-manure preparations.
          </DataCard>
          <DataCard label="Calves / yr" value="{confirm: 8–12}">
            Natural breeding, seasonal calving, no induced cycles.
          </DataCard>
          <DataCard label="Antibiotic Use" value="0">
            Ethnoveterinary only — neem, turmeric, cow urine, hot compresses.
          </DataCard>
          <DataCard label="Role in Soil" value="Primary">
            Dung, urine, hoof action, grazing pattern &mdash; four functions, one animal.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Malnad Gidda portrait — full frame, eye-level"
        note="A single cow, close. Horn profile visible. Late-afternoon light through the areca."
      />

      {/* THE BEES */}
      {/* eyebrow was: "002" */}
      <Section id="bees" heading="The Bees">
        <P>
          Three native species work the estate. Apis cerana indica in managed boxes along the
          shade lines. Apis dorsata — the rock bee — in wild colonies under rock ledges and in the
          oldest jackfruit. Tetragonula iridipennis, the stingless bee, in small hollow-log hives
          near the nursery. We manage what can be managed and leave the rest to its own
          intelligence.
        </P>
        <P>
          The bees are the reason the cherry sets. They are also the clearest signal we have that
          the farm is working: if the hives are calm and heavy, the canopy is right. If they
          abandon, we listen.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Managed Hives" value="{confirm: 24}">
            Apis cerana indica in Newton and top-bar boxes.
          </DataCard>
          <DataCard label="Wild Colonies" value="{confirm: 12+}">
            Apis dorsata under ledges and in the high canopy.
          </DataCard>
          <DataCard label="Species" value="3">
            Cerana · Dorsata · Tetragonula. No European imports.
          </DataCard>
          <DataCard label="Pollination Radius" value="~3 km">
            Full coverage of the 150-acre estate and neighbouring tracts.
          </DataCard>
          <DataCard label="Honey Lots / yr" value="{confirm: 6}">
            Single-origin by season and species. Unblended, unheated.
          </DataCard>
          <DataCard label="Coffee Set Lift" value="+30–40%">
            Documented cerana-on-arabica set improvement, estate plots.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Bee on coffee flower — macro"
        note="Apis cerana on white arabica bloom. February, mid-morning. Shallow depth of field."
      />

      {/* CHICKENS */}
      {/* eyebrow was: "003" */}
      <Section heading="The Chickens">
        <P>
          A small working flock lives alongside the nursery. They do three things no machine does
          well: turn the leaf litter, eat the larvae that would otherwise eat the seedlings, and
          deposit nitrogen exactly where it is needed. They are not a protein strategy. They are a
          soil tool with feathers.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Flock Size" value="{confirm: 40}">
            Kadaknath and native cross. Rotational paddock behind the nursery.
          </DataCard>
          <DataCard label="Primary Role" value="Soil turn">
            Leaf-litter inversion, pest predation, nitrogen deposit.
          </DataCard>
          <DataCard label="Eggs" value="{confirm: 120 / wk}">
            Kitchen and shepherd&apos;s households. Not a retail line.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Chicken in the understory"
        note="A single bird scratching through leaf litter at the edge of the coffee block. Late morning."
      />

      {/* DOG */}
      {/* eyebrow was: "004" */}
      <Section heading="The Australian Shepherd">
        <P>
          One working dog. Australian Shepherd — the breed that was shaped for exactly this
          country: high elevation, strong sun, long walks, herd of mixed sizes. She moves the
          cattle between paddocks, keeps the chickens honest, and knows the property by scent
          before she knows it by sight. A working dog is not a pet. She is staff.
        </P>
      </Section>

      <Placeholder
        label="Australian Shepherd working the paddock edge"
        note="Mid-distance, cattle in the background, her attention forward. Dust in the light."
      />

      {/* THE SHEPHERD */}
      {/* eyebrow was: "005" */}
      <Section id="shepherd" heading="The Shepherd">
        <P>
          The shepherd is a role before it is a person. He is the one who knows which cow is
          calving this week, which calf is weak, which hive is about to swarm, which section of
          fence the Dorsata has claimed this year. He reads the farm the way a reader reads a
          book they have read every year for forty years &mdash; by remembering the margins.
        </P>
        <P>
          We treat the shepherd as a lineage, not a job title. When the current shepherd retires,
          his apprentice will already have walked the property for a decade. This is how a
          thousand-year idea keeps walking.
        </P>
      </Section>

      <PullQuote attribution="Aura field note">
        The farm is an organism. The cow is its heart.
      </PullQuote>

      {/* THE NURSERY */}
      {/* eyebrow was: "006" */}
      <Section id="nursery" heading="The Nursery">
        <P>
          Everything that will one day grow on the estate first grows here. Four stocks, four
          purposes. We raise from seed where we can, from cutting where we must, and we treat
          every sapling with Beejamrit before it ever sees the field.
        </P>

        <DataGrid cols={2}>
          <DataCard label="Native Stock" value="{confirm: 60+ species}">
            Western Ghats endemics &mdash; Terminalia, Vateria, Artocarpus, Myristica, Garcinia.
            For restoration, not ornament.
          </DataCard>
          <DataCard label="Food Forest" value="{confirm: 40+ species}">
            Jackfruit, avocado, breadfruit, heritage banana, wild mango, seasonal berry.
          </DataCard>
          <DataCard label="Medicinal" value="{confirm: 30+ species}">
            Ashwagandha, Brahmi, Tulsi, Ginger, Turmeric, Neem. Vrikshayurveda stock.
          </DataCard>
          <DataCard label="Plantation Stock" value="Arabica · Pepper · Areca">
            Own-seed arabica lines. Malabar pepper on estate mother-vines. Areca from local nuts.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Nursery rows — long lens"
        note="Compressed perspective down the bamboo shade lines. Polybags in rhythm."
      />

      {/* CANOPY */}
      {/* eyebrow was: "007" */}
      <Section id="canopy" heading="Five-Layer Canopy Architecture">
        <P>
          A forest is not a single ceiling. It is five. We plant, prune, and protect on all five
          layers at once, so that light, water, and air are rationed the way a forest rations them
          &mdash; not the way a row crop is rationed by a spreadsheet.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Emergent" value="30–45 m">
            Dipterocarpus, Tetrameles, old jackfruit. The lightning rods and the hornbill routes.
          </DataCard>
          <DataCard label="Canopy" value="18–28 m">
            Silver oak, jackfruit, mango, native figs. The working shade for coffee.
          </DataCard>
          <DataCard label="Sub-canopy" value="6–15 m">
            Areca, coffee mother-trees, citrus, cocoa. Where the pepper climbs.
          </DataCard>
          <DataCard label="Shrub" value="1–4 m">
            Coffee bush, cardamom, curry leaf, medicinal understory.
          </DataCard>
          <DataCard label="Ground" value="0–1 m">
            Legumes, turmeric, ginger, living mulch, the leaf-litter floor.
          </DataCard>
          <DataCard label="Principle" value="Stacked, not spaced">
            No acre of the estate holds fewer than three layers. Most hold five.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Canopy diagram — cross-section illustration"
        note="Hand-drawn cross-section of the five layers, labelled. Paper-and-ink register."
      />

      <PullStat value="43" label="Malnad Gidda" sub="indigenous cattle, biodynamic engine" />
      <PullStat value="5" label="canopy layers" sub="emergent to ground floor" />
      <PullStat value={<>{`{confirm}`}</>} label="native species" sub="in the restoration nursery" />

      {/* UNESCO */}
      {/* eyebrow was: "008" */}
      <Section heading="UNESCO Restoration Commitment">
        <P>
          The Western Ghats are a UNESCO World Heritage site and one of the eight hottest
          biodiversity hotspots on the planet. We hold the estate to that standard. A share of
          every planting season is reserved for native restoration &mdash; not plantation
          species, not commercial species, but the endemics that were here before anyone
          planted coffee in these hills. This is the part of the farm that will never be a
          product. It is the part that pays the next thousand years.
        </P>
      </Section>

      <Placeholder
        label="Native restoration block"
        note="Saplings flagged in a cleared understory plot. Monsoon light. Wide."
      />

      <Continue
        items={[
          {
            href: '/biodynamic',
            label: 'Biodynamic Practice',
            description: 'BD 500, CPP, horn silica &mdash; the preparations the herd makes possible.',
          },
          {
            href: '/plantation',
            label: 'Regenerative Plantation',
            description: 'One hundred acres of specialty coffee under this canopy.',
          },
          {
            href: '/mudigere',
            label: 'Mudigere',
            description: 'Bhoomi and Aaranya &mdash; the grounded campus where these systems live.',
          },
        ]}
      />
    </>
  )
}
