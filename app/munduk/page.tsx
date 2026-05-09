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

export default function MundukPage() {
  return (
    <>
      <ArticleHero
        title={<>Munduk — the third sanctuary.</>}
        subline="Volcanic highlands of north Bali. A valley being read, not yet built."
        toc={[
          { q: 'What is the valley?', href: '#valley' },
          { q: 'What is the premise?', href: '#premise' },
          { q: 'What is the status?', href: '#status' },
        ]}
      />

      <Placeholder
        label="Munduk — aspirational landscape"
        note="North Bali highlands at dawn: terraced coffee gardens under cloud forest, a distant waterfall, volcanic ridges on the horizon. No buildings in frame."
      />

      {/* eyebrow was: "The Valley" */}
      <Section id="valley" heading="Volcanic terroir, cloud forest, long silence.">
        <P>
          Munduk sits in the volcanic highlands of north Bali, roughly {'{confirm}'} metres above the
          sea — coffee country, clove country, cloud forest, waterfall country. The soil is young and
          mineral, laid down by eruptions that are still in living memory on a geological clock. Two
          crater lakes sit above the valley. The rain arrives sideways.
        </P>
        <P>
          The people of Munduk have been growing coffee, cloves, and vanilla under canopy for
          generations. The hydrology is sacred; the <em>subak</em> irrigation system that shapes
          Balinese rice has been recognised by UNESCO as living cultural landscape. We are not here
          to improve on any of this. We are here to understand it.
        </P>
      </Section>

      {/* eyebrow was: "The Premise" */}
      <Section id="premise" heading="Living laboratories.">
        <P>
          If Mudigere is the body of patience and Ohara is the calm of reflection, Munduk is a
          laboratory. Southeast Asia holds some of the deepest fermentation traditions on earth —
          tape, tempeh, lawar, arak — alongside a ceremonial relationship with food that India and
          Japan both share but express differently. Munduk is where Aura&apos;s Indian soil
          philosophy meets the living archive of the Indonesian kitchen.
        </P>
        <P>
          What Aura will be in Munduk is not yet decided. A coffee house and a fermentation room are
          likely. A gurukul of one teacher and one student, almost certainly. A small residency for
          writers and musicians, perhaps. The buildings will come last. The philosophy is there
          already.
        </P>
      </Section>

      {/* eyebrow was: "Status" */}
      <Section id="status" heading="Listening.">
        <DataGrid cols={3}>
          <DataCard label="Phase" value="Pre-Shu">
            Relationships, land study, soil surveys, ceremony. No construction.
          </DataCard>
          <DataCard label="Elevation" value="~1,200 m">
            {'{confirm}'} — cool nights, long shade, specialty coffee climate.
          </DataCard>
          <DataCard label="Opens" value="TBD">
            When the valley tells us it is ready. Not before.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote>
        A sanctuary cannot be willed into existence.
        It has to be earned — twice.
      </PullQuote>

      <Continue
        items={[
          { href: '/sanctuary', label: 'Sanctuary', description: 'Return to the four valleys.' },
          { href: '/idea', label: 'The 1000 Year Idea', description: 'Why we build on a timescale that outlasts us.' },
          { href: '/daylesford', label: 'Daylesford', description: 'The southern counterweight, still forming.' },
        ]}
      />
    </>
  )
}
