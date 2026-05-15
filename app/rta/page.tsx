import {
  HeroBanner,
  OneCol,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
  ScrollHighlight,
  Rta,
  Term,
} from '@/components/article/Article'

export default function RtaPage() {
  return (
    <>
      <HeroBanner
        currentHref="/rta"
        title="Rta"
        type="Ritual · prayer and incense at dusk"
        caption="Ritual timing — the estate at dusk"
      />

      <TwoCol heading="Right time. Right action. Everything else is noise.">
        <p className="p1">
          <Rta /> is a Sanskrit word. It means natural order — the rhythm that
          governs seasons, tides, germination, decay, and renewal.
        </p>
        <p className="p2">
          It predates organised religion. It is not mysticism. It is
          observation: the world works on timing, and intelligence is alignment
          with that timing, not control over it.
        </p>
        <p className="p2">
          At Aura, <Rta /> is not a philosophy posted on a wall. It is the
          operating system.
        </p>
      </TwoCol>

      <PullQuote>
        Intelligence is alignment with timing.
      </PullQuote>

      <TwoCol id="field" heading="In the field.">
        <p className="p1">
          <Term tip="Horn manure. Cow dung packed in a cow horn, buried over winter, applied to soil at dusk.">BD 500</Term> — horn manure — is applied at dusk, when the earth is inhaling.
          This is not poetry. Evening application allows the preparation to
          work with the soil&rsquo;s natural absorption cycle.
        </p>
        <p className="p2">
          Every BD application is timestamped to the minute, tagged with the
          lunar calendar day, the weather at the moment of spraying, the field
          worker who applied it, the dung batch it came from.
        </p>
        <p className="p2">
          A spray logged at 06:12 carries more integrity than a weekly report
          written on Friday. The data does not say &ldquo;we sprayed this
          week.&rdquo; It says &ldquo;<Term tip="Horn silica. Ground quartz buried over summer, sprayed as fine mist for light metabolism.">BD 501</Term> was applied to Block 07 at 06:14 on
          a waning moon, humidity 78%, by Raju, using dung batch G-03.&rdquo;
        </p>
        <DataGrid cols={3}>
          <DataCard value="Timestamp.">To the minute.</DataCard>
          <DataCard value="Lunar calendar.">Day and phase.</DataCard>
          <DataCard value="Weather.">At moment of spray.</DataCard>
          <DataCard value="Field worker.">Named.</DataCard>
          <DataCard value="Dung batch.">Source ID.</DataCard>
          <DataCard value="Buffer days.">Three per monthly schedule.</DataCard>
        </DataGrid>
        <p className="p2">
          Three buffer days are built into every monthly spray schedule —
          because the land does not operate on a spreadsheet timeline.
        </p>
      </TwoCol>

      <TwoCol id="fermentation" heading="In fermentation.">
        <p className="p1">
          Lot 001 was sealed at 48 hours because the pH reached 4.2. Not
          because 48 hours was the plan. The cherry told us when.
        </p>
        <p className="p2">
          Lot 005 — the Solera Maceration — alternates between fermentation and
          rest in two-day cycles. The rhythm is not arbitrary. It follows
          temperature and microbial activity, reading the process in real time.
        </p>
        <p className="p2">
          Drying follows a day-night rhythm: raised beds by day, breathable
          bags by night. The bean is not forced. It is accompanied.
        </p>
      </TwoCol>

      <Placeholder
        type="Silhouette · worker climbing tree at dusk"
        caption="Patience — the right time, not the convenient time"
      />

      <TwoCol id="herd" heading="In the herd.">
        <p className="p1">
          Fifty-two <Term tip="Indigenous Karnataka cattle breed adapted to the Western Ghats over centuries.">Malnad Gidda</Term> cattle rotate through blocks timed to coffee
          cherry development stages. The cattle enrich soil biology for the
          next season — but only if they are in the right block at the right
          time.
        </p>
        <p className="p2">
          Too early, and the soil is compacted before root growth. Too late,
          and the biological window closes.
        </p>
      </TwoCol>

      <TwoCol id="restraint" heading="In restraint.">
        <p className="p1">
          <Rta /> is as much about what you do not do. Restraint before
          intervention. Patience before process.
        </p>
        <p className="p2">
          When the land signals that it is not ready — a soil that has not
          recovered, a canopy that has not leafed out, a preparation that has
          not matured — the answer is to wait. Not to push.
        </p>
        <p className="p2">
          The seven decision filters that govern every action at Aura all point
          to the same principle: is this the right time? Can the team execute
          it simply? Will it age well?
        </p>
      </TwoCol>

      <PullQuote attribution="Aura · Ṛta">
        Right time. Right action. The philosophy made technical.
      </PullQuote>

      <TwoCol id="labs" heading="RTA Labs.">
        <p className="p1">
          By 2031, Aura will hold five-plus years of four-layer polyculture data
          — a dataset no one else has, because no one else is recording all
          four canopy stories simultaneously with biodynamic inputs, cattle
          rotation, and fermentation outcomes across a single estate.
        </p>
        <p className="p2">
          RTA Labs is where this data becomes intelligence. Not a generic
          agriculture model. A Mudigere-native model trained on this land&rsquo;s
          specific rhythms.
        </p>
        <DataGrid cols={3}>
          <DataCard value="BD spray timing.">
            Weather, lunar phase, and soil signals combined.
          </DataCard>
          <DataCard value="Fermentation prediction.">
            Cup outcome forecast from canopy and soil inputs.
          </DataCard>
          <DataCard value="Yield forecasting.">
            Weeks ahead, per block.
          </DataCard>
          <DataCard value="Intervention alerts.">
            Before the problem is visible.
          </DataCard>
          <DataCard value="Training data.">
            5+ years of four-layer polyculture.
          </DataCard>
          <DataCard value="Edge first.">
            On-site, never to the cloud.
          </DataCard>
        </DataGrid>
        <p className="p2">
          The intelligence cannot be replicated anywhere else. It requires the
          data. The data requires the land. The land requires the practice.
          The practice requires the patience.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Right time.
         Right action.
         The land decides when it is ready.
         Intelligence is alignment with timing.`}
      </ScrollHighlight>

      <OneCol id="closing" heading="The land decides when it is ready.">
        <p className="p1">
          BD application at dusk. Fermentation closed by pH, not by hour. Cattle
          rotated by cherry stage. Each is the same observation in a different
          register: the work waits on the land, and the land is right more
          often than we are.
        </p>
      </OneCol>

      <Continue currentHref="/rta" />
    </>
  )
}
