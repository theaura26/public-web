'use client'

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

export default function ProvenancePage() {
  return (
    <>
      <JournalHero
        currentHref="/provenance"
        title="Cherry to cup. On chain."
        mediaType="image"
        caption="Every event signed at the moment it happened — by the hand that did it"
        alt="Aura provenance — cherry-to-cup verification from the Mudigere estate"
      />

      <TwoCol id="why-blockchain" heading="Certification is paper.">
        <p className="p1">
          Organic, biodynamic, and fair-trade certification together cost an estate tens of thousands
          of dollars and years of waiting. At the end of it, the buyer receives a stamp — not the thing
          the stamp is supposed to describe. The audit happened once, a year ago, and you are asked to
          trust the memory of it.
        </p>
        <p className="p2">
          Aura is building a different instrument. The preparations that go into a lot, the ferments it
          survives, the weather it dries through, the hands that turn it — each is written the moment it
          happens, by the person who did it, and signed. The buyer does not need a badge. They can read
          the lot.
        </p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        A ledger cannot forget, and it cannot flatter.
      </PullQuote>

      <TwoCol id="architecture" heading="Two tiers, one truth.">
        <p className="p1">
          The system has two floors. Downstairs, in the farm&apos;s own database, sits the granular
          record — every sensor reading, every field action, every preparation — held in{' '}
          <Term tip="Open, human-readable file formats. A CSV is a plain table; JSON is plain structured text. Both open in any text editor, with no proprietary software.">plain JSON and CSV</Term>,
          readable in any text editor a decade from now. Upstairs, the milestones go on chain: a lot
          completed, a biodynamic cycle closed, a season&apos;s carbon baseline set. Permanent. Public.
          Verifiable.
        </p>
        <p className="p2">
          The split is deliberate. If the database disappears tomorrow, the chain record remains. If the
          chain itself becomes obsolete, the data still exports as plain text. Neither floor depends on
          the other surviving — which is the only way a record meant to outlive its authors actually
          can.
        </p>
      </TwoCol>

      <TwoCol id="streams" heading="What the land writes down.">
        <p className="p1">
          Nothing about the plant is decorative. Nine streams of data run off the estate, each on its
          own clock — some every fifteen minutes, some once a quarter, some once a year. Together they
          are the estate&apos;s heartbeat, printed.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Fermentation">
            pH every fifteen minutes. Temperature three times a day. Brix at start, middle, and end. The
            most closely watched hours on the estate.
          </DataCard>
          <DataCard value="Biodynamic">
            Every preparation — the crop layer, the blocks, the lunar day, the weather at the moment of
            spray, the worker who carried it.
          </DataCard>
          <DataCard value="Soil">
            pH and moisture at five and twenty centimetres, read each quarter. Shallow and deep, because
            they tell different stories.
          </DataCard>
          <DataCard value="Canopy">
            <Term tip="Normalized Difference Vegetation Index — a satellite or drone measure of how much live, photosynthesising leaf a patch of land is carrying.">NDVI</Term> per
            block, quarterly. The forest&apos;s vigour, measured from above.
          </DataCard>
          <DataCard value="Cattle &amp; dung">
            The herd&apos;s rotation, and each dung batch traced to the animals that gave it — the first
            link in every preparation.
          </DataCard>
          <DataCard value="Understorey">
            Pepper and areca column health; the bees — hive weight, yield, honey harvest. The ground
            floor of the polyculture.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="one-record" heading="One record, in full.">
        <p className="p1">
          A single biodynamic spray, as the ledger holds it: <em>BD 501 applied to Block 07 at 06:14,
          on a waning moon, humidity 78%, by Raju, from dung batch G-03.</em> Not &ldquo;sprayed this
          week.&rdquo; Not &ldquo;applied as scheduled.&rdquo; That row — the minute, the moon, the
          hand, the source — is the unit the whole system is built to protect.
        </p>
        <p className="p2">
          A spray logged at 06:14 carries more integrity than a weekly report written on Friday from
          memory. Complexity in the machine; simplicity in the field. The worker signs one line and
          moves on. The chain does the remembering.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · field tablet"
        caption="A worker signing a spray event from the field — the human layer the ledger never replaces"
      />

      <Placeholder
        type="Detail · sensor"
        caption="A soil probe at 3,600 feet, writing pH and moisture straight to the record"
      />

      <TwoCol id="sensors" heading="Fed by the land, signed by the hand.">
        <p className="p1">
          Soil probes, ferment-tank loggers, drying-bed hygrometers, and a weather station at 3,600
          feet write to the record on their own. But every human event — the stir, the spray, the
          decant — is signed from the field, by name, by the person doing the work. The machine
          measures. The person testifies.
        </p>
        <p className="p2">
          Data without wisdom is only faster noise. So the ledger does not replace the hand that knows
          when a ferment smells right. It records it, and holds it next to the number.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Every event signed.
         Every reading verifiable.
         The lot reads itself.`}
      </ScrollHighlight>

      <TwoCol id="disputes" heading="What happens when a sensor is wrong.">
        <p className="p1">
          Sensors fail. A hygrometer drifts, a probe loses calibration, a tablet drops signal mid-shift.
          When a reading looks impossible, it is flagged — not silently corrected. The original event
          stays on the record, timestamped as disputed, beside the field worker&apos;s manual override
          and the reason for it.
        </p>
        <p className="p2">
          A ledger that quietly edits its own history is not a ledger; it is a story with extra steps.
          Ours keeps the error in view. Trust comes from what a record does with its mistakes, not from
          pretending it never had any.
        </p>
      </TwoCol>

      <TwoCol id="reading" heading="What the buyer reads.">
        <p className="p1">
          The QR on the bag opens a single page. It shows the block the cherry came from, the day it was
          picked, the method it survived, the bed it dried on, the hands that turned it. Everything
          timestamped. Everything signed. Nothing summarised by a third party.
        </p>
        <p className="p2">
          A buyer who wants to audit a claim can drill into the underlying events. A buyer who only wants
          to brew the coffee can ignore the chain entirely. The chain&apos;s job is not to be read. It is
          to be readable.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · QR scan"
        caption="Every 30 kg GrainPro bag — scannable, drillable to the field"
      />

      <Placeholder
        type="Detail · buyer view"
        caption="The page a scanned QR opens — block, date, method, hands, all timestamped"
      />

      <DataGrid cols={3} standalone>
        <DataCard value="15 min">The interval a fermenting lot&apos;s pH is read at, start to finish.</DataCard>
        <DataCard value="9 streams">Of estate data, each on its own clock — from every quarter-hour to once a year.</DataCard>
        <DataCard value="3–5×">Estimated carbon held per acre by the four-story polyculture versus monoculture coffee.</DataCard>
      </DataGrid>

      <TwoCol id="certifications" heading="Fewer badges. More truth.">
        <p className="p1">
          We hold the certifications that serve the buyer, and replace the ones that do not with the
          record itself. The estate is registered with the <strong>Coffee Board of India</strong>, and
          every lot is cupped against the specialty threshold — 80-plus on the SCA scale — with on-site
          Q-grading planned by the estate&apos;s third year.
        </p>
        <p className="p2">
          Organic, biodynamic, and fair-trade we do <em>not</em> carry as badges. We carry the practice
          — and write each event to chain. A buyer sees the spray, the stir, the moon, and the hand, not
          a sticker placed over them. It is not certification theatre. It is the practice, recorded with
          integrity, made permanent.
        </p>
      </TwoCol>

      <TwoCol id="boojee" heading="Loved in Mumbai.">
        <p className="p1">
          Lot 003 — <em>Red Honey</em>, pulped with the mucilage left on to oxidise — went onto the bar
          at <strong>Boojee, Mumbai</strong>, which renamed it <em>Liquid Gold</em>. It was the first lot
          from Aura to be given a name by someone other than the people who grew it.
        </p>
        <p className="p2">
          That is the whole loop, closed: a decision made during fermentation at 3,600 feet, traceable on
          the record, tasted in a glass hundreds of miles away, and named for what it turned out to be.
          Trade enquiries — coffee, pepper, forward allocation — are handled directly.
        </p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        The unit of record is the land, not the product.
      </PullQuote>

      <TwoCol id="permanence" heading="The ledger outlasts the sale.">
        <p className="p1">
          A certificate expires. A cupping score is one season&apos;s opinion. The record does neither —
          every signed event from this estate stays queryable for as long as the chain does, whether or
          not that lot is ever sold again.
        </p>
        <p className="p2">
          That is the actual trade. Not a claim about this year&apos;s cup, but a permanent record a
          buyer — or their buyer — can still read in ten years.
        </p>
      </TwoCol>

      <OneCol heading="Buy, ask, or audit.">
        <p className="p1">
          Two channels, two crops.
        </p>
        <DataGrid cols={2}>
          <DataCard value="coffee@theaura.life">
            Coffee — lot allocation, cupping scores, forward-contract enquiries, shipping terms.
          </DataCard>
          <DataCard value="spice@theaura.life">
            Pepper &amp; spice — Malabar pepper, shade-grown, biodynamic. Small-parcel trade.
          </DataCard>
        </DataGrid>
      </OneCol>

      <Continue currentHref="/provenance" />
    </>
  )
}
