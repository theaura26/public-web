import {
  ArticleHero,
  Section,
  TwoCol,
  P,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  Couplet,
  Continue,
  Chapter,
  PullStat,
} from '@/components/article/Article'

export default function OharaPage() {
  return (
    <>
      <ArticleHero
        title={<>Asa · Niwa</>}
        subline="朝 · 庭 — a sanctuary for the senses, where nature teaches us how to live."
        toc={[
          { q: 'What is the valley?', href: '#valley' },
          { q: 'Why three generations of gardener?', href: '#lineage' },
          { q: 'What is Asa?', href: '#asa' },
          { q: 'What is Niwa?', href: '#niwa' },
          { q: 'What is Ki no Ie?', href: '#ki-no-ie' },
          { q: 'What is endemic to Ohara?', href: '#endemic' },
          { q: 'How is the work phased?', href: '#phasing' },
        ]}
      />

      <Placeholder
        label="Ohara — hero landscape"
        note="Cedar-lined valley north of Kyoto at first light. Rice fields terraced into the slope, river mist rising, the silhouette of a temple roof in middle-distance."
      />

      {/* eyebrow was: "Preface" */}
      <Section heading="A valley that moves slowly.">
        <Couplet en="Morning." local="朝 — Asa." localLang="ja" />
        <Couplet en="Garden." local="庭 — Niwa." localLang="ja" />
        <Couplet en="A rich and mindful life." local="豊かな暮らし — Yutaka na Kurashi." localLang="ja" />
        <P>
          Aura is a quiet place where nature and people move together. We restore, not build —
          learning from the land before leading it. In Ohara, life flows slowly with light, water,
          and care. We did not come here to change the valley. We came here to listen.
        </P>
        <P>
          This is the frame for everything Ohara will be: <em>Yutaka na Kurashi</em> — a rich and
          mindful life. Not luxury. Not minimalism. Richness measured in depth of attention.
        </P>
        <P>
          Ohara is a town of eight hundred people, twenty minutes by road from Kyoto, with a
          natural onsen by the river and an eight-hundred-year fermentation lineage in the soil
          around it. Farmers here still work by hand. Artisans work by rhythm, not clock. Nothing
          about this place needs us to speed it up.
        </P>
      </Section>

      {/* number was: "01" */}
      <Chapter number="" title="Three Generations of Gardener" id="lineage" />

      <Section>
        <P>
          The garden at Aura Ohara is thirty years old. The house is seventy. The teahouse was
          rebuilt, timber by timber, by a Kyoto craftsman who chose every piece by hand. The
          man who tends the garden now is his grandson. The man who watched it take shape is his
          father. The man who started it is not here to see what it has become — except through
          the grandson&apos;s hands.
        </P>
        <P>
          That is the unit of care we inherited. We did not design it. We are its next
          caretakers. The garden does not belong to us and it will not, in the normal sense,
          ever belong to anyone. It belongs to the next gardener.
        </P>
        <P>
          Ninety percent of the house is already fixed. Air conditioning and heating are
          installed. The teahouse is restored. The garden is alive. The work of 2025 is the
          slow, unglamorous work of listening to what is already here before adding anything at
          all.
        </P>
      </Section>

      <PullQuote>
        The garden that listens.
      </PullQuote>

      <PullStat value="800" label="Years · fermentation lineage" sub="The region around Ohara." />

      {/* eyebrow was: "The Valley" */}
      <TwoCol id="valley" heading="Seventy years of house. Thirty years of garden.">
        <P>
          Ohara sits an hour north of Kyoto at roughly 35.2375° North — a quiet valley of cedar
          forests, rivers, and temples where farmers still work by hand and artisans still work by
          rhythm rather than clock. Aura Ohara is the restoration of a 70-year-old home with a
          30-year-old garden, centred on a teahouse rebuilt by a Kyoto craftsman whose grandson now
          cares for the garden around it.
        </P>
        <P>
          <em>Wabi-sabi</em> is the foundation — imperfection as truth. A tatami worn by knees. A
          beam that remembers an earlier roof. A garden that is never finished because it is alive.
          Nothing here is staged. Nothing has been made to look old. It simply is.
        </P>
      </TwoCol>

      <Placeholder
        label="Teahouse exterior"
        note="Restored Kyoto teahouse at the end of a mossy stone path. Wood darkened by decades. Shōji panels half-open. Autumn leaves scattered, not arranged."
        aspect="4 / 3"
      />

      {/* eyebrow was: "朝" */}
      <Section id="asa" heading="Asa — the light of morning.">
        <P>
          From nine in the morning to four in the afternoon, the valley belongs to Asa. The café
          opens. Matcha from Uji, coffee from a Kyoto roaster, light meals built from what the
          neighbouring farms delivered that morning. Workshops through the week — fermentation,
          pottery, indigo dyeing, kintsugi — taught not as classes but as conversations with the
          material.
        </P>
        <P>
          Asa is renewal. The light in Ohara at this hour is blue-grey, not gold. The café faces east
          and the river. You come for the tea. You stay for the silence between the tea.
        </P>
      </Section>

      <Placeholder
        label="Morning café scene"
        note="Interior, mid-morning: a single cup of matcha on a Shigaraki dish, a window frame of cedar-lined hills, one guest in soft focus reading. Cool blue-grey light."
        aspect="4 / 3"
      />

      {/* eyebrow was: "庭" */}
      <Section id="niwa" heading="Niwa — the garden that listens.">
        <P>
          At sundown the valley turns into Niwa. Sixteen seats, three nights a week — Friday through
          Sunday — farm-to-table dinner built on Ohara organic produce, Kyoto <em>obanzai</em> roots,
          local sake and tea pairings. Beside the dining room, a small greenhouse holds herbs and
          starters for the coming weeks. The dinner is not a performance. It is a conversation
          between what the soil offered and what the fire could do with it.
        </P>
        <P>
          Wellbeing sits alongside the table — breath by the river, forest walks before service,
          mindful tea, fermentation circles. Rest weeks are held for artists and founders who need
          the valley to lower their pulse.
        </P>
      </Section>

      <Placeholder
        label="Greenhouse interior"
        note="Glass-walled greenhouse, late afternoon: young shiso, mustard greens, cold-frame tomatoes. Condensation on glass. A single watering can, used."
        aspect="4 / 3"
      />
      <Placeholder
        label="Dinner service"
        note="Overhead plate: a single course at the 16-seat counter. Ceramic from Shigaraki. Candle-light only. No menu card, no garnish as decoration."
        aspect="4 / 3"
      />

      {/* eyebrow was: "季の家" */}
      <TwoCol id="ki-no-ie" heading="Ki no Ie — the House of Seasons.">
        <P>
          A transparent riverside pavilion of reclaimed cedar, surrounded by vines and herbs. Light
          and air in motion. By day, Ki no Ie is a craft and fermentation workshop — miso, shoyu,
          indigo vats, wheel-thrown bowls. By night, it becomes a seasonal dining room for no more
          than twelve. The river is the soundtrack. The season writes the menu.
        </P>
      </TwoCol>

      <Placeholder
        label="Riverside pavilion"
        note="Ki no Ie at blue hour: cedar structure reflected in the river, paper lanterns just lit, vines climbing the south wall. A single figure inside, small in the frame."
        aspect="4 / 3"
      />

      {/* eyebrow was: "風の間" */}
      <Section heading="Terrace · Kaze no Ma — the room of wind.">
        <P>
          The terrace is the breath between morning and evening. It is where Asa becomes Niwa and
          where Ohara becomes Ohara. Micro-weddings for a dozen guests. Family gatherings. Poetry
          nights. A small retail space of living objects from Ohara artisans — ceramics, linen, wood,
          incense, teas, each piece carrying a maker&apos;s name and a season.
        </P>
      </Section>

      <PullQuote>
        The valley teaches us how to live.
      </PullQuote>

      {/* eyebrow was: "紫蘇" */}
      <Section id="endemic" heading="What grows only here.">
        <P>
          Purple shiso — <em>murasaki shiso</em> — is endemic to Ohara. It grows nowhere else in
          Japan. For eight hundred years the fermenters of this valley have folded it into
          umeboshi, pickles, and the small bright condiments that define an obanzai meal. It is
          the valley&apos;s signature, written into the food before anyone had a brand.
        </P>
        <P>
          Aura Ohara does not import shiso from elsewhere. It grows beside the greenhouse and it
          travels as far as the kitchen, the fermentation counter at Ki no Ie, and the table.
          When a course comes out purple, the purple is Ohara. It has not left the valley.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Population" value="800">
            The town of Ohara. Small enough to know by hand. Large enough to feed a valley.
          </DataCard>
          <DataCard label="From Kyoto" value="20 min">
            By road. Close enough for a café. Far enough for silence.
          </DataCard>
          <DataCard label="Onsen" value="By the river">
            Natural hot spring. A ten-minute walk from the terrace.
          </DataCard>
        </DataGrid>
        <P>
          The food lab and chef&apos;s table are the next layer. Two-week residencies through
          the year for artists, founders, and cooks willing to slow down long enough that the
          meal at the end means something the rush would not have allowed.
        </P>
      </Section>

      {/* eyebrow was: "豊かな暮らし" */}
      <Section heading="Yutaka na Kurashi — a rich and mindful life.">
        <P>
          Asa is the light. Niwa is the calm. Kaze no Ma is the breath between them. Together they
          form the rhythm of Ohara — a place not to visit, but to return to. Over time, the valley
          stops being a destination and becomes a way of pacing a year.
        </P>
      </Section>

      {/* eyebrow was: "Community & Craft" */}
      <Section heading="The hands around us.">
        <P>
          Aura Ohara does not make things it can ask neighbours to make better. The network carries
          the work: Ohara organic farmers for the kitchen; Uji and Izumo tea growers for the café;
          Shigaraki potters for the vessels; Kyoto fermenters for miso, shoyu, and tsukemono; the
          Sanzen-in textile atelier for linen; an Ohara wood workshop for carpentry; the Ohara Washi
          Kobo for paper.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Tea" value="Uji · Izumo">
            Matcha, sencha, and hojicha from two of Japan&apos;s oldest tea valleys.
          </DataCard>
          <DataCard label="Ceramics" value="Shigaraki">
            Stoneware from the potters of Shiga — the vessels that hold the meal.
          </DataCard>
          <DataCard label="Paper" value="Ohara Washi Kobo">
            Handmade washi — menus, lanterns, letters, and the wall of Ki no Ie.
          </DataCard>
        </DataGrid>
      </Section>

      {/* eyebrow was: "守 · 破 · 離" */}
      <Section id="phasing" heading="Shu · Ha · Ri — phasing 2025–2027.">
        <DataGrid cols={3}>
          <DataCard label="2025 · Shu · Preserve">
            Restore the teahouse and the 30-year garden. Build the network.
          </DataCard>
          <DataCard label="2026 · Ha · Adapt">
            Open Asa and Niwa. Launch events, workshops, and the 16-seat counter.
          </DataCard>
          <DataCard label="2027 · Ri · Integrate">
            Full ecosystem active. <em>Kurashi</em> Week — the valley&apos;s annual gathering.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote>
        A place not to visit, but to return to.
      </PullQuote>

      <Continue
        items={[
          { href: '/spaces', label: 'Spaces & Studios', description: 'The teahouse, the greenhouse, Ki no Ie, and Kaze no Ma.' },
          { href: '/residency', label: 'Residency', description: 'Rest Weeks and long-form stays for artists and founders.' },
          { href: '/sanctuary', label: 'Sanctuary', description: 'Return to the four valleys and the common rhythm.' },
        ]}
      />
    </>
  )
}
