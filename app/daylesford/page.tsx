import {
  ArticleHero,
  Section,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
} from '@/components/article/Article'

export default function DaylesfordPage() {
  return (
    <>
      <ArticleHero
        title={<>Daylesford — still forming.</>}
        subline="Victoria, Australia. Cooler climate, mineral springs, long pale light. The southern hemisphere counterbalance."
        toc={[
          { q: 'What is the valley?', href: '#valley' },
          { q: 'What is the premise?', href: '#premise' },
          { q: 'What is the status?', href: '#status' },
        ]}
      />

      <Placeholder
        label="Daylesford — aspirational landscape"
        note="Victorian goldfields country: old volcanic lakes, eucalypt and stringybark, pale winter light across pasture. A distant dam, no houses in frame."
      />

      {/* eyebrow was: "The Valley" */}
      <Section id="valley" heading="A southern counterweight.">
        <P>
          Daylesford sits in the goldfields country of central Victoria, Australia — about ninety
          minutes north-west of Melbourne, in a landscape shaped by dormant volcanoes and cold
          mineral springs. The air is cooler than anywhere else Aura works. The light is longer and
          paler. The seasons move in the opposite direction to Mudigere and Ohara, which is exactly
          the point.
        </P>
        <P>
          This is country with a long memory of Indigenous stewardship — the Dja Dja Wurrung people
          have cared for this land for tens of thousands of years — and a shorter, heavier memory of
          colonial arrival and gold. Any Aura work here will begin with the custodians of that longer
          memory and move only at the pace they set.
        </P>
      </Section>

      {/* eyebrow was: "The Premise" */}
      <Section id="premise" heading="Opposite season, same rhythm.">
        <P>
          Daylesford&apos;s climate is the inverse of our tropical valleys. When Mudigere&apos;s
          monsoon is at full volume, Daylesford is in dry, cold winter. When Ohara is deep in summer
          humidity, Daylesford is at its first blossom. The sanctuary network needs this
          counterweight — a valley where the calendar reads the other way, where cold-climate grains
          and fruit can be studied, where an Aura resident can write through a southern winter while
          India and Japan are under sun.
        </P>
        <P>
          What the project becomes is still to be decided. Cooler-climate Agroculture — apples,
          walnuts, cold-pressed oils, native grains — is likely. A small studio and residency, almost
          certainly. A mineral-spring wellbeing practice that belongs to the place, not imported
          onto it, is being studied.
        </P>
      </Section>

      {/* eyebrow was: "Status" */}
      <Section id="status" heading="Early conversations.">
        <DataGrid cols={3}>
          <DataCard label="Phase" value="Pre-Shu">
            Custodian conversations, land study, climate and water baseline. No construction.
          </DataCard>
          <DataCard label="Climate" value="Cool temperate">
            Four distinct seasons. Winter frosts. Mineral springs.
          </DataCard>
          <DataCard label="Opens" value="TBD">
            When the country and the custodians say yes. Not before.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote>
        We will know when the land tells us it is ready.
      </PullQuote>

      <Continue
        items={[
          { href: '/sanctuary', label: 'Sanctuary', description: 'Return to the four valleys.' },
          { href: '/munduk', label: 'Munduk', description: 'The third sanctuary, in planning.' },
          { href: '/idea', label: 'The 1000 Year Idea', description: 'The standard every choice is measured by.' },
        ]}
      />
    </>
  )
}
