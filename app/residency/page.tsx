import {
  HeroBanner,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
  ScrollHighlight,
  Term,
} from '@/components/article/Article'

export default function ResidencyPage() {
  return (
    <>
      <HeroBanner
        currentHref="/residency"
        title="Monastic Polymaths"
        type="Detail · the working desk at dawn"
        caption="A working desk, a window onto the forest"
      />

      <TwoCol heading="Small is the strategy.">
        <p className="p1">
          Two weeks minimum. Pre-selected. Eight people per window per
          location. The scale is deliberate — so is the patience.
        </p>
        <p className="p2">
          We are not building a residency programme. We are building a
          place where the work you cannot do anywhere else gets made.
          Small enough that every applicant is read by the founder. Small
          enough that the shepherd, the cook, and the other residents
          know your name by the second morning.
        </p>
      </TwoCol>

      <TwoCol heading="Connective tissue between disciplines.">
        <p className="p1">
          Most residencies put a painter next to a painter and call it
          community. Aura does the opposite. A coffee fermenter next to a
          ceramicist. A soil biologist next to a washi papermaker. A
          designer next to a shepherd. The friction between disciplines
          is the point. That is where the work nobody else can make gets
          made.
        </p>
        <p className="p2">
          We call them <em>embedded residencies</em> because you do not
          arrive at a campus; you arrive inside a living system. You eat
          from the garden you walked past at dawn. You work with material
          that was sourced, fermented, or fired on the property. The
          residency is not the building. The residency is the biosphere.
        </p>
      </TwoCol>

      <PullQuote>
        We are not building a programme. We are building a residency that
        will still be recognisable in a hundred years.
      </PullQuote>

      <TwoCol id="formats" heading="Five formats. One kitchen.">
        <p className="p1">
          The residency is not one thing. It is five overlapping formats,
          sharing a kitchen, a kiln, a library, and a shepherd. You can
          arrive for one and leave touched by all five.
        </p>
        <DataGrid cols={3}>
          <DataCard value="2–4 weeks">
            For designers, architects, and system thinkers. Working
            briefs drawn from the farm, the sanctuary, the product OS.
            One-to-one time with Arvind in the first four days.
          </DataCard>
          <DataCard value="5–10 days">
            Intensives with master practitioners — <Term tip="Centuries-old high-fire stoneware lineage from Shiga Prefecture; rough surface, ash-fly glaze, wood-fired anagama kiln.">Shigaraki</Term> ceramics, <Term tip="Hand-made Japanese paper from kozo (paper mulberry) — Ohara studio practising techniques designated Intangible Cultural Property.">Washi</Term> paper, Uji tea, Malnad weaving, natural dye. Small
            cohorts, seasonal.
          </DataCard>
          <DataCard value="Rolling">
            An exhibition arm for work made on the estate or adjacent to
            it. Not a retail channel. A frame for the work to be seen.
          </DataCard>
          <DataCard value="1 teacher · 1 student">
            The oldest format on earth. Long apprenticeships in a single
            discipline — biodynamic, fermentation, pottery, coffee.
            Months, not weeks.
          </DataCard>
          <DataCard value="Project-scoped">
            Embedded work on product, sensor, world-model, or workflow
            problems. For the engineers, the researchers, the
            forward-deployed.
          </DataCard>
          <DataCard value="Annual">
            The Gathering — <Term tip="Sanskrit / Kannada for &ldquo;the earth&rdquo;. The annual gathering that opens the residency to former residents, teachers, and neighbours for one week each year.">Bhoomi</Term> Festival, the one week a year the residency
            becomes public. Music, fire, food, field walks.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="expressions" heading="Two expressions, one residency.">
        <p className="p1">
          The same residency is expressed two ways in two countries. A
          resident might spend the first week in Mudigere and the second
          in Ohara, or commit the whole stay to one. Each location is raw
          in its own way.
        </p>
        <DataGrid cols={2}>
          <DataCard value="India · Mudigere">
            Raw. Monsoon. Soil. Twelve cabins in the canopy — The Twelve
            Worlds — each named for an element of the estate: Hive, Root,
            Flow, Flame, Bloom, Canopy, Echo, Seed, Mist, Stone, Pulse,
            Ethereal. Days begin with the herd moving through the morning
            mist. Work is loud, hot, and generous. Kannada is the common
            tongue.
          </DataCard>
          <DataCard value="Japan · Ohara">
            Refined. Tea. Washi. A 90%-restored Japanese house 20 minutes
            from Kyoto, a natural onsen by the river, a third-generation
            zen garden on the property, an 800-year fermentation lineage
            in the valley. Days are quieter, slower, more deliberate.
            Purple shiso grows nowhere else in Japan. Japanese is the
            common tongue.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Detail · hands on material"
        caption="A maker mid-task. India or Japan ambiguous."
      />

      <TwoCol id="who" heading="The shape of the right applicant.">
        <p className="p1">
          We pre-select. The selection is not a gate, it is a promise —
          to you, to the other residents that week, to the land. Six
          criteria, drawn from how we actually choose.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Raw curiosity">
            An appetite that has not been professionalised out of you.
            You still follow things because they are interesting, not
            because they are strategic.
          </DataCard>
          <DataCard value="Grown maturity">
            You can be in a room with people you disagree with and do
            better work because of it. You hold your own time and your
            own hygiene.
          </DataCard>
          <DataCard value="Prolific output">
            You make a lot. Finished or unfinished. The volume is
            evidence of the practice. We would rather see twenty rough
            pieces than one polished portfolio.
          </DataCard>
          <DataCard value="Earned judgment">
            A point of view on taste. You can tell us why something
            works, not just that it does.
          </DataCard>
          <DataCard value="Full of gratitude">
            You know the land, the shepherd, the cook, and the other
            residents got you here. &ldquo;Full of gratitude&rdquo; is
            not a tone. It is a diagnosis.
          </DataCard>
          <DataCard value="Moral spine">
            We would rather host a twenty-year-old odd kid with
            conviction than a forty-year-old name with none.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        Rebel with a cause. Grounded in ancestral knowledge. Packaged
        with edge.
      </PullQuote>

      <TwoCol id="format" heading="The rhythm.">
        <p className="p1">
          Two weeks minimum. We have learned that anything shorter is
          tourism. Arvind is present on the property for the first three
          to four days of every residency — in the kitchen, at the field,
          at the desk. After that, residents work alone, or with the
          teachers in residence, or with each other.
        </p>
        <p className="p2">
          The rhythm is not a schedule. It is a day. You wake when the
          farm wakes. You eat what the farm ate yesterday. You work until
          the light goes. You read, walk, or sit. You repeat.
        </p>
        <DataGrid cols={3}>
          <DataCard value="2 weeks">Minimum stay. Anything shorter is tourism.</DataCard>
          <DataCard value="4 – 8">Cohort size per location, per window. Small enough to share a table.</DataCard>
          <DataCard value="First 3 – 4 days">Founder time. Arvind on-property.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol heading="The Gathering · Bhoomi Festival.">
        <p className="p1">
          Once a year, the residency opens. Former residents, visiting
          teachers, neighbours, the shepherd&apos;s family, the coffee
          cuppers, the ceramicists — all on the estate for one long week.
          Field walks in the morning. Workshops through the day. Music,
          fire, and long tables at night.
        </p>
        <p className="p2">
          The Gathering is the residency&apos;s annual culmination, and
          the single best way to meet the people behind it.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · long tables, lantern light"
        caption="The silhouette of the canopy. Slow shutter."
      />

      <TwoCol heading="By invitation.">
        <p className="p1">
          There is no form. There is an address. Write to
          {' '}<strong>residency@theaura.life</strong>. Tell us who you
          are, what you are working on, and why the residency. One page
          is plenty.
        </p>
        <p className="p2">
          Promise less, deliver more. We do not roadshow. We answer every
          note.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`The residency is not the building.
         The residency is the biosphere.
         Two weeks minimum.
         Anything shorter is tourism.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="One residency. Two valleys. One week a year.">
        <p className="p1">
          Two weeks at a desk in the canopy. Two weeks at a desk by the
          river. The friction of leaving one for the other is part of the
          work. Most residencies offer continuity. We offer the opposite,
          on purpose.
        </p>
      </OneCol>

      <Continue currentHref="/residency" />
    </>
  )
}
