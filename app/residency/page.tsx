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
        type="Detail · the residency"
        caption="Aura runs a residency for monastic polymaths — people who think, craft, and work across science and art — gathering them at Mudigere and Ohara into an environment built for focus, so the work that comes out is the truest they can make."
        alt="Aura — the residency for monastic polymaths"
      />

      <TwoCol id="reframe" heading="A residency for monastic polymaths.">
        <p className="p1">
          At Mudigere and Ohara, Aura runs a residency for polymaths — people
          who think, craft, and work across science and art, and will not
          choose one over the other. We gather them onto the land, hold the
          noise of the world off, and give them an environment built for focus.
          What comes out is the truest work they can make.
        </p>
        <p className="p1">
          Monastic is the operative word. A monk keeps one practice, one place,
          one long horizon, and works without an audience. That is the posture
          the residency asks for — full attention, unhurried, on a problem
          worth years. The polymath brings range across disciplines; the
          monastic keeps that range deep.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/residency/aura-monastic-polymath-2.jpg"
        alt="Hands at work on material in the residency studio — discipline ambiguous, Mudigere or Ohara"
        caption="A maker mid-task. India or Japan ambiguous."
      />

      <TwoCol heading="The environment of focus.">
        <p className="p1">
          Focus is the estate&apos;s first gift to a resident. Days run on the
          land&apos;s clock — you eat from the garden you walked
          past at dawn, and the work answers to the season and the people who
          have read this place longer than any of us have been alive.
        </p>
        <p className="p1">
          The thinking here is a kind of reading. Aura reads the estate the way
          others read datasets: canopy density predicts cherry{' '}
          <Term tip="Refractometer reading of dissolved sugars in a cherry or wort, given as a percentage.">Brix</Term>,
          bee activity forecasts flowering, cattle rotation shapes next
          season&apos;s microbiome. Residents learn to read it too. The land is
          the oldest general-purpose intelligence we have — observed,
          transmitted, lived — and a mind that listens to it long enough begins
          to think differently. That pairing, old knowledge with modern
          measurement, is what Aura calls Natural Intelligence.
        </p>
      </TwoCol>

      <TwoCol heading="The environment of craft.">
        <p className="p1">
          At Ohara, north of Kyoto, the residency keeps the valley&apos;s
          rhythm.{' '}
          <Term tip="朝 — morning. In Ohara's rhythm, the hours of light and renewal: café, tea, and workshops made by hand.">Asa</Term>{' '}
          is light and renewal — matcha and light meals, and workshops in
          fermentation, pottery, indigo, and kintsugi.{' '}
          <Term tip="庭 — garden, and by extension the evening. In Ohara's rhythm, the hours of calm and reflection.">Niwa</Term>{' '}
          is calm and reflection, the slow close of the day. Craft practised at
          that pace is craft done well, and the sanctuary is built to hold it.
        </p>
        <p className="p1">
          The teachers are the people the estate is built around — a Shigaraki
          potter, a{' '}
          <Term tip="Hand-made Japanese paper from kozo (paper mulberry); the Ohara studio works techniques designated Intangible Cultural Property.">Washi</Term>{' '}
          papermaker, a biodynamic farmer, a coffee cupper, a shepherd, a tea
          host. Most have kept one craft for thirty to forty years. Aura asks a
          resident to sit close to one of them long enough to learn what they
          know without it being spoken, then transcribe it — into objects,
          recipes, tools, scores, software.
        </p>
      </TwoCol>

      <PullQuote>
        We connect with nature so we can connect with ourselves. The *truest*
        solutions come from there.
      </PullQuote>

      <TwoCol heading="Where science and art cross.">
        <p className="p1">
          Aura seats a coffee fermenter next to a ceramicist, a soil biologist
          next to a papermaker, a founder next to a shepherd. The crossing is
          the point. Someone who has spent a month reading soil and firing clay
          solves a problem differently from a specialist who has only ever done
          one, and the residency is engineered for that crossing to happen
          daily.
        </p>
        <p className="p1">
          The output stays deliberately varied — books, instruments, glaze
          recipes, fermentation calendars, films, software — because a true
          solution can take any form. And it is aimed: at business, at founders,
          at humanity, at the spirit. Clear sight is the common requirement, and
          clear sight comes from attention held long enough to see the thing
          whole.
        </p>
      </TwoCol>

      <Placeholder
        src="/journals/residency/aura-monastic-polymath-3.jpg"
        alt="A practitioner at work in a quiet studio — the residency's posture of attention"
        caption="Sit close to someone who has been listening to one craft for thirty years."
      />

      <TwoCol heading="Two places, one residency.">
        <p className="p1">
          The residency runs across both places because the two hold different
          intelligences. Mudigere is Vedic — raw, monsoon, soil, a four-story
          canopy and fifty-two indigenous cattle, work that is loud, hot, and
          generous. Ohara is Zen — tea, washi, a seventy-year-old home and a
          thirty-year-old garden, days that are quieter and more deliberate.
          Both operate from{' '}
          <Term tip="Sanskrit. Natural order — the rhythm that governs seasons, tides, germination, decay, and renewal.">Ṛta</Term>:
          right time, right action.
        </p>
        <p className="p1">
          Aura moves residents between them because work that begins in one
          valley is often only finished once it has been read in the other. The
          estate is the studio: forest, kiln, wet mill, cattle pen, tea garden,
          greenhouse. You arrive inside a living system and work with material
          grown, fermented, or fired on the property. The environment does half
          the work.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard value="Focus">
          The estate holds the noise off. Days run on the land&apos;s clock,
          attention stays on one problem, and the horizon is measured in years,
          not weeks.
        </DataCard>
        <DataCard value="Craft">
          Teachers who have kept one practice for thirty to forty years, and a
          valley rhythm — Asa and Niwa — built to let a craft be learned slowly
          and by hand.
        </DataCard>
        <DataCard value="Creation">
          A working estate and a sanctuary as the studio — forest, kiln, wet mill, garden —
          where residents make with material grown, fermented, or fired on the
          ground they stand on.
        </DataCard>
      </DataGrid>

      <ScrollHighlight>
        {`Connect with nature.
         Connect with yourself.
         Hold the attention long enough
         that it changes what you make.
         That is the truest solution.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="What the residency is really for.">
        <p className="p1">
          A century from now, very little of what we call artificial
          intelligence today will still be running. The intelligence that will
          still be running lives in soil, in craft, in a shepherd&apos;s
          vocabulary, in fermentation lineages generations deep, in the
          notebooks of people who spent two months on an estate watching the
          canopy breathe. Aura runs the residency to put more of that into the
          world, and to send monastic polymaths back out with the truest
          solutions they were able to make — for business, for founders, for
          humanity. That is a horizon measured in generations, one resident, one
          season at a time.
        </p>
      </OneCol>

      <Continue currentHref="/residency" />
    </>
  )
}
