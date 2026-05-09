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
  Continue,
  Chapter,
  Rta,
} from '@/components/article/Article'

export default function RtaPage() {
  return (
    <>
      <ArticleHero
        title={<Rta />}
        subline="Right time. Right action. The oldest Sanskrit word for the order of things — and the most practical principle on the farm."
        toc={[
          { q: 'What is the principle?', href: '#principle' },
          { q: 'What does fifteen minutes of silence teach?', href: '#raya' },
          { q: 'How does alignment work?', href: '#method' },
          { q: 'What are RTA Labs?', href: '#labs' },
          { q: 'What is effortless action?', href: '#effortless' },
        ]}
      />

      <Section id="principle" heading="The Principle">
        <P>
          <Rta /> is the cosmic order that keeps the seasons turning, the rivers running, the cow
          lying down before the monsoon. It is not a rule to be obeyed. It is a grain to be
          read, and then moved with.
        </P>
        <P>
          Western industry is trained on force — more inputs, more hours, more volume. <Rta />
          {' '}names the other way. Wait for the moment when the least effort yields the most life.
          Stir at dusk, not noon. Prune on the waning moon. Press the grape when the sugar is
          ready, not when the calendar is.
        </P>
        <P>
          Every serious agricultural tradition — Vedic, biodynamic, Shintō, permaculture —
          converges here. The language differs; the instruction is the same. Alignment, not
          override.
        </P>
      </Section>

      <Placeholder
        label="Image · BD 500 stirred in copper vessel, dusk"
        note="Suggested: slow vortex in BD 500 stirring barrel at blue hour, lit by lantern. Motion blur on the stick. 16:9 video ideal."
      />

      <PullQuote>When timing is right, the action is effortless.</PullQuote>

      {/* number was: "01" */}
      <Chapter number="" title="Fifteen Minutes of Silence" id="raya" />

      <Section>
        <P>
          At Raya, a small restaurant in Phuket, the meal begins with fifteen minutes of
          silence. No menu. No order. No speaking. Guests sit at a long table and the senses
          start to arrive one at a time — the ice in the glass, the neighbour&apos;s breath,
          the oil warming in the kitchen, the pepper in the air. Only then does food come.
        </P>
        <P>
          It is a small piece of theatre with a serious point. The palate is not ready when the
          body is not ready. The body is not ready when the room is moving too fast. Most of the
          taste of a meal is the pause before it. <Rta /> is a pause before an action, held
          long enough that the action can land.
        </P>
        <P>
          In Mudigere the pause is dusk, the hour the earth inhales and the foliar spray can be
          received. In Ohara the pause is the tea at four, the only appointment of a week of
          silence. In the kitchen the pause is the menu waiting for what came in at dawn. The
          scale differs. The instruction is the same.
        </P>
      </Section>

      <PullQuote>
        Timing is a material.
      </PullQuote>

      {/* number was: "02" */}
      <Chapter number="" title="Five Moments of RTA" />

      <Section>
        <P>
          <Rta /> is not abstract. It is the difference between coffee that tastes of its hill and
          coffee that tastes of nothing in particular. Five concrete cases from the working
          farm.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Preparation" value="BD 500 · at dusk">
            Cow-horn manure is stirred for one hour, changing direction every minute, as the
            light softens. Stirred at noon it is inert. Stirred at dusk it is alive. The
            microbiology agrees with the clock.
          </DataCard>
          <DataCard label="Fermentation" value="Coffee · 36 hours">
            The anaerobic window closes at {`{confirm figure}`}°C after roughly 36 hours. An
            hour early, flat. An hour late, vinegar. The cherry decides; the processor listens.
          </DataCard>
          <DataCard label="Drying" value="Clear days only">
            Beans are moved to the patio on clear mornings and withdrawn before the evening
            humidity rises. We do not dry against the weather. We dry with it, and accept the
            days we cannot.
          </DataCard>
          <DataCard label="Garden" value="Sowing by moon">
            Root crops on the descending moon, leaf crops on the ascending, flowers and fruits
            by their own nakshatra. The panchanga is pinned in the field shed alongside the
            weather radar.
          </DataCard>
          <DataCard label="Hospitality" value="Asa · Niwa">
            In Ōhara the day is cut clean — Asa for morning work and light meals, Niwa for
            evening table and quiet. Guests eat when the garden is ready, not when the clock
            demands.
          </DataCard>
          <DataCard label="Rest" value="The cow first">
            The herd dictates the morning. If the Malnad Gidda are not ready, the milking is
            not ready, and the kitchen waits. <Rta /> begins with the animal, not the schedule.
          </DataCard>
        </DataGrid>
      </Section>

      {/* eyebrow was: "Method" */}
      <TwoCol id="method" heading="Alignment over force.">
        <P>
          Force produces output. Alignment produces quality. The gap between them is invisible
          in a quarterly report and unmistakable on the tongue, in the nose, under the feet.
        </P>
        <P>
          <Rta /> is therefore an economic principle as much as a spiritual one. It determines which
          coffee lots we can name, which harvests earn appellation, and which rooms a guest
          wants to return to. The farm pays its bills on right-timing.
        </P>
      </TwoCol>

      <PullStat value="36" label="Hours · anaerobic ferment" sub="Coffee Lot 002, Dry Osmosis" />

      <Section heading="A Vedic list, a working clock.">
        <P>
          Every serious agricultural tradition converges on the same instruction, spoken in
          different tongues. Here is how <Rta /> shows up at Mudigere across a single working
          week — not as philosophy, as timetable.
        </P>
        <DataGrid cols={2}>
          <DataCard label="Dawn · Herd" value="The cow decides">
            Milking begins only when the Malnad Gidda are ready. The kitchen receives milk
            warmed by the animal, not the machine.
          </DataCard>
          <DataCard label="Morning · Soil" value="Compost turned">
            Matka Khad is checked, Jeevamrit batches topped. Microbes have been working through
            the night. The pile tells us its temperature.
          </DataCard>
          <DataCard label="Noon · Rest" value="The body waits">
            Nothing biologically alive is stirred, sprayed, or planted at noon. The earth is
            exhaling. We are too.
          </DataCard>
          <DataCard label="Dusk · Spray" value="The earth inhales">
            BD 500, Jeevamrit foliar, buttermilk-coconut-magnesium — applied only when the light
            softens and the stomata open. An hour early, wasted. An hour late, wasted.
          </DataCard>
          <DataCard label="Night · Ferment" value="36-hour window">
            Coffee cherries begin their anaerobic window. The tank is watched, not managed. The
            cherry decides. The processor listens.
          </DataCard>
          <DataCard label="Waning moon · Prune">
            Root crops on the descending moon. Leaf crops on the ascending. Flowers and fruit by
            their own nakshatra. The panchanga hangs in the shed alongside the weather radar.
          </DataCard>
        </DataGrid>
      </Section>

      {/* number was: "03" */}
      <Chapter number="" title="RTA Labs" id="labs" />

      <Section>
        <P>
          <Rta /> Labs is the quiet hardware layer that makes natural systems legible. Soil
          moisture, leaf temperature, tank CO₂, fermentation pH, barn humidity, sky clarity —
          each signal sampled and surfaced to the person on the ground.
        </P>
        <P>
          The labs do not decide. They translate. The farmer still reads the weather; the sensor
          confirms, or disagrees, and the conversation produces a better decision than either
          could alone. This is invisible tech in its exact sense: present where it is useful,
          absent where it is not.
        </P>
        <P>
          Every reading is provenance. The cherry-to-cup record begins here, in the root zone,
          on the date and hour the rain arrived. The blockchain is kept downstream; the truth is
          kept in the dirt.
        </P>
        <P>
          When you walk into the sanctuary, you do not feel tech. That is the test. A sensor
          that announces itself has failed. A reading that requires a screen to understand is
          half a reading. <Rta /> Labs is built so the data is surfaced where the hands already
          are — in the shed, on the wall, in the palm of the field lead who knew before the
          sensor did.
        </P>
      </Section>

      <Placeholder
        label="Image · sensor buried at root zone of coffee plant"
        note="Suggested: macro shot of a small soil probe nestled in leaf litter beneath a coffee plant; wet soil, early light."
      />

      <PullQuote attribution="Arvind">
        Invisible tech. That&apos;s the future for us.
      </PullQuote>

      <Section id="effortless" heading="The Effortless Action">
        <P>
          In Vedic thought the adept is the one whose action is effortless — not because it is
          easy, but because it is timed. The stone is dropped at the top of the arc. The note
          is sung on the held breath. The seed is placed into soil that has just been waiting
          for it.
        </P>
        <P>
          <Rta />, then, is not a mystical add-on to the farm. It is the farm's operating principle,
          the kitchen's, the studio's, and the residency's. The more we practice it, the less
          of ourselves we need to put into the work — and the more the work carries itself.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Farm" value="Read the ground">
            Soil, canopy, herd, sky.
          </DataCard>
          <DataCard label="Kitchen" value="Read the harvest">
            Menu follows what came in at dawn.
          </DataCard>
          <DataCard label="Studio" value="Read the maker">
            Ship when it is done, not when it is due.
          </DataCard>
        </DataGrid>
      </Section>

      <Continue
        items={[
          {
            href: '/biodynamic',
            label: 'Biodynamic',
            description: 'BD 500–508, the preparations that live by RTA.',
          },
          {
            href: '/fermentation',
            label: 'Fermentation',
            description: 'Lots 001–006. Where timing becomes taste.',
          },
          {
            href: '/labs',
            label: 'Labs & Hardware',
            description: 'The quiet sensors behind the decisions.',
          },
        ]}
      />
    </>
  )
}
