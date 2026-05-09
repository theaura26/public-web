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
  Couplet,
  Continue,
} from '@/components/article/Article'

export default function SpacesPage() {
  return (
    <>
      <ArticleHero
        title="Place, not programme."
        subline="Four spaces in Ohara. Twelve worlds in Mudigere. Studios for makers in residence. Every room is built around a time of day and a body in it."
        toc={[
          { q: 'What is the daily rhythm?', href: '#rhythm' },
          { q: 'What are the Ohara spaces?', href: '#ohara' },
          { q: 'What are the twelve worlds?', href: '#mudigere' },
          { q: 'What studios are held?', href: '#studios' },
          { q: 'How are things phased?', href: '#shu-ha-ri' },
        ]}
      />

      <Placeholder
        label="Hero — Ki no Ie riverside pavilion at dusk"
        note="Wood, paper, water, lantern light. Long exposure. The river audible but unseen."
      />

      {/* PHILOSOPHY */}
      {/* eyebrow was: "Philosophy" */}
      <TwoCol heading="Rhythm, not routine.">
        <P>
          A space is a time of day with a roof. Morning wants a different ceiling than evening.
          Work wants a different floor than rest. Aura&apos;s spaces are designed the way a day is
          designed &mdash; in windows, not slots. Asa for morning, Niwa for evening. Ki no Ie for
          the turning of a season. Kaze no Ma for the pause between two breaths.
        </P>
        <P>
          We do not run a programme. We hold a rhythm. Guests, residents, and locals fold into the
          rhythm for as long as they are with us, and the rhythm remains when they leave.
        </P>
      </TwoCol>

      <Couplet en="A rich and mindful life." local="豊かな暮らし" localLang="ja" />

      {/* DAILY RHYTHM */}
      {/* eyebrow was: "001" */}
      <Section id="rhythm" heading="Daily rhythm">
        <P>
          Four windows, four rooms. The Ohara day, expressed as architecture.
        </P>

        <DataGrid cols={4}>
          <DataCard label="Asa · 朝" value="09:00–16:00">
            Morning. Café, tea, workshops, retail. Light food, bright wood, the first guests of
            the day.
          </DataCard>
          <DataCard label="Niwa · 庭" value="18:00–22:00 · Fri–Sun">
            Garden. Farm-to-table dinner, sixteen seats, greenhouse and wellbeing. The room the
            day has been walking toward.
          </DataCard>
          <DataCard label="Ki no Ie · 季の家" value="All day, by season">
            House of Seasons. Riverside pavilion. Craft by day, seasonal dinner by night.
          </DataCard>
          <DataCard label="Kaze no Ma · 風の間" value="By invitation">
            Room of Wind. The terrace for micro-weddings, small gatherings, and poetry. The
            breath between morning and evening.
          </DataCard>
        </DataGrid>
      </Section>

      {/* OHARA SPACES EXPANDED */}
      {/* eyebrow was: "002" */}
      <Section id="ohara" heading="Ohara spaces">
        <P>
          Ohara is an 800-person town twenty minutes from Kyoto, with a natural onsen by the
          river, an 800-year fermentation lineage, and the only endemic stand of purple shiso in
          Japan. Our property here is 90% restored, self-funded, and anchored by a
          third-generation gen garden that the grandfather started, the father continued, and the
          grandson now tends.
        </P>
        <P>
          <strong>Asa (朝) — Morning.</strong> The ground-floor room that greets the town. Coffee
          from Mudigere. Tea from Uji. Pastries from the kitchen. Retail edited to a handful of
          objects &mdash; Shigaraki cups, washi notebooks, estate honey, a shelf of books. Open
          nine to four, every day the garden is open. Workshops on the long table twice a week.
        </P>
      </Section>

      <Placeholder
        label="Asa · morning service"
        note="Counter, kettle, ceramic in rotation. Light from a single south window."
      />

      <Section heading="Niwa — the garden table.">
        <P>
          <strong>Niwa (庭) — Garden.</strong> Friday, Saturday, Sunday. Sixteen seats. A
          single-menu farm-to-table dinner led by the food lab, changing on the season, drawing
          from the greenhouse and the garden immediately outside the room. Not a restaurant. A
          forest table. Wellbeing programming &mdash; tea, breathwork, a quiet onsen walk &mdash;
          threads through the week.
        </P>
      </Section>

      <Placeholder
        label="Niwa · farm-to-table dinner"
        note="Long low table, sixteen seats, a greenhouse wall. Early evening, candlelight."
      />

      <Section heading="Ki no Ie — house of seasons.">
        <P>
          <strong>Ki no Ie (季の家) — House of Seasons.</strong> The riverside pavilion. By day,
          a craft space: washi folding, natural dye, small ceramic sessions with visiting
          Shigaraki masters. By night, a seasonal dinner &mdash; a second, more intimate
          expression of the Niwa kitchen, eight seats, only when the season earns it.
        </P>
      </Section>

      <Placeholder
        label="Ki no Ie · riverside pavilion"
        note="Timber pavilion on the water. Craft tools on the bench. Paper walls."
      />

      <Section heading="Kaze no Ma — the room of wind.">
        <P>
          <strong>Terrace / Kaze no Ma (風の間) — Room of Wind.</strong> The terrace above the
          garden. Reserved for micro-weddings, small gatherings, readings, and the occasional
          poetry evening. It is the only room on the property with no programmed hours. It waits
          for weather.
        </P>
      </Section>

      <Placeholder
        label="Kaze no Ma · terrace at dusk"
        note="Stone terrace, garden below, lanterns beginning to light. The wind in the pines."
      />

      <PullQuote attribution="Arvind">Attached but also detached.</PullQuote>

      {/* MUDIGERE */}
      {/* eyebrow was: "003" */}
      <Section id="mudigere" heading="Mudigere · The Twelve Worlds">
        <P>
          Twelve residency cabins in the canopy of the Mudigere estate. Each named for an element
          of the living system, each built with local stone, timber, and terracotta. None are
          identical. All are small.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Hive" value="Bee">
            Honey-gold wood. A reading nook with the nearest apiary in earshot.
          </DataCard>
          <DataCard label="Root" value="Below">
            Half-subterranean. Cool in summer, still in storm. The deepest sleep on the estate.
          </DataCard>
          <DataCard label="Flow" value="Water">
            On the stream bank. A private wet room. Sound of water under the floor.
          </DataCard>
          <DataCard label="Flame" value="Fire">
            Built around a kachelofen-style mass stove. Winter&apos;s cabin.
          </DataCard>
          <DataCard label="Bloom" value="Flower">
            Set in the orchard. Heaviest in February when the coffee flowers.
          </DataCard>
          <DataCard label="Canopy" value="Above">
            Treehouse footprint. Windows at the height of the hornbill route.
          </DataCard>
          <DataCard label="Echo" value="Sound">
            Acoustic room. For musicians, sound artists, and the silence they need first.
          </DataCard>
          <DataCard label="Seed" value="Origin">
            Next to the nursery. The beginner&apos;s cabin. For first residencies.
          </DataCard>
          <DataCard label="Mist" value="Air">
            Ridge-line. The monsoon arrives here first.
          </DataCard>
          <DataCard label="Stone" value="Ground">
            Laterite and granite. Heavy-bodied, long-wintered.
          </DataCard>
          <DataCard label="Pulse" value="Rhythm">
            Closest to the long house, the kitchen, the drum. The most social of the twelve.
          </DataCard>
          <DataCard label="Ethereal" value="Sky">
            The furthest, the highest, the quietest. Reserved by request.
          </DataCard>
        </DataGrid>

      </Section>

      <Placeholder
        label="A Mudigere cabin — exterior, long lens"
        note="One cabin glimpsed through the canopy, morning mist. No path visible."
      />

      {/* STUDIOS */}
      {/* eyebrow was: "004" */}
      <Section id="studios" heading="Studios">
        <P>
          Beyond the residency cabins, a small set of working studios is held for makers in
          residence. One week to one month, by application. A studio is a room with the tools
          already in it &mdash; a wheel, a loom, a bench, a kiln-share &mdash; and a window onto
          whatever the season is doing.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Clay Studio" value="Mudigere">
            Wheel, kick-wheel, shared kiln with Shigaraki partners.
          </DataCard>
          <DataCard label="Paper Studio" value="Ohara">
            Washi vat, drying boards, press. In partnership with Washi Kobo.
          </DataCard>
          <DataCard label="Dye &amp; Weave" value="Mudigere">
            Natural-dye vats, indigo, floor loom, back-strap loom.
          </DataCard>
          <DataCard label="Design Studio" value="Both">
            Desk, light, printer. For writers, designers, system thinkers.
          </DataCard>
          <DataCard label="Food Lab" value="Ohara">
            Shared with Niwa. Ferment, press, distil. Chef&apos;s table when the kitchen closes.
          </DataCard>
          <DataCard label="Sound Room" value="Mudigere">
            Treated room near Echo. For field recording and post.
          </DataCard>
        </DataGrid>
      </Section>

      {/* WELLBEING */}
      {/* eyebrow was: "005" */}
      <Section heading="Wellbeing">
        <P>
          Rhythm, not routine. The estate holds a quiet wellbeing layer &mdash; breathwork at
          dawn, tea mid-afternoon, onsen in Ohara and cold-spring plunge in Mudigere. We schedule
          <em> Rest Weeks</em> four times a year across both properties: no guests, no workshops,
          full staff down-shift. The land rests on the same calendar the people do.
        </P>

      </Section>

      <Placeholder
        label="Asa morning service — steam, hands, ceramic"
        note="Close crop. A cup being set down. Nothing posed."
      />

      {/* CRAFT PARTNERS */}
      {/* eyebrow was: "006" */}
      <Section heading="Community & craft partners">
        <P>
          Spaces without partners are sets. Ours are held up by a network of craftspeople and
          institutions we have spent years knowing.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Shigaraki Ceramics" value="Shiga">
            Five-century kiln lineage. Visiting residencies, shared kiln firings.
          </DataCard>
          <DataCard label="Uji Tea" value="Kyoto">
            Single-farm matcha and sencha for Asa. Seasonal buying with the grower.
          </DataCard>
          <DataCard label="Sanzen-in Temple" value="Ohara">
            Our neighbour. Morning practice by invitation. A calendar to learn from.
          </DataCard>
          <DataCard label="Washi Kobo" value="Kyoto">
            Handmade paper. Ki no Ie paper workshops and Ohara stationery runs.
          </DataCard>
          <DataCard label="Kyoto Craftsmen" value="Network">
            Lacquer, indigo, bamboo, textile. The guild we lean on for Ohara.
          </DataCard>
          <DataCard label="Malnad Makers" value="Karnataka">
            Weavers, potters, blacksmiths, bamboo workers. Mudigere&apos;s equivalent.
          </DataCard>
        </DataGrid>
      </Section>

      <PullStat value="12" label="worlds" sub="Mudigere residency cabins" />
      <PullStat value="4" label="Ohara spaces" sub="Asa · Niwa · Ki no Ie · Kaze no Ma" />
      <PullStat value="16" label="dinner seats" sub="Niwa, Fri–Sun only" />

      {/* SHU HA RI */}
      {/* eyebrow was: "007" */}
      <Section id="shu-ha-ri" heading="Shu · Ha · Ri">
        <P>
          The spaces are phased on the old Japanese learning frame. Preserve first, adapt second,
          transcend third. We refuse to open a room before its phase.
        </P>

        <DataGrid cols={3}>
          <DataCard label="Shu · 守" value="2025">
            <strong>Preserve.</strong> Restore the house, stabilise the gen garden, hold the
            rhythm. No new programming. Purple shiso, onsen, tea, the quiet.
          </DataCard>
          <DataCard label="Ha · 破" value="2026">
            <strong>Adapt.</strong> Open Asa full-time, begin Niwa Fri&ndash;Sun, host the first
            embedded residencies. Shigaraki and Washi Kobo residencies begin.
          </DataCard>
          <DataCard label="Ri · 離" value="2027">
            <strong>Transcend.</strong> Ki no Ie and Kaze no Ma go public. The Gathering spans
            both countries. The food lab begins publishing lots.
          </DataCard>
        </DataGrid>
      </Section>

      <Continue
        items={[
          {
            href: '/residency',
            label: 'Artist Residency',
            description: 'Who the spaces are built for.',
          },
          {
            href: '/ohara',
            label: 'Ohara',
            description: 'Asa, Niwa, Ki no Ie, Kaze no Ma &mdash; in context.',
          },
          {
            href: '/mudigere',
            label: 'Mudigere',
            description: 'The Twelve Worlds and the land beneath them.',
          },
        ]}
      />
    </>
  )
}
