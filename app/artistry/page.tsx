'use client'

import { Fragment } from 'react'
import {
  HeroBanner,
  OneCol,
  TwoCol,
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
import { StorytellingScroller } from '@/components/StorytellingScroller'

const ART_PASSAGES = [
  { perVh: 150, caption: 'From the canopy to the wall', media: [
    { video: '/artistry/videos/aura-plantation-canopy-map.mp4', poster: '/artistry/images/aura-plantation-canopy-map.jpg', alt: 'An aerial canopy map of the plantation' },
    { image: '/artistry/images/aura-framed-art-gallery-wall.jpg', alt: 'A gallery wall of framed botanical artwork at Ohara' },
  ] },
]

export default function ArtistryPage() {
  return (
    <>
      <HeroBanner
        currentHref="/artistry"
        title="Code and Clay"
        src="/aura-artistry.mp4"
        mediaType="video"
        poster="/aura-artistry.jpg"
        caption="Aura runs a studio and a set of labs on the estate, working the fundamentals of design, technology, and AI — each one grounded in a single discipline, subtraction: making by removing, so the work keeps to what the world already does well."
        alt="Aura artistry — the studio and labs where the fundamentals are worked"
      />

      <ExpandingBanner
        src="/artistry/videos/aura-man-painting-door.mp4"
        mediaType="video"
        poster="/artistry/images/aura-man-painting-door.jpg"
        caption="A maker at work — painted by hand, on the estate"
        alt="A craftsman painting a door by hand on the estate"
      />

      <TwoCol id="premise" heading="The studio works the fundamentals.">
        <p className="p1">
          Aura keeps a studio and a set of labs on the estate, and the work in them is narrow: the
          fundamentals of design, technology, and AI. Not trends, not tools bought to look current —
          the underlying things, the ones that hold for decades. A letterform. A joint. A material. A
          system written to run on this ground.
        </p>
        <p className="p2">
          One discipline holds all of it together. We make by subtraction — by removing, not adding,
          until only what the work needs is left. A cup loses every feature that is not the cup. A
          piece of software loses every dependency the next hand cannot keep. Subtraction is how we
          respect the way the world already works, and refuse to talk over it.
        </p>
      </TwoCol>

      <PullQuote>
        The method is subtraction. What is left has earned its place.
      </PullQuote>

      <TwoCol id="making" heading="Making is taking away.">
        <p className="p1">
          Most work adds. A brief arrives, features accrue, and the object grows until it ships. Here
          the movement runs the other way. A maker starts with more than the piece needs and spends
          the hours removing — the extra glaze, the extra line, the extra clause of code — until what
          remains could not be cut further without breaking.
        </p>
        <p className="p2">
          The estate teaches this before the studio does. A kiln burns the canopy&apos;s own offcuts
          and nothing flown in. A dye vat takes its heat from the kitchen. A ledger is written for
          this soil by the person who will keep it running. Every one of them carries the same
          lesson: use what is already here, and take away the rest. This is a skill of the present —
          worked by hand, now, on real material.
        </p>
      </TwoCol>

      <SpecTable
        title="Six crafts, one estate"
        rows={[
          { label: 'Clay', value: 'Ceramic & glaze' },
          { label: 'Fibre', value: 'Textile & natural dye' },
          { label: 'Wood', value: 'Joinery & carving' },
          { label: 'Sound', value: 'Field recording & composition' },
          { label: 'Type', value: 'Letterform & print' },
          { label: 'Software', value: 'Tools & systems for this ground' },
        ]}
      />

      <ExpandingBanner
        src="/artistry/videos/aura-installing-painted-tin.mp4"
        mediaType="video"
        poster="/artistry/images/aura-installing-painted-tin.jpg"
        caption="Installing a hand-painted tin — the work going back out into the canopy"
        alt="A hand-painted tin panel being installed on a tree"
      />

      <TwoCol id="collaboration" heading="No one here works a single craft.">
        <p className="p1">
          The register is monastic and polymathic. Science, technology, craft, and art sit at one
          bench, and no one here is kept to a single one of them. The potter also keeps the system
          that records the kiln, and the friction between the two disciplines is the material — work
          that comes out of it neither could reach alone.
        </p>
        <p className="p2">
          We hold this by an old rule —{' '}
          <Term tip="守破離 — a Japanese path to mastery in three stages. Shu: keep the form exactly. Ha: adapt it once it lives in the hands. Ri: leave the form behind and work freely, without breaking it.">shu-ha-ri</Term>:
          preserve the form, adapt it, then transcend it. An apprentice keeps the old way exactly
          until it lives in the hands. Only then is it theirs to change, and only much later theirs to
          leave behind. Collaboration is what happens across people standing at different stages of
          the same climb.
        </p>
      </TwoCol>

      <Portrait
        src="/artistry/images/aura-painted-birdhouse-tree.jpg"
        ratio="5 / 7"
        caption="A hand-painted birdhouse in the canopy — made on the estate, for the estate"
        alt="A hand-painted birdhouse mounted in a tree on the estate"
      />

      <ScrollHighlight>
        {`Start with more than you need.
         Take away what the world already does.
         Take away what the next hand can't keep.
         What remains is the work.`}
      </ScrollHighlight>

      <DataGrid cols={3} standalone>
        <DataCard value="Shu 守">
          Preserve the form exactly — the joint, the glaze, the grammar — until the old way lives in
          the hands and needs no thought.
        </DataCard>
        <DataCard value="Ha 破">
          Adapt it, once the form is in the body: local oxides, this soil&apos;s clay, a system
          written for this estate and no other.
        </DataCard>
        <DataCard value="Ri 離">
          Transcend it — leave the form behind and work freely, without breaking it. What is made here
          could not be made anywhere else.
        </DataCard>
      </DataGrid>

      <StorytellingScroller
        passages={ART_PASSAGES}
        sections={[

      <Fragment key="a0">
      <TwoCol id="future" heading="Made for hands not yet here.">
        <p className="p1">
          Aura works on a horizon measured in decades, and that sets a plain test for anything we
          make: build what the future cannot automate. A machine can copy an output. It cannot
          inherit thirty years of a craft read by hand, or a form that has passed through preserve,
          adapt, and transcend. We make the second kind on purpose.
        </p>
        <p className="p2">
          The newest tools serve the oldest practice, never the other way round. We measure the soil
          to run an ancestral grazing rhythm; we write software to carry provenance the land already
          keeps; we use AI to read what is happening on the ground, not to speak over it. Old
          knowledge and new instrument, held as one thing — that is what Aura means by Natural
          Intelligence, worked at the bench.
        </p>
      </TwoCol>
      </Fragment>,

      <Fragment key="a1">
      <DataGrid cols={3} standalone rule>
        <DataCard img="/artistry/images/aura-painted-frog-tin.jpg" value="Painted by hand">
          Salvaged tin, painted by hand with the estate&apos;s own fauna — a frog, a flower, a bird read
          straight from the canopy — then returned to the trees exactly where it was found. Nothing is
          bought new: the material is already here, and the work simply gives it a second life in the
          open air.
        </DataCard>
        <DataCard img="/artistry/images/aura-woven-fabric-detail.jpg" value="Woven & dyed">
          Cloth worked on the estate loom and dyed with what the season gives — persimmon, indigo,
          walnut hull. The weaver keeps the old grammar exactly before a single thread is adapted, so
          each piece carries the discipline of the form and the freedom that comes after it.
        </DataCard>
        <DataCard img="/artistry/images/aura-child-painting-wall.jpg" value="The next hand">
          A young hand at the wall, learning the craft long before it is formally taught. Everything the
          studio makes is built for hands not yet here — the real test of the work is whether it can be
          inherited, thirty years on, and still hold.
        </DataCard>
      </DataGrid>

      <OneCol id="close" heading="The oldest method, the newest tools.">
        <p className="p1">
          The studio and the labs do one thing: work the fundamentals of design, technology, and AI,
          and ground every one of them back in subtraction — making by removing, out of respect for a
          world that already works. What leaves is the work, and the posture that made it. Who comes
          to make here, and how you write to us, is its own journal — <em>Monastic Polymaths</em>.
        </p>
      </OneCol>

      <Continue
        items={[
          { href: '/ohara', label: 'Ohara', description: 'The valley where much of the craft is made — a place north of Kyoto that keeps its own time.', img: '/aura-ohara.jpg' },
          { href: '/mudigere', label: 'Mudigere', description: 'The estate the studio is built into — 150 acres in the Western Ghats.', img: '/aura-mudigere.jpg' },
          { href: '/herd', label: 'Ecosystem Engineers', description: 'The living system the making answers to — the herd at the centre of the estate.', img: '/herd/images/aura-relationship2.jpg' },
        ]}
      />
      </Fragment>,

        ]}
      />
    </>
  )
}
