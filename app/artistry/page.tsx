'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
} from '@/components/article/Article'

export default function ArtistryPage() {
  return (
    <>
      {/* Modern hero pattern — was ArticleHero (subline + 6-question
          TOC + figure). The TOC pattern is retired across coming-soon
          journals; the body sections (TwoCol/OneCol/DataGrid below)
          carry their own headings as anchors. */}
      <HeroBanner
        title="Code meets clay."
        src="/aura-artistry.mp4"
        mediaType="video"
        poster="/aura-artistry.jpg"
        caption="Studios, residencies, labs, gatherings — the work of the land"
        alt="Aura artistry — studios, residency, labs, and the Bhoomi gathering"
      />

      <Placeholder
        caption="Wide frame of a cedar workbench running through natural light — ceramics on one end, circuitry on the other, a cup of coffee between them. No people visible above the shoulders."
      />

      {/* eyebrow was: "The Premise" */}
      <TwoCol id="premise" heading="The soil is the studio.">
        <p className="p1">
          Artistry at Aura is not an add-on. It is how the land talks back. Every art form — from
          ceramics to storytelling, from coffee to code — emerges from the same soil that grows the
          pepper and shelters the herd. What the plantation produces in food, the studio produces
          in object, image, software, and sound.
        </p>
        <p className="p2">
          Two grammars meet on the workbench. The old craft grammar — apprenticeship, repetition,
          patience of the hand. The new technical grammar — sensors, world models, native systems.
          They are not rivals. One teaches the other. A potter&apos;s eye trains an algorithm the
          way a farmer&apos;s ear trains a forecast.
        </p>
      </TwoCol>

      <Placeholder
        caption="Macro, tight, low-light. A spinning clay form on one half of the frame; a breadboard with blinking LEDs on the other. Same bench, same maker."
      />

      <PullQuote>
        Coffee roots and design systems. Code meets clay.
      </PullQuote>
      <TwoCol id="audience" heading="The Audience">
        <p className="p1">
          Aura is not built for everyone. It is built for the monastic polymath — the person who
          works across disciplines but within a single practice, who is attached to the work and
          detached from the noise. The archetype is old. The audience is small. Both are fine.
        </p>
        <DataGrid cols={2}>
          <DataCard value="Monastic">
            Long hours. Early mornings. Few meetings. No theatre. Attention as the first currency,
            language economy as the second. The Sikh notion of being attached to the work and
            detached from the reward — the craft ethic of every tradition that outlasted its
            founder.
          </DataCard>
          <DataCard value="Polymath">
            Code on Monday, clay on Tuesday, coffee on Wednesday, cattle on Thursday. Different
            grammars, one sentence. Depth before breadth, and then breadth that feeds the depth
            back. The potter-engineer-farmer-writer is not a collage; she is a coherent
            discipline.
          </DataCard>
        </DataGrid>
        <p className="p2">
          Who the work is not for: the audience of scale. Not for P&amp;G. Not for Coke. Not for
          enterprise marketing teams. Aura is made for people remaking their own practice in
          public — and for the crazy misfits who are ready to try something honest.
        </p>
      </TwoCol>
      <TwoCol id="studios" heading="Studios">
        <p className="p1">
          Every valley has a studio. Every studio has the same rule: the tools in it must be
          serviceable by the hands that live here. No dependency on a supply chain the land cannot
          feed. No complexity the local apprentice cannot inherit.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Ceramics · Mudigere">
            Wheel, kiln, glazes mixed from local oxides. Vessels for the farm-to-table kitchen.
            Tiles for the cabins. The earth of the valley made durable.
          </DataCard>
          <DataCard value="Textile · Mudigere">
            Hand-loom, natural dye, indigo vat. The cotton planted between the coffee rows, woven
            into the linen of the residency.
          </DataCard>
          <DataCard value="Joinery · Ohara">
            Cedar, hinoki, cypress. Joinery in the old Japanese manner, learned from the
            third-generation carpenter carrying on his father&apos;s garden house.
          </DataCard>
          <DataCard value="Field recording · Both">
            The valley is recorded continuously — monsoon, cicadas, river, bell. Composers and
            coders draw from the library. A living archive of place.
          </DataCard>
          <DataCard value="Typography · Both">
            A bilingual typography practice — Kannada and Latin in Mudigere, Japanese and Latin in
            Ohara. Letterforms that honour the ground they set on.
          </DataCard>
          <DataCard value="Native systems · Both">
            Code written for this soil and no one else&apos;s. The farm management system, the
            provenance ledger, the world models. Built on the bench, for the bench.
          </DataCard>
        </DataGrid>
      </TwoCol>
      <TwoCol id="residency" heading="Residency">
        <p className="p1">
          The Aura Residency is the artery of the artistry pillar. Makers — artists, scientists,
          engineers, farmers, chefs — arrive for one to three weeks, live on the land, and work
          from the soil outward. No keynote. No deck. No deliverable beyond the truth of what they
          made.
        </p>
        <p className="p2">
          Mudigere offers the <strong>Twelve Worlds</strong> — twelve cabins named for the layers
          of a forest: Hive, Root, Flow, Flame, Bloom, Canopy, Echo, Seed, Mist, Stone, Pulse,
          Ethereal. Ohara offers <strong>Ki no Ie</strong>, the House of Seasons, with shorter
          two-week formats and a forest table hosted by the founder in the opening days.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Curiosity">
            Raw, awake, still capable of being changed by a new idea.
          </DataCard>
          <DataCard value="Maturity">
            Accountable. Self-directed. Able to finish what they begin.
          </DataCard>
          <DataCard value="Raw output">
            The power to make — a lot, messy if it must be, but made.
          </DataCard>
          <DataCard value="Judgment">
            Able to tell the good work from the merely clever.
          </DataCard>
          <DataCard value="Humility">
            The right posture toward the land, the craft, and the company.
          </DataCard>
          <DataCard value="Moral spine">
            The non-negotiable. Without it, the other five do not matter.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Arvind">
        Twenty-year-old odd kids can change the destiny.
      </PullQuote>
      <TwoCol id="labs" heading="Labs">
        <p className="p1">
          Labs &amp; Hardware is the quiet instrumentation layer of Aura — the sensors that make
          soil legible, the ferment monitors that read the tank, the world model that listens to
          forty years of a farmer&apos;s eye. Invisible tech. Present where it is useful, absent
          where it is not.
        </p>
        <DataGrid cols={3}>
          <DataCard value="World model">
            Custom LLM grown from sensor data and workflow memory. Not fine-tuned. Grown.
          </DataCard>
          <DataCard value="SaaS">
            The software layer for running the world model across five industries — agriculture,
            insurance, food science, hospitality, financial services.
          </DataCard>
          <DataCard value="Playground">
            The experimental layer. The first twenty-four months. No sales. Only attraction.
          </DataCard>
        </DataGrid>
        <p className="p2">
          Three layers underneath: blockchain provenance, live sensors, and a persistent machine
          memory grown from the farm&apos;s own readings. Together they replace the
          forty-thousand-dollar certification stack with something the land itself can verify,
          cherry to cup, root to roast.
        </p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        One has read, the other knows.
      </PullQuote>
      <TwoCol id="gathering" heading="The Gathering">
        <p className="p1">
          Every year the residency culminates in <strong>The Gathering</strong> — the Bhoomi
          Festival at Mudigere, a three-day convening of soil, sound, and light. The work made on
          the land shows itself back to the land. Farmers, chefs, artists, scientists, and quiet
          visitors share the same table under the same canopy.
        </p>
        <p className="p2">
          The festival is not a marketing moment. It is a harvest. The year&apos;s work in coffee,
          ceramic, type, software, and kitchen is laid out together. Anyone can come. Not everyone
          will understand. The ones who do will keep coming.
        </p>
      </TwoCol>

      <Placeholder
        caption="Long low table under coffee and areca canopy, candles in jars, thali plates, guests seated at dusk. Reverent and warm."
      />

      <PullQuote attribution="ಜೀವಂತ ಶಾಂತಿ">
        Living Peace
      </PullQuote>

      <Continue
        items={[
          { href: '/residency', label: 'Residency', description: 'Monastic polymaths. Crazy misfits. Two to three weeks on the land.' },
          { href: '/sanctuary', label: 'Sanctuary', description: 'The four valleys the residency moves between.' },
          { href: '/provenance', label: 'Provenance', description: 'Cherry to cup. On chain. The lab\'s notebook, public.' },
        ]}
      />
    </>
  )
}
