import {
  ArticleHero,
  TwoCol,
  Section,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  PullStat,
  Continue,
  Couplet,
} from '@/components/article/Article'

export default function ArecaPage() {
  return (
    <>
      <ArticleHero
        title="The sentinel palm."
        subline="Areca catechu — the slender upright palm that holds up the entire estate. Mid-canopy, trellis, companion, and cultural fixture of coastal Karnataka. Everything else grows in its shade."
        toc={[
          { q: 'Why areca?', href: '#architecture' },
          { q: 'How does the canopy stack?', href: '#five-layer' },
          { q: 'What does it mean culturally?', href: '#culture' },
          { q: 'How is it processed?', href: '#processing' },
        ]}
      />

      <Placeholder
        label="Hero — areca grove from below"
        note="Tall slender trunks receding into mist, pepper vines spiralling around them. Looking straight up. Gentle rain on leaves."
        aspect="3 / 4"
      />

      {/* VERTICAL ARCHITECTURE */}
      {/* eyebrow was: "Vertical Architecture" */}
      <TwoCol id="architecture" heading="Twenty metres of shade.">
        <P>
          An areca palm grows straight. It reaches <strong>15 – 20 m</strong> and commits to a
          single vertical axis for its entire life. That geometry is what makes the estate work.
          The palm's feathered crown lets in just enough light for coffee to photosynthesise but
          not enough to scorch it. Its trunk is rough enough that a pepper vine can grip without
          damage. Its fallen fronds compost into a dense fibrous mulch that holds moisture through
          the dry months.
        </P>
        <P>
          We did not plant areca because it is a cash crop. We planted it because no other tree
          would hold up the system we were trying to build.
        </P>
      </TwoCol>

      <Placeholder
        label="Five-layer canopy diagram"
        note="Stylised section illustration — five horizontal bands with plant silhouettes. Drawn in warm ink on cream. Labels in English + Kannada."
        aspect="3 / 2"
      />

      {/* FIVE-LAYER DIAGRAM */}
      {/* eyebrow was: "Five-Layer Plantation" */}
      <Section id="five-layer" heading="How the estate stacks.">
        <P>
          A regenerative tropical plantation is not a field; it is a vertical forest. Aura's
          canopy is engineered in five layers, each doing different work for the whole.
        </P>

        <DataGrid cols={2}>
          <DataCard label="01 · Emergent" value={`25 – 35 m · native hardwood`}>
            Honne, silver oak, jackfruit. The giants. They regulate temperature, host bird life,
            and anchor the watershed.
          </DataCard>
          <DataCard label="02 · Canopy" value={`15 – 20 m · Areca`}>
            The sentinel palm. Vertical trellis for pepper, shade for coffee, compost for the
            floor. The middle that holds everything together.
          </DataCard>
          <DataCard label="03 · Sub-canopy" value={`3 – 6 m · Coffee, Cacao, Citrus`}>
            The productive understory. Arabica at this height flourishes with dappled, not
            direct, light.
          </DataCard>
          <DataCard label="04 · Shrub" value={`1 – 3 m · Turmeric, Cardamom, Banana`}>
            Spice and starch. Also cover and microclimate regulation. What the kitchen and the
            apothecary draw from.
          </DataCard>
          <DataCard label="05 · Ground" value={`0 – 1 m · Legumes, Grasses, Leaf litter`}>
            Nitrogen-fixers, cover crops, and the steady fall of everything above. The layer that
            becomes next year's soil.
          </DataCard>
          <DataCard label="Outcome" value="Self-regulating">
            Each layer shelters the one below and feeds the one above. The forest does the work
            of the fertiliser and the umbrella.
          </DataCard>
        </DataGrid>
      </Section>

      <PullStat value="20m" label="Mature areca height" sub="Vertical trellis for pepper; canopy for coffee" />

      {/* CULTURAL SIGNIFICANCE */}
      {/* eyebrow was: "Culture" */}
      <TwoCol id="culture" heading="Betel, ritual, welcome.">
        <P>
          Areca is not a neutral tree in Karnataka. Its nut (<em>adike</em> in Kannada) wrapped in
          betel leaf is offered at weddings, at temples, at the start of a conversation with an
          elder. The palm shows up in Sangam poetry and on the flags of medieval Tuluva kings. In
          the coastal and Malnad districts, a household's areca grove is both a bank account and a
          family history.
        </P>
        <P>
          We grow it aware of that lineage. The estate is part of a landscape where areca has been
          the answer to "what shall we plant?" for a thousand years. We are not introducing it; we
          are continuing it.
        </P>
      </TwoCol>

      <Couplet en="Everything else grows in its shade." local="ಎಲ್ಲವೂ ಅದರ ನೆರಳಿನಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ." localLang="kn" />

      {/* PROCESSING */}
      {/* eyebrow was: "Processing" */}
      <Section id="processing" heading="Fresh, dried, value-added.">
        <P>
          Three trajectories for the nut after harvest.
        </P>
      </Section>

      <DataGrid cols={3}>
        <DataCard label="Fresh" value="Chali · unripe">
          Unripe green nuts, boiled and sun-dried quickly. Higher tannin, firmer bite. The
          traditional Malnad style, preferred across Karnataka.
        </DataCard>
        <DataCard label="Dried" value="Kempadike · ripe">
          Fully ripened nuts, sun-dried for{' '}
          30 – 45 days on raised platforms. Red-brown in colour; softer and
          sweeter in character. Higher market value.
        </DataCard>
        <DataCard label="Value-added" value="Supari, fibre, compost">
          Processed nut preparations for the kitchen and the apothecary. Husk fibre for rope and
          board. Fallen leaf sheaths for biodegradable plates. The tree is closed-loop.
        </DataCard>
      </DataGrid>

      <Placeholder
        label="Areca drying platform"
        note="Wide raised bamboo platform in morning light, thousands of nuts turned and raked. Workers present but not central."
      />

      <PullQuote>The tree grows straight so that everything else can afford to bend.</PullQuote>

      {/* eyebrow was: "In the system" */}
      <TwoCol heading="Not a monocrop. A spine.">
        <P>
          On some estates areca is the only crop. That is not this estate. Here the palm is a
          structural element — the keystone of the canopy — and its economics are part of, not
          separate from, the coffee and pepper economics. When a season is hard on coffee, the
          areca holds the books. When areca prices fall, the coffee carries. The whole organism is
          stronger than any of its crops.
        </P>
        <P>
          The sentinel palm is the quiet one. It does not show up on our cupping sheets. It
          doesn't win scores. But pull it out and the plantation collapses.
        </P>
      </TwoCol>

      <Continue
        items={[
          {
            href: '/pepper',
            label: 'Pepper',
            description: 'The vine the areca holds up.',
          },
          {
            href: '/living-systems',
            label: 'Living Systems',
            description: 'Canopy, water, cattle, people.',
          },
          {
            href: '/coffee',
            label: 'Coffee',
            description: 'What grows beneath the sentinel.',
          },
        ]}
      />
    </>
  )
}
