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
  Couplet,
  Chapter,
} from '@/components/article/Article'

export default function VedicPage() {
  return (
    <>
      <ArticleHero
        title="Older than its study."
        subline="A spectrum runs through modern agriculture — light chemical, high chemical, low chemical, no chemical, organic, biodynamic. Vedic farming sits beside all of them. It is older than the rulebook, and it is still correct."
        toc={[
          { q: 'Where does it sit?', href: '#where' },
          { q: 'What is Vrikshayurveda?', href: '#vrikshayurveda' },
          { q: 'What are the preparations?', href: '#preparations' },
          { q: 'What is the fungal internet?', href: '#mycorrhizal' },
        ]}
      />

      <Placeholder
        label="Hero — Jeevamrit drum at dawn"
        note="A blue plastic drum of fermenting slurry, bubbles breaking the surface. A wooden paddle resting on the rim. First light, cattle shadows behind. 16:9."
      />

      {/* OPENING — SPECTRUM */}
      {/* eyebrow was: "Where it sits" */}
      <TwoCol id="where" heading="Older than the word organic.">
        <P>
          The world of modern farming arranges itself as a ladder. Light chemical at the bottom,
          high chemical at the scale, low chemical as the apology, no chemical as the aspiration,
          organic as the badge, biodynamic as the discipline. The ladder is useful, and it is
          incomplete. Vedic farming does not sit on it. It predates it.
        </P>
        <P>
          Vrikshayurveda — the Ayurveda of trees — is two thousand years old at least. It reads
          plants the way its sibling text reads human bodies: as beings with digestion, humours,
          seasons, and specific susceptibilities. Its preparations are not fertilisers. They are
          microbial inoculants, immunity builders, and digestive aids, made from whatever the
          household and the cow already produce.
        </P>
        <P>
          An uncle in Thailand called himself a tree servant. Not a gardener — a servant. He said
          he did not plant trees, he observed them, and the tree told him what it wanted. That is
          the Vedic posture. Observation as method.
        </P>
      </TwoCol>

      <PullQuote attribution="Uncle Shung, Thailand">
        I am a tree servant.
      </PullQuote>

      {/* VRIKSHAYURVEDA */}
      {/* eyebrow was: "Vrikshayurveda" */}
      <Section id="vrikshayurveda" heading="The parent tradition.">
        <P>
          The Vrikshayurveda names the preparations we still use today and several we are only
          beginning to re-read. Kunapjal — a fermented brew of fish, sesame cake, honey and milk —
          appears in texts from the Gupta period. Beejamrit, a seed-dressing slurry, is older than
          any recorded agricultural manual in the West. Panchgavya, the five-cow tonic, is woven
          into temple practice as much as into the field. These are not folk remedies. They are
          engineered, fermented, and measured.
        </P>
        <P>
          We rejected the NKP rulebook. Nitrogen, phosphorus, potassium is the language of a
          laboratory in Europe in the 1840s. It is not wrong; it is narrow. The Vedic posture is
          wider. Feed the microbe. Feed the fungus. Feed the soil's own memory. The plant will
          feed itself.
        </P>
      </Section>

      {/* PREPARATIONS GRID */}
      {/* eyebrow was: "The Preparations" */}
      <Section id="preparations" heading="Made in the shed.">
        <DataGrid cols={3}>
          <DataCard label="Jeevamrit" value="Microbial inoculant">
            Cow dung, cow urine, jaggery, gram flour, a handful of local forest soil. Fermented
            anaerobically for 5 – 7 days under shade, stirred twice a day. Applied as a soil
            drench and foliar spray at 5 % dilution. A litre carries billions of native microbes.
          </DataCard>
          <DataCard label="Panchgavya" value="Five cow products">
            Dung, urine, milk, curd, ghee — the five products of the cow — fermented together for
            {` `}{`{confirm: 7}`} days with jaggery and banana. A plant tonic; a foliar for
            flowering and fruit set.
          </DataCard>
          <DataCard label="Beejamrit" value="Seed treatment">
            Cow dung, cow urine, lime, a pinch of forest soil, water. Seeds are dipped the night
            before sowing. The slurry colonises the seed coat with protective microbes before it
            meets the ground.
          </DataCard>
          <DataCard label="Buttermilk · Coconut · Magnesium" value="In-pot ferment">
            A technique borrowed from a French biodynamicist — fresh buttermilk, coconut water,
            jaggery, stirred with a magnesium wire to seed the ferment with trace magnesium. A
            foliar for leaf-yellowing blocks.
          </DataCard>
          <DataCard label="Kunapjal" value="Vrikshayurveda">
            The ancient fermented tonic — small river fish, sesame oil-cake, honey, milk, black
            gram, jaggery. Fermented in a clay pot for {`{confirm: 15}`} days. Used sparingly on
            exhausted blocks. The smell is real; the response is measurable.
          </DataCard>
          <DataCard label="Matka Khad" value="Pot compost">
            Clay matka buried in the field, packed with dung, green leaves, and kitchen scraps,
            sealed and left through the monsoon. Opens as a dense, cured compost with the clay's
            own microbial lining baked in.
          </DataCard>
          <DataCard label="Neem Leaves · Neem Cake" value="Pest deterrent">
            Neem fermented in cow urine, or neem cake worked into the soil. Creates a smell in such
            a way that these guys don't attack, and it doesn't hurt the plants. The quiet solution
            before any spray is considered.
          </DataCard>
          <DataCard label="Vermicompost" value="Worm-led compost">
            Cow-dung windrows seeded with local epigeic earthworms. Finished in 45 – 60 days.
            Applied to the nursery and the highest-value blocks.
          </DataCard>
          <DataCard label="Small-batch compost" value="Observation-led">
            Not one recipe but twenty. Each block reads the compost it needs — leaf-heavy for the
            coffee, nitrogen-rich for the pepper, mineral-rich for the areca. The shed keeps
            ledgers, not formulas.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Magnesium wire in the buttermilk pot"
        note="A copper-coloured wire coiled into a clay pot of pale buttermilk, surface bubbled. Tight macro, natural light."
        aspect="4 / 5"
      />

      <PullStat value="7" label="Days of ferment" sub="Jeevamrit cycle — stirred twice daily, covered from sun" />

      {/* VEG AND BIOBANK */}
      {/* eyebrow was: "VEG and Biobank" */}
      <TwoCol heading="We rejected the NKP rulebook.">
        <P>
          The estate keeps a Vedic Essential Growth (VEG) index and a Biobank — our internal log of
          every preparation made, every block it was applied to, every microbial read that
          followed. The blockchain layer under it makes each entry immutable. Over four seasons
          this becomes the training corpus for a world model grown from this land's own data, not
          borrowed from a textbook elsewhere.
        </P>
        <P>
          This is not fine-tuning. This is growing.
        </P>
      </TwoCol>

      <PullQuote attribution="The biodynamic agronomist">
        Build the land.
      </PullQuote>

      {/* MYCORRHIZAL NETWORK */}
      {/* eyebrow was: "Underground intelligence" */}
      <Section id="mycorrhizal" heading="The fungal internet.">
        <P>
          Under every healthy coffee tree on this estate is a mycorrhizal network — a fungal
          lattice that moves water, phosphorus, and warning signals between plants across
          kilometres. Industrial agriculture severs this network every time it tills. Vedic
          farming feeds it. The Jeevamrit drench is, functionally, a feeding of the fungus. The
          neem cake is a diplomatic note to the network, not a weapon against it.
        </P>
        <P>
          When the network is intact, a coffee tree on the ridge knows, within hours, that a tree
          in the valley has been stressed. It tightens its stomata before the pest arrives. We
          cannot see this with the eye. The probe reads it. The yield, eventually, confirms it.
        </P>
      </Section>

      <Placeholder
        label="Nursery saplings with Beejamrit coat"
        note="Rows of coffee saplings in black polybags, leaves gleaming with the morning foliar. Mid-shot, shallow depth of field."
        aspect="3 / 2"
      />

      {/* VERMICOMPOSTING */}
      {/* eyebrow was: "The shed" */}
      <TwoCol heading="Small-batch compost intelligence.">
        <P>
          We do not make compost in one industrial pile. We make it in twenty small piles, each
          read by the person turning it. Moisture by feel. Heat by hand. Smell as diagnostic. A
          heap that smells of ammonia is overfed; one that smells of the forest floor is ready.
          This is craftsmanship, not chemistry — but it is measured, photographed, and logged
          every week.
        </P>
        <P>
          The vermicomposting beds sit under the areca, shaded and cool. The worms are not
          imported. They are the ones already in the soil, multiplied.
        </P>
      </TwoCol>

      <Couplet en="Feed the microbe, not the plant." local="ಗಿಡಕ್ಕಲ್ಲ, ಸೂಕ್ಷ್ಮಜೀವಿಗೆ ಉಣಿಸು." localLang="kn" />

      <PullStat value="5" label="Cow products in Panchgavya" sub="Dung · urine · milk · curd · ghee — fermented together" />

      {/* number was: "Closing" */}
      <Chapter number="" title="Older than the study of it." />
      <P>
        A PhD agronomist joined us who had never worked with coffee. On her first walk through the
        estate she said only one sentence: I only want to heal the land. Vedic farming is that
        sentence, practised daily for two thousand years, still correct, still waiting to be read
        by a world that forgot how. We are not inventing. We are listening.
      </P>

      <Placeholder
        label="Foliar spray at dawn"
        note="A worker with a back-pack sprayer moving between rows of coffee in first light. Long lens, soft atmosphere."
        aspect="16 / 9"
      />

      <Continue
        items={[
          {
            href: '/biodynamic',
            label: 'Biodynamic Practice',
            description: 'The Steiner layer — BD 500 to 508 on the Maria Thun calendar.',
          },
          {
            href: '/living-systems',
            label: 'Living Systems',
            description: 'Where the cow, the microbe, and the canopy all meet.',
          },
          {
            href: '/wisdom',
            label: 'Ancient Wisdom',
            description: 'Tree servants, hunters, the hundred things we lost.',
          },
        ]}
      />
    </>
  )
}
