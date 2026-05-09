'use client'

import {
  ArticleHero,
  Section,
  TwoCol,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  PullStat,
  SideBySide,
  Continue,
  Chapter,
  Couplet,
} from '@/components/article/Article'

export default function ArtistryPage() {
  return (
    <>
      <ArticleHero
        title={<>Code meets clay.</>}
        subline="Artistry is what the people on the land make of it. Studios, residencies, kitchens, labs, gatherings — the work that argues for a different pace through the things it makes."
        toc={[
          { q: 'What is artistry here?', href: '#premise' },
          { q: 'Who is the audience?', href: '#audience' },
          { q: 'What are the studios?', href: '#studios' },
          { q: 'What is the residency?', href: '#residency' },
          { q: 'What are the labs?', href: '#labs' },
          { q: 'What is the gathering?', href: '#gathering' },
        ]}
      />

      <Placeholder
        label="Hero plate · a long workbench, hands at work"
        note="Wide frame of a cedar workbench running through natural light — ceramics on one end, circuitry on the other, a cup of coffee between them. No people visible above the shoulders."
      />

      {/* eyebrow was: "The Premise" */}
      <Section id="premise" heading="The soil is the studio.">
        <P>
          Artistry at Aura is not an add-on. It is how the land talks back. Every art form — from
          ceramics to storytelling, from coffee to code — emerges from the same soil that grows the
          pepper and shelters the herd. What the plantation produces in food, the studio produces
          in object, image, software, and sound.
        </P>
        <P>
          Two grammars meet on the workbench. The old craft grammar — apprenticeship, repetition,
          patience of the hand. The new technical grammar — sensors, world models, native systems.
          They are not rivals. One teaches the other. A potter&apos;s eye trains an algorithm the
          way a farmer&apos;s ear trains a forecast.
        </P>
      </Section>

      <Placeholder
        label="Image · ceramic wheel beside a circuit board"
        note="Macro, tight, low-light. A spinning clay form on one half of the frame; a breadboard with blinking LEDs on the other. Same bench, same maker."
      />

      <PullQuote>
        Coffee roots and design systems. Code meets clay.
      </PullQuote>

      {/* number was: "01" */}
      <Chapter number="" title="The Audience" id="audience" />

      <Section>
        <P>
          Aura is not built for everyone. It is built for the monastic polymath — the person who
          works across disciplines but within a single practice, who is attached to the work and
          detached from the noise. The archetype is old. The audience is small. Both are fine.
        </P>
        <SideBySide
          leftTitle="Monastic"
          rightTitle="Polymath"
          leftChildren={
            <>
              Long hours. Early mornings. Few meetings. No theatre. Attention as the first currency,
              language economy as the second. The Sikh notion of being attached to the work and
              detached from the reward — the craft ethic of every tradition that outlasted its
              founder.
            </>
          }
          rightChildren={
            <>
              Code on Monday, clay on Tuesday, coffee on Wednesday, cattle on Thursday. Different
              grammars, one sentence. Depth before breadth, and then breadth that feeds the depth
              back. The potter-engineer-farmer-writer is not a collage; she is a coherent
              discipline.
            </>
          }
        />
        <P>
          Who the work is not for: the audience of scale. Not for P&amp;G. Not for Coke. Not for
          enterprise marketing teams. Aura is made for people who are reimagining their own
          practice for the new age — and for the crazy misfits who are ready to try something
          honest.
        </P>
      </Section>

      {/* number was: "02" */}
      <Chapter number="" title="Studios" id="studios" />

      <Section>
        <P>
          Every valley has a studio. Every studio has the same rule: the tools in it must be
          serviceable by the hands that live here. No dependency on a supply chain the land cannot
          feed. No complexity the local apprentice cannot inherit.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 — Clay" value="Ceramics · Mudigere">
            Wheel, kiln, glazes mixed from local oxides. Vessels for the farm-to-table kitchen.
            Tiles for the cabins. The earth of the valley made durable.
          </DataCard>
          <DataCard label="02 — Fibre" value="Textile · Mudigere">
            Hand-loom, natural dye, indigo vat. The cotton planted between the coffee rows, woven
            into the linen of the residency.
          </DataCard>
          <DataCard label="03 — Wood" value="Joinery · Ohara">
            Cedar, hinoki, cypress. Joinery in the old Japanese manner, learned from the
            third-generation carpenter carrying on his father&apos;s garden house.
          </DataCard>
          <DataCard label="04 — Sound" value="Field recording · Both">
            The valley is recorded continuously — monsoon, cicadas, river, bell. Composers and
            coders draw from the library. A living archive of place.
          </DataCard>
          <DataCard label="05 — Type" value="Typography · Both">
            A bilingual typography practice — Kannada and Latin in Mudigere, Japanese and Latin in
            Ohara. Letterforms that honour the ground they set on.
          </DataCard>
          <DataCard label="06 — Software" value="Native systems · Both">
            Code written for this soil and no one else&apos;s. The farm management system, the
            provenance ledger, the world models. Built on the bench, for the bench.
          </DataCard>
        </DataGrid>
      </Section>

      {/* number was: "03" */}
      <Chapter number="" title="Residency" id="residency" />

      <Section>
        <P>
          The Aura Residency is the artery of the artistry pillar. Makers — artists, scientists,
          engineers, farmers, chefs — arrive for one to three weeks, live on the land, and work
          from the soil outward. No keynote. No deck. No deliverable beyond the truth of what they
          made.
        </P>
        <P>
          Mudigere offers the <strong>Twelve Worlds</strong> — twelve cabins named for the layers
          of a forest: Hive, Root, Flow, Flame, Bloom, Canopy, Echo, Seed, Mist, Stone, Pulse,
          Ethereal. Ohara offers <strong>Ki no Ie</strong>, the House of Seasons, with shorter
          two-week formats and a forest table hosted by the founder in the opening days.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Hot" value="Curiosity">
            Raw, awake, still capable of being changed by a new idea.
          </DataCard>
          <DataCard label="Adult" value="Maturity">
            Accountable. Self-directed. Able to finish what they begin.
          </DataCard>
          <DataCard label="Slob cannon" value="Raw output">
            The power to make — a lot, messy if it must be, but made.
          </DataCard>
          <DataCard label="Tastemaker" value="Judgment">
            Able to tell the good work from the merely clever.
          </DataCard>
          <DataCard label="Full of gratitude" value="Humility">
            The right posture toward the land, the craft, and the company.
          </DataCard>
          <DataCard label="Moral spine" value="Foundation">
            The non-negotiable. Without it, the other five do not matter.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Arvind">
        Twenty-year-old odd kids can change the destiny.
      </PullQuote>

      {/* number was: "04" */}
      <Chapter number="" title="Labs" id="labs" />

      <Section>
        <P>
          Labs &amp; Hardware is the quiet instrumentation layer of Aura — the sensors that make
          soil legible, the ferment monitors that read the tank, the world model that listens to
          forty years of a farmer&apos;s eye. Invisible tech. Present where it is useful, absent
          where it is not.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Compute" value="World model">
            Custom LLM grown from sensor data and workflow memory. Not fine-tuned. Grown.
          </DataCard>
          <DataCard label="Workbench" value="SaaS">
            The software layer for running the world model across five industries — agriculture,
            insurance, food science, hospitality, financial services.
          </DataCard>
          <DataCard label="Canvas" value="Playground">
            The experimental layer. The first twenty-four months. No sales. Only attraction.
          </DataCard>
        </DataGrid>
        <P>
          Three layers underneath: blockchain provenance, live sensors, and a persistent AI memory.
          Together they replace the forty-thousand-dollar certification stack with something the
          land itself can verify, cherry to cup, root to roast.
        </P>
      </Section>

      <PullQuote attribution="Arvind">
        One has read, the other knows.
      </PullQuote>

      {/* number was: "05" */}
      <Chapter number="" title="The Gathering" id="gathering" />

      <Section>
        <P>
          Every year the residency culminates in <strong>The Gathering</strong> — the Bhoomi
          Festival at Mudigere, a three-day convening of soil, sound, and light. The work made on
          the land shows itself back to the land. Farmers, chefs, artists, scientists, and quiet
          visitors share the same table under the same canopy.
        </P>
        <P>
          The festival is not a marketing moment. It is a harvest. The year&apos;s work in coffee,
          ceramic, type, software, and kitchen is laid out together. Anyone can come. Not everyone
          will understand. The ones who do will keep coming.
        </P>
      </Section>

      <Placeholder
        label="Image · forest dining beneath Aaranya canopy"
        note="Long low table under coffee and areca canopy, candles in jars, thali plates, guests seated at dusk. Reverent and warm."
      />

      <PullStat value="12" label="Worlds at Mudigere" sub="Twelve cabins. Twelve layers of the forest." />

      <Couplet en="Living Peace" local="ಜೀವಂತ ಶಾಂತಿ" localLang="kn" />

      <Continue
        items={[
          { href: '/residency', label: 'Artist Residency', description: 'The Twelve Worlds and Ki no Ie.' },
          { href: '/spaces', label: 'Spaces & Studios', description: 'The workbenches of the valley.' },
          { href: '/labs', label: 'Labs & Hardware', description: 'Compute · Workbench · Canvas.' },
        ]}
      />
    </>
  )
}
