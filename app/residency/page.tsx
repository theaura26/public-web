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

export default function ResidencyPage() {
  return (
    <>
      <ArticleHero
        title="Monastic polymaths. Crazy misfits."
        subline="An embedded residency across two countries (soon three). Two weeks minimum. Pre-selected. Not a programme and not a retreat — a place to do the work you cannot do anywhere else."
        toc={[
          { q: 'What are the five formats?', href: '#formats' },
          { q: 'How are the two expressions different?', href: '#expressions' },
          { q: 'Who do we invite?', href: '#who' },
          { q: 'What is the format?', href: '#format' },
          { q: 'How do I apply?', href: '#apply' },
        ]}
      />

      <Placeholder
        label="Hero — residency cabin interior at first light"
        note="A working desk, a window onto the forest, a half-finished piece on the floor. No one in frame."
      />

      {/* PHILOSOPHY */}
      {/* eyebrow was: "Philosophy" */}
      <TwoCol heading="Connective tissue between disciplines.">
        <P>
          Most residencies put a painter next to a painter and call it community. Aura does the
          opposite. A coffee fermenter next to a ceramicist. A soil biologist next to a washi
          papermaker. A designer next to a shepherd. The friction between disciplines is the
          point. That is where the work that nobody else can make gets made.
        </P>
        <P>
          We call them <em>embedded residencies</em> because you do not arrive at a campus; you
          arrive inside a living system. You eat from the garden you walked past at dawn. You work
          with material that was sourced, fermented, or fired on the property. The residency is
          not the building. The residency is the biosphere.
        </P>
        <P>
          Santosh joined after reading a single one-pager about the &ldquo;monastic polymath&rdquo;
          archetype. That is the shape of the right applicant. They read one sentence and they
          know.
        </P>
      </TwoCol>

      {/* FORMATS */}
      {/* eyebrow was: "001" */}
      <Section id="formats" heading="Five Formats">
        <P>
          The residency is not one thing. It is five overlapping formats, sharing a kitchen, a
          kiln, a library, and a shepherd. You can arrive for one and leave touched by all five.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Design Residencies" value="2–4 weeks">
            For designers, architects, and system thinkers. Working briefs drawn from the farm,
            the sanctuary, the product OS. One-to-one time with Arvind in the first four days.
          </DataCard>
          <DataCard label="Craft Workshops" value="5–10 days">
            Intensives with master practitioners &mdash; Shigaraki ceramics, Washi Kobo paper,
            Uji tea, Malnad weaving, natural dye. Small cohorts, seasonal.
          </DataCard>
          <DataCard label="Gallery" value="Rolling">
            An exhibition arm for work made on the estate or adjacent to it. Not a retail channel.
            A frame for the work to be seen.
          </DataCard>
          <DataCard label="Gurukul" value="1 teacher · 1 student">
            The oldest format on earth. Long apprenticeships in a single discipline &mdash;
            biodynamic, fermentation, pottery, coffee. Months, not weeks.
          </DataCard>
          <DataCard label="Labs" value="Project-scoped">
            Embedded work on product, sensor, world-model, or workflow problems. For the
            engineers, the researchers, the forward-deployed.
          </DataCard>
          <DataCard label="Festivals" value="Annual">
            The Gathering / Bhoomi Festival &mdash; the one week a year the residency becomes
            public. Music, fire, food, field walks.
          </DataCard>
        </DataGrid>
      </Section>

      {/* TWO EXPRESSIONS */}
      {/* eyebrow was: "002" */}
      <Section id="expressions" heading="Two expressions, one residency.">
        <P>
          The same residency is expressed two ways in two countries. A resident might spend the
          first week in Mudigere and the second in Ohara, or commit the whole stay to one. Each
          location is raw in its own way.
        </P>

        <SideBySide
          leftTitle="India · Mudigere"
          rightTitle="Japan · Ohara"
          leftChildren={
            <>
              Raw. Monsoon. Soil. Twelve cabins in the canopy &mdash; The Twelve Worlds &mdash;
              each named for an element of the estate: Hive, Root, Flow, Flame, Bloom, Canopy,
              Echo, Seed, Mist, Stone, Pulse, Ethereal. Days begin with the herd moving through
              the morning mist. Work is loud, hot, and generous. Kannada is the common tongue.
            </>
          }
          rightChildren={
            <>
              Refined. Tea. Washi. A 90%-restored Japanese house 20 minutes from Kyoto, a natural
              onsen by the river, a third-generation gen garden on the property, an 800-year
              fermentation lineage in the valley. Days are quieter, slower, more deliberate.
              Purple shiso grows nowhere else in Japan. Japanese is the common tongue.
            </>
          }
        />

      </Section>

      <Placeholder
        label="Craft in progress — hands only"
        note="A maker mid-task. India or Japan ambiguous. Close crop on hands and material."
      />

      {/* WHO WE INVITE */}
      {/* eyebrow was: "003" */}
      <Section id="who" heading="Who we invite">
        <P>
          We pre-select. The selection is not a gate, it is a promise &mdash; to you, to the other
          residents that week, to the land. Five criteria, drawn from how we actually choose.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Curiosity" value="Raw">
            An appetite that has not been professionalised out of you. You still follow things
            because they are interesting, not because they are strategic.
          </DataCard>
          <DataCard label="Maturity" value="Grown">
            You can be in a room with people you disagree with and do better work because of it.
            You hold your own time and your own hygiene.
          </DataCard>
          <DataCard label="Output" value="Prolific">
            You make a lot. Finished or unfinished. The volume is evidence of the practice. We
            would rather see twenty rough pieces than one polished portfolio.
          </DataCard>
          <DataCard label="Judgment" value="Earned">
            A point of view on taste. You can tell us why something works, not just that it does.
          </DataCard>
          <DataCard label="Humility" value="Full of gratitude">
            You know the land, the shepherd, the cook, and the other residents got you here.
            &ldquo;Full of gratitude&rdquo; is not a tone. It is a diagnosis.
          </DataCard>
          <DataCard label="Spine" value="Moral">
            A good moral spine. We would rather host a twenty-year-old odd kid with conviction
            than a forty-year-old name with none.
          </DataCard>
        </DataGrid>

      </Section>

      <PullQuote attribution="Arvind">
        Rebel with a cause. Grounded in ancestral knowledge. Packaged with edge.
      </PullQuote>

      {/* FORMAT */}
      {/* eyebrow was: "004" */}
      <Section id="format" heading="Format">
        <P>
          Two weeks minimum. We have learned that anything shorter is tourism. Arvind is present
          on the property for the first three to four days of every residency &mdash; in the
          kitchen, at the field, at the desk. After that, residents work alone, or with the
          teachers in residence, or with each other.
        </P>
        <P>
          The rhythm is not a schedule. It is a day. You wake when the farm wakes. You eat what
          the farm ate yesterday. You work until the light goes. You read, walk, or sit. You
          repeat.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Minimum Stay" value="2 weeks">Anything shorter is tourism.</DataCard>
          <DataCard label="Cohort Size" value="4 – 8">Per location, per window. Small enough to share a table.</DataCard>
          <DataCard label="Founder Time" value="First 3 – 4 days">Arvind on-property.</DataCard>
        </DataGrid>
      </Section>

      <PullStat value="2" label="week minimum" sub="anything shorter is tourism" />
      <PullStat value="2" label="locations (soon 3)" sub="India · Japan · Indonesia" />
      <PullStat value="12" label="worlds" sub="Mudigere residency cabins" />

      {/* GATHERING */}
      {/* eyebrow was: "005" */}
      <Section heading="The Gathering · Bhoomi Festival">
        <P>
          Once a year, the residency opens. Former residents, visiting teachers, neighbours, the
          shepherd&apos;s family, the coffee cuppers, the ceramicists &mdash; all on the estate
          for one long week. Field walks in the morning. Workshops through the day. Music, fire,
          and long tables at night. The Gathering is the residency&apos;s annual culmination and
          the single best way to meet the people behind it.
        </P>

      </Section>

      <Placeholder
        label="Gathering bonfire — wide, dusk"
        note="Long tables, lantern light, the silhouette of the canopy. Slow shutter."
      />

      {/* APPLY */}
      {/* eyebrow was: "006" */}
      <Section id="apply" heading="How to apply">
        <P>
          There is no form. There is an address.
        </P>
        <P>
          Write to <strong>residency@theaura.life</strong>. Tell us who you are, what you are
          working on, and why the residency. One page is plenty. Attachments welcome but not
          required. We answer every note.
        </P>

      </Section>

      <PullQuote attribution="Arvind">
        We pre-select who can come in. Some people come from food, some from tie-dye, craftsmen.
        Doesn&apos;t need to be a named artist. You are a world person and this place is for you.
      </PullQuote>

      <Placeholder
        label="Gurukul circle — late afternoon"
        note="Small group seated on the veranda, a teacher mid-sentence, hands up."
      />

      <Continue
        items={[
          {
            href: '/artistry',
            label: 'Artistry',
            description: 'Studios, kitchens, code — the work the residency does.',
          },
          {
            href: '/idea',
            label: 'The 1000 Year Idea',
            description: 'The frame by which every choice is measured.',
          },
          {
            href: '/sanctuary',
            label: 'Sanctuary',
            description: 'Mudigere, Ohara — the two valleys the residency moves between.',
          },
        ]}
      />
    </>
  )
}
