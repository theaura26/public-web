import {
  JournalHero,
  TwoCol,
  OneCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
  Term,
} from '@/components/article/Article'

export default function PepperPage() {
  return (
    <>
      <JournalHero
        currentHref="/pepper"
        title="Malabar Pepper"
        mediaType="image"
        caption="Aura grows black pepper at Mudigere, trained up the areca palms in the mid-canopy — an old Western Ghats method worked with close attention, picked by hand and processed on the estate into black, white, and green."
        alt="Aura pepper — Malabar black pepper climbing the areca trunks"
      />

      <TwoCol id="growing" heading="The vine grows up the palm.">
        <p className="p1">
          <Term tip="The black-pepper vine, native to the Western Ghats of southern India. It climbs — in the wild, up the trunk of a living tree rather than a post.">Piper nigrum</Term> is
          a climber. At Mudigere, Aura trains it up the areca palm — one vine to a trunk — so the pepper
          rises into the mid-canopy on living wood, the way it has grown in the Western Ghats for
          centuries. The method is old; the attention Aura pays it is exact.
        </p>
        <p className="p2">
          The vines sit at <strong>3,600 ft</strong> on the red{' '}
          <Term tip="Iron- and aluminium-rich red soil weathered in the wet tropics. Free-draining and acidic — the ground the estate's coffee and pepper both root into.">laterite</Term>{' '}
          the coffee roots into, under the same four-story shade. The monsoon arrives in June and leaves
          in September. Flowering follows the first rain; the pick runs through the dry months that
          follow, by hand, cluster by cluster, never stripped.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Areca palm">The living trellis — one vine to a trunk, in the mid-canopy.</DataCard>
          <DataCard value="3,600 ft">The coffee&apos;s elevation, the coffee&apos;s laterite, the coffee&apos;s shade.</DataCard>
          <DataCard value="By hand">Picked cluster by cluster through the dry months, never stripped.</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Portrait · canopy"
        caption="Black pepper climbing the rain-slick trunk of a mature areca palm at Mudigere"
      />

      <TwoCol id="processing" heading="Black, white, and green.">
        <p className="p1">
          Black, white, and green pepper come from the same berry. Which one it becomes is decided in the
          first forty-eight hours after the pick — by how ripe the corn was when it left the vine, and by
          what Aura does with it next.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Black · sun-dried">
            Picked just before full ripeness and dried whole in the sun until the skin wrinkles dark
            around the corn. The heat is forward, the aromatics at their sharpest.
          </DataCard>
          <DataCard value="White · retted">
            Picked fully ripe and soaked in cool running water until the outer skin lifts away from the
            pale corn beneath. Heat with the top-note taken off — the pepper for a broth.
          </DataCard>
          <DataCard value="Green · fresh-kept">
            Picked young and held in brine or flash-frozen to keep the grassy, live character of the fresh
            drupe. The pepper closest to the vine.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Process · sun-drying"
        caption="Drupes on raised bamboo platforms, taking the first sun after the pick"
      />

      <TwoCol id="retting" heading="Retted, not rushed.">
        <p className="p1">
          Pepper is one of the estate&apos;s ferments, alongside the coffee and the cattle dung that feeds
          them both. Aura{' '}
          <Term tip="Soaking the ripe berry in water until its outer skin softens and lifts away, leaving the pale corn beneath. The step that makes white pepper.">rets</Term>{' '}
          its white pepper in spring water from the estate catchment, changed daily and run cooler than
          river retting — which is what brings it out round in the cup.
        </p>
        <p className="p2">
          The pepper and the coffee draw on the same biodynamic inputs, so the shed schedules one calendar
          around the other. One anaerobic lot is still young — a few sealed vessels, watched daily, coming
          out fruitier than a classic corn. Aura releases it when it earns release, and not before.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Picked by hand.
         Dried in the sun.
         Released by the season.`}
      </ScrollHighlight>

      <TwoCol id="quality" heading="Place as signature.">
        <p className="p1">
          The quality of the pepper is the quality of the ground it grew on. The Ghats terroir gives
          Malabar its signature — forward heat, a citrus top-note, and a pine-resin depth — and Aura grows
          toward that mark season by season.
        </p>
        <p className="p2">
          Every lot is labelled with the block it grew in, the month it was picked, and the palm the vine
          climbed. That record — kept the same way the coffee&apos;s is — is the whole appellation: the
          altitude, the laterite, the shade, and the microbiome of one strip of the Ghats, written down so
          a buyer can read it back.
        </p>
      </TwoCol>

      <PullQuote>
        Heat without a *shortcut*.
      </PullQuote>

      <OneCol id="close" heading="The vine outlives the year.">
        <p className="p1">
          A pepper vine crops for decades on the same palm, so Aura works it on a decade&apos;s horizon —
          feed the soil the vine roots into, hold the shade above it, and let the block deepen season after
          season. The oldest method in the Ghats, worked with modern measurement: Natural Intelligence,
          applied to a vine.
        </p>
        <p className="p2">
          Single-estate pepper, small-parcel trade, and chef partnerships:{' '}
          <a href="mailto:spice@theaura.life">spice@theaura.life</a>. Lots are small and released by the
          season. Aura does not blend across estates — every jar is from this land.
        </p>
      </OneCol>

      <Continue currentHref="/pepper" />
    </>
  )
}
