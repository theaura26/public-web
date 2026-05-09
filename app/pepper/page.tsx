import {
  ArticleHero,
  TwoCol,
  Section,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  PullStat,
  Continue,
  Couplet,
} from '@/components/article/Article'

export default function PepperPage() {
  return (
    <>
      <ArticleHero
        title="Malabar black gold."
        subline="Single-estate pepper climbing the areca trunks of the Mudigere estate. Three processing styles, one appellation. The spice that carried the Malabar coast onto every map in Europe — grown now without the empire, and without the shortcuts."
        toc={[
          { q: 'What is the terroir?', href: '#terroir' },
          { q: 'What are the three types?', href: '#processing' },
          { q: 'How does fermentation work?', href: '#fermentation' },
          { q: 'What makes the appellation?', href: '#appellation' },
        ]}
      />

      <Placeholder
        label="Hero — pepper vine on areca trunk"
        note="Dense green drupes cascading down a mature areca trunk, rain-slick bark behind. Shot looking up into the canopy, slight backlight."
        aspect="4 / 5"
      />

      {/* TERROIR */}
      {/* eyebrow was: "Terroir" */}
      <TwoCol id="terroir" heading="Vine on palm.">
        <P>
          Black pepper (<em>Piper nigrum</em>) is a climber. In the Western Ghats it grows the way
          it has grown for two thousand years — trained up the trunks of shade trees. At Aura, the
          areca palm is the scaffolding. The vine and the palm have an ancient working agreement:
          the areca provides vertical architecture and dappled light; the pepper provides leaf
          litter and a dense root mat that holds the soil on a slope.
        </P>
        <P>
          Our vines sit at <strong>3,600 ft</strong> on red laterite, the same block as the
          coffee. Monsoon arrives in June and leaves in September. Flowering follows the first
          rain. Harvest runs{' '}
          <strong>{`{confirm: December – February}`}</strong>, picked by hand, cluster by cluster.
        </P>
        <P>
          Malabar pepper is one of the oldest geographical indications in the world — prized for
          the combination of heat, citrus top-note, and pine-resin depth that comes specifically
          from the Ghats terroir. We grow inside that appellation and intend to earn it every
          season.
        </P>
      </TwoCol>

      <DataGrid cols={4}>
        <DataCard label="Variety" value={`{confirm: Karimunda}`}>Malabar heirloom, GI Ghats.</DataCard>
        <DataCard label="Support" value="Areca palm">Live-tree climber, 15 – 20 m.</DataCard>
        <DataCard label="Elevation" value="3,600 ft" />
        <DataCard label="Harvest" value={`{confirm: Dec – Feb}`}>By hand, by cluster.</DataCard>
      </DataGrid>

      {/* THREE TYPES */}
      {/* eyebrow was: "Processing" */}
      <Section
        id="processing"
        heading="Three drupes from one vine."
      >
        <P>
          Black, white, and green pepper are not three plants. They are three decisions made in
          the first forty-eight hours after harvest. The same berry can take any of three
          trajectories depending on its ripeness at picking and what happens to it next.
        </P>
      </Section>

      <DataGrid cols={3}>
        <DataCard label="Black Pepper" value="Unripe · sun-dried">
          Picked just before ripeness, blanched briefly and sun-dried on raised beds for{' '}
          {`{confirm: 5 – 7}`} days. The skin wrinkles and darkens. The heat is forward; the
          aromatics — limonene, pinene, caryophyllene — are at their peak.
        </DataCard>
        <DataCard label="White Pepper" value="Ripe · water-retted">
          Picked fully ripe, soaked in flowing cool water for{' '}
          {`{confirm: 7 – 10}`} days to soften and ferment off the outer pericarp, then rubbed
          clean and dried. Heat without top-note. Preferred by chefs who want the bite without
          the smell.
        </DataCard>
        <DataCard label="Green Pepper" value="Unripe · brined / freeze-dried">
          Picked young and preserved in brine or flash freeze-dried to hold the fresh,
          grassy, sharply aromatic character of the live drupe. The kitchen pepper.
        </DataCard>
      </DataGrid>

      <Placeholder
        label="Three pepper jars — black, white, green"
        note="Simple still life on a dark linen cloth. Three identical glass jars, same lighting, same scale. Label-free."
      />

      {/* FERMENTATION */}
      {/* eyebrow was: "Fermentation" */}
      <TwoCol id="fermentation" heading="Water-retting and anaerobic.">
        <P>
          Traditional white pepper is made by retting — a controlled microbial fermentation in
          running water. We run our retting in spring water from the estate catchment, changed
          daily, at{' '}
          <strong>{`{confirm: 18 – 22}`} °C</strong>. The bacterial population that breaks down
          the pericarp also introduces volatile esters that traditional dry-process white pepper
          never develops. The cup — or the grind, rather — is rounder.
        </P>
        <P>
          Since <strong>{`{confirm: 2025}`}</strong> we have been running a small{' '}
          <strong>anaerobic black pepper</strong> lot as well. Unripe drupes sealed under CO₂ for
          {' '}<strong>{`{confirm: 36}`} hours</strong> before sun-drying. The flavour arrives
          fruitier, closer to a dried berry than a classic pepper. Experimental. The kind of lot
          we run when the kitchen is curious.
        </P>
      </TwoCol>

      <PullStat value="7,000+" label="Plant species in the biosphere" sub="UNESCO Western Ghats — one of eight global hotspots" />

      {/* APPELLATION */}
      {/* eyebrow was: "Appellation" */}
      <TwoCol id="appellation" heading="Place as signature.">
        <P>
          The Malabar coast has been the world's pepper source since Roman merchants followed the
          monsoon winds across the Arabian Sea. What distinguishes the best of it — the
          citrus-pine-heat triangle — is not the cultivar alone. It is the altitude, the laterite,
          the shade, and the specific microbiome of this strip of the Ghats.
        </P>
        <P>
          We label every lot with the block it came from, the month it was harvested, and the
          single trellis tree it climbed. Provenance is not a story we tell; it is the label on
          the jar.
        </P>
      </TwoCol>

      <PullQuote>The vine remembers every year.</PullQuote>

      <Couplet en="Heat without shortcut." local="ನೋವಿಲ್ಲದೆ ಬೇಗೆ ಇಲ್ಲ." localLang="kn" />

      {/* BUYERS */}
      {/* eyebrow was: "Buyers" */}
      <Section heading="Working with us." align="center">
        <P>
          Spice enquiries, single-estate pepper, and chef partnerships:{' '}
          <a href="mailto:spice@theaura.life">spice@theaura.life</a>
        </P>
        <P>
          Lots are small and released seasonally. Black, white, green, and the anaerobic
          experimental when it is worth releasing. We do not blend across estates. Every jar is
          from this land.
        </P>
      </Section>

      <Continue
        items={[
          {
            href: '/areca',
            label: 'Areca',
            description: 'The trellis tree. The sentinel of the estate.',
          },
          {
            href: '/fermentation',
            label: 'Fermentation',
            description: 'Water-retting, anaerobic, and the wet mill.',
          },
          {
            href: '/mudigere',
            label: 'Mudigere',
            description: 'The land the vine remembers.',
          },
        ]}
      />
    </>
  )
}
