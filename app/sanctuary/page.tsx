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

export default function SanctuaryPage() {
  return (
    <>
      <HeroBanner
        currentHref="/sanctuary"
        title="Sanctuary"
        src="/aura-sanctuary.mp4"
        mediaType="video"
        poster="/aura-sanctuary.jpg"
        caption="A network of valleys — two in practice, two more in listening"
        alt="Aura Sanctuary — the four-valley sanctuary network"
      />

      <TwoCol id="posture" heading="A sanctuary is a posture, not a property.">
        <p className="p1">
          A sanctuary is not a place you go. It is a posture a place takes. It is what happens
          when a piece of land is tended long enough that it begins to tend the people who stand
          on it. The two we already run have a journal of their own — the geographies, the
          coordinates, the year counts on the buildings — and that journal is{' '}
          <em>The Land</em>. This one is about what the network does.
        </p>
        <p className="p1">
          The Aura sanctuary system is four valleys in two hemispheres, held in one rhythm. Two
          are in practice. Two are in the patient early conversations of being read. None of them
          are destinations. All four are postures.
        </p>
      </TwoCol>

      <Placeholder
        type="Aerial · two hemispheres"
        caption="The four-valley map — Mudigere, Ohara, Munduk, Daylesford"
      />

      <Placeholder
        type="Detail · four soils"
        caption="Laterite, moss, volcanic basalt, granite — one from each valley, side by side"
      />

      <PullQuote>
        Humans are not owners here — only guests of the mountain.
      </PullQuote>

      <TwoCol id="rhythm" heading="One rhythm, four climates.">
        <p className="p1">
          A network of sanctuaries is only useful if a rhythm passes between them. Aura&apos;s
          rhythm is the seasons doing the scheduling. When Mudigere is closed by monsoon, Ohara is
          turning through its own four seasons undisturbed. When Ohara is buried in snow, Munduk
          is in its dry-side window. Daylesford balances the southern hemisphere against the rest.
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
          Not the crops, not the climate, not even the language. What moves from Mudigere to
          Ohara — and will move to Munduk and Daylesford when they&apos;re ready — is a small set
          of working habits, tested wherever they&apos;ve been tried and kept because they held.
        </p>
        <DataGrid cols={3}>
          <DataCard value="Observe first">
            One full season of watching before any structure goes in. No exceptions, no matter
            how obvious the answer looks on day one.
          </DataCard>
          <DataCard value="The animal pays its way">
            Every valley keeps a herd sized to the land, not the ambition — the five-product
            economy of the cow, or its local equivalent, doing real work in the loop.
          </DataCard>
          <DataCard value="Lineage over import">
            Local craft, local cultivar, local calendar. A practice imported wholesale from
            another valley is a decoration, not a discipline.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        type="Detail · shared practice"
        caption="The same observation posture, four different soils"
      />

      <Placeholder
        type="Portrait · the herd"
        caption="A herd sized to the land, not the ambition — one valley's version of the five-product economy"
      />

      <TwoCol id="two-listening" heading="The two in listening.">
        <p className="p1">
          A sanctuary cannot be willed into existence. It has to be earned, twice — once from the
          people of the valley, and once from the valley itself. Neither new site has a built
          structure yet, and neither page pretends otherwise: what follows is what we know from
          listening, not what we&apos;ve built.
        </p>
        <p className="p1">
          <strong>Munduk</strong> sits in the volcanic highlands of north Bali, where a sacred
          lake half a ridge from the working one has banned motorboats for longer than anyone
          can date. It is where Aura&apos;s Indian soil philosophy meets a community that already
          drew its own line between use and reverence — before Aura had a name.
        </p>
        <p className="p1">
          <strong>Daylesford</strong>, in Victoria, Australia, is Aura&apos;s southern
          counterweight — the only valley in the network with a real winter. Its mineral springs
          have been rising through 450-million-year-old rock since long before the town that
          protects them existed to notice.
        </p>
      </TwoCol>

      <Placeholder
        type="Landscape · volcanic"
        caption="Munduk — volcanic highlands of north Bali, ~1,200 m, cloud forest and terraces"
      />

      <Placeholder
        type="Landscape · southern hemisphere"
        caption="Daylesford — old volcanic lakes and pasture in Victoria, Australia"
      />

      <TwoCol id="why-network" heading="Why a network at all.">
        <p className="p1">
          One sanctuary is a project. Two is a comparison. Four is a system. The reason to grow
          the network past two is not scale — it is correction. A practice run only in one
          climate, on one soil, with one lineage of people, slowly persuades itself it is the
          practice. Two climates check each other. Four make the practice harder to confuse with
          its setting.
        </p>
        <p className="p1">
          A valley enters Aura when the land says yes and the lineage says yes — not before.
          There is no roadmap past Daylesford. There is a posture, repeated across climates,
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
          studios, the gatherings — earns its place by surviving the first season&apos;s
          observation. Most ideas do not. The ones that do get to put down a first stone.
        </p>
      </OneCol>

      <Continue currentHref="/sanctuary" />
    </>
  )
}
