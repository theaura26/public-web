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
} from '@/components/article/Article'

export default function WisdomPage() {
  return (
    <>
      <HeroBanner
        currentHref="/wisdom"
        title="Moral Spine"
        type="Ritual · prayer and incense"
        caption="Attention as moral choice — Sampigelkhan Estate"
      />

      <TwoCol heading="The things we will not do.">
        <p className="p1">
          Aura is not defined by ambition. It is defined by restraint — the
          decisions we make before anyone is watching.
        </p>
        <p className="p2">
          Every organisation has values on a wall. Aura has a spine.
        </p>
      </TwoCol>

      <TwoCol heading="Attention is a moral choice.">
        <p className="p1">
          It starts with a simple idea: what enters the mind shapes what the
          hands build. Inner disorder creates outer disorder.
        </p>
        <p className="p2">
          So we begin with input hygiene — a deliberate care about what we
          consume, what we amplify, what we allow into the work. This is
          not productivity advice. It is an ethical position. Distraction
          is not neutral. It degrades the quality of everything downstream
          — decisions, designs, soil, fermentation, the taste of the cup.
        </p>
        <p className="p2">
          Before Aura became a regenerative estate system, it became a
          moral position. Every decision must survive pressure across time.
        </p>
      </TwoCol>

      <TwoCol heading="The things we refuse to become.">
        <p className="p1">
          Modern systems reward extraction. More speed. More output. More
          stimulation. More optimisation detached from consequence.
        </p>
        <p className="p2">
          The side effects become visible slowly: exhausted soil, exhausted
          attention, exhausted people.
        </p>
        <p className="p2">
          Aura begins from another premise. Restraint is intelligence.
        </p>
        <p className="p2">
          Distraction is not neutral. It degrades the quality of everything
          downstream — decisions, designs, soil, fermentation, the taste of the
          cup.
        </p>
        <p className="p2">
          Before Aura became a regenerative estate system, it became a moral
          position. Every decision must survive pressure across time.
        </p>
      </TwoCol>

      <PullQuote>
        ATTENTION is a MORAL CHOICE.
      </PullQuote>

      <TwoCol id="fourfold" heading="The fourfold self-check.">
        <p className="p1">
          Before any decision at Aura, a quiet test runs. It comes from Vedic
          observation, and it is older than management theory.
        </p>
        <p className="p2">
          The third and fourth lines are where character lives. Restraint and
          cultivation. The things no one sees. The decisions that shape the next
          thirty years of soil.
        </p>
        <DataGrid cols={2}>
          <DataCard value="What I like and is good.">Do it.</DataCard>
          <DataCard value="What I dislike and is harmful.">Avoid it.</DataCard>
          <DataCard value="What I like but is harmful.">Restrain it.</DataCard>
          <DataCard value="What I dislike but is beneficial.">Cultivate it.</DataCard>
        </DataGrid>
      </TwoCol>

      <TwoCol id="filters" heading="Seven decision filters.">
        <p className="p1">
          Every significant action — a planting decision, a brand expression, a
          partnership, a building plan — passes through seven filters before it
          moves. If any answer is no, the work does not ship.
        </p>
        <p className="p2">
          What does this train the system to become over time?
        </p>
        <DataGrid cols={2}>
          <DataCard value="Ecological.">Improve or extract?</DataCard>
          <DataCard value="Cultural.">Deepen or flatten?</DataCard>
          <DataCard value="Design.">Beautiful, quiet, durable, honest?</DataCard>
          <DataCard value="Operational.">Can the team execute simply?</DataCard>
          <DataCard value="Time.">Will it age well — five years, fifty years?</DataCard>
          <DataCard value="Integrity.">Preserves founder intent?</DataCard>
          <DataCard value="Presence.">More calm, clarity, depth?</DataCard>
        </DataGrid>
      </TwoCol>

      <Placeholder
        src="/journals/wisdom/aura-moral-spine.jpg"
        alt="Field hands gathering after work, prayer and incense lit at the estate at dusk"
        caption="The team after hours — communal."
      />

      <TwoCol id="field" heading="On the field.">
        <p className="p1">
          The spine is not abstract. It lives in six rules, written in English
          and Kannada, posted in every farm building.
        </p>
        <p className="p2">
          &ldquo;No shortcuts&rdquo; means: if something is wrong, we speak. No
          hiding mistakes. Clean work. Honest work. No complaint-blame-excuse
          culture. Absolute personal responsibility.
        </p>
        <DataGrid cols={2}>
          <DataCard value="Soil comes first." />
          <DataCard value="Do small work properly." />
          <DataCard value="No shortcuts." />
          <DataCard value="Quality before quantity." />
          <DataCard value="Think ten years ahead." />
          <DataCard value="Leaders must be on the field." />
        </DataGrid>
      </TwoCol>

      <TwoCol id="community" heading="On community.">
        <p className="p1">
          Aura is not a company you join. It is a community you are invited
          into. The shepherd, the cook, the coffee cuppers, the residents,
          the cattle, the canopy, the children who will inherit this estate
          — they are members. The work belongs to all of them.
        </p>
        <p className="p2">
          We pre-select for three dimensions: competence, character, and
          coherence. Character means calm under complexity, intellectual
          honesty, stewardship instinct, consistency. Coherence means
          understanding that this is not a company optimising for
          quarterly returns. It is a living system optimising for
          centuries.
        </p>
        <p className="p2">
          We would rather host a twenty-year-old with conviction than a
          forty-year-old name with none. We invite you to bring something
          to the table. The community will know the difference.
        </p>
      </TwoCol>

      <TwoCol id="three-intelligences" heading="Three intelligences.">
        <p className="p1">
          Natural. Human. Machine. The estate is held by all three. Each
          one is a kind of attention; each one has its own time signature.
          The discipline is to let each do what it does best.
        </p>
        <p className="p2">
          Natural intelligence is the oldest — the canopy, the herd, the
          microbial culture, the rain. Human intelligence is the carrier —
          attention, craft, restraint, judgment. Machine intelligence is
          the youngest — the sensor, the log, the model that learns the
          land&apos;s rhythm from the data we keep.
        </p>
      </TwoCol>

      <DataGrid cols={3} standalone>
        <DataCard
          img="/journals/wisdom/aura-natural-intellgience.jpg"
          alt="Canopy of the four-story polyculture at Sampigelkhan Estate — natural intelligence at work"
          value="Natural."
        >
          The oldest. The land&apos;s own rhythm — canopy, microbe, herd,
          monsoon — read across decades, not quarters.
        </DataCard>
        <DataCard
          img="/journals/wisdom/aura-human-intelligence.jpg"
          alt="Hands on a clay vessel — human craft, the attention that holds the work"
          value="Human."
        >
          The carrier. Attention as a moral choice. Craft, restraint, and
          judgment that no algorithm replaces.
        </DataCard>
        <DataCard
          img="/journals/wisdom/aura-machine-intelligence.jpg"
          alt="Field sensor on a coffee block — machine intelligence learning the estate's signal over time"
          value="Machine."
        >
          The youngest. Sensors, logs, and a Mudigere-native model that
          learns the land&apos;s signal because we keep the record.
        </DataCard>
      </DataGrid>

      <Placeholder
        src="/journals/wisdom/aura-natural-intelligence.mp4"
        mediaType="video"
        poster="/journals/wisdom/aura-natural-intellgience.jpg"
        alt="The four-story canopy breathing — the land&apos;s own intelligence at work"
        caption="Natural intelligence — the rhythm older than any model"
      />

      <Placeholder
        src="/journals/wisdom/aura-machine-intelligence.mp4"
        mediaType="video"
        poster="/journals/wisdom/aura-machine-intelligence.jpg"
        alt="A field sensor catching the day&apos;s light — the youngest intelligence learning the land&apos;s signal"
        caption="Machine intelligence — the youngest, kept close to the soil"
      />

      <ScrollHighlight>
        {`Choose depth over speed.
         Care over convenience.
         Wisdom over noise.
         Regeneration over extraction.
         Stewardship over ego.`}
      </ScrollHighlight>

      <OneCol id="standard" heading="The Aura standard.">
        <p className="p1">
          Coherence over fragmentation. Stillness over performance.
        </p>
        <p className="p2">
          We are not performing regeneration for an audience. We are practising
          it because it is the only sane way to work with land.
        </p>
      </OneCol>

      <PullQuote>
        Every organisation has VALUES on a wall. Aura has a SPINE.
      </PullQuote>

      <Continue currentHref="/wisdom" />
    </>
  )
}
