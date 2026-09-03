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

export default function ForestIslandsPage() {
  return (
    <>
      {/* The film, with its own still as the poster. The two were separate
          visuals — the page opened on the frame and then played it again
          two beats later. */}
      <HeroBanner
        title="Forest Islands"
        src="/forest-islands/videos/aura-forest-islands-01.mp4"
        mediaType="video"
        poster="/forest-islands/images/aura-forest-islands-01.webp"
        caption="Four metres by one, built of dung and green cuttings, then left alone — Aura Estate, Mudigere"
        alt="An estate worker laying green cuttings over a forest island between cut poles"
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

      <TwoCol id="build" heading="Four metres by one, and then nothing happens to it.">
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
      </TwoCol>

      <Placeholder
        src="/forest-islands/images/aura-forest-islands-04.webp"
        alt="Leaf litter, sticks and green cuttings part-rotted into each other"
        caption="A year on, the courses have stopped being courses"
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

      <Portrait
        src="/forest-islands/images/aura-forest-islands-03.webp"
        ratio="4 / 5"
        alt="White bracket fungi stepping up the trunk of a tree beside ferns"
        caption="Left alone long enough, the decomposers arrive on their own"
      />

      <PullQuote>
        A compost heap is built to be taken away. This one is built to stay.
      </PullQuote>

      <ScrollHighlight>
        {`Organic matter.\n   Decomposition.\n   Biological activity.\n   Nutrient cycling.\n   Habitat.`}
      </ScrollHighlight>

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

      <Placeholder
        src="/forest-islands/images/aura-forest-islands-02.webp"
        alt="Two estate workers cutting back invasive growth in dense understorey"
        caption="Cleared by hand, block by block, because there is no other way to do it"
      />

      <TwoCol id="scale" heading="A hundred and fifty acres cannot be restored at once.">
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
      </TwoCol>

      <Continue currentHref="/forest-islands" />
    </>
  )
}
