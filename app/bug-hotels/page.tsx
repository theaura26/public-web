'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  Placeholder,
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
          The value of a Bug Hotel is not the count of insects inside it. It is that the count
          can be taken at all. Most of the invertebrate life on a plantation is impossible to
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

      <OneCol heading="One layer of several">
        <p className="p1">
          The hotels are not a programme on their own. They sit alongside the Forest Islands,
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
          The aim is not complicated. Make room for the small lives that keep the large system
          running.
        </p>
      </OneCol>

      <Continue currentHref="/bug-hotels" />
    </>
  )
}
