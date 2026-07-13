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
        title="Malabar black gold."
        mediaType="image"
        caption="One vine, one palm — black pepper climbing the areca in the mid-canopy"
        alt="Aura pepper — Malabar black pepper climbing the areca trunks"
      />

      <TwoCol id="terroir" heading="One vine, one palm.">
        <p className="p1">
          <Term tip="The black-pepper vine, native to the Western Ghats of southern India. It is a climber — in the wild it grows up the trunk of a living tree, not a post.">Piper nigrum</Term> is
          a climber. In the Western Ghats it grows the way it has grown for two thousand years, trained
          up the trunk of a living tree. Ours climbs areca — one vine to one palm. What that partnership
          does for the areca is <em>The Sentinel Palm</em>&apos;s to tell. This page is what it does for
          the pepper: a living trellis in the mid-canopy, and a companion that shares its fate.
        </p>
        <p className="p2">
          The vines sit at <strong>3,600 ft</strong> on the same red laterite as the coffee, under the
          same four-story shade. The monsoon arrives in June and leaves in September; flowering follows
          the first rain; the pick runs through the dry months that follow, by hand, cluster by cluster.
        </p>
        <p className="p2">
          Malabar pepper has carried its coast&apos;s name for two thousand years of continuous trade —
          the heat, the citrus top-note, and the pine-resin depth that the Ghats terroir, and little
          else, produces. We grow inside that reputation, and intend to earn it season by season.
        </p>
        <DataGrid cols={4}>
          <DataCard value="Malabar">The oldest named pepper on the spice routes. A coast, a climate, a reputation.</DataCard>
          <DataCard value="Areca palm">The living trellis — one vine to one palm, trunk shared, fate shared.</DataCard>
          <DataCard value="3,600 ft">The coffee&apos;s elevation, the coffee&apos;s laterite, the coffee&apos;s shade.</DataCard>
          <DataCard value="By cluster">Picked by hand through the dry months, never stripped.</DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        The vine remembers every year.
      </PullQuote>

      <TwoCol id="processing" heading="Three drupes from one vine.">
        <p className="p1">
          Black, white, and green pepper are not three plants. They are three decisions, made in the
          first forty-eight hours after the pick. The same berry can take any of the three, depending on
          how ripe it was when it left the vine and what happens to it next.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Black · sun-dried">
            Picked just before full ripeness and dried whole in the sun, the skin wrinkling dark around
            the corn. The heat is forward; the aromatics are at their sharpest, before any ferment has
            rounded them off.
          </DataCard>
          <DataCard value="White · retted">
            Picked fully ripe, then soaked in cool running water until the outer skin softens and lifts
            away, leaving the pale corn beneath. Heat without the top-note — the pepper chefs reach for
            when they want the bite and not the smell.
          </DataCard>
          <DataCard value="Green · fresh-kept">
            Picked young and held in brine or flash-frozen to keep the grassy, sharply aromatic character
            of the live drupe. The kitchen pepper, closest to the vine.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Still life"
        caption="Three glass jars on dark linen — black, white, green. Same light, same scale."
      />

      <Placeholder
        type="Detail · texture"
        caption="Black, white, and green peppercorns, macro, side by side"
      />

      <TwoCol id="fermentation" heading="Retted, not rushed.">
        <p className="p1">
          Pepper is one of three fermentations on the estate — coffee, pepper, and the cattle dung that
          feeds them both. It keeps its own log. White pepper is retted in spring water from the estate
          catchment, changed daily; run cooler than river retting, it comes out rounder in the cup.
        </p>
        <p className="p2">
          Because pepper and coffee draw on the same biodynamic inputs, their calendars cannot collide —
          the shed schedules one around the other. The experimental anaerobic lot is young: a few sealed
          vessels, watched closely, coming out fruitier than a classic corn, closer to a dried berry. When
          it is worth releasing, it will be. Not before.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`One vine.
         Three drupes.
         A spice older than Rome.`}
      </ScrollHighlight>

      <Placeholder
        type="Process · sun-drying"
        caption="Drupes on raised bamboo platforms — the first sun after the pick"
      />

      <Placeholder
        type="Detail · anaerobic lot"
        caption="The experimental sealed lot — fermentation in progress, watched daily"
      />

      <TwoCol id="early-warning" heading="The palm tells you first.">
        <p className="p1">
          The pepper and the palm share more than a trunk; they share a bloodstream. When an areca column
          falls into stress, the vine climbing it loses vigour within <strong>six to eight weeks</strong>{' '}
          — but the palm shows it first. Read the column, and you have read the vine&apos;s next two months
          before the vine has.
        </p>
        <p className="p2">
          The window to act is roughly <strong>three weeks</strong>. Miss it, and the season on that
          column is already written. This is why the estate reads the areca as an instrument, not just a
          crop — an early-warning system that happens also to hold up the pepper.
        </p>
        <DataGrid cols={3}>
          <DataCard value="6–8 weeks">From an areca column&apos;s stress to the vine&apos;s loss of vigour.</DataCard>
          <DataCard value="~3 weeks">The window to intervene before the season is set.</DataCard>
          <DataCard value="One reading">Check the palm, and you have checked the vine.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="appellation" heading="Place as signature.">
        <p className="p1">
          Every lot is labelled with the block it grew in, the month it was picked, and the palm it
          climbed. That specificity is the whole appellation — not a cultivar name alone, but the
          altitude, the laterite, the shade, and the particular microbiome of this one strip of the
          Ghats, a terroir traders followed by ship and monsoon wind for a very long time before anyone
          drew a line around it.
        </p>
        <p className="p2">
          The vine remembers what the block gave it. The label just writes that memory down, and the
          record — kept the same way the coffee&apos;s is — lets a buyer read it back. Provenance is not a
          story we tell. It is the tag on the jar.
        </p>
      </TwoCol>

      <Placeholder
        type="Portrait · canopy"
        caption="Pepper drupes cascading down the rain-slick trunk of a mature areca palm"
      />

      <Placeholder
        type="Detail · label"
        caption="A jar's label — block, harvest month, and the palm the vine climbed"
      />

      <TwoCol id="kitchen" heading="Heat as a material.">
        <p className="p1">
          A peppercorn is not a finished thing; it is a starting point for a kitchen. The residency
          kitchen treats pepper the way a chef treats salt — three or four grinds, each from a different
          lot, each chosen for a different course. Grassy green at the start of the meal. Rounded white in
          the broth. Forward black at the end.
        </p>
        <p className="p2">
          Read this way, pepper is terroir, not a condiment. The vine remembers what the monsoon
          delivered, what the cattle returned to the soil, what the shade let through. The jar is the
          year, condensed.
        </p>
      </TwoCol>

      <PullQuote attribution="ನೋವಿಲ್ಲದೆ ಬೇಗೆ ಇಲ್ಲ.">
        Heat without shortcut.
      </PullQuote>

      <OneCol heading="Working with us.">
        <p className="p1">
          Single-estate pepper, small-parcel trade, and chef partnerships:{' '}
          <a href="mailto:spice@theaura.life">spice@theaura.life</a>
        </p>
        <p className="p2">
          Lots are small and released by the season — black, white, green, and the experimental anaerobic
          when it earns it. We do not blend across estates. Every jar is from this land.
        </p>
      </OneCol>

      <Continue currentHref="/pepper" />
    </>
  )
}
