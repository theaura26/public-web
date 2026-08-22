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
        title="The Sentinel Palm"
        mediaType="image"
        caption="Aura grows Areca catechu as the mid-canopy at Mudigere — the upright palm that shades the coffee, carries the pepper, and mulches the ground it stands on."
        alt="Aura areca — the sentinel palm, mid-canopy of the estate"
      />

      <Placeholder
        type="Portrait · trunks"
        caption="Looking up the trunks of mature areca — pepper vines spiralling into the mist"
      />

      <TwoCol id="architecture" heading="The palm the estate is built on.">
        <p className="p1">
          At Mudigere the{' '}
          <Term tip="Areca catechu — the slender upright palm of coastal South Asia, grown for its nut and, on regenerative estates, as the structural mid-canopy.">areca palm</Term>{' '}
          is the tree the whole plantation stands on. It grows straight — <strong>15 – 20 m</strong> on a
          single vertical axis for its entire life — and Aura works it as the estate&apos;s mid-canopy,
          the layer every other crop hangs off. It never wins a cupping score and never shows up on a
          menu. It holds up the ones that do.
        </p>
        <p className="p1">
          Aura did not plant areca as a cash crop. We planted it because no other tree holds up the
          system we were building. The mid-canopy is the load-bearing layer of the plantation — pull it
          out and the stack comes down. In that layer the palm does three jobs at once.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Trellis">
            The living scaffold the pepper vine climbs. No manufactured trellis matches the rough-bark
            grip of a mature trunk, and none composts back into the soil when its work is done.
          </DataCard>
          <DataCard value="Shade filter">
            Dappled light, not direct. The Arabica beneath ripens slower under areca shade — the extra
            weeks that put the score on the cupping table.
          </DataCard>
          <DataCard value="Mulch source">
            Fallen fronds and leaf sheaths break down into a fibrous mulch that holds moisture, suppresses
            weeds, and feeds the worm beds below. The tree settles its own ground bill.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <ScrollHighlight>
        {`The tree grows straight
         so that everything else
         can afford to bend.`}
      </ScrollHighlight>

      <TwoCol id="lineage" heading="Karnataka's answer for a thousand years.">
        <p className="p1">
          Areca is not a neutral tree here. Its nut (<Term tip="Kannada for the areca nut.">adike</Term>{' '}
          in Kannada), wrapped in a betel leaf, is offered at weddings, at temples, at the start of a
          conversation with an elder — a small formal gesture older than anyone can date. In the coastal
          and{' '}
          <Term tip="The Western Ghats districts of Karnataka, defined by heavy monsoon, evergreen forest, and a long lineage of coffee and areca growing.">Malnad</Term>{' '}
          districts, a household&apos;s areca grove is at once a bank account and a family record.
        </p>
        <p className="p1">
          Aura grows it aware of that lineage. For a thousand years areca has been this landscape&apos;s
          answer to &ldquo;what shall we plant?&rdquo; — we are not introducing it, we are continuing it.
          That is the estate&apos;s method in one tree: the oldest answer in the district, kept and
          measured rather than replaced.
        </p>
      </TwoCol>

      <PullQuote attribution="ಎಲ್ಲವೂ ಅದರ ನೆರಳಿನಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ.">
        Everything else grows in its shade.
      </PullQuote>

      <Placeholder
        type="Process · drying yard"
        caption="A raised bamboo platform in morning light — thousands of nuts turned and raked"
      />

      <TwoCol id="processing" heading="White, red, nothing wasted.">
        <p className="p1">
          The nut leaves the palm along one of three paths.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Chali · white">
            Fully ripe nuts, dehusked and sun-dried for weeks on raised platforms. The white areca — the
            coastal grade.
          </DataCard>
          <DataCard value="Kempadike · red">
            Tender green nuts, boiled and dried to a deep red. Firmer, higher in tannin. The red areca —
            the Malnad grade, the one this district has always made.
          </DataCard>
          <DataCard value="Closed loop">
            Husk fibre for rope and board, leaf sheaths for biodegradable plates. The apothecary and the
            kitchen take what the market does not. The tree leaves nothing behind.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="patience" heading="A tree you plant for someone else's coffee.">
        <p className="p1">
          An areca takes five to seven years to bear its first useful nut, and longer before its trunk
          roughens enough for a pepper vine to trust. Plant one today and you are planting shade for a
          block that will not exist for a decade. That is not a complaint. It is the estate&apos;s whole
          logic written as a planting schedule.
        </p>
        <p className="p1">
          A palm Aura plants this year will still be the mid-canopy in the 2050s, holding up coffee that
          has not been laid out yet. We plant on that horizon on purpose.
        </p>
      </TwoCol>

      <OneCol id="economics" heading="Not a monocrop. A spine.">
        <p className="p1">
          On some estates areca is the only crop. Not here. At Aura the palm is the spine of the
          mid-canopy, and its economics are part of the coffee and the pepper, not separate from them.
          When a season is hard on coffee, the areca holds the books. When areca prices fall, the coffee
          carries. The whole organism is sturdier than any single crop in it.
        </p>
        <p className="p1">
          The sentinel palm is the quiet one. It never shows up on a cupping sheet and never wins a
          score. But pull it out and the plantation comes down. A plantation that leans on one tree is
          fragile; a plantation held together by one is sturdy — the difference is which way the
          dependency runs.
        </p>
      </OneCol>

      <Continue currentHref="/areca" />
    </>
  )
}
