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
} from '@/components/article/Article'

export default function SanctuaryPage() {
  return (
    <>
      <ArticleHero
        title={<>Guests of the mountain.</>}
        subline="Aura Sanctuary is the land in rhythm. Two valleys in practice today, two more in planning. Each one a life-system built to outlast its builders."
        toc={[
          { q: 'What is the premise?', href: '#premise' },
          { q: 'What makes a sanctuary?', href: '#guest' },
          { q: 'How are India and Japan paired?', href: '#duality' },
          { q: 'What is the operating system?', href: '#os' },
          { q: 'How is a sanctuary entered?', href: '#rhythm' },
          { q: 'What sanctuaries are coming?', href: '#coming' },
        ]}
      />

      <Placeholder
        label="Sanctuary — hero landscape"
        note="Wide establishing plate: mist burning off the Western Ghats at dawn, cutting to cedar forest above Ohara. Long, slow, held shots. No people in frame."
      />

      {/* eyebrow was: "The Premise" */}
      <Section id="premise" heading="Four valleys. One rhythm.">
        <P>
          Aura is not a brand laid over a landscape. It is a way of tending land that begins by
          asking what the land already knows. We start from the earth and work up — soil, water,
          canopy, cattle, craft, kitchen, code. The buildings come last. The philosophy was
          there first.
        </P>
        <P>
          Our first two sanctuaries are already at work. Mudigere, in the Western Ghats of
          Karnataka, is 150 acres of biodynamic plantation, forest, and herd. Ohara, a valley
          north of Kyoto, is a 70-year-old home, a 30-year-old garden, and a restored teahouse.
          One is scale; the other is refinement. Together they are one organism with two
          climates.
        </P>
        <P>
          Two more valleys are forming — Munduk in the Bali highlands, Daylesford in the cooler
          south of Australia. Neither has a date. Both are listening exercises. We will know
          when the land tells us it is ready.
        </P>
      </Section>
      <Section id="guest" heading="Guests of the Mountain">
        <P>
          A sanctuary is not a property. It is a posture. It is what happens when a piece of
          land is tended long enough that it begins to tend the people who stand on it. The
          Western Ghats are among the oldest mountains on earth. The cedar above Ohara has seen
          a thousand winters. To arrive in either valley is to agree to a pace older than the
          arrival.
        </P>
        <P>
          In Thailand, a Buddhist nun is rescuing three hundred acres of condemned trees in
          Kengkacha UNESCO land, one transplant at a time. She does not call it a project. She
          calls it a debt. Aura is run on the same accounting. The land gave first. We are
          answering.
        </P>
        <P>
          The pattern is portable. Any community, anywhere, could grow it in their own soil —
          the four-pillared rhythm of land, hospitality, craft, and code, tuned to a particular
          climate and a particular lineage. Aura is one expression of that pattern. Not the only
          one. Not the last.
        </P>
      </Section>

      <PullQuote>
        Humans are not owners here — only guests of the mountain.
      </PullQuote>

      {/* eyebrow was: "India · Japan" */}
      <Section id="duality" heading="The Duality">
        <P>
          India gives us scale, monsoon, and cosmological time. Japan gives us restraint, craft, and
          millimetric care. Aura needs both. The Mudigere forest teaches generosity; the Ohara garden
          teaches attention. One cannot substitute for the other, and neither is complete alone.
        </P>
        <SideBySide
          leftTitle="Mudigere — Karnataka"
          rightTitle="Ohara — Kyoto"
          leftChildren={
            <>
              150 acres of biodynamic plantation at 3,600 feet in the Western Ghats. Coffee, pepper,
              areca, and a herd of Malnad Gidda cattle. Red laterite soil, 40–100 inches of rainfall a
              year, a UNESCO biosphere at the door. The body of patience.
            </>
          }
          rightChildren={
            <>
              A valley of cedar, river, and temple an hour north of Kyoto. A restored 70-year-old
              home, a 30-year-old garden, a teahouse carried forward by a craftsman and his grandson.
              Wabi-sabi as foundation. The calm of reflection.
            </>
          }
        />

        <DataGrid cols={2}>
          <DataCard label="Mudigere · Coordinates" value="13.1365° N">
            Western Ghats, Karnataka · 3,600 ft · 150 acres · UNESCO biosphere.
          </DataCard>
          <DataCard label="Ohara · Coordinates" value="35.2375° N">
            North of Kyoto · 1,099 ft · 70-year home, 30-year garden, restored teahouse.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Arvind">
        India gave me the ground. Japan gave me the stillness. Together they became something
        neither could be alone.
      </PullQuote>

      <PullStat value="4" label="Valleys" sub="Two in practice. Two in listening." />

      {/* eyebrow was: "The Operating System" */}
      <TwoCol id="os" heading="Sanctuary · Agroculture · Artistry">
        <P>
          Every Aura valley is built on three structural pillars. <strong>Sanctuary</strong> is the
          land held in rhythm — the stillness, the method, the slow choreography of seasons.{' '}
          <strong>Agroculture</strong> is what the land produces when treated as an organism rather
          than a yield: specialty coffee, pepper, native cattle, fermented food, medicine.{' '}
          <strong>Artistry</strong> is what the people on the land make of it — studios, residencies,
          kitchens, labs, gatherings.
        </P>
        <P>
          The three pillars are not separable. The coffee is not coffee without the cattle; the cabin
          is not a cabin without the canopy; the studio is not a studio without the soil. This is why
          we call it an ecosystem and not a collection.
        </P>
      </TwoCol>

      {/* eyebrow was: "Entry" */}
      <Section id="rhythm" heading="Not a destination. A rhythm you enter.">
        <P>
          A sanctuary is entered slowly. The first hour is for the body to catch up with the
          valley. The first day is for the kitchen to read the guest, not the other way round.
          The first week is for the silence to become interesting rather than loud.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Morning" value="Work · Harvest · Learn">
            The day begins when the mist lifts and the soil softens. Apprenticeship in motion.
          </DataCard>
          <DataCard label="Evening" value="Gather · Savour · Listen">
            The day closes around a fire or a table. Not with fatigue — with fullness.
          </DataCard>
          <DataCard label="Any time" value="Pause · Observe · Belong">
            The core discipline. The only appointment in a week of silence is tea at four.
          </DataCard>
        </DataGrid>
        <P>
          The visit is not measured in nights. It is measured in what you carry with you when
          you leave — a slower pulse, a clearer palate, a week of stillness that keeps paying
          out for a year.
        </P>
      </Section>

      {/* eyebrow was: "Coming Sanctuaries" */}
      <Section id="coming" heading="Munduk · Daylesford">
        <P>
          A sanctuary cannot be willed into existence. It has to be earned, twice — once from the
          people of the valley, and once from the valley itself. We are in the patient early
          conversations of both.
        </P>
        <P>
          <strong>Munduk</strong> sits in the volcanic highlands of north Bali — coffee country,
          cloud forest, waterfalls. It is where Aura&apos;s Indian soil philosophy meets Southeast
          Asia&apos;s living laboratory of fermentation and ceremony. The land is being read.
        </P>
        <P>
          <strong>Daylesford</strong>, in Victoria, Australia, is Aura&apos;s southern counterweight.
          Cooler climate, mineral springs, a landscape that holds long memory of both Indigenous
          stewardship and European arrival. A valley to be met slowly, on its own time.
        </P>
      </Section>

      <Placeholder
        label="Munduk — aspirational"
        note="Volcanic highlands of north Bali. Terraced coffee gardens at ~1,200 m, cloud forest, waterfalls. Frame: a single wooden gate at the edge of a terrace, no signage."
        aspect="4 / 3"
      />

      <Placeholder
        label="Daylesford — aspirational"
        note="Cooler southern-hemisphere landscape — old volcanic lakes, eucalypt, wide pasture in Victoria, Australia. Low sun, pale light."
        aspect="4 / 3"
      />

      <PullQuote>
        We start from the earth and work up.
      </PullQuote>

      <Continue
        items={[
          { href: '/residency', label: 'Residency', description: 'Monastic polymaths. Crazy misfits. Two weeks on the land.' },
          { href: '/artistry', label: 'Artistry', description: 'The third pillar — studios, residencies, kitchens, code.' },
          { href: '/idea', label: 'The 1000 Year Idea', description: 'The philosophy that anchors every valley.' },
        ]}
      />
    </>
  )
}
