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
import { ParallaxBanner } from '@/components/ParallaxBanner'

/* ═══════════════════════════════════════════════════════════════════
   THE LIVING SYSTEM — the whole-farm ecological monitoring story.

   Where herd is the animal and circular is the fertility loop, this
   page zooms out to the whole living system, above ground and below:
   retained wood and the fungi that eat it, forest islands, the soil's
   pulse, and the single Ecological Health Index that draws it all
   together. Editorial and exact — measuring what regeneration is
   actually doing, block by block.
═══════════════════════════════════════════════════════════════════ */

export default function EcologyPage() {
  return (
    <>
      <HeroBanner
        currentHref="/ecology"
        title="The Living System"
        src="/ecology/videos/aura-forest-floor-seedling.mp4"
        mediaType="video"
        poster="/ecology/images/aura-forest-floor-seedling.jpg"
        caption="Aura reads its estate as one living system — canopy to root, dead wood to fungus to earthworm — and folds every reading into a single Ecological Health Index for each block, so regeneration is measured, not assumed."
        alt="A seedling emerging on the living forest floor"
      />

      <TwoCol id="reframe" heading="The farm is read as a living system.">
        <p className="p1">
          A coffee estate is a forest that produces coffee — canopy, shade trees, understory, soil, fungi,
          insects, birds, and water, all working at once. Aura runs the
          whole of it as a single system and, crucially, <em>measures</em> it: not how much compost was
          spread or how many rows were weeded, but what the ground and the canopy are actually doing in
          response.
        </p>
        <p className="p2">
          That is the shift — from recording activities to reading ecological outcomes. Above ground, the
          canopy is mapped in light and pruned to prescription. Below ground, the soil is read for its
          breath, its worms, its fungi, and its roots. Each is a separate monitoring programme with its
          own method and rhythm, and together they answer one question: is the land coming back?
        </p>
      </TwoCol>

      <ParallaxBanner
        image="/ecology/images/aura-mossy-tree-hollow.jpg"
        caption="A mossed hollow in fallen wood — the start of another life, not the end of one"
        alt="Moss and fungi colonising a hollow in dead wood"
      />

      <TwoCol id="biomass" heading="Dead wood is food for the forest.">
        <p className="p1">
          In most plantations a fallen branch is cleared or burned. In a forest it is the start of another
          life. Aura keeps its woody biomass — from{' '}
          <a href="/shade">shade whiskering</a>, pruning, and natural tree-fall — inside the block it came
          from: cut to sixty-to-ninety-centimetre lengths and stacked to break down where it lies, food
          for the fungi rather than waste to be removed.
        </p>
        <p className="p2">
          Wood is mostly lignin, and almost nothing can break lignin down except{' '}
          <Term tip="Wood-rotting fungi that carry the rare enzymes needed to break down lignin. Their hyphae penetrate dead wood and convert it, slowly, into humus.">saprophytic fungi</Term>.
          As they work, the estate reads the decay: a{' '}
          <Term tip="A five-stage classification of how far dead wood has decomposed — from freshly fallen and bark-intact (Class I) to soft, crumbling, soil-like (Class V). Adapted from forest ecology.">decay class</Term>{' '}
          from I to V, the source and species of the biomass, the{' '}
          <Term tip="The number of distinct fungal fruiting-body types — mushrooms, brackets — observed, especially in the monsoon. A proxy for indigenous fungal diversity.">fruiting-body diversity</Term>{' '}
          that emerges each monsoon. It is a slow-release resource — carbon and habitat returned to the
          soil over years, long after the pruning is done.
        </p>
      </TwoCol>

      <SpecTable
        title="Woody biomass — monitoring"
        rows={[
          { label: 'Biomass retained', value: 'kg–tonnes / block · annual' },
          { label: 'Decay class', value: 'Class I–V · quarterly' },
          { label: 'Fungal colonisation', value: 'Presence & abundance · quarterly' },
          { label: 'Fruiting-body diversity', value: 'Taxa observed · monsoon' },
          { label: 'Carbon returned', value: 'kg C / block / year · annual' },
        ]}
        note="Branches cut to 60–90 cm and stacked in the block they came from."
      />

      <ParallaxBanner
        image="/ecology/images/aura-white-mushrooms-mulch.jpg"
        caption="Saprophytic fungi fruiting through the mulch — lignin, becoming soil"
        alt="A cluster of white mushrooms rising through leaf-litter mulch"
      />

      <TwoCol id="islands" heading="Forest islands, and the forest floor.">
        <p className="p1">
          Where a natural forest concentrates biology in undisturbed pockets, Aura builds them on purpose.
          A <strong>forest island</strong> is a mound — roughly five metres by one, sixty centimetres high
          — of five alternating layers of green biomass and mature cow-dung compost, inoculated with the
          herd&apos;s{' '}
          <Term tip="Cow Pat Pit — a fermented, microbially rich compost made from the herd's dung. Used to seed a forest island with a diverse microbial community.">CPP</Term>{' '}
          and then left completely alone. No turning, no watering: a microbial sanctuary that colonises
          itself and slowly seeds the soil around it.
        </p>
        <p className="p2">
          Across the rest of the ground, the estate keeps a forest floor. Prunings, leaves, and weeds are
          returned as a two-to-five-centimetre mulch over bare soil — the skin of the ecosystem, holding
          moisture, moderating temperature, and feeding the fungi and earthworms beneath. Bare soil is
          treated as a wound; a living, littered floor is treated as the healthy state.
        </p>
      </TwoCol>

      <SpecTable
        title="Forest island"
        rows={[
          { label: 'Dimensions', value: '5 m × 1 m × 60 cm' },
          { label: 'Structure', value: '5 alternating layers, 4–8 cm each' },
          { label: 'Composition', value: 'Green biomass + dung compost' },
          { label: 'Inoculation', value: 'Cow Pat Pit (CPP)' },
          { label: 'Maintenance', value: 'None — no turning, no watering' },
        ]}
      />

      <PullQuote>
        A forest is nourished not only by what it grows, but by what it leaves behind.
      </PullQuote>

      <ParallaxBanner
        image="/ecology/images/aura-termite-burrow-soil.jpg"
        caption="The hidden workforce — termites, millipedes, and the fauna that fragment the litter"
        alt="A termite burrow worked into the soil of the forest floor"
      />

      <TwoCol id="pulse" heading="The soil keeps a pulse.">
        <p className="p1">
          Some of what the soil is doing can be measured in real time.{' '}
          <Term tip="The carbon dioxide released by roots, microbes, and soil fauna as they respire — a direct, real-time measure of how biologically active a soil is. Aura reads it monthly by alkali (NaOH) absorption from the top 0–15 cm.">Soil respiration</Term>{' '}
          — the carbon dioxide the ground gives off as its life works — is read monthly, and it moves
          before anything shows in the canopy, registering a soil coming back long before the coffee does.
          Earthworms tell the same story in a body you can hold: counted each quarter in a fixed square of
          ground,{' '}
          <Term tip="Three functional groups — epigeic (surface litter), endogeic (topsoil), and anecic (deep vertical burrowers). Together they aerate, mix, and build the soil.">surface-dwellers to deep-burrowers</Term>,
          a rising population is one of the clearest signs the ground is healing.
        </p>
        <p className="p2">
          Deeper still, the estate reads the roots — the{' '}
          <Term tip="The biologically active zone around a root, where the plant trades carbon-rich exudates with fungi and bacteria.">rhizosphere</Term>{' '}
          and its{' '}
          <Term tip="Arbuscular mycorrhizal fungi — fungi that extend the root system far beyond its own reach, trading water and nutrients for the plant's carbon. Measured as percent of root length colonised.">mycorrhizal colonisation</Term> —
          alongside water infiltration, aggregate stability, ground vegetation, decomposer insects, birds,
          and the estate&apos;s own indigenous fungal library. Fourteen living readings of one system, each
          taken on its own clock.
        </p>
      </TwoCol>

      <SpecTable
        title="Reading the soil"
        rows={[
          { label: 'Soil respiration', value: 'NaOH method · monthly · 0–15 cm' },
          { label: 'Earthworms', value: '50 × 50 cm quadrat · 20–30 cm deep' },
          { label: 'Earthworm groups', value: 'Epigeic · Endogeic · Anecic' },
          { label: 'Mycorrhizae', value: '% root length colonised · annual' },
          { label: 'Standard quadrat', value: '1 × 1 m, fixed & photographed' },
        ]}
      />

      <Portrait
        src="/ecology/images/aura-lichen-on-bark.jpg"
        ratio="5 / 7"
        caption="Lichen on bark — an indicator the estate is building into a living library of its own indigenous fungi"
        alt="Lichen growing in detail on the bark of a tree"
      />

      <ScrollHighlight>
        {`Dead wood becomes fungus.
         Fungus becomes soil.
         The soil breathes, and the worms count it.
         Every reading, above ground and below.
         One system, measured whole.`}
      </ScrollHighlight>

      <TwoCol id="index" heading="One score per block.">
        <p className="p1">
          No single reading can describe a living system, so Aura combines them. Fifteen monitoring
          programmes — canopy, woody biomass, forest islands, forest floor, ground vegetation, earthworms,
          respiration, soil structure, roots, decomposers, birds, water infiltration, fungi, and carbon —
          are each standardised and rolled into one composite score for every plantation block: the{' '}
          <Term tip="A 0–100 composite score per block that integrates every ecological monitoring programme. Bands run from Restoration Priority (below 40) to Excellent (90+).">Ecological Health Index</Term>.
        </p>
        <p className="p2">
          The index is read by block and by band — restoration priority, degraded, regenerating, healthy,
          excellent — so the estate can compare one stretch of ground against another, watch a block climb
          season by season, and send the next intervention exactly where the numbers say it is needed. It
          turns a manual of separate observations into a single map of where the land stands.
        </p>
      </TwoCol>

      <SpecTable
        title="Fifteen programmes → one index"
        rows={[
          { label: 'Canopy', value: 'Shade quality' },
          { label: 'Woody biomass', value: 'Biomass retained' },
          { label: 'Forest islands', value: 'Number & condition' },
          { label: 'Forest floor', value: 'Litter & cover' },
          { label: 'Ground vegetation', value: 'Vegetation dynamics' },
          { label: 'Soil biology', value: 'Earthworm abundance' },
          { label: 'Microbial activity', value: 'Soil respiration' },
          { label: 'Soil structure', value: 'Aggregate stability' },
          { label: 'Root system', value: 'Root health' },
          { label: 'Decomposers', value: 'Decomposer diversity' },
          { label: 'Avifauna', value: 'Bird diversity' },
          { label: 'Hydrology', value: 'Rainwater infiltration' },
          { label: 'Fungal ecology', value: 'Fungal colonisation' },
          { label: 'Carbon', value: 'Soil organic carbon' },
        ]}
      />

      <SpecTable
        title="Ecological Health Index"
        tightTop
        rows={[
          { label: '90–100', value: 'Excellent ecological health' },
          { label: '75–89', value: 'Healthy & resilient' },
          { label: '60–74', value: 'Regenerating' },
          { label: '40–59', value: 'Ecologically degraded' },
          { label: 'Below 40', value: 'Restoration priority' },
        ]}
        note="One 0–100 composite score per block, assessed annually."
      />

      <DataGrid cols={3} standalone>
        <DataCard img="/ecology/images/aura-brown-funnel-mushroom.jpg" value="Fungal carbon">
          Dead wood becomes fungus, fungus becomes humus — the slow return of carbon read by decay class
          and fruiting.
        </DataCard>
        <DataCard img="/ecology/images/aura-coiled-millipede-hand.jpg" value="The decomposers">
          Springtails, millipedes, isopods, termites, and beetles — the hidden workforce that fragments
          litter before the fungi finish it.
        </DataCard>
        <DataCard img="/ecology/images/aura-white-mushroom-cluster.jpg" value="Indigenous fungi">
          The estate&apos;s own fungi, surveyed and — where labs allow — cultured into a living library of
          Western Ghats strains.
        </DataCard>
      </DataGrid>

      <OneCol id="close" heading="Run on outcomes, not inputs.">
        <p className="p1">
          The point of the index is a plantation that runs its own ecology — where fungi, worms, and
          microbes hold the fertility, where carbon stays in the ground, and where a good harvest is a
          consequence of a healthy system rather than a thing bought in by the sack. Measured honestly,
          block by block, year after year, the estate moves closer to the forest that coffee first grew
          inside — the oldest model there is, run with the newest instruments we trust. That is Natural
          Intelligence, applied to a whole living system, on a horizon measured in generations.
        </p>
      </OneCol>

      <Continue
        items={[
          { href: '/shade', label: 'The Light Instrument', description: 'The canopy above the system — shade whiskering, measured in lux and cut to prescription.', img: '/aura-land.jpg' },
          { href: '/circular', label: 'Circular Intelligence', description: 'The fertility below it — CPP and Jeevamrit, made by hand and tested before the soil.', img: '/circular/images/aura-shed.jpg' },
          { href: '/herd', label: 'Ecosystem Engineers', description: 'The biological engine at the centre — fifty-two Malnad Gidda, cared for by hand, each passported.', img: '/herd/images/aura-relationship2.jpg' },
        ]}
      />
    </>
  )
}
