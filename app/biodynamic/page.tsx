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
  Chapter,
  Rta,
} from '@/components/article/Article'

export default function BiodynamicPage() {
  return (
    <>
      <ArticleHero
        title="The farm as organism."
        subline="A PhD agronomist came to the estate and admitted she did not know coffee. She said only one thing: I only want to heal the land. We hired her the same afternoon. Biodynamic practice begins there — not with a certificate, but with a vow to the soil."
        toc={[
          { q: 'What is the principle?', href: '#principle' },
          { q: 'What are the preparations?', href: '#preparations' },
          { q: 'How is the calendar read?', href: '#calendar' },
          { q: 'Why the cow is central?', href: '#cow' },
          { q: 'How is timing handled?', href: '#timing' },
        ]}
      />

      <Placeholder
        label="Hero — dusk stirring of BD 500"
        note="A wooden barrel at the edge of the shed. Copper ladle. Vortex collapsing into chaos and back. Light low, gold, almost monsoon. 16:9."
      />

      {/* THE PRINCIPLE */}
      {/* eyebrow was: "The Principle" */}
      <TwoCol id="principle" heading="Closed loop, read by sky.">
        <P>
          Biodynamics treats the farm as a single living body. The herd is the heart. The forest is
          the lung. The compost pile is the liver. Nothing is imported that the land cannot make
          for itself, and nothing leaves that the land cannot afford to give up. The calendar is
          not agricultural, it is cosmic — root days, leaf days, flower days, fruit days, moved by
          the moon's passage through the zodiac.
        </P>
        <P>
          Rudolf Steiner gave the method its frame in 1924. Nine preparations, eight lectures, one
          insistent claim: that a field is an organism with its own digestion, sensitive to the
          same rhythms that move the tides. We practise it under the Western Ghats canopy, where
          the monsoon does half the work and the cows do the other half.
        </P>
        <P>
          The farm we inherited had been fed on urea for forty years. The biodynamic calendar is
          how we are teaching it to eat again.
        </P>
      </TwoCol>

      <PullStat value="9" label="Preparations on the calendar" sub="BD 500 through 508, plus the Cow Pat Pit" />

      {/* BD 500-508 */}
      {/* eyebrow was: "The Preparations" */}
      <Section
        id="preparations"
        heading="BD 500–508, Cow Pat Pit."
      >
        <P>
          Every preparation is made on site, from this land's own cattle, plants, and minerals.
          None of it is bought. The horns come from the herd that lived here; the dung from the
          animals grazing outside the shed; the yarrow and chamomile from the kitchen garden. The
          discipline is patient and exact.
        </P>

        <DataGrid cols={3}>
          <DataCard label="BD 500 — Horn Manure" value="Field spray · soil">
            Cow dung packed into a cow's horn, buried 6 months through the winter. Stirred one
            hour in lukewarm water at dusk, sprayed on the soil before dew. Ferment: 6 months
            underground.
          </DataCard>
          <DataCard label="BD 501 — Horn Silica" value="Field spray · light">
            Ground quartz packed into a horn, buried through the summer. Stirred and sprayed at
            sunrise. Works on light and form, not substance. Ferment: 6 months underground.
          </DataCard>
          <DataCard label="BD 502 — Yarrow" value="Compost preparation">
            Yarrow flowers fermented inside a stag's bladder, hung in summer, buried in winter.
            Opens the compost to potassium and sulphur. One pinch per heap.
          </DataCard>
          <DataCard label="BD 503 — Chamomile" value="Compost preparation">
            Chamomile flowers fermented in cow intestine, buried through winter. Stabilises
            nitrogen. Keeps the pile from burning through its own fertility.
          </DataCard>
          <DataCard label="BD 504 — Stinging Nettle" value="Compost preparation">
            Nettle buried directly in the earth for a full year, wrapped in peat. Reads as the
            pile's nervous system — iron and sensitivity.
          </DataCard>
          <DataCard label="BD 505 — Oak Bark" value="Compost preparation">
            Crushed oak bark fermented in the skull of a domestic animal, submerged in running
            water. Calcium carrier. Disease resistance.
          </DataCard>
          <DataCard label="BD 506 — Dandelion" value="Compost preparation">
            Dandelion flowers fermented in cow mesentery, buried through winter. Opens the pile to
            silica and the cosmic influence of the wider environment.
          </DataCard>
          <DataCard label="BD 507 — Valerian" value="Compost spray">
            Valerian flower juice. Sprayed over the finished compost. The warming mantle —
            phosphorus carrier.
          </DataCard>
          <DataCard label="BD 508 — Horsetail" value="Field spray · fungal">
            Equisetum decoction. Sprayed as a tea against fungal pressure in humid monsoon weeks.
            Silica, again — structure and light.
          </DataCard>
          <DataCard label="CPP — Cow Pat Pit" value="Activator">
            Fresh cow dung mixed with eggshell and basalt, fermented in a shallow pit with all six
            compost preparations inside. Ferment: {`{confirm: 90}`} days. The bridging
            preparation — carries the whole set into a single spray.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Horn being packed and buried"
        note="Hands packing dung into a clean cow horn; a second frame of the horn going into the pit, autumn equinox light."
        aspect="3 / 2"
      />

      <PullQuote attribution="The biodynamic agronomist">
        I only want to heal the land.
      </PullQuote>

      {/* LUNAR CALENDAR */}
      {/* eyebrow was: "RTA in Practice" */}
      <Section
        id="calendar"
        heading="Root, leaf, flower, fruit."
      >
        <P>
          The Maria Thun calendar divides the month into four elemental windows. We do not sow, we
          do not spray, we do not transplant against the sky. A drench on the wrong day is not
          neutral — it is noise. The calendar is not superstition; it is a century of observation
          distilled into a chart on the shed wall.
        </P>

        <DataGrid cols={4}>
          <DataCard label="Root days" value="Earth trigon">
            Moon in Taurus, Virgo, Capricorn. Work below the line — sowing root crops, applying
            BD 500, turning compost into the soil.
          </DataCard>
          <DataCard label="Leaf days" value="Water trigon">
            Moon in Cancer, Scorpio, Pisces. Work on the greens — cover crops, mulching, foliar
            drenches for leafy growth.
          </DataCard>
          <DataCard label="Flower days" value="Air trigon">
            Moon in Gemini, Libra, Aquarius. Work on what must bloom — coffee at flowering, pepper
            at spike, BD 501 for light.
          </DataCard>
          <DataCard label="Fruit days" value="Fire trigon">
            Moon in Aries, Leo, Sagittarius. Work on what must ripen — harvest, pruning, cherry
            picking, final horn-silica passes.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Lunar chart on the shed wall"
        note="Hand-drawn calendar in chalk and ink, pinned above the preparations bench. Four colours for the four trigons."
        aspect="4 / 5"
      />

      {/* MALNAD GIDDA */}
      {/* eyebrow was: "Living Systems" */}
      <TwoCol id="cow" heading="The cow is its heart.">
        <P>
          Biodynamics without an indigenous herd is a paper exercise. We keep 43 Malnad Gidda — a
          small, hardy cattle native to the Western Ghats, adapted to the laterite soils and the
          monsoon. Their dung is denser, their urine sharper, their milk lower-yield and
          higher-value. Every horn we use was theirs. Every preparation carries their memory.
        </P>
        <P>
          They graze the understory, fertilise as they move, and return to the shed at dusk. No
          antibiotics. No artificial insemination. The bull earns his keep. This is not
          romanticism — it is the only way the closed loop closes.
        </P>
      </TwoCol>

      <PullStat value="43" label="Malnad Gidda cattle" sub="Indigenous Karnataka breed — the dung, the urine, the horns, the calendar" />

      <Placeholder
        label="Malnad Gidda portrait"
        note="Head-and-shoulders of a lead cow at dawn, mist in the background. Soft focus on the horn."
        aspect="4 / 5"
      />

      {/* RTA IN PRACTICE */}
      {/* eyebrow was: "Timing" */}
      <Section
        id="timing"
        heading="Stirred at dusk."
      >
        <P>
          The day of a BD 500 application begins with the calendar and ends with the sky. One hour
          of stirring — vortex one way, chaos, vortex the other — for fifty litres of water. A
          handful of preparation. Copper vessel. Wooden paddle. The spray leaves the cart as the
          first dew settles. By sunrise the field has taken it in.
        </P>
        <P>
          This is <Rta /> made physical. Right time, right action, no force. You cannot rush a
          biodynamic preparation any more than you can rush a ferment or a monsoon. You learn to
          wait for the window the land is already offering.
        </P>
      </Section>

      <Couplet en="The soil is older than the crop." local="ಬೆಳೆಗಿಂತ ಮಣ್ಣು ಹಳೆಯದು." localLang="kn" />

      <PullQuote attribution="Field-shed manifesto">
        The farm is an organism. The cow is its heart.
      </PullQuote>

      {/* number was: "Closing" */}
      <Chapter number="" title="Build the land, not the brand." />
      <P>
        Biodynamic certification exists. We will take it when it comes. But the point was never the
        badge. The point is that the land, which was ill, is becoming well. The canopy is thicker.
        The birds have come back. The Malnad Gidda calves are born without intervention. The
        biodynamic agronomist who did not know coffee is now training the next two. She still only
        wants to heal the land.
      </P>

      <Placeholder
        label="Preparations bench at dusk"
        note="Nine labelled jars on a rough wooden shelf, soft tungsten light, faint steam from a copper bowl. Wide still-life."
        aspect="16 / 9"
      />

      <Continue
        items={[
          {
            href: '/vedic',
            label: 'Vedic Farming',
            description: 'The ancestral layer beneath Steiner — Vrikshayurveda in practice.',
          },
          {
            href: '/living-systems',
            label: 'Living Systems',
            description: '43 Malnad Gidda. The heart of the closed loop.',
          },
          {
            href: '/rta',
            label: 'RTA',
            description: 'Right time, right action. The timing frame behind every spray.',
          },
        ]}
      />
    </>
  )
}
