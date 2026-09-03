import {
  HeroBanner,
  TwoCol,
  OneCol,
  Placeholder,
  DataGrid,
  DataCard,
  PullQuote,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'
import { linkImage, nextActiveJournals } from '@/lib/journals'

export default function SanctuaryPage() {
  return (
    <>
      <HeroBanner
        currentHref="/regenerative-life/sanctuary-and-stay"
        title="Sanctuary"
        src="/regenerative-life/sanctuary-and-stay/images/santuary-hero-banner.webp"
        caption="A network of valleys — two in practice, two more in listening"
        alt="Someone sitting at the rail of a deck above a valley filling with cloud"
      />

      <TwoCol id="posture" heading="A sanctuary is a posture a place takes.">
        <p className="p1">
          It is what happens when a piece of land is tended long enough that it begins to tend the
          people who stand on it. The two we already run have a journal of their own — the
          geographies, the coordinates, the year counts on the buildings — and that journal is{' '}
          <em>The Land</em>. This one is about what the network does.
        </p>
        <p className="p1">
          The Aura sanctuary system is four valleys in two hemispheres, held in one rhythm. Two
          are in practice. Two are in the early conversations of being read. None of them are
          destinations. All four are postures.
        </p>
      </TwoCol>

      <Placeholder
        src="/regenerative-life/sanctuary-and-stay/images/santuary-1.webp"
        alt="Two people planting a sapling into red earth, seen from above, with the estate dogs alongside"
        caption="The day the estate was going to have anyway"
      />

      <PullQuote>
        Humans are not owners here — only guests of the mountain.
      </PullQuote>

      <TwoCol id="rhythm" heading="One rhythm, four climates.">
        <p className="p1">
          A network of sanctuaries is only useful if a rhythm passes between them. Aura&rsquo;s
          rhythm is the seasons doing the scheduling. When Mudigere is closed by monsoon, Ohara is
          turning through its own four seasons undisturbed. When Ohara is buried in snow, Munduk
          is in its dry-side window.
        </p>
        <p className="p1">
          The same posture moves with the rhythm — the same insistence on observation before
          intervention, the same five-product economy of the cow, the same refusal to do anything
          on a quarterly schedule. The valleys differ in climate. They are identical in stance.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Four valleys.
         One rhythm.
         The land tends the people who tend the land.`}
      </ScrollHighlight>

      <TwoCol id="two-live" heading="The two in practice.">
        <p className="p1">
          The first two valleys are doing the early work. They share the operating system but not
          the temperament. One is the body of patience. The other is the calm of reflection. We
          need both, and we have written about each in their own journals.
        </p>
        <DataGrid cols={2}>
          <DataCard value="The body of patience">
            The Indian valley. Scale, monsoon, cosmological time. Where the herd, the canopy, and
            the kitchen do the work the rest of the system rides on. Detail and geography in{' '}
            <em>The Land</em>.
          </DataCard>
          <DataCard value="The calm of reflection">
            The Japanese valley. Restraint, millimetric care, lineage carried by craftsmen and
            their grandsons. Detail and geography in <em>The Land</em>.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Arvind">
        India gave me the ground. Japan gave me the stillness. Together they became something
        neither could be alone.
      </PullQuote>

      <TwoCol id="shared" heading="What actually travels between them.">
        <p className="p1">
          The crops differ, the climate differs, the language differs. What moves from Mudigere to
          Ohara — and will move to Munduk and Punakha when they&rsquo;re ready — is a small set
          of working habits, tested wherever they&rsquo;ve been tried and kept because they held.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Observe first">
            One full season of watching before any structure goes in. No exceptions, no matter
            how obvious the answer looks on day one.
          </DataCard>
          <DataCard value="The animal pays its way">
            Every valley keeps a herd the land can carry — the five-product
            economy of the cow, or its local equivalent, doing real work in the loop.
          </DataCard>
          <DataCard value="Lineage over import">
            Local craft, local cultivar, local calendar. A practice earns its place in a valley by
            being tested there first.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        src="/regenerative-life/sanctuary-and-stay/videos/santuary-2.mp4"
        mediaType="video"
        poster="/regenerative-life/sanctuary-and-stay/images/santuary-2.webp"
        alt="Cloud lying in the valley over terraces and forest"
        caption="The four-valley map — Mudigere, Ohara, Munduk, Punakha"
      />

      <TwoCol id="two-listening" heading="The two in listening.">
        <p className="p1">
          A sanctuary cannot be willed into existence. It has to be earned, twice — once from the
          people of the valley, and once from the valley itself. Neither new site has a built
          structure yet, and neither page pretends otherwise: what follows is what we know from
          listening, not what we&rsquo;ve built.
        </p>
        <p className="p1">
          <strong>Munduk</strong>{' '}sits in the volcanic highlands of north Bali, where a sacred
          lake half a ridge from the working one has banned motorboats for longer than anyone
          can date. It is where Aura&rsquo;s Indian soil philosophy meets a community that already
          drew its own line between use and reverence — before Aura had a name.
        </p>
        <p className="p1">
          <strong>Punakha</strong>, in western Bhutan, sits where the Pho Chhu and Mo Chhu
          meet — the father and mother rivers, running down from snow into subtropical forest.
          It is a valley where mindfulness is the ordinary shape of a day, where craft and ritual
          stay attached to cultivation, and where forest cover is held by constitution. The things
          Aura argues for elsewhere are already how life is arranged here.
        </p>
      </TwoCol>

      <Placeholder
        src="/regenerative-life/sanctuary-and-stay/images/santuary-3.webp"
        alt="A covered deck open on three sides, mist standing in it"
        caption="Morning at Mudigere, with nothing on the calendar"
      />

      <TwoCol id="why-network" heading="Why a network at all.">
        <p className="p1">
          One sanctuary is a project. Two is a comparison. Four is a system. The reason to grow
          the network past two is correction. A practice run only in one
          climate, on one soil, with one lineage of people, slowly persuades itself it is the
          practice. Two climates check each other. Four make the practice harder to confuse with
          its setting.
        </p>
        <p className="p1">
          A valley enters Aura when the land says yes and the lineage says yes — not before.
          There is no roadmap past Punakha. There is a posture, repeated across climates,
          until the land tells us where it would like to be tended next.
        </p>
      </TwoCol>

      <PullQuote>
        We start from the earth and work up.
      </PullQuote>

      <OneCol heading="The first season in any new valley.">
        <p className="p1">
          A thousand-year practice does not move in quarters. It moves in seasons. The first
          season in any new valley is the one where we put nothing in. We watch. The compost
          piles wait. The herd waits. The kiln waits. We learn the water before we ask anything
          of it.
        </p>
        <p className="p1">
          That is the only entry rite. Everything that follows — the cabins, the kitchen, the
          studios, the gatherings — earns its place by surviving the first season&rsquo;s
          observation. Most ideas do not. The ones that do get to put down a first stone.
        </p>
      </OneCol>

      {/* ── Hospitality ────────────────────────────────────────────
          The Hospitality pillar had a page of its own at
          /reason/hospitality. It said what a sanctuary is like to stay
          in, which is the half this page was missing — it described the
          posture and the network but never the room. Moved here whole
          when the pillar pages came down. */}

      <TwoCol id="stay" heading="Places that hold the right kind of attention.">
        <p className="p1">
          Aura builds and runs sanctuaries. Two are open: Aura Estate at Mudigere, a working
          coffee farm in the Western Ghats, and Asa. Niwa. at Ohara, an hour north of Kyoto.
        </p>
        <p className="p1">
          The work is the room and everything under it — architecture, kitchen, the residency
          programme, and the operations that keep all three running for decades. The soil under
          the building is part of the brief.
        </p>
      </TwoCol>

      <Placeholder
        src="/regenerative-life/sanctuary-and-stay/videos/santuary-4.mp4"
        mediaType="video"
        poster="/regenerative-life/sanctuary-and-stay/images/santuary-4.webp"
        alt="Seed pods hanging against a deep blue sky"
        caption="The same posture, whichever valley it is standing in"
      />

      <TwoCol id="working-day" heading="The working day, as it happens.">
        <p className="p1">
          What a guest gets is the day the estate was going to have anyway. The barrels being
          stirred at dawn, the herd going out, the lamp lit at the Gau Angan before anyone
          starts.
        </p>
        <p className="p1">
          The room sits in the middle of a farm that would be doing all of this whether or not
          anybody had come to watch — which is the only reason watching it is worth anything.
        </p>
      </TwoCol>

      <TwoCol id="festival" heading="Three days, twenty places.">
        <p className="p1">
          Three times a year the estate opens properly, for the festival. Three days, twenty
          places, and a guest leaves having set the protocol for a lot of coffee that is then
          built and shipped under their own name.
        </p>
        <p className="p1">
          The residency runs alongside it — invited, embedded, for people making work that needs
          a place like this to be made in.{' '}
          <a href="/residency" target="_blank" rel="noopener noreferrer">Monastic Polymaths</a>{' '}
          is the fuller account.
        </p>
      </TwoCol>

      <OneCol heading="Two open, two named.">
        <p className="p1">
          Munduk in Bali and Punakha in Bhutan are named and not built. Dates, rooms and rates
          arrive when they are settled, and no occupancy, rates or guest numbers are published
          until there is something to publish.
        </p>
      </OneCol>

      <PullQuote>
        Morning mist. Nothing on the calendar. A cup of coffee that grew within sight of where
        you slept.
      </PullQuote>

      {/* The two named sanctuaries lead the row. The chapter argues for
          four valleys, so the two that exist are the links most worth
          taking; they were a line of bare text links under a "Go deeper"
          heading, which is the one place on the page that closed on words
          rather than pictures. */}
      <Continue
        heading="Continue reading"
        items={[
          { href: '/mudigere', label: 'Mudigere', img: linkImage('/mudigere') },
          { href: '/ohara', label: 'Ohara', img: linkImage('/ohara') },
          ...nextActiveJournals('/regenerative-life/sanctuary-and-stay', 1)
            .map((j) => ({ href: j.href, label: j.title, img: j.img })),
        ]}
      />
    </>
  )
}
