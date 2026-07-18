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
        type="Aerial · Mudigere"
        caption="Aura works on a thousand-year horizon at Mudigere and Ohara — every decision weighed against the generations who inherit it, ancestral knowledge paired with the future of science, on a return measured in centuries."
        alt="Aura — the thousand-year horizon"
      />

      <TwoCol id="horizon" heading="Aura thinks in generations.">
        <p className="p1">
          A thousand years is the horizon Aura decides against — the weight set on every plan
          before it is made. Most enterprises answer to the quarter. Aura answers to the
          generation, and the measure is plain: what can still be standing, and still be useful, in
          the year 3026.
        </p>
        <p className="p2">
          The through-line is singular. Generational impact is the method: the impact Aura wants
          now — living soil, a closed canopy, work that others can keep — is the same impact that
          has to hold three centuries out. Aura builds for then in order to matter now.
        </p>
      </TwoCol>

      <Placeholder
        type="Aerial · Mudigere"
        caption="150 acres at sunrise — coffee, pepper, forest, and pasture held as one organism"
      />

      <TwoCol id="knowledge" heading="Two kinds of knowledge, one plan.">
        <p className="p1">
          Aura works from two bodies of knowledge at once. One is ancestral — the timing a farmer
          reads in the monsoon, the rhythm of a herd, the long understanding that a thing is right
          only at the right hour. The other is the future of science — measurement, soil biology,
          the instruments that show what the older knowledge could only sense.
        </p>
        <p className="p2">
          Neither holds alone. Ancestral practice without measurement hardens into habit; science
          without the older knowledge only moves faster. Aura runs both, the old way of working and
          the new, and the pair has a name: Natural Intelligence.
        </p>
      </TwoCol>

      <TwoCol id="rta" heading="Right time, right action.">
        <p className="p1">
          The oldest instrument on the estate is timing.{' '}
          <Term tip="Right time, right action — the principle that an action is right when it sits in alignment with everything around it, not only with the clock."><Rta /></Term>{' '}
          holds that an action is right when it aligns with everything around it, not only with the
          clock. Move the herd at the right hour and the soil builds; move it at the wrong one and
          the same animals bare the ground.
        </p>
        <p className="p2">
          This is working knowledge, and the instruments now confirm it season after season. Aura
          keeps the ancestral sense of time and puts numbers to it — reading the soil, the canopy,
          and the water, and acting when the land, not the calendar, says to.
        </p>
      </TwoCol>

      <PullQuote>The long horizon is the METHOD. The rest answers to it.</PullQuote>

      <TwoCol id="measure" heading="Measured against the horizon.">
        <p className="p1">
          Nothing here is framed and forgotten. The claim gets checked — soil carbon and root depth
          at Mudigere, the canopy closing along the reserve boundary, the water table, the
          herd&apos;s effect on the ground it works. Aura measures so a thousand-year promise stays
          honest.
        </p>
        <p className="p2">
          A number answers to the frame. A campaign, a shortcut in the ferment, a fast yield — each
          collapses when held against a thousand years. What survives is plain, at Mudigere and at
          Ohara alike: plant well, build well, teach well, and stay.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`The old knowledge tells us when.
         The new science tells us why.
         Aura works on both.
         The horizon is a thousand years.`}
      </ScrollHighlight>

      <Placeholder
        type="Detail · Ohara"
        caption="The sanctuary at Ohara, outside Kyoto — the same horizon, different ground"
      />

      <DataGrid cols={3} standalone>
        <DataCard value="1,000 yr">
          The horizon Aura measures against — the frame that makes today&apos;s decision clear.
        </DataCard>
        <DataCard value="150 acres">
          Under care at Mudigere — coffee, pepper, areca, forest, and pasture, held as one organism.
        </DataCard>
        <DataCard value="3026">
          The year the work is planted for. Every plan is checked against it before it is made.
        </DataCard>
      </DataGrid>

      <OneCol id="close" heading="Generational impact.">
        <p className="p1">
          Aura works the long horizon because that is where the deepest impact is made — soil that
          compounds, a forest that closes, a practice others can keep. We pair the oldest knowledge
          we have with the newest science we trust, and we hold both to one plan. That is what
          generational impact looks like: the reason today&apos;s work is worth doing at all. Plant
          the tree whose shade you will not sit in. The rest is practice.
        </p>
      </OneCol>

      <Continue currentHref="/idea" />
    </>
  )
}
