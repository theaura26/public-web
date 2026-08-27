'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Continue,
} from '@/components/article/Article'

export default function ForestIslandsPage() {
  return (
    <>
      <HeroBanner
        title="Forest Islands"
        type="Detail · a built island in its first season"
        caption="Four metres by one, built of dung and green cuttings, then left alone — Sampigekhan Estate, Mudigere"
        alt="A forest island under the coffee canopy at Mudigere"
      />

      <TwoCol id="premise" heading="Restoration usually means fencing something off.">
        <p className="p1">
          The conventional way to bring a forest back is to stop farming a piece of ground and
          wait. It works. It also costs the farm the ground, which is why most working estates
          do it on the margins, or not at all.
        </p>
        <p className="p2">
          Aura is trying the other order. Instead of setting land aside, it builds small
          ecological nuclei inside the planting and lets the biology work outward from them. The
          coffee stays where it is. The forest is introduced in pieces, at a scale a working
          estate can absorb.
        </p>
      </TwoCol>

      <OneCol heading="What one is">
        <p className="p1">
          A Forest Island at Aura is about four metres by one, and stands 80 to 120 cm high. It
          is built in alternating layers: cow-dung compost from the estate&rsquo;s own herd, and
          green biomass cut that day.
        </p>
        <p className="p2">
          The two layers do different jobs. Fresh plant material supplies carbon and the physical
          structure that holds the pile open. The compost supplies a biological community that is
          already active — it arrives alive rather than waiting to be colonised.
        </p>
        <p className="p2">
          Then nothing happens to it. The island is not turned, not watered and not harvested. A
          compost heap is built to be taken away; this one is built to stay.
        </p>
      </OneCol>

      <Placeholder
        type="Process · building the layers"
        caption="Cow-dung compost and fresh green biomass, laid in alternating courses"
      />

      <TwoCol id="chain" heading="Organic matter, decomposition, habitat.">
        <p className="p1">
          The design follows one chain, and the chain is the whole idea: organic matter becomes
          decomposition, decomposition becomes biological activity, biological activity becomes
          nutrient cycling, and nutrient cycling becomes habitat.
        </p>
        <p className="p2">
          As the layers break down, the island holds moisture and accumulates partly decomposed
          material. That is shelter, and shelter is what most of a plantation is short of. Fungi,
          earthworms and the rest of the decomposer community are expected to find it and stay.
        </p>
        <p className="p2">
          Over enough seasons an island may support small plants establishing on their own,
          which adds structure to the block around it. That is the ambition. It has not been
          demonstrated yet, and this page will say so until it has.
        </p>
      </TwoCol>

      <PullQuote>
        A compost heap is built to be taken away. This one is built to stay.
      </PullQuote>

      <TwoCol id="monitoring" heading="Also an experiment.">
        <p className="p1">
          Each island doubles as a monitoring site. Aura tracks six things on them, and tracks
          them because nobody yet knows how a structure like this behaves in a Western Ghats
          coffee block over years rather than months.
        </p>
        <DataGrid>
          <DataCard value="Fungal activity">
            The first community to arrive in a pile of carbon, and the one that decides how fast
            the rest of it goes.
          </DataCard>
          <DataCard value="Decomposer communities">
            Who turns up, in what order, and whether the sequence repeats on the next island.
          </DataCard>
          <DataCard value="Earthworms">
            Counted here as they are counted across the estate, in a 50 × 50 cm quadrat.
          </DataCard>
          <DataCard value="Mulch biology">
            What is happening in the layer that is neither soil nor litter.
          </DataCard>
          <DataCard value="Woody decomposition">
            Logged by decay class, I through V, the same scale used for retained biomass.
          </DataCard>
          <DataCard value="Soil respiration">
            Whether the ground beneath and beside an island breathes differently from ground
            that has none.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <OneCol heading="Why many small ones">
        <p className="p1">
          A hundred and fifty acres cannot be restored at once, and an estate that tried would
          stop being an estate. Many small centres of activity can be built one at a time,
          costed one at a time, and judged one at a time.
        </p>
        <p className="p2">
          The question the islands are really asking is whether their influence reaches past
          their own edges. If it does, a plantation can be redesigned from the inside rather
          than surrendered in patches. If it does not, Aura will have four-metre piles of good
          compost and an answer.
        </p>
        <p className="p2">
          Either result is worth the ground it stands on. Only one of them is worth repeating,
          and the monitoring is there to say which.
        </p>
      </OneCol>

      <Continue currentHref="/forest-islands" />
    </>
  )
}
