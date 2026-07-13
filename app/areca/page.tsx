import {
  JournalHero,
  TwoCol,
  OneCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'

export default function ArecaPage() {
  return (
    <>
      <JournalHero
        currentHref="/areca"
        title="The sentinel palm."
        mediaType="image"
        caption="Areca catechu — the slender upright palm of the mid-canopy"
        alt="Aura areca — the sentinel palm, mid-canopy of the estate"
      />

      <Placeholder
        type="Portrait · trunks"
        caption="Looking up the trunks of mature areca — pepper vines spiralling in the mist"
      />

      <Placeholder
        type="Detail · crown"
        caption="The feathered crown, dappling light onto the coffee below"
      />

      <TwoCol id="architecture" heading="Twenty metres of shade.">
        <p className="p1">
          It never fruits spectacularly, never wins a cupping score, never shows up on a menu.
          The <Term tip="Areca catechu — the slender upright palm of coastal South Asia. Grown for its nut and, on regenerative estates, as the structural mid-canopy.">areca palm</Term> is
          the quiet one — and the whole plantation is built on top of it. It grows straight,
          reaching <strong>15 – 20 m</strong> on a single vertical axis for its entire life. The
          full canopy stack — what sits above the areca, what sits below — is described in{' '}
          <em>Living Systems</em>. This journal is about the one tree that holds the stack up.
        </p>
        <p className="p2">
          The palm&apos;s feathered crown lets in just enough light for the coffee below to
          photosynthesise but not enough to scorch it. Its fallen fronds compost into a dense
          fibrous mulch that holds moisture through the dry months. What its trunk gives a
          climbing vine to grip is its own story, told on that vine&apos;s own page.
        </p>
        <p className="p2">
          We did not plant areca because it is a cash crop. We planted it because no other tree
          would hold up the system we were trying to build.
        </p>
      </TwoCol>

      <TwoCol id="three-jobs" heading="What the palm holds up.">
        <p className="p1">
          The mid-canopy is the load-bearing layer of a regenerative plantation. Remove it and the
          stack collapses. The areca takes three working roles in that layer.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Trellis">
            The vertical scaffolding the pepper vine climbs. No artificial trellis matches the
            rough-bark grip of a mature areca trunk — and no artificial trellis composts into the
            soil at the end of its life.
          </DataCard>
          <DataCard value="Shade filter">
            Dappled, not direct, light. Specialty Arabica below ripens slower under areca shade —
            the extra weeks that put the score on the cupping table.
          </DataCard>
          <DataCard value="Mulch source">
            Fallen fronds and leaf sheaths break down into a fibrous mulch that holds soil
            moisture, suppresses weeds, and feeds the worm beds beneath. The tree pays its own
            ground bill.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="instrument" heading="The palm reads the vine.">
        <p className="p1">
          The three roles are structural. The palm has one more that isn&apos;t: it is an instrument.
          Because the pepper vine shares its column&apos;s bloodstream, a stressed areca forecasts the
          vine climbing it — the trunk shows trouble weeks before the pepper does. Read the column, and
          you have read next season on that vine. That full reading is told from the vine&apos;s side in{' '}
          <em>Pepper</em>.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`The tree grows straight
         so that everything else
         can afford to bend.`}
      </ScrollHighlight>

      <TwoCol id="culture" heading="Betel, ritual, welcome.">
        <p className="p1">
          Areca is not a neutral tree in Karnataka. Its nut (<Term tip="Kannada for the areca nut.">adike</Term> in
          Kannada) wrapped in betel leaf is offered at weddings, at temples, at the start of a
          conversation with an elder — a small formal gesture older than anyone can date it. In
          the coastal and <Term tip="The Western Ghats region of Karnataka, defined by heavy monsoon, evergreen forest, and a distinct lineage of coffee and areca growing.">Malnad</Term> districts,
          a household&apos;s areca grove is both a bank account and a family history.
        </p>
        <p className="p2">
          We grow it aware of that lineage. The estate is part of a landscape where areca has been
          the answer to &ldquo;what shall we plant?&rdquo; for a thousand years. We are not
          introducing it; we are continuing it.
        </p>
      </TwoCol>

      <PullQuote attribution="ಎಲ್ಲವೂ ಅದರ ನೆರಳಿನಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ.">
        Everything else grows in its shade.
      </PullQuote>

      <Placeholder
        type="Portrait · nursery"
        caption="Young areca in the estate nursery — five years from now, the next generation of trellis"
      />

      <Placeholder
        type="Detail · sapling"
        caption="A single sapling, staked and waiting for its trunk to rough"
      />

      <TwoCol id="patience" heading="A tree you plant for someone else's coffee.">
        <p className="p1">
          An areca palm takes five to seven years before it bears its first useful nut, and
          longer still before its trunk is rough enough for a pepper vine to trust. Whoever plants
          one today is planting shade for a block that won&apos;t exist for a decade. That is not
          a complaint. It is the whole logic of the estate stated as a planting schedule.
        </p>
        <p className="p2">
          A palm planted this year will still be the mid-canopy in the 2050s, quietly holding up
          coffee blocks that haven&apos;t been laid out yet. We plant on that horizon on purpose.
        </p>
      </TwoCol>

      <TwoCol id="processing" heading="Fresh, dried, value-added.">
        <p className="p1">
          The nut leaves the palm in one of three trajectories.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Chali · unripe">
            Unripe green nuts, boiled and sun-dried quickly. Higher tannin, firmer bite. The
            traditional Malnad style, preferred across Karnataka.
          </DataCard>
          <DataCard value="Kempadike · ripe">
            Fully ripened nuts, sun-dried for 30 – 45 days on raised platforms. Red-brown in
            colour; softer and sweeter in character. Higher market value.
          </DataCard>
          <DataCard value="Closed loop">
            Husk fibre for rope and board. Fallen leaf sheaths for biodegradable plates. The
            apothecary and the kitchen take what the market does not. The tree leaves nothing
            behind.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Process · drying yard"
        caption="Wide raised bamboo platform in morning light, thousands of nuts turned and raked"
      />

      <Placeholder
        type="Detail · chali vs kempadike"
        caption="Green and red-brown nuts side by side — the same tree, two processing paths"
      />

      <PullQuote>
        Pull it out and the plantation collapses.
      </PullQuote>

      <TwoCol id="economics" heading="Not a monocrop. A spine.">
        <p className="p1">
          On some estates areca is the only crop. That is not this estate. Here the palm is a
          structural element — the keystone of the mid-canopy — and its economics are part of, not
          separate from, the coffee and pepper economics. When a season is hard on coffee, the
          areca holds the books. When areca prices fall, the coffee carries. The whole organism
          is sturdier than any of its crops.
        </p>
        <p className="p2">
          The sentinel palm is the quiet one. It does not show up on our cupping sheets. It does
          not win scores. But pull it out and the plantation collapses.
        </p>
      </TwoCol>

      <OneCol heading="The keystone.">
        <p className="p1">
          A keystone species in a forest is the one whose removal would collapse the structure
          around it. The areca, at Aura, is exactly that. Coffee, pepper, cardamom, turmeric,
          banana — none of them would hold without the shade and the trellis and the leaf-fall
          the palm provides for free.
        </p>
        <p className="p2">
          A plantation that depends on one tree is fragile. A plantation that is held together by
          one tree is sturdy. The difference is in which direction the dependency flows.
        </p>
      </OneCol>

      <Continue currentHref="/areca" />
    </>
  )
}
