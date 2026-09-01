'use client'

import {
  HeroBanner,
  OneCol,
  TwoCol,
  PullQuote,
  DataGrid,
  DataCard,
  Placeholder,
  Portrait,
  ScrollHighlight,
  Continue,
} from '@/components/article/Article'

export default function LarderPage() {
  return (
    <>
      <HeroBanner
        title="The Larder"
        type="Detail · a solitary bee on a native herb"
        caption="What flowers under the coffee — Sampigekhan Estate, Mudigere"
        alt="A pollinator on flowering understorey at Mudigere"
      />

      <TwoCol id="premise" heading="Coffee flowers for about three days a year.">
        <p className="p1">
          Arabica is largely self-fertile, so a coffee estate can crop without much help. What
          insect pollination reliably does is improve set and evenness — and it needs a
          population of insects that are alive in the other fifty-one weeks.
        </p>
        <p className="p2">
          That population does not live on coffee. It lives on the ground layer: the native herbs,
          grasses and shrubs flowering in sequence under the canopy, at different heights and in
          different months. Whatever happens to that layer happens to the pollinators.
        </p>
        <p className="p2">
          At Aura, a good deal has been happening to it, and not by design.
        </p>
      </TwoCol>

      <TwoCol id="invasives" heading="Six plants taking the larder">
        <p className="p1">
          The Western Ghats support an extraordinary native flora. They also host a set of
          introduced plants that have made themselves at home, and six of them are established
          across this estate — in the coffee, in open ground, along forest edges and drainage
          lines.
        </p>
        <p className="p2">
          An alien plant is not automatically an invasive one. The concern begins when a species
          spreads fast, forms persistent stands, and starts changing the vegetation around it.
          These six do.
        </p>
        <DataGrid>
          <DataCard value="Lantana camara">
            A woody shrub that forms dense thickets, suppresses native herbs and seedlings, and
            interferes with tree regeneration. One of the major invasive plants in Indian
            forests.
          </DataCard>
          <DataCard value="Bidens pilosa">
            A fast herb of open and disturbed ground, seeding abundantly and crowding native
            herbs out of light and space.
          </DataCard>
          <DataCard value="Wedelia">
            A ground-cover that forms dense mats, occupying the layer where native herbs and
            seedlings would establish.
          </DataCard>
          <DataCard value="Hypoestes phyllostachya">
            The pink polka dot plant, an ornamental that establishes in moist ground. Its spread
            here is being monitored before anyone decides what to do about it.
          </DataCard>
          <DataCard value="Ageratina adenophora">
            Crofton weed. Forms dense stands in moist landscapes, and its effects reach below
            ground — documented changes to soil conditions and microbial communities, with
            allelopathic compounds suppressing neighbours.
          </DataCard>
          <DataCard value="Chromolaena odorata">
            A fast shrub that alters vegetation structure outright. Already recognised as a major
            invasive across the Western Ghats.
          </DataCard>
        </DataGrid>
      </TwoCol>

      <PullQuote>
        A flowering understorey is where the pollinators eat.
      </PullQuote>

      <TwoCol id="mechanism" heading="How a thicket empties a canopy.">
        <p className="p1">
          The six behave differently but their effects rhyme. Dense growth takes the physical
          space where native plants would establish. Tall growth takes the light that reaches
          seedlings. Between them, native regeneration slows and the composition of the
          understorey shifts.
        </p>
        <p className="p2">
          As a few fast species become dominant, native diversity falls — documented for Lantana
          and Ageratina invasions elsewhere, with substantial change to understorey composition
          and reductions in species richness. Some invasives also alter soil moisture, nutrients
          and microbial communities in ways that favour their own continuation.
        </p>
        <p className="p2">
          The end state is a site held still: instead of moving gradually toward a diverse native
          community, it stays simplified and invasive-dominated. For anything that feeds on
          flowers, that is a shorter menu, available for fewer months.
        </p>
      </TwoCol>

      <ScrollHighlight>
        {`Space.\n   Light.\n   Regeneration.\n   Diversity.\n   The ground the next generation starts in.`}
      </ScrollHighlight>

      <Placeholder
        type="Wide · cleared understorey with native regeneration"
        caption="Where invasives come out, natives go back in — an empty gap is an invitation"
      />

      <Portrait
        src="/aura-placeholder.svg"
        ratio="5 / 7"
        alt="Native flowering herbs in the understorey at Mudigere"
        caption="The layer six introduced plants are taking"
      />

      <TwoCol id="work" heading="What is being done about it.">
        <p className="p1">
          Invasive plants at Aura grow among coffee, shade trees and native regeneration, which
          rules out blanket clearing. The approach is identification, gradual removal, protection
          of what is regenerating naturally, and ecological replacement.
        </p>
        <p className="p2">
          Where invasives are taken out, native plants already present are kept. Suitable native
          herbs, grasses and shrubs are encouraged or introduced so the opened ground does not
          sit vacant — vacant ground is how a cleared site becomes an invaded site again.
        </p>
        <p className="p2">
          Because most of these species regenerate readily from seed or surviving material, this
          is treated as ongoing management rather than an operation with an end date.
        </p>
        <p className="p2">
          Two other things work in the pollinators&rsquo; favour. No synthetic pesticides go onto
          the 150 acres. And the Bug Hotels supply nesting cavities — solitary bees among the
          likely tenants — that a managed landscape tends not to provide on its own.
        </p>
      </TwoCol>

      <TwoCol id="unknown" heading="The survey is the next piece of work.">
        <p className="p1">
          Everything above is habitat work — native herbs and shrubs into the
          opened ground, no synthetic pesticide on the 150 acres, nesting
          cavities in the bug hotels — and it is what the evidence says to do
          first.
        </p>
        <p className="p2">
          A species list, a count and a season-by-season record of who visits
          what is what turns that work into a measured result, and it is the
          next thing to build. Until it exists this page describes the habitat
          rather than the response to it.
        </p>
        <p className="p2">
          What would settle it is ordinary and unglamorous: fixed transects, walked on a
          schedule, counted by someone who can tell the insects apart, repeated for long enough
          to see past a good year. Until that exists, this is the thinnest record on the estate
          and the honest thing is to say so out loud.
        </p>
      </TwoCol>

      <Continue currentHref="/pollinators" />
    </>
  )
}
