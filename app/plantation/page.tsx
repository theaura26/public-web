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
  Couplet,
} from '@/components/article/Article'

export default function PlantationPage() {
  return (
    <>
      <ArticleHero
        title="The standard, not the claim."
        subline="One hundred and fifty acres in Mudigere, Karnataka. Coffee under native canopy, pepper on the areca, cattle in the centre of the cycle. The farm is not a business with a conscience; it is an organism we are trying to keep honest."
        toc={[
          { q: 'What is the philosophy?', href: '#philosophy' },
          { q: 'How does conversion happen?', href: '#method' },
          { q: 'What are the three worlds?', href: '#worlds' },
          { q: 'What are the six rules?', href: '#rules' },
          { q: 'What do we grow?', href: '#crops' },
        ]}
      />

      <Placeholder
        label="Hero — wide plantation landscape, monsoon mist"
        note="Drone at first light over the estate. Soft crimson laterite, areca canopy, low cloud in the valleys. Kept slow and quiet. 16:9."
      />

      {/* PHILOSOPHY */}
      {/* eyebrow was: "Philosophy" */}
      <TwoCol id="philosophy" heading="The farm is an organism.">
        <P>
          Regeneration at Aura is not a marketing category. It is a conviction about how land
          behaves when it is treated as a body rather than a factory. We do not measure a season by
          yield alone. We measure it by the number of birds returning to the canopy, by the depth
          of the topsoil after the monsoon, by the weight of a Malnad Gidda calf that has never
          met an antibiotic.
        </P>
        <P>
          We grow food the way our grandparents did, and we measure it the way a soil scientist
          would. Vedic preparations on a biodynamic calendar, cupped and indexed on the same
          bench. Earth up, never top-down.
        </P>
        <P>
          The land was tired when we arrived — a conventional coffee estate fed on urea and
          glyphosate for forty years. The first three seasons have been a slow apology: cover
          crops, cow-based preparations, silence where there used to be spraying. The trees are
          beginning to forgive us.
        </P>
      </TwoCol>

      <PullStat value="150" label="Acres in stewardship" sub="Mudigere, Chikkamagaluru — Western Ghats biosphere" />

      {/* FIVE-STAGE STAGING */}
      {/* eyebrow was: "Method" */}
      <Section
        id="method"
        heading="Depletion to abundance."
      >
        <P>
          Conversion is not a switch; it is a staircase. Each block on the estate sits on one of
          five stages. Some lots are still stabilising; others are old enough to hand over to the
          soil itself. We do not rush between them.
        </P>

        <DataGrid cols={2}>
          <DataCard label="Stage 01 — Stabilize" value="Year 0 – 1">
            Stop the bleeding. Halt synthetic inputs, plant cover crops, repair contour bunds,
            begin compost windrows. The goal is to keep the plant alive while the soil relearns
            how to breathe.
          </DataCard>
          <DataCard label="Stage 02 — Discipline" value="Year 1 – 2">
            Hand-weeding on rotation, cattle integration, mulch discipline. Every block is mapped
            and observed weekly. No shortcuts; no rescue sprays.
          </DataCard>
          <DataCard label="Stage 03 — Organic Transition" value="Year 2 – 3">
            Jeevamrit on a fortnightly rhythm. Beejamrit at the nursery. First certifications
            opened. Yields drop on paper; vitality rises in the soil probe.
          </DataCard>
          <DataCard label="Stage 04 — Biodynamic Maturation" value="Year 3 – 5">
            Full BD 500 – 508 calendar. Horn-manure and silica sprays timed to the Maria Thun
            sowing calendar. Cow Pat Pit on site. The farm begins to regulate itself.
          </DataCard>
          <DataCard label="Stage 05 — Higher Value" value="Year 5 +">
            Specialty lot separation, wine-technique fermentation, single-estate pepper,
            appellation framing. The same cherry now fetches five times the commodity price —
            because the soil earned it.
          </DataCard>
          <DataCard label="Audit rhythm" value="Every season">
            Soil carbon, microbial load, canopy count, bird census, water table, Brix on leaf.
            Recorded on Aura's own provenance stack — cherry to cup, hive to jar.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Field note, July 2025">
        The farm is an organism. The cow is its heart.
      </PullQuote>

      {/* THREE WORLDS */}
      {/* eyebrow was: "Three Worlds" */}
      <TwoCol id="worlds" heading="Biodynamic, Vedic, Fermentation.">
        <P>
          Three lineages meet on this land. They are not competing frameworks; they are three
          lenses on the same practice. Biodynamic discipline gives us timing. Vedic preparations
          give us depth of microbiology. Fermentation gives the cherry its second life.
        </P>
        <P>
          We treat them as a trinity. A single Jeevamrit drench can carry BD 500 into a fermenting
          Appassimento lot without contradiction — because they are all reading the same sky.
        </P>
      </TwoCol>

      <DataGrid cols={3}>
        <DataCard label="Biodynamic" value="BD 500 – 508 · CPP">
          Rudolf Steiner's preparations made on site, stirred by hand for one hour, sprayed at
          sunset. Horn-manure, horn-silica, six compost preparations, and the Cow Pat Pit.
          Calendar: Maria Thun.
        </DataCard>
        <DataCard label="Vedic" value="Vrikshayurveda">
          Jeevamrit, Beejamrit, Panchgavya, Kunapjal, Matka Khad. Five-cow tonics fermented in
          clay. The ancestral layer beneath the Steiner layer — older than the word organic.
        </DataCard>
        <DataCard label="Fermentation" value="Wine technique on coffee">
          Anaerobic, Appassimento, Solera, Banana Wash. Six separated lots, three yeast
          trajectories, one house style. Laboratory precision applied to an ancestral craft.
        </DataCard>
      </DataGrid>

      <PullStat value="43" label="Malnad Gidda cattle" sub="Indigenous to Karnataka — the dung, the urine, the milk, the breath" />

      {/* SIX RULES */}
      {/* eyebrow was: "The Six Rules" */}
      <Section
        id="rules"
        heading="Field-shed manifesto."
      >
        <P>
          Painted on the wall of the cattle shed. Six rules, six couplets — English and Kannada.
          New workers learn them before they learn the machines.
        </P>

        <Couplet en="Never take more than you give back." local="ಕೊಟ್ಟಷ್ಟೇ ತೆಗೆದುಕೊ." localLang="kn" />
        <Couplet en="The soil is older than the crop." local="ಬೆಳೆಗಿಂತ ಮಣ್ಣು ಹಳೆಯದು." localLang="kn" />
        <Couplet en="Feed the microbe, not the plant." local="ಗಿಡಕ್ಕಲ್ಲ, ಸೂಕ್ಷ್ಮಜೀವಿಗೆ ಉಣಿಸು." localLang="kn" />
        <Couplet en="Shade before sun. Root before fruit." local="ಹಣ್ಣಿಗೂ ಮೊದಲು ಬೇರು. ಬಿಸಿಲಿಗೂ ಮೊದಲು ನೆರಳು." localLang="kn" />
        <Couplet en="The cow is a colleague, not a machine." local="ಗೋವು ಸಹೋದ್ಯೋಗಿ, ಯಂತ್ರವಲ್ಲ." localLang="kn" />
        <Couplet en="Observe first. Act second. Speak last." local="ನೋಡು. ಮಾಡು. ಆಮೇಲೆ ಮಾತಾಡು." localLang="kn" />
      </Section>

      <Placeholder
        label="Shed mural — the six rules in English + Kannada"
        note="Cattle-shed back wall, hand-painted in lime, white on ochre. Tight detail shot, natural light, faint dust."
        aspect="4 / 5"
      />

      {/* CROPS INTRO */}
      {/* eyebrow was: "What we grow" */}
      <TwoCol id="crops" heading="Three crops, one canopy.">
        <P>
          Nothing here grows alone. Coffee lives in the shade of areca. Pepper climbs the areca
          trunks. The cattle feed on the understory and return their memory to the soil. The
          estate is a stacked forest, not a monoculture — five vertical layers engineered to mimic
          what the Western Ghats would grow without us.
        </P>
        <P>
          Each crop gets its own page, its own lots, its own cupping and grading. But they are
          written here as one chapter, because the farm does not separate them.
        </P>
      </TwoCol>

      <DataGrid cols={3}>
        <DataCard label="Coffee" value="100 acres">
          Sln.9 and Sln.795 Arabica under areca and native shade. Six specialty lots. Robusta on
          the lower slopes. Flagship: Lot 002 Appassimento.
        </DataCard>
        <DataCard label="Pepper" value="{confirm: acreage} acres">
          Malabar black pepper climbing the areca trunks. Three processing types — black, white,
          green. Water-retted and experimentally anaerobic.
        </DataCard>
        <DataCard label="Areca" value="{confirm: acreage} acres">
          The sentinel palm. The mid-canopy that makes the rest of the estate possible. Fresh,
          dried, and value-added.
        </DataCard>
      </DataGrid>

      <Placeholder
        label="Canopy cross-section diagram"
        note="Illustrated section of the five-layer canopy — emergent, canopy, sub-canopy, shrub, ground. Drawn in ink on warm paper. Labelled in English + Kannada."
        aspect="3 / 2"
      />

      <Continue
        items={[
          {
            href: '/coffee',
            label: 'Coffee',
            description: 'Six lots, one appellation. The flagship.',
          },
          {
            href: '/biodynamic',
            label: 'Biodynamic Practice',
            description: 'BD 500 – 508. The Steiner layer.',
          },
          {
            href: '/living-systems',
            label: 'Living Systems',
            description: 'Cattle, water, canopy, people.',
          },
        ]}
      />
    </>
  )
}
