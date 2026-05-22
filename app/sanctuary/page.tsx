import {
  HeroBanner,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
} from '@/components/article/Article'

export default function SanctuaryPage() {
  return (
    <>
      {/* Hero: pinned full-bleed banner matching the modern journal
          pattern (biodynamic / fermentation / land). Dropped the
          previous ArticleHero subline + 6-question TOC + figure — the
          TOC pattern was retired across the kit. */}
      <HeroBanner
        title="Guests of the mountain."
        src="/aura-sanctuary.mp4"
        mediaType="video"
        poster="/aura-sanctuary.jpg"
        caption="The land in rhythm — two valleys in practice, two more in planning"
        alt="Aura Sanctuary — Mudigere and Ohara, the four-valley sanctuary stack"
      />

      <Placeholder
        caption="Wide establishing plate: mist burning off the Western Ghats at dawn, cutting to cedar forest above Ohara. Long, slow, held shots. No people in frame."
      />

      {/* eyebrow was: "The Premise" */}
      <TwoCol id="premise" heading="Four valleys. One rhythm.">
        <p className="p1">
          Aura is a way of tending land that begins by asking what the land
          already knows. We start from the earth and work up — soil, water,
          canopy, cattle, craft, kitchen, code. The buildings come last. The
          philosophy was there first.
        </p>
        <p className="p2">
          Our first two sanctuaries are already at work. Mudigere, in the Western Ghats of
          Karnataka, is 150 acres of biodynamic plantation, forest, and herd. Ohara, a valley
          north of Kyoto, is a 70-year-old home, a 30-year-old garden, and a restored teahouse.
          One is scale; the other is refinement. Together they are one organism with two
          climates.
        </p>
        <p className="p2">
          Two more valleys are forming — Munduk in the Bali highlands, Daylesford in the cooler
          south of Australia. Neither has a date. Both are listening exercises. We will know
          when the land tells us it is ready.
        </p>
      </TwoCol>
      <TwoCol id="guest" heading="Guests of the Mountain">
        <p className="p1">
          A sanctuary is not a property. It is a posture. It is what happens when a piece of
          land is tended long enough that it begins to tend the people who stand on it. The
          Western Ghats are among the oldest mountains on earth. The cedar above Ohara has seen
          a thousand winters. To arrive in either valley is to agree to a pace older than the
          arrival.
        </p>
        <p className="p2">
          In Thailand, a Buddhist nun is rescuing three hundred acres of condemned trees in
          Kengkacha UNESCO land, one transplant at a time. She does not call it a project. She
          calls it a debt. Aura is run on the same accounting. The land gave first. We are
          answering.
        </p>
        <p className="p2">
          The pattern is portable. Any community, anywhere, could grow it in their own soil —
          the four-pillared rhythm of land, hospitality, craft, and code, tuned to a particular
          climate and a particular lineage. Aura is one expression of that pattern. Not the only
          one. Not the last.
        </p>
      </TwoCol>

      <PullQuote>
        Humans are not owners here — only guests of the mountain.
      </PullQuote>

      {/* eyebrow was: "India · Japan" */}
      <TwoCol id="duality" heading="The Duality">
        <p className="p1">
          India gives us scale, monsoon, and cosmological time. Japan gives us restraint, craft, and
          millimetric care. Aura needs both. The Mudigere forest teaches generosity; the Ohara garden
          teaches attention. One cannot substitute for the other, and neither is complete alone.
        </p>
        <DataGrid cols={2}>
          <DataCard value="Mudigere — Karnataka">
            150 acres of biodynamic plantation at 3,600 feet in the Western Ghats. Coffee, pepper,
            areca, and a herd of Malnad Gidda cattle. Red laterite soil, 40–100 inches of rainfall a
            year, a UNESCO biosphere at the door. The body of patience.
          </DataCard>
          <DataCard value="Ohara — Kyoto">
            A valley of cedar, river, and temple an hour north of Kyoto. A restored 70-year-old
            home, a 30-year-old garden, a teahouse carried forward by a craftsman and his grandson.
            Wabi-sabi as foundation. The calm of reflection.
          </DataCard>
        </DataGrid>

        <DataGrid cols={2}>
          <DataCard value="13.1365° N">
            Mudigere · Western Ghats, Karnataka · 3,600 ft · 150 acres · UNESCO biosphere.
          </DataCard>
          <DataCard value="35.2375° N">
            Ohara · North of Kyoto · 1,099 ft · 70-year home, 30-year garden, restored teahouse.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Arvind">
        India gave me the ground. Japan gave me the stillness. Together they became something
        neither could be alone.
      </PullQuote>

      {/* eyebrow was: "The Operating System" */}
      <TwoCol id="os" heading="Sanctuary · Agroculture · Artistry">
        <p className="p1">
          Every Aura valley is built on three structural pillars. <strong>Sanctuary</strong> is the
          land held in rhythm — the stillness, the method, the slow choreography of seasons.{' '}
          <strong>Agroculture</strong> is what the land produces when treated as an organism rather
          than a yield: specialty coffee, pepper, native cattle, fermented food, medicine.{' '}
          <strong>Artistry</strong> is what the people on the land make of it — studios, residencies,
          kitchens, labs, gatherings.
        </p>
        <p className="p2">
          The three pillars are not separable. The coffee is not coffee without the cattle; the cabin
          is not a cabin without the canopy; the studio is not a studio without the soil. This is why
          we call it an ecosystem and not a collection.
        </p>
      </TwoCol>

      {/* eyebrow was: "Entry" */}
      <TwoCol id="rhythm" heading="Not a destination. A rhythm you enter.">
        <p className="p1">
          A sanctuary is entered slowly. The first hour is for the body to catch up with the
          valley. The first day is for the kitchen to read the guest, not the other way round.
          The first week is for the silence to become interesting rather than loud.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Work · Harvest · Learn">
            Morning. The day begins when the mist lifts and the soil softens. Apprenticeship in motion.
          </DataCard>
          <DataCard value="Gather · Savour · Listen">
            Evening. The day closes around a fire or a table. Not with fatigue — with fullness.
          </DataCard>
          <DataCard value="Pause · Observe · Belong">
            Any time. The core discipline. The only appointment in a week of silence is tea at four.
          </DataCard>
        </DataGrid>
        <p className="p2">
          The visit is not measured in nights. It is measured in what you carry with you when
          you leave — a slower pulse, a clearer palate, a week of stillness that keeps paying
          out for a year.
        </p>
      </TwoCol>

      {/* eyebrow was: "Coming Sanctuaries" */}
      <TwoCol id="coming" heading="Munduk · Daylesford">
        <p className="p1">
          A sanctuary cannot be willed into existence. It has to be earned, twice — once from the
          people of the valley, and once from the valley itself. We are in the patient early
          conversations of both.
        </p>
        <p className="p2">
          <strong>Munduk</strong> sits in the volcanic highlands of north Bali — coffee country,
          cloud forest, waterfalls. It is where Aura&apos;s Indian soil philosophy meets Southeast
          Asia&apos;s living laboratory of fermentation and ceremony. The land is being read.
        </p>
        <p className="p2">
          <strong>Daylesford</strong>, in Victoria, Australia, is Aura&apos;s southern counterweight.
          Cooler climate, mineral springs, a landscape that holds long memory of both Indigenous
          stewardship and European arrival. A valley to be met slowly, on its own time.
        </p>
      </TwoCol>

      <Placeholder
        caption="Volcanic highlands of north Bali. Terraced coffee gardens at ~1,200 m, cloud forest, waterfalls. Frame: a single wooden gate at the edge of a terrace, no signage."
      />

      <Placeholder
        caption="Cooler southern-hemisphere landscape — old volcanic lakes, eucalypt, wide pasture in Victoria, Australia. Low sun, pale light."
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
