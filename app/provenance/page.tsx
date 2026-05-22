'use client'

/* ═══════════════════════════════════════════
   PROVENANCE — trade-facing.
   Blockchain, live sensors, verified events
   from cherry to cup. Replaces legacy
   certification (organic / biodynamic / fair trade).
═══════════════════════════════════════════ */

import {
  JournalHero,
  TwoCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Continue,
} from '@/components/article/Article'

export default function ProvenancePage() {
  return (
    <div>
      {/* Editorial JournalHero pattern — was ArticleHero with subline
          + 5-question TOC. Both dropped in the coming-soon refactor. */}
      <JournalHero
        title="Cherry to cup. On chain."
        src="/aura-provenance.jpg"
        mediaType="image"
        caption="Native provenance — sensor-verified, timestamped, on chain"
        alt="Aura provenance — cherry-to-cup verification from the Mudigere estate"
      />

      {/* Why Blockchain */}
      {/* eyebrow was: "Why blockchain" */}
      <TwoCol
        id="why-blockchain"
        heading="Certification is paper."
      >
        <p className="p1">Organic, biodynamic, and fair-trade certification together cost roughly $40,000–$50,000 per estate and take about four years to complete. At the end of that, the buyer receives a stamp. Not the thing the stamp is meant to describe.</p>
        <p className="p2">Aura is building a different instrument. Every operation that matters to a lot — the Jeevamrit batch that drenched the block, the BD 500 horning that fed the pit, the Brix reading the morning the cherries came off, the hours in the ferment, the days in the sun, the weight into the bag — is written on chain at the moment it happens. By the person who did it. Signed.</p>
        <p className="p2">The buyer does not need a badge. They can read the lot.</p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        Is this saying you are a more honest business? 100% — because of these technologies.
      </PullQuote>

      {/* What's verified */}
      {/* eyebrow was: "What is verified" */}
      <TwoCol id="what-verified" heading="Six layers on the ledger.">
        <p className="p1">Nothing about the plant is decorative. Every action that changes flavour, life, or trust gets a signed event. Each one references the block, the worker, the weather, and the lot it belongs to.</p>
        <DataGrid cols={3}>
          <DataCard value="Soil Preparation">
            Jeevamrit batches by volume and age. BD 500 hornings — grams, moon phase, stir time. Panchgavya and CPP log per block.
          </DataCard>
          <DataCard value="Fermentation">
            Lot-level. Cherry Brix at intake, ferment vessel, hours sealed or washed, ambient and mass temperature, pH at decant.
          </DataCard>
          <DataCard value="Drying">
            Days on raised beds. Moisture by sample. Weather every four hours — rain, wind, RH, surface temp.
          </DataCard>
          <DataCard value="Milling">
            Hulling date, screen size, density sort, defect sort pass. Green weight in, green weight out.
          </DataCard>
          <DataCard value="Packaging">
            Bag weight, GrainPro lot, vacuum status, QR generation, warehouse temperature.
          </DataCard>
          <DataCard value="Shipping">
            Carrier, container, chain-of-custody handoffs. Arrival signed by the buyer&rsquo;s cupper.
          </DataCard>
        </DataGrid>
      </TwoCol>

      {/* Live Sensors */}
      {/* eyebrow was: "Live sensors" */}
      <TwoCol
        id="sensors"
        heading="Fed by the land."
      >
        <p className="p1">Soil probes, ferment-tank loggers, drying-bed hygrometers, and a weather station at 3,600 feet write directly to the ledger. Human events — the stir, the spray, the decant — are signed from the field on a hardened tablet by the person doing the work.</p>
        <p className="p2">Data without wisdom is just faster noise. So the ledger does not replace the hand. It records it.</p>
      </TwoCol>

      <Placeholder caption="Soil · ferment · drying bed · weather. Events streaming to chain." />

      {/* Example — Lot 005 */}
      {/* eyebrow was: "Example" */}
      <TwoCol id="lot-005" heading="Lot 005 — a timeline.">
        <p className="p1">One lot. Every event written as it happened. What the buyer sees when they scan the bag.</p>
        <DataGrid cols={2}>
          <DataCard value="T-180d · Block prep">
            Jeevamrit drench, 180 L/acre. BD 500 horning stirred 1 hour, new moon. Signed by field lead.
          </DataCard>
          <DataCard value="T-7d · Maturity check">
            Brix sweep, Block 4. Average 25.4. Pick window opens.
          </DataCard>
          <DataCard value="Day 0 · Cherry in">
            480 kg. Brix 25–27. Float-sorted, weighed, lot opened on chain.
          </DataCard>
          <DataCard value="Day 0–4 · Solera maceration">
            96 h sealed. Temp logged every 15 min. Mother-ferment carry-forward from Lot 004.
          </DataCard>
          <DataCard value="Day 4–26 · Drying">
            22 days on raised beds. Moisture 11.2 % at close. Two monsoon events logged and withstood.
          </DataCard>
          <DataCard value="Day 60 · Resting, milling, bag">
            Resting in parchment. Hulled. Green yield logged. QR minted per bag. Buyer can read it all.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder caption="Every event signed. Sensor traces overlaid. Drillable from the QR on the bag." />

      {/* Stats */}
      <DataGrid cols={3} standalone>
        <DataCard value="6">Micro lots · 2026. Same cherry, six methods.</DataCard>
        <DataCard value="100%">On-chain events. From soil prep to bag.</DataCard>
        <DataCard value="2026">Ledger live. Every field and sensor event signed since the first lot opened.</DataCard>
      </DataGrid>

      {/* Certifications */}
      {/* eyebrow was: "Certifications held" */}
      <TwoCol
        id="certifications"
        heading="Fewer badges. More truth."
      >
        <p className="p1">We hold the certifications that serve the buyer, and replace the ones that do not with the chain itself.</p>
        <DataGrid cols={2}>
          <DataCard value="Registered">
            Coffee Board of India — Grower &amp; Curer · January 2026.
          </DataCard>
          <DataCard value="Cupped, 2026">
            Specialty Coffee — independent cupping above the specialty threshold across the 2026 lots. Scores
            available on request.
          </DataCard>
        </DataGrid>
        <p className="p2">Organic, biodynamic, and fair-trade certification are <em>not</em> carried as badges. The practices are carried — BD 500–508, CPP, Jeevamrit, Panchgavya, Beejamrit — and each event is written to chain. The buyer sees the practice, not a sticker over it.</p>
      </TwoCol>

      {/* Partnerships */}
      {/* eyebrow was: "Partnerships" */}
      <TwoCol id="partnerships" heading="Boojee · exclusive Arabica partner.">
        <p className="p1">Five of the six 2026 lots are committed to Boojee as the exclusive Arabica partner. The sixth stays at Aura for festival cuppings, the lab, and allocation to the residency kitchen.</p>
        <p className="p2">Trade enquiries for pepper, areca, and forward allocation of future crop years are welcome and handled directly.</p>
      </TwoCol>

      <Placeholder caption="Scan-to-lot on every 30 kg GrainPro bag." />

      {/* Buyer info */}
      {/* eyebrow was: "Buyers" */}
      <TwoCol id="buyers" heading="Buy, ask, or audit.">
        <p className="p1">Two channels, two crops.</p>
        <DataGrid cols={2}>
          <DataCard value="coffee@theaura.life">
            Coffee — lot allocation, cupping scores, forward-contract enquiries, shipping terms.
          </DataCard>
          <DataCard value="spice@theaura.life">
            Pepper &amp; spice — Malabar pepper, shade-grown, biodynamic. Small-parcel trade.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>Native systems cannot be translated. They are made for you and no one else.</PullQuote>

      <Continue
        items={[
          { href: '/coffee', label: 'Coffee', description: 'Six lots, six methods. Same cherry.' },
          { href: '/fermentation', label: 'Fermentation', description: 'Where the timing on the ledger becomes taste in the cup.' },
          { href: '/land', label: 'The land', description: 'The lab the ledger reads from.' },
        ]}
      />
    </div>
  )
}
