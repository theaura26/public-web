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
        title="Provenance"
        mediaType="image"
        caption="Aura grows coffee and pepper the way they ought to be grown, and writes the practice down as it happens — each event measured in the moment and signed by the hand that did it, so a lot can be read whole, from cherry to cup."
        alt="Aura provenance — cherry-to-cup verification from the Mudigere estate"
      />

      <TwoCol id="what-we-do" heading="We measure what we make.">
        <p className="p1">
          At Mudigere, Aura grows coffee and pepper, and grows them the way they ought to be grown —
          for the soil, the people, and the cup. That practice is the easy part to claim and the hard
          part to prove. So we write the estate down: every preparation, every ferment, every drying
          day, recorded the moment it happens, by the person who did it, and signed.
        </p>
        <p className="p1">
          We keep that record for two readers. The buyer, asked to trust a farm on the other side of
          the world. And ourselves, because a practice you measure is a practice you can make better.
          From cherry to cup, a lot carries its own account.
        </p>
      </TwoCol>

      <TwoCol id="senses" heading="The senses, kept honest.">
        <p className="p1">
          Coffee is judged by the human body — the nose held over a ferment, the tongue on a cupping
          spoon. Those senses are astonishingly fine and quietly biased at once. A ferment smells right
          on a good morning. A picker trusts the block that once pleased them. A taster wants the lot to
          be what they were hoping for.
        </p>
        <p className="p1">
          So we take the measurement while the sense is still forming — the sugar as it falls, the
          acidity as it rises, the temperature logged through the night. The number does not overrule
          the palate; it keeps it honest. This is the simplest form of doing right: read the thing as it
          happens, and write down what you read. The science serves the human hand. It does not sit
          above it.
        </p>
      </TwoCol>

      <TwoCol id="streams" heading="What the land writes down.">
        <p className="p1">
          Nothing on the plant is decorative. Nine streams of data run off the estate, each on its own
          clock — some every fifteen minutes, some once a quarter, some once a year. Together they are
          the estate&apos;s pulse, printed.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Fermentation">
            pH every fifteen minutes. Temperature three times a day.{' '}
            <Term tip="Dissolved sugar in a liquid, read on a refractometer. In a coffee ferment it falls as microbes turn sugar into acid — a direct read on how far the ferment has gone.">Brix</Term>{' '}
            at start, middle, and end. The most closely watched hours on the estate.
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

      <PullQuote attribution="Arvind">
        A ledger cannot forget, and it cannot flatter.
      </PullQuote>

      <TwoCol id="one-record" heading="One record, in full.">
        <p className="p1">
          A single biodynamic spray, as the record holds it: <em>BD 501 applied to Block 07 at 06:14,
          on a waning moon, humidity 78%, by Rao, from dung batch G-03.</em> That row — the minute, the
          moon, the hand, the source — is the unit the whole system is built to protect.
        </p>
        <p className="p1">
          Complexity sits in the machine; simplicity in the field. Soil probes, ferment-tank loggers,
          and a weather station at 3,600 feet write their readings on their own; every human act — the
          stir, the spray, the decant — is signed by name, from the field, by the person doing the work.
          The machine measures; the person testifies. The record keeps the number next to the hand that
          knew when to act, because data without judgment is only faster noise.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · field tablet"
        caption="A worker signing a spray event from the field — the human layer the record never replaces"
      />

      <ScrollHighlight>
        {`Every event signed.
         Every reading verifiable.
         The lot reads itself.`}
      </ScrollHighlight>

      <TwoCol id="reading" heading="What the buyer reads.">
        <p className="p1">
          The QR on every bag opens a single page: the block the cherry came from, the day it was
          picked, the method it survived, the bed it dried on, the hands that turned it. Everything
          timestamped. Everything signed. Nothing summarised by a third party.
        </p>
        <p className="p1">
          A buyer who wants to check a claim can drill into the underlying events. A buyer who only wants
          to brew the coffee can ignore all of it. That is what transparency is here: the page stands
          complete, whether or not anyone ever opens it.
        </p>
      </TwoCol>

      <Placeholder
        type="Detail · QR scan"
        caption="Every 30 kg GrainPro bag — scannable, and drillable down to the field"
      />

      <DataGrid cols={3} standalone>
        <DataCard value="15 min">The interval a fermenting lot&apos;s pH is read at, start to finish.</DataCard>
        <DataCard value="9 streams">Of estate data, each on its own clock — from every quarter-hour to once a year.</DataCard>
        <DataCard value="4–5×">Estimated carbon held per acre by the four-storey polyculture over monoculture coffee.</DataCard>
      </DataGrid>

      <OneCol id="close" heading="The record outlasts the sale.">
        <p className="p1">
          Every signed event is held in{' '}
          <Term tip="Open, human-readable file formats. A CSV is a plain table; JSON is plain structured text. Both open in any text editor, with no proprietary software.">plain JSON and CSV</Term>{' '}
          that opens in any text editor a decade from now, and its milestones are{' '}
          <Term tip="A shared, append-only public record. Entries can be added but never edited or deleted, so its history cannot be quietly rewritten.">written to chain</Term> —
          permanent, public, verifiable. If the database fails, the chain remains; if the chain ages
          out, the data still reads as plain text. The record is built to outlive the people who wrote
          it.
        </p>
        <p className="p1">
          That is the horizon Aura works on. A buyer — or their buyer — can still read this lot in ten
          years. And the transparency runs both ways: the account that shows them what we did shows us,
          in the same plain detail, where the next lot can be better. A practice you can read is a
          practice you can improve.
        </p>
        <p className="p1">
          Trade enquiries are handled directly — coffee and pepper both.
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
