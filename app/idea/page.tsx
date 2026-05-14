'use client'

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
  Rta,
} from '@/components/article/Article'

export default function IdeaPage() {
  return (
    <>
      <ArticleHero
        title="The 1000 Year Idea"
        subline="A standard, not a timeline. Seven decision filters. The frame by which every choice is measured."
        toc={[
          { q: 'What is the commitment?', href: '#commitment' },
          { q: 'What are the three pillars?', href: '#pillars' },
          { q: 'What filters every decision?', href: '#filters' },
          { q: 'Why a thousand years?', href: '#why' },
          { q: 'What is the moral spine?', href: '#spine' },
          { q: 'How is it measured?', href: '#measure' },
        ]}
      />

      <Section id="commitment" heading="The Commitment">
        <P>
          A thousand years is not a forecast. It is a discipline. It is the weight we place on
          every decision before it is made — the pause before we plant, the pause before we
          build, the pause before we say yes.
        </P>
        <P>
          Most enterprises are measured in quarters. Aura is measured in generations. The
          question is never what can be finished this year. The question is what can still be
          standing, still be useful, still be loved, in the year 3026.
        </P>
        <P>
          This is not nostalgia. It is not a rejection of technology or speed. It is a
          rearrangement of what comes first. Soil first. Water first. People first. The rest
          follows or is set aside.
        </P>
        <P>
          Soil does not compound quarterly. A canopy takes fifty years. A community takes
          generations. You cannot sprint a forest. The work is arranged to fit those facts, not
          to resist them.
        </P>
      </Section>

      <Placeholder
        label="Image · 150 acres at sunrise, Mudigere"
        note="Suggested: aerial shot of the plantation canopy with Western Ghats in fog behind, warm horizontal light. Landscape 16:9."
      />

      <PullQuote attribution="Arvind">
        We start from the earth and work up.
      </PullQuote>

      {/* eyebrow was: "Three Pillars" */}
      <TwoCol id="pillars" heading="Sanctuary. Agroculture. Artistry.">
        <P>
          Three structures hold the idea up. Sanctuary is the land in rhythm — stillness, method,
          the places where a life becomes legible again. Agroculture is the living economy —
          coffee, pepper, areca, the herd, fermented in the soil before it is fermented in the
          cask.
        </P>
        <P>
          Artistry is the signal sent outward — studios, residency, gurukul, labs, festivals —
          the work that argues for a different pace through the things it makes. Each pillar is
          useless without the others. Together they form an operating system.
        </P>
        <P>
          A forest is not one species. It is an ecosystem. Every layer holds the others up. Aura
          works the same way. Sanctuary, Agroculture, Artistry — each one makes the others more
          alive.
        </P>
      </TwoCol>

      <PullStat value="1,000" label="Years — the standard" sub="Not a timeline. A filter." />

      <Section id="filters" heading="Seven Decision Filters">
        <P>
          Before a project is approved, it passes through seven questions. If any one is
          answered poorly, the project is redesigned, deferred, or declined. The filters are not
          a scoring rubric. They are the minimum a decision must survive.
        </P>
        <DataGrid cols={3}>
          <DataCard label="01 — Ecological" value="Does it enrich the land?">
            Soil, water, canopy, pollinators, microbiome. A no here ends the conversation. We do
            not offset. We improve the ground we stand on.
          </DataCard>
          <DataCard label="02 — Cultural" value="Does it honour the place?">
            Mudigere is Kannada and Malnad. Ohara is Kyoto and Ōhara. The work speaks the
            language of the ground it grows on — or it is not the right work.
          </DataCard>
          <DataCard label="03 — Design" value="Will it age into beauty?">
            Materials that patina. Forms that weather. Spaces that are more interesting in their
            thirtieth year than their first. Nothing disposable.
          </DataCard>
          <DataCard label="04 — Operational" value="Can it be run by a small, skilled team?">
            No dependency on scale. No tower of complexity. If it cannot be maintained by the
            people who live here, it does not belong here.
          </DataCard>
          <DataCard label="05 — Time" value="Does it earn the slowness it asks for?">
            <Rta /> — right time, right action. A good decision at the wrong hour is still a wrong
            decision. Timing is a material.
          </DataCard>
          <DataCard label="06 — Integrity" value="Would we be proud to name every input?">
            Provenance, cherry-to-cup. Every supplier, every substrate, every line of code. If
            it cannot be traced, it cannot be trusted.
          </DataCard>
          <DataCard label="07 — Presence" value="Does it make the next hour more alive?">
            The test is the body. A room, a meal, a walk, a silence. If presence drops, the
            design is wrong, no matter how clever the idea.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote>Depth over speed. Generations over quarters.</PullQuote>

      <Section id="why" heading="Why A Thousand Years">
        <P>
          A thousand years is long enough that almost none of our assumptions survive. Languages
          change. Markets collapse and reform. Species arrive and leave. The only things that
          endure that long are living systems that regenerate themselves, and the stories a
          place tells about how to care for it.
        </P>
        <P>
          The number is a device. It makes short arguments obvious. A promotional campaign, a
          trend cycle, a shortcut in the fermentation — each of these collapses when held
          against a thousand years. What remains is simple: plant well, build well, teach well,
          and stay.
        </P>
        <P>
          The plantation already contains trees older than any business plan. The cattle descend
          from a line older than the state. The rhythm of the southwest monsoon is older than
          writing. Aura does not invent a long horizon. It inherits one, and agrees to be
          measured by it.
        </P>
        <P>
          Three thousand years ago, every civilisation on earth was documenting the relationship
          between soil and stars, moon and water, season and seed. The Vedas. The Babylonians.
          The Chinese. The Indigenous Australians across sixty thousand years. They were still.
          They were observing. They did this without a single screen. We did not lose that
          knowledge. We got distracted.
        </P>
      </Section>

      <Placeholder
        label="Image · elder Malnad Gidda cow under coffee shade"
        note="Suggested: Malnad Gidda cow at rest in dappled light beneath a mature coffee plant. Intimate, low angle, early morning."
      />

      {/* 2-col split */}
      <Section id="spine" heading="The Moral Spine">
        <P>
          A filter is only as good as the spine it rests on. Without a spine, any filter can be
          bent. The spine is the sentence we keep coming back to when the spreadsheet disagrees
          with the soil.
        </P>
        <P>
          We do not take more than the land can regenerate. We do not build faster than the
          community can absorb. We do not optimise what was meant to be lived. Every decision —
          what we plant, what we build, who we hire, what we serve, what we sell — answers to
          ecology before economics, to time before trend, to presence before performance.
        </P>
        <P>
          Technology without awareness repeats old patterns in new language. Sensors without
          wisdom are just data. Computation without conscience is just faster. The world does
          not need more intelligence. It needs more conscience.
        </P>
      </Section>

      <PullQuote attribution="Arvind">
        If we don&apos;t have a good moral spine, we will sell shit.
      </PullQuote>

      {/* 2-col split */}
      <Section id="measure" heading="The Standard, Measured">
        <P>
          The 1000 Year Idea is not a mission statement. It is a method. It is what we consult
          when the decision is hard, and what we consult when the decision is easy — because
          easy decisions made casually are how slow erosions begin.
        </P>
        <P>
          It is the standard against which the plantation, the residency, the studios, the meal,
          the silence, and the next hire are measured. It is the reason we say no more often
          than we say yes. It is the reason the work feels different when it arrives.
        </P>
        <DataGrid cols={3}>
          <DataCard label="Acres" value="150">
            Under care in Mudigere. Coffee, pepper, areca, forest, pasture — held as one organism.
          </DataCard>
          <DataCard label="Elevation" value="3,600 ft">
            Eastern slope of the Western Ghats. Cool nights. Long shade. Slow ripening.
          </DataCard>
          <DataCard label="Herd" value="52">
            Malnad Gidda — indigenous Karnataka cattle. The heart of the soil system.
          </DataCard>
          <DataCard label="Filters" value="7">
            Every proposal passes through them. None are optional.
          </DataCard>
          <DataCard label="Pillars" value="3">
            Sanctuary, Agroculture, Artistry. Each one holds the other two up.
          </DataCard>
          <DataCard label="Horizon" value="1,000 yr">
            The unit of measurement. The frame that makes the next decision clearer.
          </DataCard>
        </DataGrid>
      </Section>

      <PullQuote attribution="Arvind">
        Aura is not built, it is grown.
      </PullQuote>

      {/* 1-col center */}
      <Section heading="The Practice" align="center">
        <P>
          A child drew a dodecahedron with our help and labelled one of its twelve faces
          &ldquo;our home.&rdquo; She is six. She will be sixteen when the first residency cohorts leave
          Mudigere for good. She will be thirty-six when the forest at Aaranya has closed its
          canopy. She will be old when the teahouse in Ohara enters its second century. The
          thousand-year frame is not abstract. It is the life of the grandchildren we will never
          meet, and the grandchildren they will never meet.
        </P>
        <P>
          Begin with the ground. Work upward. Plant the tree whose shade you will not sit in.
          That is the idea. The rest is practice.
        </P>
      </Section>

      <Continue
        items={[
          {
            href: '/wisdom',
            label: 'Moral Spine',
            description: 'The sentence we return to when the spreadsheet disagrees with the soil.',
          },
          {
            href: '/rta',
            label: 'RTA',
            description: 'Right time, right action. The timing frame.',
          },
          {
            href: '/sanctuary',
            label: 'Sanctuary',
            description: 'The four valleys — Mudigere, Ōhara, Munduk, Daylesford.',
          },
        ]}
      />
    </>
  )
}
