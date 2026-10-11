'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Portrait,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'

export default function BugHotelsPage() {
  return (
    <>
      <HeroBanner
        title="Bug Hotels"
        src="/bug-hotels/images/aura-bug-hotels-01.webp"
        caption="Stacked at the foot of a shade tree, in among the coffee — Aura Estate, Mudigere"
        alt="A heap of gnarled logs stacked at the foot of a shade tree, ferns and coffee all around"
      />

      <TwoCol id="premise" heading="A plantation can be full of plants and short of homes.">
        <p className="p1">
          Walk a well-shaded coffee estate and it looks like habitat. Four storeys of canopy,
          green in every direction, more standing biomass than most farmland will ever carry.
        </p>
        <p className="p2">
          What a managed landscape tends to lack is the small stuff. Branches are cleared,
          prunings are burned, a fallen tree is hauled away. The wood leaves the block, and the
          carbon it was holding leaves with it, instead of going back into the ground it grew
          from.
        </p>
        <p className="p2">
          A Bug Hotel offers some of what a managed landscape can lose: places for insects to
          shelter and nest.
        </p>
      </TwoCol>

      <OneCol heading="Inside a Bug Hotel.">
        <p className="p1">
          At Aura a Bug Hotel is made of wooden logs, drilled with holes of several different
          sizes. The variation is the design: different bores suit different bodies, so one
          structure offers a range of microhabitats rather than a single kind of room. The logs
          are not meant to last: the insects that shelter in them slowly break them down, and the
          wood goes back to the soil as nutrient.
        </p>
        <p className="p2">
          Nothing is introduced. No insects are bought, bred or released. The structure is put up
          and whatever already lives on the estate either uses it or does not — which is also
          what makes it worth watching.
        </p>
      </OneCol>

      <Placeholder
        src="/bug-hotels/images/aura-bug-hotels-03.webp"
        alt="Branches piled over a large moss-covered log in the understorey, a fern in front"
        caption="Branch over log, and every gap a different size of room"
      />

      <PullQuote>
        Nothing is introduced. The structure goes up, and the estate answers.
      </PullQuote>

      <TwoCol id="instrument" heading="A shelter that is also an instrument.">
        <p className="p1">
          The value of a Bug Hotel is that the count can be taken at all. Most of the invertebrate life on a plantation is impossible to
          survey without enormous effort; a fixed structure in a known place makes a small part
          of it legible.
        </p>
        <p className="p2">
          Over seasons, four things can be recorded: which organisms use the structures, which
          materials they prefer, how occupancy changes through the year, and how any of that
          relates to the vegetation around a particular hotel.
        </p>
        <p className="p2">
          Solitary bees, wasps, beetles and spiders are the likely tenants, depending on
          materials, siting and what surrounds them. Aura is not yet publishing who has actually
          moved in, because the record is young.
        </p>
      </TwoCol>

      <Portrait
        src="/bug-hotels/images/aura-bug-hotels-05.webp"
        ratio="4 / 5"
        alt="Bees crowded along a bamboo tube, seen between out-of-focus lengths of bamboo"
        caption="Nothing here was bought, bred or released"
      />

      <TwoCol id="record" heading="Four things worth writing down.">
        <p className="p1">
          Because a hotel is a fixed structure in a known place, the same four questions can be
          asked of it season after season, and the answers can be compared rather than
          remembered.
        </p>
        <DataGrid>
          <DataCard value="Who">
            Which organisms use the structures at all, and which return.
          </DataCard>
          <DataCard value="Which materials">
            Whether one bore size or one timber is preferred over another, given the choice.
          </DataCard>
          <DataCard value="When">
            How occupancy moves through the year — nesting, resting, overwintering.
          </DataCard>
          <DataCard value="Where">
            How any of it relates to the vegetation immediately around a particular hotel.
          </DataCard>
        </DataGrid>
        <p className="p2">
          None of that requires an entomologist standing in the block every week. It requires the
          structure to stay where it is and somebody to look at it on a schedule, which is a far
          more realistic thing to ask of a working estate.
        </p>
      </TwoCol>

      {/* Wider than the default 760: at full size the second line needs
          about 806px, and at 760 it broke into a third line. */}
      <ScrollHighlight maxWidth={840}>
        {`Make room for the small lives\n   that keep the large system alive.`}
      </ScrollHighlight>

      <TwoCol id="layers" heading="One layer among several.">
        <p className="p1">
          The hotels sit alongside the Forest Islands,
          the native vegetation being encouraged back into the understorey, the deadwood that
          now stays in the block it came from, and the leaf litter that is no longer tidied.
        </p>
        <p className="p2">
          Each of those adds a kind of structural complexity that a working coffee landscape
          loses by being worked. Together they are an attempt to build a plantation that
          supports the crop and also supports the organisms the crop quietly depends on —
          predators that keep pests in proportion, decomposers that keep the ground fed. The
          hotels end up in the same place, worked through by their tenants until the logs are
          soil, and the soil is richer for it.
        </p>
      </TwoCol>

      {/* Closes on a tenant that is not a bee. The section above argues
          the hotels are one layer among several and that the point is
          the small lives, plural — a moth on the fern layer says that
          better than another frame of the structure would. */}
      <Placeholder
        src="/bug-hotels/images/aura-bug-hotels-04.webp"
        alt="A large moth at rest on ferns in the understorey"
        caption="The small lives that keep the large system running"
      />

      <Continue currentHref="/bug-hotels" />
    </>
  )
}
