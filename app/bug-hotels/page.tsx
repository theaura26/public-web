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
        type="Detail · drilled logs, varied bore"
        caption="Wooden logs with holes of different sizes, mounted in the block — Sampigekhan Estate, Mudigere"
        alt="A bug hotel mounted under the coffee canopy at Mudigere"
      />

      <TwoCol id="premise" heading="A plantation can be full of plants and short of homes.">
        <p className="p1">
          Walk a well-shaded coffee estate and it looks like habitat. Four storeys of canopy,
          green in every direction, more standing biomass than most farmland will ever carry.
        </p>
        <p className="p2">
          What a managed landscape tends to lack is the small stuff: dead wood left where it
          fell, cavities, hollow stems, the accumulated damage that a forest produces simply by
          being old. A great many insects need exactly that, and abundant vegetation does not
          supply it.
        </p>
        <p className="p2">
          A Bug Hotel is a deliberate answer to that shortage. It supplies the holes.
        </p>
      </TwoCol>

      <OneCol heading="What one is">
        <p className="p1">
          At Aura a Bug Hotel is made of wooden logs, drilled with holes of several different
          sizes. The variation is the design: different bores suit different bodies, so one
          structure offers a range of microhabitats rather than a single kind of room.
        </p>
        <p className="p2">
          Nothing is introduced. No insects are bought, bred or released. The structure is put up
          and whatever already lives on the estate either uses it or does not — which is also
          what makes it worth watching.
        </p>
      </OneCol>

      <Placeholder
        type="Detail · occupancy, close"
        caption="Different bore sizes suit different bodies — the variation is the design"
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
        src="/aura-placeholder.svg"
        ratio="5 / 7"
        alt="Drilled logs of varied bore, mounted in the block"
        caption="The holes a managed landscape stops producing"
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

      <ScrollHighlight>
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
          predators that keep pests in proportion, decomposers that keep the ground fed.
        </p>
        <p className="p2">
          The aim is simple: make room for the small lives that keep the large system running.
        </p>
      </TwoCol>

      <Continue currentHref="/bug-hotels" />
    </>
  )
}
