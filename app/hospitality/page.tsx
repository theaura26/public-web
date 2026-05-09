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

export default function HospitalityPage() {
  return (
    <>
      <ArticleHero
        title="Luxury, slowed down."
        subline="Architect-led sanctuaries, residencies, and seasonal gatherings. Every room is built around a time of day and a body in it. Hospitality at Aura is not a service — it is the rhythm of the land made shareable."
        toc={[
          { q: 'What is Aura hospitality?', href: '#what' },
          { q: 'Where can you stay?', href: '#properties' },
          { q: 'How do guests experience it?', href: '#experience' },
          { q: 'What is the standard?', href: '#standard' },
        ]}
      />

      <Placeholder
        label="Hero — courtyard at dusk, low lantern, raked gravel"
        note="Wide shot of an Ohara veranda just after sundown. One lit window, a single futon laid out, garden in shadow."
      />

      {/* WHAT */}
      <TwoCol id="what" heading="A guest is not a customer. A guest is a witness.">
        <P>
          Aura hospitality is not a hotel collection. It is the way the land receives people who have
          come to listen. The rooms are small. The doors close softly. The wood remembers. The garden
          is the host before any of us are. Our job is to make the moment of arrival feel inevitable —
          and the moment of leaving, slow.
        </P>
        <P>
          Each property is an interpretation of one place. Mudigere is canopy and quiet. Ohara is
          stillness and water. Munduk will be highland air. Daylesford will be cold spring and long
          pale light. We do not transplant a brand from one to the next. We let each valley speak.
        </P>
      </TwoCol>

      {/* PROPERTIES */}
      <Section id="properties" heading="Three valleys, soon four.">
        <P>
          Two are open to invited guests today. One is in design. One is forming.
        </P>

        <DataGrid cols={2}>
          <DataCard label="Mudigere · India" value="Open · invited">
            150 acres in the Western Ghats. Eight rooms across the original estate. Forest table,
            fermentation shed, library, two open fires. Coffee at first light.
          </DataCard>
          <DataCard label="Ohara · Japan" value="Open · invited">
            A restored seventy-year garden. Teahouse, café, four guest spaces, a writer's room. Cedar,
            moss, river. Tea at four is the only appointment.
          </DataCard>
          <DataCard label="Munduk · Bali" value="In design">
            Highland cloud forest, volcanic ground. A valley being read, not yet built. Architecture
            in conversation with the slope.
          </DataCard>
          <DataCard label="Daylesford · Australia" value="Forming">
            Mineral spring country. Cool-temperate. Four seasons. The southern hemisphere
            counterbalance. Quiet acquisition stage.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Floor sketch — single guest room, futon plan"
        note="A pencil floorplan of the standard guest room. 18 sqm. Tatami, low desk, full-height window onto garden."
      />

      {/* EXPERIENCE */}
      <Section id="experience" heading="What a stay holds.">
        <P>
          Three rituals, repeated daily. Everything else is up to the guest.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Morning" value="First light walk">
            One staff member, one path, no narration. Forty minutes through the canopy or along the
            river. Returns in time for breakfast at the long table.
          </DataCard>
          <DataCard label="Mid-day" value="Forest-to-table">
            A single menu, written that morning, drawn from the garden and the ferment shelf. Eaten
            slowly. No service performance.
          </DataCard>
          <DataCard label="Late afternoon" value="Tea at four">
            The household appointment. Open seating. Whoever is on the property attends. The only
            reliable convening of the day.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Aura field standard">
        We are not the show. The land is the show.
      </PullQuote>

      {/* STANDARD */}
      <Section id="standard" heading="The standard is restraint.">
        <P>
          A property earns the Aura name when the gardener, the steward, and the kitchen agree it
          can. Not before. The rest of hospitality optimises for theatre. We optimise for memory. The
          quietest rooms are the ones a guest comes back for in their head.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Rooms per property" value="≤ 12">
            Small enough to be a household, not a hotel.
          </DataCard>
          <DataCard label="Staff to guest ratio" value="1 : 1.5">
            The number that keeps presence high without surveillance.
          </DataCard>
          <DataCard label="Public broadcast" value="None">
            No reviews farmed, no influencer beds, no rate parity races. Word of mouth is the
            distribution channel.
          </DataCard>
        </DataGrid>
      </Section>

      <PullStat value="≤ 12" label="rooms" sub="across each property, by design" />
      <PullStat value="04 : 00" label="tea" sub="the only daily appointment" />
      <PullStat value="100 yr" label="horizon" sub="every room built to outlast its builders" />

      <Continue
        items={[
          {
            href: '/sanctuary',
            label: 'Sanctuary',
            description: 'The estates as life-systems, not retreats.',
          },
          {
            href: '/spaces',
            label: 'Spaces',
            description: 'How each room is built around a time of day.',
          },
          {
            href: '/residency',
            label: 'Residency',
            description: 'For makers and monastic polymaths who come to work.',
          },
        ]}
      />
    </>
  )
}
