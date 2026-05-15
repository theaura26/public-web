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
        Attention is a moral choice.
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
        type="Field · workers at dusk"
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

      <TwoCol id="hiring" heading="On hiring.">
        <p className="p1">
          Every person who joins Aura is measured on three dimensions:
          competence, character, and coherence with the system.
        </p>
        <p className="p2">
          Character means calm under complexity, intellectual honesty,
          stewardship instinct, consistency.
        </p>
        <p className="p2">
          Coherence means understanding that this is not a company optimising
          for quarterly returns. It is a living system optimising for centuries.
        </p>
      </TwoCol>

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

      <PullQuote attribution="Aura · Moral Spine">
        Every organisation has values on a wall. Aura has a spine.
      </PullQuote>

      <Continue currentHref="/wisdom" />
    </>
  )
}
