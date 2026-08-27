import { Fragment } from 'react'
import {
  HeroBanner,
  TwoCol,
  OneCol,
  DataGrid,
  DataCard,
  SpecTable,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'
import { ExpandingBanner } from '@/components/ExpandingBanner'
import { StorytellingScroller } from '@/components/StorytellingScroller'

/* ═══════════════════════════════════════════════════════════════════
   ECOSYSTEM ENGINEERS — the cow story, told close to the ground.

   Where Ohara opens on stillness and a white field, the herd opens on
   a living animal in motion. The page keeps close: grazing, calves,
   the hands that bathe and dose and tend them, the ID system that
   reads each animal, and what the herd returns to the soil. Editorial,
   not light — the care, the record, and the proof of doing.
═══════════════════════════════════════════════════════════════════ */

const HERD_PASSAGES = [
  { caption: 'The hands that tend the herd', media: [
    { image: '/herd/images/aura-relationship1.jpg', alt: 'The estate team with the herd at Mudigere' },
    { image: '/herd/images/aura-dung.jpg', alt: "Fresh dung collected at dawn — the estate's raw material" },
  ] },
  { caption: 'The next generation, kept pure', media: [
    { video: '/herd/videos/aura-calf1.mp4', poster: '/herd/images/aura-calf1.jpg', alt: 'A Malnad Gidda calf on the estate — the next generation' },
    { image: '/herd/images/aura-calf2.jpg', alt: 'A Malnad Gidda calf — the indigenous line kept pure' },
  ] },
]

export default function HerdPage() {
  return (
    <>
      <HeroBanner
        currentHref="/herd"
        title="Ecosystem Engineers"
        type="Detail · the herd"
        src="/herd/videos/aura-relationship2.mp4"
        mediaType="video"
        poster="/herd/images/aura-relationship2.jpg"
        caption="A hand, a mouthful of green, a calf leaning in. Fifty-two Malnad Gidda — the estate's engine — grazed on pesticide-free ground, tended by name, and read animal by animal."
        alt="A caretaker hand-feeding a Malnad Gidda calf at Mudigere, the herd behind"
      />

      <TwoCol id="reframe" heading="The herd is the estate's engine.">
        <p className="p1">
          Fifty-two{' '}
          <Term tip="A small indigenous cattle breed of the Malnad region of Karnataka, adapted to this altitude, soil, and monsoon over centuries. Low-yield, hardy, low-input.">Malnad Gidda</Term>{' '}
          live and graze at Mudigere, and almost everything the soil is fed begins in their bodies. The
          compost, the pit, the microbial brew, the sprays that go out over the coffee — trace any of them
          back and you arrive at dung, urine, or milk from these animals. The herd is the engine the farm
          runs on — its source, not its sideline.
        </p>
        <p className="p1">
          A cow walked across the land on a plan is an{' '}
          <Term tip="An organism that changes the physical world around it and, in doing so, sets the terms for what else can live there.">ecosystem engineer</Term> —
          she reshapes the ground she works and sets the terms for everything that grows there. So Aura
          reads the herd the way it reads the coffee: each animal a working part of the system, its health
          a daily signal, everything it gives back a measured input.
        </p>
      </TwoCol>

      <ExpandingBanner
        src="/herd/images/aura-grassland2.jpg"
        mediaType="image"
        alt="The Malnad Gidda herd grazing under the coffee canopy at Mudigere"
        caption="Fifty-two, on their own ground"
      />

      <TwoCol id="loop" heading="Same land, same system.">
        <p className="p1">
          The cattle graze the same 150 acres that grow the coffee, the pepper, and the cardamom — ground
          kept <strong>pesticide-free and chemical-free</strong> — and they eat what that ground makes:
          the native grasses, the understory, the cover crops between the coffee rows. Whatever a cow
          chews here grew from the soil she will feed.
        </p>
        <p className="p1">
          Then it comes back around. What she takes from a block she returns as dung and urine, carrying
          the live microbes of a gut shaped by that exact ground. Nothing is bought in, nothing trucked
          away: grass off the soil, herd off the grass, fertility off the herd, grass again. The cow eats
          the land, and the land is fed back the cow — a loop with no beginning.
        </p>
      </TwoCol>

      <ExpandingBanner
        src="/herd/images/aura-gift1.jpg"
        mediaType="image"
        alt="Grass and grazer at Mudigere — each other's gift"
        caption="Grass and grazer — each other's gift"
      />

      <StorytellingScroller
        passages={HERD_PASSAGES}
        sections={[

      <Fragment key="h0">
      <TwoCol id="care" heading="Cared for by hand.">
        <p className="p1">
          A herd on the fields every day is tended every day — washed and bathed, looked over, dosed when
          it needs it, treated with{' '}
          <Term tip="Plant-based sprays — neem, herbal decoctions, and biodynamic preparations — used in place of synthetic veterinary chemicals wherever possible.">organic sprays</Term>{' '}
          before reaching for a chemical. What touches an animal that grazes a pesticide-free block has to
          answer to the same rule as the block. And it is a whole household, not a headcount: cows,
          chickens, and the estate dogs now, goats to come, each known by the people who keep them.
        </p>
        <p className="p1">
          The closeness earns its keep. A caretaker washing a cow at dawn reads a limp, an off feed, a
          dull coat before any spreadsheet would — and these are working animals in a wild place. One of
          the herd was set on by a leopard inside the farm, fought it off, and walked back alive. They
          live a real life on this ground, and the hands around them carry it.
        </p>
      </TwoCol>
      </Fragment>,

      <Fragment key="h1">
      <PullQuote>
        Provenance begins with a COW standing in the same FIELD as the COFFEE.
      </PullQuote>

      <TwoCol id="passport" heading="Every animal, a passport.">
        <p className="p1">
          The yellow tag in a cow&apos;s ear is the visible end of a living passport. Behind it, Aura
          keeps her health day by day, the milk she gives, the urine collected from her, and, across the
          herd, the dung produced each morning. It is dense enough to run ahead of trouble — a{' '}
          <Term tip="Reading the trend in an animal's daily measures — feed, yield, output, behaviour — to flag a health issue before it shows, and to plan the herd's rotation and rest.">predictive read</Term>{' '}
          on each animal and on the whole herd&apos;s management. GPS tags, ordered and on their way, will
          add where and how each cow grazes to the same file.
        </p>
        <p className="p1">
          That record is what makes the estate traceable end to end. A batch of{' '}
          <Term tip="A living microbial culture fermented from cow dung, urine, jaggery, gram flour, and native soil, applied as a soil drench. Aura brews around 154,000 litres a year.">Jeevamrit</Term>{' '}
          is tagged to the animals that fed it; the application is tagged to the block; the block&apos;s
          soil is retested ninety days on. When a lot of coffee is sold, it traces back through soil and
          preparation to the animals that grazed that ground — animal to preparation to soil to cherry to
          cup, every link documented.
        </p>
      </TwoCol>

      <SpecTable
        title="The passport, per animal"
        rows={[
          { label: 'Ear tag', value: 'Yellow ID, one per animal' },
          { label: 'Health', value: 'Logged day by day' },
          { label: 'Milk', value: 'Per cow, daily' },
          { label: 'Urine', value: 'Collected & measured' },
          { label: 'Dung', value: 'Logged per herd, each morning' },
          { label: 'GPS grazing', value: 'Tags ordered — where & how each grazes' },
          { label: 'Traceability', value: 'Animal → preparation → soil → cherry → cup' },
        ]}
      />

      <ExpandingBanner
        src="/herd/images/aura-relationship3.jpg"
        mediaType="image"
        alt="A caretaker with an animal at Mudigere — the people who know the herd"
        caption="The people who know them"
      />

      <TwoCol id="produce" heading="Nothing wasted, everything measured.">
        <p className="p1">
          Every output of the herd is caught and put to work — dung, urine, horns, milk, ghee. From them
          the estate makes its whole pharmacy of soil biology: Jeevamrit, CPP (Cow Pat Pit), biodynamic
          compost, buttermilk sprays, and{' '}
          <Term tip="Horn manure — cow dung packed into a cow horn, buried over the cool months, then stirred into water and applied to the soil. A foundational biodynamic preparation.">BD 500</Term>.
          Nothing leaves as waste; it leaves as a measured input.
        </p>
        <p className="p1">
          And measured is the operative word. Every one of those preparations is tested in the
          estate&apos;s own lab — microbial counts and a full set of parameters — before a drop of it
          reaches the soil. What the animal produces, the lab reads; what the lab clears, the ground
          receives. The full making, testing, and correcting of those preparations is its own story —{' '}
          <a href="/circular">Circular Intelligence</a>.
        </p>
      </TwoCol>

      <TwoCol id="breed" heading="Why Malnad Gidda.">
        <p className="p1">
          The Malnad Gidda is an indigenous Karnataka breed that has grazed these hills for centuries —
          small-framed, hardy, heat-tolerant, and adapted to the altitude, the monsoon, and the specific
          grasses of the Western Ghats. Aura keeps it because a gut shaped by this ground is the likeliest source of dung suited to it.
        </p>
        <p className="p1">
          That is the reasoning, and it is worth naming as reasoning. Dung carries the gut that made
          it; a gut adapted to these grasses over generations is the likeliest source of biology suited
          to this soil. No metagenomic comparison against another breed has been run here, so the estate
          holds it as a belief it acts on rather than a result it can show you. It acts on it thoroughly:
          the line is kept pure and estate-bred, documented in each passport, an indigenous breed grown
          rare in modern Karnataka and kept alive here because the soil is thought to ask for it.
        </p>
      </TwoCol>

      <SpecTable
        title="The herd"
        rows={[
          { label: 'Head', value: '52 Malnad Gidda' },
          { label: 'Breed', value: 'Indigenous Karnataka, altitude-adapted' },
          { label: 'Frame', value: 'Small, hardy, heat-tolerant' },
          { label: 'Microbiome', value: 'Co-evolved with this soil' },
          { label: 'Line', value: 'Estate-bred, kept pure' },
          { label: 'Grazing', value: 'The same 150 acres they feed' },
        ]}
      />
      </Fragment>,

      <Fragment key="h2">
      <ScrollHighlight>
        {`Every animal, a passport.
         Every litre and kilogram, measured.
         Every batch, tested before the soil.
         The herd feeds the land it grazes.
         The loop has no beginning.`}
      </ScrollHighlight>

      <DataGrid cols={3} standalone>
        <DataCard img="/herd/images/aura-gift2.jpg" value="52">
          Malnad Gidda at Mudigere — an indigenous breed, and the estate&apos;s biological engine.
        </DataCard>
        <DataCard img="/herd/images/aura-gift3.jpg" value="Daily">
          Health, milk, and urine logged per cow; dung logged per herd — a living record for every animal.
        </DataCard>
        <DataCard img="/herd/images/aura-grassland1.jpg" value="Lab-tested">
          Every preparation the herd feeds — Jeevamrit, CPP, BD 500, compost — read in the estate&apos;s
          own lab before the soil.
        </DataCard>
      </DataGrid>

      <OneCol id="close" heading="The engine is a generational asset.">
        <p className="p1">
          The herd is the instrument that powers the estate&apos;s most durable asset — living soil, built
          on what the animals return. And it is held together by hands: the person who bathes a cow at dawn
          is the one who reads her record, collects her dung, and stirs it into the brew that evening. When
          the herd is well the preparations are strong, and when the preparations are strong the soil is
          alive. Aura keeps an indigenous breed on its own ground, cares for it one animal at a time,
          measures everything it produces, and builds the estate on the fertility it makes — one animal,
          one season, at a time.
        </p>
      </OneCol>

      <Continue
        items={[
          { href: '/circular', label: 'Circular Intelligence', description: 'Where the herd’s dung and urine go next — remade by hand into measured fertility, tested before the soil.', img: '/circular/images/aura-shed.jpg' },
          { href: '/ecology', label: 'The Health Index', description: 'The whole farm the herd feeds — fungi, worms, roots, and one Ecological Health Index per block.', img: '/aura-mudigere-landscape.jpg' },
          { href: '/mudigere', label: 'Mudigere', description: 'Aura Estate — 150 acres in the Western Ghats, the ground the herd grazes and feeds.', img: '/aura-mudigere.jpg' },
        ]}
      />
      </Fragment>,

        ]}
      />
    </>
  )
}
