'use client'

/* ═══════════════════════════════════════════
   PROVENANCE — trade-facing.
   Blockchain, live sensors, verified events
   from cherry to cup. Replaces legacy
   certification (organic / biodynamic / fair trade).
═══════════════════════════════════════════ */

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
} from '@/components/article/Article'
import Reveal from '@/components/RevealOnScroll'

export default function ProvenancePage() {
  return (
    <div>
      <ArticleHero
        title={<>Cherry to cup. On chain.</>}
        subline="Every batch of soil prep, every ferment, every drying day, every shipment — signed, timestamped, and verifiable from the Mudigere estate. Native provenance. No paper trail to forge."
        toc={[
          { q: 'Why blockchain?', href: '#why-blockchain' },
          { q: 'What is verified?', href: '#what-verified' },
          { q: 'What do the sensors do?', href: '#sensors' },
          { q: 'How does Lot 005 read?', href: '#lot-005' },
          { q: 'How do buyers engage?', href: '#buyers' },
        ]}
      />

      {/* Why Blockchain */}
      {/* eyebrow was: "Why blockchain" */}
      <TwoCol
        id="why-blockchain"
        heading="Certification is paper."
      >
        <P>Organic, biodynamic, and fair-trade certification together cost roughly $40,000–$50,000 per estate and take about four years to complete. At the end of that, the buyer receives a stamp. Not the thing the stamp is meant to describe.</P>
        <P>Aura is building a different instrument. Every operation that matters to a lot — the Jeevamrit batch that drenched the block, the BD 500 horning that fed the pit, the Brix reading the morning the cherries came off, the hours in the ferment, the days in the sun, the weight into the bag — is written on chain at the moment it happens. By the person who did it. Signed.</P>
        <P>The buyer does not need a badge. They can read the lot.</P>
      </TwoCol>

      <PullQuote attribution="Arvind">
        Is this saying you are a more honest business? 100% — because of these technologies.
      </PullQuote>

      {/* What's verified */}
      {/* eyebrow was: "What is verified" */}
      <Section id="what-verified" heading="Six layers on the ledger.">
        <P>Nothing about the plant is decorative. Every action that changes flavour, life, or trust gets a signed event. Each one references the block, the worker, the weather, and the lot it belongs to.</P>
        <DataGrid cols={3}>
          <DataCard label="01 · Soil Preparation">
            Jeevamrit batches by volume and age. BD 500 hornings — grams, moon phase, stir time. Panchgavya and CPP log per block.
          </DataCard>
          <DataCard label="02 · Fermentation">
            Lot-level. Cherry Brix at intake, ferment vessel, hours sealed or washed, ambient and mass temperature, pH at decant.
          </DataCard>
          <DataCard label="03 · Drying">
            Days on raised beds. Moisture by sample. Weather every four hours — rain, wind, RH, surface temp.
          </DataCard>
          <DataCard label="04 · Milling">
            Hulling date, screen size, density sort, defect sort pass. Green weight in, green weight out.
          </DataCard>
          <DataCard label="05 · Packaging">
            Bag weight, GrainPro lot, vacuum status, QR generation, warehouse temperature.
          </DataCard>
          <DataCard label="06 · Shipping">
            Carrier, container, chain-of-custody handoffs. Arrival signed by the buyer&rsquo;s cupper.
          </DataCard>
        </DataGrid>
      </Section>

      {/* Live Sensors */}
      {/* eyebrow was: "Live sensors" */}
      <TwoCol
        id="sensors"
        heading="Fed by the land."
      >
        <P>Soil probes, ferment-tank loggers, drying-bed hygrometers, and a weather station at 3,600 feet write directly to the ledger. Human events — the stir, the spray, the decant — are signed from the field on a hardened tablet by the person doing the work.</P>
        <P>Data without wisdom is just faster noise. So the ledger does not replace the hand. It records it.</P>
      </TwoCol>

      <Placeholder label="Sensor map — Mudigere" note="Soil · ferment · drying bed · weather. Events streaming to chain." />

      {/* Example — Lot 005 */}
      {/* eyebrow was: "Example" */}
      <Section id="lot-005" heading="Lot 005 — a timeline.">
        <P>One lot. Every event written as it happened. What the buyer sees when they scan the bag.</P>
        <DataGrid cols={2}>
          <DataCard label="T-180d · Block prep">
            Jeevamrit drench, 180 L/acre. BD 500 horning stirred 1 hour, new moon. Signed by field lead.
          </DataCard>
          <DataCard label="T-7d · Maturity check">
            Brix sweep, Block 4. Average 25.4. Pick window opens.
          </DataCard>
          <DataCard label="Day 0 · Cherry in">
            480 kg. Brix 25–27. Float-sorted, weighed, lot opened on chain.
          </DataCard>
          <DataCard label="Day 0–4 · Solera maceration">
            96 h sealed. Temp logged every 15 min. Mother-ferment carry-forward from Lot 004.
          </DataCard>
          <DataCard label="Day 4–26 · Drying">
            22 days on raised beds. Moisture 11.2 % at close. Two monsoon events logged and withstood.
          </DataCard>
          <DataCard label="Day 60 · Resting, milling, bag">
            Resting in parchment. Hulled. Green yield logged. QR minted per bag. Buyer can read it all.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder label="Lot 005 timeline — scan-through UI" note="Every event signed. Sensor traces overlaid. Drillable from the QR on the bag." />

      {/* Stats */}
      <section style={{ padding: 'clamp(40px, 8vh, 80px) 0', borderTop: '1px solid var(--border)' }}>
        <div className="section-w">
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--grid-gap)' }}>
              <PullStat value="6" label="Micro lots · 2026" sub="Same cherry, six methods." />
              <PullStat value="100%" label="On-chain events" sub="From soil prep to bag." />
              <PullStat value="2026" label="Ledger live" sub="Every field and sensor event signed since the first lot opened." />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Certifications */}
      {/* eyebrow was: "Certifications held" */}
      <TwoCol
        id="certifications"
        heading="Fewer badges. More truth."
      >
        <P>We hold the certifications that serve the buyer, and replace the ones that do not with the chain itself.</P>
        <DataGrid cols={2}>
          <DataCard label="Coffee Board of India" value="Registered">
            Grower &amp; Curer · January 2026.
          </DataCard>
          <DataCard label="Specialty Coffee" value="Cupped, 2026">
            Independent cupping above the specialty threshold across the 2026 lots. Scores
            available on request.
          </DataCard>
        </DataGrid>
        <P>Organic, biodynamic, and fair-trade certification are <em>not</em> carried as badges. The practices are carried — BD 500–508, CPP, Jeevamrit, Panchgavya, Beejamrit — and each event is written to chain. The buyer sees the practice, not a sticker over it.</P>
      </TwoCol>

      {/* Partnerships */}
      {/* eyebrow was: "Partnerships" */}
      <Section id="partnerships" heading="Boojee · exclusive Arabica partner.">
        <P>Five of the six 2026 lots are committed to Boojee as the exclusive Arabica partner. The sixth stays at Aura for festival cuppings, the lab, and allocation to the residency kitchen.</P>
        <P>Trade enquiries for pepper, areca, and forward allocation of future crop years are welcome and handled directly.</P>
      </Section>

      <Placeholder label="QR on bag — field photo" note="Scan-to-lot on every 30 kg GrainPro bag." />

      {/* Buyer info */}
      {/* eyebrow was: "Buyers" */}
      <Section id="buyers" heading="Buy, ask, or audit.">
        <DataGrid cols={2}>
          <DataCard label="Coffee" value="coffee@theaura.life">
            Lot allocation, cupping scores, forward-contract enquiries, shipping terms.
          </DataCard>
          <DataCard label="Pepper &amp; Spice" value="spice@theaura.life">
            Malabar pepper, shade-grown, biodynamic. Small-parcel trade.
          </DataCard>
        </DataGrid>
      </Section>

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
