'use client'

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
   CIRCULAR INTELLIGENCE — the fertility loop, told as an alchemy.

   Its own register: darker, closer, biological. Where the herd page
   stays on the animal, this one goes into the shed, the pit, and the
   lab — the pour of dung, the daily stir, the CPP ball dug in at a
   plant's root, and the batch numbers that make it all provable.
   Editorial and exact: the making, the testing, and the proof.
═══════════════════════════════════════════════════════════════════ */

const CIRC_PASSAGES = [
  { caption: 'Fourteen pits, turned by hand', media: [
    { image: '/circular/images/aura-cpp.jpg', alt: 'A numbered Cow Pat Pit at Mudigere, turned by hand' },
    { image: '/circular/images/aura-saltrock.jpg', alt: 'Finely ground basalt dust — the mineral component of CPP' },
  ] },
  { caption: 'The life that builds the soil back', media: [
    { video: '/circular/videos/aura-microbe.mp4', poster: '/circular/images/aura-microbe.jpg', alt: "Microbial colonies from the estate's soil, under the lens" },
    { image: '/circular/images/aura-mushroom.jpg', alt: 'Fungi on the estate floor — the organisms that build soil' },
  ] },
]

export default function CircularPage() {
  return (
    <>
      <HeroBanner
        currentHref="/circular"
        title="Circular Intelligence"
        type="Detail · the living factory"
        src="/circular/videos/aura-shed.mp4"
        mediaType="video"
        poster="/circular/images/aura-shed.jpg"
        caption="At Mudigere, Aura turns the herd's dung and urine into measured fertility — hand-turned compost pits, a living microbial brew, and an internal lab where every batch is tested before it reaches the soil."
        alt="The preparation shed at Mudigere, where the estate's fertility is made"
      />

      <TwoCol id="reframe" heading="Nothing imported. Nothing wasted.">
        <p className="p1">
          It begins before the heat, at first light. The dung is gathered fresh — weighed and split three
          ways: some to the compost pits, some to the microbial brews, some packed into horns — and the
          urine, most concentrated at dawn, is measured into the same system. This is the estate&apos;s
          most valuable raw material, and not a gram of it is left to waste.
        </p>
        <p className="p1">
          From that single input Aura runs a closed loop. The grasses feed the herd; the herd feeds the
          preparations; the preparations feed the soil; the soil grows the grasses and the coffee. Nothing
          is bought in and nothing leaks out — the work is turning the animal&apos;s output back into
          living ground, measured at every step, on the same fifty-two{' '}
          <Term tip="A small indigenous cattle breed of the Malnad region of Karnataka, adapted to this altitude, soil, and monsoon over centuries. Their gut microbiome is shaped by this land, so their dung carries a microbial signature native to it.">Malnad Gidda</Term>{' '}
          that graze the land they feed.
        </p>
      </TwoCol>

      {/* The closed loop — a system diagram of the core idea. Four nodes on
          a ring, clockwise arrows; currentColor so it inverts cleanly on any
          surface. This is the page's central concept, shown before it's
          explained in detail. */}
      <section style={{ padding: 'var(--section-gap) 0' }}>
        <div className="section-w">
          <p className="label" style={{ margin: 0, textAlign: 'center' }}>The closed loop</p>
          <figure className="loop-diagram">
            <svg viewBox="0 0 900 660" role="img" aria-label="The closed fertility loop: grass and coffee feed the herd, the herd feeds the preparations, the preparations feed the soil, and the soil grows the grass.">
              <defs>
                <marker id="loop-arrow" markerWidth="9" markerHeight="9" refX="4.5" refY="3" orient="auto-start-reverse">
                  <path d="M0,0 L6,3 L0,6 Z" fill="currentColor" />
                </marker>
              </defs>
              <g fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.5">
                <path d="M 509.5 107.8 A 230 230 0 0 1 672.2 270.5" markerEnd="url(#loop-arrow)" />
                <path d="M 672.2 389.5 A 230 230 0 0 1 509.5 552.2" markerEnd="url(#loop-arrow)" />
                <path d="M 390.5 552.2 A 230 230 0 0 1 227.8 389.5" markerEnd="url(#loop-arrow)" />
                <path d="M 227.8 270.5 A 230 230 0 0 1 390.5 107.8" markerEnd="url(#loop-arrow)" />
              </g>
              <g fill="currentColor">
                <circle cx="450" cy="100" r="4.5" />
                <circle cx="680" cy="330" r="4.5" />
                <circle cx="450" cy="560" r="4.5" />
                <circle cx="220" cy="330" r="4.5" />
              </g>
              <g className="loop-node" textAnchor="middle" fill="currentColor">
                <text x="450" y="72">Grass &amp; coffee</text>
                <text x="700" y="336" textAnchor="start">The herd</text>
                <text x="450" y="600">Preparations</text>
                <text x="200" y="336" textAnchor="end">The soil</text>
              </g>
              <g className="loop-center" textAnchor="middle" fill="currentColor">
                <text x="450" y="323">Nothing in</text>
                <text x="450" y="351">Nothing out</text>
              </g>
            </svg>
          </figure>
          <p className="p1 loop-diagram__cap">
            Grass feeds the herd. The herd feeds the preparations. The preparations feed the soil. The
            soil grows the grass. Nothing enters the loop, and nothing leaves it — the estate&apos;s
            fertility is made entirely from what it already produces.
          </p>
          <style jsx>{`
            .loop-diagram {
              margin: clamp(28px, 5vh, 56px) auto 0;
              max-width: min(520px, 92%);
            }
            .loop-diagram :global(svg) {
              width: 100%;
              height: auto;
              display: block;
              color: var(--text);
            }
            .loop-diagram :global(.loop-node text) {
              font-family: var(--font-mono);
              font-size: 24px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .loop-diagram :global(.loop-center text) {
              font-family: var(--font-mono);
              font-size: 19px;
              letter-spacing: 1px;
              text-transform: uppercase;
              opacity: 0.5;
            }
            .loop-diagram__cap {
              max-width: 560px;
              margin: clamp(28px, 4vh, 44px) auto 0;
              text-align: center;
              color: var(--text-body);
            }
          `}</style>
        </div>
      </section>

      <ExpandingBanner
        src="/circular/images/aura-dung.jpg"
        mediaType="image"
        alt="Fresh dung collected at dawn — the estate's raw material"
        caption="Dung and urine, at dawn"
      />

      <StorytellingScroller
        passages={CIRC_PASSAGES}
        sections={[

      <Fragment key="c0">
      <TwoCol id="cpp" heading="CPP: the slow compost.">
        <p className="p1">
          The first product is{' '}
          <Term tip="Cow Pat Pit — a biodynamic preparation of composted cow dung activated with the BD compost preparations, fermented slowly in a numbered earthen pit and applied as a field spray or dug in as a ball.">CPP</Term> —
          Cow Pat Pit. Fresh dung is mixed by hand with crushed eggshell for calcium and finely ground{' '}
          <Term tip="Finely ground basalt rock — a source of silica, iron, magnesium, and trace minerals, valued in biodynamic practice for enlivening soil biology.">basalt dust</Term>{' '}
          for minerals, then the biodynamic{' '}
          <Term tip="Yarrow, chamomile, stinging nettle, oak bark, dandelion, and valerian (BD 502–507), together with horn manure (BD 500) and horsetail (BD 508). Herbal and mineral ferments that steer decomposition and enrich the compost.">preparations — BD 500 through 508 —</Term>{' '}
          are worked in and the mix is layered into a shallow earthen pit, dug into the ground and left
          unlined at the bottom so the estate&apos;s own soil organisms migrate up and inoculate it.
        </p>
        <p className="p1">
          Every pit carries a number, and every pit is worked by hand: the dung is mixed and stirred
          roughly forty-five minutes a day, breaking up the pulps so it matures evenly. Fourteen pits run
          across the estate in overlapping cycles — around 2,420 kilograms of CPP a year — turned by
          reading, not by timer. The team checks temperature, texture, smell, and colour and turns a pit
          when the compost signals it is ready. After three months — ninety days — the raw mix has become something
          new: dark, crumbly, earth-smelling.
        </p>
      </TwoCol>
      </Fragment>,

      <Fragment key="c1">
      <DataGrid cols={3} standalone>
        <DataCard value="Cow Dung">
          <em>The living culture.</em> Fresh dung from the estate&apos;s Malnad Gidda herd. The breed
          matters — their gut microbiome is adapted to this altitude, these grasses, this soil, so the
          microbial signature it carries is native to the ground it feeds.
        </DataCard>
        <DataCard value="Eggshell">
          <em>The calcium source.</em> Crushed eggshell — calcium carbonate, a slow-release calcium that
          buffers the pH as the mix composts and adds structural calcium to the finished preparation.
        </DataCard>
        <DataCard value="Basalt Dust">
          <em>The paramagnetic element.</em> Finely ground basalt — silica, iron, magnesium, and trace
          minerals. In biodynamic practice its paramagnetic properties are valued for enlivening soil
          biology in the root zone.
        </DataCard>
      </DataGrid>

      <SpecTable
        title="How CPP is made"
        rows={[
          { label: '01 · Collect', value: 'Fresh dung, gathered in one pile' },
          { label: '02 · Mix', value: 'Stomped smooth, split into 2 kg portions' },
          { label: '03 · Inoculate', value: 'Microbial solution worked in, barrelled' },
          { label: '04 · Ferment', value: 'Stirred 1–2× daily · 3–7 days' },
          { label: '05 · Mature', value: 'Eggshell, rock dust & BD preps · pit 90 days' },
          { label: '06 · Ready', value: 'Dark, crumbly, earth-smelling' },
        ]}
      />

      <TwoCol id="ball" heading="The ball, placed at the root.">
        <p className="p1">
          Matured CPP does not just go out as a spray. Much of it is rolled by hand into balls of measured
          sizes, because the dose has to fit the plant. Each ball is dug in a little way from a
          coffee plant&apos;s roots and covered with mulch, so it holds its moisture and seeps its biology
          slowly down into the root zone — a slow compost feeding one plant at a time.
        </p>
        <p className="p1">
          And it is placed against a record. The estate carries an ID for individual plants as well as
          animals, so the ball dug in at a given plant is logged to that plant — which pit it came from,
          when it went in. A preparation that took months to make is delivered by the handful, to a known
          root, and written down.
        </p>
      </TwoCol>

      <ExpandingBanner
        src="/circular/images/aura-biodynamic.jpg"
        mediaType="image"
        alt="CPP dug in at the root of a coffee plant and covered with mulch"
        caption="A ball to a root, covered in mulch"
      />

      <TwoCol id="jeevamrit" heading="Jeevamrit: the living culture.">
        <p className="p1">
          The second product is{' '}
          <Term tip="A living microbial culture from Vedic farming — fermented from cow dung, cow urine, jaggery, gram flour, and a handful of native soil, applied as a soil drench to inoculate the root zone with locally-adapted microbes.">Jeevamrit</Term>:
          dung and urine from the herd, jaggery to feed the microbes, gram flour for protein, and a
          handful of native soil to seed it with the estate&apos;s own organisms. The name carries its
          purpose — <em>jeeva</em>, life; <em>amrit</em>, nectar. It feeds the soil, not the plant — a
          culture poured into the ground as a drench that floods the root zone with living microbes.
        </p>
        <p className="p1">
          It is the highest-volume preparation on the estate — around 154,000 litres a year — and its
          daily stir is the rhythm of the estate itself, not a task on a schedule. Each barrel is
          stirred about forty-five minutes a day, one direction then the other, building a vortex and
          breaking it so oxygen works deep into the liquid and the beneficial organisms outcompete the
          pathogens. How much to brew is planned backwards from the land: a{' '}
          <Term tip="A biodynamic planting-and-preparation calendar. Aura works back from it to schedule how much Jeevamrit and CPP the 150-acre estate needs each month.">BD calendar</Term>{' '}
          sets what 150 acres need each month, and stock registers track every batch against it.
        </p>
      </TwoCol>

      {/* Immersive beat — the highest-volume preparation, given scale.
          One expanding banner, used deliberately, to break the rhythm of
          the inline banner stacks around it. */}
      <ExpandingBanner
        src="/circular/images/aura-jeevamrut.jpg"
        alt="Barrels of Jeevamrit fermenting at Mudigere"
        caption="154,000 litres a year — each barrel stirred by hand, one way then the other, into a vortex and back"
      />

      <SpecTable
        title="BD 507 · Valerian"
        rows={[
          { label: 'Source', value: 'Valerian flowers (Valeriana officinalis)' },
          { label: 'Form', value: 'Pressed to juice, fermented — stays liquid' },
          { label: 'Applied', value: 'Diluted, vortex-stirred, sprinkled on the heap' },
          { label: 'Effect', value: 'Stimulates phosphorus; a protective warmth' },
        ]}
        note="The liquid one of the six compost preparations, BD 502–507."
      />

      <ExpandingBanner
        src="/circular/videos/aura-valerian.mp4"
        mediaType="video"
        poster="/circular/images/aura-valerian.jpg"
        alt="Valerian flowers pressed for BD 507"
        caption="BD 507 — valerian, pressed and fermented"
      />

      <PullQuote>
        Made from what the estate already produces — and measured before it feeds a single root.
      </PullQuote>

      <TwoCol id="testing" heading="The testing framework.">
        <p className="p1">
          This is where the loop earns the word <em>measured</em>. Every collection and every batch is
          numbered — pit numbers for the dung, batch numbers for the brews — and every preparation runs a
          fixed cycle, sixty to ninety days depending on what it is. Each batch is tested{' '}
          <strong>before and after</strong> preparation in the estate&apos;s own lab: pH, electrical
          conductivity, microbial colony counts, the beneficial organisms that matter most in this climate
          —{' '}
          <Term tip="A soil fungus that suppresses plant pathogens and promotes root growth. Counted in every batch.">Trichoderma</Term>{' '}
          and{' '}
          <Term tip="Soil bacteria that fix nitrogen and dissolve phosphate, supporting root development.">Pseudomonas</Term>{' '}
          — alongside the sensory reads the team trusts: smell, colour, and surface activity.
        </p>
        <p className="p1">
          If a batch comes back wrong, it does not go on the soil. It is corrected or held. When a
          reading drifts — a pH too low, a count too thin — Dr. Arun, the estate&apos;s scientist, sets
          the fix: hold it longer, add this much water, feed in this much Jeevamrit. The failed batch
          becomes a lesson that sharpens the next one. Ancestral practice, run like a laboratory: the hand
          reads it first, the lab confirms it, and nothing substandard ever reaches a root.
        </p>
      </TwoCol>

      <SpecTable
        title="Every batch, tested"
        rows={[
          { label: 'Numbering', value: 'Pit numbers (dung) · batch numbers (brews)' },
          { label: 'Cycle', value: '60–90 days by preparation' },
          { label: 'Chemistry', value: 'pH · electrical conductivity' },
          { label: 'Biology', value: 'Microbial colony counts' },
          { label: 'Key organisms', value: 'Trichoderma · Pseudomonas' },
          { label: 'Tested', value: 'Before & after preparation' },
          { label: 'Soil follow-up', value: 'Block retested 90 days after application' },
        ]}
      />
      </Fragment>,

      <Fragment key="c2">
      <TwoCol id="soil" heading="The soil is tested too.">
        <p className="p1">
          Testing does not stop at the barrel. The estate reads the soil itself — its nutrients and its
          microbial activity — and feeds those results back into the same record. Ninety days after a
          preparation is applied, the block it went onto is retested and cross-referenced against the
          batch that fed it: did the microbes take, did the organic carbon rise, did the ground move
          toward its target.
        </p>
        <p className="p1">
          So two circles turn together. The fertility cycle — dung to pit to brew to soil — and the
          testing cycle — pre-batch to post-batch to soil to next batch — feed each other, season after
          season. Over time that is what turns a fertility programme into a way of learning the land, and
          a set of records into proof of what the ground is actually doing.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Dung leaves the herd at dawn.
         The pit and the barrel remake it.
         Numbered, tested, it enters the soil.
         Ninety days on, the soil is read again.
         What we learn sharpens the next batch.`}
      </ScrollHighlight>

      <TwoCol id="scale" heading="The loop at the scale of an estate.">
        <p className="p1">
          This is the estate&apos;s fertility programme at full scale, run on what the herd produces:
          around 154,000 litres of Jeevamrit and 2,420
          kilograms of CPP a year, alongside biodynamic compost, buttermilk sprays, and the horn
          preparations — all of it sourced from fifty-two cattle grazing the same 150 acres as the coffee.
        </p>
        <p className="p1">
          The work is narrow and constant: collect at dawn, brew and compost by hand, number and test
          every batch, place it to a known root, and read the soil it leaves behind. Ancestral practice —
          the pit, the brew, the daily stir — run with modern measurement. That pairing is what Aura calls
          Natural Intelligence, and here it is aimed at one thing: turning an animal&apos;s output into
          ground that gets richer every year.
        </p>
      </TwoCol>

      <ExpandingBanner
        src="/circular/images/aura-saturn.jpg"
        mediaType="image"
        alt="The biodynamic cosmology — planetary timing behind the preparations"
        caption="Kept for the biology, not the cosmology"
      />

      <DataGrid cols={3} standalone>
        <DataCard value="154,000 L">
          Jeevamrit brewed a year from the herd&apos;s dung and urine — stirred daily, planned backwards
          from a BD calendar for 150 acres.
        </DataCard>
        <DataCard value="2,420 kg">
          CPP a year across fourteen numbered pits, turned by hand and dug in ball by ball at the root.
        </DataCard>
        <DataCard value="Pre &amp; post">
          Every batch tested in the estate&apos;s own lab before and after preparation — a failing batch
          is corrected or held, never sprayed.
        </DataCard>
      </DataGrid>

      <OneCol heading="Fertility is a generational asset.">
        <p className="p1">
          A bag of fertiliser feeds one season. What Aura builds by closing this loop feeds the next
          generation of the estate: living soil, deepening year on year, on a horizon measured in decades.
          We treat the herd&apos;s output with the respect owed the estate&apos;s most valuable material,
          rebuild it into fertility by hand, test it before and after, and measure whether the ground is
          gaining. The oldest knowledge we have, run with the newest tools we trust — Natural Intelligence,
          returned to the soil. That is what generational impact looks like: one pit, one batch, at a time.
        </p>
      </OneCol>

      <Continue
        items={[
          { href: '/herd', label: 'Ecosystem Engineers', description: 'Where the raw material comes from — fifty-two Malnad Gidda, the estate’s biological engine, each passported.', img: '/herd/images/aura-relationship2.jpg' },
          { href: '/ecology', label: 'The Health Index', description: 'What the fertility feeds — the whole farm measured, and rolled into one Ecological Health Index per block.', img: '/aura-mudigere-landscape.jpg' },
          { href: '/shade', label: 'The Light Instrument', description: 'The canopy above the loop — shade whiskering, measured in lux and cut to prescription.', img: '/aura-land.jpg' },
        ]}
      />
      </Fragment>,

        ]}
      />
    </>
  )
}
