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

export default function JournalPage() {
  return (
    <>
      <ArticleHero
        title="Every day, verified."
        subline="A live field journal from Mudigere, Ohara, and Munduk. Short entries, long memory. Each one signed on-chain the day it is written."
        toc={[
          { q: 'What is this feed?', href: '#what' },
          { q: 'How is each entry signed?', href: '#signing' },
          { q: 'How do I filter the feed?', href: '#filters' },
          { q: 'What are the recent entries?', href: '#recent' },
        ]}
      />

      <Placeholder
        label="Hero — handwritten field note on the shed bench"
        note="A page of graphite in a weatherworn notebook. BD 500, brix reading, a small sketch."
      />

      {/* WHAT THIS IS */}
      {/* eyebrow was: "What this is" */}
      <TwoCol id="what" heading="Field reports, not posts.">
        <P>
          The Journal is the farm thinking out loud. Fermentation logs from the shed. Garden
          observations from Ohara. Weather readings from the ridge. A pepper vine flowering out
          of season. A hive that has moved by twelve centimetres in a week. We write the entries
          in the same voice the shepherd uses &mdash; short, specific, unembellished.
        </P>
        <P>
          Every entry is signed on-chain the day it is written. The hash, the author, the
          location, the timestamp. No retroactive editing, no reconstructed provenance. The log
          is the document of record for the estate.
        </P>
      </TwoCol>

      {/* SIGNING */}
      {/* eyebrow was: "001" */}
      <Section id="signing" heading="Each entry is signed">
        <P>
          We treat the field journal the way a laboratory treats a notebook. The page is the
          evidence. To make the page trustworthy at a distance &mdash; in Tokyo, in Oslo, in a
          buyer&apos;s inbox &mdash; we sign each entry on chain. Author. Property. Block.
          Timestamp. Hash.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Signed By" value="Author + Aura">
            The person in the field and the estate root key. Two signatures per entry.
          </DataCard>
          <DataCard label="Network" value="{confirm: Base}">
            Low-cost, low-latency chain. One transaction per entry.
          </DataCard>
          <DataCard label="Editability" value="Append only">
            Corrections are written as new entries. The original remains.
          </DataCard>
        </DataGrid>
      </Section>

      {/* FILTERS */}
      {/* eyebrow was: "002" */}
      <Section id="filters" heading="Filter the feed">
        <P>
          The same feed, sliced three ways.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Location">
            Mudigere · Ohara · Munduk. Soon Daylesford.
          </DataCard>
          <DataCard label="Type">
            Field · Ferment · Garden · Weather · Labs.
          </DataCard>
          <DataCard label="Verification">
            Signed · Pending · Countersigned by partner.
          </DataCard>
        </DataGrid>
      </Section>

      {/* RECENT ENTRIES */}
      {/* eyebrow was: "003" */}
      <Section id="recent" heading="Recent entries">
        <P>
          A sample of the week, in the voice we keep.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Mudigere · Field · Signed" value="BD 500, dusk">
            Stirred at dusk. Vortex clockwise thirty minutes, counter thirty minutes. Water still
            warm from the afternoon. Applied across blocks 2 and 4 before moonrise.
          </DataCard>
          <DataCard label="Mudigere · Ferment · Signed" value="Lot 005 · Day 3">
            Solera carry-forward. pH 4.2. Brix stabilising at 14.8. Surface calm, aroma green-
            apple forward. Hold another 36 hours, re-check at dawn.
          </DataCard>
          <DataCard label="Mudigere · Field · Signed" value="First pepper flower">
            First pepper flower of the year, north block, vine 17. Eight days earlier than last
            season. Canopy shade tightened since last February &mdash; likely the reason.
          </DataCard>
          <DataCard label="Ohara · Garden · Signed" value="Purple shiso sowing">
            Purple shiso sowing today. Seed saved from last year&apos;s strongest plants, east bed.
            Soil temperature fourteen degrees. Row cover on overnight until first true leaves.
          </DataCard>
          <DataCard label="Mudigere · Weather · Signed" value="Garden morning light · 47 mm">
            Forty-seven millimetres rain overnight. Ground saturated in the lower blocks, drainage
            running clean in the upper. Morning light at 6:42, first birds at 6:38.
          </DataCard>
          <DataCard label="Ohara · Labs · Signed" value="Teahouse roof · pass 3">
            Teahouse roof tiles: third pass, west face complete. Twelve replaced, four reset. Two
            more full days for the east face if the weather holds.
          </DataCard>
        </DataGrid>
      </Section>

      <Placeholder
        label="Weather station in morning fog"
        note="A small tripod sensor array at the ridge, barely visible through the cloud. 6:40 am."
      />
      <Placeholder
        label="Fermentation log card"
        note="Lot 005 card: Day 3. pH, brix, temperature, notes. Monospace, hand-annotated."
      />
      <Placeholder
        label="Blockchain transaction UI"
        note="The on-chain receipt for a single entry: hash, signers, block, timestamp."
      />

      {/* AESTHETIC NOTE */}
      {/* eyebrow was: "004" */}
      <Section heading="Field-journal aesthetic">
        <P>
          Informal but data-rich. Specific before expressive. No adjectives where a number will
          do. We prefer &ldquo;47 mm overnight&rdquo; to &ldquo;a heavy rain.&rdquo; We prefer
          &ldquo;pH 4.2&rdquo; to &ldquo;acid forward.&rdquo; Where poetry belongs &mdash; first
          bloom, first bird, first frost &mdash; we let it in, once, and move on.
        </P>
      </Section>

      <PullQuote attribution="Aura field note">The log is the truth.</PullQuote>

      <PullStat value="1,000 yr" label="horizon" sub="the feed is written for the archive" />
      <PullStat value={<>{`{confirm}`}</>} label="entries this month" sub="across three properties" />
      <PullStat value="100%" label="on-chain" sub="every entry signed the day it is written" />

      <Continue
        items={[
          {
            href: '/plantation',
            label: 'Plantation',
            description: 'Where most of the entries are written.',
          },
          {
            href: '/labs',
            label: 'Labs & Hardware',
            description: 'The sensors, chain, and memory behind each entry.',
          },
          {
            href: '/provenance',
            label: 'Provenance',
            description: 'How the log becomes the badge.',
          },
        ]}
      />
    </>
  )
}
