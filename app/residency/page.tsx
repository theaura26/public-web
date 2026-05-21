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

      <OneCol heading="An artist residency for natural intelligence.">
        <p className="p1">
          A working studio inside a living system. The estate is the
          studio. The forest is the studio. The kiln, the wet mill, the
          cattle pen, the tea garden, the shepherd&apos;s lunch table —
          all of it is the studio.
        </p>
        <p className="p2">
          Artists, makers, scientists, chefs, and quiet thinkers come to
          Aura not to retreat from the world but to make work that could
          not have been made anywhere else. The work answers to the land,
          to the season, and to the people who have been listening to
          this place for longer than any of us have been alive.
        </p>
        <p className="p1" style={{ marginTop: 'var(--space-7)' }}>
          Natural intelligence.
        </p>
        <p className="p2">
          We treat the estate the way other people treat datasets. Canopy
          density predicts cherry <Term tip="Refractometer reading of dissolved sugars in the cherry or wort, expressed as a percentage.">Brix</Term>. Bee activity forecasts flowering.
          Cattle rotation shapes the next season&apos;s microbiome. Soil
          biology thirty days after cover-crop incorporation predicts the
          flavour profile of the coffee lot.
        </p>
        <p className="p2">
          The land is the original general-purpose intelligence —
          observed, transmitted, lived. Older than any model on a server.
          Our residents come to study it. To work alongside it. To make
          work that draws from it. Not to extract, not to optimise, not
          to wrap in marketing — to listen to it long enough that it
          changes what they make.
        </p>
        <p className="p2">
          This is what we mean by ancestral intelligence. It is the
          intelligence of a <Term tip="Centuries-old high-fire stoneware lineage from Shiga Prefecture; rough surface, ash-fly glaze, wood-fired anagama kiln.">Shigaraki</Term> potter who knows which wood the kiln
          will accept this week. The intelligence of a shepherd who reads
          the herd&apos;s mood like weather. The intelligence of a soil
          that has been farmed biodynamically long enough to have a
          memory. The work that comes out of this residency is the
          attempt to render that intelligence visible.
        </p>
      </OneCol>

      <TwoCol heading="Connective tissue between disciplines.">
        <p className="p1">
          Most artist residencies put a painter next to a painter and
          call it community. Aura does the opposite. A coffee fermenter
          next to a ceramicist. A soil biologist next to a <Term tip="Hand-made Japanese paper from kozo (paper mulberry) — Ohara studio practising techniques designated Intangible Cultural Property.">Washi</Term> papermaker.
          A designer next to a shepherd. The friction between disciplines
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
        REBEL with a cause. Grounded in ANCESTRAL KNOWLEDGE. Packaged
        with EDGE.
      </PullQuote>

      <TwoCol heading="The work that gets made here.">
        <p className="p1">
          A potter who arrives with a portfolio of urban ceramics leaves
          firing vessels with banana-leaf ash from a wash lot. A composer
          who comes to listen for a week leaves with a piece scored for
          eighteen minutes of cricket-and-rain. A chef writing ferment
          notes ends up cooking a season&apos;s menu around what the
          cattle ate that month. A designer makes the first Kannada
          colourway for an Ohara letterpress.
        </p>
        <p className="p2">
          We do not assign briefs. We host the conditions and let the
          land do the rest of the work. The residency&apos;s output is
          intentionally varied — books, dishes, instruments, gardens,
          tools, fragrances, music, films, software, glaze recipes,
          fermentation calendars — because natural intelligence does not
          come out in a single medium.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/residency/aura-monastic-polymath-2.jpg"
        alt="Hands at work on material in the residency studio — discipline ambiguous, Mudigere or Ohara"
        caption="A maker mid-task. India or Japan ambiguous."
      />

      <TwoCol heading="Two estates. Two old intelligences.">
        <p className="p1">
          Mudigere is Vedic. Ohara is Zen. Neither apologises to a
          Western sustainability narrative. Both operate from <Term tip="Sanskrit. Natural order; the rhythm that governs seasons, tides, germination, decay, and renewal. Predates organised religion.">Ṛta</Term> — right
          time, right action, natural order. The residency moves between
          them because the work that begins in one valley is often only
          complete once it has been read in the other.
        </p>
        <DataGrid cols={2}>
          <DataCard value="India · Mudigere">
            Raw. Monsoon. Soil. The intelligence of a four-story canopy
            and fifty-two indigenous cattle. Days begin with the herd
            moving through the morning mist; work is loud, hot, and
            generous; Kannada is the common tongue.
          </DataCard>
          <DataCard value="Japan · Ohara">
            Refined. Tea. Washi. The intelligence of an eight-hundred-
            year fermentation lineage in the valley and a third-
            generation zen garden on the property. Days are quieter,
            slower, more deliberate. Japanese is the common tongue.
            Purple shiso grows nowhere else in Japan.
          </DataCard>
        </DataGrid>
      </TwoCol>

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
        We are not building a PROGRAMME. We are building a RESIDENCY that
        will still be recognisable in a HUNDRED YEARS.
      </PullQuote>

      <Placeholder
        src="/journals/residency/aura-monastic-polymath-3.jpg"
        alt="A practitioner at work in a quiet studio — the residency's posture of attention"
        caption="Sit close to someone who has been listening to one craft for thirty years."
      />

      <TwoCol heading="Teachers in residence.">
        <p className="p1">
          The teachers are not visiting lecturers. They are people whose
          practice the estate is built around — a master potter, a
          biodynamic farmer, a washi papermaker, a coffee cupper, a
          shepherd, a tea host, a soil scientist. Most have been doing
          one thing for twenty to forty years.
        </p>
        <p className="p2">
          What we are really asking residents to do is sit close to
          someone who has been listening to one craft, one material, one
          living system long enough to know it without speaking. The work
          is the transcription of that knowing — into objects, recipes,
          tools, scores, books, software.
        </p>
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
          the single best way to meet the people behind it. <Term tip="Sanskrit / Kannada for &ldquo;the earth&rdquo;. The annual gathering that opens the residency to former residents, teachers, and neighbours for one week each year.">Bhoomi</Term>
          means &ldquo;the earth&rdquo; in Sanskrit and Kannada — the
          name is the brief.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/residency/aura-monastic-polymath-4.mp4"
        mediaType="video"
        poster="/journals/residency/aura-monastic-polymath-4.jpg"
        alt="Long tables at lantern light under the canopy silhouette — the Gathering at Bhoomi Festival"
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
        {`The land is the original intelligence.
         Listen to it long enough
         that it changes what you make.
         Ancestral knowledge.
         Packaged with edge.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="What the residency is really for.">
        <p className="p1">
          A century from now, very little of what we are calling artificial
          intelligence today will still be running. The intelligence that
          will still be running is the one that lives in soil, in craft,
          in shepherds&apos; vocabulary, in fermentation lineages, in the
          twenty-page notebooks of artists who spent two months on this
          estate watching the canopy breathe. The residency exists to put
          more of that into the world.
        </p>
      </OneCol>

      <Continue currentHref="/residency" />
    </>
  )
}
