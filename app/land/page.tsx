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
} from '@/components/article/Article'

export default function LandPage() {
  return (
    <>
      <ArticleHero
        title="The land is the lab."
        subline="One hundred and fifty acres at 3,600 feet, treated as an instrument. Every block measured, every ferment logged, every cow named. The estate is the laboratory — and the only one that returns its readings in the language of soil."
        toc={[
          { q: 'What does it mean to call the land a lab?', href: '#premise' },
          { q: 'What is being measured?', href: '#instruments' },
          { q: 'What are the six rules?', href: '#rules' },
          { q: 'What grows here?', href: '#crops' },
          { q: 'How is the work staged?', href: '#stages' },
          { q: 'What is the lab learning?', href: '#findings' },
        ]}
      />

      <Section id="premise" heading="The Premise">
        <P>
          A lab is a place that takes a question seriously. It isolates variables, repeats the
          work, and writes down what happens. Most farms are not labs. They are production lines
          interrupted by weather. Aura Mudigere is a farm, and a production line, and a lab —
          and the order matters. Soil first. Then the year. Then the harvest.
        </P>
        <P>
          The estate is one hundred and fifty acres on the eastern slope of the Western Ghats —
          a UNESCO biosphere, a monsoon catchment, a coffee appellation, and a herd of fifty‑two
          indigenous Malnad Gidda cattle. It is also a notebook. Every plot has a name. Every
          ferment has a number. Every cow has a date and a temperament. None of this is
          decoration. It is what allows the next year&apos;s decision to be better than the last
          year&apos;s guess.
        </P>
        <P>
          Calling the land a lab is not a metaphor for ambition. It is a method. We arrived
          here with assumptions and we have been corrected by the ground ever since. The
          corrections are the most valuable thing the estate produces — more valuable than the
          coffee, the pepper, or any of the lots we ship.
        </P>
      </Section>

      <Placeholder
        label="Image · 150 acres in the morning, Mudigere"
        note="Suggested: aerial of the estate canopy with the Western Ghats in fog behind, warm horizontal light. Landscape 16:9."
      />

      <PullQuote attribution="Arvind">
        We do not own the land. We are the people listening to it this century.
      </PullQuote>

      <Section id="instruments" heading="What The Lab Measures">
        <P>
          Most of the instruments at Mudigere are slow. A canopy that closes over thirty years.
          A microbiome that stabilises over five. A cohort of cows whose milk pH says more about
          our pasture than any chemical assay. The fast instruments — refractometers, pH meters,
          weather stations — are useful, but they only confirm what the slow ones already
          decided.
        </P>
        <DataGrid cols={4}>
          <DataCard label="Location" value="Mudigere">
            Chikmagalur District, Karnataka. UNESCO‑listed biosphere, eastern Western Ghats.
          </DataCard>
          <DataCard label="Altitude" value="3,600 ft">
            Cool nights, long shade, slow ripening. The reason a Mudigere lot tastes different
            from a Coorg lot at the same latitude.
          </DataCard>
          <DataCard label="Estate" value="150 acres">
            One hundred acres of coffee, fifty acres of forest, pasture, water bodies, and
            buildings. The proportions are part of the experiment.
          </DataCard>
          <DataCard label="Soil" value="Laterite">
            Red, iron‑rich, well‑drained. Acidic by default. Our pH lift is engineered through
            compost, cow horn preparations, and time.
          </DataCard>
          <DataCard label="pH" value="6.0 — 6.5">
            The narrow window arabica wants. Held by the herd, not by the bag.
          </DataCard>
          <DataCard label="Herd" value="52 Gidda">
            Indigenous Malnad Gidda — the soil system&apos;s heart, the dung the microbiome
            eats, the milk we drink. Each named, each dated.
          </DataCard>
          <DataCard label="Rainfall" value="2,400 mm">
            Concentrated in the southwest monsoon. The bloom and the harvest are scheduled
            around it.
          </DataCard>
          <DataCard label="Canopy" value="3 tiers">
            Areca above, coffee below, pepper climbing through. Native shade trees over all of
            it. A vertical farm without the marketing.
          </DataCard>
        </DataGrid>
      </Section>

      <PullStat value="150" label="Acres — the instrument" sub="Held as one organism, not seven crops." />

      <Section id="rules" heading="Six Rules, Carved In Wood">
        <P>
          A lab is only as honest as the discipline of the people inside it. The six rules are
          painted on every work shed at Mudigere — in English and in Kannada — because they are
          not policy, they are practice. They were written by the people on the land, for the
          people on the land. Visitors are not asked to follow them. They are asked to read
          them.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 — Soil First" value="The soil decides everything else.">
            Every input, every timing, every yes and every no answers to the ground. If the
            soil is wrong, nothing above it can be right.
          </DataCard>
          <DataCard label="02 — Small Work, Properly" value="Mastery before scaling.">
            A single block done properly teaches more than a hundred acres rushed. We grow by
            depth, then by area.
          </DataCard>
          <DataCard label="03 — No Shortcuts" value="Timing is a material.">
            Right time beats quick time. The Rta principle, in workwear. A wrong action at the
            right hour is still wrong; a right action at the wrong hour is still wrong.
          </DataCard>
          <DataCard label="04 — Quality Before Quantity" value="One excellent lot over five average ones.">
            The estate is not measured in kilograms. It is measured in the standard of the worst
            kilogram we ship.
          </DataCard>
          <DataCard label="05 — Ten Years Ahead" value="Every action serves the long game.">
            No decision is taken without naming who lives with it in 2036. If the answer is
            nobody, the answer is no.
          </DataCard>
          <DataCard label="06 — Leaders On The Field" value="Authority comes from presence.">
            The agronomist works the rows. The roaster picks cherries. The owner cleans the
            cattle shed. Hierarchy follows hands, not the other way round.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Etched on every work shed">
        Be on the land. Be fair. Do the work properly.
      </PullQuote>

      <Section id="crops" heading="What Grows In The Experiment">
        <P>
          Four crops, one canopy. Coffee is the flagship, but the lab is not a coffee farm. It is
          a stack of intelligences — woody, climbing, slender, herbaceous — each one solving a
          different problem for the others. Remove any one of them and the system limps.
        </P>
        <DataGrid cols={2}>
          <DataCard label="Coffee" value="100 acres · Arabica">
            S795, Selection 9, Chandragiri. Six separated micro‑lots under shade. The crop the
            estate is famous for — and the one most disciplined by the others.
          </DataCard>
          <DataCard label="Pepper" value="Malabar · climbing">
            Single‑estate black pepper, climbing the areca trunks. Three ferments, one
            appellation. The aromatic backbone of the kitchen and the export book.
          </DataCard>
          <DataCard label="Areca" value="Estate canopy">
            The sentinel palm. Mid‑canopy, trellis for the pepper, structural anchor for the
            ecosystem. Economic stability when the coffee year is hard.
          </DataCard>
          <DataCard label="Tea" value="Experimental plots">
            Small‑scale trials at altitude. Testing processing methods and cultivar adaptation.
            Year three of a ten‑year question.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Image · cherry, pepper, areca — three crops in one frame"
        note="Suggested: close-up looking up the trunk of an areca palm with pepper vines and coffee fruit in foreground. Vertical 4:5."
      />

      <Section id="stages" heading="The Five Stages">
        <P>
          The estate does not aim to optimise. It aims to mature. The path runs in five stages,
          each one earned by the last. We measure where we are by what we are now allowed to
          ask. Stage three is the right to specialise. Stage four is the right to make.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 — Stabilise" value="Heal the ground.">
            Stop the bleeding. Compost in, chemistry out. Cow before crop. The unsexy years.
          </DataCard>
          <DataCard label="02 — Rebuild" value="Restore the biology.">
            Microbiome, canopy, water, herd. Build the body before asking it to perform.
          </DataCard>
          <DataCard label="03 — Optimise" value="Tune the system.">
            Where we are. Variables become legible. We can finally answer questions in soil and
            cup, not in theory.
          </DataCard>
          <DataCard label="04 — Specialise" value="Make instead of grow.">
            Ferments, single‑lot programmes, named processes. Where we are heading. The
            transition from commodity to craft.
          </DataCard>
          <DataCard label="05 — Higher‑Value" value="Earn the language of wine.">
            One‑hundred‑point cups, vintage releases, on‑chain provenance. The right to charge
            for the difference because the difference is real and the difference is logged.
          </DataCard>
          <DataCard label="Current" value="Stage 3 → 4">
            We are mid‑transition. The data is good. The cups are climbing. The fourth stage is
            already running in pilot.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Arvind">
        Genetics are the instrument. Processing is the music. The land is the instrument that
        tunes both.
      </PullQuote>

      <Section id="findings" heading="What The Lab Has Learned">
        <P>
          A lab earns its existence by what it learns. The estate&apos;s log is not a marketing
          document. It is a list of things we used to believe and have stopped believing,
          replaced by what the ground showed us instead.
        </P>
        <P>
          We used to think coffee wanted full sun. The cup told us otherwise — shade lifts the
          acidity and lengthens the finish. We used to think pepper was an export. The
          kitchen told us it was a fermentation programme. We used to think the cows were a
          legacy obligation. The microbiome told us they were the centre of everything.
        </P>
        <P>
          The lab will be wrong again. That is its job. What matters is that the next correction
          is faster than the last one, and that the people doing the correcting are the same
          people sleeping on the estate, eating from its kitchen, walking its rows at six in the
          morning. There is no remote operation of a lab like this. The instruments only read
          for the people who are present.
        </P>
      </Section>

      <PullStat value="6" label="Rules" sub="Carved on every work shed. In two languages." />

      <Section heading="The Practice" align="center">
        <P>
          The land is the lab. The cup is the result. The farm is the discipline. The
          thousand‑year frame is the unit of measurement. Everything else is scaffolding around
          the readings.
        </P>
      </Section>

      <Continue
        items={[
          {
            href: '/biodynamic',
            label: 'Biodynamic',
            description: 'The farm as organism. The cow at the centre.',
          },
          {
            href: '/vedic',
            label: 'Vedic',
            description: 'The older method. Older than the rulebook.',
          },
          {
            href: '/provenance',
            label: 'Provenance',
            description: "Cherry to cup. On chain. The lab's notebook, public.",
          },
        ]}
      />
    </>
  )
}
