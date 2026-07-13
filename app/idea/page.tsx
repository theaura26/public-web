'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Continue,
  ScrollHighlight,
  Rta,
  Term,
} from '@/components/article/Article'

export default function IdeaPage() {
  return (
    <>
      <HeroBanner
        currentHref="/idea"
        title="The 1000 Year Idea"
        type="Aerial landscape"
        caption="150 acres at sunrise, Mudigere — planted for the year 3026"
      />

      <OneCol heading="A face on a dodecahedron.">
        <p className="p1">
          A child drew a dodecahedron with our help and labelled one of its twelve faces
          &ldquo;our home.&rdquo; She is six. She will be sixteen when the first residency cohorts leave
          Mudigere for good. She will be thirty-six when the forest at Aaranya has closed its
          canopy. She will be old when the teahouse in Ohara enters its second century. The
          thousand-year frame is not abstract. It is the life of the grandchildren we will never
          meet, and the grandchildren they will never meet.
        </p>
      </OneCol>

      <TwoCol id="commitment" heading="The Commitment">
        <p className="p1">
          A thousand years is not a forecast. It is a discipline. It is the weight we place on
          every decision before it is made — the pause before we plant, the pause before we
          build, the pause before we say yes.
        </p>
        <p className="p2">
          Most enterprises are measured in quarters. Aura is measured in generations. The
          question is never what can be finished this year. The question is what can still be
          standing, still be useful, still be loved, in the year 3026.
        </p>
        <p className="p2">
          This is not nostalgia. It is not a rejection of technology or speed. It is a
          rearrangement of what comes first. Soil first. Water first. People first. The rest
          follows or is set aside.
        </p>
        <p className="p2">
          Soil does not compound quarterly. A canopy takes fifty years. A community takes
          generations. You cannot sprint a forest. The work is arranged to fit those facts, not
          to resist them.
        </p>
      </TwoCol>

      <Placeholder
        type="Aerial landscape"
        caption="150 acres at sunrise, Mudigere"
      />

      <Placeholder
        type="Detail · seedling"
        caption="A single tree, staked, on the day it was planted"
      />

      <PullQuote attribution="Arvind">
        We start from the EARTH and work UP.
      </PullQuote>

      <TwoCol id="aaranya" heading="Aaranya: the forest that isn't finished yet.">
        <p className="p1">
          <Term tip="अरण्य — Sanskrit for 'forest,' with a specific connotation: not wilderness, but a forest deliberately kept apart for retreat, study, and undisturbed growth.">Aaranya</Term> is
          the twenty-acre native canopy nursery on the estate&apos;s Bhadra-facing boundary —
          tens of thousands of trees, none of them planted for a harvest. Its whole purpose is to
          take a century to close, at which point it will have done its one job: extend the
          reserve&apos;s habitat instead of fencing the estate off from it.
        </p>
        <p className="p2">
          Nobody working here today will see it finished. That is not a flaw in the plan. It is
          the plan working exactly as designed.
        </p>
      </TwoCol>

      <Placeholder
        type="Aerial · nursery"
        caption="Aaranya — twenty acres of native canopy, tens of thousands of trees, none of them for harvest"
      />

      <Placeholder
        type="Detail · canopy edge"
        caption="Where Aaranya meets the Bhadra reserve boundary — no fence"
      />

      <TwoCol id="pillars" heading="Sanctuary. Agroculture. Artistry.">
        <p className="p1">
          Three structures hold the idea up. Sanctuary is the land in rhythm — stillness, method,
          the places where a life becomes legible again. Agroculture is the living economy —
          coffee, pepper, areca, the herd, fermented in the soil before it is fermented in the
          cask.
        </p>
        <p className="p2">
          Artistry is the signal sent outward — studios, residency, gurukul, labs, festivals —
          the work that argues for a different pace through the things it makes. Each pillar is
          useless without the others.
        </p>
        <p className="p2">
          A forest is not one species. It is an ecosystem. Every layer holds the others up. Aura
          works the same way. Sanctuary, Agroculture, Artistry — each one makes the others more
          alive.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`A thousand years is the unit.
         Soil is the substrate.
         Time is the test.`}
      </ScrollHighlight>

      <TwoCol id="filters" heading="Seven Decision Filters">
        <p className="p1">
          Before a project is approved, it passes through seven questions. If any one is
          answered poorly, the project is redesigned, deferred, or declined. The filters are not
          a scoring rubric. They are the minimum a decision must survive.
        </p>
        <DataGrid>
          <DataCard value="Does it enrich the land?">
            Soil, water, canopy, pollinators, microbiome. A no here ends the conversation. We do
            not offset. We improve the ground we stand on.
          </DataCard>
          <DataCard value="Does it honour the place?">
            Mudigere is Kannada and Malnad. Ohara is Kyoto and Ōhara. The work speaks the
            language of the ground it grows on — or it is not the right work.
          </DataCard>
          <DataCard value="Will it age into beauty?">
            Materials that patina. Forms that weather. Spaces that are more interesting in their
            thirtieth year than their first. Nothing disposable.
          </DataCard>
          <DataCard value="Can it be run by a small, skilled team?">
            Not can it scale — can it be kept. If it cannot be maintained by the people who live
            here, it does not belong here.
          </DataCard>
          <DataCard value="Does it earn the slowness it asks for?">
            <Rta /> — the old idea that a thing is right when it sits in alignment with all
            around it, not just with the clock. A good decision at the wrong hour is still a
            wrong decision.
          </DataCard>
          <DataCard value="Would we be proud to name every input?">
            Provenance, cherry-to-cup. We turned down a glaze supplier who wouldn&apos;t name
            their clay source — cheaper, and untraceable. If an input cannot be named, it cannot
            be trusted, however good the price.
          </DataCard>
          <DataCard value="Does it make the next hour more alive?">
            The test is the body. A room, a meal, a walk, a silence. If presence drops, the
            design is wrong, no matter how clever the idea.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>DEPTH over speed. GENERATIONS over quarters.</PullQuote>

      <TwoCol id="why" heading="Why A Thousand Years">
        <p className="p1">
          A thousand years is long enough that almost none of our assumptions survive. Languages
          change. Markets collapse and reform. Species arrive and leave. The only things that
          endure that long are living systems that regenerate themselves, and the stories a
          place tells about how to care for it.
        </p>
        <p className="p2">
          The number is a device. It makes short arguments obvious. A promotional campaign, a
          trend cycle, a shortcut in the fermentation — each of these collapses when held
          against a thousand years. What remains is simple: plant well, build well, teach well,
          and stay.
        </p>
        <p className="p2">
          The plantation already contains trees older than any business plan. The cattle descend
          from a line older than the state. The rhythm of the southwest monsoon is older than
          writing. Aura does not invent a long horizon. It inherits one, and agrees to be
          measured by it.
        </p>
        <p className="p2">
          Long before instruments, many civilisations were already documenting the relationship
          between soil and stars, moon and water, season and seed — the Vedas, Babylonian sky
          records, Chinese agricultural calendars, and, longest of all, sixty thousand years of
          Indigenous Australian land management. They were still. They were observing. They did
          this without a single screen. We did not lose that knowledge. We got distracted.
        </p>
      </TwoCol>

      <Placeholder
        type="Portrait · animal"
        caption="Elder Malnad Gidda cow under coffee shade"
      />

      <Placeholder
        type="Detail · lineage"
        caption="A calf beside its mother — the herd, one generation deep in the frame"
      />

      <TwoCol id="spine" heading="The Moral Spine">
        <p className="p1">
          A filter is only as good as the spine it rests on. Without a spine, any filter can be
          bent. The spine is the sentence we keep coming back to when the spreadsheet disagrees
          with the soil.
        </p>
        <p className="p2">
          We do not take more than the land can regenerate. We do not build faster than the
          community can absorb. We do not optimise what was meant to be lived. Every decision —
          what we plant, what we build, who we hire, what we serve, what we sell — answers to
          ecology before economics, to time before trend, to presence before performance.
        </p>
        <p className="p2">
          Technology without awareness repeats old patterns in new language. Sensors without
          wisdom are just data. Computation without conscience is just faster — which is why
          every filter above asks what a decision does to the land and the people on it before
          it asks whether the decision is even possible.
        </p>
      </TwoCol>

      <PullQuote attribution="Arvind">
        The world does not need more intelligence. It needs more conscience.
      </PullQuote>

      <TwoCol id="measure" heading="The Standard, Measured">
        <p className="p1">
          Nobody frames a mission statement. This one gets consulted — when the decision is
          hard, and, more often, when the decision looks easy, because easy decisions made
          casually are how slow erosions begin.
        </p>
        <p className="p2">
          It is the standard against which the plantation, the residency, the studios, the meal,
          the silence, and the next hire are measured. It is the reason we say no more often
          than we say yes. It is the reason the work feels different when it arrives.
        </p>
        <DataGrid>
          <DataCard value="150">
            Acres under care in Mudigere. Coffee, pepper, areca, forest, pasture — held as one organism.
          </DataCard>
          <DataCard value="3,600 ft">
            Eastern slope of the Western Ghats. Cool nights. Long shade. Slow ripening.
          </DataCard>
          <DataCard value="52">
            Malnad Gidda — indigenous Karnataka cattle. The heart of the soil system.
          </DataCard>
          <DataCard value="7">
            Filters every proposal passes through. None are optional.
          </DataCard>
          <DataCard value="3">
            Pillars — Sanctuary, Agroculture, Artistry. Each one holds the other two up.
          </DataCard>
          <DataCard value="1,000 yr">
            The horizon. The unit of measurement. The frame that makes the next decision clearer.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote attribution="Arvind">
        Aura is not BUILT, it is GROWN.
      </PullQuote>

      <OneCol heading="The Practice">
        <p className="p1">
          Begin with the ground. Work upward. Plant the tree whose shade you will not sit in.
          That is the idea. The rest is practice.
        </p>
      </OneCol>

      <Continue currentHref="/idea" />
    </>
  )
}
