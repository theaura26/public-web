import {
  HeroBanner,
  TwoCol,
  OneCol,
  DataGrid,
  DataCard,
  SpecTable,
  Portrait,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'
import { ExpandingBanner } from '@/components/ExpandingBanner'

export default function ShadePage() {
  return (
    <>
      <HeroBanner
        currentHref="/shade"
        title="The Light Instrument"
        src="/shade/videos/aura-tree-canopy-lookup.mp4"
        mediaType="video"
        poster="/shade/images/aura-tree-canopy-lookup.jpg"
        caption="Aura manages the shade canopy over its coffee at Mudigere as a strategic instrument for light — an old Western Ghats practice, now measured in lux and cut to prescription, tuning how much sun each block of coffee gets on a horizon measured in decades."
        alt="Looking up through the shade canopy at Mudigere"
      />

      <TwoCol id="reframe" heading="Shade is the estate's oldest tool.">
        <p className="p1">
          The coffee of the Western Ghats has grown under trees for more than three centuries. Here shade
          is structural: native forest trees and planted{' '}
          <Term tip="Grevillea robusta — Silver Oak. A fast-growing timber tree planted through Western Ghats coffee as an upper-canopy shade, valued for its light, filtering crown.">Silver Oak</Term>{' '}
          form a multi-layered canopy that holds moisture, moderates temperature, cycles nutrients, and
          carries the biodiversity that makes this one of the world&apos;s recognised hotspots. Aura works
          that canopy as an instrument — the layer that decides how much sun reaches the coffee below.
        </p>
        <p className="p2">
          The tuning is a practice called{' '}
          <Term tip="The selective removal of branches from shade trees to regulate light reaching the coffee, while preserving each tree's natural architecture. Lighter and more precise than lopping or pollarding.">shade whiskering</Term>:
          the selective removal of branches to regulate the light without felling the tree or breaking
          its form. Too much shade suppresses flowering; too little exposes the coffee to heat and
          moisture stress. The work is to find the balance a block of coffee actually wants, and hold it —
          season after season, tree by tree.
        </p>
      </TwoCol>

      <SpecTable
        title="Canopy profile"
        rows={[
          { label: 'Estate', value: 'Aura Estate, 150 acres' },
          { label: 'Canopy layers', value: '4 vertical stories' },
          { label: 'Target coverage', value: '60–80% per block' },
          { label: 'Optimal range', value: '65–75% (highest Brix)' },
          { label: 'LUX data points', value: 'Hundreds, GPS-tagged' },
          { label: 'Full sun reference', value: '100,000+ lux' },
        ]}
      />

      <ExpandingBanner
        src="/shade/videos/aura-misty-mountain-forest.mp4"
        mediaType="video"
        poster="/shade/images/aura-misty-mountain-forest.jpg"
        caption="The Western Ghats canopy — three centuries of shade-grown coffee"
        alt="Mist over the shade canopy of the Western Ghats"
      />

      <TwoCol id="stories" heading="Four stories, one canopy.">
        <p className="p1">
          The canopy is not a uniform blanket — it is a four-story architecture, and every tree in it has
          been counted, tagged, and mapped. An emergent layer of silver oak, fig, and jackfruit regulates
          temperature and holds carbon. Beneath it, areca palm and native hardwoods carry the mid-level
          shade and trellis the pepper. The coffee — Arabica Sln.9 and 795 — sits in the understory,
          reading the light that falls through. A ground layer of pepper, cardamom, ginger, and cover
          crops protects the soil.
        </p>
        <p className="p2">
          The stories are coupled. Prune the emergent layer too hard and the canopy below floods with
          light; the areca palms stress, and within six to eight weeks the pepper vines climbing them lose
          vigour. The intervention window is roughly three weeks. Every cut in the top layer ripples
          through the system beneath it — which is why the light is measured before a branch comes down.
        </p>
      </TwoCol>

      <SpecTable
        title="Canopy — four stories"
        tightTop
        rows={[
          { label: '01 · Emergent', value: 'Silver oak, fig, jackfruit' },
          { label: '02 · Canopy', value: 'Areca palm, native hardwoods' },
          { label: '03 · Understory', value: 'Coffee — Arabica Sln.9, 795' },
          { label: '04 · Ground', value: 'Pepper, cardamom, ginger, cover crops' },
        ]}
      />

      <TwoCol id="why" heading="The old way was a guess.">
        <p className="p1">
          Whiskering has traditionally run on the eye. A contractor reads the canopy, judges what to take,
          and directs the cut. Done by feel, it removes branches indiscriminately, opens the canopy
          unevenly, and distorts the crown of a tree that will stand for another fifty years — leaving
          some coffee scorched and some starved of light within the same block.
        </p>
        <p className="p2">
          In the 2026 pre-monsoon season, Aura rebuilt the practice around measurement. Before a branch
          came down, the light was quantified; the cutting followed a prescription written from that data;
          the result was checked against it afterwards. The guiding order was plain, and it governed every
          block:
        </p>
      </TwoCol>

      <PullQuote>
        Measure first. Prune later. Validate afterwards.
      </PullQuote>

      <TwoCol id="measure" heading="We measure the light before we cut.">
        <p className="p1">
          The baseline was read in{' '}
          <Term tip="A unit of illuminance — light falling on a surface. A lux meter reads it directly, replacing a visual estimate of canopy density with a number.">lux</Term>.
          Forestry interns Nayana and Jagadeshwari walked the blocks with two digital lux meters, taking
          the sunlight reaching the coffee as a measurement rather than an impression. The targets came
          from the{' '}
          <Term tip="Central Coffee Research Institute — India's national coffee research body, in Karnataka. Sets agronomic standards for the region's estates.">CCRI</Term>:
          fifty to seventy thousand lux for Arabica, seventy to ninety thousand for the hardier Robusta.
        </p>
        <p className="p2">
          To catch how much the canopy varies within a single acre, Aura built a five-cluster method. Each
          acre was divided into five clusters, and ten readings taken at random inside each — fifty
          observations an acre, resolved into five cluster averages. The readings map each block into
          zones — dense shade, medium, open — so it reads not as one number but as a gradient. The cut
          answers the zone, not the block: fine enough to find a shaded pocket a few trees wide and leave
          the rest standing.
        </p>
      </TwoCol>

      <SpecTable
        title="CCRI light targets"
        rows={[
          { label: 'Arabica', value: '50,000–70,000 lux' },
          { label: 'Robusta', value: '70,000–90,000 lux' },
          { label: 'Managed shade canopy', value: '30,000–80,000 lux' },
          { label: 'Full sun', value: '100,000+ lux' },
        ]}
      />

      <ExpandingBanner
        src="/shade/images/aura-dense-forest-interior.jpg"
        mediaType="image"
        caption="Zone A · dense shade — two-thirds of the direct sun filtered before it reaches the coffee"
        alt="Dense shade under the closed canopy"
      />

      <SpecTable
        title="Illuminance survey — Block 3 (Byton Patte), 2026"
        rows={[
          { label: 'Zone A · Dense shade', value: '~33,000 lux avg' },
          { label: 'Zone B · Medium shade', value: '~62,000 lux avg' },
          { label: 'Zone C · Open canopy', value: '~82,000 lux avg' },
          { label: 'Readings per cluster', value: '10 measurements' },
          { label: 'Full sun reference', value: '100,000+ lux' },
        ]}
        note="Five clusters × ten readings = fifty observations per acre."
      />

      <TwoCol id="cut" heading="Every cut is prescribed.">
        <p className="p1">
          The light data were read block by block, and each block got its own prescription — how much to
          take, and where — rather than one uniform pass across the estate. The operation covered roughly
          eighty acres, worked in the May–June window before the south-west monsoon closed the canopy in
          for the year. A team of eleven tree loppers and ten branch choppers carried it out.
        </p>
        <p className="p2">
          What separates whiskering from lopping is where the judgement sits. Every significant cut was
          directed by a supervisor against the prescription, weighed for branch orientation, crown
          symmetry, the tree&apos;s centre of gravity, and its stability through the storms ahead. The
          tree keeps its architecture and its life; the coffee below gets the light the numbers asked for.
        </p>
      </TwoCol>

      <PullQuote>
        Cut too much and you flood the coffee with light. Cut too little and the cherry never ripens.
        The right cut is in the reading, not the manual.
      </PullQuote>

      <ExpandingBanner
        src="/shade/images/aura-sunlit-moss-ground.jpg"
        mediaType="image"
        caption="Light reaching the floor — the reading the whole practice is tuned to"
        alt="Sunlight falling through the canopy onto the forest floor"
      />

      <TwoCol id="biomass" heading="Nothing cut leaves the ground.">
        <p className="p1">
          Whiskering eighty acres makes a great deal of wood, and Aura treats it as feedstock, not waste.
          Large branches are stacked to break down in place; leaf litter stays where it falls, as mulch
          that holds soil moisture and feeds the nutrient cycle. Silver Oak is set apart from the native
          wood — it decomposes slowly and is mildly{' '}
          <Term tip="Allelopathy — the release of compounds that suppress the growth of nearby plants. Silver Oak litter is kept separate so it breaks down on its own terms.">allelopathic</Term>,
          so it composts on its own terms rather than checking the growth around it.
        </p>
        <p className="p2">
          The trees are tended too. A fresh cut is an open wound and a way in for wood-decaying fungi, so
          every major cut is sealed with a paste of{' '}
          <Term tip="Cow Pat Preparation — a fermented, microbially rich compost made from the herd's dung, used across the estate's biodynamic work. Here, mixed with turmeric into a wound dressing.">cow pat preparation</Term>{' '}
          and turmeric — the herd&apos;s dung and a native antiseptic, closing the wound the same way the
          rest of the estate is fed.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Measure the light.
         Cut only what the numbers ask.
         Feed the cut back to the ground.
         Measure the light again.
         The canopy holds; the coffee ripens.`}
      </ScrollHighlight>

      <TwoCol id="aura" heading="How Aura manages the canopy.">
        <p className="p1">
          The estate already knows the light is worth this much attention: blocks held at sixty-five to
          seventy-five per cent canopy cup measurably better, and canopy vitality is tracked by satellite
          every quarter. Whiskering is where that knowledge meets the tree — the annual decision that sets
          the light for the whole season beneath it.
        </p>
        <p className="p2">
          What Aura added is the loop that makes it repeatable: baseline reading, block-wise prescription,
          selective cutting, biomass returned, wounds dressed, and a post-operation survey to confirm the
          targets were hit and the coffee was not over-exposed. An old regional craft, run on measurement
          and validated against its own numbers — Natural Intelligence, applied to light.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard value="50–70k lux">
          The light an Arabica block is tuned to under the canopy, on CCRI targets — Robusta is held
          higher, at seventy to ninety thousand.
        </DataCard>
        <DataCard value="80 acres">
          Whiskered to block-by-block prescription in the 2026 pre-monsoon window, before the south-west
          rains closed the canopy for the year.
        </DataCard>
        <DataCard value="50">
          Lux readings taken per acre — five clusters, ten readings each — before a single branch came
          down.
        </DataCard>
      </DataGrid>

      <Portrait
        src="/shade/images/aura-father-child-silhouette.jpg"
        ratio="5 / 7"
        caption="A canopy planted for a generation that will inherit it"
        alt="A father and child, silhouetted against the mountains at dusk"
      />

      <OneCol id="close" heading="Light is a generational decision.">
        <p className="p1">
          A shade tree cut this season carries the coffee for years, and the tree itself was planted for a
          canopy the planter would never see mature. Managing that canopy by measurement rather than by
          eye is how Aura keeps a three-century landscape productive without spending it down — light held
          at the level the coffee wants, trees kept in their full form, the wood returned to the soil that
          grew it. Old practice, modern measurement, a horizon in decades: one block, one season, at a
          time.
        </p>
      </OneCol>

      <Continue
        items={[
          { href: '/ecology', label: 'The Living System', description: 'The canopy is one reading among many — the whole farm measured, above ground and below.', img: '/aura-mudigere-landscape.jpg' },
          { href: '/circular', label: 'Circular Intelligence', description: 'What the pruned wood and the herd feed back — measured fertility, tested before the soil.', img: '/circular/images/aura-shed.jpg' },
          { href: '/herd', label: 'Ecosystem Engineers', description: 'The biological engine under the canopy — fifty-two Malnad Gidda, each passported.', img: '/herd/images/aura-relationship2.jpg' },
        ]}
      />
    </>
  )
}
