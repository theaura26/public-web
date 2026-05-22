import {
  JournalHero,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
} from '@/components/article/Article'

export default function ArecaPage() {
  return (
    <>
      {/* Editorial JournalHero pattern — was ArticleHero with subline
          + 4-question TOC. Both dropped in the coming-soon refactor. */}
      <JournalHero
        title="The sentinel palm."
        src="/aura-areca.jpg"
        mediaType="image"
        caption="Areca catechu — the slender upright palm of the mid-canopy"
        alt="Aura areca — the sentinel palm, mid-canopy of the estate"
      />

      <Placeholder
        caption="Tall slender trunks receding into mist, pepper vines spiralling around them. Looking straight up. Gentle rain on leaves."
      />

      {/* VERTICAL ARCHITECTURE */}
      {/* eyebrow was: "Vertical Architecture" */}
      <TwoCol id="architecture" heading="Twenty metres of shade.">
        <p className="p1">
          An areca palm grows straight. It reaches <strong>15 – 20 m</strong> and commits to a
          single vertical axis for its entire life. That geometry is what makes the estate work.
          The palm&apos;s feathered crown lets in just enough light for coffee to photosynthesise but
          not enough to scorch it. Its trunk is rough enough that a pepper vine can grip without
          damage. Its fallen fronds compost into a dense fibrous mulch that holds moisture through
          the dry months.
        </p>
        <p className="p2">
          We did not plant areca because it is a cash crop. We planted it because no other tree
          would hold up the system we were trying to build.
        </p>
      </TwoCol>

      <Placeholder
        caption="Stylised section illustration — five horizontal bands with plant silhouettes. Drawn in warm ink on cream. Labels in English + Kannada."
      />

      {/* FIVE-LAYER DIAGRAM */}
      {/* eyebrow was: "Five-Layer Plantation" */}
      <TwoCol id="five-layer" heading="How the estate stacks.">
        <p className="p1">
          A regenerative tropical plantation is not a field; it is a vertical forest. Aura&apos;s
          canopy is engineered in five layers, each doing different work for the whole.
        </p>

        <DataGrid cols={2}>
          <DataCard value={`25 – 35 m · native hardwood`}>
            Honne, silver oak, jackfruit. The giants. They regulate temperature, host bird life,
            and anchor the watershed.
          </DataCard>
          <DataCard value={`15 – 20 m · Areca`}>
            The sentinel palm. Vertical trellis for pepper, shade for coffee, compost for the
            floor. The middle that holds everything together.
          </DataCard>
          <DataCard value={`3 – 6 m · Coffee, Cacao, Citrus`}>
            The productive understory. Arabica at this height flourishes with dappled, not
            direct, light.
          </DataCard>
          <DataCard value={`1 – 3 m · Turmeric, Cardamom, Banana`}>
            Spice and starch. Also cover and microclimate regulation. What the kitchen and the
            apothecary draw from.
          </DataCard>
          <DataCard value={`0 – 1 m · Legumes, Grasses, Leaf litter`}>
            Nitrogen-fixers, cover crops, and the steady fall of everything above. The layer that
            becomes next year&apos;s soil.
          </DataCard>
          <DataCard value="Self-regulating">
            Each layer shelters the one below and feeds the one above. The forest does the work
            of the fertiliser and the umbrella.
          </DataCard>
        </DataGrid>
      </TwoCol>

      {/* CULTURAL SIGNIFICANCE */}
      {/* eyebrow was: "Culture" */}
      <TwoCol id="culture" heading="Betel, ritual, welcome.">
        <p className="p1">
          Areca is not a neutral tree in Karnataka. Its nut (<em>adike</em> in Kannada) wrapped in
          betel leaf is offered at weddings, at temples, at the start of a conversation with an
          elder. The palm shows up in Sangam poetry and on the flags of medieval Tuluva kings. In
          the coastal and Malnad districts, a household&apos;s areca grove is both a bank account and a
          family history.
        </p>
        <p className="p2">
          We grow it aware of that lineage. The estate is part of a landscape where areca has been
          the answer to &ldquo;what shall we plant?&rdquo; for a thousand years. We are not introducing it; we
          are continuing it.
        </p>
      </TwoCol>

      <PullQuote attribution="ಎಲ್ಲವೂ ಅದರ ನೆರಳಿನಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ.">
        Everything else grows in its shade.
      </PullQuote>

      {/* PROCESSING */}
      {/* eyebrow was: "Processing" */}
      <TwoCol id="processing" heading="Fresh, dried, value-added.">
        <p className="p1">
          Three trajectories for the nut after harvest.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Chali · unripe">
            Unripe green nuts, boiled and sun-dried quickly. Higher tannin, firmer bite. The
            traditional Malnad style, preferred across Karnataka.
          </DataCard>
          <DataCard value="Kempadike · ripe">
            Fully ripened nuts, sun-dried for{' '}
            30 – 45 days on raised platforms. Red-brown in colour; softer and
            sweeter in character. Higher market value.
          </DataCard>
          <DataCard value="Supari, fibre, compost">
            Processed nut preparations for the kitchen and the apothecary. Husk fibre for rope and
            board. Fallen leaf sheaths for biodegradable plates. The tree is closed-loop.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        caption="Wide raised bamboo platform in morning light, thousands of nuts turned and raked. Workers present but not central."
      />

      <PullQuote>The tree grows straight so that everything else can afford to bend.</PullQuote>

      {/* eyebrow was: "In the system" */}
      <TwoCol heading="Not a monocrop. A spine.">
        <p className="p1">
          On some estates areca is the only crop. That is not this estate. Here the palm is a
          structural element — the keystone of the canopy — and its economics are part of, not
          separate from, the coffee and pepper economics. When a season is hard on coffee, the
          areca holds the books. When areca prices fall, the coffee carries. The whole organism is
          stronger than any of its crops.
        </p>
        <p className="p2">
          The sentinel palm is the quiet one. It does not show up on our cupping sheets. It
          doesn&apos;t win scores. But pull it out and the plantation collapses.
        </p>
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
